// Usa Gemini Flash — modelo gratuito de Google
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function generarAnalisisEjecutivo(empresa, periodo, kpis, datos) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const resumenMensual = datos
    .map(d => `${d.mes}: Ingresos $${d.ingresos.toLocaleString()} | Costos $${d.costos.toLocaleString()} | Gastos $${d.gastos.toLocaleString()}`)
    .join("\n");

  const prompt = `Eres un analista financiero senior. Analiza los datos de "${empresa}" (${periodo}).

KPIs calculados:
- Margen Bruto: ${kpis.margenBruto.toFixed(1)}%
- ROI: ${kpis.roi.toFixed(1)}%
- Punto de Equilibrio: $${Math.round(kpis.puntoEquilibrio).toLocaleString()}
- Total Ingresos: $${kpis.totalIngresos.toLocaleString()}
- Total Costos: $${kpis.totalCostos.toLocaleString()}

Datos mensuales:
${resumenMensual}

Responde en español con estas 4 secciones exactas:
1. RESUMEN EJECUTIVO
2. ANÁLISIS DE INDICADORES
3. ANOMALÍAS DETECTADAS
4. RECOMENDACIONES`;

  const respuesta = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 1024 }
    })
  });

  if (!respuesta.ok) {
    const err = await respuesta.json();
    throw new Error(err.error?.message || "Error al llamar a Gemini");
  }

  const data = await respuesta.json();
  return data.candidates[0].content.parts[0].text;
}
