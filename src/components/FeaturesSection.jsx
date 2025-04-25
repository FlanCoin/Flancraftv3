import React, { useState } from 'react';
import '../styles/components/_featuressection.scss';

export default function FeaturesSection() {
  const [spinDirection, setSpinDirection] = useState(true); // true: derecha, false: izquierda
  const [animClass, setAnimClass] = useState('');

  const handleClick = () => {
    if (animClass) return;

    const directionClass = spinDirection ? 'spin-right' : 'spin-left';
    setAnimClass(directionClass);

    setTimeout(() => {
      setSpinDirection((prev) => !prev); // alterna
      setAnimClass('');
    }, 1400); // duración de animaciones
  };

  return (
    <section className="features-section">

      {/* 🟢 SLIMEFUN */}
      <div className="feature-block slimefun">
        <div className="feature-text">
          <div className="feature-title-wrapper">
            <img src="/assets/slimefun.png" alt="Slimefun Título" className="feature-title" />
            <img src="/assets/slimeengine.gif" alt="Engranajes Slimefun" className="slimefun-gif" />
          </div>
          <p className="feature-description">
            Crea fábricas, sistemas automatizados y tecnología sin necesidad de mods gracias a Slimefun. 
            Este sistema introduce mecánicas avanzadas como electricidad, maquinaria modular y procesos alquímicos. 
            Usa materiales únicos del servidor y combina magia con ingeniería para crear herramientas únicas y sistemas de producción complejos.
          </p>
        </div>
        <img src="/assets/slimeflan.gif" alt="Imagen Slimefun" className="feature-image" />
      </div>

       {/* 🔵 BATTLEPASS */}
       <div className="feature-block battlepass">
        <img
          src="/assets/battlepassimage.png"
          alt="Imagen Battlepass"
          className={`feature-image ${animClass}`}
          onClick={handleClick}
        />
        <div className="feature-text">
          <div className="feature-title-wrapper">
            <img src="/assets/battlepass.png" alt="Battlepass Título" className="feature-title" />
            <img src="/assets/bubble.gif" alt="Aura burbujas" className="bubble-gif" />
          </div>
          <p className="feature-description">
            Nuestro Pase de Batalla Premium ofrece misiones diarias y semanales con recompensas exclusivas como cosméticos, 
            monedas especiales, títulos y gestos animados. ¡Tu aventura se verá y se sentirá única!
          </p>
        </div>
      </div>
    </section>
  );
}
