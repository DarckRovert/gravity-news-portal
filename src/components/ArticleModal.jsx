import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Clock, Share2, Wifi, BookOpen, Terminal, Play, Square } from 'lucide-react';
import { playSound } from '../utils/audio';
import { getRelativeTime, getReadingTime } from '../utils/helpers';
import TypewriterMarkdown from './TypewriterMarkdown';

export default function ArticleModal({
  selectedArticle,
  setSelectedArticle,
  relatedNews = [],
  handleShare = () => {}
}) {
  const [readingMode, setReadingMode] = useState(false);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  // Stop TTS when closing modal
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleTTS = () => {
    if (!window.speechSynthesis) {
      alert("Tu navegador no soporta Síntesis de Voz.");
      return;
    }
    
    if (isPlayingTTS) {
      window.speechSynthesis.cancel();
      setIsPlayingTTS(false);
    } else {
      playSound('click');
      const textToRead = [
        selectedArticle.title,
        selectedArticle.tldr ? "Puntos clave: " + selectedArticle.tldr.join(". ") : "",
        selectedArticle.context || "",
        selectedArticle.analysis || "",
        selectedArticle.fullText || ""
      ].join(". ");

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'es-ES'; // Spanish
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingTTS(false);
      
      window.speechSynthesis.speak(utterance);
      setIsPlayingTTS(true);
    }
  };

  const articleText = selectedArticle.fullText || [
    selectedArticle.context ? "### Contexto\n" + selectedArticle.context : "",
    selectedArticle.analysis ? "### Análisis\n" + selectedArticle.analysis : ""
  ].filter(Boolean).join("\n\n");

  return (
    <motion.div 
      className="article-modal-overlay" 
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      onClick={() => { playSound('click'); setSelectedArticle(null); }}
    >
      <motion.div 
        className="article-modal glass-panel" 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="close-modal" 
          onClick={() => { playSound('click'); setSelectedArticle(null); }}
          onMouseEnter={() => playSound('hover')}
        >
          <X size={20} />
        </button>
        <div className="modal-header-image">
          <img 
            src={selectedArticle.image} 
            alt={selectedArticle.title} 
            className="modal-image"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="modal-image-overlay"></div>
          <span className="badge-futuristic modal-category">{selectedArticle.category}</span>
        </div>
        <div className="modal-content">
          <div className="modal-meta" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            <Clock size={14} />
            <span>{selectedArticle.date}</span>
            <span>• Autor: Ojo de IA (Gravity)</span>
            <span>• ⏱ {getReadingTime(selectedArticle)} min de desencriptación</span>
          </div>
          
          <div className="modal-actions-bar" style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button 
              className={`btn-action hover-lift ${readingMode ? 'active' : ''}`}
              onClick={() => { playSound('click'); setReadingMode(!readingMode); }}
              onMouseEnter={() => playSound('hover')}
              title="Modo Lectura"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: readingMode ? 'var(--accent-glow-blue)' : 'var(--glass-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '6px 14px', borderRadius: '100px', cursor: 'pointer', fontSize: '13px' }}
            >
              {readingMode ? <Terminal size={14} /> : <BookOpen size={14} />} 
              {readingMode ? 'Modo Inmersivo' : 'Modo Lectura'}
            </button>
            <button 
              className={`btn-action hover-lift ${isPlayingTTS ? 'active' : ''}`}
              onClick={handleTTS}
              onMouseEnter={() => playSound('hover')}
              title="Reproducir Transmisión"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: isPlayingTTS ? 'var(--accent-glow-purple)' : 'var(--glass-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '6px 14px', borderRadius: '100px', cursor: 'pointer', fontSize: '13px' }}
            >
              {isPlayingTTS ? <Square size={14} /> : <Play size={14} />} 
              {isPlayingTTS ? 'Detener Audio' : 'Escuchar Audio'}
            </button>
            <button 
              className="btn-share hover-lift" 
              onClick={() => handleShare(selectedArticle)} 
              onMouseEnter={() => playSound('hover')}
              title="Compartir Transmisión"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--accent-glow-purple)', border: '1px solid var(--accent-tertiary)', color: 'var(--text-primary)', padding: '4px 12px', borderRadius: '100px', cursor: 'pointer' }}
            >
              <Share2 size={14} /> Compartir
            </button>
          </div>
          <h2 className={`modal-title ${!readingMode ? 'glitch-text' : ''}`} data-text={selectedArticle.title}>{selectedArticle.title}</h2>
          
          {selectedArticle.tldr && (
            <div className="tldr-box" style={{ background: 'var(--glass-bg-highlight)', borderLeft: '4px solid var(--accent-primary)', padding: '16px', borderRadius: '4px 8px 8px 4px', marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 12px 0', color: 'var(--accent-primary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}><Wifi size={16}/> TL;DR (Resumen Ejecutivo)</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedArticle.tldr.map((point, i) => (
                  <li key={i} style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          <div className={`modal-fulltext ${readingMode ? 'reading-mode-active' : ''}`}>
            <TypewriterMarkdown key={selectedArticle.id + (readingMode ? '-read' : '-imm')} text={articleText} animated={!readingMode} />
          </div>
          
          {/* Related Articles Section */}
          {relatedNews.length > 0 && (
            <div className="related-transmissions">
              <h4 className="related-title"><Wifi size={16} /> Transmisiones Correlacionadas</h4>
              <div className="related-grid">
                {relatedNews.map(rel => (
                  <div key={rel.id} className="related-card hover-lift" onClick={() => { playSound('click'); setSelectedArticle(rel); }}>
                    <img 
                      src={rel.image} 
                      alt={rel.title}
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                    <div className="related-info">
                      <span className="related-date">{getRelativeTime(rel.date)}</span>
                      <h5>{rel.title}</h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
