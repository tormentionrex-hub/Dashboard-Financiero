// ─────────────────────────────────────────────────────────────────────────────
//  LOCAL AI ENGINE — Motor de inteligencia artificial 100% local
//  Sin dependencia de APIs externas. Genera análisis basados en datos reales.
// ─────────────────────────────────────────────────────────────────────────────

// ── Utilidades de texto ──────────────────────────────────────────────────────

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pct(val, total) {
  return total ? ((val / total) * 100).toFixed(1) : "0.0";
}

function currency(n) {
  return `$${n.toFixed(2)}`;
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── MARKET INTELLIGENCE ENGINE ───────────────────────────────────────────────

const INSIGHT_TEMPLATES = [
  (data) => `La categoría "${data.topCat}" lidera con ${pct(data.topCatRevenue, data.totalRevenue)}% de los ingresos totales. ${data.topCatRevenue > data.avgCatRevenue * 1.5 ? "Tendencia alcista significativa detectada." : "Rendimiento estable dentro de los parámetros esperados."}`,
  (data) => `Ticket promedio de ${currency(data.avgTicket)} en las últimas ${data.txnCount} transacciones. ${data.avgTicket > 50 ? "Los productos premium dominan las ventas." : "Predominan compras de rango medio-bajo."}`,
  (data) => `"${data.lastProduct}" registra ${data.lastProductSales} ventas recientes por ${currency(data.lastProductRevenue)}. ${data.lastProductSales > 3 ? "Producto en tendencia — considerar restock prioritario." : "Volumen normal de rotación."}`,
  (data) => `${data.discountRate > 10 ? "Alerta: " + data.discountRate.toFixed(0) + "% de transacciones con descuento aplicado. Evaluar impacto en margen bruto." : "Tasa de descuento saludable (" + data.discountRate.toFixed(0) + "%). Márgenes protegidos."}`,
  (data) => `Velocidad de ventas: ${currency(data.revenuePerMin)}/min en ventana reciente. ${data.revenuePerMin > 100 ? "Flujo intenso — capacidad operativa al máximo." : "Flujo moderado — oportunidad para campañas de activación."}`,
  (data) => `Top producto por ingresos: "${data.topProduct}" con ${currency(data.topProductRevenue)}. Representa ${pct(data.topProductRevenue, data.totalRevenue)}% del revenue total acumulado.`,
  (data) => `Se detectan ${data.categoriesActive} categorías activas de ${data.totalCategories}. ${data.categoriesActive === data.totalCategories ? "Diversificación óptima del catálogo." : "Oportunidad: " + (data.totalCategories - data.categoriesActive) + " categorías sin actividad reciente."}`,
  (data) => `Concentración de ventas: los top 3 productos generan ${pct(data.top3Revenue, data.totalRevenue)}% del ingreso. ${data.top3Revenue / data.totalRevenue > 0.5 ? "Riesgo de dependencia — diversificar oferta recomendado." : "Distribución balanceada de ingresos."}`,
];

export function generateMarketInsight(purchases) {
  if (!purchases.length) return "Recopilando datos iniciales del mercado...";

  const totalRevenue = purchases.reduce((s, p) => s + p.total, 0);
  const avgTicket = totalRevenue / purchases.length;

  // Category analysis
  const catMap = {};
  purchases.forEach(p => {
    catMap[p.product.category] = (catMap[p.product.category] || 0) + p.total;
  });
  const catEntries = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  const avgCatRevenue = catEntries.reduce((s, [, v]) => s + v, 0) / catEntries.length;

  // Product analysis
  const prodMap = {};
  const prodCount = {};
  purchases.forEach(p => {
    prodMap[p.product.name] = (prodMap[p.product.name] || 0) + p.total;
    prodCount[p.product.name] = (prodCount[p.product.name] || 0) + 1;
  });
  const prodEntries = Object.entries(prodMap).sort((a, b) => b[1] - a[1]);
  const top3Revenue = prodEntries.slice(0, 3).reduce((s, [, v]) => s + v, 0);

  // Discount rate
  const discounted = purchases.filter(p => p.discount > 0).length;
  const discountRate = (discounted / purchases.length) * 100;

  // Revenue per minute (last 10)
  const recent = purchases.slice(0, 10);
  const recentTotal = recent.reduce((s, p) => s + p.total, 0);

  const last = purchases[0];

  const data = {
    totalRevenue,
    avgTicket,
    txnCount: purchases.length,
    topCat: catEntries[0]?.[0] || "N/A",
    topCatRevenue: catEntries[0]?.[1] || 0,
    avgCatRevenue,
    topProduct: prodEntries[0]?.[0] || "N/A",
    topProductRevenue: prodEntries[0]?.[1] || 0,
    lastProduct: last?.product?.name || "N/A",
    lastProductSales: prodCount[last?.product?.name] || 0,
    lastProductRevenue: prodMap[last?.product?.name] || 0,
    discountRate,
    revenuePerMin: recentTotal,
    categoriesActive: catEntries.length,
    totalCategories: 7,
    top3Revenue,
  };

  return pick(INSIGHT_TEMPLATES)(data);
}

export function generateMarketReport(purchases) {
  if (!purchases.length) return "Sin datos suficientes para generar reporte.";

  const totalRevenue = purchases.reduce((s, p) => s + p.total, 0);
  const avgTicket = totalRevenue / purchases.length;

  // Product analysis
  const prodMap = {};
  const prodCount = {};
  purchases.forEach(p => {
    prodMap[p.product.name] = (prodMap[p.product.name] || 0) + p.total;
    prodCount[p.product.name] = (prodCount[p.product.name] || 0) + 1;
  });
  const topProducts = Object.entries(prodMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Category analysis
  const catMap = {};
  purchases.forEach(p => {
    catMap[p.product.category] = (catMap[p.product.category] || 0) + p.total;
  });
  const categories = Object.entries(catMap).sort((a, b) => b[1] - a[1]);

  // Discount analysis
  const discounted = purchases.filter(p => p.discount > 0);
  const discountRevenueLost = discounted.reduce((s, p) => {
    const original = p.total / (1 - p.discount / 100);
    return s + (original - p.total);
  }, 0);

  // Location analysis
  const locMap = {};
  purchases.forEach(p => {
    locMap[p.location] = (locMap[p.location] || 0) + p.total;
  });
  const topLocations = Object.entries(locMap).sort((a, b) => b[1] - a[1]).slice(0, 3);

  // Growth trend (first half vs second half)
  const mid = Math.floor(purchases.length / 2);
  const firstHalf = purchases.slice(mid).reduce((s, p) => s + p.total, 0);
  const secondHalf = purchases.slice(0, mid).reduce((s, p) => s + p.total, 0);
  const growthPct = firstHalf > 0 ? (((secondHalf - firstHalf) / firstHalf) * 100).toFixed(1) : "0.0";

  let report = `## 1. RESUMEN DE RENDIMIENTO\n\n`;
  report += `Se registraron **${purchases.length} transacciones** con ingresos totales de **${currency(totalRevenue)}**. `;
  report += `El ticket promedio es **${currency(avgTicket)}**, `;
  report += growthPct > 0
    ? `con una tendencia de crecimiento del **+${growthPct}%** en la segunda mitad del periodo.\n\n`
    : `con una contracción del **${growthPct}%** en la segunda mitad del periodo. Se recomienda activar campañas promocionales.\n\n`;

  report += `## 2. PRODUCTOS ESTRELLA\n\n`;
  topProducts.forEach(([name, rev], i) => {
    const count = prodCount[name] || 0;
    report += `${i + 1}. **${name}** — ${currency(rev)} (${count} ventas, ${pct(rev, totalRevenue)}% del total)\n`;
  });
  report += `\n`;

  report += `## 3. TENDENCIAS DE CATEGORIA\n\n`;
  categories.forEach(([cat, rev]) => {
    const bar = "█".repeat(Math.round((rev / totalRevenue) * 20));
    report += `- **${cat}**: ${currency(rev)} (${pct(rev, totalRevenue)}%) ${bar}\n`;
  });
  report += `\n`;

  report += `## 4. ALERTAS Y OPORTUNIDADES\n\n`;
  if (discounted.length > 0) {
    report += `- **Descuentos**: ${discounted.length} transacciones con descuento (${pct(discounted.length, purchases.length)}%). Revenue sacrificado: ${currency(discountRevenueLost)}.\n`;
  }
  if (categories.length < 7) {
    report += `- **Categorias inactivas**: ${7 - categories.length} categorias sin ventas. Oportunidad de activacion.\n`;
  }
  const topProductPct = topProducts[0] ? (topProducts[0][1] / totalRevenue) * 100 : 0;
  if (topProductPct > 25) {
    report += `- **Concentracion**: "${topProducts[0][0]}" representa ${topProductPct.toFixed(1)}% del ingreso. Riesgo de dependencia.\n`;
  }
  if (topLocations.length > 0) {
    report += `- **Top mercados**: ${topLocations.map(([loc, rev]) => `${loc} (${currency(rev)})`).join(", ")}.\n`;
  }
  report += `\n`;

  report += `## 5. PROYECCION (proximas 24h)\n\n`;
  const hourlyRate = totalRevenue / Math.max(1, purchases.length) * 60; // rough estimate
  report += `Basado en la velocidad actual de ventas, se proyectan ingresos de **${currency(hourlyRate * 0.7)}** a **${currency(hourlyRate * 1.3)}** en las proximas 24 horas. `;
  report += categories[0]
    ? `La categoria "${categories[0][0]}" continuara liderando con alta probabilidad.`
    : "";

  return report;
}

// ── DOCUMENT INTELLIGENCE ENGINE ─────────────────────────────────────────────

function analyzeNumbers(text) {
  const numbers = text.match(/[\d,]+\.?\d*/g) || [];
  const parsed = numbers.map(n => parseFloat(n.replace(/,/g, ""))).filter(n => !isNaN(n) && n > 0);
  if (!parsed.length) return null;

  const sum = parsed.reduce((s, n) => s + n, 0);
  const avg = sum / parsed.length;
  const max = Math.max(...parsed);
  const min = Math.min(...parsed);
  const sorted = [...parsed].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];

  return { count: parsed.length, sum, avg, max, min, median };
}

function detectColumns(text) {
  const lines = text.split("\n").filter(l => l.trim());
  if (lines.length < 2) return null;

  const separators = ["|", "\t", ",", ";"];
  let bestSep = "|";
  let bestCount = 0;

  for (const sep of separators) {
    const count = (lines[0].match(new RegExp(`\\${sep}`, "g")) || []).length;
    if (count > bestCount) {
      bestCount = count;
      bestSep = sep;
    }
  }

  if (bestCount < 1) return null;

  const headers = lines[0].split(bestSep).map(h => h.trim()).filter(Boolean);
  const rows = lines.slice(1).map(l => l.split(bestSep).map(c => c.trim()));

  return { headers, rows, rowCount: rows.length, colCount: headers.length };
}

function detectPatterns(text) {
  const patterns = [];

  // Dates
  const dates = text.match(/\d{1,4}[-/]\d{1,2}[-/]\d{1,4}/g);
  if (dates?.length) patterns.push(`${dates.length} fechas detectadas`);

  // Emails
  const emails = text.match(/[\w.-]+@[\w.-]+\.\w+/g);
  if (emails?.length) patterns.push(`${emails.length} emails encontrados`);

  // Currency values
  const currencies = text.match(/\$[\d,]+\.?\d*/g);
  if (currencies?.length) patterns.push(`${currencies.length} valores monetarios`);

  // Percentages
  const pcts = text.match(/\d+\.?\d*%/g);
  if (pcts?.length) patterns.push(`${pcts.length} porcentajes`);

  // Phone numbers
  const phones = text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g);
  if (phones?.length) patterns.push(`${phones.length} numeros telefonicos`);

  return patterns;
}

