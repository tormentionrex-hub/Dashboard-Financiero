// ─────────────────────────────────────────────────────────────────────────────
//  AgentNetworkAnimation — Animación de red de comunicación entre agentes
//  3 círculos con "cables" animados mostrando flujo cíclico de datos
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { AGENTS_META } from "../../services/agents/agentBus";
import { useAgents } from "../../context/AgentsContext";

// ── Constantes de layout SVG ──────────────────────────────────────────────────
const W   = 420;
const H   = 320;
const CX  = W / 2;
const CY  = H / 2 + 10;
const R   = 108;  // Radio del triángulo imaginario
const CR  = 38;   // Radio de cada círculo de agente
const DOT = 7;    // Radio del punto viajero

// Posiciones en triángulo (0=top, 1=bottom-right, 2=bottom-left)
const POSITIONS = [
  { x: CX,           y: CY - R        },  // ORION   — arriba
  { x: CX + R * 0.9, y: CY + R * 0.5 },  // ATLAS   — abajo derecha
  { x: CX - R * 0.9, y: CY + R * 0.5 },  // NOVA    — abajo izquierda
];

// Agente index by id
const IDX = { orion: 0, atlas: 1, nova: 2 };

// ── Helpers ───────────────────────────────────────────────────────────────────
function lerp(a, b, t) { return a + (b - a) * t; }

