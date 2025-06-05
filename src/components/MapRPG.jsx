import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion as MotionDiv } from 'framer-motion'
import { Howl } from 'howler'
import clickSoundFile from '/assets/sounds/vibration.wav'
import {
  MapPin,
  ScrollText,
  ShieldCheck,
  BarChart3,
  Gift,
  UserCircle,
  ShoppingBag,
  DoorOpen,
} from 'lucide-react'
import '../styles/components/_maprpg.scss'

const zones = [
  {
    icon: <ScrollText />,
    title: 'Taberna de Noticias',
    description: 'Lee las últimas aventuras y eventos del servidor.',
    route: '/news',
    className: 'news',
    image: '/assets/taberna.png',
  },
  {
    icon: <ShieldCheck />,
    title: 'Fortaleza de Sanciones',
    description: 'Consulta las sanciones y los registros de justicia.',
    route: '/tribunal',
    className: 'sanctions',
    image: '/assets/fortaleza.png',
  },
  {
    icon: <BarChart3 />,
    title: 'Mina de Estadísticas',
    description: 'Descubre los TOP jugadores y sus progresos.',
    route: '/leaderboards',
    className: 'stats',
    image: '/assets/mina.png',
  },
  {
    icon: <Gift />,
    title: 'Templo de Recompensas',
    description: 'Canjea tus puntos por vales y cofres mágicos.',
    route: '/dashboard',
    className: 'rewards',
    image: '/assets/recompensas.png',
  },
  {
    icon: <UserCircle />,
    title: 'Torre del Jugador',
    description: 'Accede a tu perfil, logros y evolución.',
    route: '/perfil/tuNombre',
    className: 'player',
    image: '/assets/torre.png',
  },
  {
    icon: <ShoppingBag />,
    title: 'Mercados',
    description: 'Explora objetos épicos del universo Minecraft.',
    route: '/tienda',
    className: 'shop',
    image: '/assets/mercado.png',
  },
]

const clickSound = new Howl({
  src: [clickSoundFile],
  volume: 0.4,
})

const MapRPG = () => {
  const navigate = useNavigate()

  const handleClick = (route, index) => {
    clickSound.play()

    const el = document.querySelectorAll('.zone-card')[index]
    if (el) {
      el.classList.add('vibrate')
      setTimeout(() => el.classList.remove('vibrate'), 200)
    }

    navigate(route)
  }

  return (
    <section className="map-rpg-wrapper">
      <div className="map-rpg-background" />


      <section className="map-rpg">
      <h2 className="map-title">
  <DoorOpen size={24} className="icon" />
  Portales Mágicos
  <span className="firefly-container">
    {[...Array(10)].map((_, i) => (
      <span key={i} className="firefly" />
    ))}
  </span>
</h2>

        <div className="zones-grid">
          {zones.map((zone, index) => (
            <MotionDiv.div
            key={index}
            className={`zone-card ${zone.className}`}
            onClick={() => handleClick(zone.route, index)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            {zone.image && (
              <>
                <img src={zone.image} alt={zone.title} className="zone-bg" />
                <div className="zone-overlay" />
              </>
            )}
          
            {/* 🌟 Mover el POPUP fuera del contenido */}
            <div className="description-popup">
              {zone.description}
            </div>
          
            <div className="zone-content">
              <div className="zone-icon">
                <div className="conjure-orb">{zone.icon}</div>
              </div>
              <h3>{zone.title}</h3>
            </div>
          </MotionDiv.div>
          
          ))}
        </div>
      </section>
    </section>
  )
}

export default MapRPG
