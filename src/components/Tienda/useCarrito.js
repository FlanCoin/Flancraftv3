// src/components/Tienda/useCarrito.js
import { useState, useEffect } from "react";

export function useCarrito(nombreJugador) {
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem(`carrito-${nombreJugador}`);
    return guardado ? JSON.parse(guardado) : [];
  });

  useEffect(() => {
    localStorage.setItem(`carrito-${nombreJugador}`, JSON.stringify(carrito));
  }, [carrito, nombreJugador]);

  const toggleProducto = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      if (existe) return prev.filter((p) => p.id !== producto.id);
      return [...prev, producto];
    });
  };

  return { carrito, toggleProducto };
}
