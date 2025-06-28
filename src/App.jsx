import { useState, createContext, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import PaginaInicio from "./components/PaginaInicio";
import IngresoJugadores from "./components/IngresoJugadores";
import IngresoEstimaciones from "./components/IngresoEstimaciones";
import IngresoMedidaReal from "./components/IngresoMedidaReal";
import Cortinas from "./components/Cortinas";
import Podio from "./components/Podio";
import ResultadosCompletos from "./components/ResultadosCompletos";
import "./App.css";

// Contexto para compartir el estado entre rutas
const GameContext = createContext();

// Hook para usar el contexto del juego
const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame debe ser usado dentro de GameProvider");
  }
  return context;
};

// Componente proveedor del contexto
function GameProvider({ children }) {
  const [jugadores, setJugadores] = useState([]);
  const [estimaciones, setEstimaciones] = useState([]);
  const [medidaReal, setMedidaReal] = useState(null);
  const [puntajes, setPuntajes] = useState([]);
  const [mostrarCortina, setMostrarCortina] = useState(false);
  const [podioRevelado, setPodioRevelado] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [ranking, setRanking] = useState([]);
  const [cortinaTerminada, setCortinaTerminada] = useState(false);

  // Función para añadir jugadores durante el juego
  const handleAddPlayer = (nombreJugador) => {
    setJugadores((prev) => [...prev, nombreJugador]);
    setPuntajes((prev) => [...prev, 0]); // Nuevo jugador empieza con 0 puntos
    setEstimaciones((prev) => [...prev, 0]); // Estimación por defecto de 0
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

  const value = {
    jugadores,
    setJugadores,
    estimaciones,
    setEstimaciones,
    medidaReal,
    setMedidaReal,
    puntajes,
    setPuntajes,
    mostrarCortina,
    setMostrarCortina,
    podioRevelado,
    setPodioRevelado,
    mostrarResultados,
    setMostrarResultados,
    ranking,
    setRanking,
    cortinaTerminada,
    setCortinaTerminada,
    handleAddPlayer,
    calcularRanking
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// Componentes de las páginas
function InicioPage() {
  const navigate = useNavigate();

  return <PaginaInicio onComenzar={() => navigate("/jugadores")} />;
}

function JugadoresPage() {
  const navigate = useNavigate();
  const { jugadores, setJugadores, setPuntajes, puntajes } = useGame();

  return (
    <div className="component-wrapper">
      <IngresoJugadores
        jugadores={jugadores}
        setJugadores={(arr) => {
          setJugadores(arr);
          setPuntajes(arr.map((_, i) => puntajes[i] ?? 0));
        }}
        onContinue={() => navigate("/estimaciones")}
      />
    </div>
  );
}

function EstimacionesPage() {
  const navigate = useNavigate();
  const { jugadores, setEstimaciones } = useGame();

  return (
    <div className="component-wrapper">
      <IngresoEstimaciones
        jugadores={jugadores}
        onSubmit={(vals) => {
          setEstimaciones(vals);
          navigate("/medida-real");
        }}
      />
    </div>
  );
}

function MedidaRealPage() {
  const navigate = useNavigate();
  const {
    estimaciones,
    setMedidaReal,
    setMostrarCortina,
    setCortinaTerminada,
    setPodioRevelado,
    setMostrarResultados,
    setRanking,
    setPuntajes,
    jugadores,
    calcularRanking
  } = useGame();

  return (
    <div className="component-wrapper">
      <IngresoMedidaReal
        onSubmit={(valor) => {
          setMedidaReal(valor);
          setMostrarCortina(true);
          setCortinaTerminada(false);
          setPodioRevelado(false);
          setMostrarResultados(false);
          const rk = calcularRanking(estimaciones, valor);
          setRanking(rk);
          setPuntajes((prev) =>
            prev.map(
              (p, i) =>
                p + (rk.find((r) => r.nombre === jugadores[i])?.puntos ?? 0)
            )
          );
          navigate("/resultados");
        }}
      />
    </div>
  );
}

function ResultadosPage() {
  const navigate = useNavigate();
  const {
    ranking,
    mostrarCortina,
    cortinaTerminada,
    setCortinaTerminada,
    podioRevelado,
    setPodioRevelado,
    mostrarResultados
  } = useGame();

  return (
    <div className="centered-content">
      <div className="component-wrapper">
        {!mostrarResultados && (
          <Podio
            ranking={ranking}
            revelado={cortinaTerminada}
            onFinish={() => {
              setPodioRevelado(true);
              setTimeout(() => {
                navigate("/resultados-completos");
              }, 3000);
            }}
          />
        )}
      </div>
      {podioRevelado && !mostrarResultados && (
        <button
          className="reveal-button"
          onClick={() => navigate("/resultados-completos")}
        >
          Ver Resultados Completos
        </button>
      )}
      {mostrarCortina && (
        <Cortinas onFinish={() => setCortinaTerminada(true)} />
      )}
    </div>
  );
}

function ResultadosCompletosPage() {
  const navigate = useNavigate();
  const {
    ranking,
    medidaReal,
    setEstimaciones,
    setMedidaReal: resetMedidaReal,
    setPodioRevelado,
    setMostrarResultados
  } = useGame();

  return (
    <ResultadosCompletos
      ranking={ranking}
      medidaReal={medidaReal}
      onReiniciar={() => {
        setEstimaciones([]);
        resetMedidaReal(null);
        setPodioRevelado(false);
        setMostrarResultados(false);
        navigate("/estimaciones");
      }}
    />
  );
}

// Layout principal con sidebar
function AppLayout() {
  const location = useLocation();
  const { jugadores, puntajes, handleAddPlayer } = useGame();

  const showSidebar = !["/", "/resultados", "/resultados-completos"].includes(
    location.pathname
  );
  const isFullWidth = ["/", "/resultados", "/resultados-completos"].includes(
    location.pathname
  );

  return (
    <>
      {showSidebar && (
        <Sidebar
          jugadores={jugadores}
          puntajes={puntajes}
          onAddPlayer={handleAddPlayer}
          etapa={location.pathname}
        />
      )}
      <div className={`main-container ${isFullWidth ? "no-sidebar" : ""}`}>
        <Routes>
          <Route path="/" element={<InicioPage />} />
          <Route path="/jugadores" element={<JugadoresPage />} />
          <Route path="/estimaciones" element={<EstimacionesPage />} />
          <Route path="/medida-real" element={<MedidaRealPage />} />
          <Route path="/resultados" element={<ResultadosPage />} />
          <Route
            path="/resultados-completos"
            element={<ResultadosCompletosPage />}
          />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <GameProvider>
        <AppLayout />
      </GameProvider>
    </Router>
  );
}

export default App;
