import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-10 px-8 bg-transparent border-t border-white/8">
      <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-7xl mx-auto gap-8">

        {/* Logo y copyright */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
            <span className="font-black text-white text-lg tracking-tight">AIFINANCE</span>
          </div>
          <p className="text-white/25 text-[10px] font-semibold uppercase tracking-widest">
            © 2024 AIFinance · Todos los derechos reservados
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-8">
          <a className="text-white/30 text-[10px] font-bold tracking-widest uppercase hover:text-indigo-400 transition-colors" href="#">
            Privacidad
          </a>
          <a className="text-white/30 text-[10px] font-bold tracking-widest uppercase hover:text-indigo-400 transition-colors" href="#">
            Términos
          </a>
          <a className="text-white/30 text-[10px] font-bold tracking-widest uppercase hover:text-indigo-400 transition-colors" href="#">
            Docs API
          </a>
        </div>

        {/* Íconos sociales */}
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-indigo-400 hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:scale-110 transition-all cursor-pointer">
            <span className="material-symbols-outlined text-base">public</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-indigo-400 hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:scale-110 transition-all cursor-pointer">
            <span className="material-symbols-outlined text-base">chat</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
