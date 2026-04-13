import { saveAs } from "file-saver";

/**
 * Genera un archivo HTML interactivo a partir de los datos de Excel.
 * @param {Object} excelData 
 */
export const generateHTMLDashboard = (excelData) => {
  const sheet = excelData.sheets[0]; // Usamos la primera hoja por defecto para el dashboard
  const data = sheet.data;
  
  if (!data || data.length === 0) {
    alert("No hay datos suficientes para generar un dashboard.");
    return;
  }

  const columns = Object.keys(data[0]);
  const numericColumns = columns.filter(col => typeof data[0][col] === 'number');
  const labelsColumn = columns.find(col => typeof data[0][col] === 'string') || columns[0];

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Financiero - ${excelData.fileName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        :root {
            --bg: #0f172a;
            --card: #1e293b;
            --primary: #6366f1;
            --text: #f8fafc;
            --text-dim: #94a3b8;
        }
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); padding: 2rem; }
        .header { margin-bottom: 2rem; border-bottom: 1px solid #334155; padding-bottom: 1rem; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem; }
        .card { background: var(--card); border-radius: 1rem; padding: 1.5rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        h1 { font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--primary); }
        .stats-summary { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
        .stat-badge { background: #334155; padding: 0.5rem 1rem; border-radius: 0.5rem; font-size: 0.875rem; }
        table { width: 100%; border-collapse: collapse; margin-top: 1rem; font-size: 0.875rem; }
        th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #334155; }
        th { color: var(--text-dim); text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Dashboard: ${excelData.fileName}</h1>
        <div class="stats-summary">
            <span class="stat-badge">Hoja: ${sheet.name}</span>
            <span class="stat-badge">Registros: ${data.length}</span>
            <span class="stat-badge">Generado: ${new Date().toLocaleDateString()}</span>
        </div>
    </div>

    <div class="grid">
        <div class="card">
            <h3>Visualización de Datos</h3>
            <canvas id="mainChart"></canvas>
        </div>
        <div class="card">
            <h3>Detalle de Registros</h3>
            <div style="overflow-x: auto; max-height: 400px;">
                <table>
                    <thead>
                        <tr>${columns.map(c => `<th>${c}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
                        ${data.slice(0, 100).map(row => `
                            <tr>${columns.map(c => `<td>${row[c] || ''}</td>`).join('')}</tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script>
        const ctx = document.getElementById('mainChart').getContext('2d');
        const labels = ${JSON.stringify(data.map(r => r[labelsColumn]))};
        const datasets = ${JSON.stringify(numericColumns.slice(0, 2).map((col, idx) => ({
          label: col,
          data: data.map(r => r[col]),
          backgroundColor: idx === 0 ? '#6366f1' : '#10b981',
          borderColor: idx === 0 ? '#6366f1' : '#10b981',
          borderWidth: 1
        })))};

        new Chart(ctx, {
            type: 'bar',
            data: { labels, datasets },
            options: {
                responsive: true,
                plugins: { legend: { labels: { color: '#f8fafc' } } },
                scales: {
                    y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
                    x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }
                }
            }
        });
    </script>
</body>
</html>
  `;

  const blob = new Blob([htmlContent], { type: "text/html" });
  saveAs(blob, `Dashboard_${excelData.fileName.split('.')[0]}.html`);
};
