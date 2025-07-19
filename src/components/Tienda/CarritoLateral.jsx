// src/components/Tienda/CarritoLateral.jsx
import React from "react";
import { FiUser } from "react-icons/fi";
import { calcularTotal } from "./Helpers";

const CarritoLateral = ({
  carrito,
  onAgregar,
  nombreConfirmado,
  uuidConfirmado,
  onLoginClick,
  monedaSeleccionada = "EUR",
  onMonedaChange,
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
    <div className="carrito-lateral">
      <div className="carrito-header">
        <div className="user-info">
          {nombreConfirmado && uuidConfirmado ? (
            <>
              <div
                className="skin"
                style={{
                  backgroundImage: `url(https://crafatar.com/avatars/${uuidConfirmado}?size=64&overlay)`,
                }}
              />
              <div className="username">{nombreConfirmado}</div>

              <div className="selector-moneda">
                <select value={monedaSeleccionada} onChange={onMonedaChange}>
                  <option value="EUR">€ EUR</option>
                  <option value="USD">$ USD</option>
                  <option value="MXN">$ MXN</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <FiUser size={32} style={{ marginBottom: "0.5rem" }} />
              <button className="btn-login" onClick={onLoginClick}>
                Iniciar sesión
              </button>
            </>
          )}
        </div>
      </div>

      <div className="carrito-body">
        <h3>CARRITO</h3>
        {carrito.length === 0 ? (
          <p className="vacio">Tu carrito está vacío</p>
        ) : (
          carrito.map((item, i) => (
            <div key={i} className="item">
              <span className="nombre">{item.name}</span>
              <span className="precio">
                {item.price} {monedaSeleccionada === "USD" ? "$" : monedaSeleccionada === "MXN" ? "$" : "€"}
              </span>
              <button onClick={() => onAgregar(item)}>✖</button>
            </div>
          ))
        )}

        <div className="total">
          Total: {calcularTotal(carrito)}{" "}
          {monedaSeleccionada === "USD" ? "$" : monedaSeleccionada === "MXN" ? "$" : "€"}
        </div>

        <button
          className="boton-comprar"
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
