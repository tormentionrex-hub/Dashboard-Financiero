// ─────────────────────────────────────────────────────────────────────────────
//  CubeSection — 3D Rotating Cube Gallery for AI Finance Dashboard
//  Adapted from "Cube Gallery / Bad Art" by Luis Martínez
//  Mechanics: scroll-linked cube rotation + cascading text reveal
//  Animations: pure CSS transitions for reveals (matching original),
//              GSAP useGSAP (gsap-react skill) for cube drive & cleanup
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import '../../styles/cube-section.css';

import featureRealtime from '../../images/feature_realtime_metrics.png';
import featureAi       from '../../images/feature_ai_analysis.png';
import featureAgents   from '../../images/feature_autonomous_agents.png';
import featureControl  from '../../images/feature_centralized_control.png';
import featureIntro    from '../../images/feature_intro_question.png';

gsap.registerPlugin(useGSAP);

// ── Section / face data ───────────────────────────────────────────────────────
const SECTIONS = [
  { id: 's0', isIntro: true },
  {
    id: 's1',
    tag: '01 — Monitoreo',
    title: 'VENTAS\nEN\nVIVO',
    face: 'front',
    color: '#6366f1',      // indigo-500
    accent: '#818cf8',
    dotColor: '#6366f1',
    glowColor: 'rgba(99,102,241,0.35)',
    name: 'VISIBILIDAD',
    capNum: '01',
    objective: 'Conocer el estado financiero al instante.',
    problem: 'Esperar al cierre de mes para saber si el negocio es rentable genera decisiones tardías y pérdidas ocultas.',
    solution: 'Un monitor en vivo que muestra exactamente cuánto dinero entra y sale cada segundo, dándote control total.',
  },
  {
    id: 's2',
    tag: '02 — Inteligencia',
    title: 'ANÁLISIS\nEJECUTIVO\nIA',
    face: 'right',
    color: '#a855f7',      // purple-500
    accent: '#c084fc',
    dotColor: '#a855f7',
    glowColor: 'rgba(168,85,247,0.35)',
    name: 'ANÁLISIS',
    capNum: '02',
    objective: 'Entender los números sin ser un experto contable.',
    problem: 'Las hojas de cálculo son confusas y requieren horas de interpretación para encontrar información valiosa.',
    solution: 'Una IA que lee todos los datos y te entrega un resumen claro con recomendaciones listas para usar.',
  },
  {
    id: 's3',
    tag: '03 — Automatización',
    title: 'EMPLEADOS\nVIRTUALES\n24 / 7',
    face: 'back',
    color: '#10b981',      // emerald-500
    accent: '#34d399',
    dotColor: '#10b981',
    glowColor: 'rgba(16,185,129,0.35)',
    name: 'AGENTES',
    capNum: '03',
    objective: 'Delegar tareas operativas y repetitivas.',
    problem: 'Analizar inventarios, contestar clientes y vigilar el mercado consume todo el tiempo de tu equipo.',
    solution: 'ORION, ATLAS y NOVA trabajan 24/7 sin descanso, manejando la rutina para que tú lideres.',
  },
  {
    id: 's4',
    tag: '04 — Escalabilidad',
    title: 'CONTROL\nCENTRAL\nINTELIGENTE',
    face: 'left',
    color: '#06b6d4',      // cyan-500
    accent: '#22d3ee',
    dotColor: '#06b6d4',
    glowColor: 'rgba(6,182,212,0.35)',
    name: 'CONTROL',
    capNum: '04',
    objective: 'Crecer y escalar el negocio sin perder el orden.',
    problem: 'Múltiples herramientas descoordinadas crean caos administrativo al intentar expandir la empresa.',
    solution: 'Un único Centro de Mando que conecta ventas, clientes y proyecciones. Todo a un clic.',
  },
];

// cube face images: front→s1, right→s2, back→s3, left→s4, top/bottom decorative
const FACE_IMAGES = {
  front:  featureRealtime,
  right:  featureAi,
  back:   featureAgents,
  left:   featureControl,
  top:    featureIntro,
  bottom: featureControl,
};

