import React, { useEffect, useState } from "react";
import "./ResultadosCompletos.css";

export default function ResultadosCompletos({
  ranking,
  medidaReal,
  onReiniciar
}) {
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Pequeño delay para que aparezcan después de que termine la animación del podio
    const timer = setTimeout(() => {
      setShowResults(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="resultados-completos">
      <h3>Resultados Completos</h3>

      <div className="medida-real-display">🎯 Medida Real: {medidaReal} cm</div>

      {showResults && (
        <div>
          <h4 className="classification-title">Clasificación Completa</h4>
          <ul className="resultados-list">
            {ranking.map((r, idx) => (
              <li key={r.nombre} className="resultado-item">
                <div className="resultado-info">
                  <div className="player-name-result">
                    {idx + 1}° {r.nombre}
                  </div>
                  <div className="player-details">
                    <div className="estimation-detail">
                      📏 Estimación: {r.estimacion} cm
                    </div>
                    <div className="estimation-detail">
                      📊 Diferencia: {r.diferencia.toFixed(1)} cm
                    </div>
                  </div>
                </div>
                <div className="points-display">{r.puntos} pts</div>
              </li>
            ))}
          </ul>
          <button className="restart-button" onClick={onReiniciar}>
            🎮 Jugar de Nuevo
          </button>
        </div>
      )}
    </div>
  );
}
