import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function RevenueChart({ datos }) {
  return (
    <div className="chart-container">
      <h2>Ingresos vs Costos vs Gastos</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={datos} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="mes" />
          <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Legend />
          <Bar dataKey="ingresos" fill="#4CAF50" name="Ingresos" radius={[4, 4, 0, 0]} />
          <Bar dataKey="costos"   fill="#f44336" name="Costos"   radius={[4, 4, 0, 0]} />
          <Bar dataKey="gastos"   fill="#FF9800" name="Gastos"   radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
