import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import ResetPasswordModal from "./ResetPasswordModal";
import "../../styles/components/Auth/_loginmodal.scss";

export default function LoginModal({ onClose }) {
  const [step, setStep] = useState("login");
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirm: "",
    token: "",
    uuid: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const goToDashboard = (uuid, username, rol_admin) => {
    const userData = { uuid, name: username, loggedIn: true, rol_admin };
    localStorage.setItem("flan_user", JSON.stringify(userData));
    setUser(userData);
    navigate("/dashboard");
    if (onClose) onClose();
  };

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("https://flancraftweb-backend.onrender.com/api/vincular/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: form.username, password: form.password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

      goToDashboard(data.uuid, data.uid, data.rol_admin);
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
        body: JSON.stringify({ token: form.token }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) throw new Error("Este UUID ya está registrado.");
        throw new Error(data.error || "Token inválido");
      }

      updateForm("uuid", data.uuid_jugador);
      updateForm("username", data.username);
      setStep("set-password");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError(null);
    if (form.password !== form.confirm) return setError("Las contraseñas no coinciden");

    setLoading(true);
    try {
      const registerRes = await fetch("https://flancraftweb-backend.onrender.com/api/vincular/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uuid: form.uuid,
          uid: form.username,
          password: form.password,
        }),
      });

      const registerData = await registerRes.json();
      if (!registerRes.ok) throw new Error(registerData.error || "Error al registrar usuario");

      const markRes = await fetch("https://flancraftweb-backend.onrender.com/api/vincular/marcar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: form.token }),
      });

      if (!markRes.ok) throw new Error("Error al marcar token como usado");

      // ✅ Obtener rol_admin después de registrar
      const usuarioRes = await fetch(`https://flancraftweb-backend.onrender.com/api/usuarios/${form.uuid}`);
      const usuarioData = await usuarioRes.json();

      goToDashboard(form.uuid, form.username, usuarioData.rol_admin || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const AuthInput = ({ type = "text", placeholder, value, onChange, disabled }) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="auth-input"
    />
  );

  const AuthButton = ({ children, onClick, disabled }) => (
    <button className="auth-button" onClick={onClick} disabled={disabled}>
      {disabled ? "Procesando..." : children}
    </button>
  );

  const renderLoginStep = () => (
    <>
      <AuthInput
        placeholder="Usuario o email"
        value={form.username}
        onChange={(val) => updateForm("username", val)}
      />
      <AuthInput
        type="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={(val) => updateForm("password", val)}
      />
      <AuthButton onClick={handleLogin} disabled={loading}>Iniciar sesión</AuthButton>

      <div className="auth-options">
        <p>
          ¿No tienes cuenta?
          <button onClick={() => setStep("token")}>Regístrate aquí</button>
        </p>
        <p>
          ¿Olvidaste tu contraseña?
          <button onClick={() => setShowResetModal(true)}>Restablecer</button>
        </p>
      </div>
    </>
  );

  const renderTokenStep = () => (
    <>
      <p>
        Para vincular tu cuenta, entra al servidor y escribe <code>/vincular</code>. Luego pega el token aquí:
      </p>
      <AuthInput
        placeholder="Token de vinculación"
        value={form.token}
        onChange={(val) => updateForm("token", val)}
        disabled={loading}
      />
      <AuthButton onClick={handleTokenValidate} disabled={loading}>
        Validar Token
      </AuthButton>
    </>
  );

  const renderSetPasswordStep = () => (
    <>
      <p><strong>Nombre detectado:</strong> {form.username}</p>
      <p><strong>UUID:</strong> {form.uuid}</p>
      <AuthInput
        type="password"
        placeholder="Nueva contraseña"
        value={form.password}
        onChange={(val) => updateForm("password", val)}
        disabled={loading}
      />
      <AuthInput
        type="password"
        placeholder="Confirmar contraseña"
        value={form.confirm}
        onChange={(val) => updateForm("confirm", val)}
        disabled={loading}
      />
      <AuthButton onClick={handleRegister} disabled={loading}>Crear cuenta</AuthButton>
    </>
  );

  return (
    <div className="login-modal">
      <div className="overlay" onClick={onClose}></div>
      <div className="login-box">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>
          {step === "login" && "Inicia sesión en Flancraft"}
          {step === "token" && "Vincula tu cuenta Minecraft"}
          {step === "set-password" && "Elige tu contraseña"}
        </h2>

        {step === "login" && renderLoginStep()}
        {step === "token" && renderTokenStep()}
        {step === "set-password" && renderSetPasswordStep()}

        {error && <p className="error">{error}</p>}
        {showResetModal && (
          <ResetPasswordModal onClose={() => setShowResetModal(false)} />
        )}
      </div>
    </div>
  );
}
