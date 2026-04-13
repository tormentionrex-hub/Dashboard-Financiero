import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react";

export default function SideNavBar() {
  const containerRef = useRef();
  const arrowRef = useRef();
  const sidebarRef = useRef();
  const [isOpen, setIsOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  // Detectar scroll para cambiar opacidad
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.85);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animación de entrada inicial
  useGSAP(() => {
    gsap.from(".side-item", {
      opacity: 0,
      x: -20,
      stagger: 0.1,
      duration: 0.8,
      ease: "back.out(1.7)"
    });

    // Pulso sutil en la flecha (loop)
    gsap.to(arrowRef.current, {
      x: -2,
      duration: 0.9,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, { scope: containerRef });

  // Toggle: solo animamos el sidebar — el botón es hijo y se mueve solo
  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    const SIDEBAR_WIDTH = 288; // w-72 = 18rem = 288px

    if (newState) {
      // Abrir
      gsap.to(sidebarRef.current, {
        x: 0,
        duration: 0.45,
        ease: "power3.out"
      });
      gsap.to(arrowRef.current, {
        rotation: 0,
        duration: 0.4,
        ease: "back.out(2)"
      });
    } else {
      // Cerrar: el botón va con el sidebar porque es su hijo
      gsap.to(sidebarRef.current, {
        x: -SIDEBAR_WIDTH,
        duration: 0.4,
        ease: "power3.in"
      });
      gsap.to(arrowRef.current, {
        rotation: 180,
        duration: 0.4,
        ease: "back.out(2)"
      });
    }
  };

  return (
    <div ref={containerRef} className="fixed top-16 left-0 z-40 h-[calc(100vh-4rem)]">

      {/* Sidebar — el botón vive DENTRO para moverse junto */}
      <aside
        ref={sidebarRef}
        className={`relative w-72 flex flex-col h-full border-r border-white/10 overflow-visible transition-colors duration-700 ${
          scrolled
            ? 'bg-[#0a0a0f]/85 backdrop-blur-xl shadow-[4px_0_30px_rgba(0,0,0,0.6)]'
            : 'bg-black/20 backdrop-blur-md'
        }`}
      >
        {/* ── Botón Toggle pegado al borde derecho del sidebar ── */}
        <button
          onClick={handleToggle}
          className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-400 border-2 border-indigo-400/60 shadow-[0_0_24px_rgba(99,102,241,0.7)] flex items-center justify-center z-50 transition-colors duration-200 group"
          title={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <span
            ref={arrowRef}
            className="material-symbols-outlined text-white text-xl select-none"
          >
            chevron_left
          </span>
        </button>

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

        {/* Navegación Principal */}
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
                  ? 'bg-indigo-500/20 text-white border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                  : 'text-white/60 hover:bg-white/10 hover:text-white border-transparent hover:border-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Footer del Sidebar */}
        <div className="p-6 border-t border-white/10 side-item">
          <div className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em]">Protocolo_Neural_v2.4</div>
        </div>
      </aside>
    </div>
  );
}
