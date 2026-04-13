# Progreso del Proyecto — Dashboard Financiero con IA

## Stack
- React + Vite
- Recharts (gráficos)
- @anthropic-ai/sdk (análisis con IA)

## Pasos

| # | Paso | Estado | Archivo(s) creado(s) |
|---|------|--------|----------------------|
| 1 | Crear proyecto Vite + dependencias | ✅ Listo | `package.json`, `.env`, estructura de carpetas |
| 2 | Datos financieros JSON | ✅ Listo | `src/data/financialData.json` |
| 3 | Módulo KPIs (JavaScript) | ✅ Listo | `src/utils/kpiCalculator.js` |
| 4 | Clasificador de transacciones | ✅ Listo | `src/utils/transactionClassifier.js` |
| 5 | Servicio Claude API | ✅ Listo | `src/services/claudeService.js` |
| 6 | Componentes React | ✅ Listo | `src/components/` (5 componentes) |
| 7 | Ensamblar App.jsx | ✅ Listo | `src/App.jsx` |
| 8 | Estilos CSS | ✅ Listo | `src/styles/App.css` |
| 9 | Verificar y correr | ✅ Listo | Build exitoso ✓ |

---

## Datos de TechCorp S.A. (Q1 2026)

| Mes | Ingresos | Costos | Gastos | Nota |
|-----|----------|--------|--------|------|
| Enero | $85,000 | $32,000 | $18,000 | Normal |
| Febrero | $92,000 | $35,000 | $21,000 | Mejor mes |
| Marzo | $78,000 | $40,000 | $25,000 | ⚠️ Anomalía intencional |
| Abril | $105,000 | $38,000 | $22,000 | Mejor mes |

---

## KPIs implementados

| KPI | Fórmula | Resultado con datos actuales |
|-----|---------|------------------------------|
| Margen Bruto | `(Ingresos - Costos) / Ingresos * 100` | 59.7% |
| ROI | `(Ingresos - Costos - Gastos) / (Costos + Gastos) * 100` | 55.8% |
| Punto de Equilibrio | `Gastos / (1 - Costos / Ingresos)` | $144,000 |

---

## Archivos del proyecto

```
src/
├── components/
│   ├── AIAnalysis.jsx       ← Sección análisis con IA
│   ├── KPICard.jsx          ← Tarjeta individual de KPI
│   ├── KPIPanel.jsx         ← Panel con los 3 KPIs
│   ├── RevenueChart.jsx     ← Gráfico de barras (Recharts)
│   └── TransactionList.jsx  ← Tabla de transacciones
├── data/
│   └── financialData.json   ← Datos financieros TechCorp S.A.
├── images/
│   └── iconpage.png         ← Ícono 3D del dashboard
├── pages/                   ← (disponible para futuras páginas)
├── routes/                  ← (disponible para futuras rutas)
├── services/
│   └── claudeService.js     ← Llamada a Claude API
├── styles/
│   ├── App.css              ← Estilos del dashboard
│   └── index.css            ← Estilos globales
├── utils/
│   ├── kpiCalculator.js     ← Fórmulas de KPIs
│   └── transactionClassifier.js ← Clasificador de transacciones
├── App.jsx                  ← Componente raíz
└── main.jsx                 ← Entry point
```

---

## Configuración
- API Key Anthropic: guardada en `.env` → `VITE_ANTHROPIC_API_KEY`
- API Key Gemini: guardada en `~/.nano-banana/.env`
- Modelo IA del dashboard: `claude-haiku-4-5`
- Servidor local: `http://localhost:5174`
- Nano Banana CLI: instalado en `~/tools/nano-banana-2`
