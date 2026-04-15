import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import AgentsPage    from '../pages/AgentsPage';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/"       element={<DashboardPage />} />
        <Route path="/agents" element={<AgentsPage />}    />
      </Routes>
    </Router>
  );
}
