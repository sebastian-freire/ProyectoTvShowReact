import React, { useEffect } from "react";
import "./Cortinas.css";

export default function Cortinas({ onFinish }) {
  useEffect(() => {
    const left = document.getElementById("cortina-left");
    const right = document.getElementById("cortina-right");
    const text = document.getElementById("cortina-text");
    // Reiniciar estado visual
    left.classList.remove("open");
    right.classList.remove("open");
    left.style.opacity = "1";
    right.style.opacity = "1";
    text.style.opacity = "1";
    text.style.transition = "none";
    // 1. Mostrar el texto durante 2.5s
    setTimeout(() => {
      // 2. Fade out del texto
      text.style.transition = "opacity 1.5s";
      text.style.opacity = "0";
      // 3. Cuando termina el fade out, abrir cortinas
      setTimeout(() => {
        left.classList.add("open");
        right.classList.add("open");
        // 4. Fade out de las cortinas después de la animación de apertura
        setTimeout(() => {
          left.style.transition = "opacity 1.5s";
          right.style.transition = "opacity 1.5s";
          left.style.opacity = "0";
          right.style.opacity = "0";
          setTimeout(() => {
            onFinish();
          }, 1500);
        }, 2000); // Duración de la animación de apertura de cortinas
      }, 1500); // Espera a que termine el fade out del texto
    }, 2500); // Tiempo que el texto está visible
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <div id="cortina-left" className="cortina left" />
      <div id="cortina-right" className="cortina right" />
      <div id="cortina-text" className="cortina-text">
        RESULTADO
      </div>
    </>
  );
}
