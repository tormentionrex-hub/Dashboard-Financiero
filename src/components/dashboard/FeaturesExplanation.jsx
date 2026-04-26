import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RoughEase } from 'gsap/EasePack';
import { useGSAP } from '@gsap/react';

import featureRealtime from '../../images/feature_realtime_metrics.png';
import featureAi from '../../images/feature_ai_analysis.png';
import featureAgents from '../../images/feature_autonomous_agents.png';
import featureControl from '../../images/feature_centralized_control.png';

gsap.registerPlugin(useGSAP, ScrollTrigger, RoughEase);

// Tics generados para el marco sci-fi — se usan en dos filas
const TIC_COUNT = 32;

// SplitWords para los bloques de características (masked reveal por palabra)
function SplitWords({ text }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <span className="inline-block overflow-hidden" style={{ verticalAlign: 'bottom' }}>
            <span className="word-inner inline-block">{word}</span>
          </span>
          {i < words.length - 1 && <span>&nbsp;</span>}
        </React.Fragment>
      ))}
    </>
  );
}

export default function FeaturesExplanation() {
  const containerRef = useRef();

  const sections = [
    {
      title: "Visibilidad Total en Tiempo Real",
      image: featureRealtime,
      icon: "monitoring",
      color: "indigo",
      objective: "Conocer el estado financiero al instante.",
      problem: "Esperar al cierre de mes para saber si el negocio es rentable genera decisiones tardías y posibles pérdidas ocultas que nadie nota a tiempo.",
      solution: "Un monitor en vivo que muestra exactamente cuánto dinero entra y sale cada segundo, dándote control total y tranquilidad absoluta sobre tu situación financiera actual."
    },
    {
      title: "Análisis Ejecutivo Inteligente",
      image: featureAi,
      icon: "psychology",
      color: "purple",
      objective: "Entender los números sin ser un experto contable.",
      problem: "Las hojas de cálculo gigantes son confusas y requieren horas de interpretación tediosa para encontrar qué información es realmente valiosa para la empresa.",
      solution: "Una Inteligencia Artificial que lee todos los datos por ti y te entrega un resumen claro y directo, explicándote el rendimiento con palabras sencillas y recomendaciones listas para usar."
    },
    {
      title: "Fuerza Laboral Autónoma",
      image: featureAgents,
      icon: "group_work",
      color: "emerald",
      objective: "Delegar tareas operativas y repetitivas.",
      problem: "El trabajo diario como analizar inventarios, contestar dudas repetitivas de clientes y vigilar el mercado consume todo el tiempo y energía de tu equipo.",
      solution: "Tres 'empleados virtuales' (ORION, ATLAS, NOVA) que trabajan 24/7 sin descanso ni vacaciones, manejando toda la rutina automáticamente para que tú te enfoques en liderar."
    },
    {
      title: "Control Centralizado Inteligente",
      image: featureControl,
      icon: "hub",
      color: "cyan",
      objective: "Crecer y escalar el negocio sin perder el orden.",
      problem: "Usar muchas aplicaciones y plataformas diferentes y descoordinadas crea caos administrativo, cuellos de botella y desorganización al intentar expandir la empresa.",
      solution: "Un único 'Centro de Mando' que conecta tus ventas, atención al cliente y proyecciones en un solo lugar. Todo a un clic de distancia para tomar decisiones estratégicas rápidamente."
    }
  ];

  const colorMap = {
    indigo: {
      borderClass:    'border-indigo-500/40',
      textClass:      'text-indigo-400',
      bgClass:        'bg-indigo-900/30',
      glowRgb:        '99,102,241',
      shimmerRgba:    'rgba(99,102,241,0.18)',
      scanRgba:       'rgba(99,102,241,0.95)',
      borderLineRgba: 'rgba(99,102,241,0.45)',
    },
    purple: {
      borderClass:    'border-purple-500/40',
      textClass:      'text-purple-400',
      bgClass:        'bg-purple-900/30',
      glowRgb:        '168,85,247',
      shimmerRgba:    'rgba(168,85,247,0.18)',
      scanRgba:       'rgba(168,85,247,0.95)',
      borderLineRgba: 'rgba(168,85,247,0.45)',
    },
    emerald: {
      borderClass:    'border-emerald-500/40',
      textClass:      'text-emerald-400',
      bgClass:        'bg-emerald-900/30',
      glowRgb:        '52,211,153',
      shimmerRgba:    'rgba(52,211,153,0.18)',
      scanRgba:       'rgba(52,211,153,0.95)',
      borderLineRgba: 'rgba(52,211,153,0.45)',
    },
    cyan: {
      borderClass:    'border-cyan-500/40',
      textClass:      'text-cyan-400',
      bgClass:        'bg-cyan-900/30',
      glowRgb:        '34,211,238',
      shimmerRgba:    'rgba(34,211,238,0.18)',
      scanRgba:       'rgba(34,211,238,0.95)',
      borderLineRgba: 'rgba(34,211,238,0.45)',
    },
  };

  useGSAP((context, contextSafe) => {

    // ══════════════════════════════════════════════════════════════════════
    // TÍTULO — Adaptación directa del Pen marioluevanos/XKqNZB
    //
    // Técnica original:
    //   1. Borders (top/bot) expand desde el centro con Elastic.out
    //   2. Tics aparecen desde el centro hacia afuera (stagger visual)
    //   3. RoughEase para que esquinas y batts parpadeen eléctricamente
    //   4. Cada char: visibility hidden → visible + backgroundColor flash
    //      + textShadow 0 → 60px (glow burst) con stagger 0.04s
    //   5. Línea 2 ("Centro de Control?") en color highlight (cyan)
    //      con glow que PERSISTE (textShadow no vuelve a 0)
    // ══════════════════════════════════════════════════════════════════════

    const titleSection = containerRef.current.querySelector('.title-section');

    const hBorderTop = titleSection.querySelector('.hb-top');
    const hBorderBot = titleSection.querySelector('.hb-bot');
    const vBorderL   = titleSection.querySelector('.vb-l');
    const vBorderR   = titleSection.querySelector('.vb-r');
    const corners    = titleSection.querySelectorAll('.sci-corner');
    const batts      = titleSection.querySelectorAll('.sci-batt');
    const ticsTop    = Array.from(titleSection.querySelectorAll('.tics-top .t-tic'));
    const ticsBot    = Array.from(titleSection.querySelectorAll('.tics-bot .t-tic'));
    const eyebrow    = titleSection.querySelector('.title-eyebrow');
    const l1chars    = Array.from(titleSection.querySelectorAll('.char-l1'));
    const l2chars    = Array.from(titleSection.querySelectorAll('.char-l2'));
    const glowLine   = titleSection.querySelector('.title-glow-line');
    const subtitle   = titleSection.querySelector('.title-subtitle');

    // Ordena tics desde el centro hacia afuera (igual que el pen original)
    const fromCenter = (arr) => {
      const mid = Math.floor(arr.length / 2);
      const L = arr.slice(0, mid).reverse(); // izquierda desde el centro
      const R = arr.slice(mid);              // derecha desde el centro
      const out = [];
      const len = Math.max(L.length, R.length);
      for (let i = 0; i < len; i++) {
        if (R[i]) out.push(R[i]);
        if (L[i]) out.push(L[i]);
      }
      return out;
    };

    // ── Estados iniciales (se aplican inmediatamente al montar) ──────────
    gsap.set([hBorderTop, hBorderBot], { scaleX: 0, transformOrigin: 'center center' });
    gsap.set([vBorderL, vBorderR],     { scaleY: 0, transformOrigin: 'center center' });
    gsap.set([...ticsTop, ...ticsBot], { visibility: 'hidden' });
    gsap.set(corners, { opacity: 0 });
    gsap.set(batts,   { opacity: 0 });
    gsap.set(eyebrow, { autoAlpha: 0 });
    gsap.set(glowLine, { scaleX: 0, opacity: 0, transformOrigin: 'center center' });
    gsap.set(subtitle, { autoAlpha: 0, y: 20 });
    // Chars: hidden + background flash color + textShadow a 0
    gsap.set(l1chars, {
      visibility: 'hidden',
      backgroundColor: 'rgba(99,102,241,0.35)',
      textShadow: '0 0 0 rgba(99,102,241,0)',
    });
    gsap.set(l2chars, {
      visibility: 'hidden',
      backgroundColor: 'rgba(6,182,212,0.35)',
      textShadow: '0 0 0 rgba(6,182,212,0)',
    });

    // ── Timeline principal del título ────────────────────────────────────
    gsap.timeline({
      scrollTrigger: {
        trigger: titleSection,
        start: 'top 68%',
        toggleActions: 'play none none reverse',
      }
    })

    // 1. Bordes horizontales se expanden desde el centro (elastic)
    .to([hBorderTop, hBorderBot], {
      scaleX: 1,
      duration: 2.2,
      ease: 'elastic.out(1, 0.72)',
      stagger: 0.12,
    }, 0)

    // 2. Bordes verticales crecen desde el centro (elastic)
    .to([vBorderL, vBorderR], {
      scaleY: 1,
      duration: 2.2,
      ease: 'elastic.out(1, 0.72)',
      stagger: 0.15,
    }, 0)

    // 3. Tics aparecen desde el centro hacia los extremos
    .to(fromCenter(ticsTop), {
      visibility: 'visible',
      duration: 0.001,
      stagger: 0.055,
    }, 0.25)
    .to(fromCenter(ticsBot), {
      visibility: 'visible',
      duration: 0.001,
      stagger: 0.055,
    }, 0.25)

    // 4. Esquinas parpadean eléctricamente (RoughEase — como el original)
    .to(corners, {
      opacity: 1,
      duration: 1.8,
      stagger: 0.12,
      ease: 'rough({ strength: 4, points: 80, clamp: true, randomize: true })',
    }, 0.55)

    // 5. Batts (marcadores pequeños) parpadean
    .to(batts, {
      opacity: 1,
      duration: 1.5,
      stagger: 0.08,
      ease: 'rough({ strength: 3, points: 60, clamp: true, randomize: true })',
    }, 0.65)

    // 6. Eyebrow aparece con flicker eléctrico
    .to(eyebrow, {
      autoAlpha: 1,
      duration: 1.2,
      ease: 'rough({ strength: 3, points: 50, clamp: true, randomize: true })',
    }, 0.8)

    // 7. Línea 1 — cada char: visibility snap + background flash + glow surge
    //    (exactamente como staggerFromTo(chars, ...) del pen original)
    .to(l1chars, {
      visibility: 'visible',
      backgroundColor: 'rgba(99,102,241,0)',
      textShadow: '0 0 0 rgba(99,102,241,0)',
      duration: 0.5,
      stagger: 0.038,
      ease: 'sine.out',
    }, 1.05)

    // 8. Línea 2 — cyan highlight + glow que PERSISTE (sin volver a 0)
    .to(l2chars, {
      visibility: 'visible',
      backgroundColor: 'rgba(6,182,212,0)',
      textShadow: '0 0 28px rgba(6,182,212,0.65)',
      duration: 0.45,
      stagger: 0.038,
      ease: 'sine.out',
    }, 1.42)

    // 9. Línea separadora se expande desde el centro
    .to(glowLine, {
      scaleX: 1,
      opacity: 1,
      duration: 1.1,
      ease: 'power4.out',
    }, 2.0)

    // 10. Subtítulo aparece
    .to(subtitle, {
      autoAlpha: 1,
      y: 0,
      duration: 1.0,
      ease: 'power3.out',
    }, 2.2);

    // ══════════════════════════════════════════════════════════════════════
    // 4 BLOQUES — ANIMACIONES DISTINTAS (permanecen igual que antes)
    // ══════════════════════════════════════════════════════════════════════
    gsap.utils.toArray('.feature-block').forEach((block, idx) => {
      const bgCard       = block.querySelector('.anim-bg');
      const shimmer      = block.querySelector('.card-shimmer');
      const badge        = block.querySelector('.anim-badge');
      const sectionWords = block.querySelectorAll('.section-title .word-inner');
      const borderLines  = block.querySelectorAll('.anim-border-line');
      const textContents = block.querySelectorAll('.anim-text-content');
      const imageEl      = block.querySelector('.anim-image');
      const imageGlow    = block.querySelector('.image-glow');
      const scanLine     = block.querySelector('.scan-line');
      const parallaxWrap = block.querySelector('.parallax-wrap');

      const st = { trigger: block, start: 'top 73%', toggleActions: 'play none none reverse' };

      if (idx === 0) {
        // BLOQUE 0 — HORIZONTAL SLICE
        gsap.timeline({ scrollTrigger: st })
          .fromTo(bgCard,
            { clipPath: 'inset(0 100% 0 0 round 2rem)' },
            { clipPath: 'inset(0 0%   0 0 round 2rem)', duration: 1.1, ease: 'power4.out' }
          )
          .fromTo(imageEl,
            { x: 260, rotationY: -32, opacity: 0, scale: 0.72, transformPerspective: 900 },
            { x: 0,   rotationY:   0, opacity: 1, scale: 1.05, duration: 1.75, ease: 'expo.out' },
            '-=0.9'
          )
          .fromTo(imageGlow,  { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out' }, '-=1.6')
          .fromTo(scanLine,   { top: '-3px', opacity: 1 }, { top: '103%', opacity: 0.25, duration: 1.2, ease: 'power1.inOut' }, '-=1.2')
          .fromTo(badge,      { scale: 0, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.55, ease: 'back.out(2.3)' }, '-=0.75')
          .fromTo(sectionWords, { y: '118%', opacity: 0 }, { y: '0%', opacity: 1, duration: 0.82, stagger: 0.06, ease: 'power3.out' }, '-=0.38')
          .fromTo(borderLines,  { scaleY: 0, transformOrigin: 'top center' }, { scaleY: 1, duration: 0.55, stagger: 0.2, ease: 'power3.out' }, '-=0.3')
          .fromTo(textContents, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.65, stagger: 0.11, ease: 'power3.out' }, '<0.08');

      } else if (idx === 1) {
        // BLOQUE 1 — VERTICAL UNFOLD
        gsap.set(textContents, { opacity: 0, x: (i) => i % 2 === 0 ? -38 : 38 });
        gsap.timeline({ scrollTrigger: st })
          .fromTo(bgCard,
            { clipPath: 'inset(0 0 100% 0 round 2rem)' },
            { clipPath: 'inset(0 0 0%   0 round 2rem)', duration: 1.2, ease: 'power4.out' }
          )
          .fromTo(imageEl,
            { y: -200, rotationX: 28, opacity: 0, scale: 0.85, transformPerspective: 900 },
            { y: 0,    rotationX:  0, opacity: 1, scale: 1.05, duration: 1.65, ease: 'elastic.out(1, 0.65)' },
            '-=0.8'
          )
          .fromTo(imageGlow,  { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' }, '-=1.5')
          .fromTo(scanLine,   { top: '-3px', opacity: 1 }, { top: '103%', opacity: 0.25, duration: 1.2, ease: 'power1.inOut' }, '-=1.1')
          .fromTo(badge,      { x: 70, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }, '-=0.65')
          .fromTo(sectionWords, { y: '-120%', opacity: 0 }, { y: '0%', opacity: 1, duration: 0.75, stagger: 0.06, ease: 'back.out(1.5)' }, '-=0.42')
          .fromTo(borderLines, { scaleY: 0, transformOrigin: 'bottom center' }, { scaleY: 1, duration: 0.55, stagger: 0.2, ease: 'power3.out' }, '-=0.3')
          .to(textContents, { x: 0, opacity: 1, duration: 0.65, stagger: 0.12, ease: 'power3.out' }, '<0.08');

      } else if (idx === 2) {
        // BLOQUE 2 — RISE FROM BELOW
        gsap.timeline({ scrollTrigger: st })
          .fromTo(bgCard,
            { clipPath: 'inset(100% 0 0 0 round 2rem)' },
            { clipPath: 'inset(0%   0 0 0 round 2rem)', duration: 1.1, ease: 'power4.out' }
          )
          .fromTo(imageEl,
            { y: 210, rotationX: -22, opacity: 0, scale: 0.8, transformPerspective: 900 },
            { y: 0,   rotationX:   0, opacity: 1, scale: 1.05, duration: 1.65, ease: 'expo.out' },
            '-=0.85'
          )
          .fromTo(imageGlow,  { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, '-=1.55')
          .fromTo(scanLine,   { top: '-3px', opacity: 1 }, { top: '103%', opacity: 0.25, duration: 1.2, ease: 'power1.inOut' }, '-=1.1')
          .fromTo(badge,      { scale: 0, opacity: 0, rotation: -200 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.7, ease: 'back.out(1.8)' }, '-=0.7')
          .fromTo(sectionWords, { x: 65, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: 'power3.out' }, '-=0.38')
          .fromTo(borderLines, { scaleY: 0, transformOrigin: 'center center' }, { scaleY: 1, duration: 0.55, stagger: 0.18, ease: 'elastic.out(1, 0.5)' }, '-=0.28')
          .fromTo(textContents, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.62, stagger: 0.1, ease: 'power3.out' }, '<0.1');

      } else if (idx === 3) {
        // BLOQUE 3 — ATOMIC EXPLOSION
        gsap.set(sectionWords, { opacity: 0, y: (i) => i % 2 === 0 ? '-130%' : '130%' });
        gsap.timeline({ scrollTrigger: st })
          .fromTo(bgCard,
            { scale: 0.82, opacity: 0, rotation: -2, transformOrigin: 'center center' },
            { scale: 1,    opacity: 1, rotation:  0, duration: 1.05, ease: 'power4.out' }
          )
          .fromTo(imageEl,
            { scale: 0.12, opacity: 0 },
            { scale: 1.05, opacity: 1, duration: 1.65, ease: 'expo.out' },
            '-=0.75'
          )
          .fromTo(imageGlow, { opacity: 0, scale: 0.1 }, { opacity: 1, scale: 1.4, duration: 0.9, ease: 'power2.out' }, '-=1.55')
          .to(imageGlow, { scale: 1, duration: 0.7, ease: 'power2.inOut' })
          .fromTo(scanLine,  { top: '-3px', opacity: 1 }, { top: '103%', opacity: 0.25, duration: 1.2, ease: 'power1.inOut' }, '-=1.3')
          .fromTo(badge,     { x: -70, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }, '-=0.55')
          .to(sectionWords,  { y: '0%', opacity: 1, duration: 0.9, stagger: 0.07, ease: 'back.out(1.4)' }, '-=0.42')
          .fromTo(borderLines, { scaleY: 0, transformOrigin: 'center center' }, { scaleY: 1, duration: 0.5, stagger: 0.2, ease: 'power3.out' }, '-=0.3')
          .fromTo(textContents, { rotation: 3, x: 25, opacity: 0 }, { rotation: 0, x: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: 'power3.out' }, '<0.05');
      }

      // Efectos continuos
      gsap.fromTo(shimmer,
        { x: '-130%' },
        { x: '230%', duration: 1.6, ease: 'power1.inOut', repeat: -1, repeatDelay: 5.5 + idx * 0.7, delay: 2.8 + idx * 0.55 }
      );
      gsap.to(imageEl, { y: -18, rotation: 0.9, duration: 2.8 + idx * 0.35, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.2 });
      gsap.to(parallaxWrap, { y: -55, ease: 'none', scrollTrigger: { trigger: block, start: 'top bottom', end: 'bottom top', scrub: 2 } });
    });

    // ══════════════════════════════════════════════════════════════════════
    // HOVER EN TEXTOS (contextSafe para cleanup correcto)
    // ══════════════════════════════════════════════════════════════════════
    const cleanups = [];

    gsap.utils.toArray('.text-hover-block').forEach(block => {
      const label  = block.querySelector('.text-label');
      const body   = block.querySelector('.text-body');
      const onEnter = contextSafe(() => {
        gsap.to(label, { x: 7, letterSpacing: '0.22em', duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        gsap.to(body,  { x: 5,                           duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
      });
      const onLeave = contextSafe(() => {
        gsap.to(label, { x: 0, letterSpacing: '0.1em', duration: 0.38, ease: 'power2.inOut', overwrite: 'auto' });
        gsap.to(body,  { x: 0,                          duration: 0.38, ease: 'power2.inOut', overwrite: 'auto' });
      });
      block.addEventListener('mouseenter', onEnter);
      block.addEventListener('mouseleave', onLeave);
      cleanups.push(() => { block.removeEventListener('mouseenter', onEnter); block.removeEventListener('mouseleave', onLeave); });
    });

    gsap.utils.toArray('.section-title').forEach(titleEl => {
      const words = titleEl.querySelectorAll('.word-inner');
      const onEnter = contextSafe(() => gsap.to(words, { y: -5, duration: 0.25, stagger: 0.04, ease: 'power2.out', overwrite: 'auto' }));
      const onLeave = contextSafe(() => gsap.to(words, { y:  0, duration: 0.32, stagger: 0.03, ease: 'power2.inOut', overwrite: 'auto' }));
      titleEl.addEventListener('mouseenter', onEnter);
      titleEl.addEventListener('mouseleave', onLeave);
      cleanups.push(() => { titleEl.removeEventListener('mouseenter', onEnter); titleEl.removeEventListener('mouseleave', onLeave); });
    });

    return () => cleanups.forEach(fn => fn());

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative z-10 w-full px-4 md:px-8 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* ═══════════════════════════════════════════════════════════════
            TÍTULO — Marco Sci-Fi inspirado en marioluevanos/XKqNZB
        ═══════════════════════════════════════════════════════════════ */}
        <div className="title-section relative mb-32 py-24">

          {/* ── MARCO DECORATIVO SCI-FI (no interactivo) ── */}
          <div className="pointer-events-none select-none" aria-hidden="true">

            {/* Líneas horizontales que se expanden desde el centro */}
            <div className="hb-top absolute left-[8%] right-[8%] h-px"
              style={{ top: 0, background: 'rgba(99,102,241,0.55)' }} />
            <div className="hb-bot absolute left-[8%] right-[8%] h-px"
              style={{ bottom: 0, background: 'rgba(99,102,241,0.55)' }} />

            {/* Líneas verticales laterales */}
            <div className="vb-l absolute top-[8%] bottom-[8%] w-px"
              style={{ left: '8%', background: 'rgba(99,102,241,0.3)' }} />
            <div className="vb-r absolute top-[8%] bottom-[8%] w-px"
              style={{ right: '8%', background: 'rgba(99,102,241,0.3)' }} />

            {/* Esquinas (red, como el pen original) */}
            <div className="sci-corner absolute w-4 h-4 border-l-2 border-t-2 border-red-500/75"
              style={{ top: 0, left: '8%', marginTop: '-1px', marginLeft: '-1px' }} />
            <div className="sci-corner absolute w-4 h-4 border-r-2 border-t-2 border-red-500/75"
              style={{ top: 0, right: '8%', marginTop: '-1px', marginRight: '-1px' }} />
            <div className="sci-corner absolute w-4 h-4 border-l-2 border-b-2 border-red-500/75"
              style={{ bottom: 0, left: '8%', marginBottom: '-1px', marginLeft: '-1px' }} />
            <div className="sci-corner absolute w-4 h-4 border-r-2 border-b-2 border-red-500/75"
              style={{ bottom: 0, right: '8%', marginBottom: '-1px', marginRight: '-1px' }} />

            {/* Batts (marcadores cortos, como .batt del pen) */}
            <div className="sci-batt absolute w-3 h-[3px] bg-red-500/80"
              style={{ top: '-1px', left: '50%', transform: 'translateX(-50%)' }} />
            <div className="sci-batt absolute w-3 h-[3px] bg-red-500/80"
              style={{ bottom: '-1px', left: '50%', transform: 'translateX(-50%)' }} />
            <div className="sci-batt absolute w-[3px] h-3 bg-red-500/80"
              style={{ left: '8%', top: '50%', transform: 'translateY(-50%) translateX(-1px)' }} />
            <div className="sci-batt absolute w-[3px] h-3 bg-red-500/80"
              style={{ right: '8%', top: '50%', transform: 'translateY(-50%) translateX(1px)' }} />

            {/* Tics superiores — stagger desde el centro hacia los extremos */}
            <div className="tics-top absolute left-[8%] right-[8%] flex items-end justify-between"
              style={{ top: 0 }}>
              {Array.from({ length: TIC_COUNT }).map((_, i) => (
                <div key={i} className="t-tic relative flex-shrink-0"
                  style={{ width: '1px', height: '10px', background: 'rgba(99,102,241,0.22)' }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '1px', height: '3px',
                    background: 'rgba(6,182,212,0.9)',
                  }} />
                </div>
              ))}
            </div>

            {/* Tics inferiores */}
            <div className="tics-bot absolute left-[8%] right-[8%] flex items-start justify-between"
              style={{ bottom: 0 }}>
              {Array.from({ length: TIC_COUNT }).map((_, i) => (
                <div key={i} className="t-tic relative flex-shrink-0"
                  style={{ width: '1px', height: '10px', background: 'rgba(99,102,241,0.22)' }}>
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0,
                    width: '1px', height: '3px',
                    background: 'rgba(6,182,212,0.9)',
                  }} />
                </div>
              ))}
            </div>
          </div>

          {/* ── CONTENIDO DEL TÍTULO ── */}
          <div className="text-center relative z-10 px-8">

            {/* Eyebrow */}
            <div className="title-eyebrow inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-sm">
              <span className="material-symbols-outlined text-indigo-400 text-sm">hub</span>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60">
                Centro de Control Financiero
              </span>
            </div>

            {/* Título — split por caracteres para el efecto de aparición con glow */}
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-4 select-none">

              {/* Línea 1 — blanco, glow indigo que desaparece */}
              <span className="block text-white">
                {'¿Para qué sirve este'.split('').map((char, i) => (
                  <span key={i} className="char-l1 inline-block"
                    style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}>
                    {char}
                  </span>
                ))}
              </span>

              {/* Línea 2 — cyan highlight, glow que PERSISTE */}
              <span className="block text-cyan-300">
                {'Centro de Control?'.split('').map((char, i) => (
                  <span key={i} className="char-l2 inline-block"
                    style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}>
                    {char}
                  </span>
                ))}
              </span>
            </h2>

            {/* Línea de glow que se expande */}
            <div className="title-glow-line mx-auto mt-6 mb-8 h-[2px] w-72 rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, #6366f1 30%, #06b6d4 70%, transparent)' }} />

            <p className="title-subtitle text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
              Descubre cómo esta plataforma transforma tus problemas cotidianos en soluciones
              automatizadas, trabajando para ti las 24 horas del día.
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            4 SECCIONES DE CARACTERÍSTICAS
        ═══════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col space-y-32 md:space-y-48 pb-20">
          {sections.map((section, idx) => {
            const c = colorMap[section.color];
            return (
              <div key={idx} className="feature-block relative w-full flex flex-col lg:flex-row items-center">

                {/* Card background con shimmer */}
                <div className={`anim-bg absolute top-0 left-0 w-full lg:w-[85%] h-full rounded-[2rem] border ${c.borderClass} ${c.bgClass} backdrop-blur-xl z-0 shadow-2xl overflow-hidden`}>
                  <div className="card-shimmer absolute inset-0 pointer-events-none z-10"
                    style={{ background: `linear-gradient(105deg, transparent 20%, ${c.shimmerRgba} 50%, transparent 80%)` }} />
                </div>

                {/* Texto */}
                <div className="relative z-10 w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
                  <div className="anim-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 w-fit mb-6 shadow-lg backdrop-blur-md">
                    <span className={`material-symbols-outlined ${c.textClass} text-sm`}>{section.icon}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${c.textClass}`}>Funcionalidad Core</span>
                  </div>

                  <h3 className="section-title text-3xl md:text-4xl font-black text-white mb-10 tracking-tight leading-tight cursor-default">
                    <SplitWords text={section.title} />
                  </h3>

                  <div className="space-y-8">
                    <div className="text-hover-block flex flex-col pl-5 relative cursor-default">
                      <div className="anim-border-line absolute left-0 top-0 h-full w-[2px] bg-white/20" style={{ transformOrigin: 'top center' }} />
                      <span className="text-label anim-text-content text-[11px] font-black uppercase tracking-widest text-white/50 mb-1.5">El Objetivo</span>
                      <p className="text-body anim-text-content text-white/90 text-lg font-medium leading-relaxed">{section.objective}</p>
                    </div>
                    <div className="text-hover-block flex flex-col pl-5 relative cursor-default">
                      <div className="anim-border-line absolute left-0 top-0 h-full w-[2px] bg-red-500/40" style={{ transformOrigin: 'top center' }} />
                      <span className="text-label anim-text-content text-[11px] font-black uppercase tracking-widest text-red-400 mb-1.5">El Problema</span>
                      <p className="text-body anim-text-content text-white/70 text-base leading-relaxed">{section.problem}</p>
                    </div>
                    <div className="text-hover-block flex flex-col pl-5 relative cursor-default">
                      <div className="anim-border-line absolute left-0 top-0 h-full w-[2px]" style={{ background: c.borderLineRgba, transformOrigin: 'top center' }} />
                      <span className={`text-label anim-text-content text-[11px] font-black uppercase tracking-widest ${c.textClass} mb-1.5`}>La Solución</span>
                      <p className="text-body anim-text-content text-white text-base leading-relaxed">{section.solution}</p>
                    </div>
                  </div>
                </div>

                {/* Imagen */}
                <div className="parallax-wrap relative z-20 w-[90%] lg:w-1/2 mt-12 lg:mt-0 lg:-mr-12 xl:-mr-24">
                  <div className="anim-image relative rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.7)] border border-white/20 origin-center">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none z-10" />
                    <div className="scan-line absolute left-0 w-full h-[3px] pointer-events-none z-20"
                      style={{
                        top: '-3px',
                        background: `linear-gradient(90deg, transparent 0%, ${c.scanRgba} 50%, transparent 100%)`,
                        boxShadow: `0 0 16px 5px rgba(${c.glowRgb}, 0.7)`,
                      }} />
                    <img src={section.image} alt={section.title} className="w-full h-auto object-cover relative z-0" />
                  </div>
                  <div className="image-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] blur-[90px] -z-10 rounded-full"
                    style={{ background: `rgba(${c.glowRgb}, 0.55)` }} />
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