export async function analyzeDocument(content, fileName, fileType) {
  await delay(800 + Math.random() * 1200); // Simulate processing

  const lines = content.split("\n").filter(l => l.trim());
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const charCount = content.length;
  const numStats = analyzeNumbers(content);
  const columns = detectColumns(content);
  const patterns = detectPatterns(content);

  let analysis = `## RESUMEN EJECUTIVO\n\n`;
  analysis += `Documento **"${fileName}"** (${fileType}) procesado exitosamente. `;
  analysis += `Contiene ${lines.length} lineas, ${wordCount} palabras y ${charCount} caracteres. `;

  if (columns) {
    analysis += `Estructura tabular detectada con ${columns.colCount} columnas y ${columns.rowCount} filas de datos. `;
    analysis += `Columnas: ${columns.headers.join(", ")}.\n\n`;
  } else {
    analysis += `Formato de texto libre sin estructura tabular definida.\n\n`;
  }

  analysis += `## DATOS CLAVE DETECTADOS\n\n`;

  if (numStats) {
    analysis += `- **${numStats.count} valores numericos** encontrados en el documento\n`;
    analysis += `- **Suma total**: ${currency(numStats.sum)}\n`;
    analysis += `- **Promedio**: ${currency(numStats.avg)}\n`;
    analysis += `- **Rango**: ${currency(numStats.min)} — ${currency(numStats.max)}\n`;
    analysis += `- **Mediana**: ${currency(numStats.median)}\n`;
  } else {
    analysis += `- No se detectaron valores numericos significativos\n`;
  }

  if (patterns.length) {
    patterns.forEach(p => {
      analysis += `- ${p}\n`;
    });
  }

  if (columns?.headers.length) {
    analysis += `- Campos identificados: ${columns.headers.slice(0, 8).join(", ")}\n`;
  }
  analysis += `\n`;

  analysis += `## ANALISIS FINANCIERO\n\n`;
  if (numStats && numStats.count >= 3) {
    const variance = numStats.max - numStats.min;
    const volatility = (variance / numStats.avg) * 100;
    analysis += `- **Volatilidad de datos**: ${volatility.toFixed(1)}% (${volatility > 100 ? "alta" : volatility > 50 ? "moderada" : "baja"})\n`;
    analysis += `- **Dispersion**: Diferencia entre maximo y minimo de ${currency(variance)}\n`;

    if (numStats.avg > 1000) {
      analysis += `- Los valores promedios sugieren datos de **alto valor** (posibles montos financieros o inventario costoso)\n`;
    } else if (numStats.avg > 100) {
      analysis += `- Rango de valores consistente con **transacciones comerciales estandar**\n`;
    } else {
      analysis += `- Valores en rango bajo — posibles cantidades unitarias, porcentajes o metricas operativas\n`;
    }
  } else {
    analysis += `Datos numericos insuficientes para un analisis financiero completo. Se recomienda enriquecer el dataset.\n`;
  }
  analysis += `\n`;

  analysis += `## ANOMALIAS O PUNTOS DE ATENCION\n\n`;
  if (numStats) {
    if (numStats.max > numStats.avg * 5) {
      analysis += `- **Valor atipico detectado**: ${currency(numStats.max)} supera 5x el promedio. Verificar si es un error o caso excepcional.\n`;
    }
    if (numStats.min < numStats.avg * 0.1 && numStats.min > 0) {
      analysis += `- **Valor extremadamente bajo**: ${currency(numStats.min)} esta muy por debajo del promedio. Posible dato incompleto.\n`;
    }
    if (numStats.count < 5) {
      analysis += `- **Dataset limitado**: Solo ${numStats.count} valores numericos. Conclusiones estadisticas poco confiables.\n`;
    }
  }

  const emptyLines = content.split("\n").filter(l => !l.trim()).length;
  if (emptyLines > lines.length * 0.3) {
    analysis += `- **Espacios vacios**: ${emptyLines} lineas vacias detectadas (${((emptyLines / (lines.length + emptyLines)) * 100).toFixed(0)}%). Posible formato inconsistente.\n`;
  }

  if (!numStats && !columns) {
    analysis += `- El documento no contiene datos estructurados ni valores numericos significativos.\n`;
  }
  analysis += `\n`;

  analysis += `## RECOMENDACIONES\n\n`;
  analysis += `1. ${columns ? "Exportar a formato estructurado (base de datos o Data Warehouse) para analisis avanzado" : "Estructurar los datos en formato tabular para facilitar el procesamiento automatizado"}\n`;
  analysis += `2. ${numStats && numStats.count > 10 ? "Implementar monitoreo continuo de las metricas clave identificadas" : "Enriquecer el dataset con mas puntos de datos para mejorar la precision analitica"}\n`;
  analysis += `3. ${patterns.includes(patterns.find(p => p.includes("fechas"))) ? "Crear un timeline basado en las fechas detectadas para analisis temporal" : "Agregar timestamps a los registros para habilitar analisis de tendencias"}\n`;
  analysis += `4. Establecer alertas automaticas para valores fuera del rango ${numStats ? `${currency(numStats.avg * 0.5)} — ${currency(numStats.avg * 1.5)}` : "normal"}\n`;
  analysis += `5. Compartir hallazgos con el equipo mediante el Agente de Mercado para correlacionar con datos de ventas en tiempo real\n`;

  return analysis;
}

