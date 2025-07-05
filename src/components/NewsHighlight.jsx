import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import '../styles/components/_newshighlight.scss';

const NewsHighlight = () => {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('https://flancraftweb-backend.onrender.com/api/noticias');
        const data = await res.json();
        const sorted = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setNewsData(sorted);
      } catch (error) {
        console.error('Error al obtener noticias:', error);
      }
    };

    fetchNews();
  }, []);

  const formatDaysAgo = (dateStr) => {
    const today = new Date();
    const newsDate = new Date(dateStr);
    const diff = Math.floor((today - newsDate) / (1000 * 60 * 60 * 24));
    return `hace ${diff} día${diff !== 1 ? 's' : ''}`;
  };

  const getExcerpt = (htmlContent, length = 180) => {
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      const text = tempDiv.textContent || tempDiv.innerText || '';
      return text.slice(0, length) + '...';
    } catch {
      return '...';
    }
  };

  const latest = newsData[0];
  const previous = newsData.slice(1, 4);

  return (
    <section className="news-highlight">
      <div className="news-bg" />
      <div className="news-inner">
        <div className="news-header">
          <div className="news-title-wrapper">
            <div className="news-title-line" />
            <h2 className="news-title">Novedades</h2>
            <p className="news-desc">
              Mantente al día con las últimas noticias y actualizaciones de Flancraft.
            </p>
            <div className="news-title-line" />
          </div>
        </div>

        {latest && (
          <div className="highlight-featured">
            <div className="highlight-image">
              <img src={latest.imagen} alt={latest.titulo} />
            </div>
            <div className="highlight-content">
              <h3>
                <Link to={`/news/${latest.id}`}>{latest.titulo}</Link>
              </h3>
              <span className="date">{formatDaysAgo(latest.fecha)}</span>
              <p>{getExcerpt(latest.contenido)}</p>
              <Link to={`/news/${latest.id}`} className="readmore-link">
                Leer más <ArrowRight size={16} className="icon-inline" />
              </Link>
            </div>
          </div>
        )}

        <div className="highlight-previous">
          {previous.map((news) => (
            <Link to={`/news/${news.id}`} key={news.id} className="highlight-card-link">
              <div className="highlight-card">
                <img src={news.imagen} alt={news.titulo} />
                <div className="card-content">
                  <h4>{news.titulo}</h4>
                  <span className="date">{formatDaysAgo(news.fecha)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="news-cta">
          <Link to="/news" className="cta-button">
            Ver todas las noticias
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsHighlight;
