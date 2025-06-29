import React, { useEffect, useRef, useState } from "react";
import "./Podio.css";

// Proporciones relativas para los podios (1ro, 2do, 3ro)
const ALTURA_PRIMERO = 0.52; // 100%
const ALTURA_SEGUNDO = 0.4; // 78%
const ALTURA_TERCERO = 0.3; // 64%
const ANIM_DURATION = 2500; // ms, animación más lenta (era 1200ms)
const DELAY_BETWEEN = 1500; // ms entre revelaciones (era 1000ms)

export default function Podio({
  ranking,
  medidaReal,
  revelado,
  onFinish,
  onVerResultadosCompletos
}) {
  // Estado interno para controlar el avance automático
  const [autoRevelado, setAutoRevelado] = useState(0);
  const timeoutRef = useRef(null);
  const isAnimatingRef = useRef(false);

  // Estado para controlar la animación de los nombres
  const [nombreVisible, setNombreVisible] = useState([false, false, false]);

  // Animación de puntos y centímetros y el estado actual de cada podio
  const [animVals, setAnimVals] = useState([
    { pts: 0, cms: "0.0" },
    { pts: 0, cms: "0.0" },
    { pts: 0, cms: "0.0" }
  ]);
  const animDone = useRef([false, false, false]);

  // Estado para mantener las barras visibles incluso después de terminar la animación
  const [animacionFinalizada, setAnimacionFinalizada] = useState(false);

  // Estado para controlar si es la primera vez que aparece el botón
  const [primeraVezBoton, setPrimeraVezBoton] = useState(true);

  // Cuando el prop 'revelado' cambia a true, inicia la secuencia automática
  useEffect(() => {
    const resetAnimation = () => {
      // Reiniciar todos los estados y referencias
      setAnimVals([
        { pts: 0, cms: "0.0" },
        { pts: 0, cms: "0.0" },
        { pts: 0, cms: "0.0" }
      ]);
      setNombreVisible([false, false, false]);
      setAnimacionFinalizada(false);
      setAutoRevelado(0);
      setPrimeraVezBoton(true); // Resetear para que la animación se ejecute de nuevo
      animDone.current = [false, false, false];
      isAnimatingRef.current = false;
      clearTimeout(timeoutRef.current);
    };

    if (revelado && !isAnimatingRef.current) {
      // Si la animación ya se completó anteriormente, reiniciamos todo
      if (animacionFinalizada) {
        resetAnimation();
      }

      // Reiniciar el estado de animación
      setAnimVals([
        { pts: 0, cms: "0.0" },
        { pts: 0, cms: "0.0" },
        { pts: 0, cms: "0.0" }
      ]);

      // Solo reiniciar visibilidad de nombres si es la primera animación
      if (autoRevelado === 0) {
        setNombreVisible([false, false, false]);
      }

      // Resetear animacionFinalizada si comenzamos una nueva animación
      setAnimacionFinalizada(false);

      animDone.current = [false, false, false];

      // Limpiar timeouts previos
      clearTimeout(timeoutRef.current);

      // Marcar como animando
      isAnimatingRef.current = true;
      setAutoRevelado(0);

      // Iniciar secuencia automática
      const animacionSecuencial = () => {
        // Primer paso: mostrar el tercer puesto (índice 2)
        setAutoRevelado(1);
        setTimeout(() => {
          setNombreVisible((prev) => {
            const nuevo = [...prev];
            nuevo[2] = true; // Mostrar nombre del 3er puesto
            return nuevo;
          });

          // Segundo paso: mostrar el segundo puesto (índice 1)
          setTimeout(() => {
            setAutoRevelado(2);
            setTimeout(() => {
              setNombreVisible((prev) => {
                const nuevo = [...prev];
                nuevo[1] = true; // Mostrar nombre del 2do puesto
                return nuevo;
              });

              // Tercer paso: mostrar el primer puesto (índice 0)
              setTimeout(() => {
                setAutoRevelado(3);
                setTimeout(() => {
                  setNombreVisible((prev) => {
                    const nuevo = [...prev];
                    nuevo[0] = true; // Mostrar nombre del 1er puesto
                    return nuevo;
                  });

                  // Finalmente, llamar a onFinish cuando toda la animación termina
                  setTimeout(() => {
                    // Aseguramos que todos los nombres estén visibles al finalizar
                    setNombreVisible([true, true, true]);
                    // Indicar que la animación ha finalizado para mantener las barras arriba
                    setAnimacionFinalizada(true);
                    if (onFinish) {
                      onFinish();
                    }
                    isAnimatingRef.current = false;
                  }, DELAY_BETWEEN);
                }, ANIM_DURATION * 0.8);
              }, DELAY_BETWEEN);
            }, ANIM_DURATION * 0.8);
          }, DELAY_BETWEEN);
        }, ANIM_DURATION * 0.8);
      };

      // Pequeño delay inicial
      timeoutRef.current = setTimeout(animacionSecuencial, 500);
    } else if (!revelado) {
      // Si revelado cambia a false, detenemos cualquier animación en progreso
      // pero mantenemos las alturas de las barras y la visibilidad de los nombres
      clearTimeout(timeoutRef.current);
      isAnimatingRef.current = false;
      // No reiniciamos autoRevelado ni animacionFinalizada para mantener el estado visual
    }

    // Cleanup function
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [revelado, onFinish, autoRevelado, animacionFinalizada]);

  // Actualizar los puntos de la posición actual
  useEffect(() => {
    // Si la animación ya finalizó o no hay revelado, no hacemos nada
    if (autoRevelado <= 0 || (animacionFinalizada && autoRevelado >= 3)) return;

    // Determinar qué posición está siendo revelada actualmente
    let posicionesAAnimar = [];
    if (autoRevelado >= 1) posicionesAAnimar.push(2); // Tercero
    if (autoRevelado >= 2) posicionesAAnimar.push(1); // Segundo
    if (autoRevelado >= 3) posicionesAAnimar.push(0); // Primero

    // Animar cada posición que corresponda
    posicionesAAnimar.forEach((idx) => {
      // Si ya se animó esta barra o no hay datos para ella, salimos
      if (animDone.current[idx] || !ranking[idx]) return;

      const targetPts = ranking[idx].puntos;
      const targetCms = ranking[idx].estimacion;
      let startTime = null;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(1, elapsed / ANIM_DURATION);

        setAnimVals((prev) => {
          const next = [...prev];
          next[idx] = {
            pts: Math.round(targetPts * progress),
            // Formato con un decimal para los cm, manteniendo siempre un decimal
            cms: (targetCms * progress).toFixed(1)
          };
          return next;
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setAnimVals((prev) => {
            const next = [...prev];
            next[idx] = {
              pts: targetPts,
              cms: targetCms.toFixed(1)
            };
            return next;
          });
          animDone.current[idx] = true;
        }
      };

      requestAnimationFrame(animate);
    });
  }, [autoRevelado, ranking, animacionFinalizada]);

  // Obtener la altura según la posición y el contenedor
  const getBarraHeight = (posicion, maxHeightPx) => {
    switch (posicion) {
      case 0:
        return maxHeightPx * ALTURA_PRIMERO;
      case 1:
        return maxHeightPx * ALTURA_SEGUNDO;
      case 2:
        return maxHeightPx * ALTURA_TERCERO;
      default:
        return maxHeightPx * ALTURA_TERCERO;
    }
  };

  // Hook para obtener el alto disponible del podio
  const podioOuterRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState(360); // valor por defecto

  useEffect(() => {
    const updateHeight = () => {
      if (podioOuterRef.current) {
        setMaxHeight(podioOuterRef.current.offsetHeight || 360);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div className="epic-podio-bg">
      <div className="epic-lights epic-lights-left" />
      <div className="epic-lights epic-lights-right" />
      <div className="epic-fireworks epic-fireworks-1" />
      <div className="epic-fireworks epic-fireworks-2" />
      <div className="epic-fireworks epic-fireworks-3" />

      {/* Revelación épica de la medida real */}
      {animacionFinalizada && (
        <div
          className={`epic-medida-real ${primeraVezBoton ? "revealing" : ""}`}
        >
          <div className="epic-medida-title">¡MEDIDA REAL!</div>
          <div className="epic-medida-value">
            <span className="epic-numero">{medidaReal}</span>
            <span className="epic-unidad">cm</span>
          </div>
          <div className="epic-medida-sparkles">
            <div className="sparkle sparkle-1"></div>
            <div className="sparkle sparkle-2"></div>
            <div className="sparkle sparkle-3"></div>
            <div className="sparkle sparkle-4"></div>
            <div className="sparkle sparkle-5"></div>
            <div className="sparkle sparkle-6"></div>
          </div>
        </div>
      )}

      {/* Área para botón de resultados completos */}
      <div className="podio-footer"></div>

      <div className="epic-podio-outer" ref={podioOuterRef}>
        <div
          className="epic-podio-bar epic-podio-2"
          style={{
            height: animacionFinalizada
              ? getBarraHeight(1, maxHeight)
              : autoRevelado >= 2
              ? getBarraHeight(1, maxHeight)
              : "0px"
          }}
        >
          <div className={`epic-badge epic-badge-2`}>2</div>
          <div
            className={`epic-player epic-player-2 ${
              nombreVisible[1] ? "animate" : ""
            }`}
          >
            {ranking[1]?.nombre ?? ""}
          </div>
          <div className="epic-points">{animVals[1].pts} pts</div>
          <div className="epic-estimation">
            <span className="epic-cm-value">{animVals[1].cms}</span> cm
          </div>
        </div>
        <div
          className="epic-podio-bar epic-podio-1"
          style={{
            height: animacionFinalizada
              ? getBarraHeight(0, maxHeight)
              : autoRevelado >= 3
              ? getBarraHeight(0, maxHeight)
              : "0px"
          }}
        >
          <div className={`epic-badge epic-badge-1`}>1</div>
          <div
            className={`epic-player epic-player-1 ${
              nombreVisible[0] ? "animate" : ""
            }`}
          >
            {ranking[0]?.nombre ?? ""}
          </div>
          <div className="epic-points">{animVals[0].pts} pts</div>
          <div className="epic-estimation">
            <span className="epic-cm-value">{animVals[0].cms}</span> cm
          </div>
        </div>
        <div
          className="epic-podio-bar epic-podio-3"
          style={{
            height: animacionFinalizada
              ? getBarraHeight(2, maxHeight)
              : autoRevelado >= 1
              ? getBarraHeight(2, maxHeight)
              : "0px"
          }}
        >
          <div className={`epic-badge epic-badge-3`}>3</div>
          <div
            className={`epic-player epic-player-3 ${
              nombreVisible[2] ? "animate" : ""
            }`}
          >
            {ranking[2]?.nombre ?? ""}
          </div>
          <div className="epic-points">{animVals[2].pts} pts</div>
          <div className="epic-estimation">
            <span className="epic-cm-value">{animVals[2].cms}</span> cm
          </div>
        </div>
      </div>

      {/* Botón de Ver Resultados Completos con animación de entrada solo la primera vez */}
      {animacionFinalizada && (
        <button
          className={`reveal-button ${primeraVezBoton ? "entering" : ""}`}
          onClick={() => {
            setPrimeraVezBoton(false); // Ya no es la primera vez
            onVerResultadosCompletos();
          }}
          onAnimationEnd={() => {
            // Remover la clase entering cuando termine la animación
            setPrimeraVezBoton(false);
          }}
        >
          Ver Resultados Completos
        </button>
      )}
    </div>
  );
}
