// src/components/Keypad.jsx
export default function Keypad({ onDigit, onClear, onDelete }) {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <>
      <div className="keypad">
        {digits.map((n) => (
          <button key={n} className="key" onClick={() => onDigit(n)}>
            {n}
          </button>
        ))}
      </div>
      <div className="keypad-actions">
        <button className="ghost-btn" onClick={onClear}>Очистить поле</button>
        <button className="ghost-btn" onClick={onDelete}>Удалить последнюю цифру</button>
      </div>
    </>
  );
}