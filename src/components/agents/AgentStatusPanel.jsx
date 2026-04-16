// ─────────────────────────────────────────────────────────────────────────────
//  AgentStatusPanel — Panel de estado de los 3 agentes simultáneos
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useAgents } from "../../context/AgentsContext";

const STATUS_CONFIG = {
  IDLE:       { label: "En Espera",   dot: "bg-white/30",                 ring: "border-white/20",          glow: ""                                           },
  ACTIVE:     { label: "Activo",      dot: "bg-green-400 animate-pulse",  ring: "border-green-500/50",      glow: "shadow-[0_0_20px_rgba(34,197,94,0.2)]"      },
  PROCESSING: { label: "Procesando",  dot: "bg-yellow-400 animate-bounce",ring: "border-yellow-500/50",     glow: "shadow-[0_0_20px_rgba(234,179,8,0.2)]"      },
  ERROR:      { label: "Error",       dot: "bg-red-400 animate-pulse",    ring: "border-red-500/50",        glow: "shadow-[0_0_20px_rgba(239,68,68,0.2)]"      },
};

const AGENTS_META = [
  {
    key:     "market",
    icon:    "🛸",
    name:    "ORION — Mercado",
    sub:     "The Space Shop · Compras en tiempo real",
    color:   "from-indigo-600/25 to-indigo-800/10 border-indigo-500/25",
    metric:  (s) => ({ label: "Ingresos USD",   value: `$${s.market.stats.totalRevenue.toFixed(0)}` }),
    metric2: (s) => ({ label: "Transacciones",  value: s.market.stats.totalTxns }),
  },
  {
    key:     "document",
    icon:    "📡",
    name:    "ATLAS — Documentos",
    sub:     "Análisis de archivos · Motor local IA",
    color:   "from-emerald-600/25 to-emerald-800/10 border-emerald-500/25",
    metric:  (s) => ({ label: "Documentos",  value: s.document.results.length }),
    metric2: (s) => ({
      label: "Estado",
      value: s.document.status === "PROCESSING" ? "Analizando…" :
             s.document.results.length > 0      ? "Completado"  : "En espera"
    }),
  },
  {
    key:     "customer",
    icon:    "🤖",
    name:    "NOVA — Cliente",
    sub:     "Asistente IA 24/7 · Sin API",
    color:   "from-amber-600/25 to-amber-800/10 border-amber-500/25",
    metric:  (s) => ({ label: "Mensajes",  value: s.customer.messages.length }),
    metric2: (s) => ({ label: "Estado",    value: s.customer.isTyping ? "Respondiendo…" : "Disponible" }),
  },
];

// ── Tarjeta de agente ─────────────────────────────────────────────────────────
function AgentCard({ meta, state }) {
  const agentState = state[meta.key];
  const statusCfg  = STATUS_CONFIG[agentState.status] || STATUS_CONFIG.IDLE;
  const m1 = meta.metric(state);
  const m2 = meta.metric2(state);

  return (
    <div className={`agent-card rounded-2xl border bg-gradient-to-br p-5 transition-all ${meta.color} ${statusCfg.glow}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{meta.icon}</span>
          <div>
            <p className="text-[11px] font-black text-white uppercase tracking-wider leading-tight">{meta.name}</p>
            <p className="text-[9px] text-white/40 mt-0.5 leading-none">{meta.sub}</p>
          </div>
        </div>
        {/* Status badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${statusCfg.ring}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
          <span className="text-[8px] font-black text-white/70 uppercase tracking-widest leading-none">
            {statusCfg.label}
          </span>
        </div>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-black/25 border border-white/8 px-3 py-2">
          <p className="text-[8px] text-white/35 uppercase tracking-widest">{m1.label}</p>
          <p className="text-[15px] font-black text-white/85 leading-tight mt-0.5">{m1.value}</p>
        </div>
        <div className="rounded-xl bg-black/25 border border-white/8 px-3 py-2">
          <p className="text-[8px] text-white/35 uppercase tracking-widest">{m2.label}</p>
          <p className="text-[13px] font-black text-white/85 leading-tight mt-0.5 truncate">{m2.value}</p>
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function AgentStatusPanel() {
  const { state } = useAgents();
  const containerRef = useRef();

  const activeCount = [state.market.status, state.document.status, state.customer.status]
    .filter(s => s !== "IDLE").length;

  useGSAP(() => {
    gsap.from(".agent-card", {
      opacity: 0, y: 20, stagger: 0.1,
      duration: 0.7, ease: "back.out(1.5)"
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="space-y-4">
      {/* Título del panel */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <span className="text-lg">⚡</span>
          <div>
            <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Sistema Multi-Agente</h3>
            <p className="text-[9px] text-white/35">Motor local · Sin API · 3 agentes operando en paralelo</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          <span className={`w-2 h-2 rounded-full ${activeCount > 0 ? "bg-green-400 animate-pulse" : "bg-white/25"}`} />
          <span className="text-[9px] font-black text-white/60 uppercase tracking-wider">
            {activeCount}/{AGENTS_META.length} activos
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {AGENTS_META.map(meta => (
          <AgentCard key={meta.key} meta={meta} state={state} />
        ))}
      </div>
    </div>
  );
}
