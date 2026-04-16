# Dashboard Financiero — The Space Shop KSC

Dashboard de inteligencia financiera con estética espacial/NASA para **The Space Shop — Kennedy Space Center Official Store** (empresa matriz: Delaware North). Permite al gerente monitorear ventas, analizar documentos financieros y consultar métricas del negocio mediante 3 agentes de IA que operan simultáneamente.

> Herramienta de uso interno. No es una interfaz de atención al cliente.

---

## Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19.2.4 | UI framework |
| Vite | 8.x | Bundler |
| Tailwind CSS | 4.2.2 | Estilos |
| GSAP + ScrollTrigger | 3.14.2 | Animaciones |
| @gsap/react | 2.1.2 | Hook oficial GSAP |
| React Router | 7.14.0 | Routing |
| XLSX | 0.18.5 | Procesamiento Excel |
| Recharts | 3.8.1 | Gráficas financieras |
| docx + FileSaver | 9.6.1 + 2.0.5 | Generación reportes Word |
| SweetAlert2 | 11.26.24 | Modales |
| animejs | lib/anime.es.js | Animaciones de gráfica |

**Sin dependencia de API externa de pago.** El sistema usa motores locales y APIs gratuitas.

---

## Instalación y desarrollo

```bash
npm install
npm run dev
```

```bash
# Build de producción
npm run build
```

---

## Rutas de la aplicación

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `DashboardPage.jsx` | KPIs, gráficas, análisis ejecutivo, skills |
| `/agents` | `AgentsPage.jsx` | Centro de mando de los 3 agentes IA |

---

## Sistema Multi-Agente IA

Tres agentes de IA operan en paralelo y se comunican entre sí a través de un bus de eventos interno. **No requieren API key ni conexión de pago.**

### Arquitectura de archivos

```
src/
├── services/agents/
│   ├── agentBus.js          — Bus de eventos inter-agentes (singleton)
│   ├── localAI.js           — Motor de IA local: insights y análisis documental
│   ├── smartChatEngine.js   — Motor chat: Chrome AI → Ollama → NLP local + Wikipedia
│   ├── marketAgent.js       — ORION: monitoreo de ventas en tiempo real
│   ├── documentAgent.js     — ATLAS: procesamiento de archivos financieros
│   └── customerAgent.js     — NOVA: asistente financiero del gerente
├── context/
│   └── AgentsContext.jsx    — Estado global de los 3 agentes con useReducer
├── data/
│   └── spaceShopData.js     — Catálogo real extraído de thespaceshop.com
└── components/agents/
    ├── AgentStatusPanel.jsx
    ├── SpaceShopMonitor.jsx
    ├── DocumentProcessor.jsx
    ├── CustomerServiceBot.jsx
    └── AgentNetworkAnimation.jsx  — Animación SVG+GSAP de los 3 agentes conectados
```

---

### Agente 1 — ORION · Market Intelligence

- **Color:** Indigo `#6366f1`
- **Función:** Monitorea transacciones simuladas en tiempo real usando el catálogo real de thespaceshop.com
- **Intervalo:** Genera una compra cada 2.5–6 segundos
- **Análisis automático:** Cada 12 compras genera un insight estadístico local: top categoría, ticket promedio, tendencias, tasa de descuento
- **Reporte ejecutivo:** Análisis completo con 5 secciones: rendimiento, productos estrella, categorías, alertas, proyección
- **Comunicación:** Emite eventos al `agentBus` que NOVA consume para enriquecer respuestas en tiempo real

### Agente 2 — ATLAS · Document Intelligence

- **Color:** Esmeralda `#10b981`
- **Función:** Procesa archivos financieros subidos por el gerente (Excel, CSV, TXT, JSON)
- **Análisis:** Detecta valores numéricos, columnas financieras, fechas, emails, anomalías, outliers estadísticos
- **Output:** Reporte estructurado con 5 secciones: Resumen ejecutivo, Datos clave, Análisis financiero, Anomalías detectadas, Recomendaciones
- **Comunicación:** Notifica a ORION vía bus al completar un análisis

### Agente 3 — NOVA · Financial Intelligence Assistant

- **Color:** Ámbar `#f59e0b`
- **Rol:** Asistente financiero del **gerente** — análisis de métricas, consultas sobre catálogo y ventas
- **Motor de IA (por prioridad de detección automática):**

  | Prioridad | Motor | Requisito |
  |---|---|---|
  | 1 | Chrome Built-in AI (Gemini Nano) | Chrome 127+ con flag activado |
  | 2 | Ollama | Servidor local en `localhost:11434` |
  | 3 | NLP local (siempre disponible) | Ninguno |

