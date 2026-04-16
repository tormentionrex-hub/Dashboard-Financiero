// ─────────────────────────────────────────────────────────────────────────────
//  CustomerServiceBot — NOVA · Asistente IA inteligente de The Space Shop
//  Engine: Chrome Gemini Nano → Ollama → NLP local | Internet: Wikipedia
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useAgents } from "../../context/AgentsContext";
import {
  getWelcomeMessage,
  getSuggestedQuestions,
  getEngineStatus,
} from "../../services/agents/customerAgent";

// ── Etiqueta de engine ────────────────────────────────────────────────────────
const ENGINE_LABELS = {
  "chrome-ai": { label: "Gemini Nano",  color: "#6366f1", dot: "bg-indigo-400" },
  "ollama":    { label: "Ollama Local", color: "#10b981", dot: "bg-emerald-400" },
  "local":     { label: "Motor Local",  color: "#f59e0b", dot: "bg-amber-400"  },
  "detecting": { label: "Iniciando…",   color: "#6b7280", dot: "bg-gray-400"   },
};

function EngineTag({ engine }) {
  const cfg = ENGINE_LABELS[engine] || ENGINE_LABELS["local"];
  return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border"
         style={{ borderColor: `${cfg.color}40`, background: `${cfg.color}15` }}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${cfg.dot}`} />
      <span className="text-[8px] font-black uppercase tracking-wider" style={{ color: cfg.color }}>
        {cfg.label}
      </span>
    </div>
  );
}

// ── Burbuja de mensaje ────────────────────────────────────────────────────────
function MessageBubble({ msg, isNew }) {
  const ref     = useRef();
  const isUser  = msg.role === "user";

  useEffect(() => {
    if (isNew && ref.current) {
      gsap.fromTo(ref.current,
        { opacity: 0, y: 12, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" }
      );
    }
  }, [isNew]);

  function formatInline(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-amber-200">$1</em>');
  }

  const renderText = (text) =>
    text.split("\n").map((line, i) => {
      if (line.startsWith("•") || line.startsWith("-")) {
        return (
          <div key={i} className="flex gap-2 mt-1">
            <span className="text-amber-400 flex-shrink-0">•</span>
            <span dangerouslySetInnerHTML={{ __html: formatInline(line.replace(/^[•\-]\s*/, "")) }} />
          </div>
        );
      }
      if (!line.trim()) return <div key={i} className="h-2" />;
      return (
        <div key={i} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
      );
    });

  return (
    <div ref={ref} className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black ${
        isUser
          ? "bg-indigo-500/30 text-indigo-300 border border-indigo-500/40"
          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
      }`}>
        {isUser ? "TÚ" : "🤖"}
      </div>

      {/* Burbuja */}
      <div className={`max-w-[78%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        <div className={`rounded-2xl px-4 py-3 text-[12px] leading-relaxed ${
          isUser
            ? "bg-indigo-500/25 border border-indigo-500/30 text-indigo-50/90 rounded-tr-sm"
            : "bg-black/50 border border-white/10 text-white/80 rounded-tl-sm"
        }`}>
          {renderText(msg.text)}
        </div>

        {/* Meta: hora + engine + fuente internet */}
        <div className={`flex items-center gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
          <span className="text-[8px] text-white/20">
            {new Date(msg.timestamp).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
          </span>
          {!isUser && msg.engine && (
            <EngineTag engine={msg.engine} />
          )}
          {!isUser && msg.source && (
            <span className="text-[8px] text-blue-400/60 border border-blue-500/20 px-1.5 py-0.5 rounded-full">
              🌐 {msg.source.split(" — ")[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Indicador de escritura (con label de lo que está haciendo) ────────────────
function TypingIndicator({ isSearching }) {
  return (
    <div className="flex gap-3 items-end">
      <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-sm">
        🤖
      </div>
      <div className="bg-black/50 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          {[0, 0.15, 0.3].map((delay, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-bounce"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
        {isSearching && (
          <span className="text-[9px] text-blue-400/70 ml-1">🌐 buscando…</span>
        )}
      </div>
    </div>
  );
}

// ── Pantalla de inicio ────────────────────────────────────────────────────────
function StartScreen({ onStart, engine }) {
  return (
    <div className="flex-grow flex flex-col items-center justify-center gap-6 p-8">
      {/* Avatar grande */}
      <div className="relative">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(245,158,11,0.2)]">
          🤖
        </div>
        <div className="absolute -top-1 -right-1">
          <EngineTag engine={engine} />
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-black text-white">NOVA</h3>
        <p className="text-[11px] text-white/40 mt-1">Asistente de Inteligencia Financiera · Dashboard KSC</p>
        <p className="text-[12px] text-white/60 mt-3 max-w-sm leading-relaxed">
          Conectada a <strong className="text-amber-400">thespaceshop.com</strong>. Analizo datos del catálogo,
          métricas de ventas en tiempo real con ORION, y proceso documentos financieros con ATLAS.
        </p>

        {/* Info del engine */}
        <div className="mt-4 rounded-xl border border-white/8 bg-white/3 px-4 py-3 text-left">
          <p className="text-[9px] text-white/30 uppercase tracking-wider mb-2">Motor de IA detectado</p>
          <div className="flex flex-col gap-1.5">
            {[
              { id: "chrome-ai", label: "Gemini Nano (Chrome Built-in AI)", desc: "IA real integrada en el navegador — sin API key" },
              { id: "ollama",    label: "Ollama Local",                      desc: "LLM local en tu máquina — sin internet" },
              { id: "local",     label: "Motor NLP Local",                   desc: "Motor propio con búsqueda Wikipedia" },
            ].map(opt => (
              <div key={opt.id} className="flex items-start gap-2">
                <span className={`w-3 h-3 rounded-full border mt-0.5 flex-shrink-0 ${
                  engine === opt.id
                    ? "bg-green-400 border-green-500"
                    : "bg-white/10 border-white/20"
                }`} />
                <div>
                  <span className={`text-[9px] font-bold ${engine === opt.id ? "text-white" : "text-white/30"}`}>
                    {opt.label}
                  </span>
                  <span className="text-[8px] text-white/25 ml-1">{opt.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onStart}
        className="px-8 py-3 rounded-2xl text-[12px] font-black uppercase tracking-widest bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white border border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all"
      >
        Iniciar Conversación ✨
      </button>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function CustomerServiceBot() {
  const { state, activateChat, sendChatMessage, clearChat } = useAgents();
  const { status, messages, isTyping, lastError } = state.customer;

  const [inputText,    setInputText]    = useState("");
  const [started,      setStarted]      = useState(false);
  const [engine,       setEngine]       = useState("detecting");
  const [isSearching,  setIsSearching]  = useState(false);

  const messagesEndRef = useRef();
  const inputRef       = useRef();
  const containerRef   = useRef();

  const suggestedQuestions = getSuggestedQuestions();

  // Detectar engine cada vez que el componente monta o cuando el status cambia
  useEffect(() => {
    const checkEngine = () => setEngine(getEngineStatus());
    checkEngine();
    const interval = setInterval(checkEngine, 2000);
    return () => clearInterval(interval);
  }, []);

  // Detectar si el último mensaje buscó internet (tiene source)
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.source && last?.role === "assistant") {
      setIsSearching(false);
    }
  }, [messages]);

  // Detectar si está buscando internet (isTyping + pregunta con palabras clave)
  useEffect(() => {
    if (isTyping) {
      const lastUser = [...messages].reverse().find(m => m.role === "user");
      if (lastUser) {
        const searchWords = /qué es|quién es|cómo funciona|planeta|nasa|cohete|espacio|universo|marte|luna/i;
        setIsSearching(searchWords.test(lastUser.text));
      }
    } else {
      setIsSearching(false);
    }
  }, [isTyping]);

  useGSAP(() => {
    gsap.from(".chat-header", { opacity: 0, y: -20, duration: 0.8, ease: "power3.out" });
    gsap.from(".chat-body",   { opacity: 0, scale: 0.98, duration: 0.6, delay: 0.2, ease: "power3.out" });
  }, { scope: containerRef });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleStart = useCallback(() => {
    setStarted(true);
    activateChat();
    sendChatMessage("hola");
  }, [activateChat, sendChatMessage]);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text || isTyping) return;
    setInputText("");
    sendChatMessage(text);
  }, [inputText, isTyping, sendChatMessage]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div ref={containerRef} className="space-y-4">

      {/* ── Header ── */}
      <div className="chat-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white uppercase tracking-widest">NOVA</h2>
              <EngineTag engine={engine} />
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${started ? "bg-green-400 animate-pulse" : "bg-white/30"}`} />
              <p className="text-[9px] text-white/40 uppercase tracking-wider">
                {started ? "Activa · thespaceshop.com · Datos reales" : "Asistente Financiero · The Space Shop KSC"}
              </p>
            </div>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={() => { clearChat(); setStarted(false); }}
            className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 border border-white/10 hover:bg-white/8 transition-all"
          >
            Nueva sesión
          </button>
        )}
      </div>

      {/* ── Chat Body ── */}
      <div className="chat-body rounded-2xl border border-white/10 bg-black/40 overflow-hidden flex flex-col"
           style={{ height: "540px" }}>

        {!started ? (
          <StartScreen onStart={handleStart} engine={engine} />
        ) : (
          <>
            {/* Mensajes */}
            <div className="flex-grow overflow-y-auto custom-scrollbar p-5 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-white/25 text-[11px] py-8">
                  Conectando con NOVA…
                </div>
              )}
              {messages.map((msg, i) => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  isNew={i === messages.length - 1}
                />
              ))}
              {isTyping && <TypingIndicator isSearching={isSearching} />}
              <div ref={messagesEndRef} />
            </div>

            {lastError && (
              <div className="px-4 py-2 bg-red-950/40 border-t border-red-500/20 text-[10px] text-red-400">
                ⚠️ {lastError}
              </div>
            )}

            {/* Preguntas sugeridas */}
            {messages.length <= 2 && !isTyping && (
              <div className="px-4 py-3 border-t border-white/8 flex flex-wrap gap-2">
                {suggestedQuestions.slice(0, 3).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => !isTyping && sendChatMessage(q)}
                    className="text-[9px] font-bold text-amber-400/80 border border-amber-500/25 rounded-full px-3 py-1 hover:bg-amber-500/15 transition-all uppercase tracking-wider"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-4 border-t border-white/8 flex gap-3">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
                placeholder={isSearching ? "Buscando en internet…" : "Escribe lo que quieras preguntar…"}
                rows={1}
                className="flex-grow bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-[12px] text-white/90 placeholder:text-white/25 resize-none focus:outline-none focus:border-amber-500/50 focus:bg-white/8 transition-all"
                style={{ maxHeight: "80px" }}
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || isTyping}
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
                  bg-gradient-to-br from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500
                  disabled:opacity-30 disabled:cursor-not-allowed
                  shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all"
              >
                <span className="text-white text-base">↑</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Preguntas adicionales */}
      {started && messages.length > 2 && (
        <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
          <p className="text-[9px] text-white/30 uppercase tracking-widest mb-3">Preguntas sugeridas</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => !isTyping && sendChatMessage(q)}
                disabled={isTyping}
                className="text-[9px] font-bold text-white/50 border border-white/12 rounded-full px-3 py-1.5 hover:bg-white/8 hover:text-white/80 transition-all disabled:opacity-40 uppercase tracking-wider"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
