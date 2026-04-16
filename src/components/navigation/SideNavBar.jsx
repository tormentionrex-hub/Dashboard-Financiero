import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react";
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { icon: 'grid_view',            label: 'Resumen',          route: '/'       },
  { icon: 'psychology',           label: 'Agentes IA',       route: '/agents' },
  { icon: 'notifications_active', label: 'Alertas',          route: null      },
  { icon: 'receipt_long',         label: 'Impuestos',        route: null      },
  { icon: 'history',              label: 'Historial',        route: null      },
];

export default function SideNavBar({ isOpen, onToggle }) {
  const containerRef = useRef();
  const arrowRef     = useRef();
  const sidebarRef   = useRef();
  const buttonRef    = useRef();
  const [scrolled, setScrolled] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Posición inicial cerrada */
  useEffect(() => {
    gsap.set(sidebarRef.current, { x: -288 });
    gsap.set(buttonRef.current,  { left: 0 });
    gsap.set(arrowRef.current,   { rotation: 180 });
  }, []);

  /* Animación de abrir / cerrar */
  useEffect(() => {
    const DUR_OPEN  = 0.45;
    const DUR_CLOSE = 0.42;
    if (isOpen) {
      gsap.to(sidebarRef.current, { x: 0,    duration: DUR_OPEN,  ease: "power3.out" });
      gsap.to(buttonRef.current,  { left: 288, duration: DUR_OPEN, ease: "power3.out" });
      gsap.to(arrowRef.current,   { rotation: 0,   duration: 0.35, ease: "back.out(2)" });
    } else {
      gsap.to(sidebarRef.current, { x: -288, duration: DUR_CLOSE, ease: "power3.in" });
      gsap.to(buttonRef.current,  { left: 0,  duration: DUR_CLOSE, ease: "power3.in" });
      gsap.to(arrowRef.current,   { rotation: 180, duration: 0.35, ease: "back.out(2)" });
    }
  }, [isOpen]);

  useGSAP(() => {
    gsap.from(".side-item", {
      opacity: 0, x: -20, stagger: 0.07,
      duration: 0.7, ease: "back.out(1.7)"
    });
    gsap.to(arrowRef.current, {
      x: -2, duration: 1.0, repeat: -1, yoyo: true, ease: "sine.inOut"
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>

      {/* ══ BOTÓN TOGGLE ══ */}
      <button
        ref={buttonRef}
        onClick={onToggle}
        title={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        style={{
          position: 'fixed', top: '50%', left: '0px',
          transform: 'translateY(-50%)', zIndex: 60,
        }}
        className="group flex items-center justify-center w-10 h-24 rounded-r-3xl
          bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-500
          hover:from-indigo-600 hover:via-indigo-500 hover:to-indigo-400
          border-r-2 border-t-2 border-b-2 border-indigo-400/70
          shadow-[6px_0_30px_rgba(99,102,241,0.85),0_0_18px_rgba(99,102,241,0.4)]
          hover:shadow-[10px_0_45px_rgba(99,102,241,1),0_0_25px_rgba(99,102,241,0.6)]
          transition-shadow duration-300"
      >
        <span ref={arrowRef} className="material-symbols-outlined text-white text-[26px] select-none drop-shadow-[0_0_12px_rgba(255,255,255,1)]">
          chevron_left
        </span>
      </button>

      {/* ══ SIDEBAR ══ */}
      <aside
        ref={sidebarRef}
        className={`fixed top-16 left-0 w-72 flex flex-col h-[calc(100vh-4rem)] overflow-hidden z-40 transition-colors duration-700 ${
          scrolled
            ? 'bg-[#07070f]/95 backdrop-blur-2xl'
            : 'bg-[#05050e]/80 backdrop-blur-xl'
        }`}
        style={{ borderRight: '1px solid rgba(255,255,255,0.07)' }}
      >

        {/* ── Cabecera / Perfil ── */}
        <div className="px-6 py-7 side-item" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-4">
            {/* Avatar con gradiente y glow */}
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center
                bg-gradient-to-br from-indigo-600 to-indigo-900
                shadow-[0_0_20px_rgba(99,102,241,0.45)]
                border border-indigo-500/40">
                <span className="material-symbols-outlined text-indigo-200 text-xl" style={{ fontVariationSettings:"'FILL' 1" }}>
                  rocket_launch
                </span>
              </div>
              {/* Indicador online */}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#05050e] shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
            </div>
            <div>
              <p className="text-white text-sm font-bold tracking-tight leading-none mb-1">NASA Space Shop</p>
              <p className="text-emerald-400 text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
                En línea
              </p>
            </div>
          </div>
        </div>

        {/* ── Navegación ── */}
        <nav className="flex-grow px-4 py-5 space-y-1 overflow-y-auto">
          <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.35em] px-3 mb-3">Navegación</p>
          {NAV_ITEMS.map((item, idx) => {
            const isActive  = item.route && location.pathname === item.route;
            const disabled  = !item.route;
            return (
              <div
                key={idx}
                onClick={() => item.route && navigate(item.route)}
                className={`side-item relative flex items-center gap-3.5 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-500/20 text-white'
                    : disabled
                    ? 'text-white/25 cursor-not-allowed'
                    : 'text-white/60 hover:bg-white/6 hover:text-white'
                }`}
              >
                {/* Acento lateral activo */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                )}

                {/* Ícono con fondo sutil */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-500/30 text-indigo-300 shadow-[0_0_14px_rgba(99,102,241,0.3)]'
                    : disabled
                    ? 'bg-white/4 text-white/20'
                    : 'bg-white/6 text-white/50 group-hover:bg-white/10'
                }`}>
                  <span className="material-symbols-outlined text-[18px]" style={isActive ? { fontVariationSettings:"'FILL' 1" } : {}}>{item.icon}</span>
                </div>

                <span className={`text-[11px] font-bold tracking-wider ${isActive ? 'text-white' : ''}`}>{item.label}</span>

                {/* Badge activo */}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.9)]"></span>
                )}
              </div>
            );
          })}
        </nav>

        {/* ── Sección inferior ── */}
        <div className="px-4 py-5 side-item" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Tarjeta de estado */}
          <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-900/40 to-indigo-950/60 border border-indigo-500/20">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-indigo-400 text-lg">auto_awesome</span>
              <p className="text-white/80 text-[11px] font-bold">Panel de Control</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Sistema</p>
                <p className="text-xs font-bold text-indigo-300">Operativo</p>
              </div>
              <div className="flex gap-1">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`w-1 rounded-full transition-all ${i <= 3 ? 'bg-indigo-400 h-4' : 'bg-white/15 h-2'}`}
                    style={i <= 3 ? { boxShadow:'0 0 6px rgba(99,102,241,0.6)' } : {}}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </aside>
    </div>
  );
}
