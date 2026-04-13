import { useState } from 'react';
import { processExcel } from './logic';
import { generateWordReport } from './wordGenerator';

export default function InventoryComponent() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setStatus('Procesando Excel...');
    
    try {
      const data = await processExcel(file);
      setStatus('Generando Documento Word...');
      await generateWordReport(data);
      setStatus('¡Reporte generado con éxito!');
    } catch (error) {
      console.error(error);
      setStatus('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="skill-card inventory-skill">
      <div className="skill-icon">📊</div>
      <h3>Skill: Análisis de Inventario</h3>
      <p>Transforma tus tablas de Excel en reportes profesionales de Word al instante.</p>
      
      <div className="upload-container">
        <label className="custom-file-upload">
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} disabled={loading} />
          {loading ? 'Procesando...' : 'Seleccionar Excel'}
        </label>
      </div>
      
      {status && <p className={`status-message ${status.includes('Error') ? 'error' : 'success'}`}>{status}</p>}
    </div>
  );
}