- **Activar Chrome AI:** Abrir `chrome://flags/#prompt-api-for-gemini-nano` y habilitar la opción
- **Internet:** Wikipedia API (español → inglés como fallback) — sin API key
- **Datos en tiempo real:** Catálogo de thespaceshop.com + ventas de ORION + documentos de ATLAS

### AgentBus — Comunicación inter-agentes

Bus de eventos singleton (`src/services/agents/agentBus.js`):

```js
agentBus.emit("market:purchase", data);  // ORION → todos
agentBus.on("market:insight", handler);  // NOVA escucha insights
```

| Evento | Emisor | Receptor |
|---|---|---|
| `market:purchase` | ORION | NOVA |
| `market:insight` | ORION | NOVA |
| `document:processing` | ATLAS | ORION |
| `document:done` | ATLAS | ORION, NOVA |
| `customer:message` | NOVA | Bus general |

### AgentNetworkAnimation

Visualización SVG + GSAP que muestra la comunicación en tiempo real:
- 3 círculos en triángulo: ORION (arriba), ATLAS (inferior-derecha), NOVA (inferior-izquierda)
- Puntos viajeros animados que recorren el ciclo `ORION → ATLAS → NOVA → ORION`
- Aura pulsante que se activa cuando el agente está procesando
- Indicador de estado por agente: activo / procesando / error / inactivo

---

## Datos reales — thespaceshop.com

Catálogo extraído directamente del sitio oficial (abril 2026):

| Categoría | SKUs en sitio | SKUs en catálogo local |
|---|---|---|
| Memorabilia (Modelos, Meteoritos, Parches) | 233 | 40 representativos |
| Clothing & Accessories | 367 | 23 representativos |
| Toy Shop | 87 | 20 representativos |
| Home & Gift | 462 | 19 representativos |
| Sale | 12 | 11 |

**Datos financieros clave:**
- Precio mínimo: `$5.99` (Articulated Astronaut Toy)
- Precio máximo: `$400.00` (I Love You To The Moon Pendant)
- Precio promedio: calculado en runtime via `CATALOG_STATS.avgPrice`
- Umbral de envío gratis: `$75`
- Artículos en Sale: precios terminados en `.88` (convención real del sitio)

**Marcas:** Under Armour, RSVLTS, Loungefly, LEGO, Champion, Pins & Aces, Lusso, Barbie/Mattel, Palm Pals
**Temas:** Apollo, Artemis, STS Shuttle, SpaceX, Blue Origin, Peanuts/Snoopy

---

## Detección de intención — NLP local de NOVA

Sistema de regex por frases completas con prioridad. Los intents específicos siempre tienen mayor prioridad que los genéricos.

| Prioridad | Intent | Ejemplo de activación |
|---|---|---|
| 100 | `sales_data` | "cómo estuvieron mis últimas ventas" |
| 90 | `top_products` | "qué se vende más", "productos estrella" |
| 80 | `shipping` / `return` / `discount` | "cuánto cuesta el envío", "política de devoluciones" |
| 75 | `models` / `meteorite` / `clothes` / `price` | "qué meteoritos tienen", "cuál es el precio de..." |
| 50 | `greeting` | Solo frases cortas: "hola", "hey" |
| 50 | `wellbeing` | Solo frases exactas: "cómo estás?" |
| 40 | `help` | "qué sabes hacer", "para qué sirves", "cuáles son tus funciones" |

> Los intents de saludo y bienestar solo se activan si ningún intent más específico hace match.

---

## Preguntas que NOVA puede responder

**Métricas del catálogo:**
- "¿cuál es el precio promedio del catálogo?"
- "¿cuántos productos hay en sale?"
- "¿qué marcas premium manejan?"

**Ventas en tiempo real (requiere ORION activo):**
- "¿cómo estuvieron las últimas ventas?"
- "¿qué categoría genera más ingresos?"
- "¿cuál es el ticket promedio registrado?"

**Consultas por categoría:**
- "¿qué modelos de cohetes tienen?" → Executive Series con precios
- "¿qué hay en meteoritos?" → catálogo completo $14.99–$400
- "¿qué marcas de ropa manejan?" → Under Armour, RSVLTS, Champion, etc.

**Búsqueda en internet (Wikipedia):**
- "¿qué es la ISS?"
- "¿cómo funciona la misión Artemis?"

**Operacional:**
- "¿cuándo aplica envío gratis?" → pedidos de $75 o más
- "¿cuál es el umbral de conversión clave?" → $75 (envío gratis)

---

## Empresa

**The Space Shop — Kennedy Space Center Official Store**
Empresa matriz: Delaware North
Ubicación: Merritt Island, FL
Plataforma e-commerce: BigCommerce
Contacto: 1.800.621.9826
Web: [thespaceshop.com](https://thespaceshop.com)
