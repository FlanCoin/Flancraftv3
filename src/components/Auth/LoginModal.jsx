import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/components/Auth/_loginmodal.scss';

export default function LoginModal({ onClose }) {
  const [step, setStep] = useState("login");
  const [uuid, setUuid] = useState(null);
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
  setError(null);
  setLoading(true);

  try {
    const res = await fetch("https://flancraftweb-backend.onrender.com/api/vincular/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: username, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Error al iniciar sesión");
    }

    localStorage.setItem("flan_user", JSON.stringify({
      uuid: data.uuid,
      name: data.uid,
      loggedIn: true
    }));

    navigate("/dashboard");
    if (onClose) onClose();
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  const handleTokenValidate = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("https://flancraftweb-backend.onrender.com/api/vincular/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          throw new Error("Este UUID ya está registrado.");
        }
        throw new Error(data.error || "Token inválido");
      }

      setUuid(data.uuid_jugador);
      setUsername(data.username);
      setStep("set-password");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError(null);

    if (password !== confirm) {
      return setError("Las contraseñas no coinciden");
    }

    setLoading(true);

    try {
      // Paso 1: registrar el usuario
      const registerRes = await fetch("https://flancraftweb-backend.onrender.com/api/vincular/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uuid,
          uid: username,
          password
        })
      });

      const registerData = await registerRes.json();
      if (!registerRes.ok) {
        throw new Error(registerData.error || "Error al registrar usuario");
      }

      // Paso 2: marcar el token como utilizado
      const markRes = await fetch("https://flancraftweb-backend.onrender.com/api/vincular/marcar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });

      if (!markRes.ok) {
        throw new Error("Error al marcar token como usado");
      }

      // Paso 3: guardar sesión en localStorage
      localStorage.setItem("flan_user", JSON.stringify({
        uuid,
        name: username,
        loggedIn: true
      }));

      // Paso 4: ir al dashboard y cerrar modal
      navigate("/dashboard");
      if (onClose) onClose();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modal">
      <div className="overlay" onClick={onClose}></div>
      <div className="login-box">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>
          {step === "login"
            ? "Inicia sesión en Flancraft"
            : step === "token"
            ? "Vincula tu cuenta Minecraft"
            : "Elige tu contraseña"}
        </h2>

        {step === "login" && (
  <>
    <input
      type="text"
      placeholder="Usuario o email"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
    <input
      type="password"
      placeholder="Contraseña"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <button onClick={handleLogin}>
      Iniciar sesión
    </button>
    <p className="no-account">
      ¿No tienes cuenta?{" "}
      <button onClick={() => setStep("token")}>Regístrate aquí</button>
    </p>
  </>
)}

        {step === "token" && (
          <>
            <p>
              Para vincular tu cuenta, entra en el servidor de Flancraft y escribe <code>/vincular</code>. Luego, pega aquí tu token:
            </p>
            <input
              type="text"
              placeholder="Token de vinculación"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={loading}
            />
            <button onClick={handleTokenValidate} disabled={loading}>
              {loading ? "Validando..." : "Validar Token"}
            </button>
          </>
        )}

        {step === "set-password" && (
          <>
            <p><strong>Nombre detectado:</strong> {username}</p>
            <p><strong>UUID:</strong> {uuid}</p>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={loading}
            />
            <button onClick={handleRegister} disabled={loading}>
              {loading ? "Registrando..." : "Crear cuenta"}
            </button>
          </>
        )}

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
