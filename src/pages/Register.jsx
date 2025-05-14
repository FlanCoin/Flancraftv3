// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";

export default function Register() {
  const [token, setToken] = useState("");
  const [uuid, setUuid] = useState(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleValidate = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/vincular/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Token inválido");

      setUuid(data.uuid_jugador);
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

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: `${uuid}@flancraft.fake`, // fake email basado en UUID
        password,
        options: {
          data: { uuid_jugador: uuid } // metadata personalizada
        }
      });

      if (signUpError) throw signUpError;

      await fetch("/api/vincular/marcar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });

      login(data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register">
      <h2>Vincular cuenta de Minecraft</h2>
      {uuid ? (
        <div>
          <p><strong>UUID detectado:</strong> {uuid}</p>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button onClick={handleRegister} disabled={loading}>
            Crear cuenta
          </button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Pega tu token aquí"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button onClick={handleValidate} disabled={loading}>
            Validar Token
          </button>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}