import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, BookOpen, Microscope, ArrowRight, Bookmark } from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';
import { useBookmarks } from '../contexts/BookmarkContext';
import scienceData from '../data/science.json';
import ProgressiveImage from '../components/ProgressiveImage';
import SEO from '../components/SEO';
import './Science.css';

const getRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  return `Hace ${Math.floor(hours / 24)}d`;
};

export default function Science() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const { searchTerm } = useSearch();
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const [selectedCategory, setSelectedCategory] = useState('Todos');

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

  const renderMarkdown = (text) => {
    if (!text) return '';
    return text
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^---$/gm, '<hr/>')
      .replace(/\n/g, '<br/>');
  };

  if (selectedArticle) {
    return (
      <AnimatePresence>
        <motion.div
          className="science-reader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button className="science-back-btn" onClick={() => setSelectedArticle(null)}>
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
            </div>
          </div>
          <div
            className="science-reader-body"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedArticle.fullText) }}
          />
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
                onClick={() => setSelectedArticle(article)}
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
