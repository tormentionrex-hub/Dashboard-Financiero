/**
 * HeroSection — NASA Space Shop
 * Animations: GSAP skills (gsap-react, gsap-timeline, gsap-core, gsap-plugins, gsap-scrolltrigger)
 */
import React, { useRef, useMemo } from 'react';
import { gsap }          from 'gsap';
import { SplitText }     from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP }       from '@gsap/react';

/* Register plugins once at module level — skill requirement */
gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

/* ── Phone constants (untouched) ── */
const PW   = 200;
const PH   = 420;
const HALF = 13;
const R    = 28;
const TI_LIGHT = "#e8edf2";
const TI_MID   = "#c8cfd8";
const TI_DARK  = "#b0b8c2";

/* ── NASA meatball logo ── */
const NasaLogo = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="47" fill="#0b3d91"/>
    <circle cx="18" cy="26" r="2.4" fill="white" opacity="0.9"/>
    <circle cx="30" cy="17" r="1.7" fill="white" opacity="0.8"/>
    <circle cx="12" cy="40" r="1.4" fill="white" opacity="0.7"/>
    <circle cx="80" cy="20" r="2"   fill="white" opacity="0.9"/>
    <circle cx="88" cy="36" r="1.4" fill="white" opacity="0.7"/>
    <circle cx="74" cy="12" r="1.8" fill="white" opacity="0.85"/>
    <circle cx="22" cy="60" r="1.3" fill="white" opacity="0.6"/>
    <circle cx="85" cy="58" r="1.5" fill="white" opacity="0.7"/>
    <ellipse cx="50" cy="50" rx="47" ry="16" fill="none"
      stroke="#fc3d21" strokeWidth="6" transform="rotate(-28 50 50)"/>
    <text x="50" y="61" fontFamily="'Arial Black',Arial,sans-serif"
      fontSize="23" fill="white" textAnchor="middle" fontWeight="900" letterSpacing="2">
      NASA
    </text>
  </svg>
);

/* ── Star field — memoised ── */
const STAR_COUNT = 50;
const StarField = React.memo(() => {
  const stars = useMemo(() =>
    Array.from({ length: STAR_COUNT }, (_, i) => ({
      id:    i,
      top:   `${Math.random() * 100}%`,
      left:  `${Math.random() * 100}%`,
      size:  Math.random() * 2.5 + 0.8,
      delay: Math.random() * 4,
      dur:   Math.random() * 3 + 2,
    }))
  , []);

  return (
    <div className="star-field absolute inset-0 pointer-events-none">
      {stars.map(s => (
        <div
          key={s.id}
          className="star absolute rounded-full bg-white"
          style={{ top: s.top, left: s.left,
                   width: `${s.size}px`, height: `${s.size}px`, opacity: 0 }}
          data-delay={s.delay}
          data-dur={s.dur}
        />
      ))}
    </div>
  );
});

/* ── Orbital rings SVG (no inline opacity — GSAP controls it) ── */
const OrbitalRings = React.forwardRef((_, ref) => (
  <svg
    ref={ref}
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 500 500"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle className="ring ring-1" cx="250" cy="250" r="110"
      fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="1"
      strokeDasharray="4 8"/>
    <circle className="ring ring-2" cx="250" cy="250" r="160"
      fill="none" stroke="rgba(6,182,212,0.13)" strokeWidth="1"
      strokeDasharray="2 12"/>
    <circle cx="250" cy="250" r="210"
      fill="none" stroke="rgba(99,102,241,0.06)" strokeWidth="0.5"/>
    {/* Orbiting dots */}
    <circle className="orbit-dot"   cx="360" cy="250" r="4" fill="rgba(99,102,241,0.9)"
      style={{ filter:'drop-shadow(0 0 6px rgba(99,102,241,1))' }}/>
    <circle className="orbit-dot-2" cx="250" cy="90"  r="3" fill="rgba(6,182,212,0.9)"
      style={{ filter:'drop-shadow(0 0 5px rgba(6,182,212,1))' }}/>
  </svg>
));

