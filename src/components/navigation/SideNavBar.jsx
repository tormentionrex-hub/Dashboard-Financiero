import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react";

export default function SideNavBar({ isOpen, onToggle }) {
  const containerRef = useRef();
  const arrowRef     = useRef();
  const sidebarRef   = useRef();
  const buttonRef    = useRef();   // ← ref para animar el botón con GSAP (sync perfecto)
  const [scrolled, setScrolled] = useState(false);

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Posición inicial: ambos CERRADOS simultáneamente (sin animación)
  useEffect(() => {
    gsap.set(sidebarRef.current, { x: -288 });
    gsap.set(buttonRef.current,  { left: 0 });
    gsap.set(arrowRef.current,   { rotation: 180 }); // → indica "abrir"
  }, []);

  // Animar sidebar + botón con EXACTAMENTE la misma curva y duración → movimiento mutuo
  useEffect(() => {
    const DUR_OPEN  = 0.45;
    const DUR_CLOSE = 0.42;
    const EASE_OPEN  = "power3.out";
    const EASE_CLOSE = "power3.in";

    if (isOpen) {
      // Abrir: sidebar entra desde izquierda, botón sigue pegado a su borde derecho
      gsap.to(sidebarRef.current, { x: 0,   duration: DUR_OPEN,  ease: EASE_OPEN });
      gsap.to(buttonRef.current,  { left: 288, duration: DUR_OPEN,  ease: EASE_OPEN });
      gsap.to(arrowRef.current,   { rotation: 0,   duration: 0.35, ease: "back.out(2)" });
    } else {
      // Cerrar: sidebar sale hacia izquierda, botón regresa al borde de pantalla
      gsap.to(sidebarRef.current, { x: -288, duration: DUR_CLOSE, ease: EASE_CLOSE });
      gsap.to(buttonRef.current,  { left: 0,   duration: DUR_CLOSE, ease: EASE_CLOSE });
      gsap.to(arrowRef.current,   { rotation: 180, duration: 0.35, ease: "back.out(2)" });
    }
  }, [isOpen]);

  useGSAP(() => {
    gsap.from(".side-item", {
      opacity: 0, x: -20, stagger: 0.08,
      duration: 0.7, ease: "back.out(1.7)"
    });
    // Pulso sutil en la flecha
    gsap.to(arrowRef.current, {
      x: -2, duration: 1.0, repeat: -1, yoyo: true, ease: "sine.inOut"
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>

      {/* ══ BOTÓN TOGGLE — animado por GSAP (mismo timing que sidebar) ══ */}
      <button
        ref={buttonRef}
        onClick={onToggle}
        title={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        style={{
          position:  'fixed',
          top:       '50%',
          left:      '0px',          /* GSAP controla este valor */
          transform: 'translateY(-50%)',
          zIndex:    60,
        }}
        className="group flex items-center justify-center
          w-10 h-24 rounded-r-3xl
          bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-500
          hover:from-indigo-600 hover:via-indigo-500 hover:to-indigo-400
          border-r-2 border-t-2 border-b-2 border-indigo-400/70
          shadow-[6px_0_30px_rgba(99,102,241,0.85),0_0_18px_rgba(99,102,241,0.4)]
          hover:shadow-[10px_0_45px_rgba(99,102,241,1),0_0_25px_rgba(99,102,241,0.6)]
          transition-shadow duration-300"
      >
        <span
          ref={arrowRef}
          className="material-symbols-outlined text-white text-[26px] select-none
            drop-shadow-[0_0_12px_rgba(255,255,255,1)]"
        >
          chevron_left
        </span>
      </button>

      {/* ══ SIDEBAR — desliza desde la IZQUIERDA ══ */}
      <aside
        ref={sidebarRef}
        className={`fixed top-16 left-0 w-72 flex flex-col h-[calc(100vh-4rem)] border-r border-white/10 overflow-hidden transition-colors duration-700 z-40 ${
          scrolled
            ? 'bg-[#080810]/94 backdrop-blur-2xl shadow-[4px_0_40px_rgba(0,0,0,0.9)]'
            : 'bg-[#05050f]/75 backdrop-blur-xl'
        }`}
      >
        {/* Perfil Neural */}
        <div className="p-8 border-b border-white/10 side-item">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30 group-hover:scale-110 group-hover:bg-indigo-500/30 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              <span className="material-symbols-outlined text-2xl">neurology</span>
            </div>
            <div>
              <h3 className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Núcleo Neural</h3>
              <span className="text-[8px] font-bold text-indigo-400/80 uppercase tracking-tighter">Online_v.2.4</span>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-grow p-6 space-y-3">
          {[
            { icon: 'grid_view',            label: 'Resumen',    active: true },
            { icon: 'psychology',           label: 'Agentes IA'              },
            { icon: 'notifications_active', label: 'Alertas_Int'             },
            { icon: 'receipt_long',         label: 'Impuestos'               },
            { icon: 'history',              label: 'Historial'               },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`side-item flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${
                item.active
                  ? 'bg-indigo-500/25 text-white border-indigo-500/50 shadow-[0_0_25px_rgba(99,102,241,0.25)]'
                  : 'text-white/70 hover:bg-white/8 hover:text-white border-transparent hover:border-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              <span className="text-[11px] font-bold uppercase tracking-widest leading-none">{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-8 border-t border-white/10 side-item">
          <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Protocolo_Neural_v2.4</div>
        </div>
      </aside>
    </div>
  );
}
