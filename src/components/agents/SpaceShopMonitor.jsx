// ─────────────────────────────────────────────────────────────────────────────
//  SpaceShopMonitor — Agente 1: Monitoreo de compras en tiempo real
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useAgents } from "../../context/AgentsContext";
import { useAiAnalysis } from "../../context/AiContext";
import { SPACE_SHOP_PRODUCTS } from "../../data/spaceShopData";

const CATEGORY_COLORS = {
  "Modelos":           "text-cyan-400 border-cyan-500/40 bg-cyan-500/10",
  "Meteoritos":        "text-orange-400 border-orange-500/40 bg-orange-500/10",
  "Parches":           "text-yellow-400 border-yellow-500/40 bg-yellow-500/10",
  "Comida Espacial":   "text-green-400 border-green-500/40 bg-green-500/10",
  "Juguetes":          "text-pink-400 border-pink-500/40 bg-pink-500/10",
  "Ropa y Accesorios": "text-violet-400 border-violet-500/40 bg-violet-500/10",
  "Hogar y Regalos":   "text-blue-400 border-blue-500/40 bg-blue-500/10",
};

function fmt$(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function timeAgo(date) {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60) return `hace ${Math.floor(diff)}s`;
  return `hace ${Math.floor(diff / 60)}m`;
}

function fmtCat(cat) {
  const MAP = {
    "Modelos":           "Modelos",
    "Meteoritos":        "Meteoritos",
    "Parches":           "Parches",
    "Comida Espacial":   "Comida Espacial",
    "Juguetes":          "Juguetes",
    "Ropa y Accesorios": "Ropa y Accesorios",
    "Hogar y Regalos":   "Hogar y Regalos",
  };
  return MAP[cat] || cat;
}

// ── Tarjeta de estadística ────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = "cyan" }) {
  const COLOR = {
    cyan:   "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-300",
    indigo: "from-indigo-500/20 to-indigo-500/5 border-indigo-500/30 text-indigo-300",
    green:  "from-green-500/20 to-green-500/5 border-green-500/30 text-green-300",
    violet: "from-violet-500/20 to-violet-500/5 border-violet-500/30 text-violet-300",
  }[color];

  return (
    <div className={`stat-card rounded-2xl border bg-gradient-to-br p-5 ${COLOR}`}>
      <div className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">{label}</div>
      <div className="text-2xl font-black leading-none mb-1">{value}</div>
      {sub && <div className="text-[10px] opacity-60">{sub}</div>}
    </div>
  );
}

