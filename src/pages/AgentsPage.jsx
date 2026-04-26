// ─────────────────────────────────────────────────────────────────────────────
//  AgentsPage — Centro de Mando Multi-Agente
//  ORION · ATLAS · NOVA — 100% local, sin dependencia de API externa
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { AgentsProvider } from "../context/AgentsContext";
import TopNavBar             from "../components/navigation/TopNavBar";
import SideNavBar            from "../components/navigation/SideNavBar";
import AgentStatusPanel      from "../components/agents/AgentStatusPanel";
import SpaceShopMonitor      from "../components/agents/SpaceShopMonitor";
import AgentNetworkAnimation from "../components/agents/AgentNetworkAnimation";
import { AGENTS_META }       from "../services/agents/agentBus";
import backgroundVideo from '../images/backgroundVideo.mp4';

gsap.registerPlugin();

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "market",   icon: "🛸", label: "ORION — Mercado",       sub: "Compras en tiempo real"      },
];

function TabBar({ active, onChange }) {
  return (
    <div className="flex gap-2 p-1 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl">
      {TABS.map((tab, i) => {
        const agent = AGENTS_META[i];
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
              active === tab.id
                ? "bg-white/10 border shadow-lg"
                : "hover:bg-white/5 border border-transparent"
            }`}
            style={active === tab.id ? {
              borderColor: `${agent.color}55`,
              boxShadow:   `0 0 20px ${agent.colorGlow}`,
            } : {}}
          >
            <span className="text-lg">{tab.icon}</span>
            <div className="text-left hidden sm:block">
              <p
                className="text-[10px] font-black uppercase tracking-widest leading-none"
                style={{ color: active === tab.id ? agent.color : "rgba(255,255,255,0.5)" }}
              >
                {tab.label}
              </p>
              <p className="text-[8px] text-white/25 mt-0.5">{tab.sub}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── Tarjeta de descripción de agente ─────────────────────────────────────────
function AgentCard({ agent }) {
  return (
    <div
      className="flex-1 rounded-2xl p-4 border bg-black/30 backdrop-blur-sm transition-all"
      style={{ borderColor: `${agent.color}33` }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{
            background: `${agent.color}18`,
            border: `1px solid ${agent.color}44`,
            boxShadow: `0 0 12px ${agent.colorGlow}`,
          }}
        >
          {agent.icon}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-[11px] font-black uppercase tracking-widest"
              style={{ color: agent.color }}
            >
              {agent.name}
            </span>
            <span className="text-[8px] text-white/30 uppercase tracking-wider border border-white/10 px-1.5 py-0.5 rounded-full">
              {agent.role}
            </span>
          </div>
          <p className="text-[10px] text-white/45 leading-relaxed">
            {agent.description}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Inner page ────────────────────────────────────────────────────────────────
function AgentsContent() {
  const [activeTab,   setActiveTab]   = useState("market");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef();

  useGSAP(() => {
    gsap.from(".page-hero",    { opacity: 0, y: -30, duration: 1,   ease: "power4.out" });
    gsap.from(".tab-section",  { opacity: 0, y: 30,  duration: 0.8, delay: 0.3, ease: "power3.out" });
    gsap.from(".agent-cards",  { opacity: 0, y: 20,  duration: 0.7, delay: 0.5, ease: "power3.out" });
    gsap.from(".network-anim", { opacity: 0, scale: 0.92, duration: 0.8, delay: 0.7, ease: "power3.out" });
  }, { scope: contentRef });

  const handleTabChange = (id) => {
    if (id === activeTab) return;
    gsap.to(".tab-content", {
      opacity: 0, y: 15, duration: 0.2, ease: "power2.in",
      onComplete: () => {
        setActiveTab(id);
        gsap.fromTo(".tab-content",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0,  duration: 0.35, ease: "power3.out" }
        );
      }
    });
  };

  return (
    <div ref={contentRef} className="text-white min-h-screen relative bg-transparent">
      {/* Fondo cinemático Global */}
      <div className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden pointer-events-none">
        <video
          src={backgroundVideo}
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-[0.5] contrast-[1.1] z-0 pointer-events-none"
        />
        <div className="absolute inset-0 bg-black/40 z-[1] pointer-events-none"></div>
      </div>

      {/* Estructura */}
      <div className="relative z-10">
        <TopNavBar />
        <div className="flex pt-16">
          <SideNavBar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(o => !o)} />

          <main className="flex-grow min-w-0">
            {/* Hero */}
            <div className="page-hero px-8 md:px-16 pt-12 pb-8">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                  🧠
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider leading-none">
                    Centro de Mando — Agentes IA
                  </h1>
                  <p className="text-[11px] text-white/40 uppercase tracking-widest mt-1">
                    Sistema Multi-Agente · Motor Local · Sin dependencia de API
                  </p>
                </div>
              </div>
              <p className="text-[12px] text-white/50 max-w-2xl leading-relaxed mt-4 pl-16">
                Tres agentes de inteligencia artificial operando simultáneamente con motor local propio:
                <strong className="text-indigo-400"> ORION</strong> monitorea el mercado,
                <strong className="text-emerald-400"> ATLAS</strong> procesa documentos y
                <strong className="text-amber-400"> NOVA</strong> atiende al cliente — comunicándose entre sí en tiempo real.
              </p>
            </div>

            {/* Contenido principal */}
            <div className="relative px-8 md:px-16 pb-16 space-y-8">
              <div className="absolute inset-0 bg-black/55 pointer-events-none z-0" />

              <div className="relative z-10 space-y-8">
                {/* Panel de estado */}
                <AgentStatusPanel />

                {/* Tarjetas de descripción de agentes */}
                <div className="agent-cards flex flex-col sm:flex-row gap-3">
                  {AGENTS_META.map(agent => (
                    <AgentCard key={agent.id} agent={agent} />
                  ))}
                </div>

                {/* Tab bar */}
                <div className="tab-section">
                  <TabBar active={activeTab} onChange={handleTabChange} />
                </div>

                {/* Contenido del tab activo */}
                <div className="tab-content rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-8">
                  {activeTab === "market"   && <SpaceShopMonitor />}
                </div>

                {/* ── ANIMACIÓN DE RED NEURONAL ── */}
                <div className="network-anim rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8">
                  <div className="mb-6 text-center">
                    <h2 className="text-[13px] font-black uppercase tracking-widest text-white/70">
                      Red de Comunicación Inter-Agente
                    </h2>
                    <p className="text-[10px] text-white/30 mt-1">
                      Los agentes comparten datos en tiempo real. Activa uno para ver el flujo de comunicación.
                    </p>
                  </div>

                  <AgentNetworkAnimation />

                  {/* Descripción del protocolo */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        color:   "#6366f1",
                        title:   "ORION → NOVA",
                        detail:  "Cada insight de mercado generado por ORION se inyecta en el contexto de NOVA, enriqueciendo sus respuestas con datos de ventas en tiempo real.",
                      },
                      {
                        color:   "#10b981",
                        title:   "ATLAS → ORION",
                        detail:  "Cuando ATLAS finaliza el análisis de un documento, notifica a ORION vía bus de eventos para correlacionar con datos de compras activas.",
                      },
                      {
                        color:   "#f59e0b",
                        title:   "NOVA → ATLAS",
                        detail:  "Las consultas de clientes son registradas por NOVA y emitidas al bus. ATLAS puede procesarlas como documentos de feedback en tiempo real.",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="rounded-xl p-3 border bg-black/20"
                        style={{ borderColor: `${item.color}25` }}
                      >
                        <p
                          className="text-[9px] font-black uppercase tracking-widest mb-1.5"
                          style={{ color: item.color }}
                        >
                          {item.title}
                        </p>
                        <p className="text-[9px] text-white/35 leading-relaxed">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/8">
                  <div className="flex items-center gap-6">
                    {[
                      { icon: "🛸", label: "86 productos · The Space Shop" },
                      { icon: "⚡", label: "Motor IA 100% local" },
                      { icon: "🔗", label: "3 agentes sincronizados" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-sm">{item.icon}</span>
                        <span className="text-[9px] text-white/30 uppercase tracking-widest">{item.label}</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-[9px] text-white/20 uppercase tracking-widest">
                    AIFinance · Protocolo Neural v3.0 · Sin API
                  </span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function AgentsPage() {
  return (
    <AgentsProvider>
      <AgentsContent />
    </AgentsProvider>
  );
}
