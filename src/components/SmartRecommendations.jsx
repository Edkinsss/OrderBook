// src/components/SmartRecommendations.jsx — УМНЫЙ ИИ-ПОМОЩНИК ОФИЦИАНТА
import { useMemo } from "react";

// Полное меню для поиска блюд
const FULL_MENU = {
  salads: [
    { name: "Летний", price: 350 },
    { name: "Греческий", price: 450 },
    { name: "Чобан", price: 350 },
    { name: "Татарский", price: 450 },
    { name: "Фантазия", price: 400 },
    { name: "Хрустящие баклажаны", price: 550 },
    { name: "Капустный", price: 300 }
  ],
  appetizers: [
    { name: "Брынза с маслинами", price: 400 },
    { name: "Сырная нарезка с медом", price: 450 }
  ],
  bakery: [
    { name: "Лепешка", price: 90 }
  ],
  firstCourses: [
    { name: "Лагман", price: 420 },
    { name: "Юфакь Аш", price: 370 },
    { name: "Шурпа", price: 470 },
    { name: "Суп с Фрикадельками", price: 370 },
    { name: "Суп из перепелки", price: 470 },
    { name: "Мерджемек", price: 370 },
    { name: "Солянка", price: 470 }
  ],
  secondCourses: [
    { name: "Манты", price: 370 },
    { name: "Плов", price: 420 },
    { name: "Сарма", price: 420 },
    { name: "Долма", price: 420 },
    { name: "Отбивная куриная", price: 470 }
  ],
  grill: [
    { name: "Шашлык из говядины", price: 470 },
    { name: "Шашлык из баранины", price: 520 },
    { name: "Шашлык из курицы", price: 400 },
    { name: "Шашлык из индейки", price: 420 },
    { name: "Бараньи ребрышки", price: 0 },
    { name: "Чалагъ ач", price: 470 },
    { name: "Перепелка на мангале", price: 420 },
    { name: "Грибы на мангале", price: 370 },
    { name: "Овощной шашлык", price: 470 }
  ],
  coldDrinks: [
    { name: "Компот - 0,5л", price: 170 },
    { name: "Айран - 0,25л", price: 120 },
    { name: "Домашний лимонад - 0,5л", price: 420 },
    { name: "Фреш - 0,25л", price: 420 },
    { name: "Молочный коктейль - 0,5л", price: 370 },
    { name: "Мохито - 0,5л", price: 420 },
    { name: "Сок в ассортименте - 1ст", price: 100 },
    { name: "Лимонад разливной - 0,5л", price: 170 }
  ],
  hotDrinks: [
    { name: "Кофе", price: 200 },
    { name: "Чай зеленый", price: 150 },
    { name: "Чай черный", price: 150 },
    { name: "Чай на травах", price: 180 },
    { name: "Чай фруктовый", price: 420 }
  ],
  desserts: [
    { name: "Медовик", price: 320 },
    { name: "Три шоколада", price: 420 },
    { name: "Анна Павлова", price: 420 },
    { name: "Крымско-татарская пахлава", price: 120 },
    { name: "Турецкая пахлава", price: 120 },
    { name: "Курабье", price: 80 }
  ]
};

// Функция для поиска блюда в меню
const findMenuItem = (dishName) => {
  for (const section of Object.values(FULL_MENU)) {
    const item = section.find(d => d.name === dishName);
    if (item) {
      return item;
    }
  }
  return null;
};

