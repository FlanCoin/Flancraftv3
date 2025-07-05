import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import '../styles/components/_allnews.scss';

const API_URL = "https://flancraftweb-backend.onrender.com";

const AllNews = () => {
  const [newsData, setNewsData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const listItemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
      },
    }),
  };

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const res = await fetch(`${API_URL}/api/noticias`);
        const data = await res.json();
        const publicadas = data
          .filter(n => n.publicada)
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setNewsData(publicadas);
        preloadImages(publicadas.map((n) => n.portada));
      } catch (error) {
        console.error('Error al obtener noticias:', error);
      }
    };
    fetchNoticias();
  }, []);

  const preloadImages = (urls) => {
    let loaded = 0;
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loaded++;
        if (loaded === urls.length) {
          setImagesLoaded(true);
          setTimeout(() => setLoading(false), 300);
        }
      };
    });
  };

  const formatDaysAgo = (dateStr) => {
    const today = new Date();
    const newsDate = new Date(dateStr);
    const diff = Math.floor((today - newsDate) / (1000 * 60 * 60 * 24));
    return `hace ${diff} día${diff !== 1 ? 's' : ''}`;
  };

  const truncate = (html, limit = 200) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || "";
    return text.length <= limit ? text : text.slice(0, text.lastIndexOf(" ", limit)) + "...";
  };

  const featured = newsData.slice(0, 1);
  const rest = newsData.slice(1, 1 + visibleCount);

  const showMore = () => {
    setVisibleCount((prev) => prev + 6);
    setTimeout(() => {
      document.querySelector('.load-more')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <section className="all-news-section">
      <div className="news-header-bg">
        <Motion.h2
          className="main-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Noticias
        </Motion.h2>

        <Motion.div
          className="featured-news-grid"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {featured.map((item) => (
            <Link key={item.id} to={`/news/${item.slug}`} className="featured-news-card">
              <div className="img-wrapper">
                <img src={item.portada || "/assets/placeholder.png"} alt={item.titulo} loading="lazy" />
              </div>
              <div className="info">
                <h3>{item.titulo}</h3>
                <span>{formatDaysAgo(item.fecha)}</span>
              </div>
            </Link>
          ))}
        </Motion.div>
      </div>

      <div className="news-scroll-bg">
        <div className="news-scroll-top-decor">
          <img src="/assets/topborder.png" alt="" className="border-main" />
          <img src="/assets/borde2.png" alt="" className="border-corner" />
        </div>

        <h3 className="scroll-title">Últimos artículos</h3>
        <div className="floating-news-hero">
          <img src="/assets/avioneta.png" alt="Repartidor de noticias Flancraft" />
        </div>
        <hr className="news-section-divider" />

        <div className="news-list">
          {!imagesLoaded || loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="news-list-item loading-skeleton">
                <div className="hover-wrapper">
                  <div className="skeleton-image" />
                  <div className="text">
                    <div className="skeleton-title" />
                    <div className="skeleton-paragraph" />
                    <div className="skeleton-date" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            rest.map((item, index) => (
              <Motion.div
                key={item.id}
                custom={index}
                variants={listItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Link to={`/news/${item.slug}`} className="news-list-item">
                  <div className="hover-wrapper">
                    <img src={item.portada || "/assets/placeholder.png"} alt={item.titulo} loading="lazy" />
                    <div className="text">
                      <h4>{item.titulo}</h4>
                      <p>{truncate(item.contenido)}</p>
                      <div className="date">{formatDaysAgo(item.fecha)}</div>
                    </div>
                  </div>
                </Link>
              </Motion.div>
            ))
          )}
        </div>

        {newsData.length > visibleCount + 1 && !loading && (
          <div className="load-more">
            <button onClick={showMore}>Mostrar más</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllNews;
