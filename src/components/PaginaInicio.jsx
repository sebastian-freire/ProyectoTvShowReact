import React from "react";
import "./PaginaInicio.css";

export default function PaginaInicio({ onComenzar }) {
  return (
    <div className="pagina-inicio">
      <div className="logo-container">
        <img src="/fondo.png" alt="Logo" className="logo-circular" />
      </div>

      <div className="inicio-container">
        <div className="titulo-principal">
          <h1 className="titulo-juego">
            <span className="titulo-linea">JUEGO DE</span>
            <span className="titulo-linea destacado">ESTIMACIONES</span>
          </h1>
          <p className="subtitulo">¿Qué tan bueno eres adivinando medidas?</p>
        </div>

        <div className="descripcion-juego">
          <div className="icono-juego">🎯</div>
          <p>
            Compite con tus amigos para ver quién puede estimar mejor las
            medidas reales
          </p>
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
    </div>
  );
}
