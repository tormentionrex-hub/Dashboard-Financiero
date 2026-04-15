// ─────────────────────────────────────────────────────────────────────────────
//  AGENTE 1 — Market Intelligence
//  Simula compras en tiempo real de The Space Shop y genera insights con IA
// ─────────────────────────────────────────────────────────────────────────────

import { getRandomProduct, getRandomLocation, getRandomQty } from "../../data/spaceShopData";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Intervalo entre compras: 2.5s – 6s (ms)
const MIN_INTERVAL = 2500;
const MAX_INTERVAL = 6000;

// Genera insight de IA cada N compras
const INSIGHT_EVERY_N = 12;

let _timerId      = null;
let _purchaseCount = 0;

// ── Llamada a Gemini ─────────────────────────────────────────────────────────
async function callGemini(prompt) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 300, temperature: 0.7 }
    })
  });
  if (!res.ok) throw new Error("Gemini error");
  const data = await res.json();
  return data.candidates[0].content.parts[0].text.trim();
}

// ── Genera un objeto de compra ────────────────────────────────────────────────
function buildPurchase() {
  const product  = getRandomProduct();
  const qty      = getRandomQty(product);
  const total    = parseFloat((product.price * qty).toFixed(2));
  const discount = Math.random() < 0.15 ? Math.round(Math.random() * 15 + 5) : 0; // 15% prob de descuento
  const finalTotal = parseFloat((total * (1 - discount / 100)).toFixed(2));

  return {
    id:        `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    product,
    qty,
    unitPrice:  product.price,
    total:      finalTotal,
    discount,
    location:   getRandomLocation(),
    timestamp:  new Date(),
    status:     "CONFIRMED",
  };
}

// ── API pública ───────────────────────────────────────────────────────────────

/**
 * startMonitoring — arranca el agente de mercado
 * @param {(purchase: object) => void}  onPurchase  callback por cada compra
 * @param {(insight: string)  => void}  onInsight   callback por cada insight de IA
 * @param {(err: string)      => void}  onError     callback de error
 */
export function startMonitoring(onPurchase, onInsight, onError) {
  if (_timerId) return; // ya corriendo
  _purchaseCount = 0;

  const schedule = () => {
    const delay = MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL);
    _timerId = setTimeout(async () => {
      if (!_timerId) return; // detenido mientras esperaba

      try {
        const purchase = buildPurchase();
        _purchaseCount++;
        onPurchase(purchase);

        // Cada N compras → insight de IA
        if (_purchaseCount % INSIGHT_EVERY_N === 0) {
          const prompt = `Eres un analista de e-commerce espacial. Se han registrado ${_purchaseCount} transacciones en The Space Shop.
La última compra fue: "${purchase.product.name}" × ${purchase.qty} por $${purchase.total} desde ${purchase.location}.
La categoría más reciente es "${purchase.product.category}".
Genera UN solo insight de mercado breve (máx 2 oraciones) en español. Sé concreto y financieramente relevante.`;
          const insight = await callGemini(prompt);
          onInsight({ text: insight, timestamp: new Date(), purchaseCount: _purchaseCount });
        }

        schedule(); // programa la siguiente compra
      } catch (err) {
        onError?.(err.message);
        schedule();
      }
    }, delay);
  };

  schedule();
}

export function stopMonitoring() {
  if (_timerId) {
    clearTimeout(_timerId);
    _timerId = null;
  }
}

export function isRunning() {
  return _timerId !== null;
}

/**
 * generateMarketReport — genera un reporte completo del mercado con IA
 * @param {object[]} purchases  historial de compras recientes
 * @returns {Promise<string>}
 */
export async function generateMarketReport(purchases) {
  if (!purchases.length) return "Sin datos suficientes para generar reporte.";

  const topProducts = {};
  let totalRevenue  = 0;
  const categorySales = {};

  purchases.forEach(p => {
    topProducts[p.product.name] = (topProducts[p.product.name] || 0) + p.total;
    totalRevenue += p.total;
    categorySales[p.product.category] = (categorySales[p.product.category] || 0) + p.total;
  });

  const topList = Object.entries(topProducts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([n, v]) => `  - ${n}: $${v.toFixed(2)}`)
    .join("\n");

  const catList = Object.entries(categorySales)
    .sort((a, b) => b[1] - a[1])
    .map(([c, v]) => `  - ${c}: $${v.toFixed(2)}`)
    .join("\n");

  const prompt = `Eres un analista financiero senior especializado en e-commerce espacial.

DATOS DE THE SPACE SHOP (últimas ${purchases.length} transacciones):
- Ingresos totales: $${totalRevenue.toFixed(2)}
- Ticket promedio: $${(totalRevenue / purchases.length).toFixed(2)}
- Transacciones: ${purchases.length}

Top 5 productos por ingresos:
${topList}

Ingresos por categoría:
${catList}

Genera un reporte financiero ejecutivo en español con estas secciones:
1. RESUMEN DE RENDIMIENTO
2. PRODUCTOS ESTRELLA
3. TENDENCIAS DE CATEGORÍA
4. ALERTAS Y OPORTUNIDADES
5. PROYECCIÓN (próximas 24h)

Sé preciso, usa los datos reales, máx 400 palabras.`;

  return callGemini(prompt);
}
