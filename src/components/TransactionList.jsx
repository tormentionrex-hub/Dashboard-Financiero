const COLORES_TIPO = {
  ingreso:   "#4CAF50",
  gasto:     "#f44336",
  inversión: "#2196F3",
  otro:      "#9E9E9E",
};

export default function TransactionList({ transacciones }) {
  return (
    <div className="transaction-list">
      <h2>Transacciones Clasificadas</h2>
      <table>
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Monto</th>
            <th>Categoría</th>
          </tr>
        </thead>
        <tbody>
          {transacciones.map(t => (
            <tr key={t.id}>
              <td>{t.descripcion}</td>
              <td style={{ color: t.monto > 0 ? "#4CAF50" : "#f44336", fontWeight: "bold" }}>
                {t.monto > 0 ? "+" : ""}${Math.abs(t.monto).toLocaleString()}
              </td>
              <td>
                <span
                  className="badge"
                  style={{ backgroundColor: COLORES_TIPO[t.tipo] }}
                >
                  {t.tipo}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
