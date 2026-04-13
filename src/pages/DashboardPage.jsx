import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react";
import TopNavBar from '../components/navigation/TopNavBar';
import SideNavBar from '../components/navigation/SideNavBar';
import HeroSection from '../components/dashboard/HeroSection';
import MetricsGrid from '../components/dashboard/MetricsGrid';
import FinancialChart from '../components/dashboard/FinancialChart';
import SkillsSection from '../components/dashboard/SkillsSection';
import TransactionsTable from '../components/dashboard/TransactionsTable';
import Footer from '../components/navigation/Footer';

// Lógica de negocio rescatada
import financialData from "../data/financialData.json";
import { calcularKPIs } from "../utils/kpiCalculator";
import { generarAnalisisEjecutivo } from "../services/claudeService";
import BlackHoleBackground from '../components/dashboard/BlackHoleBackground';
import backgroundDash from '../images/backgroundDash.mp4';

gsap.registerPlugin(useGSAP);

export default function DashboardPage() {
  const [analisis, setAnalisis] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const container = useRef();

  const kpis = calcularKPIs(financialData.datos);

  useGSAP(() => {
    // Animación de entrada "Cyber-Stagger"
    gsap.from(".anim-section", {
      opacity: 0,
      y: 40,
      stagger: 0.2,
      duration: 1.5,
      ease: "power4.out"
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
      {/* CAPA DE FONDO CINEMÁTICO (SOLO PARA EL INICIO) */}
      <div className="absolute top-0 left-0 w-full h-screen z-0 overflow-hidden pointer-events-none">
        <BlackHoleBackground isPlaying={isPlaying} />
      </div>
      
      {/* ESTRUCTURA DASHBOARD */}
      <div className="relative z-10">
        <TopNavBar />
        
        <div className="flex pt-16">
          <SideNavBar />
          
          <main className="flex-grow ml-72 transition-all duration-500">
            {/* SECCIÓN HERO (TRANSPARENTE SOBRE EL VIDEO) */}
            <div className="min-h-[calc(100vh-4rem)] flex items-center p-8 md:p-12">
              <div className="anim-section w-full">
                 <HeroSection isPlaying={isPlaying} onToggle={() => setIsPlaying(!isPlaying)} />
              </div>
            </div>

            {/* SECCIÓN DE DATOS - VIDEO BACKGROUND ANCHO COMPLETO */}
            <div className="relative -ml-72 w-screen border-t border-white/5 overflow-hidden">
              {/* Video de fondo a 100% de pantalla — sin contar el header */}
              <video
                src={backgroundDash}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover brightness-[0.35] contrast-[1.1] z-0 pointer-events-none"
              />
              {/* Sobrecapa oscura para máxima legibilidad */}
              <div className="absolute inset-0 bg-black/50 z-[1] pointer-events-none"></div>

              {/* Contenido: padding-left compensa el margen negativo para que quede alineado */}
              <div className="relative z-10 pl-72 p-8 md:p-12 space-y-24">
                <div className="anim-section"><MetricsGrid kpis={kpis} /></div>
                <div className="anim-section"><FinancialChart onGenerar={handleGenerarAnalisis} cargando={cargando} /></div>
                
                {(analisis || cargando || error) && (
                  <section className="cyber-glass p-10 rounded-[2rem] border-l-4 border-indigo-500 shadow-2xl anim-section">
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

                <div className="anim-section"><SkillsSection /></div>
                <div className="anim-section"><TransactionsTable /></div>
              </div>

              {/* Footer */}
              <div className="anim-section relative z-10 p-12 border-t border-white/5"><Footer /></div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
