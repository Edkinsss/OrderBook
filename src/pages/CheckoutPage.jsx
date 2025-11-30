// src/pages/CheckoutPage.jsx — РАСЧЁТ СТОЛА
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { USERS } from "../data/users";
import Keypad from "../components/Keypad";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // ID стола из URL
  const [order, setOrder] = useState(null);
  const [tipPercent, setTipPercent] = useState(null);
  const [tipManual, setTipManual] = useState("");
  const [tipMode, setTipMode] = useState(null); // 'percent' или 'manual'

  // Загрузка заказа из localStorage
  useEffect(() => {
    if (id) {
      const activeOrders = JSON.parse(localStorage.getItem("activeOrders") || "[]");
      // Ищем заказ по tableId (работает с любыми столами: O1, O7, VIP-5, Терраса и т.д.)
      const foundOrder = activeOrders.find(o => o.tableId === id);
      
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        // Если заказ не найден, возвращаемся на страницу столов
        navigate("/tables");
      }
    }
  }, [id, navigate]);

  if (!order) {
    return (
      <div className="checkout-page">
        <div className="checkout-loading">Загрузка...</div>
      </div>
    );
  }

  const waiter = USERS[order.waiterId] || { name: "Неизвестно", role: "Официант" };

  // Подсчёт сумм
  const subtotal = order.total || order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let tipAmount = 0;
  if (tipMode === 'percent' && tipPercent) {
    tipAmount = (subtotal * tipPercent) / 100;
  } else if (tipMode === 'manual' && tipManual) {
    const manualValue = parseFloat(tipManual.replace(/[^0-9.]/g, '')) || 0;
    tipAmount = manualValue;
  }
  
  const total = subtotal + tipAmount;

  // Обработка выбора процента чаевых
  const handleTipPercent = (percent) => {
    setTipPercent(percent);
    setTipMode('percent');
    setTipManual("");
  };

  // Обработка ручного ввода
  const handleTipManual = (value) => {
    setTipManual(value);
    setTipMode('manual');
    setTipPercent(null);
  };

  // Обработка Keypad
  const handleKeypadDigit = (digit) => {
    if (tipMode === 'manual') {
      setTipManual(prev => prev + digit.toString());
    }
  };

  const handleKeypadClear = () => {
    if (tipMode === 'manual') {
      setTipManual("");
    }
  };

  const handleKeypadDelete = () => {
    if (tipMode === 'manual') {
      setTipManual(prev => prev.slice(0, -1));
    }
  };

  // Генерация PDF чека
  const handlePrintCheck = () => {
    if (!window.jspdf) {
      alert('Библиотека jsPDF не загружена. Пожалуйста, обновите страницу.');
      return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Логотип и заголовок
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("OrderBook", 105, 20, { align: "center" });
    
    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");
    doc.text("Дорогие гости", 105, 30, { align: "center" });
    
    // Информация о заказе
    doc.setFontSize(12);
    doc.text(`Стол № ${order.tableId}`, 20, 45);
    doc.text(`Официант: ${waiter.name}`, 20, 52);
    
    const now = new Date();
    const dateStr = now.toLocaleDateString("ru-RU");
    const timeStr = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    doc.text(`Дата: ${dateStr} ${timeStr}`, 20, 59);
    
    // Таблица блюд
    const tableData = order.items.map(item => [
      item.name,
      item.quantity.toString(),
      `${item.price} ₽`,
      `${(item.price * item.quantity).toFixed(2)} ₽`
    ]);
    
    let finalY = 70;
    
    // Используем autoTable если доступен
    if (typeof doc.autoTable !== 'undefined') {
      doc.autoTable({
        startY: 70,
        head: [["Блюдо", "Кол-во", "Цена", "Сумма"]],
        body: tableData,
        theme: "striped",
        headStyles: { fillColor: [77, 47, 37], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 30, halign: "center" },
          2: { cellWidth: 40, halign: "right" },
          3: { cellWidth: 40, halign: "right" }
        }
      });
      
      finalY = doc.lastAutoTable.finalY + 10;
    } else {
      // Fallback без autoTable - простая таблица
      doc.setFontSize(10);
      doc.text("Блюдо", 20, finalY);
      doc.text("Кол-во", 100, finalY);
      doc.text("Цена", 130, finalY);
      doc.text("Сумма", 160, finalY);
      finalY += 10;
      
      order.items.forEach(item => {
        doc.text(item.name.substring(0, 25), 20, finalY);
        doc.text(item.quantity.toString(), 100, finalY);
        doc.text(`${item.price} ₽`, 130, finalY);
        doc.text(`${(item.price * item.quantity).toFixed(2)} ₽`, 160, finalY);
        finalY += 8;
      });
      finalY += 5;
    }
    
    // Итого
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Итого: ${subtotal.toFixed(2)} ₽`, 150, finalY, { align: "right" });
    
    if (tipAmount > 0) {
      doc.text(`Чаевые: ${tipAmount.toFixed(2)} ₽`, 150, finalY + 8, { align: "right" });
    }
    
    doc.setFontSize(14);
    doc.text(`ВСЕГО К ОПЛАТЕ: ${total.toFixed(2)} ₽`, 150, finalY + 18, { align: "right" });
    
    // QR-код (заглушка)
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("QR-код для отзыва", 105, finalY + 35, { align: "center" });
    doc.rect(85, finalY + 40, 40, 40); // Просто рамка вместо QR
    
    // Благодарность
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Спасибо за визит! Ждём снова ♥", 105, finalY + 95, { align: "center" });
    
    // Сохранение PDF
    doc.save(`check_${order.tableId}_${Date.now()}.pdf`);
  };

  // Обработка оплаты
  const handlePaid = () => {
    const activeOrders = JSON.parse(localStorage.getItem("activeOrders") || "[]");
    const completedOrders = JSON.parse(localStorage.getItem("completedOrders") || "[]");
    
    // Удаляем из активных
    const updatedActive = activeOrders.filter(
      o => !(o.tableId === id && o.waiterId === order.waiterId)
    );
    
    // Добавляем в завершённые
    const completedOrder = {
      ...order,
      tipAmount: tipAmount,
      totalWithTip: total,
      completedAt: new Date().toISOString()
    };
    completedOrders.push(completedOrder);
    
    // Сохраняем
    localStorage.setItem("activeOrders", JSON.stringify(updatedActive));
    localStorage.setItem("completedOrders", JSON.stringify(completedOrders));
    
    // Перенаправляем
    navigate("/tables");
  };

  return (
    <div className="checkout-page">
      {/* ШАПКА */}
      <header className="checkout-header">
        <div className="checkout-logo">OrderBook</div>
        <h1 className="checkout-title">Расчёт стола № {order.tableId}</h1>
      </header>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <div className="checkout-content">
        {/* КАРТОЧКА ЗАКАЗА */}
        <div className="checkout-card">
          {/* ИНФОРМАЦИЯ О ЗАКАЗЕ */}
          <div className="checkout-info">
            <div className="checkout-info-item">
              <span className="checkout-info-label">Официант:</span>
              <span className="checkout-info-value">{waiter.name}</span>
            </div>
            <div className="checkout-info-item">
              <span className="checkout-info-label">Дата:</span>
              <span className="checkout-info-value">
                {new Date(order.createdAt).toLocaleDateString("ru-RU")} {new Date(order.createdAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>

          {/* СПИСОК БЛЮД */}
          <div className="checkout-items">
            <h3 className="checkout-items-title">Блюда:</h3>
            <div className="checkout-items-list">
              {order.items.map((item, idx) => (
                <div key={idx} className="checkout-item-row">
                  <span className="checkout-item-name">{item.name}</span>
                  <span className="checkout-item-price">
                    {item.quantity} × {item.price} ₽ = {(item.price * item.quantity).toFixed(2)} ₽
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ИТОГО */}
          <div className="checkout-subtotal">
            <span className="checkout-subtotal-label">Итого:</span>
            <span className="checkout-subtotal-amount">{subtotal.toFixed(2)} ₽</span>
          </div>

          {/* ЧАЕВЫЕ */}
          <div className="checkout-tips">
            <h3 className="checkout-tips-title">Чаевые:</h3>
            
            <div className="checkout-tips-buttons">
              <button
                className={`tip-btn ${tipMode === 'percent' && tipPercent === 10 ? 'active' : ''}`}
                onClick={() => handleTipPercent(10)}
              >
                10%
              </button>
              <button
                className={`tip-btn ${tipMode === 'percent' && tipPercent === 15 ? 'active' : ''}`}
                onClick={() => handleTipPercent(15)}
              >
                15%
              </button>
              <button
                className={`tip-btn ${tipMode === 'percent' && tipPercent === 20 ? 'active' : ''}`}
                onClick={() => handleTipPercent(20)}
              >
                20%
              </button>
              <button
                className={`tip-btn ${tipMode === 'manual' ? 'active' : ''}`}
                onClick={() => {
                  setTipMode('manual');
                  setTipPercent(null);
                }}
              >
                Вручную
              </button>
            </div>

            {tipMode === 'manual' && (
              <div className="checkout-tips-manual">
                <label className="tip-manual-label">Сумма чаевых (₽)</label>
                <input
                  type="text"
                  className="tip-manual-input"
                  value={tipManual}
                  onChange={(e) => handleTipManual(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="0.00"
                  readOnly
                />
                <Keypad
                  onDigit={handleKeypadDigit}
                  onClear={handleKeypadClear}
                  onDelete={handleKeypadDelete}
                />
              </div>
            )}

            {tipAmount > 0 && (
              <div className="checkout-tips-amount">
                Чаевые: <strong>{tipAmount.toFixed(2)} ₽</strong>
              </div>
            )}
          </div>

          {/* ОБЩАЯ СУММА */}
          <div className="checkout-total">
            <span className="checkout-total-label">ВСЕГО К ОПЛАТЕ:</span>
            <span className="checkout-total-amount">{total.toFixed(2)} ₽</span>
          </div>

          {/* КНОПКИ ДЕЙСТВИЙ */}
          <div className="checkout-actions">
            <button
              className="checkout-btn checkout-btn-print"
              onClick={handlePrintCheck}
            >
              ПЕЧАТЬ ЧЕКА
            </button>
            <button
              className="checkout-btn checkout-btn-paid"
              onClick={handlePaid}
            >
              ОПЛАЧЕНО
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

