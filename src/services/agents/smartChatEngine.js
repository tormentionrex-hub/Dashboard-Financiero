// ─────────────────────────────────────────────────────────────────────────────
//  SMART CHAT ENGINE — Motor de IA multi-capa para NOVA
//  Prioridad: Chrome Built-in AI → Ollama → NLP local
//  Internet: Wikipedia API (gratis, sin API key, CORS-friendly)
// ─────────────────────────────────────────────────────────────────────────────

import { SPACE_SHOP_PRODUCTS, CATEGORIES, COMPANY_INFO, BRANDS, CATALOG_STATS, CATEGORIES as CAT_LIST } from "../../data/spaceShopData";

// ── Prompt del sistema para Chrome AI / Ollama ────────────────────────────────
const SYSTEM_PROMPT = `Eres NOVA, asistente de inteligencia financiera del Dashboard de The Space Shop — Kennedy Space Center Official Store (empresa matriz: Delaware North, ubicada en Merritt Island, FL).

ROL: Eres un asistente para el GERENTE o equipo directivo, no para clientes. Tu función es analizar datos, responder preguntas financieras y operacionales, y presentar métricas del negocio de forma clara y concisa.

DATOS DEL NEGOCIO (reales, extraídos de thespaceshop.com):
- Plataforma: BigCommerce | Total SKUs en catálogo: ~${COMPANY_INFO.totalProducts}+
- Categorías principales: Memorabilia (233 productos), Clothing & Accessories (367), Home & Gift (462), Toy Shop (87), Sale (12 activos)
- Rango de precios del catálogo: $5.99 — $400.00
- Precio promedio del catálogo: $${CATALOG_STATS.avgPrice.toFixed(2)}
- Umbral de envío gratis: $${COMPANY_INFO.freeShipping}
- Marcas premium: Under Armour, RSVLTS, Loungefly, LEGO, Champion, Pins & Aces, Lusso
- Temas espaciales: Apollo, Artemis, STS Shuttle, SpaceX, Blue Origin, Peanuts/Snoopy
- Artículos en oferta activos: 11 items (precios terminados en .88)
- Meteorito más caro: "I Love You To The Moon Pendant" — $400.00
- Modelo más caro: "Executive Series Saturn V Rocket 1:200" — $350.00
- Producto más económico: Articulated Astronaut Toy — $5.99

INSTRUCCIONES:
- Siempre responde en español
- Sé directo y preciso con los datos
- Cuando el agente ORION esté activo, úsalo para análisis de ventas en tiempo real
- Presenta datos financieros con formato claro (tablas cuando aplique)
- Si no tienes el dato exacto, indica qué sección del dashboard puede consultarse
- Máximo 3 párrafos. Sin lenguaje de ventas — eres analítico, no comercial.`;

// ── Estado del engine ─────────────────────────────────────────────────────────
let _engineStatus = "detecting"; // detecting | chrome-ai | ollama | local
let _chromeSession = null;
let _ollamaModel   = null;

export function getEngineStatus() {
  return _engineStatus;
}

// ── Inicialización (detectar el mejor engine disponible) ──────────────────────
export async function initEngine() {
  // 1. Intentar Chrome Built-in AI (Gemini Nano)
  if (await initChromeAI()) {
    _engineStatus = "chrome-ai";
    console.log("[NOVA] Engine: Chrome Built-in AI (Gemini Nano)");
    return _engineStatus;
  }

  // 2. Intentar Ollama local
  if (await initOllama()) {
    _engineStatus = "ollama";
    console.log("[NOVA] Engine: Ollama ·", _ollamaModel);
    return _engineStatus;
  }

  // 3. Fallback: motor local inteligente
  _engineStatus = "local";
  console.log("[NOVA] Engine: Motor local NLP");
  return _engineStatus;
}

// ─────────────────────────────────────────────────────────────────────────────
//  CHROME BUILT-IN AI (Gemini Nano)
//  Disponible en Chrome 127+ (activar en chrome://flags/#prompt-api-for-gemini-nano)
// ─────────────────────────────────────────────────────────────────────────────

async function initChromeAI() {
  try {
    const ai = window.ai || window.self?.ai;
    if (!ai?.languageModel) return false;

    const capabilities = await ai.languageModel.capabilities();
    if (capabilities.available === "no") return false;

    // Crear sesión con contexto del sistema
    _chromeSession = await ai.languageModel.create({
      systemPrompt: SYSTEM_PROMPT,
    });

    return true;
  } catch {
    return false;
  }
}

