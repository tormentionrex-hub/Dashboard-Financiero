import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react";

export default function SkillsSection() {
  const container = useRef();

  useGSAP(() => {
    // Micro-animación al entrar
    gsap.from(".skill-card", {
      opacity: 0,
      scale: 0.95,
      stagger: 0.1,
      duration: 1,
      ease: "back.out(1.7)"
    });
  }, { scope: container });

  return (
    <section ref={container} className="space-y-12">
      <div className="flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Protocolos de Habilidad</h2>
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Módulos de expansión neural v4.0</p>
        </div>
        <button className="text-indigo-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:text-white transition-all">
          Acceder_Directorio <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Análisis de Inventario */}
        <div className="skill-card cyber-glass p-10 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/30 shadow-xl transition-all group relative overflow-hidden">
          <div className="flex gap-8 relative z-10">
            <div className="flex-shrink-0 w-28 h-28 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all shadow-[0_0_20px_rgba(99,102,241,0.1)]">
              <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
            </div>
            <div>
              <div className="text-[9px] font-black text-indigo-400 mb-2 tracking-[0.3em] uppercase underline decoration-indigo-500/50 underline-offset-4">Modulo_Logistico</div>
              <h4 className="text-2xl font-black text-white mb-3 tracking-tight">Análisis de Inventario</h4>
              <p className="text-sm text-white/40 leading-relaxed mb-6 font-medium">Motor de predicción autónoma para la optimización de stock multicanal.</p>
              <div className="flex gap-3">
                <span className="bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase px-3 py-1 rounded-sm border border-indigo-500/20">Autonomo</span>
                <span className="bg-white/5 text-white/40 text-[9px] font-black uppercase px-3 py-1 rounded-sm border border-white/10">v.1.2</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity"></div>
        </div>

        {/* Reporte Dashboard HTML */}
        <div className="skill-card cyber-glass p-10 rounded-[2.5rem] border border-white/5 hover:border-cyan-500/30 shadow-xl transition-all group relative overflow-hidden">
          <div className="flex gap-8 relative z-10">
            <div className="flex-shrink-0 w-28 h-28 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all shadow-[0_0_20px_rgba(6,182,212,0.1)]">
              <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard_customize</span>
            </div>
            <div>
              <div className="text-[9px] font-black text-cyan-400 mb-2 tracking-[0.3em] uppercase underline decoration-cyan-500/50 underline-offset-4">Generador_Visual</div>
              <h4 className="text-2xl font-black text-white mb-3 tracking-tight">Reporte Dashboard HTML</h4>
              <p className="text-sm text-white/40 leading-relaxed mb-6 font-medium">Exportación de cuadros de mando de alta fidelidad compatibles con web.</p>
              <div className="flex gap-3">
                <span className="bg-cyan-500/10 text-cyan-400 text-[9px] font-black uppercase px-3 py-1 rounded-sm border border-cyan-500/20">Hi-Fi</span>
                <span className="bg-white/5 text-white/40 text-[9px] font-black uppercase px-3 py-1 rounded-sm border border-white/10">v.3.0</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity"></div>
        </div>
      </div>
    </section>
  );
}
