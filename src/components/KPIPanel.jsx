import KPICard from "./KPICard";

export default function KPIPanel({ kpis }) {
  return (
    <div className="kpi-panel">
      <KPICard
        titulo="Margen Bruto"
        valor={kpis.margenBruto}
        formato="%"
        descripcion="Ingresos menos costos directos"
        color="#4CAF50"
        icono="📈"
      />
      <KPICard
        titulo="ROI"
        valor={kpis.roi}
        formato="%"
        descripcion="Retorno sobre la inversión total"
        color="#2196F3"
        icono="💰"
      />
      <KPICard
        titulo="Punto de Equilibrio"
        valor={kpis.puntoEquilibrio}
        formato="$"
        descripcion="Ventas mínimas para no perder"
        color="#FF9800"
        icono="⚖️"
      />
    </div>
  );
}
