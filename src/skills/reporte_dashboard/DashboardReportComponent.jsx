import { useState } from 'react';
import { processExcel } from '../analisis_inventario/logic'; // Reutilizamos el motor de lectura
import { generateHTMLDashboard } from './htmlGenerator';

export default function DashboardReportComponent() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setStatus('Analizando datos para el Dashboard...');
    
    try {
      const data = await processExcel(file);
      setStatus('Construyendo Dashboard Interactivo...');
      generateHTMLDashboard(data);
      setStatus('¡Dashboard HTML descargado con éxito!');
    } catch (error) {
      console.error(error);
      setStatus('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="skill-card dashboard-skill">
      <div className="skill-icon">🌐</div>
      <h3>Skill: Reporte Dashboard HTML</h3>
      <p>Crea un sitio web interactivo con gráficos y tablas a partir de tu tabla de Excel.</p>
      
      <div className="upload-container">
        <label className="custom-file-upload">
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} disabled={loading} />
          {loading ? 'Generando...' : 'Convertir a Web Dashboard'}
        </label>
      </div>
      
      {status && <p className={`status-message ${status.includes('Error') ? 'error' : 'success'}`}>{status}</p>}
    </div>
  );
}
