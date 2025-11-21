// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import WelcomePage from "./pages/WelcomePage";
import TablesPage from "./pages/TablesPage"; // ← Наша новая главная страница со столами

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        
        {/* Главная рабочая страница после входа — карта столов */}
        <Route path="/tables" element={<TablesPage />} />
        <Route path="/dashboard" element={<TablesPage />} /> {/* ← дублируем для совместимости */}

        {/* В будущем здесь будут страницы стола, расчёт, меню и т.д. */}
        <Route path="/table/:id" element={<div className="page">Стол загружается...</div>} />
        <Route path="*" element={<div className="page">404 — Страница не найдена</div>} />
      </Routes>
    </Router>
  );
}