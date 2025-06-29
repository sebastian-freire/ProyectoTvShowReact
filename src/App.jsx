import { useState, createContext, useContext, useEffect } from "react";
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
import FloatingBackButton from "./components/FloatingBackButton";
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

// Clave para localStorage
const GAME_STORAGE_KEY = "adivinaLaMedida_gameState";

// Función para cargar estado desde localStorage
const loadGameState = () => {
  try {
    const savedState = localStorage.getItem(GAME_STORAGE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.warn("Error al cargar estado del juego:", error);
  }
  return {
    jugadores: [],
    estimaciones: [],
    medidaReal: null,
    puntajes: [],
    mostrarCortina: false,
    podioRevelado: false,
    mostrarResultados: false,
    ranking: [],
    cortinaTerminada: false
  };
};

// Función para guardar estado en localStorage
const saveGameState = (state) => {
  try {
    localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Error al guardar estado del juego:", error);
  }
};

// Componente proveedor del contexto
function GameProvider({ children }) {
  // Cargar estado inicial desde localStorage
  const initialState = loadGameState();

  const [jugadores, setJugadores] = useState(initialState.jugadores);
  const [estimaciones, setEstimaciones] = useState(initialState.estimaciones);
  const [medidaReal, setMedidaReal] = useState(initialState.medidaReal);
  const [puntajes, setPuntajes] = useState(initialState.puntajes);
  const [mostrarCortina, setMostrarCortina] = useState(
    initialState.mostrarCortina
  );
  const [podioRevelado, setPodioRevelado] = useState(
    initialState.podioRevelado
  );
  const [mostrarResultados, setMostrarResultados] = useState(
    initialState.mostrarResultados
  );
  const [ranking, setRanking] = useState(initialState.ranking);
  const [cortinaTerminada, setCortinaTerminada] = useState(
    initialState.cortinaTerminada
  );

  // Guardar estado automáticamente cuando cambie
  useEffect(() => {
    const currentState = {
      jugadores,
      estimaciones,
      medidaReal,
      puntajes,
      mostrarCortina,
      podioRevelado,
      mostrarResultados,
      ranking,
      cortinaTerminada
    };
    saveGameState(currentState);
  }, [
    jugadores,
    estimaciones,
    medidaReal,
    puntajes,
    mostrarCortina,
    podioRevelado,
    mostrarResultados,
    ranking,
    cortinaTerminada
  ]);

  // Función para limpiar el localStorage (reiniciar juego)
  const limpiarPartidaGuardada = () => {
    try {
      localStorage.removeItem(GAME_STORAGE_KEY);
    } catch (error) {
      console.warn("Error al limpiar partida guardada:", error);
    }
  };

  // Función para añadir jugadores durante el juego
  const handleAddPlayer = (nombreJugador) => {
    setJugadores((prev) => [...prev, nombreJugador]);
    setPuntajes((prev) => [...prev, 0]); // Nuevo jugador empieza con 0 puntos
    setEstimaciones((prev) => [...prev, 0]); // Estimación por defecto de 0
  };

  // Función para eliminar un jugador y su puntaje/estimación
  const handleRemovePlayer = (nombreJugador) => {
    setJugadores((prev) => prev.filter((j) => j !== nombreJugador));
    setPuntajes((prev) => {
      const idx = jugadores.indexOf(nombreJugador);
      return prev.filter((_, i) => i !== idx);
    });
    setEstimaciones((prev) => {
      const idx = jugadores.indexOf(nombreJugador);
      return prev.filter((_, i) => i !== idx);
    });
  };

  // Función para agregar puntos extra a un jugador
  function handleAgregarPuntos(nombreJugador, puntos) {
    setPuntajes((prev) => {
      const idx = jugadores.indexOf(nombreJugador);
      if (idx === -1) return prev;
      const nuevos = [...prev];
      nuevos[idx] = (nuevos[idx] ?? 0) + puntos;
      return nuevos;
    });
  }

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
    handleRemovePlayer,
    handleAgregarPuntos,
    calcularRanking,
    limpiarPartidaGuardada // Añadido para poder limpiar la partida guardada
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// Componentes de las páginas
function InicioPage() {
  const navigate = useNavigate();
  const {
    limpiarPartidaGuardada,
    jugadores,
    estimaciones,
    medidaReal,
    setJugadores,
    setEstimaciones,
    setMedidaReal,
    setPuntajes,
    setMostrarCortina,
    setPodioRevelado,
    setMostrarResultados,
    setRanking,
    setCortinaTerminada
  } = useGame();

  // Verificar si hay una partida guardada
  const hayPartidaGuardada =
    jugadores.length > 0 || estimaciones.length > 0 || medidaReal !== null;

  const continuarPartida = () => {
    // Determinar a qué página navegar según el estado del juego
    if (medidaReal !== null) {
      // Si ya hay medida real, ir a resultados
      navigate("/resultados");
    } else if (estimaciones.length > 0) {
      // Si ya hay estimaciones, ir a medida real
      navigate("/medida-real");
    } else if (jugadores.length > 0) {
      // Si solo hay jugadores, ir a estimaciones
      navigate("/estimaciones");
    } else {
      // Por defecto, ir a jugadores
      navigate("/jugadores");
    }
  };

  const empezarNuevaPartida = () => {
    // Limpiar localStorage
    limpiarPartidaGuardada();

    // Resetear todos los estados directamente
    setJugadores([]);
    setEstimaciones([]);
    setMedidaReal(null);
    setPuntajes([]);
    setMostrarCortina(false);
    setPodioRevelado(false);
    setMostrarResultados(false);
    setRanking([]);
    setCortinaTerminada(false);

    // Navegar directamente a la página de jugadores
    navigate("/jugadores");
  };

  return (
    <PaginaInicio
      onComenzar={continuarPartida}
      onEmpezarDeNuevo={empezarNuevaPartida}
      hayPartidaGuardada={hayPartidaGuardada}
    />
  );
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
          // Limpiar todos los estados primero
          setPodioRevelado(false);
          setCortinaTerminada(false);
          setMostrarResultados(false);

          // Luego establecer los nuevos valores
          setMedidaReal(valor);
          setMostrarCortina(true);

          // Calcular ranking y actualizar puntajes
          const rk = calcularRanking(estimaciones, valor);
          setRanking(rk);
          setPuntajes((prev) =>
            prev.map(
              (p, i) =>
                p + (rk.find((r) => r.nombre === jugadores[i])?.puntos ?? 0)
            )
          );

          // Navegar a la página de resultados
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
    setPodioRevelado,
    mostrarResultados,
    medidaReal
  } = useGame();

  // Variable para controlar que solo se llame a onFinish una vez
  const [animacionCompletada, setAnimacionCompletada] = useState(false);

  // Reset del estado cuando se monta el componente
  useEffect(() => {
    // Al montar, reiniciamos el estado de animación
    setAnimacionCompletada(false);

    // Limpieza al desmontar
    return () => {
      // No hacemos nada específico al desmontar
    };
  }, []);

  return (
    <div className="centered-content">
      <div className="component-wrapper">
        {!mostrarResultados && (
          <Podio
            ranking={ranking}
            medidaReal={medidaReal}
            revelado={cortinaTerminada && !animacionCompletada}
            onFinish={() => {
              setPodioRevelado(true);
              setAnimacionCompletada(true);
            }}
            onVerResultadosCompletos={() => navigate("/resultados-completos")}
          />
        )}
      </div>
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
  const navigate = useNavigate();
  const {
    jugadores,
    puntajes,
    handleAddPlayer,
    handleRemovePlayer,
    handleAgregarPuntos
  } = useGame();

  const showSidebar = !["/", "/resultados", "/resultados-completos"].includes(
    location.pathname
  );
  const isFullWidth = ["/", "/resultados", "/resultados-completos"].includes(
    location.pathname
  );

  // Determinar si mostrar el botón de volver y su funcionalidad
  const getBackButtonConfig = () => {
    switch (location.pathname) {
      case "/jugadores":
        return {
          show: true,
          onClick: () => navigate("/"),
          title: "Volver al inicio"
        };
      case "/estimaciones":
        return {
          show: true,
          onClick: () => navigate("/jugadores"),
          title: "Volver a ingresar jugadores"
        };
      case "/medida-real":
        return {
          show: true,
          onClick: () => navigate("/estimaciones"),
          title: "Volver a estimaciones"
        };
      default:
        return { show: false };
    }
  };

  const backButtonConfig = getBackButtonConfig();
  console.log(
    "AppLayout - Current path:",
    location.pathname,
    "Button config:",
    backButtonConfig
  ); // Debug log

  return (
    <>
      {backButtonConfig.show && (
        <FloatingBackButton
          onClick={backButtonConfig.onClick}
          title={backButtonConfig.title}
        />
      )}
      {showSidebar && (
        <Sidebar
          jugadores={jugadores}
          puntajes={puntajes}
          onAddPlayer={handleAddPlayer}
          onRemovePlayer={handleRemovePlayer}
          onAgregarPuntos={handleAgregarPuntos}
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
