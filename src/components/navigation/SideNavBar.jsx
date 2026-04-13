import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react";

export default function SideNavBar() {
  const containerRef = useRef();

  useGSAP(() => {
    gsap.from(".side-item", {
       opacity: 0,
       x: -20,
       stagger: 0.1,
       duration: 0.8,
       ease: "back.out(1.7)"
    });
  }, { scope: containerRef });

  return (
    <aside ref={containerRef} className="w-72 cyber-glass border-r border-white/5 flex flex-col fixed h-[calc(100vh-4rem)] top-16 left-0 z-40">
      {/* Perfil Neural */}
      <div className="p-8 border-b border-white/5 side-item">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <span className="material-symbols-outlined text-2xl">neurology</span>
          </div>
          <div>
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Núcleo Neural</h3>
            <span className="text-[8px] font-bold text-indigo-400/60 uppercase tracking-tighter">Online_v.2.4</span>
          </div>
        </div>
      </div>

      {/* Navegación Principal */}
      <nav className="flex-grow p-6 space-y-4">
        {[
          { icon: 'grid_view', label: 'Resumen', active: true },
          { icon: 'psychology', label: 'Agentes IA' },
          { icon: 'notifications_active', label: 'Alertas_Int' },
          { icon: 'receipt_long', label: 'Impuestos' },
          { icon: 'history', label: 'Historial' },
        ].map((item, idx) => (
          <div 
            key={idx} 
            className={`side-item flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border border-transparent ${
              item.active 
              ? 'bg-indigo-500/10 text-white border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
              : 'text-white/40 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Footer del Sidebar */}
      <div className="p-8 border-t border-white/5 bg-white/5 side-item">
         <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Protocolo_Neural_v2.4</div>
      </div>
    </aside>
  );
}
