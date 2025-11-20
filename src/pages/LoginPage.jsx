// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";  // ← ЭТО ОБЯЗАТЕЛЬНО!
import { ROLES } from "../constants/roles";
import RoleCard from "../components/RoleCard";
import InputField from "../components/InputField";
import Keypad from "../components/Keypad";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState("login");
  const navigate = useNavigate(); // ← Вот он!

  const handleDigit = (digit) => {
    if (focused === "login" && login.length < 2) {
      setLogin(prev => prev + digit);
    }
    if (focused === "password") {
      setPassword(prev => prev + digit);
    }
  };

  const handleDelete = () => {
    if (focused === "login") setLogin(prev => prev.slice(0, -1));
    else setPassword(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (focused === "login") setLogin("");
    else setPassword("");
  };

  const canSubmit = login.length === 2 && password.length >= 4;

  const handleLogin = () => {
    // Сохраняем ID официанта
    localStorage.setItem("userId", login);
    // Переходим на страницу приветствия
    navigate("/welcome");
  };

  return (
    <div className="auth-screen">
      {/* Левая панель с описанием — без изменений */}
      <section className="panel info-panel">
        <p className="eyebrow">Внутренний доступ</p>
        <h2 className="info-title">
          Классический интерфейс для строгой дисциплины сервиса
        </h2>
        <p className="info-text">
          OrderBook объединяет всех сотрудников в одном рабочем пространстве —
          от официанта до владельца.
        </p>
        <div className="roles-grid">
          {ROLES.map((role) => (
            <RoleCard key={role.title} {...role} />
          ))}
        </div>
      </section>

      {/* Правая панель входа */}
      <section className="panel auth-panel">
        <div className="brand-block">
          <h1 className="title">OrderBook</h1>
          <p className="subtitle">Книга-помощник официанта</p>
        </div>

        <div className="inputs">
          <InputField
            label="Логин (2 цифры)"
            value={login}
            placeholder="••"
            isActive={focused === "login"}
            onClick={() => setFocused("login")}
          />
          <InputField
            label="Пароль (от 4 цифр)"
            value={password}
            placeholder="••••"
            isActive={focused === "password"}
            onClick={() => setFocused("password")}
          />
          <div className="input-hint">
            Коснитесь поля, затем вводите цифры на клавиатуре ниже
          </div>
        </div>

        <Keypad onDigit={handleDigit} onClear={handleClear} onDelete={handleDelete} />

        <button
          className="login-button"
          disabled={!canSubmit}
          onClick={handleLogin} // ← ВСЁ В ОДНОМ МЕСТЕ!
        >
          Войти
        </button>
      </section>
    </div>
  );
}