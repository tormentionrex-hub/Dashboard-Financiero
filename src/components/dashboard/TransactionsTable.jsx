import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react";

export default function TransactionsTable() {
  const containerRef = useRef();

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(containerRef.current, {
      opacity: 0,
      y: 50,
      rotateX: -10,
      duration: 1.5,
      ease: "power3.out"
    });
    
    // Animate inner elements (title, buttons, table rows) after container
    tl.from(".tx-anim", {
      opacity: 0,
      x: -20,
      stagger: 0.1,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.8");

    gsap.to(containerRef.current, {
      y: -10,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1.5
    });
  }, { scope: containerRef });

  const transactions = [
    { name: 'Suscripción AWS Cloud', category: 'Infraestructura',   date: '14 Oct, 2024', status: 'Gasto',     amount: '-$1,240.00',  icon: 'shopping_cart' },
    { name: 'Pago Factura #892',     category: 'Servicios Pro',      date: '12 Oct, 2024', status: 'Ingreso',   amount: '+$15,600.00', icon: 'payments'      },
    { name: 'Inversión Semilla Serie A', category: 'Capital de Riesgo', date: '10 Oct, 2024', status: 'Inversión', amount: '-$50,000.00', icon: 'rocket_launch' }
  ];

  return (
    <section ref={containerRef} className="bg-black p-8 md:p-10 rounded-[2.5rem] border border-cyan-500/30 shadow-[0_15px_40px_rgba(6,182,212,0.15)] hover:shadow-[0_20px_50px_rgba(99,102,241,0.25)] transition-shadow duration-700 relative overflow-hidden group">
      {/* Luz nebular superior */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-indigo-500/20 to-transparent blur-[40px] pointer-events-none"></div>

      <div className="flex justify-between items-center mb-8 relative z-10">
        <h2 className="tx-anim text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-300 to-indigo-500 tracking-wide uppercase drop-shadow-[0_2px_15px_rgba(6,182,212,0.5)]">
          Transacciones Clasificadas
        </h2>
        <div className="tx-anim flex gap-3 text-white/50">
          <button className="p-2 border border-white/10 rounded-xl hover:bg-white/10 hover:border-cyan-400 hover:text-cyan-300 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
          <button className="p-2 border border-white/10 rounded-xl hover:bg-white/10 hover:border-cyan-400 hover:text-cyan-300 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="tx-anim border-b border-white/10">
              <th className="pb-4 px-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Transacción</th>
              <th className="pb-4 px-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Fecha</th>
              <th className="pb-4 px-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Categoría</th>
              <th className="pb-4 px-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Capital Neto</th>
              <th className="pb-4 px-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Estado</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, idx) => (
              <tr key={idx} className="tx-anim border-b border-white/5 hover:bg-gradient-to-r hover:from-white/5 hover:to-transparent transition-all">
                <td className="py-5 px-4 font-black text-cyan-400 text-xs tracking-tighter uppercase">{tx.name}</td>
                <td className="py-5 px-4 text-white/50 text-[10px] font-bold font-mono tracking-widest">{tx.date}</td>
                <td className="py-5 px-4 text-indigo-300 text-[10px] font-bold uppercase tracking-widest">{tx.category}</td>
                <td className="py-5 px-4 text-white font-black text-xs tracking-wider">{tx.amount}</td>
                <td className="py-5 px-4">
                  <span className={`px-3 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest border ${
                    tx.status === 'Gasto' || tx.status === 'Inversión'
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                    : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  }`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
