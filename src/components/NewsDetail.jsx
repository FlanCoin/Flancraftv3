import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import {
  FaTelegramPlane, FaFacebook, FaTwitter, FaReddit,
  FaDiscord, FaClipboard, FaShareAlt
} from 'react-icons/fa';
import client, { urlFor } from '../sanityClient';
import '../styles/components/_newsdetail.scss';

const NewsDetail = () => {
  const { slug } = useParams();
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
        const data = await client.fetch(
          `*[_type == "news" && slug.current == $slug][0]{
            title,
            content,
            date,
            "imageUrl": image.asset->url,
            slug
          }`,
          { slug }
        );
        if (data) {
          setNews(data);
        } else {
          const fallback = await client.fetch(
            `*[_type == "news" && _id == $slug][0]{
              title,
              content,
              date,
              "imageUrl": image.asset->url,
              slug
            }`,
            { slug }
          );
          fallback ? navigate(`/news/${fallback.slug.current}`) : console.error("Noticia no encontrada");
        }
      } catch (error) {
        console.error("Error al cargar la noticia:", error);
      }
    };
    fetchData();
  }, [slug, navigate]);

  useEffect(() => {
    client.fetch(
      `*[_type == "news"] | order(date desc){
        title,
        slug,
        date,
        "imageUrl": image.asset->url
      }`
    ).then(setLatestNews);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const loadMore = () => setVisibleNews((prev) => prev + 4);

  const portableTextComponents = {
    types: {
      image: ({ value }) => {
        const imageUrl = urlFor(value.asset).width(900).url();
        return (
          <figure className="news-image-block">
            <img src={imageUrl} alt={value.alt || ''} />
            {value.caption && <figcaption>{value.caption}</figcaption>}
          </figure>
        );
      },
      youtube: ({ value }) => {
        const match = value.url.includes('shorts')
          ? value.url.match(/shorts\/([a-zA-Z0-9_-]+)/)
          : value.url.match(/v=([^&]+)/);
        const videoId = match ? match[1] : null;
        return videoId ? (
          <div className="youtube-embed">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        ) : <p>Video no válido</p>;
      }
    }
  };

  if (!news) return <div className="news-detail">Cargando...</div>;

  return (
    <section className="news-detail">
      <div className="news-layout">
        <div className="news-container">
          <header className="news-header">
            <div className="share">
              <FaShareAlt onClick={() => setShowShareMenu(!showShareMenu)} />
              {showShareMenu && (
                <div className="share-menu">
                  <p>Compartir</p>
                  <a href={`https://twitter.com/share?url=${pageUrl}&text=${news.title}`} target="_blank" rel="noreferrer"><FaTwitter /> Twitter</a>
                  <a href={`https://www.reddit.com/submit?url=${pageUrl}&title=${news.title}`} target="_blank" rel="noreferrer"><FaReddit /> Reddit</a>
                  <a href={`https://t.me/share/url?url=${pageUrl}&text=${news.title}`} target="_blank" rel="noreferrer"><FaTelegramPlane /> Telegram</a>
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

          <h1 className="title">{news.title}</h1>
          <p className="date">{new Date(news.date).toLocaleDateString()}</p>

          {news.imageUrl && (
            <img className="featured-img" src={news.imageUrl} alt={news.title} />
          )}

          <article className="content">
            <PortableText value={news.content} components={portableTextComponents} />
          </article>

<button className="back-btn" onClick={() => navigate('/news')}>← Volver</button>

          {copied && <div className="copied">Link copiado al portapapeles</div>}
        </div>

        <aside className="news-sidebar">
          <h3>Últimas noticias</h3>
          <ul className="sidebar-news-list">
            {latestNews.slice(0, visibleNews).map((item) => {
              const isActive = item.slug.current === slug;
              return (
                <li
                  key={item.slug.current}
                  className={isActive ? 'active' : ''}
                  onClick={() => navigate(`/news/${item.slug.current}`)}
                >
                  <img src={item.imageUrl} alt={item.title} />
                  <div>
                    <h4>{item.title}</h4>
                    <p>{new Date(item.date).toLocaleDateString()}</p>
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
    </section>
  );
};

export default NewsDetail;
