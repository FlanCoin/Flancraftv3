import { useEffect, useState, useRef, useLayoutEffect, useCallback } from "react";
import { Lock, CheckCircle } from "lucide-react";
import "../styles/pages/dashboard/_rewardlist.scss";

const RECOMPENSAS = [
  { nivel: 1, descripcion: "17 ECOS", tipo: "eco" },
  { nivel: 5, descripcion: "134 ECOS", tipo: "eco" },
  { nivel: 10, descripcion: "255 ECOS", tipo: "eco" },
  { nivel: 15, descripcion: "351 ECOS", tipo: "eco" },
  { nivel: 20, descripcion: "431 ECOS", tipo: "eco" },
  { nivel: 25, descripcion: "501 ECOS", tipo: "eco" },
  { nivel: 30, descripcion: "562 ECOS", tipo: "eco" },
  { nivel: 35, descripcion: "617 ECOS", tipo: "eco" },
  { nivel: 40, descripcion: "671 ECOS", tipo: "eco" },
  { nivel: 45, descripcion: "717 ECOS", tipo: "eco" },
  { nivel: 50, descripcion: "744 ECOS", tipo: "eco" },
];

export default function RewardList({ user, xpData, ecosRef }) {
  const [reclamadas, setReclamadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const nodo1Ref = useRef(null);
  const nodoFinalRef = useRef(null);
  const [offsetNodo1, setOffsetNodo1] = useState(0);
  const [anchoBarra, setAnchoBarra] = useState("0px");

  useEffect(() => {
    fetch(`https://flancraftweb-backend.onrender.com/api/recompensas/reclamadas/${user.uuid}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setReclamadas(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.uuid]);

  const calcularProgresoVisual = useCallback(() => {
    if (!xpData) return 0;
    const niveles = xpData.niveles;
    const xpActual = xpData.xp_total_actual;
    const xpMinimo = niveles.find(n => n.nivel === 1)?.xp_total_acumulada || 0;
    if (xpActual <= xpMinimo) return 0;
    const nodos = RECOMPENSAS.map(r =>
      niveles.find(n => n.nivel === r.nivel)?.xp_total_acumulada || 0
    );
    const totalTramos = nodos.length - 1;
    for (let i = 0; i < totalTramos; i++) {
      const inicio = nodos[i];
      const fin = nodos[i + 1];
      if (xpActual >= fin) continue;
      const progresoRelativo = (xpActual - inicio) / (fin - inicio);
      return ((i + progresoRelativo) / totalTramos) * 100;
    }
    return 100;
  }, [xpData]);

  useLayoutEffect(() => {
    if (nodo1Ref.current && nodoFinalRef.current && xpData) {
      const left = nodo1Ref.current.offsetLeft + nodo1Ref.current.offsetWidth / 2;
      setOffsetNodo1(left);

      const totalWidth = nodoFinalRef.current.offsetLeft + nodoFinalRef.current.offsetWidth / 2 - left;
      const porcentaje = calcularProgresoVisual();

      if (porcentaje <= 0) {
        setAnchoBarra("0px");
      } else if (porcentaje >= 100) {
        setAnchoBarra(`${totalWidth}px`);
      } else {
        setAnchoBarra(`${(totalWidth * porcentaje) / 100}px`);
      }
    }
  }, [xpData, calcularProgresoVisual]);

  const animateCounter = (start, end, duration, updateFn) => {
    const startTime = performance.now();
    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (end - start) * progress);
      updateFn(current);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const lanzarMonedasAnimadas = (origen, destino, cantidad) => {
    const startRect = origen.getBoundingClientRect();
    const endRect = destino.getBoundingClientRect();
    const maxMonedas = Math.min(cantidad, 40);

    for (let i = 0; i < maxMonedas; i++) {
      const moneda = document.createElement("img");
      moneda.src = "/assets/eco.png";
      moneda.className = "eco-fly";
      document.body.appendChild(moneda);

      const startX = startRect.left + startRect.width / 2;
      const startY = startRect.top + startRect.height / 2;
      const endX = endRect.left + endRect.width / 2;
      const endY = endRect.top + endRect.height / 2;

      moneda.style.position = "fixed";
      moneda.style.left = `${startX}px`;
      moneda.style.top = `${startY}px`;
      moneda.style.width = "24px";
      moneda.style.transition = "transform 0.6s ease-in-out, opacity 0.6s ease-in-out";
      moneda.style.pointerEvents = "none";
      moneda.style.zIndex = "9999";

      // forzar reflow
      moneda.getBoundingClientRect();

      // animar
      moneda.style.transform = `translate(${endX - startX + (Math.random() * 30 - 15)}px, ${endY - startY + (Math.random() * 30 - 15)}px) scale(0.5)`;
      moneda.style.opacity = "0";

      setTimeout(() => moneda.remove(), 700 + Math.random() * 300);
    }
  };

  const handleReclamar = async (nivel) => {
    const recompensa = RECOMPENSAS.find(r => r.nivel === nivel);
    const cantidadEco = parseInt(recompensa.descripcion);

    try {
      const res = await fetch("https://flancraftweb-backend.onrender.com/api/recompensas/reclamar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid: user.uuid, nivel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const nodo = document.querySelector(`.reward-slot:nth-child(${RECOMPENSAS.findIndex(r => r.nivel === nivel) + 1}) .reward-icon`);
      const destino = ecosRef.current;

      if (nodo && destino) {
        lanzarMonedasAnimadas(nodo, destino, cantidadEco);
      }

      const prevEcos = parseInt(ecosRef.current.textContent || 0);
      const nuevoTotal = prevEcos + cantidadEco;
      animateCounter(prevEcos, nuevoTotal, 1000, (val) => {
        if (ecosRef.current) ecosRef.current.textContent = val;
      });

      setReclamadas([...reclamadas, nivel]);

    } catch (err) {
      console.error("Error reclamando recompensa:", err.message);
    }
  };

  const calcularProgreso = (nivel, index) => {
    if (!xpData) return "pendiente";
    const nodoXP = xpData.niveles.find(n => n.nivel === nivel)?.xp_total_acumulada || 0;
    const progresoActual = xpData.xp_total_actual;
    if (progresoActual >= nodoXP) return "progresado";
    const anteriorNodo = RECOMPENSAS[index - 1];
    const xpAnterior = anteriorNodo
      ? xpData.niveles.find(n => n.nivel === anteriorNodo.nivel)?.xp_total_acumulada || 0
      : 0;
    if (progresoActual >= xpAnterior && progresoActual < nodoXP) return "siguiente";
    return "pendiente";
  };

  const scrollBy = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 300, behavior: "smooth" });
    }
  };

  return (
    <div className="reward-pass">
      <h2 className="titulo-reward">Recompensas de Nivel</h2>

      <div className="rewards-scroll-container">
        <div className="scroll-button scroll-left" onClick={() => scrollBy(-1)} />
        <div className="scroll-button scroll-right" onClick={() => scrollBy(1)} />
        <div className="fade-left" />
        <div className="fade-right" />

        <div className="rewards-wrapper" ref={scrollRef}>
          <div className="rewards-row">
            <div className="progreso-wrapper">
              <div className="linea-fondo"></div>
              <div className="linea-relleno" style={{ width: anchoBarra, left: `${offsetNodo1}px`, transform: "translateY(-50%)" }}></div>
            </div>

            {RECOMPENSAS.map((r, i) => {
              const estadoNodo = calcularProgreso(r.nivel, i);
              const yaReclamada = reclamadas.includes(r.nivel);
              const puedeReclamar = estadoNodo === "progresado" && !yaReclamada;
              const icono = <img src="/assets/eco.png" alt="ECO" />;

              return (
                <div key={i} className="reward-slot" ref={i === 0 ? nodo1Ref : i === RECOMPENSAS.length - 1 ? nodoFinalRef : null}>
                  <div className={`reward-box ${estadoNodo !== "pendiente" ? "unlocked" : "locked"} ${yaReclamada ? "claimed" : ""}`}>
                    <div className="reward-icon">{estadoNodo !== "pendiente" ? icono : <Lock size={20} />}</div>
                    <div className="reward-desc">{r.descripcion}</div>
                    <div className="reward-nivel">Nivel {r.nivel}</div>
                    {puedeReclamar && (
                      <button onClick={() => handleReclamar(r.nivel)} className="reclamar-btn">Reclamar</button>
                    )}
                    {yaReclamada && (
                      <div className="claimed-status">
                        <CheckCircle size={14} /> Reclamada
                      </div>
                    )}
                  </div>
                  <div className={`nodo nodo-${estadoNodo}`}>
                    <span>{r.nivel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {loading && <p className="estado">Cargando recompensas...</p>}
      {error && <p className="estado error">Error: {error}</p>}
    </div>
  );
}
