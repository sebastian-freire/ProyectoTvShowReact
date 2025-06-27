import { useState } from "react";
import Sidebar from "./components/Sidebar";
import PaginaInicio from "./components/PaginaInicio";
import IngresoJugadores from "./components/IngresoJugadores";
import IngresoEstimaciones from "./components/IngresoEstimaciones";
import IngresoMedidaReal from "./components/IngresoMedidaReal";
import Cortinas from "./components/Cortinas";
import Podio from "./components/Podio";
import ResultadosCompletos from "./components/ResultadosCompletos";
import "./App.css";

const ETAPAS = {
  INICIO: 0,
  JUGADORES: 1,
  ESTIMACIONES: 2,
  MEDIDA_REAL: 3,
  RESULTADOS: 4
};

function App() {
  const [jugadores, setJugadores] = useState([]);
  const [estimaciones, setEstimaciones] = useState([]);
  const [medidaReal, setMedidaReal] = useState(null);
  const [etapa, setEtapa] = useState(ETAPAS.INICIO);
  const [puntajes, setPuntajes] = useState([]);
  const [mostrarCortina, setMostrarCortina] = useState(false);
  const [podioRevelado, setPodioRevelado] = useState(0);
  const [ranking, setRanking] = useState([]);

  // Función para añadir jugadores durante el juego
  const handleAddPlayer = (nombreJugador) => {
    setJugadores((prev) => [...prev, nombreJugador]);
    setPuntajes((prev) => [...prev, 0]); // Nuevo jugador empieza con 0 puntos

    // Si estamos en la etapa de estimaciones, añadir una estimación por defecto
    if (etapa === ETAPAS.ESTIMACIONES) {
      setEstimaciones((prev) => [...prev, 0]); // Estimación por defecto de 0
    }
  };

  // Calcular ranking y puntajes de la ronda
  const calcularRanking = (estimacionesArr, medida) => {
    const diferencias = estimacionesArr.map((e) => Math.abs(e - medida));
    const nuevosPuntajes = estimacionesArr.map((e) => {
      const dif = Math.abs(e - medida);
      if (dif === 0) return 1000;
      return Math.max(0, Math.round(1000 - 1000 * (dif / medida)));
    });
    return jugadores
      .map((j, i) => ({
        nombre: j,
        estimacion: estimacionesArr[i],
        diferencia: diferencias[i],
        puntos: nuevosPuntajes[i]
      }))
      .sort((a, b) => b.puntos - a.puntos);
  };

  // Flujo de pantallas
  let mainContent = null;
  if (etapa === ETAPAS.INICIO) {
    mainContent = (
      <PaginaInicio onComenzar={() => setEtapa(ETAPAS.JUGADORES)} />
    );
  } else if (etapa === ETAPAS.JUGADORES) {
    mainContent = (
      <div className="component-wrapper">
        <IngresoJugadores
          jugadores={jugadores}
          setJugadores={(arr) => {
            setJugadores(arr);
            setPuntajes(arr.map((_, i) => puntajes[i] ?? 0));
          }}
          onContinue={() => setEtapa(ETAPAS.ESTIMACIONES)}
        />
      </div>
    );
  } else if (etapa === ETAPAS.ESTIMACIONES) {
    mainContent = (
      <div className="component-wrapper">
        <IngresoEstimaciones
          jugadores={jugadores}
          onSubmit={(vals) => {
            setEstimaciones(vals);
            setEtapa(ETAPAS.MEDIDA_REAL);
          }}
        />
      </div>
    );
  } else if (etapa === ETAPAS.MEDIDA_REAL) {
    mainContent = (
      <div className="component-wrapper">
        <IngresoMedidaReal
          onSubmit={(valor) => {
            setMedidaReal(valor);
            setMostrarCortina(true);
            const rk = calcularRanking(estimaciones, valor);
            setRanking(rk);
            setPuntajes((prev) =>
              prev.map(
                (p, i) =>
                  p + (rk.find((r) => r.nombre === jugadores[i])?.puntos ?? 0)
              )
            );
            setEtapa(ETAPAS.RESULTADOS); // Cambia de etapa inmediatamente
          }}
        />
      </div>
    );
  } else if (etapa === ETAPAS.RESULTADOS) {
    mainContent = (
      <div className="centered-content">
        <div className="component-wrapper">
          <Podio ranking={ranking} revelado={podioRevelado} />
        </div>
        <button
          className="reveal-button"
          onClick={() => setPodioRevelado((r) => r + 1)}
          disabled={podioRevelado >= 3}
        >
          {podioRevelado === 0
            ? "Revelar 2°"
            : podioRevelado === 1
            ? "Revelar 1°"
            : "Revelar 3°"}
        </button>
        {podioRevelado >= 3 && (
          <div className="component-wrapper">
            <ResultadosCompletos
              ranking={ranking}
              medidaReal={medidaReal}
              onReiniciar={() => {
                setEstimaciones([]);
                setMedidaReal(null);
                setPodioRevelado(0);
                setEtapa(ETAPAS.ESTIMACIONES);
              }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {etapa !== ETAPAS.RESULTADOS && etapa !== ETAPAS.INICIO && (
        <Sidebar
          jugadores={jugadores}
          puntajes={puntajes}
          onAddPlayer={handleAddPlayer}
          etapa={etapa}
        />
      )}
      <div
        className={`main-container ${
          etapa === ETAPAS.RESULTADOS || etapa === ETAPAS.INICIO
            ? "no-sidebar"
            : ""
        }`}
      >
        {mainContent}
        {mostrarCortina && (
          <Cortinas onFinish={() => setMostrarCortina(false)} />
        )}
      </div>
    </>
  );
}

export default App;
