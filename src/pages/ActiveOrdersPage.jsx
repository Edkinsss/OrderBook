// src/pages/ActiveOrdersPage.jsx — СТРАНИЦА АКТИВНЫХ ЗАКАЗОВ
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { USERS } from "../data/users";

export default function ActiveOrdersPage() {
  const navigate = useNavigate();
  const [activeOrders, setActiveOrders] = useState([]);
  const [timeLeft, setTimeLeft] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  const userId = localStorage.getItem("userId");
  const currentUser = userId && USERS[userId] ? USERS[userId] : { name: "Артём", role: "Официант" };
  const userName = currentUser.name;
  const userRole = currentUser.role;

  // Загрузка активных заказов из localStorage
  useEffect(() => {
    const loadOrders = () => {
      const orders = JSON.parse(localStorage.getItem("activeOrders") || "[]");
      setActiveOrders(orders);
    };
    loadOrders();
    
    // Обновляем каждые 2 секунды для синхронизации
    const interval = setInterval(loadOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  // Обновление времени и таймера
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);

      const options = { weekday: "short", day: "numeric", month: "short" };
      const dateStr = now.toLocaleDateString("ru-RU", options);
      setCurrentDate(dateStr);

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
    };

    const timer = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(timer);
  }, []);

  // Переход к меню стола для добавления блюд
  const handleAddDish = (tableId) => {
    navigate(`/table/${tableId}`);
  };

  return (
    <div className="active-orders-page">
      {/* ШАПКА */}
      <header className="tables-header-v2">
        <h1 className="logo">OrderBook</h1>

        <div className="shift-timer">
          <div className="timer-label">До конца смены</div>
          <div className="timer-value">{timeLeft}</div>
        </div>

        <div className="header-right">
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

          <nav className="header-nav">
            <button className="nav-btn" onClick={() => navigate("/tables")}>Столы</button>
            <button className="nav-btn active">Рабочие столы</button>
            <button className="nav-btn">Расчет</button>
          </nav>

          <div className="user-info">
            <div className="user-name">{userName}</div>
            <div className="user-role">{userRole}</div>
            <div className="user-time">
              {currentDate} · {currentTime} МСК
            </div>
          </div>
        </div>
      </header>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <div className="active-orders-content">
        <div className="active-orders-header">
          <h2 className="active-orders-title">Рабочие столы</h2>
        </div>

        {activeOrders.length === 0 ? (
          <div className="empty-orders-state">
            <p>Нет активных заказов</p>
            <button 
              className="btn-go-to-tables"
              onClick={() => navigate("/tables")}
            >
              Перейти к столам
            </button>
          </div>
        ) : (
          <div className="orders-grid">
            {activeOrders.map((order) => (
              <div key={order.tableId} className="order-card">
                <div className="order-card-header">
                  <h3 className="order-card-table">Стол № {order.tableId}</h3>
                </div>
                
                <div className="order-card-items">
                  <h4 className="order-card-items-title">Блюда:</h4>
                  <div className="order-items-list">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item-row">
                        <span className="order-item-name">{item.name}</span>
                        <span className="order-item-details">
                          {item.quantity} × {item.price} ₽ = {(item.quantity * item.price).toFixed(2)} ₽
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-card-footer">
                  <div className="order-card-total">
                    <strong>Итого: {order.total.toFixed(2)} ₽</strong>
                  </div>
                  <button 
                    className="btn-add-dish"
                    onClick={() => handleAddDish(order.tableId)}
                  >
                    Добавить блюдо
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

