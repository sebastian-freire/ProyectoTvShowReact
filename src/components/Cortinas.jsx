import React, { useEffect } from "react";
import "./Cortinas.css";

export default function Cortinas({ onFinish }) {
  useEffect(() => {
    const left = document.getElementById("cortina-left");
    const right = document.getElementById("cortina-right");
    const text = document.getElementById("cortina-text");
    setTimeout(() => {
      left.classList.add("open");
      right.classList.add("open");
      setTimeout(() => {
        left.style.transition = "opacity 1.5s";
        right.style.transition = "opacity 1.5s";
        text.style.transition = "opacity 1.5s";
        left.style.opacity = "0";
        right.style.opacity = "0";
        text.style.opacity = "0";
        setTimeout(() => {
          onFinish();
        }, 1500);
      }, 4000);
    }, 1200);
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
