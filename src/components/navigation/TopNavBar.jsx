import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react";

export default function TopNavBar() {
  const logoRef = useRef();

  useGSAP(() => {
    gsap.from(logoRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 1,
      ease: "power2.out"
    });
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 cyber-glass border-b border-white/5 flex justify-between items-center px-10 h-16">
      <div className="flex items-center gap-10">
        <span ref={logoRef} className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
          AIFINANCE
        </span>
        <nav className="hidden md:flex gap-8 items-center">
          <a className="text-indigo-400 border-b-2 border-indigo-500 pb-1 font-bold text-xs uppercase tracking-widest hover:text-white transition-all" href="#">Dashboard</a>
          <a className="text-white/40 font-bold text-xs uppercase tracking-widest hover:text-white transition-all" href="#">Analíticas</a>
          <a className="text-white/40 font-bold text-xs uppercase tracking-widest hover:text-white transition-all" href="#">Portafolio</a>
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex gap-4">
          <button className="p-2 text-white/60 hover:text-indigo-400 transform hover:scale-110 transition-all">
            <span className="material-symbols-outlined font-bold">notifications</span>
          </button>
          <button className="p-2 text-white/60 hover:text-indigo-400 transform hover:scale-110 transition-all">
            <span className="material-symbols-outlined font-bold">settings</span>
          </button>
        </div>
        <button className="bg-white text-black hover:bg-indigo-500 hover:text-white px-6 py-2 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all active:scale-95">
          Conectar_Billetera
        </button>
      </div>
    </header>
  );
}
