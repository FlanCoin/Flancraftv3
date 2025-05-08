import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../sanityClient';
import '../styles/components/_allnews.scss';

const AllNews = () => {
  const [newsData, setNewsData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

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

  const featured = newsData.slice(0, 4);
  const rest = newsData.slice(4, 4 + visibleCount);

  const showMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <section className="all-news-section">
      <div className="news-header-bg">
        <h2 className="main-title">Noticias</h2>
        <div className="featured-news-grid">
          {featured.map((item) => (
            <Link key={item._id} to={`/news/${item._id}`} className="featured-news-card">
              <div className="img-wrapper">
                <img src={item.imageUrl} alt={item.title} />
              </div>
              <div className="info">
                <h3>{item.title}</h3>
                <span>{formatDaysAgo(item.date)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="news-scroll-bg">
        <h3 className="scroll-title">Últimos artículos</h3>
        <div className="news-list">
          {rest.map((item) => (
            <Link key={item._id} to={`/news/${item._id}`} className="news-list-item">
              <img src={item.imageUrl} alt={item.title} />
              <div className="text">
                <h4>{item.title}</h4>
                <p>{item.content?.[0]?.children?.[0]?.text || ''}</p>
                <div className="date">{formatDaysAgo(item.date)}</div>
              </div>
            </Link>
          ))}
        </div>

        {newsData.length > visibleCount + 4 && (
          <div className="load-more">
            <button onClick={showMore}>Mostrar más</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllNews;
