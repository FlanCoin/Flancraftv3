import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import RewardList from "./RewardList";
import LogroList from "./LogroList";
import "../styles/pages/dashboard/_dashboardpage.scss";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [xpData, setXpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const ecosRef = useRef(null);

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
          fetch(`https://flancraftweb-backend.onrender.com/api/usuarios`)
        ]);

        if (!usuarioRes.ok || !monedasRes.ok || !xpRes.ok || !usuariosRes.ok)
          throw new Error("Error al cargar datos");

        const usuario = await usuarioRes.json();
        const monedas = await monedasRes.json();
        const xp = await xpRes.json();
        const usuarios = await usuariosRes.json();

        const actual = usuarios.find(u => u.uuid === parsed.uuid);
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
      const res = await fetch(`https://flancraftweb-backend.onrender.com/api/monedas/${user.uuid}`);
      if (!res.ok) throw new Error("Error al actualizar monedas");
      const monedasActualizadas = await res.json();
      setUser((prev) => ({ ...prev, monedas: monedasActualizadas }));
    } catch (err) {
      console.error("[MONEDAS]", err.message);
    }
  };

  const avatarUrl = `https://minotar.net/armor/body/${user?.uid}/200.png`;
  const nivelInfo = xpData?.niveles.find(n => n.nivel === user?.nivel);
  const xpDelNivelActual = nivelInfo?.xp_requerida || 1;
  const porcentajeNivel = (user?.xp_actual / xpDelNivelActual) * 100;

  const [servidorSeleccionado, setServidorSeleccionado] = useState("anarquico");
  const servidores = Object.keys(user?.monedas?.dolares || {});

  return (
    <div className="dashboard-wrapper">
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
        <div className="dashboard-content">
          <div className="dashboard-header-layout">
            <div className="skin-wrapper">
  {user.es_premium && (
    <img
      src="/assets/premium.png"
      alt="Premium"
      className="premium-crown"
    />
  )}
  <img src={avatarUrl} alt={`Skin de ${user.uid}`} className="skin-render" />
</div>

            <div className="center-info">
              <h1 className="username fancy-font" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {user.rol_admin && (
                  <span className={`badge-staff ${user.rol_admin}`}>{user.rol_admin.toUpperCase()}</span>
                )}
                <span>{user.uid}</span>
                {user.rango_usuario && (
                  <span className={`badge-rango ${user.rango_usuario.toLowerCase()}`}>
                    {user.rango_usuario.toUpperCase()}
                  </span>
                )}
              </h1>

              <div className="barra-nivel-wrapper">
                <div className="barra-nivel-header">
                  <div className="nivel-text">Lvl {user.nivel}</div>
                  <div className="xp-text">
                    <span className="xp-actual">{user.xp_actual}</span> / {xpDelNivelActual} XP
                  </div>
                </div>
                <div className="barra-nivel">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`segmento ${porcentajeNivel >= (i + 1) * 10 ? "relleno" : ""}`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="monedas-info">
              {user.rol_admin && (
                <div className="panel-tribunal-wrapper">
                  <button
                    onClick={() => navigate("/tribunal/admin")}
                    className="btn-admin"
                  >
                    Administrar Tribunal
                  </button>
                  {user.rol_admin.toLowerCase() === "owner" && (
                    <button
                      onClick={() => navigate("/admin")}
                      className="btn-admin"
                      style={{ marginTop: "0.5rem" }}
                    >
                      Gestión de Staff
                    </button>
                  )}
                </div>
              )}

              <div className="separador-magico"></div>

              {user.monedas && (
                <div className="monedas-panel">
                  <div className="monedas-titulo">MONEDAS</div>
                  <div className="moneda-row">
                    <span className="eco-label">ECOS:</span>
                    <span className="eco-value" ref={ecosRef}>{user.monedas.ecos}</span>
                    <img src="/assets/eco.png" alt="ECO" className="eco-icon" />
                  </div>

                  <div className="moneda-row">
                    <span className="dolares-label">DOLARES:</span>
                    <div className="dropdown-inline">
                      {servidorSeleccionado}: {user.monedas.dolares[servidorSeleccionado]}$
                      <div className="opciones">
                        {servidores.filter(s => s !== servidorSeleccionado).map((s) => (
                          <div key={s} onClick={() => setServidorSeleccionado(s)}>
                            {s}: {user.monedas.dolares[s]}$
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-sections">
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
    </div>
  );
}
