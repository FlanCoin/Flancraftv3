import React, { useEffect, useState } from 'react';
import '../styles/pages/_tiendatebex.scss';

const BACKEND_URL = 'https://flancraftweb-backend.onrender.com';

export default function TiendaTebex() {
  const [categorias, setCategorias] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [nombreJugador, setNombreJugador] = useState('');
  const [nombreConfirmado, setNombreConfirmado] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const nombreGuardado = localStorage.getItem('nombreJugador');
    if (nombreGuardado) {
      setNombreJugador(nombreGuardado);
      setNombreConfirmado(nombreGuardado);
    }

    const cargarDatos = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/tebex/datos`);
        const json = await res.json();
        setCategorias(json.categorias || []);
        setPaquetes(json.paquetes || []);
        setCargando(false);
      } catch (err) {
        console.error('Error al cargar tienda:', err);
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const confirmarNombre = (e) => {
    e.preventDefault();
    if (!nombreJugador.trim()) {
      alert('Por favor, introduce tu nombre de jugador.');
      return;
    }
    setNombreConfirmado(nombreJugador.trim());
    localStorage.setItem('nombreJugador', nombreJugador.trim());
  };

  const handleComprar = async (paquete) => {
    if (!nombreConfirmado) {
      return alert('Primero debes confirmar tu nombre de jugador.');
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/tebex/crear-pedido`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productoId: paquete.id,
          jugador: nombreConfirmado,
        }),
      });

      const data = await res.json();
      if (!data || !data.url) throw new Error('No se recibió URL válida');
      window.TebexCheckout.openCheckout(data.url);
    } catch (err) {
      console.error(err);
      alert('Error al iniciar la compra.');
    }
  };

  if (cargando) return <p className="tienda-cargando">Cargando tienda...</p>;

  return (
    <div className="tienda">
      <h2 className="tienda-titulo">Tienda FlanCraft</h2>

      <form onSubmit={confirmarNombre} className="form-nombre-jugador">
        <input
          type="text"
          placeholder="Tu nombre de jugador"
          value={nombreJugador}
          onChange={(e) => setNombreJugador(e.target.value)}
          className="input-jugador"
        />
        <button type="submit" className="boton-confirmar">
          Confirmar nombre
        </button>
      </form>

      {nombreConfirmado && (
        <p className="nombre-confirmado">Nombre confirmado: <strong>{nombreConfirmado}</strong></p>
      )}

      {Array.isArray(categorias) &&
        categorias.map((cat) => (
          <div key={cat.id} className="categoria">
            <h3 className="categoria-titulo">{cat.name}</h3>
            <div className="productos">
              {paquetes
                .filter((p) => p.category === cat.id)
                .map((p) => (
                  <div key={p.id} className="producto">
                    <img src={p.image} alt={p.name} />
                    <h4>{p.name}</h4>
                    <p>{(p.price / 100).toFixed(2)} €</p>
                    <button onClick={() => handleComprar(p)}>Comprar</button>
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
}
