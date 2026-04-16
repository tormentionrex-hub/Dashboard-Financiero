import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from "@gsap/react";
import TopNavBar from '../components/navigation/TopNavBar';
import SideNavBar from '../components/navigation/SideNavBar';
import HeroSection from '../components/dashboard/HeroSection';
import MetricsGrid from '../components/dashboard/MetricsGrid';
import FinancialChart from '../components/dashboard/FinancialChart';
import SkillsSection from '../components/dashboard/SkillsSection';
import TransactionsTable from '../components/dashboard/TransactionsTable';
import Footer from '../components/navigation/Footer';

import financialData from "../data/financialData.json";
import { calcularKPIs } from "../utils/kpiCalculator";
import { generarAnalisisEjecutivo } from "../services/claudeService";
import BlackHoleBackground from '../components/dashboard/BlackHoleBackground';
import backgroundDash from '../images/backgroundDashboardHD - Trim.mp4';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function DashboardPage() {
  const [analisis, setAnalisis] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const container = useRef();

  const kpis = calcularKPIs(financialData.datos);

  useGSAP(() => {
    // Animación de entrada "Cyber-Stagger" con ScrollTrigger individual
    gsap.utils.toArray(".anim-section").forEach((section) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: "top 85%", // Inicia cuando el 85% del viewport toca el top del elemento
          toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 60,
        duration: 1.1,
        ease: "power3.out",
        immediateRender: false,
      });
    });

    /* ── ScrollTrigger: línea de progreso lateral ── */
    gsap.to(".scroll-progress-bar", {
      scrollTrigger: {
        scrub: 0.5,
        start: "top top",
        end: "bottom bottom",
      },
      scaleY: 1,
      ease: "none",
    });

  }, { scope: container });

  const handleGenerarAnalisis = async () => {
    setCargando(true);
    setError("");
    try {
      const resultado = await generarAnalisisEjecutivo(
        financialData.empresa,
        financialData.periodo,
        kpis,
        financialData.datos
      );
      setAnalisis(resultado);
    } catch (err) {
      setError(err.message || "Error al conectar con la IA.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div ref={container} className="text-white selection:bg-indigo-500/30 min-h-screen relative bg-[#050506]">
      {/* Fondo cinemático */}
      <div className="absolute top-0 left-0 w-full h-screen z-0 overflow-hidden pointer-events-none">
        <BlackHoleBackground isPlaying={isPlaying} />
      </div>

      {/* Barra de progreso de scroll */}
      <div className="fixed right-0 top-0 w-0.5 h-full z-50 bg-white/5">
        <div className="scroll-progress-bar w-full bg-gradient-to-b from-indigo-500 to-cyan-400 origin-top"
          style={{ height: '100%', scaleY: 0 }}
        ></div>
      </div>

      {/* Estructura */}
      <div className="relative z-10">
        <TopNavBar />

        <div className="flex pt-16">
          <SideNavBar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(o => !o)} />

          <main className="flex-grow transition-all duration-500 min-w-0">
            {/* HERO */}
            <div className="relative z-20 min-h-[calc(100vh-4rem)] flex items-center px-8 md:px-16 py-12">
              <div className="anim-section w-full">
                <HeroSection isPlaying={isPlaying} onToggle={() => setIsPlaying(!isPlaying)} />
              </div>
            </div>

            {/* SECCIONES DE DATOS */}
            <div className="relative w-full overflow-hidden -mt-16">
              <div className="absolute top-0 left-0 w-full h-40 z-[3] pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, #050506 0%, rgba(5,5,6,0.7) 50%, transparent 100%)' }}
              ></div>
              <video
                src={backgroundDash}
                autoPlay loop muted playsInline
                className="absolute inset-0 w-full h-full object-cover brightness-[0.35] contrast-[1.1] z-0 pointer-events-none"
              />
              <div className="absolute inset-0 bg-black/50 z-[1] pointer-events-none"></div>

              <div className="relative z-10 p-8 md:p-12 space-y-24">
                <div className="anim-section scroll-section"><MetricsGrid kpis={kpis} /></div>
                <div className="anim-section scroll-section"><FinancialChart onGenerar={handleGenerarAnalisis} cargando={cargando} /></div>

                {(analisis || cargando || error) && (
                  <section className="cyber-glass p-10 rounded-[2rem] border-l-4 border-indigo-500 shadow-2xl anim-section scroll-section">
                    <h2 className="text-xl font-black text-indigo-100 mb-6 flex items-center gap-3">
                      <span className="material-symbols-outlined text-indigo-400">psychology</span>
                      Interfaz de Análisis Neural
                    </h2>
                    {cargando ? (
                      <div className="flex items-center gap-4 text-indigo-300 italic animate-pulse">
                        <span className="material-symbols-outlined animate-spin">sync</span>
                        Escaneando flujos financieros...
                      </div>
                    ) : error ? (
                      <div className="text-red-400 font-bold bg-red-900/20 p-4 rounded-xl border border-red-900/40">{error}</div>
                    ) : (
                      <div className="text-indigo-50/80 leading-relaxed whitespace-pre-wrap font-inter text-sm md:text-base border-t border-white/5 pt-6 uppercase tracking-tight">{analisis}</div>
                    )}
                  </section>
                )}

                <div className="anim-section scroll-section"><SkillsSection /></div>
                <div className="anim-section scroll-section"><TransactionsTable /></div>
              </div>

              {/* Footer pegado al fondo */}
              <div className="relative z-10">
                <Footer />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
