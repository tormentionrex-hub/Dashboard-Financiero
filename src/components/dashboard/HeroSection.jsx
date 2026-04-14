import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react";

const PW    = 200;   // ancho
const PH    = 420;   // alto
const D     = 26;    // grosor total del teléfono en px
const HALF  = 13;    // z del frente y trasero
const R     = 28;    // border-radius — S25 Ultra

// Paleta titanio
const TI_LIGHT  = "#e8edf2";
const TI_MID    = "#c8cfd8";
const TI_DARK   = "#b0b8c2";
const TI_SIDE   = "#bdc4cc";  // color de las capas del lateral

export default function HeroSection({ isPlaying, onToggle }) {
  const container = useRef();
  const floatRef  = useRef();   // capa A: flotación lenta
  const driftRef  = useRef();   // capa B: deriva de gravedad (X/Z)
  const spinRef   = useRef();   // capa C: giro Y continuo lento

  useGSAP(() => {
    gsap.from(".hero-text", {
      opacity: 0, x: -60, duration: 1.2,
      stagger: 0.18, ease: "power4.out", delay: 0.3
    });
    document.querySelectorAll(".counter").forEach(el => {
      const target = parseFloat(el.dataset.target);
      gsap.fromTo(el, { innerText: 0 }, {
        innerText: target, duration: 3, delay: 1.0, ease: "power2.out",
        snap: { innerText: target < 100 ? 0.1 : 1 },
        onUpdate() {
          el.innerText = target < 100
            ? parseFloat(el.innerText).toFixed(1)
            : Math.round(parseFloat(el.innerText)).toLocaleString();
        }
      });
    });
  }, { scope: container });

  useEffect(() => {
    const floatEl = floatRef.current;
    const driftEl = driftRef.current;
    const spinEl  = spinRef.current;

    /* ─────────────────────────────────────────────────────
       ANIMACIÓN: Astronauta en gravedad cero
       - Todo MUY lento, suave y continuo, sin rebotes bruscos
    ───────────────────────────────────────────────────── */

    // Capa A: flotación vertical muy lenta (como flotar en el espacio)
    gsap.to(floatEl, {
      y: -24,
      duration: 7,             // ← 7 segundos por ciclo
      repeat: -1, yoyo: true,
      ease: "sine.inOut"
    });

    // Capa B: deriva lenta en X y Z (tumbling en gravedad cero)
    gsap.to(driftEl, {
      rotateX: 12,
      duration: 9,             // ← 9 segundos por ciclo
      repeat: -1, yoyo: true,
      ease: "sine.inOut"
    });
    gsap.to(driftEl, {
      rotateZ: 5,
      duration: 13,            // ← 13s para que no sea periódico, efecto caótico suave
      repeat: -1, yoyo: true,
      ease: "sine.inOut",
      delay: 2
    });

    // Capa C: giro Y continuo muy lento — como un satélite girando en órbita
    gsap.to(spinEl, {
      rotateY: 360,
      duration: 28,            // ← 28 segundos por vuelta completa
      repeat: -1,
      ease: "none"             // velocidad constante = gravedad cero
    });

    /* ─────────────────────────────────────────────────────
       CURSOR: modifica la deriva (capa B) según cercanía
    ───────────────────────────────────────────────────── */
    const onMove = (e) => {
      const rect = floatEl.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dist = Math.sqrt(
        Math.pow((e.clientX - cx) / 320, 2) +
        Math.pow((e.clientY - cy) / 360, 2)
      );
      const proximity = Math.max(0, 1 - dist);

      if (proximity > 0.05) {
        const nx = (e.clientX - cx) / 320;
        const ny = (e.clientY - cy) / 360;
        gsap.to(driftEl, {
          rotateX: 12 - ny * 28 * proximity,
          rotateZ: 5  + nx * 14 * proximity,
          duration: 1.2,           // ← cursor también responde lento/suave
          ease: "power1.out",
          overwrite: "auto"
        });
        // Ralentiza el giro mientras cursor esté cerca
        gsap.to(spinEl, {
          timeScale: Math.max(0.15, 1 - proximity * 0.75),
          duration: 1.5, ease: "power2.out"
        });
      } else {
        gsap.to(spinEl, { timeScale: 1, duration: 2, ease: "power2.out" });
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* ── Helpers de estilo ── */
  const face = (extra = {}) => ({
    position: "absolute", top: 0, left: 0,
    width: `${PW}px`, height: `${PH}px`,
    borderRadius: `${R}px`,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    overflow: "hidden",
    ...extra
  });

  // (helpers de aristas eliminados — causaban distorsión en las esquinas)

  return (
    <section ref={container} className="relative bg-transparent flex flex-col md:flex-row items-start justify-between w-full gap-10 md:gap-4">

      {/* ══ TEXTO ══ */}
      <div className="flex-1 max-w-xl z-10 text-center md:text-left px-6 md:px-0">
        <div className="hero-text inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/40 text-[10px] font-black tracking-[0.3em] text-indigo-300 mb-8 uppercase backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
          AIFinance_v2.0 — Sistema Activo
        </div>
        <h1 className="hero-text text-4xl md:text-5xl xl:text-[5rem] font-black tracking-tighter leading-[0.88] mb-8 text-white
          drop-shadow-[0_8px_24px_rgba(99,102,241,0.45)]">
          SISTEMA DE{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-200 to-indigo-400">
            INTELIGENCIA
          </span>{" "}
          NEURAL
        </h1>
        <p className="hero-text text-base text-white/70 mb-10 leading-relaxed max-w-md font-medium">
          Arquitectura de análisis predictivo para la gestión de patrimonio en la era de la IA.{" "}
          <span className="text-indigo-300 font-bold">Evolución. Precisión. Poder.</span>
        </p>
        <div className="hero-text flex gap-8 mb-10 justify-center md:justify-start">
          {[
            { label:"ROI Anual",    value:"28",   suffix:"%" },
            { label:"Margen Bruto", value:"43",   suffix:"%" },
            { label:"Activos (M)",  value:"1769", suffix:""  },
          ].map((k,i) => (
            <div key={i} className="text-center md:text-left">
              <div className="text-2xl font-black text-white leading-none">
                <span className="counter" data-target={parseFloat(k.value)}>0</span>
                <span className="text-indigo-400">{k.suffix}</span>
              </div>
              <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mt-1">{k.label}</p>
            </div>
          ))}
        </div>
        <div className="hero-text flex flex-wrap gap-4 justify-center md:justify-start">
          <button className="bg-indigo-500 hover:bg-indigo-400 text-white px-9 py-3.5 rounded-sm font-black text-[10px] uppercase tracking-widest shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:shadow-[0_0_50px_rgba(99,102,241,0.7)] transition-all hover:-translate-y-0.5">
            Ejecutar_Análisis
          </button>
          <button className="bg-white/5 backdrop-blur-xl text-white px-9 py-3.5 rounded-sm font-black text-[10px] uppercase tracking-widest border border-white/20 hover:bg-white/10 transition-all hover:-translate-y-0.5">
            Ver_Protocolos
          </button>
          <button onClick={onToggle} className="flex items-center gap-2 text-white/50 hover:text-white px-4 py-3.5 text-[10px] font-black uppercase tracking-widest border border-white/10 hover:border-white/20 rounded-sm transition-all">
            <span className="material-symbols-outlined text-base">{isPlaying ? "pause" : "play_arrow"}</span>
          </button>
        </div>
      </div>

      {/* ══ TELÉFONO 3D SÓLIDO ══ */}
      <div className="relative flex-shrink-0 flex items-start justify-center w-64 md:w-80 self-start"
        style={{ perspective: "1000px", perspectiveOrigin: "50% 50%" }}
      >
        {/* Halo ambiental */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background:"radial-gradient(ellipse at 50% 56%, rgba(99,102,241,0.3) 0%, transparent 65%)",
          filter:"blur(44px)"
        }}></div>

        {/* Sombra suave proyectada */}
        <div className="absolute pointer-events-none" style={{
          bottom: "-38px", left:"50%", transform:"translateX(-50%)",
          width:`${PW * 0.7}px`, height:"12px",
          background:"rgba(40,30,160,0.45)", filter:"blur(16px)"
        }}></div>

        {/* CAPA A — flotación */}
        <div ref={floatRef} style={{ transformStyle:"preserve-3d" }}>

          {/* CAPA B — deriva / gravedad */}
          <div ref={driftRef} style={{ transformStyle:"preserve-3d",
            transform:"rotateX(10deg) rotateZ(2deg)"   /* tilt inicial suave */
          }}>

            {/* CAPA C — giro Y lento */}
            <div ref={spinRef} style={{
              position:"relative",
              width:`${PW}px`, height:`${PH}px`,
              transformStyle:"preserve-3d"
            }}>

              {/* ══ LAMINADO EN Z — DOBLE (frente + trasero) ══
                  Set A: capas que miran al FRENTE → visibles cuando se ve la pantalla
                  Set B: capas con rotateY(180°) → visibles cuando se ve el Samsung
                  Ambos conjuntos = pared lateral sólida en los 360° de rotación */}
              {["front", "back"].map(side =>
                Array.from({ length: 13 }, (_, i) => {
                  const z = HALF - 2 - i * 2;   // +11 → -11 en pasos de 2px
                  // Luminosidad: más claro cerca del frente/trasero, oscuro en el centro
                  const brightness = 1 - Math.abs(z) / (HALF * 2.2);
                  const cr = Math.round(180 + brightness * 32);
                  const cg = Math.round(188 + brightness * 24);
                  const cb = Math.round(204 + brightness * 20);
                  const transform = side === "front"
                    ? `translateZ(${z}px)`
                    : `rotateY(180deg) translateZ(${z}px)`;  // ← espejo para cara trasera
                  return (
                    <div key={`${side}-${i}`} style={{
                      position: "absolute", top: 0, left: 0,
                      width: `${PW}px`, height: `${PH}px`,
                      borderRadius: `${R}px`,
                      transform,
                      background: `rgb(${cr},${cg},${cb})`,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.16), inset 0 0 0 0.5px rgba(0,0,0,0.05)",
                    }}></div>
                  );
                })
              )}

              {/* ══ CARA DELANTERA — TITANIO S25 ULTRA ══ */}
              <div style={face({
                transform:`translateZ(${HALF}px)`,
                background:`linear-gradient(160deg, ${TI_LIGHT} 0%, ${TI_MID} 45%, ${TI_DARK} 65%, ${TI_MID} 100%)`,
                border:`1.5px solid rgba(255,255,255,0.95)`,
                boxShadow:[
                  "inset 0 2px 0 rgba(255,255,255,0.95)",
                  "inset 0 -2px 0 rgba(0,0,0,0.12)",
                  "inset 2px 0 0 rgba(255,255,255,0.55)",
                  "inset -2px 0 0 rgba(0,0,0,0.08)",
                ].join(",")
              })}>

                {/* Botón power — titanio */}
                <div style={{ position:"absolute", right:"-3px", top:"118px", width:"3px", height:"52px", borderRadius:"1px", background:`linear-gradient(to bottom,${TI_LIGHT},${TI_DARK},${TI_LIGHT})` }}></div>
                <div style={{ position:"absolute", left:"-3px", top:"98px",  width:"3px", height:"32px", borderRadius:"1px", background:`linear-gradient(to bottom,${TI_LIGHT},${TI_DARK})` }}></div>
                <div style={{ position:"absolute", left:"-3px", top:"142px", width:"3px", height:"32px", borderRadius:"1px", background:`linear-gradient(to bottom,${TI_LIGHT},${TI_DARK})` }}></div>

                {/* Hole-punch camera — S25 Ultra usa hole-punch centrado arriba */}
                <div style={{ position:"absolute", top:"9px", left:"50%", transform:"translateX(-50%)", width:"10px", height:"10px", borderRadius:"50%", background:"#050508", border:"1px solid rgba(0,0,0,0.5)", zIndex:30 }}>
                  <div style={{ position:"absolute", top:"2px", left:"2px", width:"3px", height:"3px", borderRadius:"50%", background:"rgba(255,255,255,0.25)" }}></div>
                </div>

                {/* Reflejo especular en el marco plateado */}
                <div style={{ position:"absolute", inset:0, pointerEvents:"none", borderRadius:`${R}px`, zIndex:22,
                  background:"linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 40%)",
                  mixBlendMode:"screen"
                }}></div>

                {/* PANTALLA — bezeles ultra-finos como S25 Ultra, inset 6px para mostrar el marco */}
                <div style={{ position:"absolute", inset:"6px", borderRadius:`${R-4}px`, background:"linear-gradient(180deg,#08081c,#050510)", overflow:"hidden", padding:"24px 10px 10px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"7px", padding:"0 3px" }}>
                    <span style={{ fontSize:"7px", color:"rgba(255,255,255,0.55)", fontWeight:700 }}>9:41</span>
                    <div style={{ display:"flex", alignItems:"flex-end", gap:"2px" }}>
                      {[3,5,7,9].map((h,i)=>(<div key={i} style={{ width:"2px", height:`${h}px`, background:"rgba(255,255,255,0.6)", borderRadius:"1px" }}></div>))}
                      <span className="material-symbols-outlined" style={{ fontSize:"8px", color:"rgba(255,255,255,0.6)", marginLeft:"2px" }}>wifi</span>
                      <span className="material-symbols-outlined" style={{ fontSize:"8px", color:"rgba(255,255,255,0.6)" }}>battery_5_bar</span>
                    </div>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"9px" }}>
                    <div>
                      <p style={{ fontSize:"6px", color:"rgba(99,102,241,0.9)", textTransform:"uppercase", letterSpacing:"0.15em", fontWeight:700 }}>Panel Neural</p>
                      <p style={{ fontSize:"9px", color:"#fff", fontWeight:900 }}>Resumen Hoy</p>
                    </div>
                    <div style={{ width:"24px", height:"24px", borderRadius:"50%", background:"rgba(99,102,241,0.2)", border:"1px solid rgba(99,102,241,0.35)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span className="material-symbols-outlined" style={{ fontSize:"11px", color:"#818cf8" }}>account_circle</span>
                    </div>
                  </div>
                  <div style={{ borderRadius:"16px", padding:"11px", background:"linear-gradient(135deg,rgba(99,102,241,0.82),rgba(67,56,202,0.9))", border:"1px solid rgba(99,102,241,0.35)", boxShadow:"0 10px 24px rgba(99,102,241,0.3)", marginBottom:"8px" }}>
                    <p style={{ fontSize:"6px", color:"rgba(199,210,254,0.75)", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:"4px" }}>Patrimonio Total</p>
                    <p style={{ fontSize:"17px", color:"#fff", fontWeight:900, lineHeight:1 }}>$1,769,520</p>
                    <div style={{ display:"flex", alignItems:"center", gap:"4px", marginTop:"6px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize:"8px", color:"#67e8f9" }}>arrow_upward</span>
                      <span style={{ fontSize:"7px", color:"#67e8f9", fontWeight:700 }}>+4.2% esta semana</span>
                    </div>
                  </div>
                  <div style={{ borderRadius:"13px", padding:"9px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", marginBottom:"8px" }}>
                    <div style={{ display:"flex", alignItems:"flex-end", gap:"3px", height:"36px" }}>
                      {[38,55,32,68,58,82,62].map((h,i)=>(<div key={i} style={{ flex:1, borderRadius:"3px", height:`${h}%`, background:i===5?"linear-gradient(to top,#6366f1,#818cf8)":"rgba(99,102,241,0.22)" }}></div>))}
                    </div>
                    <div style={{ display:"flex", marginTop:"3px" }}>
                      {["L","M","X","J","V","S","D"].map((d,i)=>(<span key={i} style={{ flex:1, textAlign:"center", fontSize:"5px", color:"rgba(255,255,255,0.25)", fontWeight:600 }}>{d}</span>))}
                    </div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"5px", marginBottom:"7px" }}>
                    {[{icon:"trending_up",val:"28%",label:"ROI",c:"#22d3ee"},{icon:"pie_chart",val:"43%",label:"Margen",c:"#818cf8"}].map((m,i)=>(
                      <div key={i} style={{ borderRadius:"11px", padding:"7px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", gap:"5px" }}>
                        <span className="material-symbols-outlined" style={{ fontSize:"11px", color:m.c }}>{m.icon}</span>
                        <div><p style={{ fontSize:"9px", color:"#fff", fontWeight:900 }}>{m.val}</p><p style={{ fontSize:"5px", color:"rgba(255,255,255,0.35)", textTransform:"uppercase" }}>{m.label}</p></div>
                      </div>
                    ))}
                  </div>
                  <div style={{ borderRadius:"11px", padding:"8px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
                    <p style={{ fontSize:"6px", color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:"5px" }}>Movimientos</p>
                    {[{n:"Dividendos",v:"+$2,400",c:"#22d3ee"},{n:"Inversión",v:"-$800",c:"#f87171"}].map((t,i)=>(
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"3px 0", borderBottom:i===0?"1px solid rgba(255,255,255,0.05)":"none" }}>
                        <span style={{ fontSize:"7px", color:"rgba(255,255,255,0.55)" }}>{t.n}</span>
                        <span style={{ fontSize:"7px", color:t.c, fontWeight:700 }}>{t.v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex", justifyContent:"center", marginTop:"7px" }}>
                    <div style={{ width:"46px", height:"4px", borderRadius:"2px", background:"rgba(255,255,255,0.2)" }}></div>
                  </div>
                </div>
              </div>

              {/* ══ CARA TRASERA — S25 ULTRA TITANIUM SILVER ══ */}
              <div style={face({
                transform:`translateZ(-${HALF}px) rotateY(180deg)`,
                background:`linear-gradient(152deg, ${TI_LIGHT} 0%, ${TI_MID} 35%, ${TI_DARK} 58%, ${TI_MID} 80%, ${TI_LIGHT} 100%)`,
                border:`1.5px solid rgba(255,255,255,0.88)`,
                boxShadow:`inset 0 2px 0 rgba(255,255,255,0.95), inset 0 -2px 0 rgba(0,0,0,0.1)`
              })}>
                {/* Botones espejados — titanio */}
                <div style={{ position:"absolute", left:"-3px", top:"118px", width:"3px", height:"52px", borderRadius:"1px", background:`linear-gradient(to bottom,${TI_LIGHT},${TI_DARK},${TI_LIGHT})` }}></div>
                <div style={{ position:"absolute", right:"-3px", top:"98px",  width:"3px", height:"32px", borderRadius:"1px", background:`linear-gradient(to bottom,${TI_LIGHT},${TI_DARK})` }}></div>
                <div style={{ position:"absolute", right:"-3px", top:"142px", width:"3px", height:"32px", borderRadius:"1px", background:`linear-gradient(to bottom,${TI_LIGHT},${TI_DARK})` }}></div>

                {/* ── ISLA DE CÁMARA S25 ULTRA ──
                    El S25 Ultra tiene la isla en esquina superior izquierda,
                    no centrada — es una protuberancia integrada en el cuerpo */}
                <div style={{ position:"absolute", top:"18px", left:"18px", width:"82px", height:"106px", borderRadius:"24px",
                  background:"linear-gradient(150deg,#1a1c28,#0d0e18,#1a1c28)",
                  border:"1.5px solid rgba(0,0,0,0.28)",
                  boxShadow:"0 4px 18px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"space-evenly", padding:"10px 12px" }}>
                  {/* 2 cámaras arriba */}
                  <div style={{ display:"flex", gap:"15px" }}>
                    {[26,26].map((s,i)=>(
                      <div key={i} style={{ position:"relative", width:`${s}px`, height:`${s}px` }}>
                        <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"#08080f", border:"2px solid rgba(55,55,95,0.7)", boxShadow:"0 2px 12px rgba(0,0,0,0.9)" }}></div>
                        <div style={{ position:"absolute", inset:"5px", borderRadius:"50%", background:"radial-gradient(circle at 32% 32%,#1e1e38,#030308)" }}></div>
                        <div style={{ position:"absolute", top:"6px", left:"6px", width:"5px", height:"5px", borderRadius:"50%", background:"rgba(255,255,255,0.65)" }}></div>
                      </div>
                    ))}
                  </div>
                  {/* Cámara grande + flash */}
                  <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
                    <div style={{ position:"relative", width:"32px", height:"32px" }}>
                      <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"#08080f", border:"2.5px solid rgba(55,55,95,0.8)", boxShadow:"0 2px 14px rgba(0,0,0,0.95)" }}></div>
                      <div style={{ position:"absolute", inset:"5px", borderRadius:"50%", background:"radial-gradient(circle at 32% 32%,#1e1e38,#030308)" }}></div>
                      <div style={{ position:"absolute", top:"8px", left:"8px", width:"6px", height:"6px", borderRadius:"50%", background:"rgba(255,255,255,0.7)" }}></div>
                    </div>
                    <div style={{ width:"11px", height:"11px", borderRadius:"50%", background:"radial-gradient(circle,#fffacc,#e8c055)", boxShadow:"0 0 10px rgba(255,200,60,0.6)", border:"1px solid rgba(200,150,40,0.4)" }}></div>
                  </div>
                </div>

                {/* Logo SAMSUNG */}
                <div style={{ position:"absolute", bottom:"108px", left:"50%", transform:"translateX(-50%)", textAlign:"center" }}>
                  <p style={{ fontSize:"13px", fontWeight:700, letterSpacing:"0.32em", color:"rgba(50,55,70,0.58)", fontFamily:"'Helvetica Neue',Helvetica,sans-serif", textTransform:"uppercase", textShadow:"0 1px 2px rgba(255,255,255,0.62)", whiteSpace:"nowrap" }}>SAMSUNG</p>
                  <div style={{ width:"34px", height:"1px", background:"rgba(70,80,100,0.22)", margin:"8px auto 0" }}></div>
                </div>

                {/* Reflejo superior */}
                <div style={{ position:"absolute", inset:0, pointerEvents:"none", borderRadius:`${R}px`,
                  background:"linear-gradient(125deg,rgba(255,255,255,0.38) 0%,rgba(255,255,255,0) 50%)",
                  mixBlendMode:"screen"
                }}></div>

                {/* Textura brushed metal */}
                <div style={{ position:"absolute", inset:0, borderRadius:`${R}px`, pointerEvents:"none",
                  background:"repeating-linear-gradient(90deg,transparent,transparent 3px,rgba(0,0,0,0.01) 3px,rgba(0,0,0,0.01) 6px)"
                }}></div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
