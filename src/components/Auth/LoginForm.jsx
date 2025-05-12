import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("uid", username)
      .single();

    if (data) {
      // Guardamos sesión simple
      localStorage.setItem("flan_uid", username);
      navigate("/dashboard");
    } else {
      setError("Usuario no encontrado. Usa el nombre exacto de Minecraft.");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Login de Aventurero 🧙</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 w-full mb-4"
        placeholder="Nombre de Minecraft"
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button onClick={handleLogin} className="bg-yellow-500 px-4 py-2 rounded text-white w-full">
        Entrar
      </button>
    </div>
  );
}
