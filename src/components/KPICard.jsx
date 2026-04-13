import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function KPICard({ titulo, valor, formato, descripcion, color, icono }) {
  const cardRef   = useRef(null);
  const valorRef  = useRef(null);
  const [valorMostrado, setValorMostrado] = useState(0);

  // Animación de entrada de la card
  useGSAP(() => {
    gsap.from(cardRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
    });
  }, { scope: cardRef });

  // Animación del contador numérico
  useEffect(() => {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: valor,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => setValorMostrado(obj.val),
    });
  }, [valor]);

  const formatearValor = (v) => {
    if (formato === "%") return `${v.toFixed(1)}%`;
    return `$${Math.round(v).toLocaleString()}`;
  };

  return (
    <div
      ref={cardRef}
      className="kpi-card"
      style={{ borderTop: `4px solid ${color}` }}
    >
      <div className="kpi-icono" style={{ color }}>{icono}</div>
      <h3 className="kpi-titulo">{titulo}</h3>
      <p ref={valorRef} className="kpi-valor" style={{ color }}>
        {formatearValor(valorMostrado)}
      </p>
      <p className="kpi-descripcion">{descripcion}</p>
    </div>
  );
}
