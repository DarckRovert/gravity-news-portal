import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, BookOpen, ArrowRight, PenTool, Bookmark, Share2 } from 'lucide-react';
import { playSound } from '../utils/audio';
import { useSearch } from '../contexts/SearchContext';
import { useBookmarks } from '../contexts/BookmarkContext';
import SEO from '../components/SEO';
import essaysData from '../data/essays.json';
import ProgressiveImage from '../components/ProgressiveImage';
import './Essays.css';

const getRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  return `Hace ${Math.floor(hours / 24)}d`;
};

export default function Essays() {
  const [selectedEssay, setSelectedEssay] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchTerm } = useSearch();
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const [selectedTag, setSelectedTag] = useState('Todos');

  // Deep linking for essays
  useEffect(() => {
    const articleId = searchParams.get('article');
    if (articleId && (!selectedEssay || selectedEssay.id !== articleId)) {
      const essay = essaysData.find(e => e.id === articleId);
      if (essay) {
        setSelectedEssay(essay);
      }
    } else if (!articleId && selectedEssay) {
      setSelectedEssay(null);
    }
  }, [searchParams, selectedEssay]);

  const handleOpenEssay = (essay) => {
    playSound('click');
    setSelectedEssay(essay);
    setSearchParams({ article: essay.id });
  };

  const handleCloseEssay = () => {
    playSound('click');
    setSelectedEssay(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('article');
    setSearchParams(newParams);
  };

  const handleShare = async (essay) => {
    playSound('click');
    const shareUrl = `${window.location.origin}${window.location.pathname}?article=${essay.id}`;
    const shareData = {
      title: essay.title,
      text: essay.excerpt,
      url: shareUrl,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${essay.title}\n${shareUrl}`);
        alert('Enlace cuántico copiado al portapapeles');
      }
    } catch (e) {
      console.log('Error al compartir', e);
    }
  };

  const allTags = useMemo(() => {
    const tags = new Set(['Todos', 'Guardados']);
    essaysData.forEach(e => {
      if (e.category) tags.add(e.category);
    });
    return Array.from(tags);
  }, []);

  const filtered = useMemo(() => {
    return essaysData.filter(essay => {
      const query = searchTerm || '';
      const matchesSearch = query === '' ||
        essay.title.toLowerCase().includes(query.toLowerCase()) ||
        essay.excerpt.toLowerCase().includes(query.toLowerCase());
      
      const matchesTag = selectedTag === 'Guardados' 
        ? isBookmarked(essay.id) 
        : (selectedTag === 'Todos' || essay.category === selectedTag);
      
      return matchesSearch && matchesTag;
    });
  }, [searchTerm, selectedTag, isBookmarked]);

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

  if (selectedEssay) {
    return (
      <AnimatePresence>
        <motion.div
          className="essay-reader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <SEO title={selectedEssay.title} description={selectedEssay.excerpt} />
          <button className="essay-back-btn" onClick={handleCloseEssay}>
            ← Volver a Ensayos
          </button>
          <div className="essay-reader-header">
            <span className="badge-futuristic">{selectedEssay.category}</span>
            <h1 className="essay-reader-title">{selectedEssay.title}</h1>
            {selectedEssay.subtitle && (
              <p className="essay-reader-subtitle">{selectedEssay.subtitle}</p>
            )}
            <div className="essay-reader-meta">
              <span><PenTool size={14} /> {selectedEssay.author}</span>
              <span><Clock size={14} /> {getRelativeTime(selectedEssay.date)}</span>
              <span><BookOpen size={14} /> {selectedEssay.readingTime} min</span>
              <button 
                onClick={() => handleShare(selectedEssay)}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}
                title="Compartir"
              >
                <Share2 size={14} /> Compartir
              </button>
            </div>
          </div>
          <div
            className="essay-reader-body"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedEssay.fullText) }}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="essays-container">
      <SEO 
        title="Ensayos" 
        description="Textos profundos y de largo aliento sobre la Física del Poder y la Resistencia." 
      />
      {/* Header */}
      <motion.div
        className="essays-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="essays-title-block">
          <span className="essays-eyebrow">ARCHIVO FILOSÓFICO</span>
          <h1 className="essays-title">Ensayos & Análisis</h1>
          <p className="essays-desc">
            Análisis de fondo sobre soberanía individual, filosofía política, epistemología y la física del poder.
            Sin agenda partidista. Sin ideología prefabricada. Solo pensamiento honesto.
          </p>
        </div>



        {/* Tags */}
        <div className="essays-tags">
          {allTags.map(tag => (
            <button
              key={tag}
              className={`tag-pill ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Essays Grid */}
      <div className="essays-grid">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div className="essays-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <PenTool size={48} />
              <p>No se encontraron ensayos. El filósofo está meditando.</p>
            </motion.div>
          ) : (
            filtered.map((essay, i) => (
              <motion.article
                key={essay.id}
                className="essay-card glass-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                onClick={() => handleOpenEssay(essay)}
              >
                <div className="essay-card-image">
                  <ProgressiveImage src={essay.image} alt={essay.title} className="essay-img" />
                  <div className="essay-card-overlay" />
                  <span className="badge-futuristic essay-badge">{essay.category}</span>
                </div>
                <div className="essay-card-body">
                  <h2 className="essay-card-title">{essay.title}</h2>
                  {essay.subtitle && <p className="essay-card-subtitle">{essay.subtitle}</p>}
                  <p className="essay-card-excerpt">{essay.excerpt}</p>
                  <div className="essay-card-footer">
                    <div className="essay-card-meta">
                      <span><Clock size={12} /> {getRelativeTime(essay.date)}</span>
                      <span><BookOpen size={12} /> {essay.readingTime} min</span>
                    </div>
                    <div className="essay-card-actions" style={{ display: 'flex', gap: '8px' }}>
                      <button className="essay-read-btn">
                        Leer <ArrowRight size={14} />
                      </button>
                      <button 
                        className={`essay-bookmark-btn ${isBookmarked(essay.id) ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleBookmark(essay.id); }}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: '0.4rem', borderRadius: '8px', border: '1px solid var(--border-subtle)',
                          background: isBookmarked(essay.id) ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                          color: isBookmarked(essay.id) ? '#000' : 'var(--text-secondary)',
                          cursor: 'pointer', transition: 'all 0.2s ease'
                        }}
                      >
                        <Bookmark size={16} fill={isBookmarked(essay.id) ? 'currentColor' : 'none'} />
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