/* ═══════════════════════════════════════════ MAIN COMPONENT ═══ */
export default function HeroSection({ isPlaying, onToggle }) {

  /* ── Refs ── */
  const container   = useRef();
  const logoWrapRef = useRef();
  const glowRef     = useRef();
  const titleRef    = useRef();
  const subtitleRef = useRef();
  const descRef     = useRef();
  const metricsRef  = useRef();
  const buttonsRef  = useRef();
  const orbitSvgRef = useRef();   /* ref on the SVG itself via forwardRef */

  /* Phone refs — untouched */
  const floatRef    = useRef();
  const driftRef    = useRef();
  const spinRef     = useRef();
  /* Store the spin tween so we can control its timeScale properly */
  const spinTweenRef = useRef(null);

  /* ════════════════════════════════════════════════════
     useGSAP — scope + contextSafe (gsap-react skill)
  ════════════════════════════════════════════════════ */
  useGSAP((context, contextSafe) => {

    /* ── gsap.matchMedia — respects prefers-reduced-motion (gsap-core skill) ── */
    const mm = gsap.matchMedia();
    mm.add(
      {
        motion:       "(prefers-reduced-motion: no-preference)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { reduceMotion } = ctx.conditions;
        const D = reduceMotion ? 0 : 1; /* duration multiplier */

        /* ── Stars twinkle ── */
        gsap.utils.toArray('.star', container.current).forEach(star => {
          gsap.to(star, {
            autoAlpha: Math.random() * 0.7 + 0.15,
            duration:  parseFloat(star.dataset.dur),
            delay:     parseFloat(star.dataset.delay),
            repeat: -1, yoyo: true,
            ease: "sine.inOut",
          });
        });

        /* ══════════════════════════════════════════
           MASTER TIMELINE  (gsap-timeline skill)
           defaults shared by all children
        ══════════════════════════════════════════ */
        const tl = gsap.timeline({
          defaults: { ease: "power3.out", duration: D * 0.85 },
        });

        /* Label "logo" ─ t = 0.0 */
        tl.addLabel("logo", 0);

        tl.from(logoWrapRef.current, {
          scale: 0.25, autoAlpha: 0, rotation: -200,
          duration: D * 1.35, ease: "back.out(1.5)",
        }, "logo");

        /* Animación continua de flotación para el logo de la NASA */
        gsap.to(logoWrapRef.current, {
          y: -15,
          rotationZ: 4,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: D * 1.35
        });

        tl.from(glowRef.current, {
          scale: 0.05, autoAlpha: 0,
          duration: D * 1.6, ease: "power2.out",
        }, "logo");

        /* Orbital SVG — from below + fade */
        tl.from(orbitSvgRef.current, {
          scale: 0.5, autoAlpha: 0,
          duration: D * 1.4, ease: "power2.out",
        }, "logo+=0.15");

        /* Label "title" ─ after logo */
        tl.addLabel("title", `logo+=${D * 0.55}`);

        /* ── Title words — separate spans preserve gradient (gsap-core stagger) ── */
        tl.from(".title-word", {
          autoAlpha: 0,
          y:         55,
          rotationX: -80,
          transformOrigin: "50% 100%",
          stagger: { each: 0.12, from: "start" },
          duration: D * 0.85,
          ease: "back.out(2)",
        }, "title");

        /* Label "sub" */
        tl.addLabel("sub", "title+=0.4");

        /* Subtitle — SplitText word reveal */
        const splitSub = SplitText.create(subtitleRef.current, { type: "words" });
        tl.from(splitSub.words, {
          autoAlpha: 0,
          y:         20,
          stagger: { each: 0.055, from: "start" },
          duration: D * 0.6,
          ease: "power2.out",
        }, "sub");

        /* Description — SplitText word reveal */
        tl.addLabel("desc", "sub+=0.25");
        const splitDesc = SplitText.create(descRef.current, { type: "words" });
        tl.from(splitDesc.words, {
          autoAlpha: 0,
          y:         14,
          stagger: { each: 0.038, from: "start" },
          duration: D * 0.5,
          ease: "power2.out",
        }, "desc");

        /* Metrics — stagger from center (gsap-core) */
        tl.addLabel("metrics", "desc+=0.3");
        tl.from(".metric-item", {
          autoAlpha: 0,
          y:         28,
          scale:     0.82,
          stagger: { each: 0.1, from: "center" },
          duration: D * 0.7,
          ease: "back.out(1.7)",
        }, "metrics");

        /* Buttons — stagger entrance */
        tl.addLabel("btns", "metrics+=0.28");
        tl.from(".hero-btn", {
          autoAlpha: 0,
          y:         22,
          scale:     0.88,
          stagger: { each: 0.08, from: "start" },
          duration: D * 0.6,
          ease: "back.out(1.5)",
        }, "btns");

        /* Counters — plain JS object avoids innerText NaN issues */
        if (!reduceMotion) {
          document.querySelectorAll(".counter").forEach(el => {
            const target = parseFloat(el.dataset.target);
            const obj = { val: 0 };
            gsap.to(obj, {
              val:      target,
              duration: 2.6,
              delay:    tl.duration() * 0.85,
              ease:     "power2.out",
              onUpdate() {
                el.textContent = target < 100
                  ? obj.val.toFixed(1)
                  : Math.round(obj.val).toLocaleString();
              },
              onComplete() {
                el.textContent = target < 100
                  ? target.toFixed(1)
                  : target.toLocaleString();
              },
            });
          });
        }

        /* ══════════════════════════════════════════
           CONTINUOUS (repeat: -1) — gsap-core
        ══════════════════════════════════════════ */

        /* Glow pulse */
        gsap.to(glowRef.current, {
          scale: 1.18, autoAlpha: 0.45,
          duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut",
          delay: D * 1.2,
        });

        /* Metric cards glow pulse — stagger random */
        gsap.to(".metric-item", {
          boxShadow: "0 0 26px rgba(99,102,241,0.4)",
          duration:  2.2,
          repeat: -1, yoyo: true,
          ease: "sine.inOut",
          stagger: { each: 0.7, from: "random" },
          delay: D * 1.8,
        });

        if (!reduceMotion) {
          /* Ring-1 slow rotation (transform on SVG element, svgOrigin = centre) */
          gsap.to(".ring-1", {
            rotation: 360, svgOrigin: "250 250",
            duration: 32, repeat: -1, ease: "none",
          });
          gsap.to(".ring-2", {
            rotation: -360, svgOrigin: "250 250",
            duration: 48, repeat: -1, ease: "none",
          });
          /* Orbit dot 1 */
          gsap.to(".orbit-dot", {
            rotation: 360, svgOrigin: "250 250",
            duration: 9, repeat: -1, ease: "none",
          });
          /* Orbit dot 2 — opposite */
          gsap.to(".orbit-dot-2", {
            rotation: -360, svgOrigin: "250 250",
            duration: 14, repeat: -1, ease: "none",
          });
        }

        /* ══════════════════════════════════════════
           PHONE ANIMATIONS — untouched logic
           Fix: store spinTween ref, animate ITS timeScale
        ══════════════════════════════════════════ */
        gsap.to(floatRef.current, {
          y: -24, duration: 7, repeat: -1, yoyo: true, ease: "sine.inOut",
        });
        gsap.to(driftRef.current, {
          rotateX: 12, duration: 9, repeat: -1, yoyo: true, ease: "sine.inOut",
        });
        gsap.to(driftRef.current, {
          rotateZ: 5, duration: 13, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2,
        });
        /* Spin tween — store ref for timeScale control */
        spinTweenRef.current = gsap.to(spinRef.current, {
          rotateY: 360, duration: 28, repeat: -1, ease: "none",
          id: "phone-spin",
        });

        /* ══════════════════════════════════════════
           SCROLL TRIGGER parallax — top-level tweens
           (gsap-scrolltrigger skill: NOT inside timeline)
        ══════════════════════════════════════════ */
        if (!reduceMotion) {
          gsap.to(logoWrapRef.current, {
            y: -55,
            scrollTrigger: {
              trigger: container.current,
              start: "top top", end: "bottom top",
              scrub: 1.2,
            },
          });
          gsap.to(titleRef.current, {
            y: -38,
            scrollTrigger: {
              trigger: container.current,
              start: "top top", end: "bottom top",
              scrub: 0.8,
            },
          });
          gsap.to(".star-field", {
            y: -75,
            scrollTrigger: {
              trigger: container.current,
              start: "top top", end: "bottom top",
              scrub: 2,
            },
          });
        }

        return () => {
          /* matchMedia cleanup — revert runs automatically; SplitText reverts via context */
        };
      }
    ); /* end mm.add */

    /* ══════════════════════════════════════════
       contextSafe event handlers (gsap-react skill)
       Magnetic buttons + phone cursor tilt
    ══════════════════════════════════════════ */
    const btns = gsap.utils.toArray('.hero-btn', container.current);
    const btnCleanups = btns.map(btn => {
      const onEnter = contextSafe(() => {
        gsap.to(btn, { scale: 1.07, duration: 0.22, ease: "power2.out" });
      });
      const onLeave = contextSafe(() => {
        gsap.to(btn, { scale: 1, x: 0, y: 0,
          duration: 0.4, ease: "elastic.out(1, 0.4)" });
      });
      const onMove = contextSafe((e) => {
        const rect = btn.getBoundingClientRect();
        const mx = e.clientX - (rect.left + rect.width  / 2);
        const my = e.clientY - (rect.top  + rect.height / 2);
        gsap.to(btn, {
          x: mx * 0.2, y: my * 0.2,
          duration: 0.28, ease: "power2.out", overwrite: "auto",
        });
      });
      btn.addEventListener("mouseenter", onEnter);
      btn.addEventListener("mouseleave", onLeave);
      btn.addEventListener("mousemove",  onMove);
      return () => {
        btn.removeEventListener("mouseenter", onEnter);
        btn.removeEventListener("mouseleave", onLeave);
        btn.removeEventListener("mousemove",  onMove);
      };
    });

    /* Phone cursor tilt — fix: animate spinTweenRef.current (the TWEEN), not the DOM el */
    const onMouseMove = contextSafe((e) => {
      if (!floatRef.current) return;
      const rect = floatRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dist = Math.sqrt(
        Math.pow((e.clientX - cx) / 320, 2) +
        Math.pow((e.clientY - cy) / 360, 2)
      );
      const prox = Math.max(0, 1 - dist);
      if (prox > 0.05) {
        const nx = (e.clientX - cx) / 320;
        const ny = (e.clientY - cy) / 360;
        gsap.to(driftRef.current, {
          rotateX: 12 - ny * 28 * prox,
          rotateZ:  5 + nx * 14 * prox,
          duration: 1.2, ease: "power1.out", overwrite: "auto",
        });
        if (spinTweenRef.current) {
          spinTweenRef.current.timeScale(Math.max(0.15, 1 - prox * 0.75));
        }
      } else {
        if (spinTweenRef.current) {
          spinTweenRef.current.timeScale(1);
        }
      }
    });
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      btnCleanups.forEach(fn => fn());
      mm.revert();
    };

  }, { scope: container }); /* end useGSAP */

  /* ── Phone face helper ── */
  const face = (extra = {}) => ({
    position:"absolute", top:0, left:0,
    width:`${PW}px`, height:`${PH}px`,
    borderRadius:`${R}px`,
    backfaceVisibility:"hidden", WebkitBackfaceVisibility:"hidden",
    overflow:"hidden",
    ...extra,
  });

  /* ════════════════════════════════ RENDER ════════════════════════════════ */
  return (
    <section
      ref={container}
      className="relative bg-transparent flex flex-col md:flex-row items-center justify-between w-full gap-10 md:gap-4"
    >
      {/* Stars */}
      <StarField />

      {/* Orbital rings — centred behind logo, pointer-none */}
      <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center md:justify-start md:pl-20 pointer-events-none z-0">
        <div className="relative w-80 h-80 md:w-96 md:h-96 flex-shrink-0">
          <OrbitalRings ref={orbitSvgRef} />
        </div>
      </div>

      {/* ══ TEXT COLUMN ══ */}
      <div className="flex-1 z-10 flex flex-col items-center text-center px-4 md:px-0 mx-auto relative">

        {/* Glow halo */}
        <div className="relative mb-5 flex items-center justify-center">
          <div
            ref={glowRef}
            className="absolute rounded-full pointer-events-none"
            style={{
              width:"180px", height:"180px",
              background:"radial-gradient(circle, rgba(11,61,145,0.75) 0%, rgba(99,102,241,0.4) 45%, transparent 70%)",
              filter:"blur(20px)",
            }}
          />
          <div
            ref={logoWrapRef}
            style={{ filter:"drop-shadow(0 0 26px rgba(11,61,145,0.95))" }}
          >
            <NasaLogo size={90} />
          </div>
        </div>

        {/* Title — three .title-word spans animate independently */}
        <h1
          ref={titleRef}
          className="text-4xl md:text-5xl xl:text-[4.8rem] font-black tracking-tighter leading-[0.9] mb-4 text-white drop-shadow-[0_8px_24px_rgba(99,102,241,0.45)] text-center"
          style={{ perspective:"600px" }}
        >
          <span className="title-word inline-block">NASA</span>{" "}
          <span className="title-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-200 to-blue-400">
            SPACE
          </span>{" "}
          <span className="title-word inline-block">SHOP</span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-[11px] font-black tracking-[0.32em] text-indigo-300/80 uppercase mb-4"
        >
          Tienda Oficial · Artículos Espaciales · Misiones Exclusivas
        </p>

        {/* Description */}
        <p
          ref={descRef}
          className="text-sm text-white/65 mb-10 leading-relaxed max-w-md font-medium"
        >
          La tienda oficial de la NASA.{" "}
          <span className="text-indigo-300 font-bold">
            Tecnología espacial, coleccionables y experiencias únicas
          </span>{" "}
          al alcance de todos.
        </p>

        {/* Metrics */}
        <div ref={metricsRef} className="flex flex-wrap gap-4 mb-10 justify-center">
          {[
            { label:"ROI Anual",    value:"28",   suffix:"%" },
            { label:"Margen Bruto", value:"43",   suffix:"%" },
            { label:"Activos (M)",  value:"1769", suffix:""  },
          ].map((k, i) => (
            <div
              key={i}
              className="metric-item text-center px-5 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <div className="text-2xl font-black text-white leading-none">
                <span className="counter" data-target={parseFloat(k.value)}>
                  {k.value}
                </span>
                <span className="text-indigo-400">{k.suffix}</span>
              </div>
              <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mt-1">
                {k.label}
              </p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div ref={buttonsRef} className="flex flex-wrap gap-4 justify-center">
          <button className="hero-btn bg-indigo-500 hover:bg-indigo-400 text-white px-9 py-3.5 rounded-sm font-black text-[10px] uppercase tracking-widest shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:shadow-[0_0_50px_rgba(99,102,241,0.7)] transition-shadow">
            Ejecutar Análisis
          </button>
          <button className="hero-btn bg-white/5 backdrop-blur-xl text-white px-9 py-3.5 rounded-sm font-black text-[10px] uppercase tracking-widest border border-white/20 hover:bg-white/10 transition-all">
            Ver Protocolos
          </button>
          <button
            onClick={onToggle}
            className="hero-btn flex items-center gap-2 text-white/50 hover:text-white px-4 py-3.5 text-[10px] font-black uppercase tracking-widest border border-white/10 hover:border-white/20 rounded-sm transition-all"
          >
            <span className="material-symbols-outlined text-base">
              {isPlaying ? "pause" : "play_arrow"}
            </span>
          </button>
        </div>
      </div>

      {/* ══ TELÉFONO 3D — untouched ══ */}
      <div
        className="relative flex-shrink-0 flex items-start justify-center w-64 md:w-80 self-start z-10"
        style={{ perspective:"1000px", perspectiveOrigin:"50% 50%" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          background:"radial-gradient(ellipse at 50% 56%, rgba(99,102,241,0.3) 0%, transparent 65%)",
          filter:"blur(44px)",
        }}/>
        <div className="absolute pointer-events-none" style={{
          bottom:"-38px", left:"50%", transform:"translateX(-50%)",
          width:`${PW * 0.7}px`, height:"12px",
          background:"rgba(40,30,160,0.45)", filter:"blur(16px)",
        }}/>

        <div ref={floatRef} style={{ transformStyle:"preserve-3d" }}>
          <div ref={driftRef} style={{ transformStyle:"preserve-3d", transform:"rotateX(10deg) rotateZ(2deg)" }}>
            <div ref={spinRef} style={{ position:"relative", width:`${PW}px`, height:`${PH}px`, transformStyle:"preserve-3d" }}>

              {["front","back"].map(side =>
                Array.from({length:13},(_,i) => {
                  const z = HALF - 2 - i*2;
                  const b = 1 - Math.abs(z)/(HALF*2.2);
                  const cr = Math.round(180 + b*32);
                  const cg = Math.round(188 + b*24);
                  const cb = Math.round(204 + b*20);
                  const transform = side==="front"
                    ? `translateZ(${z}px)`
                    : `rotateY(180deg) translateZ(${z}px)`;
                  return (
                    <div key={`${side}-${i}`} style={{
                      position:"absolute", top:0, left:0,
                      width:`${PW}px`, height:`${PH}px`,
                      borderRadius:`${R}px`, transform,
                      background:`rgb(${cr},${cg},${cb})`,
                      backfaceVisibility:"hidden", WebkitBackfaceVisibility:"hidden",
                      boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.16)",
                    }}/>
                  );
                })
              )}

              {/* Cara delantera */}
              <div style={face({
                transform:`translateZ(${HALF}px)`,
                background:`linear-gradient(160deg,${TI_LIGHT} 0%,${TI_MID} 45%,${TI_DARK} 65%,${TI_MID} 100%)`,
                border:`1.5px solid rgba(255,255,255,0.95)`,
                boxShadow:["inset 0 2px 0 rgba(255,255,255,0.95)","inset 0 -2px 0 rgba(0,0,0,0.12)","inset 2px 0 0 rgba(255,255,255,0.55)","inset -2px 0 0 rgba(0,0,0,0.08)"].join(","),
              })}>
                <div style={{position:"absolute",right:"-3px",top:"118px",width:"3px",height:"52px",borderRadius:"1px",background:`linear-gradient(to bottom,${TI_LIGHT},${TI_DARK},${TI_LIGHT})`}}/>
                <div style={{position:"absolute",left:"-3px",top:"98px",width:"3px",height:"32px",borderRadius:"1px",background:`linear-gradient(to bottom,${TI_LIGHT},${TI_DARK})`}}/>
                <div style={{position:"absolute",left:"-3px",top:"142px",width:"3px",height:"32px",borderRadius:"1px",background:`linear-gradient(to bottom,${TI_LIGHT},${TI_DARK})`}}/>
                <div style={{position:"absolute",top:"9px",left:"50%",transform:"translateX(-50%)",width:"10px",height:"10px",borderRadius:"50%",background:"#050508",border:"1px solid rgba(0,0,0,0.5)",zIndex:30}}>
                  <div style={{position:"absolute",top:"2px",left:"2px",width:"3px",height:"3px",borderRadius:"50%",background:"rgba(255,255,255,0.25)"}}/>
                </div>
                <div style={{position:"absolute",inset:0,pointerEvents:"none",borderRadius:`${R}px`,zIndex:22,background:"linear-gradient(135deg,rgba(255,255,255,0.45) 0%,rgba(255,255,255,0) 40%)",mixBlendMode:"screen"}}/>
                <div style={{position:"absolute",inset:"6px",borderRadius:`${R-4}px`,background:"linear-gradient(180deg,#08081c,#050510)",overflow:"hidden",padding:"24px 10px 10px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"7px",padding:"0 3px"}}>
                    <span style={{fontSize:"7px",color:"rgba(255,255,255,0.55)",fontWeight:700}}>9:41</span>
                    <div style={{display:"flex",alignItems:"flex-end",gap:"2px"}}>
                      {[3,5,7,9].map((h,i)=>(<div key={i} style={{width:"2px",height:`${h}px`,background:"rgba(255,255,255,0.6)",borderRadius:"1px"}}/>))}
                      <span className="material-symbols-outlined" style={{fontSize:"8px",color:"rgba(255,255,255,0.6)",marginLeft:"2px"}}>wifi</span>
                      <span className="material-symbols-outlined" style={{fontSize:"8px",color:"rgba(255,255,255,0.6)"}}>battery_5_bar</span>
                    </div>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"9px"}}>
                    <div>
                      <p style={{fontSize:"6px",color:"rgba(99,102,241,0.9)",textTransform:"uppercase",letterSpacing:"0.15em",fontWeight:700}}>Panel Neural</p>
                      <p style={{fontSize:"9px",color:"#fff",fontWeight:900}}>Resumen Hoy</p>
                    </div>
                    <div style={{width:"24px",height:"24px",borderRadius:"50%",background:"rgba(99,102,241,0.2)",border:"1px solid rgba(99,102,241,0.35)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span className="material-symbols-outlined" style={{fontSize:"11px",color:"#818cf8"}}>account_circle</span>
                    </div>
                  </div>
                  <div style={{borderRadius:"16px",padding:"11px",background:"linear-gradient(135deg,rgba(99,102,241,0.82),rgba(67,56,202,0.9))",border:"1px solid rgba(99,102,241,0.35)",boxShadow:"0 10px 24px rgba(99,102,241,0.3)",marginBottom:"8px"}}>
                    <p style={{fontSize:"6px",color:"rgba(199,210,254,0.75)",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"4px"}}>Patrimonio Total</p>
                    <p style={{fontSize:"17px",color:"#fff",fontWeight:900,lineHeight:1}}>$1,769,520</p>
                    <div style={{display:"flex",alignItems:"center",gap:"4px",marginTop:"6px"}}>
                      <span className="material-symbols-outlined" style={{fontSize:"8px",color:"#67e8f9"}}>arrow_upward</span>
                      <span style={{fontSize:"7px",color:"#67e8f9",fontWeight:700}}>+4.2% esta semana</span>
                    </div>
                  </div>
                  <div style={{borderRadius:"13px",padding:"9px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",marginBottom:"8px"}}>
                    <div style={{display:"flex",alignItems:"flex-end",gap:"3px",height:"36px"}}>
                      {[38,55,32,68,58,82,62].map((h,i)=>(<div key={i} style={{flex:1,borderRadius:"3px",height:`${h}%`,background:i===5?"linear-gradient(to top,#6366f1,#818cf8)":"rgba(99,102,241,0.22)"}}/>))}
                    </div>
                    <div style={{display:"flex",marginTop:"3px"}}>
                      {["L","M","X","J","V","S","D"].map((d,i)=>(<span key={i} style={{flex:1,textAlign:"center",fontSize:"5px",color:"rgba(255,255,255,0.25)",fontWeight:600}}>{d}</span>))}
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5px",marginBottom:"7px"}}>
                    {[{icon:"trending_up",val:"28%",label:"ROI",c:"#22d3ee"},{icon:"pie_chart",val:"43%",label:"Margen",c:"#818cf8"}].map((m,i)=>(
                      <div key={i} style={{borderRadius:"11px",padding:"7px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",gap:"5px"}}>
                        <span className="material-symbols-outlined" style={{fontSize:"11px",color:m.c}}>{m.icon}</span>
                        <div><p style={{fontSize:"9px",color:"#fff",fontWeight:900}}>{m.val}</p><p style={{fontSize:"5px",color:"rgba(255,255,255,0.35)",textTransform:"uppercase"}}>{m.label}</p></div>
                      </div>
                    ))}
                  </div>
                  <div style={{borderRadius:"11px",padding:"8px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)"}}>
                    <p style={{fontSize:"6px",color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"5px"}}>Movimientos</p>
                    {[{n:"Dividendos",v:"+$2,400",c:"#22d3ee"},{n:"Inversión",v:"-$800",c:"#f87171"}].map((t,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:i===0?"1px solid rgba(255,255,255,0.05)":"none"}}>
                        <span style={{fontSize:"7px",color:"rgba(255,255,255,0.55)"}}>{t.n}</span>
                        <span style={{fontSize:"7px",color:t.c,fontWeight:700}}>{t.v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex",justifyContent:"center",marginTop:"7px"}}>
                    <div style={{width:"46px",height:"4px",borderRadius:"2px",background:"rgba(255,255,255,0.2)"}}/>
                  </div>
                </div>
              </div>

              {/* Cara trasera */}
              <div style={face({
                transform:`translateZ(-${HALF}px) rotateY(180deg)`,
                background:`linear-gradient(152deg,${TI_LIGHT} 0%,${TI_MID} 35%,${TI_DARK} 58%,${TI_MID} 80%,${TI_LIGHT} 100%)`,
                border:`1.5px solid rgba(255,255,255,0.88)`,
                boxShadow:`inset 0 2px 0 rgba(255,255,255,0.95),inset 0 -2px 0 rgba(0,0,0,0.1)`,
              })}>
                <div style={{position:"absolute",left:"-3px",top:"118px",width:"3px",height:"52px",borderRadius:"1px",background:`linear-gradient(to bottom,${TI_LIGHT},${TI_DARK},${TI_LIGHT})`}}/>
                <div style={{position:"absolute",right:"-3px",top:"98px",width:"3px",height:"32px",borderRadius:"1px",background:`linear-gradient(to bottom,${TI_LIGHT},${TI_DARK})`}}/>
                <div style={{position:"absolute",right:"-3px",top:"142px",width:"3px",height:"32px",borderRadius:"1px",background:`linear-gradient(to bottom,${TI_LIGHT},${TI_DARK})`}}/>
                <div style={{position:"absolute",top:"18px",left:"18px",width:"82px",height:"106px",borderRadius:"24px",
                  background:"linear-gradient(150deg,#1a1c28,#0d0e18,#1a1c28)",border:"1.5px solid rgba(0,0,0,0.28)",
                  boxShadow:"0 4px 18px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.05)",
                  display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-evenly",padding:"10px 12px"}}>
                  <div style={{display:"flex",gap:"15px"}}>
                    {[26,26].map((s,i)=>(
                      <div key={i} style={{position:"relative",width:`${s}px`,height:`${s}px`}}>
                        <div style={{position:"absolute",inset:0,borderRadius:"50%",background:"#08080f",border:"2px solid rgba(55,55,95,0.7)",boxShadow:"0 2px 12px rgba(0,0,0,0.9)"}}/>
                        <div style={{position:"absolute",inset:"5px",borderRadius:"50%",background:"radial-gradient(circle at 32% 32%,#1e1e38,#030308)"}}/>
                        <div style={{position:"absolute",top:"6px",left:"6px",width:"5px",height:"5px",borderRadius:"50%",background:"rgba(255,255,255,0.65)"}}/>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
                    <div style={{position:"relative",width:"32px",height:"32px"}}>
                      <div style={{position:"absolute",inset:0,borderRadius:"50%",background:"#08080f",border:"2.5px solid rgba(55,55,95,0.8)",boxShadow:"0 2px 14px rgba(0,0,0,0.95)"}}/>
                      <div style={{position:"absolute",inset:"5px",borderRadius:"50%",background:"radial-gradient(circle at 32% 32%,#1e1e38,#030308)"}}/>
                      <div style={{position:"absolute",top:"8px",left:"8px",width:"6px",height:"6px",borderRadius:"50%",background:"rgba(255,255,255,0.7)"}}/>
                    </div>
                    <div style={{width:"11px",height:"11px",borderRadius:"50%",background:"radial-gradient(circle,#fffacc,#e8c055)",boxShadow:"0 0 10px rgba(255,200,60,0.6)",border:"1px solid rgba(200,150,40,0.4)"}}/>
                  </div>
                </div>
                <div style={{position:"absolute",bottom:"108px",left:"50%",transform:"translateX(-50%)",textAlign:"center"}}>
                  <p style={{fontSize:"13px",fontWeight:700,letterSpacing:"0.32em",color:"rgba(50,55,70,0.58)",fontFamily:"'Helvetica Neue',Helvetica,sans-serif",textTransform:"uppercase",textShadow:"0 1px 2px rgba(255,255,255,0.62)",whiteSpace:"nowrap"}}>SAMSUNG</p>
                  <div style={{width:"34px",height:"1px",background:"rgba(70,80,100,0.22)",margin:"8px auto 0"}}/>
                </div>
                <div style={{position:"absolute",inset:0,pointerEvents:"none",borderRadius:`${R}px`,background:"linear-gradient(125deg,rgba(255,255,255,0.38) 0%,rgba(255,255,255,0) 50%)",mixBlendMode:"screen"}}/>
                <div style={{position:"absolute",inset:0,borderRadius:`${R}px`,pointerEvents:"none",background:"repeating-linear-gradient(90deg,transparent,transparent 3px,rgba(0,0,0,0.01) 3px,rgba(0,0,0,0.01) 6px)"}}/>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
