import React from "react";
import "./FloatingBackButton.css";

export default function FloatingBackButton({
  onClick,
  title = "Volver",
  show = true
}) {
  if (!show) return null;

  return (
    <button onClick={onClick} className="floating-back-button" title={title}>
      ← Volver
    </button>
  );
}