// Cube rotation stops per section index (matches original approach)
const STOPS = [
  { rx:  90, ry:   0 },   // s0 intro  → top face
  { rx:   0, ry:   0 },   // s1        → front face
  { rx:   0, ry: -90 },   // s2        → right face
  { rx:   0, ry: -180 },  // s3        → back face
  { rx:   0, ry: -270 },  // s4        → left face
];

const N = STOPS.length; // 5

const easeIO = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

function lerpStop(s) {
  // s ∈ [0, 1]
  const t = Math.max(0, Math.min(1, s)) * (N - 1);
  const i = Math.min(Math.floor(t), N - 2);
  const f = easeIO(t - i);
  const a = STOPS[i], b = STOPS[i + 1];
  return {
    rx: a.rx + (b.rx - a.rx) * f,
    ry: a.ry + (b.ry - a.ry) * f,
  };
}

function sectionIndexFromScroll(y, tops, innerH) {
  const mid = y + innerH * 0.5;
  let idx = 0;
  for (let i = 0; i < tops.length; i++) {
    if (mid >= tops[i]) idx = i;
  }
  return Math.min(idx, SECTIONS.length - 1);
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function CubeSection() {
  const navigate      = useNavigate();
  const rootRef       = useRef(null);
  const sceneRef      = useRef(null);   // fixed cube scene
  const hudRef        = useRef(null);   // fixed HUD
  const dotsWrapRef   = useRef(null);   // fixed nav dots
  const captionRef    = useRef(null);   // fixed caption
  const cubeRef       = useRef(null);
  const hudPctRef     = useRef(null);
  const progFillRef   = useRef(null);
  const sceneLabelRef = useRef(null);
  const captionNumRef = useRef(null);
  const captionNameRef= useRef(null);
  const dotsRef       = useRef([]);
  const sectionRefs   = useRef([]);

  // Scroll engine state (mutable refs so no re-renders)
  const state = useRef({
    tgt: 0, smooth: 0, velocity: 0,
    maxScroll: 1, sectionTops: [],
    lastSectionIdx: -1,
    anchorRaf: null,
    rafId: null,
    lastNow: 0,
    cubeVisible: false,
  }).current;

  // ── Color theme per section ────────────────────────────────────────────────
  const applyColor = useCallback((idx) => {
    const sec = SECTIONS[idx];
    if (!sec) return;
    const color = sec.color ?? 'rgba(255,255,255,0.3)';
    const accent = sec.accent ?? 'rgba(255,255,255,0.5)';

    // HUD progress fill color
    if (progFillRef.current) progFillRef.current.style.background = color;
    // scene label color
    if (sceneLabelRef.current) sceneLabelRef.current.style.color = accent;
    // caption num color
    if (captionNumRef.current) captionNumRef.current.style.color = color;
    // active dot
    dotsRef.current.forEach((d, i) => {
      if (!d) return;
      d.classList.toggle('active', i === idx);
      d.style.background = i === idx ? color : '';
      d.style.boxShadow  = i === idx ? `0 0 8px ${color}` : '';
    });
    // card border & accent colors — inject via CSS var on root
    if (rootRef.current) {
      rootRef.current.style.setProperty('--cs-accent', accent);
      rootRef.current.style.setProperty('--cs-color', color);
      rootRef.current.style.setProperty('--cs-glow', sec.glowColor ?? 'transparent');
    }
  }, []);

  // ── Local cube progress (relative to CubeSection, NOT global page scroll) ──
  const calcCubeProgress = useCallback((scrollY) => {
    const tops = state.sectionTops;
    if (!tops || tops.length < 2) return 0;
    const first = tops[0];
    const last  = tops[tops.length - 1];
    if (last <= first) return 0;
    return Math.max(0, Math.min(1, (scrollY - first) / (last - first)));
  }, [state]);

  // ── HUD update ───────────────────────────────────────────────────────
  const updateHUD = useCallback((cubeProgress) => {
    const pct = Math.round(cubeProgress * 100);
    const si  = sectionIndexFromScroll(window.scrollY, state.sectionTops, window.innerHeight);

    if (hudPctRef.current)   hudPctRef.current.textContent   = String(pct).padStart(3, '0') + '%';
    if (progFillRef.current) progFillRef.current.style.width = `${pct}%`;

    if (si !== state.lastSectionIdx) {
      state.lastSectionIdx = si;
      const sec = SECTIONS[si];
      if (sceneLabelRef.current && sec)  sceneLabelRef.current.textContent  = sec.name ?? 'INICIO';
      if (captionNumRef.current  && sec) captionNumRef.current.textContent   = sec.capNum ?? '00';
      if (captionNameRef.current && sec) captionNameRef.current.textContent  = sec.name ?? 'CENTRO DE CONTROL';
      applyColor(si);
    }
  }, [applyColor, state]);

  // ── Cube transform (uses local cube progress) ──────────────────────────
  const setCubeTransform = useCallback((cubeProgress) => {
    if (!cubeRef.current) return;
    const { rx, ry } = lerpStop(cubeProgress);
    cubeRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  }, []);

  // ── Section tops ──────────────────────────────────────────────────────────
  const buildSectionTops = useCallback(() => {
    state.sectionTops = sectionRefs.current.map(
      (el) => el ? el.getBoundingClientRect().top + window.scrollY : 0
    );
    state.maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  }, [state]);

  // ── Anchor smooth scroll ───────────────────────────────────────────────────
  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const smoothScrollToY = useCallback((targetY, duration = 900) => {
    if (state.anchorRaf) cancelAnimationFrame(state.anchorRaf);
    state.velocity = 0;
    const startY = window.scrollY;
    const diff   = targetY - startY;
    const start  = performance.now();
    const tick   = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const y = startY + diff * easeInOutCubic(p);
      window.scrollTo(0, y);
      state.tgt    = y / state.maxScroll;
      state.smooth = state.tgt;
      if (p < 1) { state.anchorRaf = requestAnimationFrame(tick); }
      else        { state.anchorRaf = null; }
    };
    state.anchorRaf = requestAnimationFrame(tick);
  }, [state]);

  // ── Toggle fixed cube UI visibility based on section being in viewport ───
  useEffect(() => {
    const setFixedVisible = (visible) => {
      const els = [sceneRef.current, hudRef.current, dotsWrapRef.current, captionRef.current];
      els.forEach((el) => {
        if (!el) return;
        el.style.opacity         = visible ? '1' : '0';
        el.style.pointerEvents   = visible ? 'all' : 'none';
        el.style.transition      = 'opacity 0.6s ease';
      });
      state.cubeVisible = visible;
    };

    // Initially hidden
    setFixedVisible(false);

    const sectionObserver = new IntersectionObserver(
      ([entry]) => setFixedVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: '-40% 0px -40% 0px' }
    );
    
    const container = rootRef.current?.querySelector('.cs-scroll-container');
    if (container) sectionObserver.observe(container);

    return () => sectionObserver.disconnect();
  }, [state]);

  // ── Reveal observer ────────────────────────────────────────────────────────
  useEffect(() => {
    const revealEls = rootRef.current?.querySelectorAll(
      '.cs-reveal, .cs-reveal-tag, .cs-reveal-title, .cs-reveal-body,' +
      '.cs-reveal-block1, .cs-reveal-block2, .cs-reveal-cta, .cs-reveal-hline'
    ) ?? [];

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // ── Main scroll engine (useGSAP for proper cleanup per gsap-react skill) ──
  useGSAP(() => {
    buildSectionTops();

    // Set initial color
    applyColor(0);

    const dynamicFriction = (v) => (Math.abs(v) > 200 ? 0.8 : 0.9);
    const ease = 0.1;

    const stopAnchor = () => {
      if (state.anchorRaf) { cancelAnimationFrame(state.anchorRaf); state.anchorRaf = null; }
    };

    // Scroll listener
    const onScroll = () => {
      state.tgt = state.maxScroll > 0
        ? Math.max(0, Math.min(1, window.scrollY / state.maxScroll))
        : 0;
    };

    // Wheel — inertia (matching original)
    const onWheel = (e) => {
      e.preventDefault();
      const linePx = 16, pagePx = window.innerHeight * 0.9;
      const delta = e.deltaMode === 1 ? e.deltaY * linePx
                  : e.deltaMode === 2 ? e.deltaY * pagePx
                  : e.deltaY;
      if (Math.abs(delta) < 5) return;
      stopAnchor();
      state.velocity += delta;
      state.velocity = Math.max(-600, Math.min(600, state.velocity));
    };

    // Anchor click
    const onClick = (e) => {
      const a = e.target.closest('a[data-cs-anchor]');
      if (!a) return;
      const target = document.getElementById(a.dataset.csAnchor);
      if (!target) return;
      e.preventDefault();
      const idx = sectionRefs.current.findIndex((r) => r === target);
      const tops = state.sectionTops;
      const baseY = idx >= 0 ? tops[idx] ?? 0 : target.getBoundingClientRect().top + window.scrollY;
      smoothScrollToY(Math.max(0, baseY));
    };

    // Resize
    let resizePending = false;
    const onResize = () => {
      if (resizePending) return;
      resizePending = true;
      requestAnimationFrame(() => {
        buildSectionTops();
        state.tgt    = state.maxScroll > 0 ? window.scrollY / state.maxScroll : 0;
        state.smooth = state.tgt;
        resizePending = false;
      });
    };

    window.addEventListener('scroll', onScroll,  { passive: true });
    window.addEventListener('wheel',  onWheel,   { passive: false });
    window.addEventListener('resize', onResize);
    window.addEventListener('touchstart', stopAnchor, { passive: true });
    window.addEventListener('mousedown',  stopAnchor, { passive: true });
    window.addEventListener('keydown',    stopAnchor);
    document.addEventListener('click', onClick);

    // Main RAF loop
    state.lastNow = performance.now();

    const frame = (now) => {
      state.rafId = requestAnimationFrame(frame);
      if (document.hidden) { state.lastNow = now; return; }

      const dt = Math.min((now - state.lastNow) / 1000, 0.05);
      state.lastNow = now;

      // Velocity-based inertia scroll (original mechanics)
      state.velocity *= Math.pow(dynamicFriction(state.velocity), dt * 60);
      if (Math.abs(state.velocity) < 0.01) state.velocity = 0;

      if (Math.abs(state.velocity) > 0.2) {
        const next = Math.max(0, Math.min(window.scrollY + state.velocity * ease, state.maxScroll));
        window.scrollTo(0, next);
        state.tgt = next / state.maxScroll;
      }

      // Smooth damp (exponential filter — original approach)
      state.smooth += (state.tgt - state.smooth) * (1 - Math.exp(-dt * 8));
      state.smooth = Math.max(0, Math.min(1, state.smooth));

      // ━ Cube progress is LOCAL (relative to CubeSection only)
      // This ensures face 1 shows when reading s1, face 2 when reading s2, etc.
      const cubeProg = calcCubeProgress(window.scrollY);
      // Smooth the cube progress too (same exponential filter)
      state.cubeSmooth = state.cubeSmooth ?? cubeProg;
      state.cubeSmooth += (cubeProg - state.cubeSmooth) * (1 - Math.exp(-dt * 8));

      updateHUD(state.cubeSmooth);
      setCubeTransform(state.cubeSmooth);
    };

    state.rafId = requestAnimationFrame(frame);

    // GSAP cleanup (useGSAP handles this automatically per gsap-react skill)
    return () => {
      if (state.rafId)    cancelAnimationFrame(state.rafId);
      if (state.anchorRaf) cancelAnimationFrame(state.anchorRaf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel',  onWheel);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('touchstart', stopAnchor);
      window.removeEventListener('mousedown',  stopAnchor);
      window.removeEventListener('keydown',    stopAnchor);
      document.removeEventListener('click', onClick);
    };
  }, { scope: rootRef });

  // ── Helper: dot click ──────────────────────────────────────────────────────
  const onDotClick = (idx) => {
    const tops = state.sectionTops;
    if (tops[idx] != null) smoothScrollToY(Math.max(0, tops[idx]));
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div ref={rootRef} className="cube-root">

      {/* ── Visual separator / section entry ─────────────────────────────── */}
      <div className="cs-divider" aria-hidden="true">
        <div className="cs-divider-line" />
        <div className="cs-divider-label">CENTRO DE CONTROL</div>
        <div className="cs-divider-line" />
      </div>

      {/* ── Fixed 3D Cube (initially hidden, shown when section enters viewport) */}
      <div className="cs-scene" ref={sceneRef} style={{ opacity: 0, pointerEvents: 'none' }}>
        <div className="cs-cube" ref={cubeRef}>
          {['front','back','right','left','top','bottom'].map((face) => (
            <div key={face} className="cs-face" data-face={face}>
              <img src={FACE_IMAGES[face]} alt={face} />
            </div>
          ))}
        </div>
      </div>

      {/* ── HUD ───────────────────────────────────────────────────────────── */}
      <div className="cs-hud" ref={hudRef} style={{ opacity: 0, pointerEvents: 'none' }}>
        <div className="cs-hud-pct" ref={hudPctRef}>000%</div>
        <div className="cs-progress-bar">
          <div className="cs-progress-fill" ref={progFillRef} />
        </div>
        <div className="cs-scene-label" ref={sceneLabelRef}>INICIO</div>
      </div>

      {/* ── Navigation Dots ───────────────────────────────────────────────── */}
      <div className="cs-nav-dots" ref={dotsWrapRef} style={{ opacity: 0, pointerEvents: 'none' }}>
        {SECTIONS.map((sec, i) => (
          <button
            key={sec.id}
            className={`cs-dot ${i === 0 ? 'active' : ''}`}
            ref={(el) => { dotsRef.current[i] = el; }}
            onClick={() => onDotClick(i)}
            aria-label={`Ir a sección ${i}`}
          />
        ))}
      </div>

      {/* ── Caption ───────────────────────────────────────────────────────── */}
      <div className="cs-caption" ref={captionRef} style={{ opacity: 0, pointerEvents: 'none' }}>
        <div className="cs-caption-num" ref={captionNumRef}>00</div>
        <div className="cs-caption-name" ref={captionNameRef}>CENTRO DE CONTROL</div>
      </div>

      {/* ── Scroll Container ──────────────────────────────────────────────── */}
      <div className="cs-scroll-container">

        {/* S0 — Intro / Title */}
        <section
          id="cs-s0"
          className="cs-section cs-section-intro"
          ref={(el) => { sectionRefs.current[0] = el; }}
        >
          <div className="cs-card" style={{
            background: 'rgba(10,10,20,0.82)',
            borderLeft: '0.0625rem solid rgba(255,255,255,0.12)',
          }}>
            <div
              className="cs-hline cs-reveal-hline"
              style={{ background: 'rgba(255,255,255,0.3)' }}
            />
            <div className="cs-tag cs-reveal-tag" style={{ color: 'rgba(255,255,255,0.4)' }}>
              AI Finance — Centro de Control
            </div>
            <h1 className="cs-intro-title cs-reveal-title">
              PARA<br />QUÉ<br />SIRVE
            </h1>
            <p className="cs-intro-subtitle cs-reveal-body">
              Desplázate para descubrir cómo esta plataforma transforma tus
              problemas cotidianos en soluciones automatizadas que trabajan
              para ti las 24 horas.
            </p>
            <a
              className="cs-cta cs-reveal-cta"
              data-cs-anchor="cs-s1"
              href="#cs-s1"
              style={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.2)' }}
            >
              Explorar
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 6h10M6 1l5 5-5 5" />
              </svg>
            </a>
          </div>
        </section>

        {/* S1 – S4 — Feature sections */}
        {SECTIONS.slice(1).map((sec, i) => {
          const globalIdx = i + 1;
          const isRight = globalIdx % 2 === 0; // alternate sides
          return (
            <section
              key={sec.id}
              id={`cs-${sec.id}`}
              className={`cs-section ${isRight ? 'cs-section-right' : ''}`}
              ref={(el) => { sectionRefs.current[globalIdx] = el; }}
            >
              <div
                className={`cs-card${isRight ? ' right' : ''}`}
                style={{
                  background: `rgba(10,10,20,0.85)`,
                  borderLeft:  isRight ? 'none' : `0.0625rem solid ${sec.color}44`,
                  borderRight: isRight ? `0.0625rem solid ${sec.color}44` : 'none',
                  textAlign:   isRight ? 'right' : 'left',
                  boxShadow:   `0 0 60px ${sec.glowColor}`,
                }}
              >
                {/* Decorative line */}
                <div
                  className={`cs-hline cs-reveal-hline`}
                  style={{
                    background: sec.color,
                    marginLeft: isRight ? 'auto' : '0',
                    transformOrigin: isRight ? 'right' : 'left',
                  }}
                />

                {/* Tag */}
                <div
                  className="cs-tag cs-reveal-tag"
                  style={{ color: sec.accent }}
                >
                  {sec.tag}
                </div>

                {/* Title */}
                <h2
                  className="cs-card-title cs-reveal-title"
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {sec.title}
                </h2>

                {/* Objective */}
                <div
                  className="cs-info-block objective cs-reveal-body"
                  style={{
                    borderLeft:  isRight ? 'none' : `2px solid ${sec.color}66`,
                    borderRight: isRight ? `2px solid ${sec.color}66` : 'none',
                    paddingLeft:  isRight ? 0 : '1.1rem',
                    paddingRight: isRight ? '1.1rem' : 0,
                  }}
                >
                  <div className="cs-info-block-label" style={{ color: sec.accent }}>
                    El Objetivo
                  </div>
                  <p className="cs-info-block-text" style={{ color: 'rgba(255,255,255,0.92)' }}>
                    {sec.objective}
                  </p>
                </div>

                {/* Problem */}
                <div
                  className="cs-info-block problem cs-reveal-block1"
                  style={{
                    borderLeft:  isRight ? 'none' : undefined,
                    borderRight: isRight ? '2px solid rgba(239,68,68,0.4)' : 'none',
                    paddingLeft:  isRight ? 0 : '1.1rem',
                    paddingRight: isRight ? '1.1rem' : 0,
                    marginTop: '0.85rem',
                  }}
                >
                  <div className="cs-info-block-label" style={{ color: '#f87171' }}>
                    El Problema
                  </div>
                  <p className="cs-info-block-text">{sec.problem}</p>
                </div>

                {/* Solution */}
                <div
                  className="cs-info-block cs-reveal-block2"
                  style={{
                    borderLeft:  isRight ? 'none' : `2px solid ${sec.color}66`,
                    borderRight: isRight ? `2px solid ${sec.color}66` : 'none',
                    paddingLeft:  isRight ? 0 : '1.1rem',
                    paddingRight: isRight ? '1.1rem' : 0,
                    marginTop: '0.85rem',
                  }}
                >
                  <div className="cs-info-block-label" style={{ color: sec.accent }}>
                    La Solución
                  </div>
                  <p className="cs-info-block-text" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {sec.solution}
                  </p>
                </div>

                {/* CTA row */}
                <div
                  className="cs-reveal-cta"
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    marginTop: '1.75rem',
                    justifyContent: isRight ? 'flex-end' : 'flex-start',
                    opacity: 0,
                  }}
                >
                  {globalIdx > 1 && (
                    <a
                      className="cs-cta"
                      data-cs-anchor={`cs-s${globalIdx - 1}`}
                      href={`#cs-s${globalIdx - 1}`}
                      style={{ color: 'rgba(255,255,255,0.3)', borderColor: 'rgba(255,255,255,0.1)', fontSize: '0.58rem' }}
                    >
                      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '0.6rem', height: '0.6rem' }}>
                        <path d="M11 6H1M6 11L1 6l5-5" />
                      </svg>
                      Atrás
                    </a>
                  )}
                  {globalIdx < SECTIONS.length - 1 ? (
                    <a
                      className="cs-cta"
                      data-cs-anchor={`cs-s${globalIdx + 1}`}
                      href={`#cs-s${globalIdx + 1}`}
                      style={{ color: sec.accent, borderColor: `${sec.color}88` }}
                    >
                      Siguiente
                      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M1 6h10M6 1l5 5-5 5" />
                      </svg>
                    </a>
                  ) : (
                    <a
                      className="cs-cta"
                      data-cs-anchor="cs-s0"
                      href="#cs-s0"
                      style={{ color: sec.accent, borderColor: `${sec.color}88` }}
                    >
                      Volver al inicio
                      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M1 6h10M6 1l5 5-5 5" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* ── Visual separator / Dashboard Entry ─────────────────────────────── */}
      <div 
        className="cs-divider" 
        aria-hidden="true" 
        style={{ 
          height: '100vh', 
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto'
        }}
      >
        <button 
          onClick={() => navigate('/main-dashboard')}
          className="cs-final-btn"
        >
          IR AL DASHBOARD
        </button>
      </div>
    </div>
  );
}
