import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        {/* Aquí se pueden añadir más rutas en el futuro */}
      </Routes>
    </Router>
  );
}
