const PALABRAS_INVERSION = ["inversión", "servidor", "equipo", "hardware", "software", "maquinaria"];
const PALABRAS_GASTO     = ["salario", "renta", "alquiler", "proveedor", "electricidad", "internet"];

export function clasificarTransaccion(descripcion, monto) {
  const texto = descripcion.toLowerCase();
  if (monto > 0) return "ingreso";
  if (PALABRAS_INVERSION.some(p => texto.includes(p))) return "inversión";
  if (PALABRAS_GASTO.some(p => texto.includes(p))) return "gasto";
  return "otro";
}

export function clasificarTransacciones(transacciones) {
  return transacciones.map(t => ({
    ...t,
    tipo: clasificarTransaccion(t.descripcion, t.monto)
  }));
}
