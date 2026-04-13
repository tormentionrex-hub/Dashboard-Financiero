import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react";
import descargaGif from '../../images/descarga.gif';

export default function BlackHoleBackground() {
  const containerRef = useRef();
  const particlesRef = useRef();

  useGSAP(() => {
    // Animación de pulso de brillo para integrar el fondo
    gsap.to(".gargantua-overlay", {
      opacity: 0.6,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Pequeñas partículas de telemetría (más estéticas)
    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 30;
        const yPos = (clientY / window.innerHeight - 0.5) * 30;
  
        gsap.to(".gargantua-parallax", {
          x: xPos,
          y: yPos,
          duration: 2,
          ease: "power2.out",
        });
      };
  
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 w-screen h-screen z-[-10] bg-black overflow-hidden m-0 p-0">
      {/* CAPA BASE: EL AGUJERO NEGRO AL 100% */}
      <div className="gargantua-parallax absolute inset-0 w-full h-full scale-110">
        <img 
          src={descargaGif} 
          alt="Gargantua Background" 
          className="w-full h-full object-cover brightness-110 contrast-110"
        />
        
        {/* SOBRECAPA DE INTEGRACIÓN: Para que el dashboard sea legible pero el fondo brille */}
        <div className="gargantua-overlay absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>
        <div className="absolute inset-0 bg-indigo-500/5 mix-blend-overlay pointer-events-none"></div>
      </div>

      {/* DETALLES DE "SKILL": Puntos de datos orbitales sutiles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
        <div className="absolute top-3/4 left-2/3 w-1 h-1 bg-indigo-400 rounded-full animate-pulse delay-700 shadow-[0_0_10px_indigo]"></div>
        <div className="absolute top-1/2 right-10 w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-1000 shadow-[0_0_10px_cyan]"></div>
      </div>
    </div>
  );
}