export function quickLocalSummary(text, fileName) {
  const lines = text.split("\n").filter(l => l.trim());
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const numStats = analyzeNumbers(text);

  let summary = `**Resumen de "${fileName}"**\n\n`;
  summary += `- ${lines.length} lineas, ${wordCount} palabras\n`;
  if (numStats) {
    summary += `- ${numStats.count} valores numericos (total: ${currency(numStats.sum)}, promedio: ${currency(numStats.avg)})\n`;
  }
  const patterns = detectPatterns(text);
  patterns.forEach(p => { summary += `- ${p}\n`; });

  return summary;
}

// ── CUSTOMER SERVICE ENGINE (NOVA) ───────────────────────────────────────────

const GREETING_RESPONSES = [
  "Hola! Soy **NOVA**, tu asistente de The Space Shop. Estoy lista para ayudarte con productos, envios, recomendaciones o cualquier consulta sobre nuestra tienda espacial. Que necesitas hoy?",
  "Bienvenido a The Space Shop! Soy **NOVA** y estoy aqui para asistirte. Preguntame sobre nuestro catalogo, precios, envios o cualquier otra cosa!",
  "Hey! NOVA al habla. Tenemos 86 productos increibles en The Space Shop. En que te puedo ayudar?",
];

const FAREWELL_RESPONSES = [
  "Fue un placer ayudarte! Recuerda que siempre estoy aqui en The Space Shop. Hasta pronto!",
  "Excelente, cualquier cosa que necesites no dudes en escribirme. Que tengas un gran dia espacial!",
  "Nos vemos! Si necesitas algo mas, aqui estare. The Space Shop nunca cierra.",
];

