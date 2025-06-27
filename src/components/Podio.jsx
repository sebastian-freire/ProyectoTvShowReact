import React, { useEffect, useRef, useState } from "react";
import "./Podio.css";

const ALTURA_MAX = 250; // px para 1000 puntos (reducido a la mitad)
const ALTURA_MIN = 100; // px para 0 puntos (reducido para mayor diferencia visual)
const ANIM_DURATION = 1200; // ms

export default function Podio({ ranking, revelado }) {
  // Animación de altura y puntos
  const [animVals, setAnimVals] = useState([
    { h: ALTURA_MIN, pts: 0 },
    { h: ALTURA_MIN, pts: 0 },
    { h: ALTURA_MIN, pts: 0 }
  ]);
  const animRefs = useRef([null, null, null]);
  const animDone = useRef([false, false, false]);

  // Calcula la altura proporcional para cada barra
  const getAltura = (pts) => {
    if (typeof pts !== "number") return ALTURA_MIN;
    return Math.round(
      ALTURA_MIN +
        ((ALTURA_MAX - ALTURA_MIN) * Math.max(0, Math.min(pts, 1000))) / 1000
    );
  };

  // Determinar colores según empate
  const colores = ["oro", "plata", "bronce"];
  const podioColores = [null, null, null];
  if (ranking.length > 0) {
    podioColores[0] = colores[0];
    for (let i = 1; i < 3; i++) {
      if (ranking[i] && ranking[i].puntos === ranking[i - 1].puntos) {
        podioColores[i] = podioColores[i - 1];
      } else {
        podioColores[i] = colores[i];
      }
    }
  }

  // Animar solo la columna que corresponde al nuevo revelado
  useEffect(() => {
    const orden = [2, 1, 0];
    if (
      revelado > 0 &&
      !animDone.current[orden[revelado - 1]] &&
      ranking[orden[revelado - 1]]
    ) {
      const idx = orden[revelado - 1];
      const targetH = getAltura(ranking[idx].puntos);
      const targetPts = ranking[idx].puntos;
      const start = performance.now();
      const animate = (now) => {
        const elapsed = Math.min(1, (now - start) / ANIM_DURATION);
        setAnimVals((prev) => {
          const next = [...prev];
          next[idx] = {
            h: ALTURA_MIN + (targetH - ALTURA_MIN) * elapsed,
            pts: Math.round(targetPts * elapsed)
          };
          return next;
        });
        if (elapsed < 1) {
          animRefs.current[idx] = requestAnimationFrame(animate);
        } else {
          setAnimVals((prev) => {
            const next = [...prev];
            next[idx] = { h: targetH, pts: targetPts };
            return next;
          });
          animDone.current[idx] = true;
        }
      };
      cancelAnimationFrame(animRefs.current[idx]);
      animRefs.current[idx] = requestAnimationFrame(animate);
    }
    // Cleanup
    const currentRefs = animRefs.current;
    return () => currentRefs.forEach((id) => cancelAnimationFrame(id));
  }, [revelado, ranking]);

  return (
    <div className="podio">
      <div className="podio-col podio-2">
        <div className="position-badge position-2">2</div>
        <div
          className={`podio-box ${
            revelado > 1 ? "visible-podium" : "hidden-podium"
          }`}
          style={{
            height: animVals[1].h
          }}
        >
          <div className="player-name">{ranking[1]?.nombre ?? ""}</div>
          <div className="player-points">
            {revelado > 1 ? animVals[1].pts : ""} pts
          </div>
          <div className="player-estimation">
            {ranking[1] && revelado > 1 ? `${ranking[1].estimacion} cm` : ""}
          </div>
        </div>
      </div>

      <div className="podio-col podio-1">
        <div className="position-badge position-1">1</div>
        <div
          className={`podio-box ${
            revelado > 2 ? "visible-podium" : "hidden-podium"
          }`}
          style={{
            height: animVals[0].h
          }}
        >
          <div className="player-name">{ranking[0]?.nombre ?? ""}</div>
          <div className="player-points">
            {revelado > 2 ? animVals[0].pts : ""} pts
          </div>
          <div className="player-estimation">
            {ranking[0] && revelado > 2 ? `${ranking[0].estimacion} cm` : ""}
          </div>
        </div>
      </div>

      <div className="podio-col podio-3">
        <div className="position-badge position-3">3</div>
        <div
          className={`podio-box ${
            revelado > 0 ? "visible-podium" : "hidden-podium"
          }`}
          style={{
            height: animVals[2].h
          }}
        >
          <div className="player-name">{ranking[2]?.nombre ?? ""}</div>
          <div className="player-points">
            {revelado > 0 ? animVals[2].pts : ""} pts
          </div>
          <div className="player-estimation">
            {ranking[2] && revelado > 0 ? `${ranking[2].estimacion} cm` : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
