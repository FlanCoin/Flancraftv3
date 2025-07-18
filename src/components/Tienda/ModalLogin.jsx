import React from "react";

const ModalLogin = ({ jugador, setJugador, onConfirmar, onCerrar }) => {
  return (
    <div className="modal-login">
      <div className="modal-contenido">
        <h2>Ingresa tu nombre de jugador</h2>
        <input
          type="text"
          placeholder="Tu nombre de Minecraft"
          value={jugador}
          onChange={(e) => setJugador(e.target.value)}
        />
        <button onClick={onConfirmar}>Confirmar</button>
        <button className="cerrar" onClick={onCerrar}>Cancelar</button>
      </div>
    </div>
  );
};

export default ModalLogin;
