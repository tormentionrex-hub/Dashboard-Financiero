// ─────────────────────────────────────────────────────────────────────────────
//  AGENTE 1 — ORION · Market Intelligence
//  Simula compras en tiempo real y genera insights con IA local (sin API)
// ─────────────────────────────────────────────────────────────────────────────

import { getRandomProduct, getRandomLocation, getRandomQty } from "../../data/spaceShopData";
import { generateMarketInsight, generateMarketReport as buildReport } from "./localAI";
import { agentBus } from "./agentBus";

// Intervalo entre compras: 2.5s – 6s (ms)
const MIN_INTERVAL = 2500;
const MAX_INTERVAL = 6000;

// Genera insight cada N compras
const INSIGHT_EVERY_N = 12;

let _timerId       = null;
let _purchaseCount = 0;
let _allPurchases  = [];

// ── Genera un objeto de compra ────────────────────────────────────────────────
function buildPurchase() {
  const product   = getRandomProduct();
  const qty       = getRandomQty(product);
  const total     = parseFloat((product.price * qty).toFixed(2));
  const discount  = Math.random() < 0.15 ? Math.round(Math.random() * 15 + 5) : 0;
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

export function startMonitoring(onPurchase, onInsight, onError) {
  if (_timerId) return;
  _purchaseCount = 0;
  _allPurchases  = [];

  const schedule = () => {
    const delay = MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL);
    _timerId = setTimeout(async () => {
      if (!_timerId) return;

      try {
        const purchase = buildPurchase();
        _purchaseCount++;
        _allPurchases.unshift(purchase);

        onPurchase(purchase);

        // Emitir al bus para que los demás agentes puedan escuchar
        agentBus.emit("market:purchase", purchase);

        // Cada N compras → insight local
        if (_purchaseCount % INSIGHT_EVERY_N === 0) {
          const text = generateMarketInsight(_allPurchases);
          const insight = { text, timestamp: new Date(), purchaseCount: _purchaseCount };
          onInsight(insight);
          agentBus.emit("market:insight", insight);
        }

        schedule();
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

export async function generateMarketReport(purchases) {
  if (!purchases.length) return "Sin datos suficientes para generar reporte.";
  // Simular pequeño delay de "procesamiento"
  await new Promise(r => setTimeout(r, 600));
  return buildReport(purchases);
}
