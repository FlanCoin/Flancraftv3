import React from "react";
import { FiUser } from "react-icons/fi";

const CarritoLateral = ({
  carrito,
  onAgregar,
  nombreConfirmado,
  onLoginClick,
  calcularTotal,
}) => {
  const handlePago = () => {
    if (!nombreConfirmado || carrito.length === 0) return;
    if (window.Tebex?.checkout?.openPopup) {
      window.Tebex.checkout.openPopup();
    } else {
      alert("El sistema de pago aún no está disponible. Intenta de nuevo en unos segundos.");
    }
  };

  return (
    <div className="carrito-wrapper">
      <div className="carrito-usuario">
        {nombreConfirmado ? (
          <p className="jugador-confirmado">
            <FiUser style={{ marginRight: "6px", verticalAlign: "middle" }} />
            {nombreConfirmado}
          </p>
        ) : (
          <button onClick={onLoginClick}>Iniciar sesión</button>
        )}
      </div>

      <div className="carrito-listado">
        <h3>CARRITO</h3>
        {carrito.length === 0 ? (
          <p className="vacio">Tu carrito está vacío</p>
        ) : (
          carrito.map((item, i) => (
            <div key={i} className="item-carrito">
              <span>{item.name}</span>
              <span>{item.price} €</span>
              <button onClick={() => onAgregar(item)}>❌</button>
            </div>
          ))
        )}
      </div>

      <div className="carrito-total">
        <p>
          Total: <strong>{calcularTotal()} €</strong>
        </p>
        <button
          className="checkout"
          onClick={handlePago}
          disabled={!nombreConfirmado || carrito.length === 0}
        >
          Ir al pago
        </button>
      </div>
    </div>
  );
};

export default CarritoLateral;
