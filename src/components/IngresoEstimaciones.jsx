import React, { useState } from "react";
import "./IngresoEstimaciones.css";

export default function IngresoEstimaciones({ jugadores, onSubmit }) {
  const [valores, setValores] = useState(Array(jugadores.length).fill(""));

  const handleChange = (i, value) => {
    const nuevos = [...valores];
    nuevos[i] = value;
    setValores(nuevos);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (valores.every((v) => v.trim() !== "")) {
      onSubmit(valores.map((v) => parseFloat(v.replace(",", "."))));
    }
  };

  return (
    <div className="ingreso-estimaciones">
      <h2>Estimaciones de los Jugadores</h2>
      <form onSubmit={handleSubmit} className="estimation-form">
        {jugadores.map((j, i) => (
          <div key={j} className="player-estimation">
            <label className="player-name-label">{j}</label>
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]+([\\.,][0-9]+)?"
              value={valores[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              placeholder="Estimación en cm"
              className="estimation-input"
              required
            />
          </div>
        ))}
        <button type="submit" className="submit-button">
          Enviar Todas las Estimaciones
        </button>
      </form>
    </div>
  );
}
