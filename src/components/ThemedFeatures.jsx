import React from 'react';
import '../styles/components/_themedfeatures.scss';

export default function ThemedFeatures() {
  const features = [
    {
      id: 'slimefun',
      titleImg: '/assets/slimefun.png',
      decoImg: '/assets/slime-deco.png',
      background: 'slimefun-bg',

      image: '/assets/slimeflan.gif',
      description: `Crea fábricas, sistemas automatizados y tecnología sin necesidad de mods gracias a Slimefun.
Este sistema introduce mecánicas avanzadas como electricidad, maquinaria modular y procesos alquímicos.
Usa materiales únicos del servidor y combina magia con ingeniería para crear herramientas únicas y sistemas de producción complejos.`
    },
    {
      id: 'battlepass',
      titleImg: '/assets/battlepass.png',
      decoImg: '/assets/battlepass-rune.png',
      background: 'battlepass-bg',

      image: '/assets/battlepassimage.png',
      description: `Nuestro Pase de Batalla Premium ofrece misiones diarias y semanales con recompensas exclusivas
como cosméticos, monedas especiales, títulos y gestos animados. ¡Tu aventura se verá y se sentirá única!`
    }
  ];

  return (
    <section className="themed-features-wrapper">
      <div className="papiro-sheet">
        {features.map((feature, index) => (
          <div key={index} className={`feature-card ${feature.background}`}>
            <img src={feature.decoImg} alt="" className="deco-floating" />
            <div className="content-wrapper">
              <div className="title-block">
                <img src={feature.titleImg} alt={feature.id} className="title-img" />
              </div>
              <p className="description">{feature.description}</p>
            </div>
            <img src={feature.image} alt="Decoración principal" className="feature-art" />
          </div>
        ))}
      </div>
    </section>
  );
}
