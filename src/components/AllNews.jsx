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

  const truncate = (text, limit = 200) => {
    if (!text) return '';
    return text.length <= limit ? text : text.slice(0, text.lastIndexOf(' ', limit)) + '...';
  };

  const featured = newsData.slice(0, 1);
  const rest = newsData.slice(1, 1 + visibleCount);

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
        <div className="floating-news-hero">
  <img src="/assets/avioneta.png" alt="Repartidor de noticias Flancraft" />
</div>
        <hr className="news-section-divider" />
        
        <div className="news-list">

          {rest.map((item) => {
            const text = item.content?.[0]?.children?.[0]?.text || '';
            return (
              <Link key={item._id} to={`/news/${item._id}`} className="news-list-item">
                <div className="hover-wrapper">
                  <img src={item.imageUrl} alt={item.title} />
                  <div className="text">
                    <h4>{item.title}</h4>
                    <p>{truncate(text)}</p>
                    <div className="date">{formatDaysAgo(item.date)}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {newsData.length > visibleCount + 1 && (
          <div className="load-more">
            <button onClick={showMore}>Mostrar más</button>
          </div>
          
        )}
      </div>
      
    </section>
  );
};

export default AllNews;
