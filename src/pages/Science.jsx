import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, BookOpen, Microscope, ArrowRight, Bookmark, Share2 } from 'lucide-react';
import { playSound } from '../utils/audio';
import { useSearch } from '../contexts/SearchContext';
import { useBookmarks } from '../contexts/BookmarkContext';
import { getRelativeTime } from '../utils/helpers';
import scienceData from '../data/science.json';
import ProgressiveImage from '../components/ProgressiveImage';
import TypewriterMarkdown from '../components/TypewriterMarkdown';
import SEO from '../components/SEO';
import './Science.css';



export default function Science() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchTerm } = useSearch();
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Deep linking for articles
  useEffect(() => {
    const articleId = searchParams.get('article');
    if (articleId) {
      const article = scienceData.find(a => a.id === articleId);
      if (article) {
        if (!selectedArticle || selectedArticle !== article) {
          setSelectedArticle(article);
        }
      } else if (selectedArticle) {
        setSelectedArticle(null);
      }
    } else if (selectedArticle) {
      setSelectedArticle(null);
    }
  }, [searchParams, selectedArticle]);

  const handleOpenArticle = (article) => {
    playSound('click');
    setSelectedArticle(article);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('article', article.id);
    setSearchParams(newParams);
  };

  const handleCloseArticle = () => {
    playSound('click');
    setSelectedArticle(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('article');
    setSearchParams(newParams);
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
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${article.title}\n${shareUrl}`);
        alert('Enlace cuántico copiado al portapapeles');
      }
    } catch (e) {
      console.log('Error al compartir', e);
    }
  };

  const allCategories = useMemo(() => {
    const cats = new Set(['Todos', 'Guardados']);
    scienceData.forEach(a => { if (a.category) cats.add(a.category); });
    return Array.from(cats);
  }, []);

  const filtered = useMemo(() => {
    return scienceData.filter(a => {
      const query = searchTerm || '';
      const matchesSearch = query === '' ||
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        (a.excerpt || '').toLowerCase().includes(query.toLowerCase());
      
      const matchesCat = selectedCategory === 'Guardados'
        ? isBookmarked(a.id)
        : (selectedCategory === 'Todos' || a.category === selectedCategory);

      return matchesSearch && matchesCat;
    });
  }, [searchTerm, selectedCategory, isBookmarked]);



  if (selectedArticle) {
    return (
      <AnimatePresence>
        <motion.div
          className="science-reader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <SEO
            title={selectedArticle.title}
            description={selectedArticle.excerpt || ''}
            image={selectedArticle.image}
            article={true}
            url={`${window.location.origin}/ciencia?article=${selectedArticle.id}`}
          />
          <button type="button" className="science-back-btn" onClick={handleCloseArticle}>
            ← Volver a Ciencia
          </button>
          <div className="science-reader-header">
            <span className="badge-futuristic">{selectedArticle.category}</span>
            <h1 className="science-reader-title">{selectedArticle.title}</h1>
            {selectedArticle.subtitle && (
              <p className="science-reader-subtitle">{selectedArticle.subtitle}</p>
            )}
            <div className="science-reader-meta">
              <span><Microscope size={14} /> {selectedArticle.author}</span>
              <span><Clock size={14} /> {getRelativeTime(selectedArticle.date)}</span>
              <span><BookOpen size={14} /> {selectedArticle.readingTime} min</span>
              <button
                type="button"
                onClick={() => handleShare(selectedArticle)}
                style={{ background: 'transparent', border: 'none', color: '#60a5fa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}
                title="Compartir"
              >
                <Share2 size={14} /> Compartir
              </button>
            </div>
          </div>
          <div className="science-reader-body">
            <TypewriterMarkdown
              key={selectedArticle.id}
              text={selectedArticle.fullText || (selectedArticle.excerpt || '')}
              animated={false}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="science-container">
      <SEO 
        title="Ciencia y Sustrato" 
        description="Descubre los últimos avances en ciencia de frontera y el Sustrato Primordial." 
      />
      <motion.div
        className="science-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="science-eyebrow">DIVULGACIÓN CIENTÍFICA</span>
        <h1 className="science-title">Ciencia & Sustrato</h1>
        <p className="science-desc">
          Hallazgos verificables del frente científico global. Solo fuentes peer-reviewed.
          Sin especulación no etiquetada. El conocimiento como acto de resistencia.
        </p>



        <div className="science-tags">
          {allCategories.map(cat => (
            <button
              key={cat}
              className={`tag-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="science-grid">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div className="science-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Microscope size={48} />
              <p>El laboratorio está en silencio. El científico aún investiga.</p>
            </motion.div>
          ) : (
            filtered.map((article, i) => (
              <motion.article
                key={article.id}
                className="science-card glass-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                onClick={() => handleOpenArticle(article)}
              >
                <div className="science-card-image">
                  <ProgressiveImage src={article.image} alt={article.title} className="science-img" />
                  <div className="science-card-overlay" />
                  <span className="badge-futuristic science-badge">{article.category}</span>
                </div>
                <div className="science-card-body">
                  <h2 className="science-card-title">{article.title}</h2>
                  {article.subtitle && <p className="science-card-subtitle">{article.subtitle}</p>}
                  <p className="science-card-excerpt">{article.excerpt}</p>
                  <div className="science-card-footer">
                    <div className="science-card-meta">
                      <span><Clock size={12} /> {getRelativeTime(article.date)}</span>
                      <span><BookOpen size={12} /> {article.readingTime} min</span>
                    </div>
                    <div className="science-card-actions" style={{ display: 'flex', gap: '8px' }}>
                      <button className="science-read-btn">
                        Leer <ArrowRight size={14} />
                      </button>
                      <button 
                        className={`science-bookmark-btn ${isBookmarked(article.id) ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleBookmark(article.id); }}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: '0.4rem', borderRadius: '8px', border: '1px solid var(--border-subtle)',
                          background: isBookmarked(article.id) ? '#60a5fa' : 'rgba(255,255,255,0.05)',
                          color: isBookmarked(article.id) ? '#000' : 'var(--text-secondary)',
                          cursor: 'pointer', transition: 'all 0.2s ease'
                        }}
                      >
                        <Bookmark size={16} fill={isBookmarked(article.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