// ── Fila de compra ─────────────────────────────────────────────────────────────
function PurchaseRow({ purchase, isNew }) {
  const rowRef = useRef();
  const catCls = CATEGORY_COLORS[purchase.product.category] || "text-white/60 border-white/20 bg-white/5";

  useEffect(() => {
    if (isNew && rowRef.current) {
      gsap.fromTo(rowRef.current,
        { opacity: 0, x: -30, backgroundColor: "rgba(6,182,212,0.15)" },
        { opacity: 1, x: 0, backgroundColor: "transparent", duration: 0.6, ease: "power3.out" }
      );
    }
  }, [isNew]);

  return (
    <div ref={rowRef} className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/8">
      {/* Icono */}
      <span className="text-2xl w-8 text-center flex-shrink-0">{purchase.product.icon}</span>

      {/* Producto */}
      <div className="flex-grow min-w-0">
        <div className="text-[11px] font-bold text-white/90 truncate">{purchase.product.name}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${catCls}`}>
            {fmtCat(purchase.product.category)}
          </span>
          <span className="text-[9px] text-white/40">{purchase.location}</span>
        </div>
      </div>

      {/* Qty + total */}
      <div className="text-right flex-shrink-0">
        <div className="text-sm font-black text-green-400">{fmt$(purchase.total)}</div>
        <div className="text-[9px] text-white/40">
          ×{purchase.qty} · {timeAgo(purchase.timestamp)}
          {purchase.discount > 0 && (
            <span className="ml-1 text-yellow-400">-{purchase.discount}%</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function SpaceShopMonitor() {
  const { state, startMarket, stopMarket, requestMarketReport } = useAgents();
  const { runAnalysis, isAnalyzed } = useAiAnalysis();
  const { status, purchases, insights, stats, report, reportLoading } = state.market;
  const containerRef = useRef();
  const isActive = status === "ACTIVE" || status === "PROCESSING";

  useGSAP(() => {
    gsap.from(".monitor-header", { opacity: 0, y: -20, duration: 0.8, ease: "power3.out" });
    gsap.from(".stat-card",      { opacity: 0, y: 20, stagger: 0.1, duration: 0.7, ease: "back.out(1.5)", delay: 0.3 });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="monitor-header flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛸</span>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-widest">
                The Space Shop — Monitor en Tiempo Real
              </h2>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">
                ORION · Motor IA Local · {SPACE_SHOP_PRODUCTS.length} productos reales
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {isActive && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/30">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[9px] font-black text-green-400 uppercase tracking-wider">EN VIVO</span>
            </div>
          )}

          <button
            onClick={isActive ? stopMarket : startMarket}
            className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border ${
              isActive
                ? "bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/30"
                : "bg-cyan-500/20 text-cyan-400 border-cyan-500/40 hover:bg-cyan-500/30"
            }`}
          >
            {isActive ? "⏹ Detener Monitoreo" : "▶ Iniciar Monitoreo"}
          </button>

          {purchases.length >= 10 && (
            <button
              onClick={() => {
                requestMarketReport();
                runAnalysis();
              }}
              disabled={reportLoading}
              className="px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 hover:bg-indigo-500/30 transition-all disabled:opacity-50"
            >
              {reportLoading ? "⏳ Generando reporte…" : isAnalyzed ? "✓ Enviado al Dashboard" : "📊 Generar Reporte IA"}
            </button>
          )}
        </div>
      </div>

      {/* ── Stats Grid ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Ingresos Totales"  value={fmt$(stats.totalRevenue)} sub={`${stats.totalTxns} transacciones`}    color="green" />
        <StatCard label="Ticket Promedio"   value={fmt$(stats.avgTicket)}    sub="valor promedio por compra"             color="cyan"  />
        <StatCard label="Categoría Líder"   value={stats.topCategory}        sub="mayor volumen de ventas"               color="violet"/>
        <StatCard label="Total Transacciones" value={stats.totalTxns}        sub="en esta sesión activa"                 color="indigo"/>
      </div>

      {/* ── Feed de compras + Insights ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Feed */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
            <span className="text-[11px] font-black text-white uppercase tracking-widest">
              Flujo de Compras en Tiempo Real
            </span>
            <span className="text-[9px] text-white/30">{purchases.length} registros</span>
          </div>

          {purchases.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-white/25">
              <span className="text-4xl mb-3">📡</span>
              <span className="text-[11px] uppercase tracking-widest">Esperando señal…</span>
              <span className="text-[9px] mt-1">Inicia el monitoreo para recibir datos en vivo</span>
            </div>
          ) : (
            <div className="h-80 overflow-y-auto custom-scrollbar px-2 py-2 space-y-1">
              {purchases.slice(0, 50).map((p, i) => (
                <PurchaseRow key={p.id} purchase={p} isNew={i === 0} />
              ))}
            </div>
          )}
        </div>

        {/* Insights */}
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 overflow-hidden">
          <div className="px-5 py-4 border-b border-indigo-500/20 flex items-center gap-2">
            <span className="text-indigo-400 text-sm">🧠</span>
            <span className="text-[11px] font-black text-indigo-300 uppercase tracking-widest">
              Perspectivas IA
            </span>
          </div>

          {insights.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-indigo-300/30">
              <span className="text-3xl mb-2">💡</span>
              <span className="text-[10px] uppercase tracking-wider text-center px-4">
                Las perspectivas aparecen cada 12 transacciones
              </span>
            </div>
          ) : (
            <div className="p-4 space-y-4 h-80 overflow-y-auto custom-scrollbar">
              {insights.map((ins, i) => (
                <div key={i} className="rounded-xl border border-indigo-500/20 bg-indigo-500/8 p-4">
                  <p className="text-[11px] text-indigo-100/80 leading-relaxed">{ins.text}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[8px] text-indigo-400/50 uppercase tracking-wider">
                      Txn #{ins.purchaseCount}
                    </span>
                    <span className="text-[8px] text-indigo-400/50">
                      {new Date(ins.timestamp).toLocaleTimeString("es")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Reporte de IA ─────────────────────────────────────────────────── */}
      {report && (
        <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/30 p-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xl">📋</span>
            <h3 className="text-[13px] font-black text-indigo-200 uppercase tracking-widest">
              Reporte Ejecutivo de Mercado
            </h3>
          </div>
          <div className="text-[12px] text-indigo-50/75 leading-relaxed whitespace-pre-wrap font-mono">
            {report}
          </div>
        </div>
      )}
    </div>
  );
}
