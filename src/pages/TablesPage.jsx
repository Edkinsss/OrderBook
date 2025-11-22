// src/pages/TablesPage.jsx — ЧИСТАЯ КРАСОТА, С РАБОЧИМ ВРЕМЕНЕМ
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { USERS } from "../data/users";

const TABLES = [
  // Барная стойка слева
  { id: "O1", top: "18%", left: "12%", type: "rect", rotation: 90 },
  { id: "O2", top: "35%", left: "12%", type: "rect", rotation: 90 },
  { id: "O3", top: "52%", left: "12%", type: "rect", rotation: 90 },
  // Основной зал
  { id: "O4", top: "22%", left: "32%", type: "round" },
  { id: "O5", top: "20%", left: "48%", type: "square" },
  { id: "O6", top: "25%", left: "65%", type: "round" },
  { id: "O7", top: "38%", left: "38%", type: "rect" },
  { id: "O8", top: "40%", left: "55%", type: "round" },
  { id: "O9", top: "42%", left: "75%", type: "square" },
  { id: "O10", top: "55%", left: "30%", type: "round" },
  { id: "O11", top: "58%", left: "48%", type: "rect" },
  { id: "O12", top: "60%", left: "68%", type: "round" },
  // VIP-зона / диваны
  { id: "O13", top: "72%", left: "35%", type: "sofa", rotation: 0 },
  { id: "O14", top: "75%", left: "55%", type: "round" },
  { id: "O15", top: "73%", left: "75%", type: "sofa", rotation: 180 },
  // Кухня / выдача справа
  { id: "O16", top: "25%", left: "88%", type: "counter", label: "Выдача" },
  { id: "O17", top: "45%", left: "88%", type: "counter", label: "Кухня" },
];

export default function TablesPage() {
  const navigate = useNavigate();
  const [selectedTable, setSelectedTable] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  const userId = localStorage.getItem("userId");
  const currentUser = userId && USERS[userId] ? USERS[userId] : { name: "Гость", role: "Официант" };
  const userName = currentUser.name;
  const userRole = currentUser.role;

  // ВСЁ ВРЕМЯ — ВЕРНУЛ КАК БЫЛО, КРАСИВО И РАБОЧЕ
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);

      // Формат даты: Пн, 22 ноя · 14:21 МСК
      const options = { weekday: "short", day: "numeric", month: "short" };
      const dateStr = now.toLocaleDateString("ru-RU", options);

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
    setShowModal(false);
    navigate(`/table/${selectedTable}`);
  };

  return (
    <div className="tables-page">
      {/* ШАПКА — ВСЁ РАБОТАЕТ */}
      <header className="tables-header-v2">
        <h1 className="logo">OrderBook</h1>

        <div className="shift-timer">
          <div className="timer-label">До конца смены</div>
          <div className="timer-value">{timeLeft}</div>
        </div>

        <div className="header-right">
          {/* Колокольчик */}
          <div className="notif-wrapper">
            <button className="notif-bell" onClick={() => setShowNotifs(!showNotifs)}>
              Bell {notifications.length > 0 && <span className="notif-badge">{notifications.length}</span>}
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

          <div className="user-info">
            <div className="user-name">{userName}</div>
            <div className="user-role">{userRole}</div>
            <div className="user-time">
              {new Date().toLocaleDateString("ru-RU", { weekday: "short", day: "numeric", month: "short" })} · {currentTime} МСК
            </div>
          </div>
        </div>
      </header>

      {/* КАРТА ЗАЛА — КРАСИВАЯ, ЧИСТАЯ */}
      <div className="tables-map">
        <div className="hall-bg">
          {TABLES.map((table) => (
            <button
              key={table.id}
              className={`table-btn ${table.type}`}
              style={{
                top: table.top,
                left: table.left,
                transform: `translate(-50%, -50%) rotate(${table.rotation || 0}deg)`
              }}
              onClick={() => table.type !== "counter" && handleTableClick(table.id)}
            >
              {table.label || table.id}
            </button>
          ))}
        </div>
      </div>

      {/* МОДАЛКА */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Подтверждение</h2>
            <p>
              {userName}, вы выбрали стол № <strong className="highlight-table">{selectedTable}</strong>
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