async function askChromeAI(message, history) {
  if (!_chromeSession) return null;
  try {
    // Incluir historial reciente en el mensaje para dar contexto
    const context = history.slice(-6).map(m =>
      `${m.role === "user" ? "Usuario" : "NOVA"}: ${m.text}`
    ).join("\n");

    const fullMessage = context
      ? `Conversación previa:\n${context}\n\nUsuario ahora dice: ${message}`
      : message;

    const response = await _chromeSession.prompt(fullMessage);
    return response?.trim() || null;
  } catch (err) {
    console.error("[Chrome AI]", err);
    _chromeSession = null;
    _engineStatus  = "local";
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  OLLAMA (LLM local — Llama, Mistral, Qwen, etc.)
//  Instalar gratis en ollama.com — sin API key
// ─────────────────────────────────────────────────────────────────────────────

async function initOllama() {
  try {
    const res = await fetch("http://localhost:11434/api/tags", {
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (!data.models?.length) return false;

    // Preferir modelos pequeños y rápidos
    const preferred = [
      "llama3.2:1b", "llama3.2:3b", "llama3.2",
      "qwen2.5:1.5b", "qwen2.5:3b", "qwen2.5",
      "mistral", "llama3.1", "llama2", "gemma2"
    ];
    const found = data.models.find(m =>
      preferred.some(p => m.name.toLowerCase().includes(p))
    );
    _ollamaModel = found?.name || data.models[0]?.name;
    return !!_ollamaModel;
  } catch {
    return false;
  }
}

async function askOllama(message, history) {
  if (!_ollamaModel) return null;
  try {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-10).map(m => ({
        role:    m.role === "user" ? "user" : "assistant",
        content: m.text,
      })),
      { role: "user", content: message },
    ];

    const res = await fetch("http://localhost:11434/api/chat", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ model: _ollamaModel, messages, stream: false }),
      signal:  AbortSignal.timeout(30000),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.message?.content?.trim() || null;
  } catch (err) {
    console.error("[Ollama]", err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  INTERNET SEARCH — Wikipedia API (gratis, sin API key, CORS-friendly)
// ─────────────────────────────────────────────────────────────────────────────

// Detectar si la pregunta necesita búsqueda en internet
function needsInternetSearch(message) {
  const lower = message.toLowerCase();
  const triggers = [
    /qué es\b/,
    /quién es\b/,
    /cómo funciona\b/,
    /cuándo fue\b/,
    /dónde está\b/,
    /cuántos\b.*\b(planetas|lunas|estrellas|galaxias)/,
    /\b(misión|nasa|spacex|cohete|planeta|estrella|luna|marte|saturno|júpiter|plutón|cometa|asteroide|telescopio|hubble|james webb|iss|estación espacial)\b/,
    /historia de\b/,
    /cuánto mide\b/,
    /descubierto\b/,
    /lanzamiento\b/,
    /orbita\b/,
    /distancia\b.*\btierra\b/,
    /\b(universo|galaxia|big bang|agujero negro|supernova)\b/,
  ];
  return triggers.some(re => re.test(lower));
}

export async function searchInternet(query) {
  // Limpiar query
  const clean = query
    .replace(/[¿?¡!]/g, "")
    .replace(/^(qué es|quién es|cómo funciona|cuéntame sobre|háblame de)/i, "")
    .trim();

  // Intentar Wikipedia en español primero
  try {
    const esRes = await fetch(
      `https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(clean)}&format=json&origin=*&srlimit=1`,
      { signal: AbortSignal.timeout(5000) }
    );
    const esData = await esRes.json();
    const title  = esData?.query?.search?.[0]?.title;

    if (title) {
      const summaryRes = await fetch(
        `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
        { signal: AbortSignal.timeout(5000) }
      );
      const summary = await summaryRes.json();
      if (summary.extract) {
        return {
          source: `Wikipedia — ${title}`,
          text:   summary.extract.slice(0, 600),
          url:    summary.content_urls?.desktop?.page || null,
        };
      }
    }
  } catch { /* ignorar y probar en inglés */ }

  // Fallback: Wikipedia en inglés
  try {
    const enRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(clean)}&format=json&origin=*&srlimit=1`,
      { signal: AbortSignal.timeout(5000) }
    );
    const enData = await enRes.json();
    const title  = enData?.query?.search?.[0]?.title;

    if (title) {
      const summaryRes = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
        { signal: AbortSignal.timeout(5000) }
      );
      const summary = await summaryRes.json();
      if (summary.extract) {
        return {
          source: `Wikipedia (EN) — ${title}`,
          text:   summary.extract.slice(0, 600),
          url:    summary.content_urls?.desktop?.page || null,
        };
      }
    }
  } catch { /* sin resultados */ }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
//  MOTOR LOCAL INTELIGENTE — NLP basado en frases, no en tokens aislados
//  Detecta intención por patrones de frase completa con prioridad por
//  especificidad. Los intents más concretos siempre ganan sobre los genéricos.
// ─────────────────────────────────────────────────────────────────────────────

// Normalizar texto para comparación
function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // quitar tildes
    .replace(/[¿?¡!.,;:]/g, " ")       // quitar puntuación
    .replace(/\s+/g, " ")
    .trim();
}

// ── Definición de intents por frases/patrones ─────────────────────────────────
// priority: mayor número = más específico = gana si hay empate
// patterns: regex aplicadas sobre el texto COMPLETO normalizado
const INTENT_PATTERNS = [
  // ── DATA DE VENTAS / MERCADO (máxima prioridad) ───────────────────────────
  {
    intent:   "sales_data",
    priority: 100,
    patterns: [
      /ventas?\s*(recientes?|ultimas?|de hoy|del dia|esta semana)/,
      /ultimas?\s*ventas?/,
      /como\s*(estuvieron?|van|andan|fueron)\s*(las\s*)?(ventas?|compras?|transacciones?)/,
      /resumen\s*(de\s*)?(ventas?|compras?|transacciones?)/,
      /cuanto\s*(he\s*)?(vendido|facturado|generado)/,
      /cuantas?\s*(compras?|transacciones?|ventas?)\s*(hubo|hay|tuve|tiene)/,
      /reportes?\s*(de\s*)?(ventas?|mercado|compras?)/,
      /reporte\s*ejecutivo/,
      /ingresos?\s*(de\s*)?(hoy|recientes?|totales?)/,
      /ticket\s*promedio/,
      /mejor\s*(producto|categoria)\s*(vendido|en ventas)/,
      /estadisticas?\s*(de\s*)?(ventas?|mercado)/,
      /metricas?\s*(de\s*)?(ventas?|mercado)/,
    ],
  },
  // ── TOP PRODUCTOS / CATEGORÍAS ────────────────────────────────────────────
  {
    intent:   "top_products",
    priority: 90,
    patterns: [
      /que\s*(se\s*)?(vende\s*mas|esta\s*vendiendo\s*mas|mas\s*se\s*vende)/,
      /(top|mejores?)\s*(productos?|categorias?)\s*(del dia|de hoy|en ventas)?/,
      /producto\s*(mas\s*)?(vendido|popular|exitoso)/,
      /categoria\s*(mas\s*)?(vendida|popular|exitosa)/,
      /cuales?\s*(son\s*)?(los|las)\s*(mas\s*)?(vendidos?|populares?)/,
    ],
  },
  // ── ENVÍOS ────────────────────────────────────────────────────────────────
  {
    intent:   "shipping",
    priority: 80,
    patterns: [
      /envio|enviar|envios|shipping/,
      /tiempo\s*(de\s*)?(entrega|llegada)/,
      /cuanto\s*(tarda?|demora?)\s*(en\s*)?llegar/,
      /opciones?\s*(de\s*)?envio/,
      /costo\s*(del?\s*)?envio/,
      /entrega\s*(express|rapida|urgente|standar)/,
    ],
  },
  // ── DEVOLUCIONES ──────────────────────────────────────────────────────────
  {
    intent:   "return",
    priority: 80,
    patterns: [
      /devolucion|devolver|devoluciones/,
      /como\s*(puedo\s*)?(devolver|regresar)\s*(un\s*)?(producto|compra|pedido)/,
      /politica\s*(de\s*)?(devolucion|cambio|reembolso)/,
      /reembolso|reintegro/,
      /quiero\s*(cambiar|devolver)\s*(mi|un|el)/,
    ],
  },
  // ── GARANTÍA ──────────────────────────────────────────────────────────────
  {
    intent:   "warranty",
    priority: 80,
    patterns: [
      /garantia|garantias/,
      /producto\s*(roto|danad|defectuoso|no\s*funciona)/,
      /mi\s*(compra|producto)\s*(no\s*funciona|llego\s*(roto|danad))/,
      /tiempo\s*(de\s*)?garantia/,
    ],
  },
  // ── DESCUENTOS / CUPONES ──────────────────────────────────────────────────
  {
    intent:   "discount",
    priority: 80,
    patterns: [
      /descuento|descuentos|cupon|cupones|promocion|oferta/,
      /codigo\s*(de\s*)?(descuento|promo)/,
      /hay\s*(algun?\s*)?(descuento|oferta|promo)/,
      /envio\s*gratis/,
      /space10/,
    ],
  },
  // ── PRECIOS ───────────────────────────────────────────────────────────────
  {
    intent:   "price",
    priority: 75,
    patterns: [
      /cuanto\s*(cuesta|vale|es|precio)/,
      /precio\s*(de|del)/,
      /rangos?\s*(de\s*)?precio/,
      /cuantos?\s*(dolares?|usd)/,
      /es\s*(caro|barato|economico)/,
    ],
  },
  // ── MODELOS DE COHETES ────────────────────────────────────────────────────
  {
    intent:   "models",
    priority: 75,
    patterns: [
      /modelos?\s*(de\s*)?(cohete|nave|rocket|shuttle|saturn|apollo)/,
      /replicas?\s*(espaciales?|de\s*cohete)?/,
      /coleccion\s*(de\s*)?(modelos?|cohetes?)/,
      /saturn\s*v|apollo\s*11|space\s*shuttle|sls\s*rocket|lunar\s*module/,
      /modelos?\s*(a\s*escala|ejecutivos?)/,
    ],
  },
  // ── METEORITOS ────────────────────────────────────────────────────────────
  {
    intent:   "meteorite",
    priority: 75,
    patterns: [
      /meteorito|meteoritos|meteorite/,
      /rocas?\s*(de\s*)?(marte|luna|mars|moon|espacio)/,
      /piedra\s*(espacial|de\s*marte|de\s*luna)/,
      /coleccionables?\s*(espaciales?)?/,
      /autentic(o|a)\s*(roca|meteorito|piedra)/,
    ],
  },
  // ── COMIDA ESPACIAL ───────────────────────────────────────────────────────
  {
    intent:   "food",
    priority: 75,
    patterns: [
      /comida\s*(espacial|de\s*astronauta|liofilizada)/,
      /helado\s*(de\s*astronauta|freeze|espacial)?/,
      /freeze.?dried/,
      /alimento\s*(espacial|de\s*astronauta)/,
      /que\s*(comen|comian)\s*(los\s*)?astronautas?/,
    ],
  },
  // ── ROPA / ACCESORIOS ─────────────────────────────────────────────────────
  {
    intent:   "clothes",
    priority: 75,
    patterns: [
      /ropa\s*(nasa|espacial|de\s*astronauta)?/,
      /camiseta|playera|tshirt|t-shirt/,
      /hoodie|sudadera|jacket|chaqueta|chamarra/,
      /gorra|cap\s*nasa|bomber\s*jacket/,
      /accesorios?\s*(nasa|espaciales?)/,
    ],
  },
  // ── REGALOS ───────────────────────────────────────────────────────────────
  {
    intent:   "gift",
    priority: 70,
    patterns: [
      /regalo\s*(para|espacial)?/,
      /que\s*(le\s*)?(puedo\s*)?regalar/,
      /idea\s*(de\s*)?regalo/,
      /regalo\s*(de\s*)?(cumpleanos|navidad|dia\s*del\s*padre)/,
      /algo\s*(para\s*)?(regalar|gifting)/,
    ],
  },
  // ── PRODUCTOS POPULARES ───────────────────────────────────────────────────
  {
    intent:   "popular",
    priority: 70,
    patterns: [
      /mas\s*popular(es)?/,
      /mas\s*vendido(s)?/,
      /que\s*(me\s*)?(recomiend|sugieres?)/,
      /mejor\s*producto/,
      /favoritos?\s*(de\s*(la\s*tienda|clientes?))?/,
    ],
  },
  // ── PEDIDOS / RASTREO ─────────────────────────────────────────────────────
  {
    intent:   "order",
    priority: 70,
    patterns: [
      /estado\s*(de\s*)?(mi\s*)?(orden|pedido|compra)/,
      /donde\s*esta\s*mi\s*pedido/,
      /rastreo|tracking|rastrear/,
      /numero\s*(de\s*)?(orden|pedido)/,
      /cuando\s*llega\s*mi\s*pedido/,
    ],
  },
  // ── JUGUETES ──────────────────────────────────────────────────────────────
  {
    intent:   "toys",
    priority: 65,
    patterns: [
      /juguetes?\s*(espaciales?|educativos?|de\s*astronauta)?/,
      /algo\s*(para\s*)?(ninos?|chicos?|bebes?)/,
      /para\s*nino\s*(de\s*\d+\s*anos?)?/,
    ],
  },
  // ── SALUDO ───────────────────────────────────────────────────────────────
  // Solo activa si el mensaje es CORTO y empieza con saludo
  {
    intent:   "greeting",
    priority: 50,
    patterns: [
      /^(hola|hey|hi|buenas|buenos\s*(dias|tardes|noches)|saludos|ola|holi)(\s+nova|\s+bot|\s+ahi)?[\s!.]*$/,
      /^(hola|hey)\s*,?\s*(como\s*estas?|que\s*tal|que\s*hay)?[\s!.]*$/,
    ],
  },
  // ── BIENESTAR ─────────────────────────────────────────────────────────────
  // Solo activa si la pregunta es ESPECÍFICAMENTE sobre cómo está NOVA
  {
    intent:   "wellbeing",
    priority: 50,
    patterns: [
      /^como\s*(estas?|te\s*(encuentras?|sientes?|va))\??\s*$/,
      /^(como\s*estas?|que\s*tal\s*estas?)\s*nova?[\s?]*$/,
      /^(estas?\s*bien|todo\s*bien)\s*(nova|bot)?[\s?]*$/,
    ],
  },
  // ── DESPEDIDA ─────────────────────────────────────────────────────────────
  {
    intent:   "farewell",
    priority: 50,
    patterns: [
      /^(adios|hasta\s*(luego|pronto|manana)|bye|chao|nos\s*vemos|me\s*(voy|retiro))[\s!.]*$/,
    ],
  },
  // ── AGRADECIMIENTO ───────────────────────────────────────────────────────
  {
    intent:   "thanks",
    priority: 45,
    patterns: [
      /^(gracias|muchas\s*gracias|mil\s*gracias|thanks|thank\s*you)[\s!.]*$/,
      /^(ok\s*)?(perfecto|genial|excelente|muy\s*bien)\s*,?\s*(gracias)?[\s!.]*$/,
    ],
  },
  // ── AYUDA GENERAL ────────────────────────────────────────────────────────
  {
    intent:   "help",
    priority: 40,
    patterns: [
      /que\s*(puedes?|sabes?|eres?\s*capaz\s*de)\s*(hacer|decirme|mostrarme|ayudarme)/,
      /para\s*(que\s*)?(sirves?|eres?)/,
      /como\s*(me\s*)?(puedes?|sabes?)\s*ayudar/,
      /en\s*que\s*(me\s*)?(puedes?|sabes?)\s*ayudar/,
      /que\s*(tipos?\s*(de\s*)?)?servicios?\s*(tienes?|ofreces?)/,
      /cuales?\s*(son\s*)?(tus\s*)?(funciones?|capacidades?|habilidades?|opciones?)/,
      /que\s*(informacion|info|datos?)\s*(tienes?|manejas?|sabes?)/,
      /que\s*(me\s*)?(puedes?|sabes?)\s*(decir|mostrar|explicar|dar)/,
      /necesito\s*ayuda/,
      /ayudame\s*(con\s*(algo|todo))?/,
      /^(ayuda|help|auxilio)[\s!.]*$/,
      /que\s*(cosas?\s*)?(puedes?\s*|sabes?\s*)?(hacer|ofrecerme|darme)/,
      /con\s*que\s*(puedes?|me\s*puedes?|sabes?)\s*ayudar/,
      /que\s*funciones?\s*(tiene?s?|hay)/,
    ],
  },
];

// ── Detectar intent con el sistema de frases ──────────────────────────────────
function detectIntent(rawText) {
  const text = normalize(rawText);
  let best = null;

  for (const entry of INTENT_PATTERNS) {
    for (const pattern of entry.patterns) {
      if (pattern.test(text)) {
        // Guardar el match con mayor prioridad
        if (!best || entry.priority > best.priority) {
          best = entry;
        }
        break; // no necesitamos probar más patrones de este entry
      }
    }
  }

  return best ? best.intent : null;
}

// ── Análisis estadístico de ventas ───────────────────────────────────────────
function buildSalesSummary(purchases) {
  if (!purchases || !purchases.length) return null;

  const total    = purchases.reduce((s, p) => s + p.total, 0);
  const avg      = total / purchases.length;
  const count    = purchases.length;

  // Top productos
  const prodMap = {};
  purchases.forEach(p => {
    prodMap[p.product.name] = (prodMap[p.product.name] || 0) + p.total;
  });
  const topProds = Object.entries(prodMap).sort((a, b) => b[1] - a[1]).slice(0, 3);

  // Top categorías
  const catMap = {};
  purchases.forEach(p => {
    catMap[p.product.category] = (catMap[p.product.category] || 0) + p.total;
  });
  const topCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]);

  // Tendencia: primera mitad vs segunda mitad
  const mid = Math.floor(purchases.length / 2);
  const recentHalf  = purchases.slice(0, mid).reduce((s, p) => s + p.total, 0);
  const earlierHalf = purchases.slice(mid).reduce((s, p) => s + p.total, 0);
  const trend = earlierHalf > 0 ? (((recentHalf - earlierHalf) / earlierHalf) * 100).toFixed(1) : 0;

  // Descuentos
  const discounted = purchases.filter(p => p.discount > 0).length;

  return { total, avg, count, topProds, topCats, trend, discounted };
}

// ── Generar respuesta basada en datos reales ──────────────────────────────────
function generateSalesResponse(stats, recentPurchases, intent) {
  if (!stats) {
    return "El agente ORION aún no tiene datos de ventas. Actívalo primero en la pestaña **ORION — Mercado** para empezar a monitorear compras en tiempo real.";
  }

  const { total, avg, count, topProds, topCats, trend, discounted } = stats;
  const trendIcon  = trend > 0 ? "📈" : trend < 0 ? "📉" : "➡️";
  const trendLabel = trend > 0 ? `crecimiento de +${trend}%` : trend < 0 ? `caída de ${trend}%` : "estable";

  if (intent === "top_products") {
    let r = `Los **top productos** en ventas ahora mismo:\n\n`;
    topProds.forEach(([name, rev], i) => {
      r += `${i + 1}. **${name.split(" ").slice(0, 4).join(" ")}** — $${rev.toFixed(2)}\n`;
    });
    r += `\nCategoría líder: **${topCats[0]?.[0] || "N/A"}** con $${topCats[0]?.[1]?.toFixed(2) || "0"}.`;
    return r;
  }

  // sales_data (respuesta completa)
  let r = `Aquí tienes el resumen de tus últimas **${count} transacciones** registradas por ORION:\n\n`;
  r += `- 💰 **Ingresos totales**: $${total.toFixed(2)}\n`;
  r += `- 🎫 **Ticket promedio**: $${avg.toFixed(2)}\n`;
  r += `- ${trendIcon} **Tendencia reciente**: ${trendLabel}\n`;
  if (discounted > 0) {
    r += `- 🏷️ **Con descuento**: ${discounted} de ${count} ventas (${((discounted / count) * 100).toFixed(0)}%)\n`;
  }
  r += `\n**Top productos:**\n`;
  topProds.forEach(([name, rev], i) => {
    r += `${i + 1}. ${name.split(" ").slice(0, 4).join(" ")} — $${rev.toFixed(2)}\n`;
  });
  r += `\n**Categorías:**\n`;
  topCats.slice(0, 4).forEach(([cat, rev]) => {
    r += `- ${cat}: $${rev.toFixed(2)}\n`;
  });

  return r;
}

// ── Banco de respuestas — orientadas al gerente/dashboard financiero ──────────
const STATIC_RESPONSES = {
  greeting: [
    "Hola. Soy NOVA, tu asistente de inteligencia financiera del Dashboard de **The Space Shop — KSC**. Puedo darte métricas de ventas, análisis de categorías, datos del catálogo o reportes ejecutivos. ¿Qué necesitas?",
    "Buenas. NOVA activa y lista para análisis. Tengo acceso al catálogo real de thespaceshop.com (~1,149 productos) y a los datos de ORION en tiempo real. ¿Qué métrica revisamos?",
    "Sistema listo. Soy NOVA, asistente financiero de The Space Shop. Activa ORION para ver ventas en tiempo real o pregúntame directamente sobre el catálogo, categorías o marcas.",
  ],
  wellbeing: [
    "Funcionando al 100%. Tengo los datos del catálogo cargados y monitoreo las métricas de ORION en tiempo real. ¿Qué quieres analizar?",
    "Todo en orden. NOVA operativa. ¿Consultamos ventas, categorías o algún indicador específico del dashboard?",
  ],
  farewell: [
    "Hasta luego. El dashboard seguirá monitoreando. Cualquier consulta financiera, aquí estaré.",
    "Cierre de sesión. Los datos de ORION siguen corriendo en segundo plano. Hasta la próxima.",
  ],
  thanks: [
    "De nada. ¿Hay otra métrica o consulta pendiente?",
    "Entendido. ¿Algo más del dashboard?",
  ],

  // ── Datos financieros del catálogo real ────────────────────────────────────
  price: `**Estructura de precios del catálogo — The Space Shop:**\n\n- Precio mínimo: **$5.99** (Articulated Astronaut Toy)\n- Precio máximo: **$400.00** (I Love You To The Moon Pendant)\n- Precio promedio catálogo: **$${CATALOG_STATS.avgPrice.toFixed(2)}**\n- Umbral de envío gratis: **$${COMPANY_INFO.freeShipping}**\n\n**Por segmento:**\n- $5.99–$15: Parches, imanes, accesorios pequeños (alto volumen)\n- $15–$50: Ropa básica, juguetes, comida espacial\n- $50–$120: Ropa premium, LEGO, modelos entry-level\n- $120–$400: Executive Series, LEGO premium, meteoritos grandes`,

  shipping: `**Política de envío — The Space Shop:**\n\n- **Envío gratis**: En compras ≥ $${COMPANY_INFO.freeShipping} (umbral clave para conversión)\n- **Nota activa**: Posibles retrasos por alta demanda Artemis II\n- **Plataforma**: BigCommerce (gestión logística centralizada)\n\nPara el dashboard: monitorear el % de órdenes que alcanzan el umbral de $75 es un KPI crítico de ticket promedio.`,

  return: `**Política de devoluciones — thespaceshop.com:**\n\n- URL oficial: /returns-exchanges/\n- Plazo estándar: 30 días\n- Condición: producto en perfecto estado con recibo\n- Meteoritos y personalizados: no retornables\n\nPara reportes: las devoluciones impactan el revenue neto. Recomiendo rastrear tasa de devolución por categoría.`,

  models: `**Categoría Memorabilia — Modelos a escala (13 SKUs activos):**\n\n**Executive Series (alta rotación, alto valor):**\n- Saturn V 1:200 → **$350** | Shuttle Discovery/Endeavour/Atlantis → **$300 c/u**\n- Apollo 11 Capsule → **$300** | Command Module → **$300**\n- LEM 1:48 → **$280** | Gemini IV → **$280** | Mercury Capsule → **$260**\n- Mercury Redstone → **$250**\n\n**Entry-level:**\n- Apollo 11 Saturn V 1:96 → **$209.99**\n- SLS Rocket 1:235 → **$59.99** | Starliner 1:48 → **$59.99**\n\nMargen estimado: categoría de mayor valor promedio por SKU (~$250).`,

  meteorite: `**Categoría Memorabilia — Meteoritos (15 SKUs activos):**\n\n| Producto | Precio |\n|---|---|\n| I Love You To The Moon Pendant | $400.00 |\n| Genuine Meteorite 1/2 Lb | $315.00 |\n| Genuine Meteorite 150g | $220.00 |\n| Moon/Mars Rock Large | $170.00 c/u |\n| Moon/Mars Rock Small | $80.00 c/u |\n| Mars Rock Medium | $105.00 |\n| Pendants (3 tipos) | $105.00 c/u |\n| Silver Star Earrings | $100.00 |\n| Meteorite Necklace | $24.99 |\n| Meteorite 3g | $14.99 |\n\nAlto valor promedio: ~$140/SKU. Producto ancla de la categoría Memorabilia.`,

  clothes: `**Categoría Clothing & Accessories (367 SKUs — mayor inventario):**\n\n**Marcas premium activas:**\n- RSVLTS: $44.99–$79.99 | Under Armour: $44.99–$69.99\n- Pins & Aces: $79.99 | Champion: $39.99 | Loungefly: $85.00\n\n**Rango de precio:**\n- Básico (tees, accesorios pequeños): $9.99–$34.99\n- Mid-range (hoodies, sweatshirts): $44.99–$69.99\n- Premium (polos, backpacks): $79.99–$85.00\n\n367 productos = **32% del catálogo total**. Mayor potencial de volumen de ventas.`,

  food: `**Home & Gift — Space Food (subcat):**\n\n- Space Candy Freeze Dried Galaxy Clusters: **$12.99**\n- Artículos de bajo precio pero alta rotación por impulso de compra\n\nNota para el gerente: la comida espacial es un producto de compra impulsiva. Su margen absoluto es bajo pero contribuye a alcanzar el umbral de envío gratis ($75), aumentando el ticket total.`,

  toys: `**Categoría Toy Shop (87 SKUs):**\n\n**Premium:**\n- LEGO® Icons Shuttle Carrier Aircraft → **$240.00**\n- Barbie 60th Anniversary Miss Astronaut → **$115.00**\n- LEGO® Technic Lunar Outpost → **$110.00**\n\n**Mid-range:**\n- LEGO® Creator Space Telescope → **$44.99**\n- Ellen Ochoa Barbie → **$44.99**\n\n**Entry-level:**\n- Articulated Astronaut Toy → **$5.99** (precio más bajo del catálogo)\n\n87 SKUs = ~8% del catálogo. LEGO y Barbie son las marcas de mayor ticket en esta categoría.`,

  discount: `**Sección Sale activa — thespaceshop.com/sale/:**\n\n11 artículos activos (precios terminados en .88):\n- KSC Hat & Tee Combo → $19.88\n- NASA Meatball Applique Crew Sweater → $64.88 (mayor valor en sale)\n- Failure Is Not An Option Tee → $29.88\n- Lusso Key Ring Pouches → $12.88 c/u (3 colores)\n- Wide Brim Bucket Hat → $14.88\n- Astronaut Suit Apron → $9.88\n- KSC Logo Mug → $7.88 (menor valor)\n\nImpacto financiero: 12 SKUs en liquidación = potencial de rotación de inventario estancado.`,

  popular: `**Productos de mayor valor estratégico en el catálogo:**\n\n1. 🚀 Executive Saturn V 1:200 → **$350** (ticket más alto de Modelos)\n2. 🌙 I Love You To The Moon Pendant → **$400** (ticket más alto de Meteoritos)\n3. 🎒 Loungefly NASA Mini Backpack → **$85** (accesorio premium)\n4. 🧥 Pins & Aces / RSVLTS Polos → **$79.99** (ropa premium)\n5. 🧱 LEGO® Shuttle Carrier Aircraft → **$240** (juguete premium)\n\nNota: activar ORION para ver qué se está vendiendo *ahora mismo* en tiempo real.`,

  order: `**Gestión de pedidos — The Space Shop:**\n\n- Plataforma: **BigCommerce** (panel de administración en bigcommerce.com)\n- Analytics integrado: Google Analytics G-S30NRFN048\n- Meta Pixel: 1260393231604183\n\nPara KPIs de pedidos (tasa de conversión, abandono de carrito, AOV): consultar el panel de BigCommerce o revisar el reporte del agente ATLAS si se cargó un export de datos.`,

  gift: `**Análisis de categorías para regalo (desde perspectiva gerencial):**\n\n**Alto margen / bajo precio** (alto volumen esperado):\n- Parches de misión: $9.99 (176 SKUs disponibles)\n- Meteorito 3g: $14.99 | Imanes: $9.99\n\n**Mid-ticket con buena rotación:**\n- Ropa Under Armour/Champion: $39.99–$69.99\n- Juguetes LEGO entry: $39.99–$44.99\n\n**Alto ticket / premium:**\n- Executive Series Models: $250–$350\n- Meteoritos grandes: $170–$400\n\nEstos rangos ayudan a planificar campañas por segmento de cliente.`,

  help: [
    `Soy **NOVA**, asistente de inteligencia financiera del Dashboard de **The Space Shop — KSC**.\n\nEstoy conectada a thespaceshop.com y puedo darte:\n\n**📊 Análisis de ventas en tiempo real**\nActiva el agente **ORION** y pregúntame: *"¿cómo van las ventas?"*, *"¿cuál es el ticket promedio?"*, *"¿qué categoría lidera?"*\n\n**📦 Datos del catálogo real**\nPregúntame: *"¿cuál es el precio promedio del catálogo?"*, *"¿cuántos productos hay en sale?"*, *"¿qué marcas premium tenemos?"*\n\n**📁 Análisis de documentos**\nEl agente **ATLAS** puede procesar archivos Excel, CSV o JSON con datos financieros.\n\n**🌐 Consultas en internet**\nBusco información en tiempo real sobre temas espaciales vía Wikipedia.\n\n¿Por dónde empezamos?`,

    `**Capacidades del sistema NOVA — Dashboard Financiero:**\n\n**Sin activar agentes:**\n- Datos del catálogo: ~1,149 SKUs, 5 categorías, 17 marcas\n- Precios: $5.99 (mín) — $400 (máx), promedio $${CATALOG_STATS.avgPrice.toFixed(2)}\n- 11 artículos en sale activos | 176 parches de misión a $9.99\n- Umbral envío gratis: $75\n\n**Con ORION activo:**\n- Ventas en tiempo real con productos reales del catálogo\n- Ticket promedio, ingresos totales, categoría líder, tendencias\n\n**Con ATLAS activo:**\n- Procesar reportes financieros, exports de BigCommerce, CSV de ventas\n\n¿Qué métrica necesitas revisar?`,
  ],
};

// ── Generador principal de respuesta local ────────────────────────────────────
function generateLocalResponse(message, history, marketData) {
  const intent = detectIntent(message);

  // Intents que requieren datos de ventas en tiempo real
  if (intent === "sales_data" || intent === "top_products") {
    const stats = buildSalesSummary(marketData?.purchases);
    return generateSalesResponse(stats, marketData?.purchases || [], intent);
  }

  // Intents con respuesta estática
  const resp = STATIC_RESPONSES[intent];

  if (!resp) {
    // Sin intent reconocido: respuesta contextual inteligente
    const prev = history.slice(-2).map(m => m.text).join(" ").toLowerCase();
    const norm = normalize(message);

    if (/venta|compra|factur|ingreso|transacc/.test(prev)) {
      return "Parece que hablamos de ventas. ¿Quieres el resumen completo o algo específico? Puedo decirte los ingresos totales, el ticket promedio, los productos top o la tendencia reciente.";
    }
    if (/^(si|no|claro|dale|ok|okay|bien|perfecto|listo|exacto|correcto)[\s!.]*$/.test(norm)) {
      const lastBot = [...history].reverse().find(m => m.role === "assistant");
      if (lastBot?.text?.includes("regalo")) return "¡Perfecto! Cuéntame el presupuesto aproximado y para quién es, así te recomiendo algo muy específico.";
      if (lastBot?.text?.includes("envío")) return "¿Tienes alguna duda sobre los costos o tiempos? Con gusto te detallo más.";
      return "¡Entendido! ¿Hay algo más en lo que pueda ayudarte?";
    }
    // Fallback universal informativo
    return `Entendido. No estoy segura de cómo ayudarte con eso exactamente, pero puedo hacer lo siguiente:\n\n- Consultar ventas en tiempo real (*"¿cómo van mis ventas?"*)\n- Informarte sobre productos, precios y envíos\n- Buscar info del espacio en internet\n- Recomendar regalos\n\n¿Cuál te interesa?`;
  }

  if (Array.isArray(resp)) {
    return resp[history.length % resp.length];
  }
  return resp;
}

// ─────────────────────────────────────────────────────────────────────────────
//  FUNCIÓN PRINCIPAL — Enviar mensaje con el mejor engine disponible
// ─────────────────────────────────────────────────────────────────────────────

/**
 * sendSmartMessage — Procesa el mensaje con el mejor engine disponible
 * @param {Array}  history     Historial de mensajes
 * @param {string} message     Mensaje del usuario
 * @param {object} marketData  Datos de ventas en tiempo real de ORION {purchases, stats}
 */
export async function sendSmartMessage(history, message, marketData = null) {
  // 1. Buscar en internet si la pregunta lo requiere
  let internetContext = null;
  if (needsInternetSearch(message)) {
    try {
      const result = await searchInternet(message);
      if (result) internetContext = result;
    } catch { /* continuar sin búsqueda */ }
  }

  // Mensaje enriquecido para engines de IA reales (Chrome AI / Ollama)
  const salesContext = marketData?.purchases?.length
    ? `\n\n[Datos de ventas en tiempo real — ORION: ${marketData.purchases.length} transacciones, ingresos totales $${marketData.stats?.totalRevenue?.toFixed(2) || "0"}, ticket promedio $${marketData.stats?.avgTicket?.toFixed(2) || "0"}, categoría líder: ${marketData.stats?.topCategory || "N/A"}]`
    : "";

  const enrichedMessage = message
    + salesContext
    + (internetContext ? `\n\n[Internet - ${internetContext.source}]: ${internetContext.text}` : "");

  // 2. Chrome Built-in AI (Gemini Nano)
  if (_engineStatus === "chrome-ai") {
    const response = await askChromeAI(enrichedMessage, history);
    if (response) {
      return { text: response, engine: "chrome-ai", source: internetContext?.source || null };
    }
    _engineStatus = "local";
  }

  // 3. Ollama
  if (_engineStatus === "ollama") {
    const response = await askOllama(enrichedMessage, history);
    if (response) {
      return { text: response, engine: "ollama", source: internetContext?.source || null };
    }
    _engineStatus = "local";
  }

  // 4. Motor local NLP con acceso a datos reales
  let response = generateLocalResponse(message, history, marketData);
  if (internetContext) {
    response += `\n\n📡 **Dato de internet** *(${internetContext.source})*:\n${internetContext.text}`;
  }

  return {
    text:   response,
    engine: "local",
    source: internetContext?.source || null,
  };
}

export { needsInternetSearch };
