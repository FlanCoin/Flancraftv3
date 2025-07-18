import React from "react";
import { FiUser } from "react-icons/fi";

const CarritoLateral = ({
  carrito,
  onAgregar,
  nombreConfirmado,
  onLoginClick,
  calcularTotal,
}) => {
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
        <button className="checkout">Ir al pago</button>
      </div>
    </div>
  );
};

export default CarritoLateral;
