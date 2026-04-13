// Fórmula: (Ingresos - Costos) / Ingresos * 100
export function calcularMargenBruto(ingresos, costos) {
  if (ingresos === 0) return 0;
  return ((ingresos - costos) / ingresos) * 100;
}

// Fórmula: (Ganancia Neta / Inversión Total) * 100
export function calcularROI(ingresos, costos, gastos) {
  const inversionTotal = costos + gastos;
  if (inversionTotal === 0) return 0;
  const gananciaNeta = ingresos - inversionTotal;
  return (gananciaNeta / inversionTotal) * 100;
}

// Fórmula: Gastos Fijos / (1 - Costos Variables / Ingresos)
export function calcularPuntoEquilibrio(ingresos, costos, gastos) {
  if (ingresos === 0) return 0;
  const ratioVariable = costos / ingresos;
  if (ratioVariable >= 1) return Infinity;
  return gastos / (1 - ratioVariable);
}

// Recibe el array de meses y devuelve los 3 KPIs con totales
export function calcularKPIs(datos) {
  const totalIngresos = datos.reduce((acc, mes) => acc + mes.ingresos, 0);
  const totalCostos   = datos.reduce((acc, mes) => acc + mes.costos, 0);
  const totalGastos   = datos.reduce((acc, mes) => acc + mes.gastos, 0);

  return {
    totalIngresos,
    totalCostos,
    totalGastos,
    margenBruto:     calcularMargenBruto(totalIngresos, totalCostos),
    roi:             calcularROI(totalIngresos, totalCostos, totalGastos),
    puntoEquilibrio: calcularPuntoEquilibrio(totalIngresos, totalCostos, totalGastos),
  };
}
