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

gsap.registerPlugin(useGSAP);

export default function DashboardPage() {
  const [analisis, setAnalisis] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
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
    <div ref={container} className="text-white selection:bg-indigo-500/30 min-h-screen relative bg-transparent">
      {/* Black Hole Master Background (GSAP Particle System + Cinematic GIF) */}
      <BlackHoleBackground />
      
      {/* Barra de Navegación Superior */}
      <TopNavBar />
      
      <div className="flex pt-16 min-h-screen relative z-10">
        {/* Barra Lateral */}
        <SideNavBar />
        
        {/* Contenido Principal */}
        <main className="flex-grow p-8 md:p-12 max-w-7xl mx-auto space-y-20">
          <div className="anim-section"><HeroSection /></div>
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
        </main>
      </div>
      
      {/* Footer */}
      <div className="anim-section"><Footer /></div>
    </div>
  );
}
