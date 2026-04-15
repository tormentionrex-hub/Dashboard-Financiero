// ─────────────────────────────────────────────────────────────────────────────
//  AGENTE 2 — Document Intelligence
//  Procesa archivos Excel / CSV / TXT / JSON y los resume con IA (Gemini)
// ─────────────────────────────────────────────────────────────────────────────

import * as XLSX from "xlsx";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const MAX_CHARS = 12000; // límite de texto enviado a Gemini

// ── Gemini helper ─────────────────────────────────────────────────────────────
async function callGemini(prompt) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 1200, temperature: 0.3 }
    })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Error Gemini");
  }
  const data = await res.json();
  return data.candidates[0].content.parts[0].text.trim();
}

// ── Extractores de contenido por tipo ────────────────────────────────────────

function extractExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: "array" });
        const sheets   = [];

        workbook.SheetNames.forEach(name => {
          const ws   = workbook.Sheets[name];
          const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
          const rows = data.slice(0, 80); // máx 80 filas por hoja
          const text = rows.map(r => r.join(" | ")).join("\n");
          sheets.push(`[Hoja: ${name}]\n${text}`);
        });

        resolve(sheets.join("\n\n").slice(0, MAX_CHARS));
      } catch (err) {
        reject(new Error("No se pudo leer el archivo Excel: " + err.message));
      }
    };
    reader.onerror = () => reject(new Error("Error al leer el archivo"));
    reader.readAsArrayBuffer(file);
  });
}

function extractCSV(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = (e) => resolve(e.target.result.slice(0, MAX_CHARS));
    reader.onerror = () => reject(new Error("Error leyendo CSV"));
    reader.readAsText(file, "UTF-8");
  });
}

function extractText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = (e) => resolve(e.target.result.slice(0, MAX_CHARS));
    reader.onerror = () => reject(new Error("Error leyendo archivo de texto"));
    reader.readAsText(file, "UTF-8");
  });
}

function extractJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        resolve(JSON.stringify(parsed, null, 2).slice(0, MAX_CHARS));
      } catch {
        reject(new Error("JSON inválido"));
      }
    };
    reader.onerror = () => reject(new Error("Error leyendo JSON"));
    reader.readAsText(file, "UTF-8");
  });
}

// ── Extractor unificado ───────────────────────────────────────────────────────
async function extractContent(file) {
  const ext = file.name.split(".").pop().toLowerCase();

  switch (ext) {
    case "xlsx":
    case "xls":
      return { content: await extractExcel(file), type: "Excel" };
    case "csv":
      return { content: await extractCSV(file),   type: "CSV"   };
    case "txt":
      return { content: await extractText(file),  type: "Texto" };
    case "json":
      return { content: await extractJSON(file),  type: "JSON"  };
    default:
      // Intento genérico como texto
      try {
        const content = await extractText(file);
        return { content, type: "Texto genérico" };
      } catch {
        throw new Error(`Formato no soportado: .${ext}. Use .xlsx, .csv, .txt o .json`);
      }
  }
}

// ── API pública ───────────────────────────────────────────────────────────────

/**
 * processDocument — extrae contenido del archivo y lo analiza con IA
 * @param {File}                     file        Archivo subido por el usuario
 * @param {(phase: string) => void}  onProgress  Callback de progreso
 * @returns {Promise<DocumentResult>}
 */
export async function processDocument(file, onProgress) {
  onProgress?.("Extrayendo contenido del archivo…");

  const { content, type } = await extractContent(file);

  if (!content.trim()) throw new Error("El archivo está vacío o no tiene datos legibles.");

  onProgress?.(`Archivo ${type} leído (${content.length} caracteres). Enviando a IA…`);

  const prompt = `Eres un analista financiero y de datos de élite. Se te entrega el contenido de un archivo ${type} llamado "${file.name}".

CONTENIDO:
${content}

Analiza el documento y genera un reporte estructurado en español con estas secciones exactas:

## RESUMEN EJECUTIVO
(2-3 oraciones que describan el documento y su propósito)

## DATOS CLAVE DETECTADOS
(Lista de los 5-8 hallazgos más importantes, con valores numéricos si aplica)

## ANÁLISIS FINANCIERO
(Tendencias, totales, promedios, comparativas si hay datos suficientes)

## ANOMALÍAS O PUNTOS DE ATENCIÓN
(Datos atípicos, inconsistencias o valores que requieren revisión)

## RECOMENDACIONES
(3-5 acciones concretas basadas en el análisis)

Sé preciso. Si hay tablas numéricas, calcula totales y promedios. Máx 600 palabras.`;

  onProgress?.("IA procesando el documento…");
  const analysis = await callGemini(prompt);

  onProgress?.("Análisis completado.");

  return {
    fileName:    file.name,
    fileType:    type,
    fileSize:    file.size,
    charCount:   content.length,
    analysis,
    processedAt: new Date(),
  };
}

/**
 * quickSummary — resumen ultra-rápido de una pieza de texto plano
 * (útil para drag-and-drop de texto o fragmentos pequeños)
 */
export async function quickSummary(text, fileName = "fragmento") {
  const truncated = text.slice(0, MAX_CHARS);
  const prompt = `Resume en máximo 150 palabras en español el siguiente contenido de "${fileName}":

${truncated}

Da el resumen en formato de puntos clave (bullet points). Sé conciso.`;
  return callGemini(prompt);
}
