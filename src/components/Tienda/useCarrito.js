import { useState, useEffect } from "react";

export function useCarrito(nombreConfirmado) {
  const [carrito, setCarrito] = useState(
    JSON.parse(localStorage.getItem("carrito")) || []
  );
  const [productoPendiente, setProductoPendiente] = useState(null);
  const [mostrarLogin, setMostrarLogin] = useState(false);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const toggleProducto = (producto) => {
    if (!nombreConfirmado) {
      setProductoPendiente(producto);
      setMostrarLogin(true);
      return;
    }
    const existe = carrito.some((p) => p.id === producto.id);
    if (existe) {
      setCarrito(carrito.filter((p) => p.id !== producto.id));
    } else {
      setCarrito([...carrito, producto]);
    }
  };

  const confirmarPendiente = () => {
    if (productoPendiente) {
      const yaEsta = carrito.some((p) => p.id === productoPendiente.id);
      if (!yaEsta) setCarrito([...carrito, productoPendiente]);
      setProductoPendiente(null);
    }
    setMostrarLogin(false);
  };

  const calcularTotal = () =>
    carrito.reduce((acc, item) => acc + parseFloat(item.price), 0).toFixed(2);

  return {
    carrito,
    setCarrito,
    productoPendiente,
    setProductoPendiente,
    mostrarLogin,
    setMostrarLogin,
    toggleProducto,
    confirmarPendiente,
    calcularTotal,
  };
}