// ─────────────────────────────────────────────────────────────────────────────
//  CustomerServiceBot — Agente 3: NOVA — Asistente de The Space Shop
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useAgents } from "../../context/AgentsContext";
import { getWelcomeMessage, getSuggestedQuestions } from "../../services/agents/customerAgent";

// ── Burbuja de mensaje ────────────────────────────────────────────────────────
function MessageBubble({ msg, isNew }) {
  const ref = useRef();
  const isUser = msg.role === "user";

  useEffect(() => {
    if (isNew && ref.current) {
      gsap.fromTo(ref.current,
        { opacity: 0, y: 12, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" }
      );
    }
  }, [isNew]);

  // Procesa markdown básico: **bold**, *italic*, bullet points
  const renderText = (text) => {
    return text
      .split("\n")
      .map((line, i) => {
        // Bullet points
        if (line.startsWith("•") || line.startsWith("-")) {
          return (
            <div key={i} className="flex gap-2 mt-1">
              <span className="text-cyan-400 flex-shrink-0">•</span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(line.replace(/^[•\-]\s*/, "")) }} />
            </div>
          );
        }
        // Línea vacía
        if (!line.trim()) return <div key={i} className="h-2" />;
        return <div key={i} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />;
      });
  };

  function formatInline(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-cyan-200">$1</em>');
  }

  return (
    <div ref={ref} className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black ${
        isUser
          ? "bg-indigo-500/30 text-indigo-300 border border-indigo-500/40"
          : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
      }`}>
        {isUser ? "TÚ" : "🚀"}
      </div>

      {/* Burbuja */}
      <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-[12px] leading-relaxed ${
        isUser
          ? "bg-indigo-500/25 border border-indigo-500/30 text-indigo-50/90 rounded-tr-sm"
          : "bg-black/50 border border-white/10 text-white/80 rounded-tl-sm"
      }`}>
        {renderText(msg.text)}
        <div className={`text-[8px] mt-1.5 ${isUser ? "text-indigo-400/50 text-right" : "text-white/25"}`}>
          {new Date(msg.timestamp).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}

// ── Indicador de escritura ─────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex gap-3 items-end">
      <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-sm">
        🚀
      </div>
      <div className="bg-black/50 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
        {[0, 0.15, 0.3].map((delay, i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-bounce"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function CustomerServiceBot() {
  const { state, activateChat, sendChatMessage, clearChat } = useAgents();
  const { status, messages, isTyping, lastError } = state.customer;
  const [inputText, setInputText] = useState("");
  const [started, setStarted] = useState(false);
  const messagesEndRef  = useRef();
  const inputRef        = useRef();
  const containerRef    = useRef();
  const suggestedQuestions = getSuggestedQuestions();

  useGSAP(() => {
    gsap.from(".chat-header", { opacity: 0, y: -20, duration: 0.8, ease: "power3.out" });
    gsap.from(".chat-body",   { opacity: 0, scale: 0.98, duration: 0.6, delay: 0.2, ease: "power3.out" });
  }, { scope: containerRef });

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleStart = useCallback(() => {
    setStarted(true);
    activateChat();
    // Agregar mensaje de bienvenida local
    sendChatMessage("Hola NOVA, acabo de abrir el chat.");
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

  const handleSuggestion = (q) => {
    if (isTyping) return;
    sendChatMessage(q);
  };

  return (
    <div ref={containerRef} className="space-y-4">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="chat-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            🚀
          </div>
          <div>
            <h2 className="text-base font-black text-white uppercase tracking-widest">NOVA</h2>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${started ? "bg-green-400 animate-pulse" : "bg-white/30"}`} />
              <p className="text-[10px] text-white/40 uppercase tracking-wider">
                {started ? "Agente Activo · The Space Shop" : "Asistente de Servicio al Cliente"}
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

      {/* ── Chat Body ─────────────────────────────────────────────────────── */}
      <div className="chat-body rounded-2xl border border-white/10 bg-black/40 overflow-hidden flex flex-col"
           style={{ height: "520px" }}>

        {/* Pantalla de inicio */}
        {!started ? (
          <div className="flex-grow flex flex-col items-center justify-center gap-6 p-8">
            <div className="w-20 h-20 rounded-3xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(6,182,212,0.2)]">
              🚀
            </div>
            <div className="text-center">
              <h3 className="text-lg font-black text-white">NOVA</h3>
              <p className="text-[11px] text-white/40 mt-1">Asistente IA de The Space Shop</p>
              <p className="text-[11px] text-white/60 mt-3 max-w-sm leading-relaxed">
                Precios, disponibilidad, envíos, recomendaciones y datos financieros — todo en tiempo real.
              </p>
            </div>
            <button
              onClick={handleStart}
              className="px-8 py-3 rounded-2xl text-[12px] font-black uppercase tracking-widest bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all"
            >
              Iniciar Conversación ✨
            </button>
          </div>
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
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Error de chat */}
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
                    onClick={() => handleSuggestion(q)}
                    className="text-[9px] font-bold text-cyan-400/80 border border-cyan-500/25 rounded-full px-3 py-1 hover:bg-cyan-500/15 transition-all uppercase tracking-wider"
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
                placeholder="Escribe un mensaje…"
                rows={1}
                className="flex-grow bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-[12px] text-white/90 placeholder:text-white/25 resize-none focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all"
                style={{ maxHeight: "80px" }}
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || isTyping}
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
                  bg-gradient-to-br from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500
                  disabled:opacity-30 disabled:cursor-not-allowed
                  shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
              >
                <span className="text-white text-base">↑</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Sugerencias adicionales (fuera del chat) ─────────────────────── */}
      {started && messages.length > 2 && (
        <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
          <p className="text-[9px] text-white/30 uppercase tracking-widest mb-3">Preguntas frecuentes</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSuggestion(q)}
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
