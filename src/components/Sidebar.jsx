import React, { useState } from "react";
import "./Sidebar.css";

export default function Sidebar({
  jugadores,
  puntajes,
  onAddPlayer,
  onRemovePlayer,
  onAgregarPuntos,
  etapa
}) {
  const [nuevoJugador, setNuevoJugador] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const [puntosExtra, setPuntosExtra] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nuevoJugador.trim() && !jugadores.includes(nuevoJugador.trim())) {
      onAddPlayer(nuevoJugador.trim());
      setNuevoJugador("");
      setMostrarFormulario(false);
    }
  };

  const handleAgregarPuntos = (e) => {
    e.preventDefault();
    if (puntosExtra !== "" && jugadorSeleccionado) {
      onAgregarPuntos(jugadorSeleccionado, Number(puntosExtra));
      setJugadorSeleccionado(null);
      setPuntosExtra("");
    }
  };

  // Solo mostrar el botón para añadir jugadores después de la etapa inicial
  const puedeAñadirJugadores = etapa !== "/jugadores" && etapa !== "/";

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
              style={{ position: "relative" }}
              onClick={() => setJugadorSeleccionado(jugador.nombre)}
            >
              <span
                className="remove-player-btn"
                title={`Eliminar ${jugador.nombre}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemovePlayer(jugador.nombre);
                }}
                aria-label={`Eliminar ${jugador.nombre}`}
                tabIndex={0}
                role="button"
              >
                ×
              </span>
              <div className="player-name">{jugador.nombre}</div>
              <div className="puntaje">{jugador.puntos} pts</div>
              {jugadorSeleccionado === jugador.nombre && (
                <div className="puntos-extra-popup">
                  <form
                    onSubmit={handleAgregarPuntos}
                    className="add-player-form"
                  >
                    <div className="puntos-extra-label">Agregar puntos</div>
                    <input
                      type="number"
                      value={puntosExtra}
                      onChange={(e) =>
                        setPuntosExtra(e.target.value.replace(/^0+(?!$)/, ""))
                      }
                      placeholder="Puntos extra"
                      className="add-player-input"
                      autoFocus
                    />
                    <div className="form-buttons">
                      <button type="submit" className="confirm-btn">
                        +
                      </button>
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setJugadorSeleccionado(null);
                          setPuntosExtra(0);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </form>
                </div>
              )}
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
