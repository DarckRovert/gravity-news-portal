import { useState, useEffect } from 'react';

import { AlertTriangle, Clock, BookOpen, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../contexts/SearchContext';
import { useBookmarks } from '../contexts/BookmarkContext';
import newsData from '../data/news.json';
import TerminalFeed from '../components/TerminalFeed';
import ProgressiveImage from '../components/ProgressiveImage';
import LiveFeeds from '../components/LiveFeeds';
import Sidebar from '../components/Sidebar';
import ArticleModal from '../components/ArticleModal';
import BentoGrid from '../components/BentoGrid';
import { playSound } from '../utils/audio';
import { getRelativeTime, getReadingTime } from '../utils/helpers';
import './Home.css';

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

  // Dynamic live fetch for news from local daemon
  useEffect(() => {
    if (bridgeStatus === 'online' && bridgeUrl) {
      const fetchLiveNews = async () => {
        try {
          const res = await fetch(`${bridgeUrl}/v1/journalist/news`);
          if (res.ok) {
            const data = await res.json();
            if (data.ok && data.news && Array.isArray(data.news)) {
              // Merge dynamic news with static news, favoring dynamic by ID
              setNews(prevNews => {
                const liveIds = new Set(data.news.map(n => n.id));
                const filteredPrev = prevNews.filter(n => !liveIds.has(n.id));
                const merged = [...data.news, ...filteredPrev];
                // Sort by date descending
                merged.sort((a, b) => new Date(b.date) - new Date(a.date));
                return merged;
              });
            }
          }
        } catch (e) {
          // Silent fail
        }
      };
      
      fetchLiveNews();
      const interval = setInterval(fetchLiveNews, 10000); // Check every 10s
      return () => clearInterval(interval);
    }
  }, [bridgeStatus, bridgeUrl]);

  const categories = ['Todas', 'Guardados', ...new Set(news.map(item => item.category).filter(Boolean))];

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

                <TerminalFeed bridgeUrl={bridgeUrl} bridgeStatus={bridgeStatus} />

                <BentoGrid 
                  regularNews={regularNews}
                  isBookmarked={isBookmarked}
                  toggleBookmark={toggleBookmark}
                  setSelectedArticle={setSelectedArticle}
                  hasMore={hasMore}
                  setVisibleCount={setVisibleCount}
                />

              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <Sidebar 
          bridgeStatus={bridgeStatus}
          bridgeUrl={bridgeUrl}
          setBridgeUrl={setBridgeUrl}
          bridgePrompt={bridgePrompt}
          setBridgePrompt={setBridgePrompt}
          isGenerating={isGenerating}
          handleRequestBridgeNews={handleRequestBridgeNews}
        />
      </div>

      {/* Article Modal Reader */}
      <AnimatePresence>
        {selectedArticle && (
          <ArticleModal 
            selectedArticle={selectedArticle}
            setSelectedArticle={setSelectedArticle}
            relatedNews={relatedNews}
            handleShare={handleShare}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
