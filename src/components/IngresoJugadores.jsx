import React, { useState } from "react";
import "./IngresoJugadores.css";

export default function IngresoJugadores({
  jugadores,
  setJugadores,
  onContinue
}) {
  const [nombre, setNombre] = useState("");
  const agregarJugador = (e) => {
    e.preventDefault();
    if (nombre.trim() && !jugadores.includes(nombre.trim())) {
      setJugadores([...jugadores, nombre.trim()]);
      setNombre("");
    }
  };
  return (
    <div className="ingreso-jugadores">
      <h2>Ingresar Jugadores</h2>
      <form onSubmit={agregarJugador}>
        <div className="input-group">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del jugador"
            required
          />
          <button type="submit" className="add-button">
            Agregar
          </button>
        </div>
      </form>

      <button
        onClick={onContinue}
        disabled={jugadores.length < 2}
        className="continue-button"
      >
        Continuar con {jugadores.length} jugadores
      </button>
    </div>
  );
}
