// src/pages/TablesPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { USERS } from "../data/users.js"; // ← подключаем твоих пользователей

const TABLES = [
  { id: "O1", top: "15%", left: "10%" },
  { id: "O2", top: "15%", left: "30%" },
  { id: "O3", top: "15%", left: "50%" },
  { id: "O4", top: "15%", left: "70%" },
  { id: "O5", top: "15%", left: "90%" },
  { id: "O6", top: "35%", left: "10%" },
  { id: "O7", top: "35%", left: "30%" },
  { id: "O8", top: "35%", left: "50%" },
  { id: "O9", top: "35%", left: "70%" },
  { id: "O10", top: "35%", left: "90%" },
  { id: "O11", top: "55%", left: "10%" },
  { id: "O12", top: "55%", left: "30%" },
  { id: "O13", top: "55%", left: "50%" },
  { id: "O14", top: "55%", left: "70%" },
  { id: "O15", top: "55%", left: "90%" },
  { id: "O16", top: "75%", left: "10%" },
  { id: "O17", top: "75%", left: "30%" },
  { id: "O18", top: "75%", left: "50%" },
  { id: "O19", top: "75%", left: "70%" },
  { id: "O20", top: "75%", left: "90%" },
];

export default function TablesPage() {
  const navigate = useNavigate();
  const [selectedTable, setSelectedTable] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  // Получаем текущего пользователя из localStorage (по userId)
  const userId = localStorage.getItem("userId");
  const currentUser = userId && USERS[userId] ? USERS[userId] : { name: "Гость", role: "Официант" };
  const userName = currentUser.name;
  const userRole = currentUser.role;

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      setCurrentTime(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`);

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
      if (hours === 9 && minutes === 0 && seconds < 3) addNotification("Рабочая смена началась! Удачного дня!");
      if (hours === 21 && minutes === 30 && seconds < 3) addNotification("Осталось 30 минут до конца смены");
      if (hours === 21 && minutes === 55 && seconds < 3) addNotification("Через 5 минут — конец смены!");
    };

    const addNotification = (msg) => {
      if (!notifications.find(n => n.msg === msg)) {
        setNotifications(prev => [{ id: Date.now(), msg }, ...prev]);
      }
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();
    return () => clearInterval(timer);
  }, [notifications]);

  const handleTableClick = (id) => {
    setSelectedTable(id);
    setShowModal(true);
  };

  const confirmTable = () => {
    setShowModal(false);
    navigate(`/table/${selectedTable}`);
  };

  return (
    <div className="tables-page">
      {/* ЛЮКС-ШАПКА — КАК НА ТВОЁМ РИСУНКЕ */}
      <header className="tables-header-v2">
        <h1 className="logo">OrderBook</h1>

        <div className="shift-timer">
          <div className="timer-label">До конца смены</div>
          <div className="timer-value">{timeLeft}</div>
        </div>

        <div className="header-right">
          {/* КОЛОКОЛЬЧИК */}
          <div className="notif-wrapper">
            <button className="notif-bell" onClick={() => setShowNotifs(!showNotifs)}>
              Bell{" "}
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

          <nav className="header-nav">
            <button className="nav-btn active">Столы</button>
            <button className="nav-btn">Расчет</button>
          </nav>

          {/* РЕАЛЬНЫЙ ПОЛЬЗОВАТЕЛЬ ИЗ USERS */}
          <div className="user-info">
            <div className="user-name">{userName}</div>
            <div className="user-role">{userRole}</div>
            <div className="user-time">
              {new Date().toLocaleDateString("ru-RU", { weekday: "short", day: "numeric", month: "short" })} · {currentTime} МСК
            </div>
          </div>
        </div>
      </header>

      {/* Карта столов */}
      <div className="tables-map">
        <div className="hall-bg">
          {TABLES.map((table) => (
            <button
              key={table.id}
              className="table-btn"
              style={{ top: table.top, left: table.left }}
              onClick={() => handleTableClick(table.id)}
            >
              {table.id}
            </button>
          ))}
        </div>
      </div>

      {/* МОДАЛКА — С РЕАЛЬНЫМ ИМЕНЕМ И РОЛЬЮ */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Подтверждение</h2>
            <p>
              {userName}, вы выбрали стол №{" "}
              <strong className="highlight-table">{selectedTable}</strong>
              <br />
              Подтверждаете?
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Отмена
              </button>
              <button className="btn-confirm" onClick={confirmTable}>
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}