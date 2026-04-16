// ─────────────────────────────────────────────────────────────────────────────
//  AgentsContext — Estado global del sistema multi-agente
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext, useReducer, useCallback, useEffect } from "react";
import {
  startMonitoring,
  stopMonitoring,
  isRunning,
  generateMarketReport,
} from "../services/agents/marketAgent";
import { processDocument }      from "../services/agents/documentAgent";
import { sendMessage }          from "../services/agents/customerAgent";

// ── Estado inicial ────────────────────────────────────────────────────────────
const INITIAL_STATE = {
  // AGENTE 1: Market Intelligence
  market: {
    status:      "IDLE",        // IDLE | ACTIVE | PROCESSING | ERROR
    purchases:   [],            // historial completo
    insights:    [],            // insights de IA
    stats: {
      totalRevenue:   0,
      totalTxns:      0,
      avgTicket:      0,
      topCategory:    "—",
      revenuePerMin:  0,
    },
    report:      null,
    reportLoading: false,
    lastError:   null,
  },

  // AGENTE 2: Document Intelligence
  document: {
    status:    "IDLE",
    results:   [],              // análisis completados
    current:   null,            // análisis en curso
    progress:  "",
    lastError: null,
  },

  // AGENTE 3: Customer Service
  customer: {
    status:    "IDLE",
    messages:  [],              // { id, role, text, timestamp }
    isTyping:  false,
    lastError: null,
  },
};

// ── Reducer ───────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    // ── Market Agent ─────────────────────────────────────────────────────────
    case "MARKET_START":
      return { ...state, market: { ...state.market, status: "ACTIVE", lastError: null } };

    case "MARKET_STOP":
      return { ...state, market: { ...state.market, status: "IDLE" } };

    case "MARKET_PURCHASE": {
      const p = action.payload;
      const purchases = [p, ...state.market.purchases].slice(0, 200); // max 200

      // Recalcular stats
      const totalRevenue = purchases.reduce((s, x) => s + x.total, 0);
      const totalTxns    = purchases.length;
      const avgTicket    = totalTxns ? totalRevenue / totalTxns : 0;

      // Top category
      const catMap = {};
      purchases.forEach(x => {
        catMap[x.product.category] = (catMap[x.product.category] || 0) + x.total;
      });
      const topCategory = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

      // Revenue por minuto (últimas 10 compras)
      const recent = purchases.slice(0, 10);
      const recentTotal = recent.reduce((s, x) => s + x.total, 0);
      const revenuePerMin = recentTotal / 1; // aproximado

      return {
        ...state,
        market: {
          ...state.market,
          purchases,
          stats: { totalRevenue, totalTxns, avgTicket, topCategory, revenuePerMin },
        }
      };
    }

    case "MARKET_INSIGHT": {
      const insights = [action.payload, ...state.market.insights].slice(0, 20);
      return { ...state, market: { ...state.market, insights } };
    }

    case "MARKET_REPORT_START":
      return { ...state, market: { ...state.market, reportLoading: true, status: "PROCESSING" } };

    case "MARKET_REPORT_DONE":
      return {
        ...state,
        market: {
          ...state.market,
          report:        action.payload,
          reportLoading: false,
          status:        "ACTIVE",
        }
      };

    case "MARKET_ERROR":
      return {
        ...state,
        market: { ...state.market, lastError: action.payload, status: "ERROR" }
      };

    // ── Document Agent ────────────────────────────────────────────────────────
    case "DOC_PROCESSING":
      return {
        ...state,
        document: { ...state.document, status: "PROCESSING", progress: action.payload, current: null, lastError: null }
      };

    case "DOC_PROGRESS":
      return { ...state, document: { ...state.document, progress: action.payload } };

    case "DOC_DONE": {
      const results = [action.payload, ...state.document.results].slice(0, 10);
      return {
        ...state,
        document: {
          ...state.document,
          status:  "IDLE",
          results,
          current: action.payload,
          progress: "",
        }
      };
    }

    case "DOC_ERROR":
      return {
        ...state,
        document: { ...state.document, status: "ERROR", lastError: action.payload, progress: "" }
      };

    case "DOC_RESET":
      return {
        ...state,
        document: { ...state.document, status: "IDLE", current: null, progress: "", lastError: null }
      };

    // ── Customer Agent ────────────────────────────────────────────────────────
    case "CHAT_ADD_MESSAGE": {
      const messages = [...state.customer.messages, action.payload];
      return { ...state, customer: { ...state.customer, messages } };
    }

    case "CHAT_TYPING":
      return {
        ...state,
        customer: { ...state.customer, isTyping: action.payload, status: action.payload ? "PROCESSING" : "ACTIVE" }
      };

    case "CHAT_ERROR":
      return {
        ...state,
        customer: { ...state.customer, isTyping: false, lastError: action.payload, status: "ERROR" }
      };

    case "CHAT_ACTIVATE":
      return { ...state, customer: { ...state.customer, status: "ACTIVE", lastError: null } };

    case "CHAT_CLEAR":
      return { ...state, customer: { ...INITIAL_STATE.customer } };

    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────
