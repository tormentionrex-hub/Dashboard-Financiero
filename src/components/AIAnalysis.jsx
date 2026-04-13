export default function AIAnalysis({ analisis, cargando, error, onGenerar }) {
  return (
    <div className="ai-analysis">
      <div className="ai-header">
        <h2>Análisis Ejecutivo con IA</h2>
        <button onClick={onGenerar} disabled={cargando} className="btn-analizar">
          {cargando ? "⏳ Analizando..." : "✨ Generar Análisis"}
        </button>
      </div>

      {error && (
        <p className="error-msg">⚠️ {error}</p>
      )}

      {analisis && (
        <pre className="analisis-texto">{analisis}</pre>
      )}

      {!analisis && !cargando && !error && (
        <p className="placeholder-msg">
          Presiona el botón para generar el análisis ejecutivo con IA.
        </p>
      )}
    </div>
  );
}
