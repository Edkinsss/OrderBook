// src/pages/WelcomePage.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { USERS } from "../data/users";
import { DAILY_QUOTES } from "../data/quotes";
import { YESTERDAY_STATS } from "../data/stats";

// Эмодзи-аватары для каждой роли — чистый люкс
const ROLE_EMOJI = {
  "Официант": "🤵🏻",
  "Администратор": "🧔🏻‍♂️",
  "Хозяин": "👑",
};

export default function WelcomePage() { 
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [quote] = useState(() =>
    DAILY_QUOTES[Math.floor(Math.random() * DAILY_QUOTES.length)]
  );
  const [avatarVisible, setAvatarVisible] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem("userId");
    if (savedId && USERS[savedId]) {
      setUser({ id: savedId, ...USERS[savedId] });
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    // Анимация появления аватара через 300мс
    const timer = setTimeout(() => setAvatarVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!user) return null;

  const today = new Date().toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const yesterday = YESTERDAY_STATS[user.id];

  return (
    <div className="welcome-screen">
      {/* Большая фоновая иконка роли */}
      <div className="role-icon-bg">{ROLE_EMOJI[user.role]}</div>

      <div className="welcome-card">
        {/* ЭМОДЗИ-АВАТАР — ЛЮКС 2025 */}
        <div className={`avatar-wrapper ${avatarVisible ? "avatar-visible" : ""}`}>
          <div className="emoji-avatar">
            <span className="role-emoji">{ROLE_EMOJI[user.role]}</span>
          </div>
        </div>

        {/* Приветствие */}
        <div className="welcome-greeting">
          <h2 className="welcome-subtitle">Приветствую</h2>
          <h1 className="welcome-title">
            <span className="role-text">{user.role}</span>
            <span className="name-text">{user.name}</span>
          </h1>
          <p className="welcome-wish">
            желаю вам хорошего дня и рабочей смены
          </p>
        </div>

        {/* Цитата дня */}
        <p className="daily-quote">"{quote}"</p>

        {/* Дата и смена */}
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Текущая дата</span>
            <strong className="info-value">{today}</strong>
          </div>
          <div className="info-item">
            <span className="info-label">Смена</span>
            <strong className="info-value">9:00 – 22:00</strong>
          </div>
        </div>

        {/* Статистика за вчера (если была) */}
        {yesterday && (
          <div className="stats-card">
            <h4 className="stats-title">Вчера вы обслужили:</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{yesterday.tables}</span>
                <span className="stat-label">столов</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {yesterday.revenue.toLocaleString("ru-RU")} ₽
                </span>
                <span className="stat-label">выручка</span>
              </div>
            </div>
          </div>
        )}

        <button
          className="start-shift-btn"
          onClick={() => navigate("/dashboard")}
        >
          Начать рабочую сессию
        </button>
      </div>
    </div>
  );
}