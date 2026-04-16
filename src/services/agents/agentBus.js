// ─────────────────────────────────────────────────────────────────────────────
//  AGENT BUS — Sistema de comunicación inter-agentes
//  Bus de eventos centralizado para que ORION, ATLAS y NOVA se coordinen
// ─────────────────────────────────────────────────────────────────────────────

class AgentEventBus {
  constructor() {
    this._listeners = {};
    this._history   = []; // Registro de eventos para la animación
    this._maxHistory = 50;
  }

  /**
   * Suscribirse a un evento del bus
   * @param {string}   event    Nombre del evento
   * @param {Function} handler  Función callback
   */
  on(event, handler) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event].push(handler);
    return () => this.off(event, handler); // retorna función de cleanup
  }

  /**
   * Desuscribirse de un evento
   */
  off(event, handler) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(h => h !== handler);
  }

  /**
   * Emitir un evento a todos los suscriptores
   * @param {string} event    Nombre del evento
   * @param {any}    payload  Datos del evento
   */
  emit(event, payload) {
    // Registrar en historial para la animación
    const entry = { event, payload, timestamp: Date.now() };
    this._history.unshift(entry);
    if (this._history.length > this._maxHistory) {
      this._history.pop();
    }

    // Notificar suscriptores
    if (this._listeners[event]) {
      this._listeners[event].forEach(handler => {
        try {
          handler(payload);
        } catch (err) {
          console.error(`[AgentBus] Error en handler de "${event}":`, err);
        }
      });
    }

    // Emitir también al listener genérico "*"
    if (this._listeners["*"]) {
      this._listeners["*"].forEach(handler => {
        try {
          handler(event, payload);
        } catch (err) {
          console.error(`[AgentBus] Error en handler wildcard:`, err);
        }
      });
    }
  }

  /**
   * Obtener el historial de eventos recientes
   */
  getHistory() {
    return [...this._history];
  }

  /**
   * Limpiar todos los listeners
   */
  clear() {
    this._listeners = {};
    this._history   = [];
  }
}

// Singleton — un único bus compartido por todos los agentes
export const agentBus = new AgentEventBus();

// ── Agentes definidos (metadatos para UI) ────────────────────────────────────
export const AGENTS_META = [
  {
    id:          "orion",
    name:        "ORION",
    role:        "Market Intelligence",
    description: "Monitorea compras en tiempo real, detecta tendencias de mercado y genera reportes financieros ejecutivos.",
    color:       "#6366f1",   // indigo
    colorGlow:   "rgba(99,102,241,0.5)",
    icon:        "🛸",
    events:      ["market:purchase", "market:insight"],
  },
  {
    id:          "atlas",
    name:        "ATLAS",
    role:        "Document Intelligence",
    description: "Procesa archivos Excel, CSV, TXT y JSON. Extrae datos clave, detecta anomalías y genera análisis estructurados.",
    color:       "#10b981",   // emerald
    colorGlow:   "rgba(16,185,129,0.5)",
    icon:        "📡",
    events:      ["document:processing", "document:done"],
  },
  {
    id:          "nova",
    name:        "NOVA",
    role:        "Customer Service",
    description: "Asistente conversacional 24/7 con conocimiento completo del catálogo. Se enriquece con datos de ORION en tiempo real.",
    color:       "#f59e0b",   // amber
    colorGlow:   "rgba(245,158,11,0.5)",
    icon:        "🤖",
    events:      ["customer:message"],
  },
];

// Mapa de flujo de comunicación entre agentes (para la animación)
// Qué evento del emisor → qué agente receptor
export const COMM_FLOW = [
  { from: "orion", to: "nova",  event: "market:insight",      label: "Insights de mercado" },
  { from: "atlas", to: "orion", event: "document:done",       label: "Datos documentales"  },
  { from: "nova",  to: "atlas", event: "customer:message",    label: "Consultas de cliente" },
];
