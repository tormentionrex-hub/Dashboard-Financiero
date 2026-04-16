import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function MetricsGrid({ kpis }) {
  const container = useRef();

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });

    // Animación de entrada con rebote elástico
    tl.from(".metric-card", {
      opacity: 0,
      scale: 0.8,
      y: 50,
      stagger: 0.2,
      duration: 1.5,
      ease: "elastic.out(1, 0.5)"
    });

    // Animación de barras de progreso
    tl.from(".h-full.bg-gradient-to-r, .h-full.bg-indigo-500\\/40", {
      width: "0%",
      duration: 2,
      stagger: 0.2,
      ease: "power3.out"
    }, "<0.2");

    // Animación de conteo para los números
    tl.from(".metric-value", {
      innerText: 0,
      duration: 3,
      snap: { innerText: 1 },
      stagger: 0.2,
      ease: "power4.out"
    }, "<0.2");

    // Animación continua flotante para los recuadros
    gsap.to(".metric-card", {
      y: -8,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      stagger: 0.3,
      ease: "sine.inOut"
    });

  }, { scope: container });

  return (
    <section ref={container} className="grid grid-cols-1 md:grid-cols-3 gap-12">
      {/* MARGEN BRUTO */}
      <div className="metric-card cyber-glass p-10 rounded-3xl border border-indigo-500/10 hover:border-indigo-500/40 transition-all group relative overflow-hidden">
        <div className="flex justify-between items-start mb-8">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
            <span className="material-symbols-outlined font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
          </div>
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] bg-indigo-500/10 px-3 py-1 rounded-sm border border-indigo-500/20">Delta_+4.2%</span>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">MARGEN_BRUTO</p>
          <h3 className="text-5xl font-black tracking-tighter text-white flex items-baseline">
            <span className="metric-value">{Number(kpis?.margenBruto || 0).toFixed(1)}</span>
            <span className="text-indigo-500 text-xl ml-1">%</span>
          </h3>
        </div>
        <div className="mt-8 w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000" style={{ width: `${kpis?.margenBruto || 0}%` }}></div>
        </div>
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
      </div>

      {/* ROI */}
      <div className="metric-card cyber-glass p-10 rounded-3xl border border-indigo-500/10 hover:border-indigo-500/40 transition-all group relative overflow-hidden">
        <div className="flex justify-between items-start mb-8">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
            <span className="material-symbols-outlined font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
          </div>
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] bg-indigo-500/10 px-3 py-1 rounded-sm border border-indigo-500/20">Status_Sync</span>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">ROI_ANUAL</p>
          <h3 className="text-5xl font-black tracking-tighter text-white flex items-baseline">
            <span className="metric-value">{Number(kpis?.roi || 0).toFixed(1)}</span>
            <span className="text-indigo-500 text-xl ml-1">%</span>
          </h3>
        </div>
        <div className="mt-8 w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000" style={{ width: `${kpis?.roi || 0}%` }}></div>
        </div>
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
      </div>

      {/* PUNTO DE EQUILIBRIO */}
      <div className="metric-card cyber-glass p-10 rounded-3xl border border-indigo-500/10 hover:border-indigo-500/40 transition-all group relative overflow-hidden">
        <div className="flex justify-between items-start mb-8">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
            <span className="material-symbols-outlined font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
          </div>
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] bg-indigo-500/10 px-3 py-1 rounded-sm border border-indigo-500/20">Trend_Steady</span>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">PUNTO_EQUILIBRIO</p>
          <div className="flex items-baseline gap-1">
            <span className="text-indigo-500 text-xl font-black">$</span>
            <h3 className="text-4xl font-black tracking-tighter text-white">
               {kpis?.puntoEquilibrio?.toLocaleString() || '0'}
            </h3>
          </div>
        </div>
        <div className="mt-8 w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500/40 rounded-full" style={{ width: '70%' }}></div>
        </div>
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
      </div>
    </section>
  );
}
