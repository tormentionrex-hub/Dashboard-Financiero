import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react";

export default function HeroSection() {
  const container = useRef();
  const imgRef = useRef();

  useGSAP(() => {
    // Texto parpadeante al entrar
    gsap.from(".hero-text", {
      opacity: 0,
      x: -50,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out"
    });

    // Imagen flotante infinita
    gsap.to(imgRef.current, {
      y: 15,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, { scope: container });

  return (
    <section ref={container} className="relative overflow-hidden rounded-[3rem] bg-indigo-950/20 border border-indigo-500/10 p-12 lg:p-20 flex flex-col md:flex-row items-center justify-between shadow-[0_0_50px_rgba(99,102,241,0.05)]">
      <div className="max-w-2xl z-10 text-center md:text-left">
        <div className="hero-text inline-block px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black tracking-[0.3em] text-indigo-400 mb-8 uppercase">AIFinance_v2.0_Core</div>
        <h1 className="hero-text text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8 text-white">
          SISTEMA DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">INTELIGENCIA NEURAL</span>
        </h1>
        <p className="hero-text text-lg text-white/50 mb-12 leading-relaxed max-w-lg font-medium">Arquitectura de análisis predictivo diseñada para la gestión de patrimonio en la era de la inteligencia artificial. Evolución. Precisión. Poder.</p>
        <div className="hero-text flex flex-wrap gap-5 justify-center md:justify-start">
          <button className="bg-indigo-500 text-white px-10 py-4 rounded-sm font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] transition-all transform hover:-translate-y-1">Ejecutar_Analisis</button>
          <button className="bg-white/5 backdrop-blur-md text-white px-10 py-4 rounded-sm font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all">Ver_Protocolos</button>
        </div>
      </div>
      <div ref={imgRef} className="mt-16 md:mt-0 relative w-full md:w-1/3 aspect-square max-w-sm flex items-center justify-center">
        <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full animate-pulse"></div>
        <img 
          alt="Procesador Neural" 
          className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_30px_rgba(99,102,241,0.5)]" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVJGSyOORz1PlNzXS0MBj7OEsleI2UEHJ4lM691PDXyCLqnJJh-GTY4m2aKyuL7UqbvshAGOeVA0PTrCVyC6q0JFZX8m3kTzZO0qts2ieSIavK_ZLZ1zJaty4vgk5YdkFW_R2myWyuNm-r5MVawzQFBRvzvhWwfoMWt2USy3Vh8qmTVZ7v6sU83mco5vGtmxOUz-ZhpJ6OlYmddmDwyfr7aR52tBv1jVkpAyu4ATh_W4BdGaBWWUEAozJdTvrM8jZLcS_HZWrpqg"
        />
      </div>
    </section>
  );
}
