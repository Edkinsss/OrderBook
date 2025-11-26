// src/pages/MenuPage.jsx — СТРАНИЦА МЕНЮ
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { USERS } from "../data/users";

// Структура меню
const MENU_SECTIONS = {
  salads: {
    name: "Салаты",
    items: [
      "Летний",
      "Греческий",
      "Чобан",
      "Татарский",
      "Фантазия",
      "Хрустящие баклажаны"
    ]
  },
  appetizers: {
    name: "Закуски",
    items: [
      "Брынза с маслинами",
      "Сырная нарезка"
    ]
  },
  bakery: {
    name: "Мучные изделия",
    items: [
      "Лепешка"
    ]
  },
  firstCourses: {
    name: "Первые блюда",
    items: [
      "Лагман",
      "Юфакь Аш",
      "Шурпа",
      "Суп с Фрикадельками",
      "Суп из перепелки",
      "Мерджемек",
      "Солянка"
    ]
  },
  secondCourses: {
    name: "Вторые блюда",
    items: [
      "Манты",
      "Плов",
      "Сарма",
      "Долма",
      "Отбивная"
    ]
  },
  grill: {
    name: "Мангал",
    items: [
      "Шашлык из говядины",
      "Шашлык из баранины",
      "Шашлык из курицы",
      "Шашлык из индейки",
      "Бараньи ребрышки",
      "Чалагъ ач",
      "Перепелка на мангале",
      "Грибы на мангале",
      "Овощной шашлык"
    ]
  },
  coldDrinks: {
    name: "Холодные Напитки",
    items: [
      "Компот",
      "Айран",
      "Домашний лимонад",
      "Фреш",
      "Молочный коктейль",
      "Мохито",
      "Сок в ассортименте",
      "Лимонад разливной"
    ]
  },
  hotDrinks: {
    name: "Горячие напитки",
    items: [
      "Кофе",
      "Чай зеленый",
      "Чай черный",
      "Чай на травах",
      "Чай фруктовый (облепиховый, малиновый, смородиновый)"
    ]
  },
  desserts: {
    name: "Десерты",
    items: [
      "Медовик",
      "Три шоколада",
      "Десерт Павлова",
      "Крымско-татарская пахлава",
      "Турецкая пахлава",
      "Курабье"
    ]
  }
};

export default function MenuPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // ID стола из URL
  const [selectedSection, setSelectedSection] = useState(null);
  const [order, setOrder] = useState([]);
  const [timeLeft, setTimeLeft] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  const userId = localStorage.getItem("userId");
  const currentUser = userId && USERS[userId] ? USERS[userId] : { name: "Артём", role: "Официант" };
  const userName = currentUser.name;
  const userRole = currentUser.role;

  // Загрузка заказа из localStorage при монтировании
  useEffect(() => {
    if (id) {
      const savedOrder = localStorage.getItem(`order_${id}`);
      if (savedOrder) {
        try {
          setOrder(JSON.parse(savedOrder));
        } catch (e) {
          console.error("Ошибка загрузки заказа:", e);
        }
      }
    }
  }, [id]);

  // Сохранение заказа в localStorage при изменении
  useEffect(() => {
    if (id && order.length >= 0) {
      localStorage.setItem(`order_${id}`, JSON.stringify(order));
    }
  }, [order, id]);

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

  // Добавление блюда в заказ
  const addToOrder = (sectionName, itemName) => {
    const newItem = {
      id: Date.now() + Math.random(),
      section: sectionName,
      name: itemName,
      price: "", // Пустое поле для цены
      quantity: 1,
      // image: "", // Комментарий для фото - позже добавим
    };
    setOrder(prev => [...prev, newItem]);
  };

  // Удаление позиции из заказа
  const removeFromOrder = (itemId) => {
    setOrder(prev => prev.filter(item => item.id !== itemId));
  };

  // Изменение количества
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromOrder(itemId);
      return;
    }
    setOrder(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Изменение цены
  const updatePrice = (itemId, newPrice) => {
    setOrder(prev => prev.map(item => 
      item.id === itemId ? { ...item, price: newPrice } : item
    ));
  };

  // Подсчет общей суммы
  const calculateTotal = () => {
    return order.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      return sum + (price * item.quantity);
    }, 0);
  };

  const total = calculateTotal();

  return (
    <div className="menu-page">
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
            <button className="nav-btn active">Меню</button>
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
      <div className="menu-content">
        {/* ЗАГОЛОВОК МЕНЮ */}
        <div className="menu-header">
          <h2 className="menu-title">МЕНЮ</h2>
          {id && <p className="table-info">Стол № {id}</p>}
        </div>

        <div className="menu-layout">
          {/* ЛЕВАЯ ЧАСТЬ — РАЗДЕЛЫ МЕНЮ */}
          <div className="menu-sections">
            <div className="sections-grid">
              {Object.entries(MENU_SECTIONS).map(([key, section]) => (
                <button
                  key={key}
                  className={`section-btn ${selectedSection === key ? 'active' : ''}`}
                  onClick={() => setSelectedSection(selectedSection === key ? null : key)}
                >
                  <span className="section-name">{section.name}</span>
                  <span className="section-count">{section.items.length} позиций</span>
                </button>
              ))}
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ — БЛЮДА ВЫБРАННОГО РАЗДЕЛА И ЗАКАЗ */}
          <div className="menu-details">
            {selectedSection ? (
              <div className="items-section">
                <h3 className="items-title">{MENU_SECTIONS[selectedSection].name}</h3>
                <div className="items-grid">
                  {MENU_SECTIONS[selectedSection].items.map((item, idx) => (
                    <button
                      key={idx}
                      className="menu-item-btn"
                      onClick={() => addToOrder(MENU_SECTIONS[selectedSection].name, item)}
                    >
                      {/* Комментарий для фото - позже добавим */}
                      {/* <img src={item.image} alt={item} className="item-image" /> */}
                      <span className="item-name">{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>Выберите раздел меню для просмотра блюд</p>
              </div>
            )}

            {/* ЗАКАЗ */}
            <div className="order-section">
              <h3 className="order-title">Заказ</h3>
              {order.length === 0 ? (
                <p className="empty-order">Заказ пуст</p>
              ) : (
                <div className="order-list">
                  {order.map((item) => (
                    <div key={item.id} className="order-item">
                      <div className="order-item-info">
                        <span className="order-item-name">{item.name}</span>
                        <span className="order-item-section">{item.section}</span>
                      </div>
                      <div className="order-item-controls">
                        <div className="quantity-control">
                          <button 
                            className="qty-btn minus"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >−</button>
                          <span className="qty-value">{item.quantity}</span>
                          <button 
                            className="qty-btn plus"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >+</button>
                        </div>
                        <input
                          type="number"
                          className="price-input"
                          placeholder="Цена"
                          value={item.price}
                          onChange={(e) => updatePrice(item.id, e.target.value)}
                        />
                        <button 
                          className="remove-btn"
                          onClick={() => removeFromOrder(item.id)}
                        >×</button>
                      </div>
                    </div>
                  ))}
                  <div className="order-total">
                    <strong>Итого: {total.toFixed(2)} ₽</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

