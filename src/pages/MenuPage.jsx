// src/pages/MenuPage.jsx — СТРАНИЦА МЕНЮ
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { USERS } from "../data/users";


const MENU_SECTIONS = {
  salads: {
    name: "Салаты",
    items: [
      { name: "Летний", price: 350, description: "Помидор, огурец, лук, масло" },
      { name: "Греческий", price: 450, description: "Помидор, огурец, перец, брынза, оливки, масло" },
      { name: "Чобан", price: 350, description: "Помидор, Ялтинский лук, лаваш с чесноком" },
      { name: "Татарский", price: 450, description: "Мясо говядина, cвекла, морковча, капуста, горошек, майонез" },
      { name: "Фантазия", price: 400, description: "Мясо курица, грибы, яйца, картофель, горошек, морковь, майонез" },
      { name: "Хрустящие баклажаны", price: 550, description: "Помидоры, рукола, лук, грецкий орех, творожный сыр, бакалажаны" },
      { name: "Капустный", price: 300, description: "Капуста, горошек, зелень, масло"}
    ]
  },
  appetizers: {
    name: "Закуски",
    items: [
      { name: "Брынза с маслинами", price: 400, description: "" },
      { name: "Сырная нарезка с медом", price: 450, description: "" }
    ]
  },
  bakery: {
    name: "Мучные изделия",
    items: [
      { name: "Лепешка", price: 90, description: "" }
    ]
  },
  firstCourses: {
    name: "Первые блюда",
    items: [
      { name: "Лагман", price: 420, description: "Домашняя лапша в мясной и овощной подливе" },
      { name: "Юфакь Аш", price: 370, description: "Маленькие пельмени в булоне" },
      { name: "Шурпа", price: 470, description: "Наварная баранина с овощами" },
      { name: "Суп с Фрикадельками", price: 370, description: "Домашняя лапшка, фрикадельки" },
      { name: "Суп из перепелки", price: 470, description: "Перепелка, перепелиное яйцо, морковь, домашняя лапша" },
      { name: "Мерджемек", price: 370, description: "Суп-пюре из чечевицы" },
      { name: "Солянка", price: 470, description: "Курица копченая, колбаса, соленые огурцы, маслины, картошка" }
    ]
  },
  secondCourses: {
    name: "Вторые блюда",
    items: [
      { name: "Манты", price: 370, description: "Большие пельмени (готовятся на пару), лук, специи" },
      { name: "Плов", price: 420, description: "Рис, говядина, " },
      { name: "Сарма", price: 420, description: "Голубцы в виноградных листьях, 5 шт." },
      { name: "Долма", price: 420, description: "Перец фаршированный рисом, мясом, специями" },
      { name: "Отбивная куриная", price: 470, description: "Мясо курицы, помидор, сыр.зелень" }
    ]
  },
  grill: {
    name: "Мангал",
    items: [
      { name: "Шашлык из говядины", price: 470, description: "Мясо говядины, лук, зелень, специи" },
      { name: "Шашлык из баранины", price: 520, description: "Мясо баранины, лук, зелень, специи" },
      { name: "Шашлык из курицы", price: 400, description: "Мясо курицы, лук, зелень, специи" },
      { name: "Шашлык из индейки", price: 420, description: "Филе бедра" },
      { name: "Бараньи ребрышки", price: 0, description: "" },
      { name: "Чалагъ ач", price: 470, description: "Баранина на кости, мясо баранины, лук, зелень, специи" },
      { name: "Перепелка на мангале", price: 420, description: "Перепелка, специи" },
      { name: "Грибы на мангале", price: 370, description: "Грибы шампиньоны, специи" },
      { name: "Овощной шашлык", price: 470, description: "Помидор, перец, баклажан, зелень" }
    ]
  },
  coldDrinks: {
    name: "Холодные Напитки",
    items: [
      { name: "Компот - 0,5л", price: 170, description: "" },
      { name: "Айран - 0,25л", price: 120, description: "" },
      { name: "Домашний лимонад - 0,5л", price: 420, description: "" },
      { name: "Фреш - 0,25л", price: 420, description: "" },
      { name: "Молочный коктейль - 0,5л", price: 370, description: "" },
      { name: "Мохито - 0,5л", price: 420, description: "" },
      { name: "Сок в ассортименте - 1ст", price: 100, description: "" },
      { name: "Лимонад разливной - 0,5л", price: 170, description: "" }
    ]
  },
  hotDrinks: {
    name: "Горячие напитки",
    items: [
      { name: "Кофе", price: 200, description: "" },
      { name: "Чай зеленый", price: 150, description: "" },
      { name: "Чай черный", price: 150, description: "" },
      { name: "Чай на травах", price: 180, description: "" },
      { name: "Чай фруктовый", price: 420, description: "(облепиховый, малиновый, смородиновый)" }
    ]
  },
  desserts: {
    name: "Десерты",
    items: [
      { name: "Медовик", price: 320, description: "" },
      { name: "Три шоколада", price: 420, description: "" },
      { name: "Анна Павлова", price: 420, description: "" },
      { name: "Крымско-татарская пахлава", price: 120, description: "Хворост" },
      { name: "Турецкая пахлава", price: 120, description: "Перемолотый грецкий орех, фисташки" },
      { name: "Курабье", price: 80, description: "Песочное печенье c сахарной пудрой" }
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
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedItemDescription, setSelectedItemDescription] = useState("");
  const [selectedItemName, setSelectedItemName] = useState("");
  const [longPressTimer, setLongPressTimer] = useState(null);

  const userId = localStorage.getItem("userId");
  const currentUser = userId && USERS[userId] ? USERS[userId] : { name: "Артём", role: "Официант" };
  const userName = currentUser.name;
  const userRole = currentUser.role;

  // Загрузка заказа из localStorage при монтировании
  useEffect(() => {
    if (id) {
      // Сначала проверяем черновик
      const savedOrder = localStorage.getItem(`order_${id}`);
      if (savedOrder) {
        try {
          setOrder(JSON.parse(savedOrder));
        } catch (e) {
          console.error("Ошибка загрузки заказа:", e);
        }
      } else {
        // Если черновика нет, проверяем активный заказ
        const activeOrders = JSON.parse(localStorage.getItem("activeOrders") || "[]");
        const activeOrder = activeOrders.find(o => o.tableId === id);
        if (activeOrder) {
          // Восстанавливаем заказ из активного заказа
          const restoredOrder = activeOrder.items.map((item, idx) => ({
            id: Date.now() + idx,
            section: item.section,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          }));
          setOrder(restoredOrder);
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
  const addToOrder = (sectionName, item) => {
    const newItem = {
      id: Date.now() + Math.random(),
      section: sectionName,
      name: item.name,
      price: item.price || 0,
      quantity: 1,
      // image: "", // Комментарий для фото
    };
    setOrder(prev => [...prev, newItem]);
  };

  // Показать модалку с описанием
  const showDescription = (item) => {
    setSelectedItemName(item.name);
    setSelectedItemDescription(item.description || "Описание отсутствует");
    setShowDescriptionModal(true);
  };

  // Обработка долгого нажатия (для мобильных)
  const handleItemPressStart = (item) => {
    const timer = setTimeout(() => {
      showDescription(item);
    }, 500); // 500ms для долгого нажатия
    setLongPressTimer(timer);
  };

  const handleItemPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  // Обработка правого клика (для ПК)
  const handleItemRightClick = (e, item) => {
    e.preventDefault();
    showDescription(item);
  };

  // Подтверждение заказа
  const confirmOrder = () => {
    if (!id || order.length === 0) return;

    // Получаем существующие активные заказы
    const existingOrders = JSON.parse(localStorage.getItem("activeOrders") || "[]");
    
    // Создаем новый активный заказ
    const activeOrder = {
      tableId: id,
      items: order.map(item => ({
        name: item.name,
        section: item.section,
        price: item.price,
        quantity: item.quantity
      })),
      total: calculateTotal(),
      createdAt: new Date().toISOString()
    };

    // Проверяем, есть ли уже заказ для этого стола
    const existingIndex = existingOrders.findIndex(o => o.tableId === id);
    if (existingIndex >= 0) {
      // Обновляем существующий заказ
      existingOrders[existingIndex] = activeOrder;
    } else {
      // Добавляем новый заказ
      existingOrders.push(activeOrder);
    }

    // Сохраняем в localStorage
    localStorage.setItem("activeOrders", JSON.stringify(existingOrders));

    // Удаляем черновик
    localStorage.removeItem(`order_${id}`);

    // Переходим на страницу активных заказов
    navigate("/active-orders");
  };

  // Удаление позиции из заказа
  const removeFromOrder = (itemId) => {
    setOrder(prev => prev.filter(item => item.id !== itemId))
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


  // Подсчет общей суммы
  const calculateTotal = () => {
    return order.reduce((sum, item) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
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
                      onContextMenu={(e) => handleItemRightClick(e, item)}
                      onTouchStart={() => handleItemPressStart(item)}
                      onTouchEnd={handleItemPressEnd}
                      onMouseDown={() => handleItemPressStart(item)}
                      onMouseUp={handleItemPressEnd}
                      onMouseLeave={handleItemPressEnd}
                    >
                      {/* Комментарий для фото - позже добавим */}
                      {/* <img src={item.image} alt={item.name} className="item-image" /> */}
                      <span className="item-name">{item.name}</span>
                      {item.price > 0 && (
                        <span className="item-price">{item.price} ₽</span>
                      )}
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
                        <div className="order-item-price">
                          {typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0} ₽
                        </div>
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
                  <button 
                    className="confirm-order-btn"
                    onClick={confirmOrder}
                    disabled={order.length === 0}
                  >
                    Подтвердить заказ
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* МОДАЛКА С ОПИСАНИЕМ БЛЮДА */}
      {showDescriptionModal && (
        <div className="modal-overlay" onClick={() => setShowDescriptionModal(false)}>
          <div className="description-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="description-modal-title">{selectedItemName}</h2>
            <div className="description-modal-content">
              <p className="description-text">{selectedItemDescription}</p>
            </div>
            <button 
              className="description-modal-close"
              onClick={() => setShowDescriptionModal(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


