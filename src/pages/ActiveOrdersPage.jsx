// src/pages/ActiveOrdersPage.jsx — РАБОЧИЕ СТОЛЫ (ГОРИЗОНТАЛЬНЫЙ СКРОЛЛ)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { USERS } from "../data/users";

export default function ActiveOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = () => {
      try {
        const currentWaiterId = localStorage.getItem("userId");
        if (!currentWaiterId) {
          setOrders([]);
          return;
        }

        const saved = localStorage.getItem("activeOrders");
        if (saved) {
          const parsed = JSON.parse(saved);
          // Фильтруем заказы только текущего официанта
          const waiterOrders = parsed.filter(order => order.waiterId === currentWaiterId);
          
          // Подсчитываем total, если его нет, и добавляем имя официанта
          const fixed = waiterOrders.map(order => {
            const waiter = USERS[order.waiterId] || { name: "Неизвестно", role: "Официант" };
            return {
              ...order,
              waiterName: waiter.name,
              total: order.total || order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
              createdAt: order.createdAt || new Date().toISOString()
            };
          });
          setOrders(fixed);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Ошибка загрузки заказов:", err);
        setOrders([]);
      }
    };
    
    loadOrders();
    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (iso) => {
    const date = new Date(iso);
    return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  };

  const goToTable = (tableId) => {
    navigate(`/table/${tableId}`);
  };

  const goToCheckout = (tableId) => {
    navigate(`/checkout/${tableId}`);
  };

  if (orders.length === 0) {
    return (
      <div className="active-orders-fullscreen">
        <header className="active-header-lux">
          <div className="active-logo">OrderBook</div>
          <h1 className="active-page-title">Рабочие столы</h1>
        </header>
        <div className="active-empty-center">
          <h2>Активных столов нет</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="active-orders-fullscreen">
      {/* ШАПКА — ФИКСИРОВАННАЯ, ТЁМНО-КОРИЧНЕВАЯ */}
      <header className="active-header-lux">
        <div className="active-logo">OrderBook</div>
        <h1 className="active-page-title">Рабочие столы</h1>
      </header>

      {/* ГОРИЗОНТАЛЬНАЯ ПОЛОСА СТОЛОВ — СКРОЛЛ ВЛЕВО-ВПРАВО */}
      <div className="tables-horizontal-scroll">
        {orders.map((order) => (
          <div key={order.tableId} className="table-card-horizontal">
            {/* ВЕРХНЯЯ ЧАСТЬ КАРТОЧКИ */}
            <div className="table-card-header">
              <div className="table-number-large">Стол № {order.tableId}</div>
              <div className="table-meta">
                <div className="waiter-name">{order.waiterName}</div>
                <div className="order-time">{formatTime(order.createdAt)}</div>
              </div>
            </div>

            {/* СПИСОК БЛЮД (ПРОКРУЧИВАЕМЫЙ) */}
            <div className="table-dishes-list">
              {order.items.map((item, i) => (
                <div key={i} className="dish-item">
                  <span className="dish-name">{item.name}</span>
                  <span className="dish-quantity-price">
                    {item.quantity} × {item.price} ₽
                  </span>
                </div>
              ))}
            </div>

            {/* НИЖНЯЯ ЧАСТЬ — ИТОГ И КНОПКИ */}
            <div className="table-card-footer">
              <div className="table-total">
                <span className="total-label">Итого:</span>
                <span className="total-amount">{order.total.toFixed(2)} ₽</span>
              </div>
              <div className="table-card-buttons">
                <button
                  className="edit-order-btn"
                  onClick={() => goToTable(order.tableId)}
                >
                  Редактировать заказ
                </button>
                <button
                  className="precheck-btn"
                  onClick={() => goToCheckout(order.tableId)}
                >
                  Предчек
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
