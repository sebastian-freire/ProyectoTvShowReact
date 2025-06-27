import React, { useState } from "react";
import "./Sidebar.css";

export default function Sidebar({ jugadores, puntajes, onAddPlayer, etapa }) {
  const [nuevoJugador, setNuevoJugador] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nuevoJugador.trim() && !jugadores.includes(nuevoJugador.trim())) {
      onAddPlayer(nuevoJugador.trim());
      setNuevoJugador("");
      setMostrarFormulario(false);
    }
  };

  // Solo mostrar el botón para añadir jugadores después de la etapa inicial
  const puedeAñadirJugadores = etapa > 1;

  // Crear array de jugadores con sus puntajes y ordenar por puntos (mayor a menor)
  const jugadoresOrdenados = jugadores
    .map((jugador, index) => ({
      nombre: jugador,
      puntos: puntajes[index] ?? 0,
      index: index
    }))
    .sort((a, b) => b.puntos - a.puntos);

  // Encontrar la puntuación máxima para determinar líderes
  const puntuacionMaxima =
    jugadoresOrdenados.length > 0 ? jugadoresOrdenados[0].puntos : 0;

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <h3>Jugadores</h3>
        <ul>
          {jugadoresOrdenados.map((jugador) => (
            <li
              key={jugador.nombre}
              className={
                jugador.puntos === puntuacionMaxima && puntuacionMaxima > 0
                  ? "leader"
                  : ""
              }
            >
              <div className="player-name">{jugador.nombre}</div>
              <div className="puntaje">{jugador.puntos} pts</div>
            </li>
          ))}
        </ul>
      </div>

      {puedeAñadirJugadores && (
        <div className="sidebar-footer">
          <div className="add-player-section">
            {!mostrarFormulario ? (
              <button
                className="add-player-btn"
                onClick={() => setMostrarFormulario(true)}
              >
                + Añadir Jugador
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="add-player-form">
                <input
                  type="text"
                  value={nuevoJugador}
                  onChange={(e) => setNuevoJugador(e.target.value)}
                  placeholder="Nombre del jugador"
                  className="add-player-input"
                  autoFocus
                />
                <div className="form-buttons">
                  <button type="submit" className="confirm-btn">
                    ✓
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setMostrarFormulario(false);
                      setNuevoJugador("");
                    }}
                  >
                    ✕
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
