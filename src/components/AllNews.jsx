import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
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

  const extractPlainText = (blocks) => {
    if (!Array.isArray(blocks)) return '';
    const block = blocks.find((b) => b._type === 'block' && Array.isArray(b.children));
    return block ? block.children.map((c) => c.text).join('') : '';
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
      <Link key={item._id} to={`/news/${item._id}`} className="featured-news-card">
        <div className="img-wrapper">
          <img src={item.imageUrl} alt={item.title} loading="lazy" />
        </div>
        <div className="info">
          <h3>{item.title}</h3>
          <span>{formatDaysAgo(item.date)}</span>
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
          {rest.map((item) => (
            <Motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link to={`/news/${item._id}`} className="news-list-item">
                <div className="hover-wrapper">
                  <img src={item.imageUrl} alt={item.title} loading="lazy" />
                  <div className="text">
                    <h4>{item.title}</h4>
                    <p>{truncate(extractPlainText(item.content))}</p>
                    <div className="date">{formatDaysAgo(item.date)}</div>
                  </div>
                </div>
              </Link>
            </Motion.div>
          ))}
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
