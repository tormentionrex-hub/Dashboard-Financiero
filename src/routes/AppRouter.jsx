import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import AgentsPage    from '../pages/AgentsPage';
import MainDashboardPage from '../pages/MainDashboardPage';
import { LanguageProvider } from '../context/LanguageContext';
import { AiProvider } from '../context/AiContext';

export default function AppRouter() {
  return (
    <LanguageProvider>
      <AiProvider>
        <Router>
          <Routes>
            <Route path="/"       element={<DashboardPage />} />
            <Route path="/agents" element={<AgentsPage />}    />
            <Route path="/main-dashboard" element={<MainDashboardPage />} />
          </Routes>
        </Router>
      </AiProvider>
    </LanguageProvider>
  );
}
