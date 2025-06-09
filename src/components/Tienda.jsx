import { useEffect } from 'react';
import '../styles/pages/_tienda.scss';

export default function TiendaRedirect() {
  useEffect(() => {
    const delay = setTimeout(() => {
      window.location.replace('https://store.flancraft.com');
    }, 1500);

    return () => clearTimeout(delay);
  }, []);

  return (
    <div className="tienda-redirect-message">
      <div className="tienda-frame-fake">
        <h2>Conectando con el Mercado de FlanCraft...</h2>
        <p>Cargando objetos mágicos y cofres encantados...</p>
        <div className="loader-circulo" />
      </div>
    </div>
  );
}
