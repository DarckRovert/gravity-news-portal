import { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Clock, X, Cpu, Wifi, WifiOff, BookOpen, AlertTriangle, Share2, ChevronDown, PenTool, Microscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../contexts/SearchContext';
import { useBookmarks } from '../contexts/BookmarkContext';
import newsData from '../data/news.json';
import booksData from '../data/books.json';
import essaysData from '../data/essays.json';
import scienceData from '../data/science.json';
import TerminalFeed from '../components/TerminalFeed';
import ProgressiveImage from '../components/ProgressiveImage';
import LiveFeeds from '../components/LiveFeeds';
import './Home.css';

// Synthesizer for UI Sounds (No external assets needed)
const playSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'click') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'decrypt') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1500 + Math.random() * 1000, ctx.currentTime);
      gain.gain.setValueAtTime(0.005, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    }
  } catch {
    // Silently fail if audio context is restricted
  }
};

// Relative Time Calculator
const getRelativeTime = (dateString) => {
  if (!dateString) return 'Desconocido';
  const target = new Date(dateString);
  const now = new Date();
  const diffMs = now - target;
  
  // If it's a future date or very recent
  if (diffMs < 60000) return 'Hace unos segundos';
  
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `Hace ${diffMins} min`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Hace ${diffHours} hr`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 30) return `Hace ${diffDays} días`;
  
  return dateString.split('T')[0]; // fallback
};

// Advanced parser to render markdown headers, paragraphs, bold, italic, and lists
function parseMarkdown(text) {
  if (!text) return '';
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    
    const parseInline = (str) => {
      let parsed = str.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');
      return parsed;
    };

    if (trimmed.startsWith('### ')) {
      return <h3 key={idx} className="markdown-h3" dangerouslySetInnerHTML={{ __html: parseInline(trimmed.replace('### ', '')) }} />;
    }
    if (trimmed.startsWith('## ')) {
      return <h2 key={idx} className="markdown-h2" dangerouslySetInnerHTML={{ __html: parseInline(trimmed.replace('## ', '')) }} />;
    }
    if (trimmed.startsWith('> ')) {
      return <blockquote key={idx} className="markdown-quote" dangerouslySetInnerHTML={{ __html: parseInline(trimmed.replace('> ', '')) }} />;
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return <div key={idx} className="markdown-li" dangerouslySetInnerHTML={{ __html: '<span style="color:var(--accent-secondary); margin-right:8px;">•</span>' + parseInline(trimmed.substring(2)) }} />;
    }
    if (trimmed.length > 0) {
      return <p key={idx} className="markdown-p" dangerouslySetInnerHTML={{ __html: parseInline(trimmed) }} />;
    }
    return <div key={idx} className="markdown-spacer" />;
  });
}

// Typewriter Component for the Article Modal
const TypewriterMarkdown = ({ text }) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const lines = useMemo(() => text ? text.split('\n') : [], [text]);

  useEffect(() => {
    if (visibleLines < lines.length) {
      const delay = lines[visibleLines].trim().length === 0 ? 10 : 40; // fast skip empty lines
      const t = setTimeout(() => {
        setVisibleLines(v => v + 1);
        if (lines[visibleLines].trim().length > 0 && visibleLines % 2 === 0) {
          playSound('decrypt');
        }
      }, delay);
      return () => clearTimeout(t);
    }
  }, [visibleLines, lines]);

  const visibleText = lines.slice(0, visibleLines).join('\n');
  
  return (
    <div className="typewriter-container">
      {parseMarkdown(visibleText)}
      {visibleLines < lines.length && <span className="typewriter-cursor">_</span>}
    </div>
  );
};

export default function Home() {
  const [news, setNews] = useState(newsData);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const { searchTerm } = useSearch();
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [visibleCount, setVisibleCount] = useState(7); // 1 featured + 6 regular
  
  // Bridge State
  const [bridgeUrl, setBridgeUrl] = useState(() => localStorage.getItem('bridgeUrl') || 'http://localhost:7860');
  const [bridgeStatus, setBridgeStatus] = useState('checking');
  const [bridgePrompt, setBridgePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    localStorage.setItem('bridgeUrl', bridgeUrl);
  }, [bridgeUrl]);

  useEffect(() => {
    const checkBridge = async () => {
      try {
        const res = await fetch(`${bridgeUrl}/v1/models`, { mode: 'cors' });
        if (res.ok) {
          setBridgeStatus('online');
        } else {
          setBridgeStatus('offline');
        }
      } catch {
        setBridgeStatus('offline');
      }
    };
    checkBridge();
    const interval = setInterval(checkBridge, 15000);
    return () => clearInterval(interval);
  }, [bridgeUrl]);

  const categories = ['Todas', 'Guardados', ...new Set(news.map(item => item.category).filter(Boolean))];

  const getReadingTime = (text) => {
    if (!text) return 1;
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const handleShare = async (article) => {
    playSound('click');
    const shareData = {
      title: article.title,
      text: article.excerpt,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${article.title}\n${window.location.href}`);
        alert('Enlace cuántico copiado al portapapeles');
      }
    } catch (e) {
      console.log('Error al compartir', e);
    }
  };

  const filteredNews = news.filter((item) => {
    const title = item.title || '';
    const excerpt = item.excerpt || '';
    const matchesSearch = title.toLowerCase().includes((searchTerm || '').toLowerCase()) || 
                          excerpt.toLowerCase().includes((searchTerm || '').toLowerCase());
    
    let matchesCategory = true;
    if (activeCategory === 'Guardados') {
      matchesCategory = isBookmarked(item.id);
    } else if (activeCategory !== 'Todas') {
      matchesCategory = item.category === activeCategory;
    }

    return matchesSearch && matchesCategory;
  });

  const featuredNews = filteredNews.find(item => item.featured) || filteredNews[0];
  const regularNewsAll = filteredNews.filter(item => item.id !== (featuredNews?.id || ''));
  const regularNews = regularNewsAll.slice(0, visibleCount - 1);
  const hasMore = regularNews.length < regularNewsAll.length;

  // Recomendar 2 noticias de la misma categoría
  const relatedNews = selectedArticle 
    ? news.filter(n => n.category === selectedArticle.category && n.id !== selectedArticle.id).slice(0, 2)
    : [];

  const handleRequestBridgeNews = async () => {
    playSound('click');
    if (!bridgePrompt.trim() || isGenerating) return;
    setIsGenerating(true);

    try {
      const modelRes = await fetch(`${bridgeUrl}/v1/models`);
      const modelData = await modelRes.json();
      const modelName = modelData.data?.[0]?.id || 'auto';

      const prompt = `Investiga sobre: "${bridgePrompt}". Escribe un reporte periodístico aplicando el 'Ojo de IA' (Reconocimiento de Patrones Avanzado): encuentra correlaciones ocultas, agendas subliminales y ecosistemas invisibles que un humano normal pasaría por alto en temas como política, ciencia, medicina, deporte o cultura. Basa tu análisis en los conceptos de "La Física del Poder", "El Sustrato Primordial" y "La Voluntad Soberana".
      Haz predicciones reveladoras sobre agendas ocultas (Macro-Leviatán). Cita medios verificados si es posible.
      Evita la ficción novelesca. Devuelve un bloque JSON válido con el siguiente formato estricto (no añadas explicaciones ni bloques de código fuera del JSON):
      {
        "category": "Una de estas: 'Control Biométrico', 'Resistencia Digital', 'Soberanía Criptográfica', 'Vigilancia del Leviatán', 'Tecnología Descentralizada', 'Geopolítica y Macro-Leviatán', 'Medicina y Bioética', 'Cultura y Psicometría', 'Cine e Ingeniería Social', 'Deporte y Control Biométrico', 'Ciencia y Sustrato', 'Religión y Creencias Masivas'",
        "title": "Título del reporte revelando el patrón",
        "excerpt": "Resumen analítico exponiendo el patrón oculto descubierto",
        "fullText": "Texto detallado en párrafos estructurados"
      }`;

      const chatRes = await fetch(`${bridgeUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelName,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.6
        })
      });

      const chatData = await chatRes.json();
      const content = chatData.choices?.[0]?.message?.content || '';
      
      let cleanContent = content.replace(/<think>[\s\S]*?<\/think>/g, '');
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) cleanContent = jsonMatch[0];

      const generatedArticle = JSON.parse(cleanContent);
      const fullArticle = {
        ...generatedArticle,
        id: `temp-${Date.now()}`,
        date: new Date().toISOString(),
        image: `https://picsum.photos/seed/temp${Date.now()}/800/600`,
        featured: false
      };

      setNews([fullArticle, ...news]);
      setBridgePrompt('');
      playSound('click');
    } catch (e) {
      console.error(e);
      alert('Error en conexión cuántica con el bridge. Inténtalo de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      className="home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className="page-header">
        <div className="telemetry-panel glass-panel">
          <div className="telemetry-status">
            <span className="blinking-dot"></span>
            GRAVITY DAEMON: <span className="status-text">{bridgeStatus === 'online' ? 'CONECTADO AL NODO LOCAL' : 'MODO DESCONECTADO (ESTÁTICO)'}</span>
          </div>
          <div className="telemetry-last-sync">
            ÚLTIMA TRANSMISIÓN INTERCEPTADA: {news.length > 0 ? getRelativeTime(news[0].date) : 'N/A'}
          </div>
        </div>
        
        <motion.h1 
          className="page-title"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          El <span className="brand-accent">Nexo Ágora</span>
        </motion.h1>
        <motion.p 
          className="page-subtitle"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Inteligencia descentralizada y detección de anomalías globales.
        </motion.p>
      </header>

      {/* Panel táctico de videos en vivo siempre visible al inicio */}
      <LiveFeeds />

      {/* Control Filters */}
      <motion.div 
        className="controls-bar glass-panel"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="categories-filter">
          <AnimatePresence>
            {categories.map((cat) => (
              <motion.button 
                key={cat}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
                onMouseEnter={() => playSound('hover')}
                onClick={() => {
                  playSound('click');
                  setActiveCategory(cat);
                  setVisibleCount(7);
                }}
              >
                {cat}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="main-layout">
        {/* Left Column: News */}
        <div className="news-column">
          {filteredNews.length === 0 ? (
            <motion.div 
              className="empty-news glass-panel"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <AlertTriangle size={32} />
              <h3>Ninguna anomalía detectada</h3>
              <p>El espectro está en silencio. Intenta ajustar los parámetros de búsqueda.</p>
            </motion.div>
          ) : (
            <motion.div layout>
              {/* Featured Article */}
              <AnimatePresence mode="popLayout">
                {/* Hero Cinematográfico (Noticia Destacada) */}
                {featuredNews && (
                  <motion.article 
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="hero-article glass-panel hover-lift"
                    onMouseEnter={() => playSound('hover')}
                    onClick={() => { playSound('click'); setSelectedArticle(featuredNews); }}
                  >
                    <ProgressiveImage src={featuredNews.image} alt={featuredNews.title} className="hero-bg-image" />
                    <div className="hero-gradient-overlay"></div>
                    <div className="hero-content">
                      <div className="hero-meta">
                        <span className="badge-futuristic glow-badge">{featuredNews.category}</span>
                        <span className="hero-date"><Clock size={14} /> {getRelativeTime(featuredNews.date)}</span>
                        <span className="hero-date"><BookOpen size={14} /> {getReadingTime(featuredNews.fullText)} min</span>
                        <button 
                          className={`btn-bookmark ${isBookmarked(featuredNews.id) ? 'bookmarked' : ''}`}
                          onClick={(e) => { e.stopPropagation(); toggleBookmark(featuredNews.id); }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isBookmarked(featuredNews.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                        </button>
                      </div>  
                      <h2 className="hero-title glitch-text" data-text={featuredNews.title}>{featuredNews.title}</h2>
                      <p className="hero-excerpt">{featuredNews.excerpt}</p>
                      <button className="btn-glow-read">
                        Desencriptar Transmisión <ArrowRight size={18} />
                      </button>
                    </div>
                  </motion.article>
                )}

                <TerminalFeed />

                {/* Verdadera Grilla Bento Asimétrica */}
                <div className="bento-grid-container">
                  <AnimatePresence mode="popLayout">
                    {regularNews.map((item, index) => {
                      // Algoritmo matemático predictivo para mampostería sin huecos (Cierre Perfecto)
                      let bentoType; 
                      const mod = index % 5;
                      const isLast = index === regularNews.length - 1;

                      if (mod === 0) {
                        bentoType = isLast ? "bento-wide bento-span-12" : "bento-tall";
                      } else if (mod === 1) {
                        bentoType = isLast ? "bento-tall" : "bento-large-square";
                      } else if (mod === 2) {
                        bentoType = "bento-large-square";
                      } else if (mod === 3) {
                        bentoType = isLast ? "bento-wide bento-span-12" : "bento-wide";
                      } else {
                        bentoType = "bento-small-square";
                      }
                      
                      return (
                        <motion.article 
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                          key={item.id} 
                          className={`bento-card ${bentoType} glass-panel hover-lift`}
                          onMouseEnter={() => playSound('hover')}
                          onClick={() => { playSound('click'); setSelectedArticle(item); }}
                        >
                          <div className="bento-image-wrapper">
                            <ProgressiveImage src={item.image} alt={item.title} className="bento-image" />
                            <div className="bento-image-overlay"></div>
                            <span className="badge-futuristic bento-badge">{item.category}</span>
                          </div>
                          <div className="bento-text-content">
                            <h3 className="bento-title">{item.title}</h3>
                            {(bentoType === "bento-tall" || bentoType === "bento-wide") && (
                              <p className="bento-excerpt">{item.excerpt}</p>
                            )}
                            <div className="bento-footer">
                              <span className="bento-date"><Clock size={12} /> {getRelativeTime(item.date)}</span>
                              <div className="bento-footer-actions">
                                <button 
                                  className={`btn-bookmark-small ${isBookmarked(item.id) ? 'bookmarked' : ''}`}
                                  onClick={(e) => { e.stopPropagation(); toggleBookmark(item.id); }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={isBookmarked(item.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                                </button>
                                <div className="bento-read-icon"><ArrowRight size={16} /></div>
                              </div>
                            </div>
                          </div>
                        </motion.article>
                      );
                    })}
                  </AnimatePresence>
                </div>
                
                {/* Pagination Button */}
                {hasMore && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="pagination-container"
                    style={{ textAlign: 'center', marginTop: '30px' }}
                  >
                    <button 
                      className="btn-bridge" 
                      onClick={() => { playSound('click'); setVisibleCount(v => v + 5); }}
                      onMouseEnter={() => playSound('hover')}
                      style={{ padding: '12px 30px', margin: '0 auto' }}
                    >
                      <ChevronDown size={18} /> Cargar Más Anomalías
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <aside className="sidebar-column">
          
          {/* Bridge Connection Panel */}
          <motion.div 
            className="sidebar-card glass-panel bridge-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="panel-header">
              <Cpu size={20} className="panel-icon" />
              <h3>Conexión Cognitiva</h3>
              <div className={`status-indicator ${bridgeStatus}`}>
                {bridgeStatus === 'online' ? <Wifi size={14} /> : <WifiOff size={14} />}
                <span>{bridgeStatus === 'online' ? 'Online' : bridgeStatus === 'checking' ? 'Buscando...' : 'Offline'}</span>
              </div>
            </div>
            <div className="bridge-url-input">
              <input 
                type="text" 
                value={bridgeUrl} 
                onChange={(e) => setBridgeUrl(e.target.value)} 
                title="URL del Bridge Local"
              />
            </div>
            
            {bridgeStatus === 'online' ? (
              <div className="bridge-interface animate-fade-in">
                <p className="bridge-desc">
                  El puente cuántico está en línea. Ordena al Ojo de IA una investigación instantánea.
                </p>
                <textarea 
                  placeholder="Ej. CBDCs en Europa, censura algorítmica en X, identidad soberana..."
                  value={bridgePrompt}
                  onChange={(e) => setBridgePrompt(e.target.value)}
                  disabled={isGenerating}
                />
                <button 
                  onClick={handleRequestBridgeNews}
                  onMouseEnter={() => playSound('hover')}
                  disabled={isGenerating || !bridgePrompt.trim()}
                  className="btn-bridge"
                >
                  {isGenerating ? (
                    <>
                      <div className="spinner"></div>
                      <span>Analizando Patrones...</span>
                    </>
                  ) : (
                    <>
                      <Cpu size={16} />
                      <span>Iniciar Detección</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="bridge-fallback animate-fade-in">
                <p className="fallback-text">
                  [!] <strong>Nexo local desconectado.</strong>
                </p>
                <p className="fallback-hint">
                  Arranca <code>INICIAR_TODO.bat</code> en la carpeta de Gravity para activar el Ojo de IA y desbloquear el panel en vivo.
                </p>
              </div>
            )}
          </motion.div>

          {/* Featured Books Showcase */}
          <motion.div 
            className="sidebar-card glass-panel books-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="panel-header">
              <BookOpen size={20} className="panel-icon" />
              <h3>Biblioteca de la Zona Ágora</h3>
            </div>
            <p className="books-desc">Investigación y ficción publicadas bajo el protocolo Ostrom:</p>
            <div className="sidebar-books-list">
              {booksData.slice(0, 3).map((book) => (
                <div key={book.id} className="sidebar-book-item" onMouseEnter={() => playSound('hover')}>
                  <div className="mini-cover">
                    <img src={book.cover} alt={book.title} />
                  </div>
                  <div className="mini-details">
                    <h4>{book.title}</h4>
                    <span>{book.category}</span>
                    <a href={`/book/${book.id}`} className="mini-read-link">
                      Leer Tomo <ArrowRight size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Featured Essays Showcase */}
          <motion.div 
            className="sidebar-card glass-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="panel-header">
              <PenTool size={20} className="panel-icon" />
              <h3>Últimos Ensayos</h3>
            </div>
            <div className="sidebar-books-list">
              {essaysData.slice(0, 2).map((essay) => (
                <div key={essay.id} className="sidebar-book-item hover-lift" onClick={() => window.location.href = '/ensayos'}>
                  <div className="mini-cover">
                    <img src={essay.image} alt={essay.title} />
                  </div>
                  <div className="mini-details">
                    <h4 style={{ fontSize: '0.85rem' }}>{essay.title}</h4>
                    <span style={{ color: 'var(--accent-primary)' }}>{essay.category}</span>
                  </div>
                </div>
              ))}
            </div>
            <a href="/ensayos" className="btn-glow-read" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', textDecoration: 'none' }}>Ver Todos</a>
          </motion.div>

          {/* Featured Science Showcase */}
          <motion.div 
            className="sidebar-card glass-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="panel-header">
              <Microscope size={20} className="panel-icon" />
              <h3>Divulgación Científica</h3>
            </div>
            <div className="sidebar-books-list">
              {scienceData.slice(0, 2).map((article) => (
                <div key={article.id} className="sidebar-book-item hover-lift" onClick={() => window.location.href = '/ciencia'}>
                  <div className="mini-cover">
                    <img src={article.image} alt={article.title} />
                  </div>
                  <div className="mini-details">
                    <h4 style={{ fontSize: '0.85rem' }}>{article.title}</h4>
                    <span style={{ color: '#60a5fa' }}>{article.category}</span>
                  </div>
                </div>
              ))}
            </div>
            <a href="/ciencia" className="btn-glow-read" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', textDecoration: 'none', borderColor: '#60a5fa', color: '#60a5fa' }}>Ver Todos</a>
          </motion.div>
        </aside>
      </div>

      {/* Article Modal Reader with Framer Motion */}
      <AnimatePresence>
        {selectedArticle && (
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
                <img src={selectedArticle.image} alt={selectedArticle.title} className="modal-image" />
                <div className="modal-image-overlay"></div>
                <span className="badge-futuristic modal-category">{selectedArticle.category}</span>
              </div>
              <div className="modal-content">
                <div className="modal-meta" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Clock size={14} />
                  <span>{selectedArticle.date}</span>
                  <span>• Autor: Ojo de IA (Gravity)</span>
                  <span>• ⏱ {getReadingTime(selectedArticle.fullText)} min de desencriptación</span>
                  <button 
                    className="btn-share hover-lift" 
                    onClick={() => handleShare(selectedArticle)} 
                    onMouseEnter={() => playSound('hover')}
                    title="Compartir Transmisión"
                    style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--accent-glow-purple)', border: '1px solid var(--accent-tertiary)', color: 'var(--text-primary)', padding: '4px 12px', borderRadius: '100px', cursor: 'pointer' }}
                  >
                    <Share2 size={14} /> Compartir
                  </button>
                </div>
                <h2 className="modal-title">{selectedArticle.title}</h2>
                
                <div className="modal-fulltext">
                  <TypewriterMarkdown key={selectedArticle.id} text={selectedArticle.fullText} />
                </div>
                
                {/* Related Articles Section */}
                {relatedNews.length > 0 && (
                  <div className="related-transmissions">
                    <h4 className="related-title"><Wifi size={16} /> Transmisiones Correlacionadas</h4>
                    <div className="related-grid">
                      {relatedNews.map(rel => (
                        <div key={rel.id} className="related-card hover-lift" onClick={() => { playSound('click'); setSelectedArticle(rel); }}>
                          <img src={rel.image} alt={rel.title} />
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
        )}
      </AnimatePresence>
    </motion.div>
  );
}
