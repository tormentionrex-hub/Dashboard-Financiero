import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react";
import Swal from 'sweetalert2';
import { processExcel } from '../../skills/analisis_inventario/logic';
import { generateWordReport } from '../../skills/analisis_inventario/wordGenerator';
import { analizarInventario } from '../../services/claudeService';

export default function SkillsSection() {
  const container = useRef();
  const fileInputRef = useRef();
  const [excelData, setExcelData] = useState(null);
  const [processing, setProcessing] = useState(false);

  useGSAP(() => {
    const tl = gsap.timeline();
    // Primero animamos los recuadros oscuros
    tl.from(".skill-card", {
      opacity: 0,
      scale: 0.95,
      y: 30,
      stagger: 0.2,
      duration: 1.1,
      ease: "power3.out"
    });

    // Luego animamos el contenido (textos y botones) dentro de los recuadros
    tl.from(".skill-content", {
      opacity: 0,
      x: -20,
      stagger: 0.1,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.2");
  }, { scope: container });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProcessing(true);
    try {
      const data = await processExcel(file);
      setExcelData(data);
      
      const result = await Swal.fire({
        title: 'Documento procesado',
        text: '¿Deseas que el sistema analice el documento y diagrame recomendaciones estratégicas en tu reporte final?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#6366f1',
        cancelButtonColor: '#1e293b',
        confirmButtonText: 'Sí, generar análisis experto',
        cancelButtonText: 'No, solo datos base'
      });

      let summaryText = "";
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Sistema en proceso...',
          text: 'Evaluando patrones y diseñando recomendaciones...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });
        summaryText = await analizarInventario(JSON.stringify(data));
        Swal.close();
      }

      const blob = await generateWordReport(data, summaryText);
      const url = URL.createObjectURL(blob);
      
      // Añadimos un identificador único al nombre del archivo para evitar el error de 
      // "Permisos insuficientes" (que ocurre cuando el archivo anterior está abierto o bloqueado por Windows)
      const dateId = new Date().getTime();
      const filename = `Reporte_${data.fileName.split('.')[0]}_${dateId}.docx`;
      
      Swal.fire({
        title: '¡Análisis Completado!',
        html: `
          <div style="margin-top: 15px;">
            <p style="color: #cbd5e1; margin-bottom: 25px; font-size: 14px;">El documento ha procesado todos los registros con éxito.</p>
            <a href="${url}" download="${filename}" 
               style="background-color: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; box-shadow: 0 0 15px rgba(99,102,241,0.5); font-family: sans-serif;"
               onclick="Swal.close()">
               📥 Descargar Reporte Final
            </a>
          </div>
        `,
        icon: 'success',
        showConfirmButton: false,
        allowOutsideClick: false
      });

    } catch (err) {
      console.error(err);
      Swal.fire('Error', "Hubo un error procesando el archivo: " + err.message, 'error');
    } finally {
      setProcessing(false);
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleVisualizarDashboard = () => {
    if(!excelData) return;
    
    // Generación de un dashboard HTML rápido para la simulación
    const newWindow = window.open("", "_blank");
    if(!newWindow) return;

    let tablesHtml = excelData.sheets.map(sheet => {
      if(!sheet.data.length) return `<p>Hoja vacía: ${sheet.name}</p>`;
      const headers = Object.keys(sheet.data[0]);
      let ths = headers.map(h => `<th style="padding:10px; border-bottom:1px solid #444">${h}</th>`).join("");
      let rows = sheet.data.map(row => 
        `<tr>${headers.map(h => `<td style="padding:10px; border-bottom:1px solid #222">${row[h]||""}</td>`).join("")}</tr>`
      ).join("");
      
      return `
        <h3 style="color:#6366f1; margin-top:30px;">📄 ${sheet.name}</h3>
        <table style="width:100%; border-collapse:collapse; text-align:left; background:#111; border-radius:10px; overflow:hidden;">
          <thead style="background:#222; color:#fff;"><tr>${ths}</tr></thead>
          <tbody style="color:#ccc;">${rows}</tbody>
        </table>
      `;
    }).join("");

    newWindow.document.write(`
      <html>
        <head>
          <title>Dashboard HTML: ${excelData.fileName}</title>
          <style>body { font-family: system-ui, sans-serif; background: #050506; color: white; padding: 40px; }</style>
        </head>
        <body>
          <h1 style="border-bottom: 2px solid #6366f1; padding-bottom:15px;">📊 Dashboard Visual: ${excelData.fileName}</h1>
          <p style="color:#a5b4fc">Vista generada automáticamente a partir del procesador de inventario.</p>
          ${tablesHtml}
          <div style="margin-top:50px; text-align:center; color:#555;">&copy; 2026 AI Finance Orbital Sync</div>
        </body>
      </html>
    `);
    newWindow.document.close();
  };

  return (
    <section ref={container} className="space-y-12">
      <div className="flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Protocolos de Habilidad</h2>
        </div>
        <button className="text-indigo-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:text-white transition-all">
          Acceder Directorio <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Análisis de Inventario */}
        <div className="skill-card cyber-glass p-10 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/30 shadow-xl transition-all group relative overflow-hidden flex flex-col justify-between">
          <div className="skill-content flex gap-8 relative z-10 mb-6">
            <div className="flex-shrink-0 w-28 h-28 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all shadow-[0_0_20px_rgba(99,102,241,0.1)]">
              <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
            </div>
            <div>
              <h4 className="text-2xl font-black text-white mb-3 tracking-tight">Análisis de Inventario</h4>
              <p className="text-sm text-white/40 leading-relaxed font-medium">Motor de predicción autónoma. Carga un archivo DOCX, PDF, Excel o similar compatible para procesarlo y autogenerar tu resumen.</p>
            </div>
          </div>
          <div className="skill-content relative z-10 text-right">
            <input 
              type="file" 
              accept=".xlsx,.xls,.doc,.docx,.pdf,.csv" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
            <button 
              onClick={() => fileInputRef.current.click()}
              disabled={processing}
              className="mt-4 px-6 py-2 rounded-lg bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-400 transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)]"
            >
              {processing ? "Procesando..." : "Subir Documento"}
            </button>
          </div>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity"></div>
        </div>

        {/* Reporte Dashboard HTML */}
        <div className={`skill-card cyber-glass p-10 rounded-[2.5rem] border border-white/5 ${excelData ? 'hover:border-cyan-500/30 opacity-100' : 'opacity-40 grayscale'} shadow-xl transition-all group relative overflow-hidden flex flex-col justify-between`}>
          <div className="skill-content flex gap-8 relative z-10 mb-6">
            <div className="flex-shrink-0 w-28 h-28 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all shadow-[0_0_20px_rgba(6,182,212,0.1)]">
              <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard_customize</span>
            </div>
            <div>
              <h4 className="text-2xl font-black text-white mb-3 tracking-tight">Reporte Dashboard HTML</h4>
              <p className="text-sm text-white/40 leading-relaxed font-medium">
                {excelData 
                  ? "Sincronización activa. Módulo desbloqueado a partir del inventario evaluado."
                  : "Módulo inactivo. Requiere procesamiento del inventario para habilitarse."}
              </p>
            </div>
          </div>
          <div className="skill-content relative z-10 text-right">
            <button 
              disabled={!excelData}
              onClick={handleVisualizarDashboard}
              className={`mt-4 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${excelData ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:bg-cyan-400 cursor-pointer' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
            >
              Visualizar Tablero
            </button>
          </div>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity"></div>
        </div>

      </div>
    </section>
  );
}
