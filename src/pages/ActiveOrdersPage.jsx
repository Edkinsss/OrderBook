// src/pages/ActiveOrdersPage.jsx — РАБОЧИЕ СТОЛЫ (ТОЧНО КАК НА РИСУНКЕ)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
          
          // Подсчитываем total, если его нет
          const fixed = waiterOrders.map(order => ({
            ...order,
            total: order.total || order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            createdAt: order.createdAt || new Date().toISOString()
          }));
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

  if (orders.length === 0) {
    return (
      <div className="active-empty-fullscreen">
        <h2>У вас нет активных столов</h2>
        <p>Все столы свободны или заказы ещё не подтверждены</p>
        <button onClick={() => navigate("/tables")} className="big-btn">
          ← Вернуться к столам
        </button>
      </div>
    );
  }

  return (
    <div className="active-orders-fullscreen">
      {/* ШАПКА — ФИКСИРОВАННАЯ, ЛОГОТИП СЛЕВА, ЗАГОЛОВОК ПО ЦЕНТРУ */}
      <header className="active-header-lux">
        <div className="active-logo">OrderBook</div>
        <h1 className="active-page-title">Рабочие столы</h1>
      </header>

      {/* КАРТОЧКИ ЗАКАЗОВ — ОГРОМНЫЕ, ПО ЦЕНТРУ, ВЕРТИКАЛЬНО */}
      <div className="orders-container-lux">
        {orders.map((order) => (
          <div key={order.tableId} className="order-card-lux">
            <div className="card-top-lux">
              <h2 className="card-table-number">Стол № {order.tableId}</h2>
              <span className="order-time-lux">Заказ в {formatTime(order.createdAt)}</span>
            </div>

            <div className="items-list-lux">
              {order.items.map((item, i) => (
                <div key={i} className="order-row-lux">
                  <span className="item-name-lux">{item.name}</span>
                  <span className="item-details-lux">
                    {item.quantity} × {item.price} ₽
                  </span>
                </div>
              ))}
            </div>

            <div className="card-bottom-lux">
              <div className="total-sum-lux">
                Итого: <strong>{order.total.toFixed(2)} ₽</strong>
              </div>
              <button
                className="add-dish-btn-lux"
                onClick={() => goToTable(order.tableId)}
              >
                Редактировать заказ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