// Knowledge base for pattern matching
const KNOWLEDGE_BASE = {
  envio: {
    patterns: ["envio", "enviar", "shipping", "entrega", "despacho", "llegar", "demora", "tarda", "envios"],
    response: "Nuestras opciones de envio:\n\n- **Standard**: 5-7 dias habiles ($4.99)\n- **Express**: 2-3 dias habiles ($12.99)\n- **Overnight**: Dia siguiente ($24.99)\n- **Gratis**: En compras mayores a $150\n\nTodos los pedidos incluyen numero de rastreo."
  },
  devolucion: {
    patterns: ["devolucion", "devolver", "cambio", "cambiar", "reembolso", "regreso", "return"],
    response: "Nuestra politica de devoluciones:\n\n- **Plazo**: 30 dias desde la compra\n- **Condicion**: Producto en perfectas condiciones con recibo original\n- **Proceso**: Contactanos y te enviamos una etiqueta de devolucion prepagada\n- **Reembolso**: 5-7 dias habiles despues de recibir el producto\n\nLos meteoritos autenticos y productos personalizados no son retornables."
  },
  garantia: {
    patterns: ["garantia", "warranty", "roto", "defecto", "danado", "fallo", "funciona"],
    response: "Cobertura de garantia:\n\n- **Telescopios y modelos a escala**: 1 ano completo\n- **Ropa y accesorios**: 90 dias\n- **Meteoritos y rocas**: Certificado de autenticidad de por vida\n- **Juguetes**: 6 meses\n\nPara hacer valida la garantia, presenta tu recibo y numero de orden."
  },
  descuento: {
    patterns: ["descuento", "oferta", "promocion", "cupon", "codigo", "promo", "barato", "rebaja", "discount"],
    response: "Ofertas disponibles ahora:\n\n- **SPACE10**: 10% de descuento en tu primera compra\n- **Envio gratis** en ordenes mayores a $150\n- Descuentos especiales de 5-15% aparecen aleatoriamente en productos seleccionados\n\nSiguenos para enterarte de las proximas promociones!"
  },
  modelo: {
    patterns: ["modelo", "replica", "cohete", "shuttle", "saturn", "apollo", "rocket", "nave"],
    response: "Nuestra coleccion de modelos y replicas incluye:\n\n- **Saturn V 1:200** — $350.00 (nuestro mas vendido)\n- **Space Shuttle Discovery 1:200** — $300.00\n- **Apollo 11 Capsule 1:25** — $300.00\n- **Mercury Capsule 1:24** — $260.00\n- **SLS Rocket 1:235** — $59.99 (mejor relacion calidad-precio)\n- **Metal Earth Mars Rover** — $39.99 (para armar)\n\nTenemos 19 modelos diferentes. Quieres mas detalles de alguno?"
  },
  meteorito: {
    patterns: ["meteorito", "roca", "marte", "luna", "moon", "mars", "meteorite", "autentic"],
    response: "Nuestra coleccion de meteoritos autenticos:\n\n- **Roca de Marte Grande** — $170.00\n- **Roca de Luna Grande** — $170.00\n- **Meteorito Genuino 1/2 Lb** — $315.00 (coleccionistas)\n- **Meteorito 3 Gramos** — $14.99 (ideal para regalo)\n- **Collar de Meteorito** — $24.99\n- **Pendientes Silver Star** — $100.00\n\nTodos incluyen certificado de autenticidad. Los meteoritos son fragmentos reales verificados por laboratorio!"
  },
  comida: {
    patterns: ["comida", "comer", "food", "astronauta", "freeze", "helado", "ice cream", "alimento"],
    response: "Comida espacial liofilizada (la misma que comen los astronautas!):\n\n- **Freeze-Dried Ice Cream** — desde $6.99\n- Varios sabores disponibles: Neapolitan, Cookies & Cream, Mint Chocolate\n- **Freeze-Dried Fruit** — $5.99\n- **Freeze-Dried Cinnamon Apples** — $5.99\n\nTenemos 11 productos de comida espacial. Perfectos para regalos o para probar algo fuera de este mundo!"
  },
  ropa: {
    patterns: ["ropa", "camiseta", "gorra", "hoodie", "jacket", "polo", "vestir", "accesorios", "wear"],
    response: "Ropa y accesorios NASA:\n\n- **NASA Bomber Jacket** — $60.00 (nuestro favorito!)\n- **NASA Hoodie** — $45.00\n- **NASA T-Shirt** — $24.99\n- **NASA Cap** — $19.99\n- **NASA Backpack** — $45.00\n\nTenemos 13 articulos de ropa y accesorios oficiales. Todos con licencia NASA!"
  },
  precio: {
    patterns: ["precio", "cuesta", "cuanto", "vale", "cost", "price", "valor"],
    response: "Nuestro rango de precios:\n\n- **Desde $5.99** — Comida espacial liofilizada\n- **$9.99 — $24.99** — Parches de mision y accesorios pequenos\n- **$24.99 — $60.00** — Ropa, joyeria y juguetes\n- **$59.99 — $400.00** — Modelos premium y meteoritos\n\nRecuerda: con el codigo **SPACE10** tienes 10% en tu primera compra. Quieres saber el precio de algo especifico?"
  },
  popular: {
    patterns: ["popular", "vendido", "recomend", "mejor", "favorito", "top", "best"],
    response: "Nuestros productos mas populares:\n\n1. **Saturn V Rocket 1:200** — $350.00 (coleccionistas)\n2. **NASA Bomber Jacket** — $60.00 (moda espacial)\n3. **Freeze-Dried Ice Cream** — $6.99 (curiosidad cosmica)\n4. **Meteorito Genuino 3g** — $14.99 (regalo unico)\n5. **Apollo 11 Mission Patch** — $9.99 (clasico)\n\nCada uno destaca en su categoria. Quieres que te ayude a elegir?"
  },
  orden: {
    patterns: ["orden", "pedido", "compra", "estado", "rastreo", "tracking", "order"],
    response: "Para consultar tu pedido:\n\n- Tu numero de orden tiene formato **ORD-XXXXX**\n- Puedes rastrear tu envio con el numero de tracking que te enviamos por email\n- Los pedidos se procesan en 1-2 dias habiles\n- Recibes confirmacion por email en cada etapa\n\nSi tienes tu numero de orden, te ayudo a verificar el estado!"
  },
  ayuda: {
    patterns: ["ayuda", "help", "soporte", "contacto", "problema", "queja"],
    response: "Estoy aqui para ayudarte! Puedo asistirte con:\n\n- **Productos**: Informacion, precios y disponibilidad\n- **Envios**: Opciones y tiempos de entrega\n- **Devoluciones**: Politica y proceso\n- **Recomendaciones**: Basadas en tus intereses\n- **Descuentos**: Codigos y promociones activas\n\nSolo dimelo y te oriento!"
  },
  regalo: {
    patterns: ["regalo", "regalar", "gift", "cumpleanos", "navidad", "sorpresa"],
    response: "Ideas de regalo espacial:\n\n**Para ninos:**\n- Juguetes educativos desde $12.99\n- Comida de astronauta $5.99-$6.99\n\n**Para adultos:**\n- Collar de meteorito genuino $24.99\n- NASA Bomber Jacket $60.00\n\n**Para coleccionistas:**\n- Meteorito genuino desde $14.99\n- Modelos a escala desde $59.99\n\n**Economicos (<$15):**\n- Parches de mision $9.99\n- Meteorito 3g $14.99\n- Comida espacial $5.99"
  },
};

