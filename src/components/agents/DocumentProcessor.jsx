// ─────────────────────────────────────────────────────────────────────────────
//  DocumentProcessor — Agente 2: Procesamiento de documentos con IA
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useAgents } from "../../context/AgentsContext";

const SUPPORTED_TYPES = [".xlsx", ".xls", ".csv", ".txt", ".json"];
const MAX_MB = 10;

function formatBytes(bytes) {
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1048576)    return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function formatDate(d) {
  return new Date(d).toLocaleString("es", { dateStyle: "short", timeStyle: "short" });
}

// ── Zona de Drop ──────────────────────────────────────────────────────────────
function DropZone({ onFile, disabled }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const handleFile = useCallback((file) => {
    if (!file) return;
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!SUPPORTED_TYPES.includes(ext)) {
      alert(`Formato no soportado. Use: ${SUPPORTED_TYPES.join(", ")}`);
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      alert(`El archivo supera los ${MAX_MB} MB.`);
      return;
    }
    onFile(file);
  }, [onFile]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const onInputChange = (e) => handleFile(e.target.files[0]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`relative flex flex-col items-center justify-center gap-4 h-52 rounded-2xl border-2 border-dashed transition-all cursor-pointer
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-cyan-500/60 hover:bg-cyan-500/5"}
        ${dragOver ? "border-cyan-400 bg-cyan-500/10 scale-[1.01]" : "border-white/20 bg-black/20"}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={SUPPORTED_TYPES.join(",")}
        className="hidden"
        onChange={onInputChange}
        disabled={disabled}
      />
      <span className="text-5xl">{dragOver ? "📂" : "📁"}</span>
      <div className="text-center">
        <p className="text-[13px] font-bold text-white/80">
          {dragOver ? "Suelta el archivo aquí" : "Arrastra un archivo o haz clic"}
        </p>
        <p className="text-[10px] text-white/35 mt-1 uppercase tracking-wider">
          {SUPPORTED_TYPES.join("  ·  ")} · máx {MAX_MB} MB
        </p>
      </div>
    </div>
  );
}

// ── Barra de progreso ─────────────────────────────────────────────────────────
function ProgressBar({ phase }) {
  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-[11px] font-black text-cyan-300 uppercase tracking-widest">
          Procesando Documento…
        </span>
      </div>
      <p className="text-[12px] text-cyan-100/60 animate-pulse">{phase}</p>
      <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 animate-[progress_2s_ease-in-out_infinite]" style={{ width: "60%" }} />
      </div>
    </div>
  );
}

// ── Resultado del análisis ────────────────────────────────────────────────────
function AnalysisResult({ result }) {
  const [expanded, setExpanded] = useState(true);

  const FILE_ICONS = { Excel: "📊", CSV: "📋", Texto: "📄", JSON: "🔧" };
  const icon = FILE_ICONS[result.fileType] || "📎";

  return (
    <div className="rounded-2xl border border-green-500/25 bg-green-950/15 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <div className="text-left">
            <p className="text-[11px] font-black text-white/90">{result.fileName}</p>
            <p className="text-[9px] text-white/40 mt-0.5">
              {result.fileType} · {formatBytes(result.fileSize)} · {formatDate(result.processedAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-black text-green-400 uppercase tracking-wider px-2 py-1 rounded-full bg-green-500/15 border border-green-500/30">
            Analizado ✓
          </span>
          <span className="text-white/40 text-sm">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {/* Contenido expandible */}
      {expanded && (
        <div className="px-6 pb-6 border-t border-white/8">
          <div className="mt-4 text-[12px] text-white/75 leading-relaxed whitespace-pre-wrap font-mono bg-black/30 rounded-xl p-5 border border-white/8">
            {result.analysis}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function DocumentProcessor() {
  const { state, processDoc, resetDoc } = useAgents();
  const { status, results, current, progress, lastError } = state.document;
  const containerRef = useRef();
  const isProcessing = status === "PROCESSING";

  useGSAP(() => {
    gsap.from(".doc-header", { opacity: 0, y: -20, duration: 0.8, ease: "power3.out" });
    gsap.from(".doc-drop",   { opacity: 0, scale: 0.97, duration: 0.7, delay: 0.2, ease: "back.out(1.5)" });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="doc-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📂</span>
          <div>
            <h2 className="text-base font-black text-white uppercase tracking-widest">
              Procesador de Documentos
            </h2>
            <p className="text-[10px] text-white/40 uppercase tracking-wider">
              ATLAS · Motor IA Local · Sin dependencia de API
            </p>
          </div>
        </div>

        {results.length > 0 && (
          <button
            onClick={resetDoc}
            className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/50 border border-white/15 hover:bg-white/8 transition-all"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* ── Drop Zone ─────────────────────────────────────────────────────── */}
      <div className="doc-drop">
        <DropZone onFile={processDoc} disabled={isProcessing} />
      </div>

      {/* ── Error ─────────────────────────────────────────────────────────── */}
      {status === "ERROR" && lastError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-950/20 px-5 py-4 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="text-[11px] font-black text-red-400">Error al procesar documento</p>
            <p className="text-[10px] text-red-300/60 mt-0.5">{lastError}</p>
          </div>
          <button onClick={resetDoc} className="ml-auto text-red-400/60 hover:text-red-400 transition-colors text-sm">✕</button>
        </div>
      )}

      {/* ── Progreso ──────────────────────────────────────────────────────── */}
      {isProcessing && <ProgressBar phase={progress} />}

      {/* ── Resultados ────────────────────────────────────────────────────── */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-1">
            <div className="h-px flex-grow bg-white/10" />
            <span className="text-[9px] text-white/30 uppercase tracking-widest">
              {results.length} documento{results.length !== 1 ? "s" : ""} analizado{results.length !== 1 ? "s" : ""}
            </span>
            <div className="h-px flex-grow bg-white/10" />
          </div>
          {results.map((r, i) => (
            <AnalysisResult key={i} result={r} />
          ))}
        </div>
      )}

      {/* ── Estado inicial ────────────────────────────────────────────────── */}
      {results.length === 0 && !isProcessing && status !== "ERROR" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          {[
            { icon: "📊", title: "Excel / CSV",  desc: "Reportes financieros, inventarios, transacciones" },
            { icon: "📄", title: "Texto / JSON", desc: "Logs, configuraciones, datos estructurados" },
            { icon: "🤖", title: "IA Analítica",  desc: "Resumen ejecutivo, KPIs, anomalías y recomendaciones" },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl border border-white/8 bg-white/3 p-5 text-center">
              <span className="text-3xl">{item.icon}</span>
              <p className="text-[11px] font-black text-white/70 mt-2 uppercase tracking-wider">{item.title}</p>
              <p className="text-[9px] text-white/35 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
