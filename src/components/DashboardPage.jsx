import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import RewardList from "./RewardList";
import LogroList from "./LogroList";
import useIsMobile from "../hooks/useIsMobile"; // ✅ Usa el hook
import "../styles/pages/dashboard/_dashboardpage.scss";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [xpData, setXpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const ecosRef = useRef(null);
  const isMobile = useIsMobile(); // ✅ breakpoint 768 por defecto

  useEffect(() => {
    const stored = localStorage.getItem("flan_user");
    if (!stored) return navigate("/");

    const parsed = JSON.parse(stored);
    if (!parsed.uuid || !parsed.loggedIn) return navigate("/");

    const cargarDatos = async () => {
      try {
        const [usuarioRes, monedasRes, xpRes, usuariosRes] = await Promise.all([
          fetch(`https://flancraftweb-backend.onrender.com/api/usuarios/${parsed.uuid}`),
          fetch(`https://flancraftweb-backend.onrender.com/api/monedas/${parsed.uuid}`),
          fetch(`https://flancraftweb-backend.onrender.com/api/usuarios/${parsed.uuid}/xp`),
          fetch(`https://flancraftweb-backend.onrender.com/api/usuarios`),
        ]);

        if (!usuarioRes.ok || !monedasRes.ok || !xpRes.ok || !usuariosRes.ok)
          throw new Error("Error al cargar datos");

        const usuario = await usuarioRes.json();
        const monedas = await monedasRes.json();
        const xp = await xpRes.json();
        const usuarios = await usuariosRes.json();

        const actual = usuarios.find((u) => u.uuid === parsed.uuid);
        const rango_usuario = actual?.rango_usuario || null;
        const es_premium = actual?.es_premium || false;

        setUser({ ...usuario, monedas, rango_usuario, es_premium });
        setXpData(xp);
      } catch (err) {
        setError(err.message || "Error");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [navigate]);

  const actualizarMonedas = async () => {
    try {
      const res = await fetch(
        `https://flancraftweb-backend.onrender.com/api/monedas/${user.uuid}`
      );
      if (!res.ok) throw new Error("Error al actualizar monedas");
      const monedasActualizadas = await res.json();
      setUser((prev) => ({ ...prev, monedas: monedasActualizadas }));
    } catch (err) {
      console.error("[MONEDAS]", err.message);
    }
  };

  const avatarUrl = `https://minotar.net/armor/body/${user?.uid}/160.png`;
  const nivelInfo = xpData?.niveles.find((n) => n.nivel === user?.nivel);
  const xpDelNivelActual = nivelInfo?.xp_requerida || 1;
  const porcentajeNivel = (user?.xp_actual / xpDelNivelActual) * 100;

  return (
    <section className="dashboard-epic">
      <div className="epic-header-dashboard">
        <h1>La Posada</h1>
        <p>Explora tu progreso, logros y riquezas acumuladas en el mundo de FlanCraft.</p>
      </div>

      {loading ? (
        <div className="loading-overlay">
          <div className="loading-content">
            <img src="/assets/eco.png" alt="Gema ECOS" className="loading-gem" />
            <p className="loading-text">Cargando perfil...</p>
          </div>
        </div>
      ) : error ? (
        <p className="error">Error al cargar perfil: {error}</p>
      ) : (
        <div className="dashboard-epic-body fade-slide-in">
          <div className="card-perfil-completo">
            <div className={`perfil-header ${isMobile ? "mobile" : ""}`}>
              <div className="skin-marco-posada">
                {user.es_premium && (
                  <img src="/assets/premium.png" alt="Premium" className="premium-crown" />
                )}
                <img src={avatarUrl} alt={`Skin de ${user.uid}`} className="skin-jugador" />
              </div>

              <div className="info-datos">
                <div className="info-identidad etiquetas-superiores">
                  {user.rol_admin && (
                    <span className={`badge-staff ${user.rol_admin.toLowerCase()}`}>
                      {user.rol_admin.toUpperCase()}
                    </span>
                  )}
                  {user.rango_usuario && (
                    <img
                      src={`/assets/etiquetas/${user.rango_usuario.toLowerCase()}.png`}
                      alt={user.rango_usuario}
                      className="etiqueta-rango"
                    />
                  )}
                </div>

                <div className="bloque-nombre-monedas">
                  <span className="nombre-texto">{user.uid}</span>
                  <div className="info-monedas">
                    <div className="monedas-bloque">
                      <p className="monedas-top">Saldo de FlanCraft</p>
                      <div className="monedas-linea">
                        <div className="eco-cantidad">
                          <span>{user.monedas?.ecos || 0}</span>
                          <img
                            src="/assets/eco.png"
                            alt="Eco"
                            className="icono-eco pulse"
                          />
                        </div>
                        <a
                          href="https://store.flancraft.com/category/ecos"
                          target="_blank"
                          rel="noreferrer"
                          className="btn-comprar"
                        >
                          Comprar ECOS
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-card">
              <div className="barra-nivel-header">
                <div className="nivel-text">
                  Nivel <span className="nivel-numero">{user.nivel}</span>
                </div>
                <div className="xp-text">
                  <span className="xp-actual">{user.xp_actual}</span> / {xpDelNivelActual} XP
                </div>
              </div>
              <div className="barra-nivel">
                <div className="segmento relleno" style={{ width: `${porcentajeNivel}%` }} />
              </div>
            </div>

            {user.rol_admin && (
              <div className="info-botones">
                <button onClick={() => navigate("/tribunal/admin")}>Tribunal</button>
                {user.rol_admin.toLowerCase() === "owner" && (
                  <button onClick={() => navigate("/admin")}>Gestión Staff</button>
                )}
              </div>
            )}
          </div>

          <div className="dashboard-secciones">
            <RewardList
              user={user}
              xpData={xpData}
              ecosRef={ecosRef}
              onActualizarMonedas={actualizarMonedas}
            />
            <div className="separador-magico"></div>
            <LogroList user={user} />
          </div>
        </div>
      )}
    </section>
  );
}
