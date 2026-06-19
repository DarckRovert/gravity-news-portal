import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, BookOpen, ArrowRight, Search, PenTool } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('Todos');

  const allTags = useMemo(() => {
    const tags = new Set(['Todos']);
    essaysData.forEach(e => {
      if (e.category) tags.add(e.category);
    });
    return Array.from(tags);
  }, []);

  const filtered = useMemo(() => {
    return essaysData.filter(essay => {
      const matchesSearch = searchQuery === '' ||
        essay.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        essay.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag === 'Todos' || essay.category === selectedTag;
      return matchesSearch && matchesTag;
    });
  }, [searchQuery, selectedTag]);

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
          <button className="essay-back-btn" onClick={() => setSelectedEssay(null)}>
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

        {/* Search */}
        <div className="essays-search-bar glass-panel">
          <Search size={16} />
          <input
            type="text"
            placeholder="Buscar en los ensayos..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
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
                onClick={() => setSelectedEssay(essay)}
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
                    <button className="essay-read-btn">
                      Leer <ArrowRight size={14} />
                    </button>
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