// Логика рекомендаций
const getRecommendations = (order, total) => {
  const recommendations = [];
  const orderDishNames = order.map(item => item.name.toLowerCase());
  
  // Проверка на шашлык
  const hasShashlik = orderDishNames.some(name => 
    name.includes("шашлык") || name.includes("чалагъ")
  );
  
  // Проверка на первые блюда
  const hasFirstCourse = orderDishNames.some(name => 
    name.includes("солянка") || name.includes("лагман") || 
    name.includes("шурпа") || name.includes("суп")
  );
  
  // Проверка на манты/долма
  const hasManty = orderDishNames.some(name => 
    name.includes("манты") || name.includes("долма") || name.includes("сарма")
  );
  
  // Проверка на мясные блюда
  const hasMeat = orderDishNames.some(name => 
    name.includes("шашлык") || name.includes("отбивная") || 
    name.includes("плов") || name.includes("чалагъ")
  );
  
  // Если есть шашлык
  if (hasShashlik) {
    const airan = findMenuItem("Айран - 0,25л");
    const lepeshka = findMenuItem("Лепешка");
    const vegShashlik = findMenuItem("Овощной шашлык");
    
    if (airan) recommendations.push({ item: airan, section: "Холодные Напитки", match: 87 });
    if (lepeshka) recommendations.push({ item: lepeshka, section: "Мучные изделия", match: 82 });
    if (vegShashlik) recommendations.push({ item: vegShashlik, section: "Мангал", match: 75 });
  }
  
  // Если есть первые блюда
  if (hasFirstCourse) {
    const lepeshka = findMenuItem("Лепешка");
    const tea = findMenuItem("Чай черный");
    
    if (lepeshka && !recommendations.find(r => r.item.name === "Лепешка")) {
      recommendations.push({ item: lepeshka, section: "Мучные изделия", match: 92 });
    }
    if (tea) recommendations.push({ item: tea, section: "Горячие напитки", match: 78 });
  }
  
  // Если есть манты/долма
  if (hasManty) {
    const herbalTea = findMenuItem("Чай на травах");
    const kurabie = findMenuItem("Курабье");
    
    if (herbalTea) recommendations.push({ item: herbalTea, section: "Горячие напитки", match: 85 });
    if (kurabie) recommendations.push({ item: kurabie, section: "Десерты", match: 72 });
  }
  
  // Если есть мясо
  if (hasMeat && !hasShashlik) {
    const vegShashlik = findMenuItem("Овощной шашлык");
    const mushrooms = findMenuItem("Грибы на мангале");
    
    if (vegShashlik && !recommendations.find(r => r.item.name === "Овощной шашлык")) {
      recommendations.push({ item: vegShashlik, section: "Мангал", match: 68 });
    }
    if (mushrooms) recommendations.push({ item: mushrooms, section: "Мангал", match: 65 });
  }
  
  // Если заказ больше 3000₽
  if (total > 3000) {
    const medovik = findMenuItem("Медовик");
    const pakhlava = findMenuItem("Турецкая пахлава");
    
    if (medovik) recommendations.push({ item: medovik, section: "Десерты", match: 78 });
    if (pakhlava) recommendations.push({ item: pakhlava, section: "Десерты", match: 75 });
  }
  
  // Убираем дубликаты и блюда, которые уже в заказе
  const uniqueRecs = [];
  const orderNames = order.map(item => item.name.toLowerCase());
  
  for (const rec of recommendations) {
    const recName = rec.item.name.toLowerCase();
    if (!orderNames.includes(recName) && 
        !uniqueRecs.find(r => r.item.name === rec.item.name)) {
      uniqueRecs.push(rec);
    }
  }
  
  // Возвращаем 2-4 рекомендации
  return uniqueRecs.slice(0, 4);
};

export default function SmartRecommendations({ order, total, onAddToOrder }) {
  const recommendations = useMemo(() => {
    if (!order || order.length === 0) return [];
    return getRecommendations(order, total);
  }, [order, total]);
  
  if (recommendations.length === 0) {
    return null;
  }
  
  const handleAdd = (rec) => {
    // Используем секцию из рекомендации (она уже правильно определена)
    onAddToOrder(rec.section, rec.item);
  };
  
  return (
    <div className="smart-recommendations">
      <div className="recommendations-header">
        <h3 className="recommendations-title">Умные рекомендации от OrderBook</h3>
        <p className="recommendations-subtitle">Гости с похожим заказом также берут:</p>
      </div>
      
      <div className="recommendations-grid">
        {recommendations.map((rec, idx) => (
          <div key={idx} className="recommendation-card">
            <div className="recommendation-info">
              <div className="recommendation-name">{rec.item.name}</div>
              <div className="recommendation-price">{rec.item.price} ₽</div>
              <div className="recommendation-match">{rec.match}%</div>
            </div>
            <button
              className="recommendation-add-btn"
              onClick={() => handleAdd(rec)}
            >
              Добавить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

