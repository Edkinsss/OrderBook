// src/components/InputField.jsx
export default function InputField({ label, value, placeholder, isActive, onClick }) {
  return (
    <div className={`input-group ${isActive ? "active" : ""}`} onClick={onClick}>
      <label>{label}</label>
      <input type={label.includes("Пароль") ? "password" : "text"} value={value} readOnly placeholder={placeholder} />
    </div>
  );
}