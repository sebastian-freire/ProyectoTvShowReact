import React from "react";
import "./PaginaInicio.css";

export default function PaginaInicio({ onComenzar }) {
  return (
    <div className="pagina-inicio">
      <div className="logo-container-centro">
        <img src="/fondo.png" alt="Logo" className="logo-circular-grande" />
      </div>

      <button className="boton-comenzar" onClick={onComenzar}>
        <span className="boton-texto">COMENZAR A JUGAR</span>
        <div className="boton-efecto"></div>
      </button>

      <div className="decoracion-fondo">
        <div className="circulo circulo-1"></div>
        <div className="circulo circulo-2"></div>
        <div className="circulo circulo-3"></div>
      </div>
    </div>
  );
}
