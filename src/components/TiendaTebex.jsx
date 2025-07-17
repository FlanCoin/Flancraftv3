import React, { useState, useEffect } from 'react';
import '../styles/pages/_tiendatebex.scss';

const productos = [
  {
    id: 'nova-30d',
    nombre: 'Rango Nova (30 días)',
    precio: 3.99,
    imagen: '/rango-nova.png',
  },
  {
    id: 'inmortal-perma',
    nombre: 'Rango Inmortal (Permanente)',
    precio: 29.99,
    imagen: '/rango-inmortal.png',
  },
];

export default function Tienda() {
  const [nombreJugador, setNombreJugador] = useState('');

  useEffect(() => {
    const guardado = localStorage.getItem('nombreJugador');
    if (guardado) setNombreJugador(guardado);
  }, []);

  const handleComprar = async (producto) => {
    if (!nombreJugador) {
      return alert('Por favor, introduce tu nombre de jugador antes de comprar.');
    }

    localStorage.setItem('nombreJugador', nombreJugador);

    try {
      const res = await fetch('/api/tebex/crear-pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productoId: producto.id,
          jugador: nombreJugador,
        }),
      });

      const data = await res.json();
      if (!data || !data.url) throw new Error('No se recibió una URL válida');

      // Abre el modal de Tebex
      window.TebexCheckout.openCheckout(data.url);

    } catch (err) {
      console.error(err);
      alert('Error al iniciar la compra.');
    }
  };

  return (
    <div className="tienda">
      <h2>Tienda FlanCraft</h2>

      <input
        type="text"
        placeholder="Nombre de jugador"
        value={nombreJugador}
        onChange={(e) => setNombreJugador(e.target.value)}
        className="input-jugador"
      />

      <div className="productos">
        {productos.map((p) => (
          <div className="producto" key={p.id}>
            <img src={p.imagen} alt={p.nombre} />
            <h3>{p.nombre}</h3>
            <p>{p.precio.toFixed(2)} €</p>
            <button onClick={() => handleComprar(p)}>Comprar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
