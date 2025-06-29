import React from "react";
import "./PaginaInicio.css";

export default function PaginaInicio({
  onComenzar,
  onEmpezarDeNuevo,
  hayPartidaGuardada
}) {
  return (
    <div className="pagina-inicio">
      <div className="logo-container-centro">
        <img src="/fondo.png" alt="Logo" className="logo-circular-grande" />
      </div>

      <div className="botones-container">
        <button className="boton-comenzar" onClick={onComenzar}>
          <span className="boton-texto">
            {hayPartidaGuardada ? "CONTINUAR PARTIDA" : "COMENZAR A JUGAR"}
          </span>
          <div className="boton-efecto"></div>
        </button>

        {hayPartidaGuardada && (
          <button className="boton-nuevo-juego" onClick={onEmpezarDeNuevo}>
            <span className="boton-texto">NUEVA PARTIDA</span>
            <div className="boton-efecto"></div>
          </button>
        )}
      </div>

      <div className="decoracion-fondo">
        <div className="circulo circulo-1"></div>
        <div className="circulo circulo-2"></div>
        <div className="circulo circulo-3"></div>
      </div>
    </div>
  );
}
