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
    const nombreMayus = nombre.trim().toUpperCase();
    if (nombreMayus && !jugadores.includes(nombreMayus)) {
      setJugadores([...jugadores, nombreMayus]);
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
            onChange={(e) =>
              setNombre(e.target.value.slice(0, 7).toUpperCase())
            }
            placeholder="Nombre del jugador"
            required
            maxLength={7}
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
