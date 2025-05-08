import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../sanityClient';
import '../styles/components/_allnews.scss';

const AllNews = () => {
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
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const featured = newsData.slice(0, 4);
  const rest = newsData.slice(4);

  return (
    <section className="all-news-section">
      <div className="news-header-bg">
        <h2 className="main-title">Noticias</h2>
        <div className="featured-news-grid">
          {featured.map((item) => (
            <Link key={item._id} to={`/news/${item._id}`} className="featured-news-card">
              <img src={item.imageUrl} alt={item.title} />
              <div className="info">
                <h3>{item.title}</h3>
                <span>{formatDate(item.date)}</span>
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
                <p>{formatDate(item.date)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllNews;
