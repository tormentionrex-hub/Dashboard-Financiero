import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react";

export default function BlackHoleBackground({ isPlaying = true }) {
  const containerRef = useRef();

  useGSAP(() => {
    // Iluminación Ambiental Dinámica (UI/UX Pro Max - Modern Dark System)
    gsap.to(".ambient-glow-1", {
      x: "20%",
      y: "15%",
      duration: 14,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".ambient-glow-2", {
      x: "-15%",
      y: "20%",
      duration: 18,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2
    });

    gsap.to(".ambient-glow-3", {
      x: "10%",
      y: "-10%",
      duration: 22,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 5
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full z-0 overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 60% 40%, #0d0d2b 0%, #080814 50%, #030308 100%)" }}
    >
      {/* Glow indigo izquierda-arriba */}
      <div className="ambient-glow-1 absolute -top-1/4 -left-1/4 w-[70%] h-[70%] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)", filter: "blur(60px)" }}
      ></div>

      {/* Glow cyan derecha-abajo */}
      <div className="ambient-glow-2 absolute -bottom-1/4 -right-1/4 w-[65%] h-[65%] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)", filter: "blur(80px)" }}
      ></div>

      {/* Glow violeta centro */}
      <div className="ambient-glow-3 absolute top-1/4 left-1/2 w-[50%] h-[50%] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)", filter: "blur(100px)" }}
      ></div>

      {/* Grid sutil de fondo */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: "linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
      ></div>

      {/* Partículas de estrellas */}
      {[...Array(18)].map((_, i) => (
        <div key={i} className="absolute rounded-full animate-pulse pointer-events-none"
          style={{
            width: Math.random() * 2 + 1 + "px",
            height: Math.random() * 2 + 1 + "px",
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
            background: i % 3 === 0 ? "#818cf8" : i % 3 === 1 ? "#22d3ee" : "#ffffff",
            opacity: Math.random() * 0.5 + 0.1,
            animationDelay: Math.random() * 3 + "s",
            animationDuration: (Math.random() * 2 + 2) + "s"
          }}
        ></div>
      ))}

      {/* Textura de ruido HD */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
      ></div>

      {/* Detalles de telemetría (puntos orbitales) */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_12px_rgba(99,102,241,0.8)]"></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_12px_rgba(34,211,238,0.8)]" style={{animationDelay:"1s"}}></div>
        <div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{animationDelay:"0.5s"}}></div>
      </div>
    </div>
  );
}
