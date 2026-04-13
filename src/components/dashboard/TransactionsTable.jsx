import React from 'react';

export default function TransactionsTable() {
  const transactions = [
    { name: 'Suscripción AWS Cloud', category: 'Infraestructura', date: '14 Oct, 2024', status: 'Gasto', amount: '-$1,240.00', icon: 'shopping_cart', type: 'error' },
    { name: 'Pago Factura #892', category: 'Servicios Pro', date: '12 Oct, 2024', status: 'Ingreso', amount: '+$15,600.00', icon: 'payments', type: 'secondary' },
    { name: 'Inversión Semilla Serie A', category: 'Capital de Riesgo', date: '10 Oct, 2024', status: 'Inversión', amount: '-$50,000.00', icon: 'rocket_launch', type: 'primary' }
  ];

  return (
    <section className="bg-white/80 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-white/20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-extrabold text-indigo-950">Transacciones Clasificadas</h2>
        <div className="flex gap-3">
          <button className="p-2 border border-outline-variant/30 rounded-xl hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
          <button className="p-2 border border-outline-variant/30 rounded-xl hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-4 px-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">ID_Transaccion</th>
              <th className="pb-4 px-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Timestamp</th>
              <th className="pb-4 px-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Categoria_Modulo</th>
              <th className="pb-4 px-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Capital_Neto</th>
              <th className="pb-4 px-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Estado_Nucleo</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, idx) => (
              <tr key={idx} className="table-row border-b border-white/5 hover:bg-white/5 transition-all group">
                <td className="py-5 px-4 font-black text-indigo-400 text-xs tracking-tighter">{tx.id}</td>
                <td className="py-5 px-4 text-white/60 text-xs font-bold font-mono">{tx.date}</td>
                <td className="py-5 px-4 text-white text-xs font-bold uppercase tracking-tight">{tx.category}</td>
                <td className="py-5 px-4 text-white font-black text-xs">{tx.amount}</td>
                <td className="py-5 px-4">
                  <span className={`px-3 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest border ${
                    tx.status === 'Ejecutado' 
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' 
                    : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  }`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
