import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaTelegramPlane, FaFacebook, FaTwitter, FaReddit,
  FaDiscord, FaClipboard, FaShareAlt
} from 'react-icons/fa';
import { motion as Motion } from 'framer-motion';
import '../styles/components/_newsdetail.scss';

const NewsDetail = () => {
  const { slug } = useParams(); // slug es el ID o slug de la noticia
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [latestNews, setLatestNews] = useState([]);
  const [visibleNews, setVisibleNews] = useState(4);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const pageUrl = window.location.href;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://flancraftweb-backend.onrender.com/api/noticias/${slug}`);
        if (!res.ok) throw new Error("No se pudo cargar la noticia");

        const data = await res.json();
        setTimeout(() => {
          setNews(data);
        }, 300);
      } catch (error) {
        console.error("Error al cargar la noticia:", error);
        navigate("/news");
      }
    };
    fetchData();
  }, [slug, navigate]);

  useEffect(() => {
    fetch("https://flancraftweb-backend.onrender.com/api/noticias")
      .then(res => res.json())
      .then(setLatestNews)
      .catch(err => console.error("Error al cargar últimas noticias:", err));
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const loadMore = () => setVisibleNews((prev) => prev + 4);

  return (
    <section className={`news-detail ${news ? 'loaded' : 'loading'}`}>
      {news ? (
        <div className="news-layout">
          <div className="news-container">
            <header className="news-header">
              <div className="share">
                <FaShareAlt onClick={() => setShowShareMenu(!showShareMenu)} />
                {showShareMenu && (
                  <div className="share-menu">
                    <p>Compartir</p>
                    <a href={`https://twitter.com/share?url=${pageUrl}&text=${news.titulo}`} target="_blank" rel="noreferrer"><FaTwitter /> Twitter</a>
                    <a href={`https://www.reddit.com/submit?url=${pageUrl}&title=${news.titulo}`} target="_blank" rel="noreferrer"><FaReddit /> Reddit</a>
                    <a href={`https://t.me/share/url?url=${pageUrl}&text=${news.titulo}`} target="_blank" rel="noreferrer"><FaTelegramPlane /> Telegram</a>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`} target="_blank" rel="noreferrer"><FaFacebook /> Facebook</a>
                    <a href="https://discord.com/channels/@me" target="_blank" rel="noreferrer"><FaDiscord /> Discord</a>
                    <div className="copy-link">
                      <input type="text" value={pageUrl} readOnly />
                      <button onClick={handleCopy}><FaClipboard /></button>
                    </div>
                  </div>
                )}
              </div>
            </header>

            <h1 className="title">{news.titulo}</h1>
            <p className="date">{new Date(news.fecha).toLocaleDateString()}</p>

            {news.imagen && (
              <img className="featured-img" src={news.imagen} alt={news.titulo} />
            )}

            <article className="content" dangerouslySetInnerHTML={{ __html: news.contenido }} />

            <button className="back-btn" onClick={() => navigate('/news')}>← Volver</button>

            {copied && <div className="copied">Link copiado al portapapeles</div>}
          </div>

          <aside className="news-sidebar">
            <h3>Últimas noticias</h3>
            <ul className="sidebar-news-list">
              {latestNews.slice(0, visibleNews).map((item) => {
                const isActive = item.id === slug || item.slug === slug;
                return (
                  <li
                    key={item.id}
                    className={isActive ? 'active' : ''}
                    onClick={() => navigate(`/news/${item.id}`)}
                  >
                    <img src={item.imagen} alt={item.titulo} />
                    <div>
                      <h4>{item.titulo}</h4>
                      <p>{new Date(item.fecha).toLocaleDateString()}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            {visibleNews < latestNews.length && (
              <div className="load-more-news">
                <button onClick={loadMore}>Ver más</button>
              </div>
            )}
          </aside>
        </div>
      ) : (
        <div className="loading-placeholder">
          <div className="glow-bar" />
          <div className="glow-bar short" />
          <div className="glow-img" />
          <div className="glow-paragraph" />
        </div>
      )}
    </section>
  );
};

export default NewsDetail;