const GENERIC_RESPONSES = [
  "Entiendo tu consulta. En The Space Shop tenemos 86 productos en 7 categorias: Modelos, Meteoritos, Parches, Comida Espacial, Juguetes, Ropa y Hogar. Quieres que te ayude con algo especifico?",
  "Buena pregunta! Puedo ayudarte con informacion de productos, precios, envios, devoluciones o recomendaciones personalizadas. Que prefieres explorar?",
  "Hmm, dejame pensarlo... Si me das mas detalles de lo que buscas, puedo darte una respuesta mas precisa. Puedo ayudarte con productos, envios, precios o recomendaciones!",
  "Interesante consulta. Como asistente de The Space Shop, mi especialidad es ayudarte a encontrar productos espaciales increibles. Cuentame que tienes en mente!",
];

function findBestMatch(message) {
  const lower = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Check greetings
  if (/^(hola|hey|buenas|hi|hello|saludos|que tal)/.test(lower)) {
    return { type: "greeting" };
  }

  // Check farewells
  if (/^(adios|bye|chao|hasta|nos vemos|gracias por todo)/.test(lower)) {
    return { type: "farewell" };
  }

  // Check thanks
  if (/^(gracias|thanks|genial|perfecto|excelente|ok gracias)/.test(lower)) {
    return { type: "thanks" };
  }

  // Score each knowledge base entry
  let bestScore = 0;
  let bestKey = null;

  for (const [key, entry] of Object.entries(KNOWLEDGE_BASE)) {
    let score = 0;
    for (const pattern of entry.patterns) {
      if (lower.includes(pattern)) {
        score += pattern.length; // Longer matches score higher
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestKey = key;
    }
  }

  if (bestKey && bestScore > 0) {
    return { type: "knowledge", key: bestKey };
  }

  return { type: "generic" };
}

export async function chatWithNova(history, message) {
  // Simulate thinking time
  await delay(500 + Math.random() * 1000);

  const match = findBestMatch(message);

  switch (match.type) {
    case "greeting":
      return pick(GREETING_RESPONSES);
    case "farewell":
      return pick(FAREWELL_RESPONSES);
    case "thanks":
      return pick([
        "De nada! Siempre es un placer ayudar. Necesitas algo mas?",
        "Me alegra poder ayudarte! Si tienes otra consulta, aqui estoy.",
        "Para eso estoy! No dudes en preguntarme lo que necesites.",
      ]);
    case "knowledge":
      return KNOWLEDGE_BASE[match.key].response;
    default:
      return pick(GENERIC_RESPONSES);
  }
}
