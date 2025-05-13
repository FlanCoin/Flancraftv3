import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [token, setToken] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null);

    if (!token.startsWith("flan-")) {
      setError("El token debe comenzar por flan-");
      return;
    }

    const { data, error: supaError } = await supabase
      .from("login_tokens")
      .select("*")
      .eq("token", token.trim())
      .single();

    if (supaError || !data) {
      setError("Token inválido o ya usado.");
      return;
    }

    // Guardar datos en sesión local
    localStorage.setItem("flan_user", JSON.stringify({
      uuid: data.uuid,
      name: data.name,
      loggedIn: true
    }));

    // (Opcional) eliminar el token después de usarlo
    await supabase
      .from("login_tokens")
      .delete()
      .eq("token", token.trim());

    navigate("/dashboard");
  };

  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Vincula tu cuenta de Minecraft 🧠</h2>
      <p className="text-sm text-gray-600 mb-2">
        Ejecuta <code className="bg-gray-100 px-2 py-1 rounded">/vincular</code> en el servidor para obtener tu token.
      </p>
      <input
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="border p-2 w-full mb-4"
        placeholder="Ej: flan-9dj2slfa"
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white w-full">
        Entrar
      </button>
    </div>
  );
}
