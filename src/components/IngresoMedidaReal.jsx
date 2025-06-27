import React, { useState } from "react";
import "./IngresoMedidaReal.css";

export default function IngresoMedidaReal({ onSubmit }) {
  const [valor, setValor] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (valor.trim() !== "") {
      onSubmit(parseFloat(valor.replace(",", ".")));
      setValor("");
    }
  };
  return (
    <div className="ingreso-medida-real">
      <h2>Medida Real</h2>
      <div className="warning-text">Solo el host debe ver esta pantalla</div>
      <form onSubmit={handleSubmit} className="secret-form">
        <input
          type="password"
          inputMode="decimal"
          pattern="[0-9]+([\\.,][0-9]+)?"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="Medida real en cm"
          className="secret-input"
          required
        />
        <button type="submit" className="secret-submit">
          Guardar y Mostrar Resultados
        </button>
      </form>
    </div>
  );
}
