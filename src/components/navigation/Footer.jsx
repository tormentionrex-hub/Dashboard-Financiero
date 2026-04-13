import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-12 px-8 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-800/50 mt-16">
      <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-7xl mx-auto gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <span className="font-bold text-slate-900 dark:text-slate-100 text-xl">AIFinance</span>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-inter uppercase tracking-wide">© 2024 AIFinance. Todos los derechos reservados.</p>
        </div>
        <div className="flex gap-8">
          <a className="text-slate-500 dark:text-slate-400 font-inter text-xs tracking-wide uppercase hover:underline opacity-80" href="#">Política de Privacidad</a>
          <a className="text-slate-500 dark:text-slate-400 font-inter text-xs tracking-wide uppercase hover:underline opacity-80" href="#">Términos de Servicio</a>
          <a className="text-slate-500 dark:text-slate-400 font-inter text-xs tracking-wide uppercase hover:underline opacity-80" href="#">Docs API</a>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-200/50 flex items-center justify-center text-slate-600 hover:scale-110 transition-all cursor-pointer">
            <span className="material-symbols-outlined text-lg">public</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200/50 flex items-center justify-center text-slate-600 hover:scale-110 transition-all cursor-pointer">
            <span className="material-symbols-outlined text-lg">chat</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
