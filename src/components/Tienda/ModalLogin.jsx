import React, { useState } from "react";

const ModalLogin = ({ onConfirmar, onCerrar }) => {
  const [jugador, setJugador] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

const confirmarNombre = async () => {
  if (!jugador || jugador.length < 3) {
    setError("Ingresa un nombre válido.");
    return;
  }

  setCargando(true);
  setError("");

  try {
    // Proxy temporal gratuito para evitar CORS
    const res = await fetch(`https://corsproxy.io/?https://api.mojang.com/users/profiles/minecraft/${jugador}`);
    if (!res.ok) {
      throw new Error("Jugador no encontrado");
    }
    const data = await res.json();
    const uuid = data.id;
    onConfirmar(jugador, uuid);
  } catch  {
    setError("No se pudo encontrar ese jugador.");
  } finally {
    setCargando(false);
  }
};


  return (
    <div className="modal-login">
      <div className="modal-contenido">
        <h2>Ingresa tu nombre de jugador</h2>
        <input
          type="text"
          placeholder="Tu nombre de Minecraft"
          value={jugador}
          onChange={(e) => setJugador(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && confirmarNombre()}
        />
        {error && <p style={{ color: "darkred", fontSize: "0.9rem" }}>{error}</p>}
        {cargando ? (
          <p>Cargando...</p>
        ) : (
          <>
            <button onClick={confirmarNombre}>Confirmar</button>
            <button className="cerrar" onClick={onCerrar}>Cancelar</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalLogin;