function pointOnSegment(ax, ay, bx, by, t) {
  return { x: lerp(ax, bx, t), y: lerp(ay, by, t) };
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function AgentNetworkAnimation({ isActive = false }) {
  const svgRef      = useRef(null);
  const dotsRef     = useRef([]);
  const glowsRef    = useRef([]);
  const circlesRef  = useRef([]);
  const labelsRef   = useRef([]);
  const linesRef    = useRef([]);
  const tlRef       = useRef(null);
  const pulseRef    = useRef(null);

  const { state } = useAgents();

  // Status de cada agente
  const statuses = [
    state.market.status,
    state.document.status,
    state.customer.status,
  ];

  const anyActive = statuses.some(s => s === "ACTIVE" || s === "PROCESSING");

  // ── Setup inicial de GSAP ─────────────────────────────────────────────────
  useEffect(() => {
    if (!svgRef.current) return;

    // Entrada de círculos
    gsap.from(circlesRef.current, {
      scale:    0,
      opacity:  0,
      duration: 0.7,
      stagger:  0.15,
      ease:     "back.out(1.7)",
      transformOrigin: "center center",
    });

    gsap.from(labelsRef.current, {
      opacity:  0,
      y:        10,
      duration: 0.5,
      delay:    0.6,
      stagger:  0.1,
      ease:     "power2.out",
    });

    gsap.from(linesRef.current, {
      opacity:  0,
      duration: 0.6,
      delay:    0.4,
      stagger:  0.1,
    });

    return () => {
      tlRef.current?.kill();
      pulseRef.current?.kill();
    };
  }, []);

  // ── Animación de pulso en los círculos ────────────────────────────────────
  useEffect(() => {
    pulseRef.current?.kill();

    if (anyActive) {
      pulseRef.current = gsap.timeline({ repeat: -1 });
      AGENTS_META.forEach((agent, i) => {
        const status = statuses[i];
        const isOn   = status === "ACTIVE" || status === "PROCESSING";
        if (isOn && glowsRef.current[i]) {
          pulseRef.current.to(glowsRef.current[i], {
            opacity:  0.9,
            r:        CR + 14,
            duration: 0.8,
            ease:     "power1.inOut",
            yoyo:     true,
            repeat:   -1,
          }, i * 0.3);
        }
      });
    } else {
      glowsRef.current.forEach(el => {
        if (el) gsap.to(el, { opacity: 0.15, r: CR + 6, duration: 0.5 });
      });
    }
  }, [anyActive, statuses.join(",")]);

  // ── Animación de puntos viajeros (ciclo ORION→ATLAS→NOVA→ORION) ──────────
  useEffect(() => {
    tlRef.current?.kill();
    if (!anyActive) {
      dotsRef.current.forEach(d => {
        if (d) gsap.to(d, { opacity: 0, duration: 0.3 });
      });
      return;
    }

    // 3 segmentos: 0→1, 1→2, 2→0
    const segments = [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 0 },
    ];

    const segDuration = 1.2;
    const tl = gsap.timeline({ repeat: -1 });

    segments.forEach((seg, si) => {
      const dot = dotsRef.current[si];
      if (!dot) return;

      const ax = POSITIONS[seg.from].x;
      const ay = POSITIONS[seg.from].y;
      const bx = POSITIONS[seg.to].x;
      const by = POSITIONS[seg.to].y;

      // Aparecer
      tl.to(dot, { opacity: 1, duration: 0.1 }, si * segDuration);

      // Viajar del punto A al punto B
      tl.to(dot, {
        attr: { cx: bx, cy: by },
        duration: segDuration * 0.85,
        ease: "power1.inOut",
        onUpdate() {
          // Actualizar posición del dot
          const prog = this.progress();
          const pt   = pointOnSegment(ax, ay, bx, by, prog);
          if (dot) {
            dot.setAttribute("cx", pt.x);
            dot.setAttribute("cy", pt.y);
          }
        },
      }, si * segDuration + 0.05);

      // Pulso en el nodo destino al llegar
      tl.to(circlesRef.current[seg.to], {
        scale:    1.12,
        duration: 0.12,
        ease:     "power2.out",
        yoyo:     true,
        repeat:   1,
        transformOrigin: "center center",
      }, si * segDuration + segDuration * 0.85);

      // Desaparecer antes del siguiente segmento
      tl.to(dot, { opacity: 0, duration: 0.1 }, si * segDuration + segDuration - 0.05);
    });

    tlRef.current = tl;
    return () => tl.kill();
  }, [anyActive]);

  // ── Renderizado SVG ───────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {/* Título */}
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold">
          Red Neural · Protocolo de Comunicación
        </p>
      </div>

      {/* SVG principal */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ maxWidth: 420, overflow: "visible" }}
      >
        <defs>
          {/* Gradientes de líneas */}
          {AGENTS_META.map((a, i) => {
            const next = (i + 1) % 3;
            return (
              <linearGradient
                key={`grad-${i}`}
                id={`line-grad-${i}`}
                x1={POSITIONS[i].x} y1={POSITIONS[i].y}
                x2={POSITIONS[next].x} y2={POSITIONS[next].y}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%"   stopColor={AGENTS_META[i].color}    stopOpacity="0.7" />
                <stop offset="100%" stopColor={AGENTS_META[next].color}  stopOpacity="0.7" />
              </linearGradient>
            );
          })}

          {/* Filtro de brillo para los puntos */}
          <filter id="glow-dot" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Filtro de brillo para los círculos */}
          <filter id="glow-circle" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Líneas de conexión entre agentes ── */}
        {[0, 1, 2].map(i => {
          const next = (i + 1) % 3;
          return (
            <line
              key={`line-${i}`}
              ref={el => (linesRef.current[i] = el)}
              x1={POSITIONS[i].x}
              y1={POSITIONS[i].y}
              x2={POSITIONS[next].x}
              y2={POSITIONS[next].y}
              stroke={`url(#line-grad-${i})`}
              strokeWidth="1.5"
              strokeDasharray="6 4"
              opacity="0.45"
            />
          );
        })}

        {/* ── Puntos viajeros (uno por segmento) ── */}
        {[0, 1, 2].map(i => {
          const color = AGENTS_META[i].color;
          return (
            <circle
              key={`dot-${i}`}
              ref={el => (dotsRef.current[i] = el)}
              cx={POSITIONS[i].x}
              cy={POSITIONS[i].y}
              r={DOT}
              fill={color}
              opacity="0"
              filter="url(#glow-dot)"
            />
          );
        })}

        {/* ── Círculos de agentes ── */}
        {AGENTS_META.map((agent, i) => {
          const pos    = POSITIONS[i];
          const status = statuses[i];
          const isOn   = status === "ACTIVE" || status === "PROCESSING";

          return (
            <g key={agent.id} transform={`translate(${pos.x}, ${pos.y})`}>
              {/* Aura exterior */}
              <circle
                ref={el => (glowsRef.current[i] = el)}
                cx="0" cy="0"
                r={CR + 6}
                fill={agent.color}
                opacity={isOn ? 0.25 : 0.08}
                filter="url(#glow-circle)"
              />

              {/* Círculo principal */}
              <circle
                ref={el => (circlesRef.current[i] = el)}
                cx="0" cy="0"
                r={CR}
                fill={`${agent.color}22`}
                stroke={agent.color}
                strokeWidth={isOn ? "2" : "1.5"}
                opacity={isOn ? 1 : 0.6}
                filter={isOn ? "url(#glow-circle)" : "none"}
              />

              {/* Ícono emoji */}
              <text
                x="0" y="2"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="22"
                style={{ userSelect: "none" }}
              >
                {agent.icon}
              </text>

              {/* Indicador de estado */}
              <circle
                cx={CR * 0.68}
                cy={-(CR * 0.68)}
                r="5"
                fill={
                  status === "ACTIVE"     ? "#10b981" :
                  status === "PROCESSING" ? "#f59e0b" :
                  status === "ERROR"      ? "#ef4444" :
                                            "#6b7280"
                }
              />

              {/* Nombre del agente (debajo del círculo) */}
              <text
                ref={el => {
                  if (el) labelsRef.current[i * 2] = el;
                }}
                x="0"
                y={CR + 18}
                textAnchor="middle"
                fill={agent.color}
                fontSize="11"
                fontWeight="800"
                letterSpacing="2"
                style={{ textTransform: "uppercase", userSelect: "none" }}
              >
                {agent.name}
              </text>

              {/* Rol del agente */}
              <text
                ref={el => {
                  if (el) labelsRef.current[i * 2 + 1] = el;
                }}
                x="0"
                y={CR + 30}
                textAnchor="middle"
                fill="rgba(255,255,255,0.35)"
                fontSize="7.5"
                letterSpacing="1"
                style={{ textTransform: "uppercase", userSelect: "none" }}
              >
                {agent.role}
              </text>
            </g>
          );
        })}

        {/* ── Etiqueta central ── */}
        <text
          x={CX}
          y={CY - 8}
          textAnchor="middle"
          fill="rgba(255,255,255,0.12)"
          fontSize="8"
          letterSpacing="2"
          style={{ textTransform: "uppercase", userSelect: "none" }}
        >
          {anyActive ? "SINCRONIZADOS" : "EN ESPERA"}
        </text>
      </svg>

      {/* ── Leyenda de flujo ── */}
      <div className="flex flex-wrap justify-center gap-3 px-4">
        {[
          { from: "ORION", to: "NOVA",  label: "Insights de mercado",   color: "#6366f1" },
          { from: "ATLAS", to: "ORION", label: "Datos documentales",    color: "#10b981" },
          { from: "NOVA",  to: "ATLAS", label: "Consultas de cliente",  color: "#f59e0b" },
        ].map((flow, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: flow.color }} />
            <span className="text-[8px] text-white/30 uppercase tracking-wider">
              {flow.from} → {flow.to}: {flow.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
