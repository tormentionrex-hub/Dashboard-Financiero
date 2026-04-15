// ─────────────────────────────────────────────────────────────────────────────
//  AGENTE 3 — Customer Service Intelligence
//  Chatbot de servicio al cliente con contexto de The Space Shop
// ─────────────────────────────────────────────────────────────────────────────

import { SPACE_SHOP_PRODUCTS, CATEGORIES } from "../../data/spaceShopData";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// ── Contexto del sistema ──────────────────────────────────────────────────────
const SYSTEM_CONTEXT = `Eres NOVA, la asistente de inteligencia artificial de The Space Shop — la tienda líder en productos espaciales, astronómicos y de exploración. Tu carácter: profesional pero cálido, apasionado por el espacio, orientado a datos.

CATÁLOGO DISPONIBLE (${SPACE_SHOP_PRODUCTS.length} productos en ${CATEGORIES.length} categorías):
${SPACE_SHOP_PRODUCTS.map(p =>
  `• ${p.icon} [${p.id}] ${p.name} — $${p.price} | Categoría: ${p.category} | Stock: ${p.stock}`
).join("\n")}

POLÍTICAS:
- Envíos: Standard 5-7 días ($4.99), Express 2-3 días ($12.99), Overnight ($24.99)
- Devoluciones: 30 días en perfectas condiciones con recibo
- Garantía: 1 año telescopios y modelos, 90 días ropa/accesorios
- Descuentos: 10% en primera compra con código SPACE10, envío gratis en compras >$150

INSTRUCCIONES:
- Responde SIEMPRE en español
- Si el usuario pregunta por productos, cita precios y IDs reales del catálogo
- Para consultas de órdenes ficticias, usa el formato ORD-XXXXX
- Si el usuario pregunta datos financieros del dashboard, explica brevemente los KPIs
- Sé conversacional pero conciso (máx 3 párrafos por respuesta)
- Usa emojis espaciales con moderación 🚀✨🔭`;

// ── Gemini multi-turno ────────────────────────────────────────────────────────

/**
 * sendMessage — envía un mensaje con historial y recibe respuesta de NOVA
 * @param {Array<{role: string, text: string}>} history  Historial previo
 * @param {string}                              message  Mensaje del usuario
 * @returns {Promise<string>}                            Respuesta del asistente
 */
export async function sendMessage(history, message) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Construir el array de contents: system + historial + nuevo mensaje
  const contents = [];

  // Primer turno: instrucciones del sistema como "user" + "model" (truco Gemini)
  contents.push({
    role: "user",
    parts: [{ text: SYSTEM_CONTEXT + "\n\nComienza la conversación." }]
  });
  contents.push({
    role: "model",
    parts: [{ text: "¡Bienvenido a The Space Shop! Soy NOVA, tu asistente especializada en productos espaciales. ¿En qué puedo ayudarte hoy? 🚀" }]
  });

  // Agregar historial previo (max 10 turnos para no exceder tokens)
  const trimmed = history.slice(-10);
  trimmed.forEach(msg => {
    contents.push({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    });
  });

  // Mensaje actual
  contents.push({
    role:  "user",
    parts: [{ text: message }]
  });

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      generationConfig: {
        maxOutputTokens: 500,
        temperature:     0.75,
      }
    })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Error al contactar a NOVA");
  }

  const data = await res.json();
  return data.candidates[0].content.parts[0].text.trim();
}

/**
 * getWelcomeMessage — mensaje inicial de bienvenida
 */
export function getWelcomeMessage() {
  return "¡Hola! Soy **NOVA** 🚀, tu asistente de The Space Shop. Puedo ayudarte con:\n\n• Información de productos y precios\n• Estado de envíos y devoluciones\n• Recomendaciones personalizadas\n• Datos financieros del dashboard\n\n¿En qué puedo ayudarte hoy?";
}

/**
 * getSuggestedQuestions — preguntas sugeridas para inicio rápido
 */
export function getSuggestedQuestions() {
  return [
    "¿Cuál es el telescopio más popular?",
    "¿Tienen comida de astronauta en oferta?",
    "¿Qué modelos de cohetes tienen disponibles?",
    "¿Cuánto cuesta el envío express?",
    "Recomiéndame un regalo para un fanático del espacio",
    "¿Cuáles son los productos más vendidos hoy?",
  ];
}
