// src/pages/TablesPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// 20 столов — аккуратные ряды по 5 штук
const TABLES = [
  // Ряд 1
  { id: "O1",  top: "15%", left: "10%" },
  { id: "O2",  top: "15%", left: "30%" },
  { id: "O3",  top: "15%", left: "50%" },
  { id: "O4",  top: "15%", left: "70%" },
  { id: "O5",  top: "15%", left: "90%" },

  // Ряд 2
  { id: "O6",  top: "35%", left: "10%" },
  { id: "O7",  top: "35%", left: "30%" },
  { id: "O8",  top: "35%", left: "50%" },
  { id: "O9",  top: "35%", left: "70%" },
  { id: "O10", top: "35%", left: "90%" },

  // Ряд 3
  { id: "O11", top: "55%", left: "10%" },
  { id: "O12", top: "55%", left: "30%" },
  { id: "O13", top: "55%", left: "50%" },
  { id: "O14", top: "55%", left: "70%" },
  { id: "O15", top: "55%", left: "90%" },

  // Ряд 4
  { id: "O16", top: "75%", left: "10%" },
  { id: "O17", top: "75%", left: "30%" },
  { id: "O18", top: "75%", left: "50%" },
  { id: "O19", top: "75%", left: "70%" },
  { id: "O20", top: "75%", left: "90%" },
];

export default function TablesPage() {
  const [selectedTable, setSelectedTable] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "Официант";

  const handleTableClick = (tableId) => {
    setSelectedTable(tableId);
    setShowModal(true);
  };

  const confirmTable = () => {
    setShowModal(false);
    navigate(`/table/${selectedTable}`);
  };

  return (
    <div className="tables-page">
      {/* Шапка */}
      <header className="tables-header">
        <h1 className="logo">OrderBook</h1>
        <nav className="header-nav">
          <button className="nav-btn active">Столы</button>
          <button className="nav-btn">Расчет</button>
        </nav>
      </header>

      {/* Карта столов */}
      <div className="tables-map">
        <div className="hall-bg">
          {TABLES.map((table) => (
            <button
              key={table.id}
              className="table-btn"
              style={{ top: table.top, left: table.left }}
              onClick={() => handleTableClick(table.id)}
            >
              {table.id}
            </button>
          ))}
        </div>
      </div>

      {/* Модальное окно */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Подтверждение</h2>
            <p>
              {userName}, вы выбрали стол №{" "}
              <strong className="highlight-table">{selectedTable}</strong>
              <br />
              Подтверждаете?
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Отмена
              </button>
              <button className="btn-confirm" onClick={confirmTable}>
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}