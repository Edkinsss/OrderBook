// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import WelcomePage from "./pages/WelcomePage";
import TablesPage from "./pages/TablesPage";
import MenuPage from "./pages/MenuPage";
import ActiveOrdersPage from "./pages/ActiveOrdersPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        
        {/* Главная рабочая страница после входа — карта столов */}
        <Route path="/tables" element={<TablesPage />} />
        <Route path="/dashboard" element={<TablesPage />} /> {/* ← дублируем для совместимости */}

        {/* Страница меню для выбранного стола */}
        <Route path="/table/:id" element={<MenuPage />} />
        
        {/* Страница активных заказов */}
        <Route path="/active-orders" element={<ActiveOrdersPage />} />
        
        <Route path="*" element={<div className="page">404 — Страница не найдена</div>} />
      </Routes>
    </Router>
  );
}