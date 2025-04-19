import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Newspaper, ArrowRight } from 'lucide-react'
import client from '../../sanityClient'
import '../../styles/components/_newssection.scss'

const NewsSection = () => {
  const [newsData, setNewsData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const newsPerPage = 6

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await client.fetch(`*[_type == "news"] | order(date desc) {
          _id,
          title,
          date,
          "imageUrl": image.asset->url,
          content
        }`)
        setNewsData(data)
      } catch (error) {
        console.error('Error al obtener las noticias de Sanity:', error)
      }
    }

    fetchNews()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha'
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? 'Sin fecha' : date.toLocaleDateString()
  }

  const getTextExcerpt = (content, length = 250) => {
    try {
      if (!Array.isArray(content)) return '...'
      const textBlocks = content.filter(
        block => block._type === 'block' && Array.isArray(block.children)
      )
      const fullText = textBlocks
        .map(block =>
          block.children.map(child => (typeof child.text === 'string' ? child.text : '')).join('')
        )
        .join(' ')
      return fullText.slice(0, length) + '...'
    } catch {
      return '...'
    }
  }

  const latestNews = newsData.length > 0 ? newsData[0] : null
  const otherNews = newsData.length > 1 ? newsData.slice(1) : []

  const indexOfLastNews = currentPage * newsPerPage
  const indexOfFirstNews = indexOfLastNews - newsPerPage
  const currentNews = otherNews.slice(indexOfFirstNews, indexOfLastNews)
  const totalPages = Math.ceil(otherNews.length / newsPerPage)

  return (
    <section className="news-section">
      <div className="news-wrapper">
        <h2 className="news-title">
          <Newspaper size={24} className="icon" />
          Noticias del Servidor
        </h2>

        {latestNews && (
          <div className="news-featured">
            <img src={latestNews.imageUrl} alt={latestNews.title} />
            <div className="featured-content">
              <h3>
                <Link to={`/news/${latestNews._id}`}>{latestNews.title}</Link>
              </h3>
              <span>{formatDate(latestNews.date)}</span>
              <p>{getTextExcerpt(latestNews.content, 250)}</p>
              <Link to={`/news/${latestNews._id}`} className="news-read-more">
                Leer más <ArrowRight size={16} className="icon-inline" />
              </Link>
            </div>
          </div>
        )}

        <div className="news-grid">
          {currentNews.map((news) => (
            <div key={news._id} className="news-card">
              <Link to={`/news/${news._id}`} className="news-image-wrapper">
                <img src={news.imageUrl} alt={news.title} className="news-image" />
              </Link>
              <div className="news-content">
                <h3 className="news-heading">
                  <Link to={`/news/${news._id}`}>{news.title}</Link>
                </h3>
                <span className="news-date">{formatDate(news.date)}</span>
                <p className="news-excerpt">{getTextExcerpt(news.content)}</p>
                <Link to={`/news/${news._id}`} className="news-read-more">
                  Continuar leyendo <ArrowRight size={16} className="icon-inline" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="news-pagination">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`news-page-btn ${currentPage === index + 1 ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default NewsSection
