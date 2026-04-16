// ─────────────────────────────────────────────────────────────────────────────
//  AGENTE 2 — ATLAS · Document Intelligence
//  Procesa archivos Excel / CSV / TXT / JSON con IA local (sin API externa)
// ─────────────────────────────────────────────────────────────────────────────

import * as XLSX from "xlsx";
import { analyzeDocument, quickLocalSummary } from "./localAI";
import { agentBus } from "./agentBus";

const MAX_CHARS = 12000;

// ── Extractores de contenido ──────────────────────────────────────────────────

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
          const rows = data.slice(0, 80);
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
    reader.onerror = () => reject(new Error("Error leyendo archivo"));
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
      try {
        return { content: await extractText(file), type: "Texto genérico" };
      } catch {
        throw new Error(`Formato no soportado: .${ext}. Use .xlsx, .csv, .txt o .json`);
      }
  }
}

// ── API pública ───────────────────────────────────────────────────────────────

export async function processDocument(file, onProgress) {
  onProgress?.("Extrayendo contenido del archivo…");

  const { content, type } = await extractContent(file);

  if (!content.trim()) throw new Error("El archivo está vacío o no tiene datos legibles.");

  onProgress?.(`Archivo ${type} leído (${content.length} caracteres). Analizando con motor local…`);

  // Notificar al bus que se está procesando un documento
  agentBus.emit("document:processing", { fileName: file.name, fileType: type });

  onProgress?.("Motor de IA local procesando…");

  const analysis = await analyzeDocument(content, file.name, type);

  onProgress?.("Análisis completado.");

  const result = {
    fileName:    file.name,
    fileType:    type,
    fileSize:    file.size,
    charCount:   content.length,
    analysis,
    processedAt: new Date(),
  };

  // Notificar al bus que el análisis está listo
  agentBus.emit("document:done", result);

  return result;
}

export async function quickSummary(text, fileName = "fragmento") {
  const truncated = text.slice(0, MAX_CHARS);
  return quickLocalSummary(truncated, fileName);
}
