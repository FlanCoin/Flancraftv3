import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../sanityClient';
import { ArrowRight } from 'lucide-react';
import '../styles/components/_newshighlight.scss';

const NewsHighlight = () => {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await client.fetch(`*[_type == "news"] | order(date desc) {
          _id,
          title,
          date,
          "imageUrl": image.asset->url,
          content
        }`);
        setNewsData(data);
      } catch (error) {
        console.error('Error al obtener noticias:', error);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Sin fecha' : date.toLocaleDateString();
  };

  const getExcerpt = (content, length = 180) => {
    try {
      if (!Array.isArray(content)) return '...';
      const blocks = content.filter(block => block._type === 'block' && Array.isArray(block.children));
      const fullText = blocks
        .map(block => block.children.map(c => typeof c.text === 'string' ? c.text : '').join(''))
        .join(' ');
      return fullText.slice(0, length) + '...';
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
            <span className="highlight-badge">DESTACADA</span>
            <div className="highlight-image">
              <img src={latest.imageUrl} alt={latest.title} />
            </div>
            <div className="highlight-content">
              <h3>
                <Link to={`/news/${latest._id}`}>{latest.title}</Link>
              </h3>
              <span className="date">{formatDate(latest.date)}</span>
              <p>{getExcerpt(latest.content)}</p>
              <Link to={`/news/${latest._id}`} className="readmore-link">
                Leer más <ArrowRight size={16} className="icon-inline" />
              </Link>
            </div>
          </div>
        )}

        <div className="highlight-previous">
          {previous.map((news) => (
            <div key={news._id} className="highlight-card">
              <img src={news.imageUrl} alt={news.title} />
              <div>
                <h4>
                  <Link to={`/news/${news._id}`}>{news.title}</Link>
                </h4>
                <span className="date">{formatDate(news.date)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="news-cta">
          <Link to="/news" className="cta-button">
            Ver todas las noticias <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsHighlight;
