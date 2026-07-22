import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertTriangle, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../contexts/SearchContext';
import SEO from '../components/SEO';
import newsData from '../data/news.json';
import ProgressiveImage from '../components/ProgressiveImage';
import ArticleModal from '../components/ArticleModal';
import { playSound } from '../utils/audio';
import { getRelativeTime, getReadingTime, copyToClipboard } from '../utils/helpers';
import './Home.css';
import './Geopolitics.css';

export default function Geopolitics() {
  const news = newsData;
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchTerm } = useSearch();
  const [activeRegion, setActiveRegion] = useState('Global');

  const articleId = searchParams.get('article');
  const selectedArticle = useMemo(() => {
    if (!articleId) return null;
    return news.find(a => a.id === articleId) || null;
  }, [articleId, news]);

  const handleOpenArticle = (article) => {
    playSound('click');
    const newParams = new URLSearchParams(searchParams);
    newParams.set('article', article.id);
    setSearchParams(newParams);
  };

  const handleCloseArticle = () => {
    playSound('click');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('article');
    setSearchParams(newParams);
  };

  const handleModalArticleChange = (article) => {
    if (article) {
      handleOpenArticle(article);
    } else {
      handleCloseArticle();
    }
  };

  const handleShare = async (article) => {
    playSound('click');
    const shareUrl = `${window.location.origin}${window.location.pathname}?article=${article.id}`;
    const shareData = {
      title: article.title,
      text: article.excerpt,
      url: shareUrl,
    };
    try {
      if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
        await navigator.share(shareData);
      } else {
        await copyToClipboard(shareUrl);
      }
    } catch {
      await copyToClipboard(shareUrl);
    }
  };
  
  // Obtener regiones únicas de las noticias para los filtros
  const defaultRegions = ['Global', 'Norteamérica', 'Latinoamérica', 'Perú', 'Eurasia', 'Medio Oriente', 'África'];
  const extractedRegions = [...new Set(news.map(item => item.region).filter(Boolean))];
  const regions = [...new Set([...defaultRegions, ...extractedRegions])];

  const filteredNews = news.filter((item) => {
    const title = item.title || '';
    const excerpt = item.excerpt || '';
    const matchesSearch = title.toLowerCase().includes((searchTerm || '').toLowerCase()) || 
                          excerpt.toLowerCase().includes((searchTerm || '').toLowerCase());
    
    const matchesRegion = activeRegion === 'Global' 
      ? true 
      : Boolean(item.region && item.region.includes(activeRegion));

    return matchesSearch && matchesRegion;
  });

  return (
    <motion.div 
      className="home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SEO 
        title="Geopolítica Global" 
        description="Análisis del tablero mundial y los movimientos del Macro-Leviatán." 
      />
      <header className="page-header">
        <motion.h1 
          className="page-title"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Globe className="inline-icon" size={40} style={{ marginRight: '15px' }} />
          Radar <span className="brand-accent">Geopolítico</span>
        </motion.h1>
        <motion.p 
          className="page-subtitle"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Análisis regional descentralizado e inteligencia internacional.
        </motion.p>
      </header>

      {/* Control Filters (Regions) */}
      <motion.div 
        className="controls-bar glass-panel"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ marginBottom: '30px' }}
      >
        <div className="categories-filter">
          <AnimatePresence>
            {regions.map((region) => (
              <motion.button 
                key={region}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`category-chip ${activeRegion === region ? 'active' : ''}`}
                onMouseEnter={() => playSound('hover')}
                onClick={() => {
                  playSound('click');
                  setActiveRegion(region);
                }}
              >
                {region}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="main-layout" style={{ display: 'block' }}>
        {filteredNews.length === 0 ? (
          <motion.div 
            className="empty-news glass-panel"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <AlertTriangle size={32} />
            <h3>Ninguna anomalía detectada en esta región</h3>
            <p>El espectro regional está en silencio. Selecciona otra zona o ajusta los parámetros de búsqueda.</p>
          </motion.div>
        ) : (
          <motion.div 
            layout 
            className="bento-grid"
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '20px' 
            }}
          >
            <AnimatePresence>
              {filteredNews.map((item) => (
                <motion.article 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bento-item regular-bento glass-panel interactive-card"
                  onClick={() => handleOpenArticle(item)}
                >
                  <div className="bento-image-wrapper">
                    <ProgressiveImage src={item.image} alt={item.title} className="bento-image" />
                    {item.region && <div className="bento-category-tag">{item.region}</div>}
                  </div>
                  <div className="bento-content">
                    <h3 className="bento-title line-clamp-3">{item.title}</h3>
                    <p className="bento-excerpt line-clamp-3">{item.excerpt}</p>
                    <div className="bento-footer">
                      <span className="bento-date">{getRelativeTime(item.date)}</span>
                      <span className="bento-readtime">{getReadingTime(item.fullText)}</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedArticle && (
          <ArticleModal 
            selectedArticle={selectedArticle} 
            setSelectedArticle={handleModalArticleChange} 
            handleShare={handleShare}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