const AgentsContext = createContext(null);

export function AgentsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // ── Market Agent actions ──────────────────────────────────────────────────
  const startMarket = useCallback(() => {
    if (isRunning()) return;
    dispatch({ type: "MARKET_START" });
    startMonitoring(
      (purchase) => dispatch({ type: "MARKET_PURCHASE", payload: purchase }),
      (insight)  => dispatch({ type: "MARKET_INSIGHT",  payload: insight  }),
      (err)      => dispatch({ type: "MARKET_ERROR",    payload: err      })
    );
  }, []);

  const stopMarket = useCallback(() => {
    stopMonitoring();
    dispatch({ type: "MARKET_STOP" });
  }, []);

  const requestMarketReport = useCallback(async () => {
    dispatch({ type: "MARKET_REPORT_START" });
    try {
      const report = await generateMarketReport(state.market.purchases);
      dispatch({ type: "MARKET_REPORT_DONE", payload: report });
    } catch (err) {
      dispatch({ type: "MARKET_ERROR", payload: err.message });
    }
  }, [state.market.purchases]);

  // ── Document Agent actions ────────────────────────────────────────────────
  const processDoc = useCallback(async (file) => {
    dispatch({ type: "DOC_PROCESSING", payload: "Iniciando procesamiento…" });
    try {
      const result = await processDocument(file, (phase) =>
        dispatch({ type: "DOC_PROGRESS", payload: phase })
      );
      dispatch({ type: "DOC_DONE", payload: result });
    } catch (err) {
      dispatch({ type: "DOC_ERROR", payload: err.message });
    }
  }, []);

  const resetDoc = useCallback(() => dispatch({ type: "DOC_RESET" }), []);

  // ── Customer Agent actions ────────────────────────────────────────────────
  const activateChat = useCallback(() => dispatch({ type: "CHAT_ACTIVATE" }), []);

  const sendChatMessage = useCallback(async (text) => {
    const userMsg = { id: Date.now(), role: "user", text, timestamp: new Date() };
    dispatch({ type: "CHAT_ADD_MESSAGE", payload: userMsg });
    dispatch({ type: "CHAT_TYPING", payload: true });

    try {
      const history = state.customer.messages.map(m => ({ role: m.role, text: m.text }));
      // Pasar datos de mercado de ORION para que NOVA pueda responder sobre ventas
      const marketData = {
        purchases: state.market.purchases,
        stats:     state.market.stats,
      };
      // sendMessage retorna { text, engine, source }
      const result = await sendMessage(history, text, marketData);
      const responseText = typeof result === "string" ? result : result.text;
      const botMsg = {
        id:        Date.now() + 1,
        role:      "assistant",
        text:      responseText,
        engine:    result?.engine  || "local",
        source:    result?.source  || null,
        timestamp: new Date(),
      };
      dispatch({ type: "CHAT_ADD_MESSAGE", payload: botMsg });
    } catch (err) {
      dispatch({ type: "CHAT_ERROR", payload: err.message });
      dispatch({
        type:    "CHAT_ADD_MESSAGE",
        payload: {
          id:        Date.now() + 1,
          role:      "assistant",
          text:      "Lo siento, tuve un problema al procesar tu mensaje. Por favor intenta de nuevo. 🔧",
          engine:    "local",
          source:    null,
          timestamp: new Date(),
        }
      });
    } finally {
      dispatch({ type: "CHAT_TYPING", payload: false });
    }
  }, [state.customer.messages]);

  const clearChat = useCallback(() => dispatch({ type: "CHAT_CLEAR" }), []);

  // Auto-limpiar al desmontar
  useEffect(() => {
    return () => stopMonitoring();
  }, []);

  return (
    <AgentsContext.Provider value={{
      state,
      startMarket, stopMarket, requestMarketReport,
      processDoc, resetDoc,
      activateChat, sendChatMessage, clearChat,
    }}>
      {children}
    </AgentsContext.Provider>
  );
}

export function useAgents() {
  const ctx = useContext(AgentsContext);
  if (!ctx) throw new Error("useAgents debe usarse dentro de <AgentsProvider>");
  return ctx;
}
