import React, { createContext, useContext, useState } from 'react';

// Diccionario de traducciones
const translations = {
  en: {
    sidebar: {
      salesHouse: 'The Space Shop',
      generalItem: 'Official NASA Store',
      home: 'Home',
      dashboard: 'Dashboard',
      agents: 'AI Agents',
      jerryWilson: 'Mission Control',
    },
    header: {
      hello: 'Welcome Explorer',
      premium: 'AUTHORIZED',
      date: 'April 2026',
      search: 'Search NASA Merch...',
    },
    cards: {
      managerUsa: "Apparel Director",
      managerEurope: "Collectibles Lead",
      managerAsia: "Accessories Manager",
      completedTasks: "out of 5 shipments processed",
      last6Months: "Last 6 months",
    },
    summary: {
      title: 'Global Revenue Summary',
      last9Months: 'Last 9 Months',
      range: 'Aug - Apr',
      revenue: 'Revenue',
      sales: 'orders',
      months: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr']
    },
    countries: {
      title: 'Top Buyers by Country',
      favourites: 'Active Regions',
      checkAll: 'View All',
      c1: 'USA',
      c2: 'UK',
      c3: 'Canada',
      c4: 'Japan',
    },
    segmentation: {
      title: 'Sales by Category',
      allUsers: 'All merchandise',
      details: 'Details',
      c1: 'Apparel',
      c2: 'Collectibles',
      c3: 'Space Toys',
      c4: 'Patches & Pins',
    },
    satisfaction: {
      title: 'Customer Satisfaction',
      fromAll: 'From all online orders',
      basedOnLikes: 'Positive Reviews',
    },
    emptyState: {
      message: 'Please run AI Analysis in Agents section to view this data.',
      button: 'Go to Agents',
    },
    addComponent: {
      noComponents: 'No New Modules',
      createFirst: 'Add a new analytics module',
      clickButton: 'Click below to expand dashboard',
      addBtn: 'Add Module',
    },
    aiAnalysis: {
      badge: '✨ AI Analysis',
      revenueInsight: 'Revenue shows steady growth over the last 3 months, driven by the new space collection.',
      satisfactionInsight: 'Reviews are overwhelmingly positive this season.',
    },
    categoryDetails: {
      title: 'Detailed Category Analysis',
      apparel: { name: 'Apparel', desc: 'Flight jackets and NASA logo tees are the top sellers this quarter.' },
      collectibles: { name: 'Collectibles', desc: 'Commemorative coins and shuttle scale models maintain stable sales.' },
      toys: { name: 'Space Toys', desc: 'Space building sets are highly popular among families.' },
      patches: { name: 'Patches & Pins', desc: 'Highly collectible, frequently bought as add-ons.' },
      close: 'Close'
    },
    top15Countries: {
      title: 'Top 15 Buyer Countries',
      sales: 'Estimated Sales',
      close: 'Close',
      list: [
        { name: 'USA',          amount: '$52,340' },
        { name: 'United Kingdom', amount: '$11,280' },
        { name: 'Canada',       amount: '$8,650' },
        { name: 'Japan',        amount: '$6,190' },
        { name: 'Germany',      amount: '$4,820' },
        { name: 'Australia',    amount: '$3,950' },
        { name: 'France',       amount: '$2,780' },
        { name: 'Italy',        amount: '$1,960' },
        { name: 'Netherlands',  amount: '$1,540' },
        { name: 'South Korea',  amount: '$1,230' },
        { name: 'Brazil',       amount: '$980' },
        { name: 'Mexico',       amount: '$760' },
        { name: 'India',        amount: '$590' },
        { name: 'Sweden',       amount: '$420' },
        { name: 'Spain',        amount: '$310' }
      ]
    }
  },
  es: {
    sidebar: {
      salesHouse: 'The Space Shop',
      generalItem: 'Tienda Oficial de la NASA',
      home: 'Inicio',
      dashboard: 'Panel Principal',
      agents: 'Agentes de IA',
      jerryWilson: 'Control de Misión',
    },
    header: {
      hello: 'Bienvenido Jefe',
      premium: 'AUTORIZADO',
      date: 'Abril 2026',
      search: 'Buscar mercancía NASA...',
    },
    cards: {
      managerUsa: 'Director de Ropa',
      managerEurope: 'Líder de Coleccionables',
      managerAsia: 'Gerente de Accesorios',
      completedTasks: "de 5 envíos procesados",
      last6Months: "Últimos 6 meses",
    },
    summary: {
      title: 'Resumen Global de Ingresos',
      last9Months: 'Últimos 9 Meses',
      range: 'Ago - Abr',
      revenue: 'Ingresos',
      sales: 'pedidos',
      months: ['Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr']
    },
    countries: {
      title: 'Top Compradores por País',
      favourites: 'Regiones Activas',
      checkAll: 'Ver Todos',
      c1: 'EE.UU.',
      c2: 'Reino Unido',
      c3: 'Canadá',
      c4: 'Japón',
    },
    segmentation: {
      title: 'Ventas por Categoría',
      allUsers: 'Toda la mercancía',
      details: 'Detalles',
      c1: 'Ropa',
      c2: 'Coleccionables',
      c3: 'Juguetes',
      c4: 'Parches y Pines',
    },
    satisfaction: {
      title: 'Satisfacción del Cliente',
      fromAll: 'De todos los pedidos online',
      basedOnLikes: 'Reseñas Positivas',
    },
    emptyState: {
      message: 'Por favor, ejecuta el análisis de IA en la sección de Agentes para visualizar estos datos.',
      button: 'Ir a Agentes',
    },
    addComponent: {
      noComponents: 'Sin Módulos Nuevos',
      createFirst: 'Agrega un nuevo módulo de análisis',
      clickButton: 'Haz clic abajo para expandir',
      addBtn: 'Agregar Módulo',
    },
    aiAnalysis: {
      badge: '✨ Análisis de IA',
      revenueInsight: 'Los ingresos muestran un crecimiento constante en los últimos 3 meses, impulsados por la nueva colección espacial.',
      satisfactionInsight: 'Las reseñas son abrumadoramente positivas esta temporada.',
    },
    categoryDetails: {
      title: 'Análisis Detallado por Categoría',
      apparel: { name: 'Ropa', desc: 'Las chaquetas de vuelo y camisetas con logo de la NASA son los artículos más vendidos este trimestre.' },
      collectibles: { name: 'Coleccionables', desc: 'Las monedas conmemorativas y los modelos a escala de transbordadores mantienen ventas estables.' },
      toys: { name: 'Juguetes', desc: 'Los sets de construcción espacial son muy populares entre las familias.' },
      patches: { name: 'Parches y Pines', desc: 'Altamente coleccionables, se compran frecuentemente como complementos.' },
      close: 'Cerrar'
    },
    top15Countries: {
      title: 'Top 15 Países Compradores',
      sales: 'Ventas estimadas',
      close: 'Cerrar',
      list: [
        { name: 'Estados Unidos', amount: '$52,340' },
        { name: 'Reino Unido',    amount: '$11,280' },
        { name: 'Canadá',         amount: '$8,650' },
        { name: 'Japón',          amount: '$6,190' },
        { name: 'Alemania',       amount: '$4,820' },
        { name: 'Australia',      amount: '$3,950' },
        { name: 'Francia',        amount: '$2,780' },
        { name: 'Italia',         amount: '$1,960' },
        { name: 'Países Bajos',   amount: '$1,540' },
        { name: 'Corea del Sur',  amount: '$1,230' },
        { name: 'Brasil',         amount: '$980' },
        { name: 'México',         amount: '$760' },
        { name: 'India',          amount: '$590' },
        { name: 'Suecia',         amount: '$420' },
        { name: 'España',         amount: '$310' }
      ]
    }
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es'); // Español por defecto

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        return key; // Si no encuentra la traducción, devuelve la llave
      }
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage debe usarse dentro de un LanguageProvider');
  }
  return context;
};
