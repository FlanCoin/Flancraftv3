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

  const formatDaysAgo = (dateStr) => {
    const today = new Date();
    const newsDate = new Date(dateStr);
    const diff = Math.floor((today - newsDate) / (1000 * 60 * 60 * 24));
    return `hace ${diff} día${diff !== 1 ? 's' : ''}`;
  };

  const getExcerpt = (content, length = 180) => {
    try {
      if (!Array.isArray(content)) return '...';
      const blocks = content.filter(
        (block) => block._type === 'block' && Array.isArray(block.children)
      );
      const fullText = blocks
        .map((block) =>
          block.children.map((c) => (typeof c.text === 'string' ? c.text : '')).join('')
        )
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
            <div className="highlight-image">
              <img src={latest.imageUrl} alt={latest.title} />
            </div>
            <div className="highlight-content">
              <h3>
                <Link to={`/news/${latest._id}`}>{latest.title}</Link>
              </h3>
              <span className="date">{formatDaysAgo(latest.date)}</span>
              <p>{getExcerpt(latest.content)}</p>
              <Link to={`/news/${latest._id}`} className="readmore-link">
                Leer más <ArrowRight size={16} className="icon-inline" />
              </Link>
            </div>
          </div>
        )}

        <div className="highlight-previous">
          {previous.map((news) => (
            <Link to={`/news/${news._id}`} key={news._id} className="highlight-card-link">
              <div className="highlight-card">
                <img src={news.imageUrl} alt={news.title} />
                <div className="card-content">
                  <h4>{news.title}</h4>
                  <span className="date">{formatDaysAgo(news.date)}</span>
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
