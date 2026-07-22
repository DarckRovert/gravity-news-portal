import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Clock, Share2, Wifi, BookOpen, Terminal, Play, Square, Check, Link, Minus, Plus } from 'lucide-react';
import { playSound } from '../utils/audio';
import { getRelativeTime, getReadingTime, DEFAULT_IMAGE_FALLBACK, copyToClipboard } from '../utils/helpers';
import TypewriterMarkdown from './TypewriterMarkdown';

export default function ArticleModal({
  selectedArticle,
  setSelectedArticle,
  relatedNews = [],
  handleShare = () => {}
}) {
  const [readingMode, setReadingMode] = useState(false);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [fontSize, setFontSize] = useState(16); // px base
  const [shareCopied, setShareCopied] = useState(false);
  const [prevArticleId, setPrevArticleId] = useState(selectedArticle?.id);
  const contentRef = useRef(null);

  // Synchronize state resets during render phase when article changes
  if (selectedArticle?.id !== prevArticleId) {
    setPrevArticleId(selectedArticle?.id);
    setReadingProgress(0);
    setFontSize(16);
  }

  // Stop TTS on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Lock body scroll and Listen for ESC key
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        playSound('click');
        setSelectedArticle(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setSelectedArticle]);

  // Reading progress tracker
  const handleScroll = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const total = scrollHeight - clientHeight;
    if (total <= 0) return;
    setReadingProgress(Math.min(100, Math.round((scrollTop / total) * 100)));
  }, []);

  const handleTTS = () => {
    if (!window.speechSynthesis) {
      alert('Tu navegador no soporta Síntesis de Voz.');
      return;
    }
    if (isPlayingTTS) {
      window.speechSynthesis.cancel();
      setIsPlayingTTS(false);
    } else {
      playSound('click');
      const textToRead = [
        selectedArticle.title,
        selectedArticle.tldr ? 'Puntos clave: ' + selectedArticle.tldr.join('. ') : '',
        selectedArticle.context || '',
        selectedArticle.analysis || '',
        selectedArticle.fullText || ''
      ].join('. ');
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingTTS(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingTTS(true);
    }
  };

  // Improved share: uses Web Share API on mobile, toast on desktop
  const handleShareClick = async () => {
    playSound('click');
    const shareUrl = `${window.location.origin}${window.location.pathname}?article=${selectedArticle.id}`;
    const shareData = {
      title: selectedArticle.title,
      text: selectedArticle.excerpt,
      url: shareUrl,
    };
    try {
      if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
        await navigator.share(shareData);
      } else {
        const success = await copyToClipboard(shareUrl);
        if (success) {
          setShareCopied(true);
          setTimeout(() => setShareCopied(false), 2500);
        }
      }
    } catch {
      // User cancelled or share failed fallback
      const success = await copyToClipboard(shareUrl);
      if (success) {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      } else {
        handleShare(selectedArticle);
      }
    }
  };

  const adjustFontSize = (delta) => {
    setFontSize(prev => Math.min(24, Math.max(12, prev + delta)));
  };

  const articleText = selectedArticle.fullText || [
    selectedArticle.context ? '### Contexto\n' + selectedArticle.context : '',
    selectedArticle.analysis ? '### Análisis\n' + selectedArticle.analysis : ''
  ].filter(Boolean).join('\n\n');

  const btnStyle = {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
    color: 'var(--text-primary)', padding: '6px 14px',
    borderRadius: '100px', cursor: 'pointer', fontSize: '13px',
    transition: 'all 0.2s ease'
  };

  return (
    <motion.div
      className="article-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ backdropFilter: 'blur(16px)' }}
      onClick={() => { playSound('click'); setSelectedArticle(null); }}
    >
      <motion.div
        className="article-modal glass-panel"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Reading Progress Bar */}
        <div className="modal-reading-progress-track">
          <motion.div
            className="modal-reading-progress-fill"
            animate={{ width: `${readingProgress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        <button
          type="button"
          className="close-modal"
          onClick={() => { playSound('click'); setSelectedArticle(null); }}
          onMouseEnter={() => playSound('hover')}
          aria-label="Cerrar artículo"
        >
          <X size={20} />
        </button>

        <div className="modal-header-image">
          <img
            src={selectedArticle.image}
            alt={selectedArticle.title}
            className="modal-image"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_IMAGE_FALLBACK;
            }}
          />
          <div className="modal-image-overlay" />
          <span className="badge-futuristic modal-category">{selectedArticle.category}</span>
        </div>

        <div className="modal-content" ref={contentRef} onScroll={handleScroll}>
          <div className="modal-meta">
            <Clock size={14} />
            <span>{getRelativeTime(selectedArticle.date)}</span>
            <span>• Ojo de IA (Gravity)</span>
            <span>• ⏱ {getReadingTime(selectedArticle)} min</span>
            <span className="modal-progress-label">{readingProgress}% leído</span>
          </div>

          <div className="modal-actions-bar">
            {/* Reading Mode Toggle */}
            <button
              type="button"
              className={`btn-action hover-lift ${readingMode ? 'active' : ''}`}
              onClick={() => { playSound('click'); setReadingMode(!readingMode); }}
              onMouseEnter={() => playSound('hover')}
              title="Modo Lectura"
              style={{ ...btnStyle, background: readingMode ? 'var(--accent-glow)' : 'var(--glass-bg)' }}
            >
              {readingMode ? <Terminal size={14} /> : <BookOpen size={14} />}
              {readingMode ? 'Inmersivo' : 'Lectura'}
            </button>

            {/* Font Size Controls */}
            <div className="font-size-controls" style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '100px', overflow: 'hidden' }}>
              <button type="button" onClick={() => adjustFontSize(-1)} title="Reducir texto" style={{ ...btnStyle, borderRadius: 0, border: 'none', padding: '6px 10px' }} aria-label="Reducir tamaño de texto">
                <Minus size={12} />
              </button>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '0 4px', fontFamily: 'var(--font-mono)' }}>{fontSize}px</span>
              <button type="button" onClick={() => adjustFontSize(1)} title="Aumentar texto" style={{ ...btnStyle, borderRadius: 0, border: 'none', padding: '6px 10px' }} aria-label="Aumentar tamaño de texto">
                <Plus size={12} />
              </button>
            </div>

            {/* TTS */}
            <button
              type="button"
              className={`btn-action hover-lift ${isPlayingTTS ? 'active' : ''}`}
              onClick={handleTTS}
              onMouseEnter={() => playSound('hover')}
              title="Escuchar Transmisión"
              style={{ ...btnStyle, background: isPlayingTTS ? 'var(--accent-glow-purple)' : 'var(--glass-bg)' }}
            >
              {isPlayingTTS ? <Square size={14} /> : <Play size={14} />}
              {isPlayingTTS ? 'Detener' : 'Audio'}
            </button>

            {/* Share — improved with toast */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="btn-share hover-lift"
                onClick={handleShareClick}
                onMouseEnter={() => playSound('hover')}
                title="Compartir"
                style={{ ...btnStyle, background: shareCopied ? 'rgba(0,200,100,0.2)' : 'var(--accent-glow-purple)', border: '1px solid var(--accent-tertiary)' }}
              >
                {shareCopied ? <Check size={14} /> : <Share2 size={14} />}
                {shareCopied ? '¡Copiado!' : 'Compartir'}
              </button>
              {shareCopied && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)',
                    background: 'rgba(0,200,100,0.9)', color: '#000', padding: '6px 12px',
                    borderRadius: '8px', fontSize: '12px', whiteSpace: 'nowrap',
                    pointerEvents: 'none', zIndex: 10
                  }}
                >
                  <Link size={10} style={{ display: 'inline', marginRight: '4px' }} />
                  Enlace copiado
                </motion.div>
              )}
            </div>
          </div>

          <h2
            className={`modal-title ${!readingMode ? 'glitch-text' : ''}`}
            data-text={selectedArticle.title}
          >
            {selectedArticle.title}
          </h2>

          {selectedArticle.tldr && (
            <div className="tldr-box">
              <h4 className="tldr-title"><Wifi size={16} /> TL;DR — Resumen Ejecutivo</h4>
              <ul className="tldr-list">
                {selectedArticle.tldr.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          <div
            className={`modal-fulltext ${readingMode ? 'reading-mode-active' : ''}`}
            style={{ fontSize: `${fontSize}px` }}
          >
            <TypewriterMarkdown
              key={selectedArticle.id + (readingMode ? '-read' : '-imm')}
              text={articleText}
              animated={!readingMode}
            />
          </div>

          {relatedNews.length > 0 && (
            <div className="related-transmissions">
              <h4 className="related-title"><Wifi size={16} /> Transmisiones Correlacionadas</h4>
              <div className="related-grid">
                {relatedNews.map(rel => (
                  <div
                    key={rel.id}
                    className="related-card hover-lift"
                    role="button"
                    tabIndex={0}
                    onClick={() => { playSound('click'); setSelectedArticle(rel); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { playSound('click'); setSelectedArticle(rel); } }}
                  >
                    <img
                      src={rel.image}
                      alt={rel.title}
                      loading="lazy"
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
