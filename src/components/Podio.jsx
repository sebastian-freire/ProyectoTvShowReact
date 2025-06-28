import React, { useEffect, useRef, useState } from "react";
import "./Podio.css";

const ALTURA_MAX = 420; // Mucho más alto para barras épicas
const ALTURA_MIN = 120; // Más diferencia visual
const ANIM_DURATION = 1400; // ms, animación más lenta
const DELAY_BETWEEN = 1200; // ms entre revelaciones

export default function Podio({ ranking, revelado, onFinish }) {
  // Estado interno para controlar el avance automático
  const [autoRevelado, setAutoRevelado] = useState(0);
  const timeoutRef = useRef(null);

  // Cuando el prop 'revelado' cambia a true/1, inicia la secuencia automática
  useEffect(() => {
    if (revelado) {
      setAutoRevelado(0);
      // Iniciar secuencia automática
      let step = 1;
      const next = () => {
        setAutoRevelado(step);
        if (step < 3) {
          timeoutRef.current = setTimeout(() => {
            step++;
            next();
          }, DELAY_BETWEEN);
        } else if (onFinish) {
          // Llama a onFinish cuando termina la animación del podio
          setTimeout(() => onFinish(), DELAY_BETWEEN + ANIM_DURATION);
        }
      };
      timeoutRef.current = setTimeout(next, 500); // pequeño delay inicial
    } else {
      setAutoRevelado(0);
      clearTimeout(timeoutRef.current);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [revelado, onFinish]);

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
      autoRevelado > 0 &&
      !animDone.current[orden[autoRevelado - 1]] &&
      ranking[orden[autoRevelado - 1]]
    ) {
      const idx = orden[autoRevelado - 1];
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
  }, [autoRevelado, ranking]);

  // --- EPIC BACKGROUND & ANIMATIONS ---
  return (
    <div className="epic-podio-bg">
      <div className="epic-lights epic-lights-left" />
      <div className="epic-lights epic-lights-right" />
      <div className="epic-fireworks epic-fireworks-1" />
      <div className="epic-fireworks epic-fireworks-2" />
      <div className="epic-fireworks epic-fireworks-3" />
      <div className="epic-podio-outer">
        <div
          className="epic-podio-bar epic-podio-2"
          style={{ height: animVals[1].h }}
        >
          <div className="epic-badge epic-badge-2">2</div>
          <div className="epic-player epic-player-2">
            {ranking[1]?.nombre ?? ""}
          </div>
          <div className="epic-points">
            {autoRevelado > 1 ? animVals[1].pts : ""} pts
          </div>
          <div className="epic-estimation">
            {ranking[1] && autoRevelado > 1
              ? `${ranking[1].estimacion} cm`
              : ""}
          </div>
        </div>
        <div
          className="epic-podio-bar epic-podio-1"
          style={{ height: animVals[0].h }}
        >
          <div className="epic-badge epic-badge-1">1</div>
          <div className="epic-player epic-player-1">
            {ranking[0]?.nombre ?? ""}
          </div>
          <div className="epic-points">
            {autoRevelado > 2 ? animVals[0].pts : ""} pts
          </div>
          <div className="epic-estimation">
            {ranking[0] && autoRevelado > 2
              ? `${ranking[0].estimacion} cm`
              : ""}
          </div>
        </div>
        <div
          className="epic-podio-bar epic-podio-3"
          style={{ height: animVals[2].h }}
        >
          <div className="epic-badge epic-badge-3">3</div>
          <div className="epic-player epic-player-3">
            {ranking[2]?.nombre ?? ""}
          </div>
          <div className="epic-points">
            {autoRevelado > 0 ? animVals[2].pts : ""} pts
          </div>
          <div className="epic-estimation">
            {ranking[2] && autoRevelado > 0
              ? `${ranking[2].estimacion} cm`
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
