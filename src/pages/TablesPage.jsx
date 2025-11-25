// src/pages/TablesPage.jsx — ПРЕМИАЛЬНАЯ КАРТА СТОЛОВ
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { USERS } from "../data/users";

// Планировка зала — 12 столов, красиво расположенных (3 ряда по 4 стола, идеально центрированы)
const TABLES = [
  // Верхний ряд (идеально центрирован в контейнере)
  { id: "O1", top: "25%", left: "5%", type: "round", capacity: 2 },
  { id: "O2", top: "25%", left: "27%", type: "square", capacity: 4 },
  { id: "O3", top: "25%", left: "49%", type: "rect", capacity: 6 },
  { id: "O4", top: "25%", left: "71%", type: "oval", capacity: 4 },
  
  // Средний ряд (идеально центрирован в контейнере)
  { id: "O5", top: "50%", left: "5%", type: "square", capacity: 4 },
  { id: "O6", top: "50%", left: "27%", type: "vip", capacity: 6 },
  { id: "O7", top: "50%", left: "49%", type: "round", capacity: 2 },
  { id: "O8", top: "50%", left: "71%", type: "rect", capacity: 6 },
  
  // Нижний ряд (идеально центрирован в контейнере)
  { id: "O9", top: "75%", left: "5%", type: "oval", capacity: 5 },
  { id: "O10", top: "75%", left: "27%", type: "square", capacity: 4 },
  { id: "O11", top: "75%", left: "49%", type: "round", capacity: 2 },
  { id: "O12", top: "75%", left: "71%", type: "vip", capacity: 6 },
];

// Легенда столов
const TABLE_LEGEND = [
  { 
    type: "round", 
    name: "Круглый стол", 
    description: "Рассчитан на 2 персоны",
    // icon: "⭕"
  },
  { 
    type: "square", 
    name: "Квадратный стол", 
    description: "Рассчитан на 4 персоны",
    // icon: "⬜"
  },
  { 
    type: "rect", 
    name: "Прямоугольный длинный стол", 
    description: "Рассчитан на 6 персон",
    // icon: "▭"
  },
  { 
    type: "oval", 
    name: "Овальный стол", 
    description: "Рассчитан на 4–5 персон",
    // icon: "⬯"
  },
  { 
    type: "vip", 
    name: "VIP-стол", 
    description: "Рассчитан на 6 персон",
    // icon: "⬡"
  },
];

export default function TablesPage() {
  const navigate = useNavigate();
  const [selectedTable, setSelectedTable] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  const userId = localStorage.getItem("userId");
  const currentUser = userId && USERS[userId] ? USERS[userId] : { name: "Артём", role: "Официант" };
  const userName = currentUser.name;
  const userRole = currentUser.role;

  // Обновление времени и таймера
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);

      // Формат даты: Пн, 22 ноя · 14:21 МСК
      const options = { weekday: "short", day: "numeric", month: "short" };
      const dateStr = now.toLocaleDateString("ru-RU", options);
      setCurrentDate(dateStr);

      // Таймер до конца смены (22:00)
      if (hours >= 9 && hours < 22) {
        const end = new Date();
        end.setHours(22, 0, 0, 0);
        const diff = end - now;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        setTimeLeft(`${h} ч ${m.toString().padStart(2, "0")} мин`);
      } else if (hours < 9) {
        setTimeLeft("Смена начнётся в 9:00");
      } else {
        setTimeLeft("Смена завершена");
      }

      // Уведомления
      if (hours === 9 && minutes === "00" && now.getSeconds() < 3) {
        addNotification("Рабочая смена началась!");
      }
      if (hours === 21 && minutes === "30" && now.getSeconds() < 3) {
        addNotification("Осталось 30 минут до конца смены");
      }
      if (hours === 21 && minutes === "55" && now.getSeconds() < 3) {
        addNotification("Через 5 минут — конец смены!");
      }
    };

    const addNotification = (msg) => {
      if (!notifications.find(n => n.msg === msg)) {
        setNotifications(prev => [{ id: Date.now(), msg }, ...prev]);
      }
    };

    const timer = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(timer);
  }, [notifications]);

  const handleTableClick = (id) => {
    setSelectedTable(id);
    setShowModal(true);
  };

  const confirmTable = () => {
    if (selectedTable) {
      setShowModal(false);
      navigate(`/table/${selectedTable}`);
    }
  };

  return (
    <div className="tables-page">
      {/* ШАПКА */}
      <header className="tables-header-v2">
        <h1 className="logo">OrderBook</h1>

        <div className="shift-timer">
          <div className="timer-label">До конца смены</div>
          <div className="timer-value">{timeLeft}</div>
        </div>

        <div className="header-right">
          {/* Колокольчик уведомлений */}
          <div className="notif-wrapper">
            <button className="notif-bell" onClick={() => setShowNotifs(!showNotifs)}>
              Уведомления
              {notifications.length > 0 && <span className="notif-badge">{notifications.length}</span>}
            </button>
            {showNotifs && notifications.length > 0 && (
              <div className="notif-dropdown">
                {notifications.map(n => (
                  <div key={n.id} className="notif-item">{n.msg}</div>
                ))}
              </div>
            )}
          </div>

          {/* Навигация */}
          <nav className="header-nav">
            <button className="nav-btn active">Столы</button>
            <button className="nav-btn">Расчет</button>
          </nav>

          {/* Информация о пользователе */}
          <div className="user-info">
            <div className="user-name">{userName}</div>
            <div className="user-role">{userRole}</div>
            <div className="user-time">
              {currentDate} · {currentTime} МСК
            </div>
          </div>
        </div>
      </header>

      {/* ОСНОВНОЙ КОНТЕНТ — ДВА БЛОКА 50/50 */}
      <div className="tables-content">
        {/* ЛЕВАЯ ПОЛОВИНА — КАРТА ЗАЛА */}
        <div className="hall-section">
          <div className="hall-bg">
            <div className="tables-container">
              {TABLES.map((table) => (
                <button
                  key={table.id}
                  className={`table-btn ${table.type}`}
                  style={{
                    top: table.top,
                    left: table.left,
                  }}
                  onClick={() => handleTableClick(table.id)}
                >
                  <span className="table-number">{table.id}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ПРАВАЯ ПОЛОВИНА — ЛЕГЕНДА СТОЛОВ */}
        <div className="legend-section">
          <div className="legend-content">
            <h2 className="legend-title">Обозначения столов</h2>
            
            <div className="legend-cards">
              {TABLE_LEGEND.map((item) => (
                <div key={item.type} className="legend-card">
                  <div className={`legend-icon ${item.type}`}>
                    <span className="legend-emoji">{item.icon}</span>
                  </div>
                  <div className="legend-info">
                    <strong className="legend-name">{item.name}</strong>
                    <p className="legend-description">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* МОДАЛЬНОЕ ОКНО */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Подтверждение</h2>
            <p>
              {userName}, вы выбрали стол № <strong className="highlight-table">{selectedTable}</strong>.
              <br />Подтверждаете?
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Отмена</button>
              <button className="btn-confirm" onClick={confirmTable}>Подтвердить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
