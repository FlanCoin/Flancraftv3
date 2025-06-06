import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import ResetPasswordModal from "./ResetPasswordModal";
import "../../styles/components/Auth/_loginmodal.scss";

const AuthInput = React.forwardRef(
  ({ type = "text", placeholder, value, onChange, disabled }, ref) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      ref={ref}
      autoComplete="off"
    />
  )
);

const AuthButton = ({ children, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled}>
    {disabled ? "Procesando..." : children}
  </button>
);

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
  const [modalVisible, setModalVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const usernameRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setModalVisible(true), 50);
  }, []);

  useEffect(() => {
    if (step === "login" && usernameRef.current) {
      setTimeout(() => usernameRef.current.focus(), 100);
    }
  }, [step]);

  const updateForm = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const goToDashboard = (uuid, username, rol_admin, extras = {}) => {
    const userData = {
      uuid,
      username,
      loggedIn: true,
      rol_admin,
      ...extras,
    };
    localStorage.setItem("flan_user", JSON.stringify(userData));
    setUser(userData);
    navigate("/dashboard");
    onClose?.();
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose?.();
    }, 600); // misma duración que la animación inversa
  };

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        "https://flancraftweb-backend.onrender.com/api/vincular/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: form.username, password: form.password }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

      const usuarioRes = await fetch(
        `https://flancraftweb-backend.onrender.com/api/usuarios/${data.uuid}`
      );
      const usuarioData = await usuarioRes.json();

      goToDashboard(data.uuid, data.uid, data.rol_admin, {
        rango_usuario: usuarioData.rango_usuario,
        userLevel: usuarioData.nivel,
        userXP: usuarioData.experiencia,
        userXPMax: usuarioData.experiencia_max,
        ecos: usuarioData.ecos,
      });
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
      const res = await fetch(
        "https://flancraftweb-backend.onrender.com/api/vincular/validate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: form.token }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Token inválido");
      if (res.status === 409) throw new Error("Este UUID ya está registrado.");

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
    if (form.password !== form.confirm)
      return setError("Las contraseñas no coinciden");

    setLoading(true);
    try {
      const registerRes = await fetch(
        "https://flancraftweb-backend.onrender.com/api/vincular/registrar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uuid: form.uuid,
            uid: form.username,
            password: form.password,
          }),
        }
      );
      const registerData = await registerRes.json();
      if (!registerRes.ok)
        throw new Error(registerData.error || "Error al registrar usuario");

      const markRes = await fetch(
        "https://flancraftweb-backend.onrender.com/api/vincular/marcar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: form.token }),
        }
      );
      if (!markRes.ok) throw new Error("Error al marcar token como usado");

      const usuarioRes = await fetch(
        `https://flancraftweb-backend.onrender.com/api/usuarios/${form.uuid}`
      );
      const usuarioData = await usuarioRes.json();

      goToDashboard(form.uuid, form.username, usuarioData.rol_admin, {
        rango_usuario: usuarioData.rango_usuario,
        userLevel: usuarioData.nivel,
        userXP: usuarioData.experiencia,
        userXPMax: usuarioData.experiencia_max,
        ecos: usuarioData.ecos,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderLoginStep = () => (
    <>
      <AuthInput
        placeholder="Usuario o email"
        value={form.username}
        onChange={(val) => updateForm("username", val)}
        ref={usernameRef}
      />
      <AuthInput
        type="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={(val) => updateForm("password", val)}
      />
      <AuthButton onClick={handleLogin} disabled={loading}>
        Iniciar sesión
      </AuthButton>

      <div className="auth-options">
        <div className="auth-buttons-row">
          <button onClick={() => setStep("token")}>Regístrate aquí</button>
          <button onClick={() => setShowResetModal(true)}>Restablecer</button>
        </div>
      </div>
    </>
  );

  const renderTokenStep = () => (
    <>
      <p>
        Para vincular tu cuenta, entra al servidor y escribe{" "}
        <code>/vincular</code>. Luego pega el token aquí:
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
      <p>
        <strong>Nombre detectado:</strong> {form.username}
      </p>
      <p>
        <strong>UUID:</strong> {form.uuid}
      </p>
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
      <AuthButton onClick={handleRegister} disabled={loading}>
        Crear cuenta
      </AuthButton>
    </>
  );

  return (
    <div className={`login-modal ${closing ? "fade-out-up" : ""}`}>
      <div className="overlay" onClick={handleClose} />
      {modalVisible && (
        <div className="hanging-login">
          <div className="frame-wrapper">
            <img
              src="/assets/hanging-frame.png"
              alt="Marco colgante"
              className="hanging-frame"
            />
            <div className="login-inside">
              <div className="login-box">
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
          </div>
        </div>
      )}
    </div>
  );
}
