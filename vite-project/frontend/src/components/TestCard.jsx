import React from "react";

const TestCard = ({ title, description, status, onStart }) => {
  return (
    <div className="test-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <p>Status: <strong>{status}</strong></p>
      <button onClick={onStart}>
        {status === "Pendiente" ? "Iniciar Test" : "Ver Resultados"}
      </button>
    </div>
  );
};

export default TestCard;
