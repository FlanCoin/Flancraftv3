// 📁 src/components/Tienda.jsx
import React from 'react';
import '../styles/pages/_tienda.scss';

export default function Tienda() {
  return (
    <div className="tienda-container">
      <iframe
        src="https://store.flancraft.com/"
        title="Tienda FlanCraft"
        className="tienda-iframe"
        frameBorder="0"
      />
    </div>
  );
}
