// ─────────────────────────────────────────────────────────────────────────────
//  AGENTE 3 — NOVA · Customer Service Intelligence
//  Motor: Chrome Gemini Nano → Ollama → NLP local | Internet: Wikipedia API
// ─────────────────────────────────────────────────────────────────────────────

import { initEngine, sendSmartMessage, getEngineStatus, searchInternet } from "./smartChatEngine";
import { agentBus } from "./agentBus";

// Estado interno del contexto de mercado (se actualiza vía bus)
let _marketContext = null;
let _engineReady   = false;

// Escuchar insights del agente ORION para enriquecer respuestas
agentBus.on("market:insight", (insight) => {
  _marketContext = insight;
});

// Inicializar engine al cargar el módulo
initEngine().then(() => {
  _engineReady = true;
  console.log("[NOVA] Engine listo:", getEngineStatus());
});

// Exportar estado del engine para la UI
export { getEngineStatus };

/**
 * sendMessage — envía un mensaje y obtiene respuesta inteligente de NOVA
 * @param {Array}  history     Historial de mensajes
 * @param {string} message     Mensaje del usuario
 * @param {object} marketData  Datos de ventas de ORION {purchases, stats}
 */
export async function sendMessage(history, message, marketData = null) {
  // Esperar a que el engine esté listo (max 5s)
  if (!_engineReady) {
    let waited = 0;
    while (!_engineReady && waited < 5000) {
      await new Promise(r => setTimeout(r, 200));
      waited += 200;
    }
  }

  const result = await sendSmartMessage(history, message, marketData);

  // Emitir al bus
  agentBus.emit("customer:message", {
    userMessage: message,
    botResponse: result.text,
    engine:      result.engine,
    timestamp:   new Date(),
  });

  return result;
}

export function getWelcomeMessage() {
  return "Sistema activo. Soy **NOVA**, asistente de inteligencia financiera del Dashboard de **The Space Shop — Kennedy Space Center**.\n\nConectada a thespaceshop.com con datos reales del catálogo. Activa el agente **ORION** para monitoreo de ventas en tiempo real.\n\n¿Qué métricas o datos necesitas analizar?";
}

export function getSuggestedQuestions() {
  return [
    "¿Cómo estuvieron las últimas ventas?",
    "¿Cuál es el precio promedio del catálogo?",
    "¿Cuántos productos hay en sale activos?",
    "¿Qué categoría genera más ingresos?",
    "¿Cuáles son las marcas premium disponibles?",
    "¿Cuál es el ticket promedio registrado?",
  ];
}
