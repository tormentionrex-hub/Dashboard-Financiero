// ─────────────────────────────────────────────────────────────────────────────
//  AgentsPage — Centro de Mando de Agentes IA
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { AgentsProvider } from "../context/AgentsContext";
import TopNavBar from "../components/navigation/TopNavBar";
import SideNavBar from "../components/navigation/SideNavBar";
import AgentStatusPanel   from "../components/agents/AgentStatusPanel";
import SpaceShopMonitor   from "../components/agents/SpaceShopMonitor";
import DocumentProcessor  from "../components/agents/DocumentProcessor";
import CustomerServiceBot from "../components/agents/CustomerServiceBot";
import BlackHoleBackground from "../components/dashboard/BlackHoleBackground";

gsap.registerPlugin();

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "market",   icon: "🛸", label: "Inteligencia de Mercado",    sub: "Compras en tiempo real"     },
  { id: "document", icon: "📂", label: "Inteligencia Documental",    sub: "Análisis de archivos con IA" },
  { id: "customer", icon: "🤖", label: "NOVA — Servicio al Cliente", sub: "Asistente IA 24/7"           },
];

function TabBar({ active, onChange }) {
  return (
    <div className="flex gap-2 p-1 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
            active === tab.id
              ? "bg-white/10 border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              : "hover:bg-white/5 border border-transparent"
          }`}
        >
          <span className="text-lg">{tab.icon}</span>
          <div className="text-left hidden sm:block">
            <p className={`text-[10px] font-black uppercase tracking-widest leading-none ${
              active === tab.id ? "text-white" : "text-white/50"
            }`}>{tab.label}</p>
            <p className="text-[8px] text-white/25 mt-0.5">{tab.sub}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

// ── Inner page (necesita AgentsProvider en el árbol) ─────────────────────────
function AgentsContent() {
  const [activeTab,   setActiveTab]   = useState("market");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef();

  useGSAP(() => {
    gsap.from(".page-hero", { opacity: 0, y: -30, duration: 1, ease: "power4.out" });
    gsap.from(".tab-section", { opacity: 0, y: 30, duration: 0.8, delay: 0.3, ease: "power3.out" });
  }, { scope: contentRef });

  const handleTabChange = (id) => {
    if (id === activeTab) return;
    gsap.to(".tab-content", {
      opacity: 0, y: 15, duration: 0.2, ease: "power2.in",
      onComplete: () => {
        setActiveTab(id);
        gsap.fromTo(".tab-content",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }
        );
      }
    });
  };

  return (
    <div ref={contentRef} className="text-white min-h-screen relative bg-[#050506]">
      {/* Fondo */}
      <div className="absolute top-0 left-0 w-full h-screen z-0 overflow-hidden pointer-events-none">
        <BlackHoleBackground isPlaying={true} />
      </div>

      {/* Estructura */}
      <div className="relative z-10">
        <TopNavBar />
        <div className="flex pt-16">
          <SideNavBar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(o => !o)} />

          <main className="flex-grow min-w-0">
            {/* Hero de la página */}
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
                    Sistema Multi-Agente · The Space Shop · Powered by Gemini 2.0 Flash
                  </p>
                </div>
              </div>

              {/* Descripción */}
              <p className="text-[12px] text-white/50 max-w-2xl leading-relaxed mt-4 pl-16">
                Tres agentes de inteligencia artificial operando simultáneamente: monitoreo de compras
                en tiempo real, análisis de documentos financieros y servicio al cliente autónomo.
              </p>
            </div>

            {/* Contenido principal */}
            <div className="relative px-8 md:px-16 pb-16 space-y-8">
              {/* Overlay de fondo para el contenido */}
              <div className="absolute inset-0 bg-black/55 pointer-events-none z-0" />

              <div className="relative z-10 space-y-8">
                {/* Panel de estado de agentes — siempre visible */}
                <AgentStatusPanel />

                {/* Tab bar */}
                <div className="tab-section">
                  <TabBar active={activeTab} onChange={handleTabChange} />
                </div>

                {/* Contenido del tab activo */}
                <div className="tab-content rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-8">
                  {activeTab === "market"   && <SpaceShopMonitor />}
                  {activeTab === "document" && <DocumentProcessor />}
                  {activeTab === "customer" && <CustomerServiceBot />}
                </div>

                {/* Info footer */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/8">
                  <div className="flex items-center gap-6">
                    {[
                      { icon: "🛸", label: "86 productos reales · The Space Shop" },
                      { icon: "🧠", label: "Gemini 2.0 Flash" },
                      { icon: "⚡", label: "3 agentes paralelos" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-sm">{item.icon}</span>
                        <span className="text-[9px] text-white/30 uppercase tracking-widest">{item.label}</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-[9px] text-white/20 uppercase tracking-widest">
                    AIFinance · Protocolo Neural v2.4
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

// ── Export envuelto en provider ───────────────────────────────────────────────
export default function AgentsPage() {
  return (
    <AgentsProvider>
      <AgentsContent />
    </AgentsProvider>
  );
}
