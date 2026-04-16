import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import anime from 'animejs/lib/anime.es.js';
import Swal from 'sweetalert2';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function FinancialChart({ onGenerar, cargando }) {
  const container = useRef();
  const svgRef = useRef();
  const [activeTooltip, setActiveTooltip] = useState(null);

  const data = [
    { name: 'Ene', Ingresos: 80, Costos: 40, Gastos: 20 },
    { name: 'Feb', Ingresos: 65, Costos: 45, Gastos: 15 },
    { name: 'Mar', Ingresos: 90, Costos: 30, Gastos: 25 },
    { name: 'Abr', Ingresos: 75, Costos: 50, Gastos: 20 },
    { name: 'May', Ingresos: 85, Costos: 35, Gastos: 10 },
    { name: 'Jun', Ingresos: 95, Costos: 60, Gastos: 30 },
  ];

  const series = [
    { key: 'Ingresos', color: '#6366f1' },
    { key: 'Costos', color: '#22d3ee' },
    { key: 'Gastos', color: '#94a3b8' }
  ];

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    // Animate Header & Container
    tl.from(".chart-header", { opacity: 0, y: -30, duration: 1, ease: "power3.out" });
    tl.from(".chart-btn", { opacity: 0, scale: 0.8, duration: 1, ease: "back.out(1.5)" }, "-=0.5");
    gsap.to(container.current, { y: -5, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });

  }, { scope: container });

  // ANIME.JS CORE ANIMATION
  useEffect(() => {
    // Definir la línea de tiempo de AnimeJS para una entrada coreográfica
    const tl = anime.timeline({
      easing: 'easeInOutExpo',
    });

    // 1. Dibuja las líneas punteadas de fondo (Grid) desde izquierda a derecha
    tl.add({
      targets: svgRef.current.querySelectorAll('.chart-grid-line'),
      strokeDashoffset: [anime.setDashoffset, 0],
      opacity: [0, 0.15],
      duration: 1200,
      delay: anime.stagger(150, {direction: 'reverse'})
    })
    // 2. Aparecen los textos del Eje Y
    .add({
      targets: svgRef.current.querySelectorAll('.chart-y-axis'),
      opacity: [0, 1],
      translateX: [-15, 0],
      duration: 800,
      delay: anime.stagger(70)
    }, '-=1000')
    // 3. Aparecen los textos del Eje X (Meses)
    .add({
      targets: svgRef.current.querySelectorAll('.chart-x-axis'),
      opacity: [0, 1],
      translateY: [15, 0],
      duration: 800,
      delay: anime.stagger(80)
    }, '-=800')
    // 4. ANIMACIÓN ESTRELLA: Trazado de rutas (Path Drawing) simulando latidos/láser
    .add({
      targets: svgRef.current.querySelectorAll('.chart-data-line'),
      strokeDashoffset: [anime.setDashoffset, 0],
      duration: 2500,
      easing: 'easeInOutSine',
      delay: anime.stagger(400) // Un trazado después de otro
    }, '-=600')
    // 5. Los puntos estallan con efecto elástico
    .add({
      targets: svgRef.current.querySelectorAll('.chart-data-dot'),
      scale: [0, 1],
      opacity: [0, 1],
      duration: 1200,
      easing: 'easeOutElastic(1, .4)',
      delay: anime.stagger(40, {from: 'center'}) // Aparecen desde el centro
    }, '-=2200');

  }, []);

  const handleDotEnter = (e, val, sName, month) => {
    anime({
      targets: e.target,
      scale: 1.8,
      strokeWidth: 4,
      duration: 500,
      easing: 'easeOutElastic(1, .5)'
    });
    const x = parseFloat(e.target.getAttribute('cx'));
    const y = parseFloat(e.target.getAttribute('cy'));
    setActiveTooltip({ val, sName, month, x, y, color: e.target.getAttribute('fill') });
  };

  const handleDotLeave = (e) => {
    anime({
      targets: e.target,
      scale: 1,
      strokeWidth: 2,
      duration: 400,
      easing: 'easeOutCirc'
    });
    setActiveTooltip(null);
  };

  const handleDotClick = async (val, sName, month) => {
    const result = await Swal.fire({
      title: `Analizar ${sName}`,
      text: `¿Deseas abrir un desglose detallado sobre la métrica de ${sName.toLowerCase()} correspondiente al periodo de ${month}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#1e293b',
      confirmButtonText: 'Sí, ver informe completo',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Extrayendo datos de telemetría...',
        text: 'Generando análisis detallado...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      // Simular tiempo de carga/pensamiento del sistema
      await new Promise(resolve => setTimeout(resolve, 1500));

      const rendimiento = val > 75 ? 'Excelente' : val > 45 ? 'Estable' : 'Peligroso / Crítico';
      const trendColor = val > 75 ? '#22c55e' : val > 45 ? '#eab308' : '#ef4444';
      
      let narrativa = '';
      if (sName === 'Ingresos') {
        narrativa = `En el mes de <b>${month}</b> se reportaron <b>${val}</b> unidades de ingreso bruto. El sensor de telemetría detecta que este flujo de caja fue originado directamente de la última campaña comercial con métricas muy saludables y un alto nivel de conversión promedio.`;
      } else if (sName === 'Costos') {
        narrativa = `En <b>${month}</b>, la base de operaciones registró un costo de infraestructura general de <b>${val}</b>. Este segmento explica gastos irrefutables e inherentes a compras iniciales, proveedores primarios y adquisición fundamental de servicios de terceros para operar tu catálogo.`;
      } else if (sName === 'Gastos') {
        narrativa = `Para el ciclo cerrado de <b>${month}</b>, se proyectó y gastó un total de <b>${val}</b>. La red neuronal sugiere no asustarse, dado que comprende licencias de software, retribuciones administrativas, alquileres fijos y amortizaciones.`;
      }

      Swal.fire({
        title: `AUDITORÍA DE ${sName.toUpperCase()}`,
        html: `
          <div style="text-align: left; font-size: 14px; color: #cbd5e1; line-height: 1.6; padding: 10px;">
            <p><strong>📍 Periodo Registrado:</strong> ${month.toUpperCase()} 2026</p>
            <p><strong>📊 Métrica Absoluta:</strong> <span style="color: ${trendColor}; font-size: 18px; font-weight: bold;">${val}</span></p>
            <br/>
            <p><strong>💡 Resumen del Sistema:</strong></p>
            <p style="background: rgba(255,255,255,0.05); padding: 15px; border-left: 3px solid ${trendColor}; border-radius: 4px;">
              ${narrativa}
            </p>
            <br/>
            <p><strong>⚖️ Estado Operativo Categórico:</strong> A los ojos de nuestros protocolos, este resultado particular se cataloga como <strong style="color:${trendColor}">${rendimiento}</strong>.</p>
          </div>
        `,
        iconColor: trendColor,
        background: '#050506',
        color: '#fff',
        confirmButtonColor: '#6366f1',
        confirmButtonText: 'Cerrar Auditoría'
      });
    }
  };

  return (
    <section ref={container} className="chart-container cyber-glass p-8 md:p-10 pb-36 rounded-[3.5rem] shadow-2xl relative overflow-hidden border border-white/5 group">
      <div className="chart-header flex flex-col md:flex-row justify-between items-end mb-12 gap-8 relative z-10">
        <div>
          <h2 className="text-4xl font-black text-white mb-3 uppercase tracking-tighter">Telemetría Financiera</h2>
          <p className="text-indigo-400 font-bold uppercase text-[10px] tracking-widest">Motor Gráfico: Anime.js Neural Net</p>
        </div>
        <div className="flex gap-3 p-1.5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
          <button className="px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-indigo-500 text-white shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all">En_Vivo</button>
          <button className="px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">Histórico</button>
        </div>
      </div>
      
      {/* Anime.js Custom SVG Area */}
      <div className="w-full h-[400px] mb-8 relative z-10 mt-8">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 400" ref={svgRef} preserveAspectRatio="none">
          <defs>
            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ejes y Cuadrícula */}
          {[0, 25, 50, 75, 100].map((val, i) => {
            const y = 350 - (val * 3);
            return (
              <g key={`grid-${i}`}>
                <line className="chart-grid-line" x1="80" y1={y} x2="950" y2={y} stroke="#ffffff" strokeWidth="1" strokeDasharray="4,8" opacity="0" />
                <text className="chart-y-axis text-[12px] font-black uppercase tracking-widest" x="60" y={y + 4} fill="#ffffff40" textAnchor="end" opacity="0">{val}</text>
              </g>
            );
          })}

          {/* Eje X (Meses) */}
          {data.map((d, i) => {
            const x = 120 + (i * 155);
            return (
              <text key={`x-${i}`} className="chart-x-axis text-[12px] font-black uppercase tracking-widest" x={x} y="385" fill="#ffffff60" textAnchor="middle" opacity="0">{d.name}</text>
            );
          })}

          {/* Rutas de Tendencias y Puntos de Datos */}
          {series.map((s, sIdx) => {
            const dPath = data.map((d, i) => `${i===0?'M':'L'} ${120 + (i * 155)} ${350 - (d[s.key] * 3)}`).join(' ');
            return (
              <g key={`series-line-${sIdx}`}>
                <path 
                  className="chart-data-line" 
                  d={dPath} 
                  fill="none" 
                  stroke={s.color} 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  filter="url(#neonGlow)"
                />
                {data.map((d, i) => {
                  const x = 120 + (i * 155);
                  const y = 350 - (d[s.key] * 3);
                  return (
                    <circle 
                      key={`dot-${sIdx}-${i}`}
                      className="chart-data-dot cursor-pointer"
                      cx={x} cy={y} r="6" 
                      fill="#050506" 
                      stroke={s.color} 
                      strokeWidth="3" 
                      opacity="0"
                      style={{ transformOrigin: `${x}px ${y}px` }}
                      onMouseEnter={(e) => handleDotEnter(e, d[s.key], s.key, d.name)}
                      onMouseLeave={handleDotLeave}
                      onClick={() => handleDotClick(d[s.key], s.key, d.name)}
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* HTML Tooltip Inteligente */}
        {activeTooltip && (
          <div 
            className="absolute pointer-events-none z-50 bg-[#050506]/95 backdrop-blur-3xl border border-white/20 p-5 rounded-2xl shadow-2xl"
            style={{
              left: `calc(${(activeTooltip.x / 1000) * 100}% - 80px)`,
              top: `calc(${(activeTooltip.y / 400) * 100}% - 110px)`,
              minWidth: '160px',
              animation: 'tooltipPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
            }}
          >
             <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/10 pb-3 mb-3 text-center">{activeTooltip.month}</p>
             <div className="flex items-center justify-between gap-4 mb-3">
               <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeTooltip.color, boxShadow: `0 0 15px ${activeTooltip.color}` }}></div>
                 <p className="text-white/70 font-black text-[10px] uppercase tracking-widest">{activeTooltip.sName}</p>
               </div>
               <span className="text-2xl font-black" style={{color: activeTooltip.color}}>{activeTooltip.val}</span>
             </div>
             <p className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest text-center mt-2 animate-pulse bg-cyan-900/40 rounded py-1 border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.2)]">👉 Clic para auditar</p>
          </div>
        )}

        <style>{`
          @keyframes tooltipPop {
            from { opacity: 0; transform: scale(0.6) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
      </div>

      <div className="chart-btn absolute bottom-10 left-0 w-full px-10 flex justify-end z-20 pointer-events-none">
        <button 
          onClick={onGenerar}
          disabled={cargando}
          className={`bg-white text-black pointer-events-auto flex items-center gap-6 px-12 py-6 rounded-sm font-black text-xs uppercase tracking-[0.3em] shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(99,102,241,0.6)] hover:bg-indigo-500 hover:text-white transition-all transform hover:-translate-y-2 active:scale-95 border border-white/20 ${cargando ? 'opacity-50 cursor-not-allowed' : ''}`}
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
