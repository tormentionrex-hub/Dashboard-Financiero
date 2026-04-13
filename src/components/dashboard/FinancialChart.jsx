import React from 'react';

export default function FinancialChart({ onGenerar, cargando }) {
  return (
    <section className="cyber-glass p-10 pb-32 rounded-[3.5rem] shadow-2xl relative overflow-hidden border border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 relative z-10">
        <div>
          <h2 className="text-4xl font-black text-white mb-3 uppercase tracking-tighter">Telemetría Financiera</h2>
          <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.4em] opacity-60">Escaneo de activos v2.4 // Orbital_Sync</p>
        </div>
        <div className="flex gap-3 p-1.5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
          <button className="px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-indigo-500 text-white shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all">En_Vivo</button>
          <button className="px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">Histórico</button>
        </div>
      </div>
      <div className="h-96 flex items-end gap-3 md:gap-6 pb-8 border-b border-white/10 relative z-10">
        {[
          { label: 'Ene', h1: 80, h2: 40, h3: 20 },
          { label: 'Feb', h1: 65, h2: 45, h3: 15 },
          { label: 'Mar', h1: 90, h2: 30, h3: 25 },
          { label: 'Abr', h1: 75, h2: 50, h3: 20 },
          { label: 'May', h1: 85, h2: 35, h3: 10 },
          { label: 'Jun', h1: 95, h2: 60, h3: 30 }
        ].map((item, idx) => (
          <div key={idx} className="flex-1 flex flex-col justify-end h-full group">
            <div className="flex gap-2 h-full items-end pb-2">
              <div style={{ height: `${item.h1}%` }} className="w-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)] rounded-t-md transition-all group-hover:bg-indigo-400 group-hover:scale-x-105"></div>
              <div style={{ height: `${item.h2}%` }} className="w-full bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] rounded-t-md transition-all group-hover:bg-cyan-300 group-hover:scale-x-105"></div>
              <div style={{ height: `${item.h3}%` }} className="w-full bg-slate-700/50 rounded-t-md transition-all group-hover:bg-slate-600 group-hover:scale-x-105"></div>
            </div>
            <span className="text-[10px] font-black text-white/20 mt-6 text-center uppercase tracking-[0.2em]">{item.label}</span>
          </div>
        ))}
      </div>
      {/* Botón Adjustado: Más abajo y con diseño más industrial */}
      <div className="absolute bottom-10 left-0 w-full px-10 flex justify-end z-20">
        <button 
          onClick={onGenerar}
          disabled={cargando}
          className={`bg-white text-black flex items-center gap-6 px-12 py-6 rounded-sm font-black text-xs uppercase tracking-[0.3em] shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(99,102,241,0.6)] hover:bg-indigo-500 hover:text-white transition-all transform hover:-translate-y-2 active:scale-95 border border-white/20 ${cargando ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className={`material-symbols-outlined font-black ${cargando ? 'animate-spin' : 'animate-pulse'}`}>
            {cargando ? 'sync' : 'auto_awesome'}
          </span>
          <span>{cargando ? 'Sincronizando_IA...' : 'Ejecutar_Analisis_Neural'}</span>
        </button>
      </div>
    </section>
  );
}
