// src/pages/WelcomePage.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { USERS } from "../data/users";
import { DAILY_QUOTES } from "../data/quotes";
import { YESTERDAY_STATS } from "../data/stats";

// Иконки ролей (используем Unicode-символы, чтобы не тянуть библиотеку)
const ROLE_ICONS = {
  "Официант": "🍽️",
  "Администратор": "🔑",
  "Хозяин": "👑",
};

export default function WelcomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [quote] = useState(() => {
    return DAILY_QUOTES[Math.floor(Math.random() * DAILY_QUOTES.length)];
  });
  const [avatarLoaded, setAvatarLoaded] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem("userId");
    if (savedId && USERS[savedId]) {
      setUser({ id: savedId, ...USERS[savedId] });
    } else {
      navigate("/");
    }
  }, [navigate]);

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
      <div className="role-icon-bg">{ROLE_ICONS[user.role]}</div>

      <div className="welcome-card">
        {/* Фото с анимацией появления */}
        <div className={`avatar-wrapper ${avatarLoaded ? "avatar-visible" : ""}`}>
          <img
            src={`/avatars/${user.id}.jpg`}
            alt={user.name}
            className="avatar"
            onLoad={() => setAvatarLoaded(true)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/avatars/default.jpg";
              setAvatarLoaded(true);
            }}
          />
        </div>

        {/* Приветствие с ролью и именем */}
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

        {/* Цитата дня - курсивом, бежевый цвет */}
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

        {/* Статистика только если вчера работал */}
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