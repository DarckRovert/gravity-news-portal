import { useState, useEffect } from 'react';
import { ArrowRight, Clock, X, Search, Cpu, Wifi, WifiOff, BookOpen, AlertTriangle, Share2 } from 'lucide-react';
import newsData from '../data/news.json';
import booksData from '../data/books.json';
import './Home.css';

// Advanced parser to render markdown headers, paragraphs, bold, italic, and lists
function parseMarkdown(text) {
  if (!text) return '';
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    
    const parseInline = (str) => {
      // 1. Reemplazamos negritas primero para eliminar doble asteriscos
      let parsed = str.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // 2. Reemplazamos cursivas con un regex cross-browser seguro (Safari no soporta lookbehinds)
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

export default function Home() {
  const [news, setNews] = useState(newsData);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  
  // Bridge State
  const [bridgeUrl, setBridgeUrl] = useState(() => localStorage.getItem('bridgeUrl') || 'http://localhost:7860');
  const [bridgeStatus, setBridgeStatus] = useState('checking'); // online | offline | checking
  const [bridgePrompt, setBridgePrompt] = useState('');
  // bridgeResult is unused, removing it.
  const [isGenerating, setIsGenerating] = useState(false);

  // Save bridge URL to localStorage
  useEffect(() => {
    localStorage.setItem('bridgeUrl', bridgeUrl);
  }, [bridgeUrl]);

  // Check if local bridge is running
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
    // Check every 15 seconds
    const interval = setInterval(checkBridge, 15000);
    return () => clearInterval(interval);
  }, [bridgeUrl]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const categories = ['Todas', ...new Set(news.map(item => item.category).filter(Boolean))];

  const getReadingTime = (text) => {
    if (!text) return 1;
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const handleShare = async (article) => {
    const shareData = {
      title: article.title,
      text: article.excerpt,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${article.title}\\n${window.location.href}`);
        alert('Enlace cuántico copiado al portapapeles');
      }
    } catch (e) {
      console.log('Error al compartir', e);
    }
  };

  // Filter news based on search query and active category
  const filteredNews = news.filter((item) => {
    // Robustness check: avoid crashing if JSON entries are malformed
    const title = item.title || '';
    const excerpt = item.excerpt || '';
    
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Todas' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredNews = filteredNews.find(item => item.featured) || filteredNews[0];
  const regularNews = filteredNews.filter(item => item.id !== (featuredNews?.id || ''));

  // Request real-time news generation from local bridge
  const handleRequestBridgeNews = async () => {
    if (!bridgePrompt.trim() || isGenerating) return;
    setIsGenerating(true);
    // setBridgeResult(null);

    try {
      // 1. Get models list to route correctly
      const modelRes = await fetch(`${bridgeUrl}/v1/models`);
      const modelData = await modelRes.json();
      const modelName = modelData.data?.[0]?.id || 'auto';

      // 2. Query chat completions
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
      
      // Clean and parse the response JSON
      let cleanContent = content.replace(/<think>[\s\S]*?<\/think>/g, '');
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanContent = jsonMatch[0];
      }

      const generatedArticle = JSON.parse(cleanContent);
      const fullArticle = {
        ...generatedArticle,
        id: `temp-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        image: `https://picsum.photos/seed/temp${Date.now()}/800/600`,
        featured: false
      };

      // setBridgeResult(fullArticle);
      // Insert temporary article in the display list
      setNews([fullArticle, ...news]);
      setBridgePrompt('');
    } catch (e) {
      console.error(e);
      alert('Error en conexión cuántica con el bridge. Inténtalo de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="home-page animate-fade-in">
      <header className="page-header">
        <h1 className="page-title animate-slide-up" style={{ animationDelay: '0.1s' }}>
          El <span className="brand-accent">Nexo Ágora</span>
        </h1>
        <p className="page-subtitle animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Inteligencia descentralizada y noticias de contingencia global.
        </p>
      </header>

      {/* Control Filters */}
      <div className="controls-bar glass-panel animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar transmisiones de la resistencia..." 
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="categories-filter">
          {categories.map((cat) => (
            <button 
              key={cat} 
              className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="main-layout animate-slide-up" style={{ animationDelay: '0.4s' }}>
        
        {/* Left Column: News */}
        <div className="news-column">
          {filteredNews.length === 0 ? (
            <div className="empty-news glass-panel">
              <AlertTriangle size={32} />
              <h3>Sin transmisiones encontradas</h3>
              <p>El espectro está en silencio. Intenta con otros parámetros de búsqueda.</p>
            </div>
          ) : (
            <>
              {/* Featured Article */}
              {featuredNews && (
                <article 
                  className="news-card featured glass-panel hover-lift"
                  onClick={() => setSelectedArticle(featuredNews)}
                >
                  <div className="news-image-container">
                    <img 
                      src={featuredNews.image} 
                      alt={featuredNews.title} 
                      className="news-image" 
                      onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="%23050508"/><text x="50%" y="50%" fill="%2300f0ff" font-family="monospace" font-size="20" text-anchor="middle">[IMAGEN ENCRIPTADA - CONTINGENCIA ACTIVADA]</text></svg>'; }}
                    />
                    <div className="news-overlay"></div>
                    <span className="badge-futuristic news-category-badge">{featuredNews.category}</span>
                  </div>
                  <div className="news-content">
                    <div className="news-meta">
                      <Clock size={14} />
                      <span>{featuredNews.date}</span>
                      <span className="reading-time">⏱ {getReadingTime(featuredNews.fullText)} min</span>
                      <span className="featured-tag">REPORTE DESTACADO</span>
                    </div>
                    <h2 className="news-title">{featuredNews.title}</h2>
                    <p className="news-excerpt">{featuredNews.excerpt}</p>
                    <button className="read-more">
                      Desencriptar Reporte <ArrowRight size={16} />
                    </button>
                  </div>
                </article>
              )}

              {/* Regular Articles Grid */}
              <div className="regular-news-grid">
                {regularNews.map((item, index) => (
                  <article 
                    key={item.id} 
                    className="news-card glass-panel hover-lift"
                    onClick={() => setSelectedArticle(item)}
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <div className="news-image-container">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="news-image" 
                        onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="%23050508"/><text x="50%" y="50%" fill="%2300f0ff" font-family="monospace" font-size="20" text-anchor="middle">[IMAGEN ENCRIPTADA - CONTINGENCIA ACTIVADA]</text></svg>'; }}
                      />
                      <div className="news-overlay"></div>
                      <span className="badge-futuristic news-category-badge">{item.category}</span>
                    </div>
                    <div className="news-content">
                      <div className="news-meta">
                        <Clock size={14} />
                        <span>{item.date}</span>
                        <span className="reading-time">⏱ {getReadingTime(item.fullText)} min</span>
                      </div>
                      <h3 className="news-title">{item.title}</h3>
                      <p className="news-excerpt">{item.excerpt}</p>
                      <button className="read-more">
                        Ver Datos <ArrowRight size={16} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <aside className="sidebar-column">
          
          {/* Bridge Connection Panel */}
          <div className="sidebar-card glass-panel bridge-panel">
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
                  El puente cuántico local está en línea. Puedes ordenarle a Gravity una investigación periodística instantánea.
                </p>
                <textarea 
                  placeholder="Ej. CBDCs en Europa, censura algorítmica en X, identidad soberana..."
                  value={bridgePrompt}
                  onChange={(e) => setBridgePrompt(e.target.value)}
                  disabled={isGenerating}
                />
                <button 
                  onClick={handleRequestBridgeNews}
                  disabled={isGenerating || !bridgePrompt.trim()}
                  className="btn-bridge"
                >
                  {isGenerating ? (
                    <>
                      <div className="spinner"></div>
                      <span>Investigando...</span>
                    </>
                  ) : (
                    <>
                      <Cpu size={16} />
                      <span>Iniciar Investigación</span>
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
                  Arranca <code>INICIAR_TODO.bat</code> en la carpeta de Gravity para activar el pipeline y desbloquear la consola de investigación en vivo.
                </p>
              </div>
            )}
          </div>

          {/* Featured Books Showcase */}
          <div className="sidebar-card glass-panel books-panel">
            <div className="panel-header">
              <BookOpen size={20} className="panel-icon" />
              <h3>Biblioteca de la Zona Ágora</h3>
            </div>
            <p className="books-desc">Investigación y ficción publicadas bajo el protocolo Ostrom:</p>
            <div className="sidebar-books-list">
              {booksData.slice(0, 3).map((book) => (
                <div key={book.id} className="sidebar-book-item">
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
          </div>
        </aside>
      </div>

      {/* Article Modal Reader */}
      {selectedArticle && (
        <div className="article-modal-overlay animate-fade-in" onClick={() => setSelectedArticle(null)}>
          <div className="article-modal glass-panel animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedArticle(null)}>
              <X size={20} />
            </button>
            <div className="modal-header-image">
              <img 
                src={selectedArticle.image} 
                alt={selectedArticle.title} 
                className="modal-image" 
                onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="%23050508"/><text x="50%" y="50%" fill="%2300f0ff" font-family="monospace" font-size="20" text-anchor="middle">[IMAGEN ENCRIPTADA - CONTINGENCIA ACTIVADA]</text></svg>'; }}
              />
              <div className="modal-image-overlay"></div>
              <span className="badge-futuristic modal-category">{selectedArticle.category}</span>
            </div>
            <div className="modal-content">
              <div className="modal-meta" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                <Clock size={14} />
                <span>{selectedArticle.date}</span>
                <span>• Autor: DarckRovert (Gravity AI)</span>
                <span>• ⏱ {getReadingTime(selectedArticle.fullText)} min de lectura</span>
                <button 
                  className="btn-share hover-lift" 
                  onClick={() => handleShare(selectedArticle)} 
                  title="Compartir Transmisión"
                  style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--accent-glow-purple)', border: '1px solid var(--accent-tertiary)', color: 'var(--text-primary)', padding: '4px 12px', borderRadius: '100px', cursor: 'pointer' }}
                >
                  <Share2 size={14} /> Compartir
                </button>
              </div>
              <h2 className="modal-title">{selectedArticle.title}</h2>
              <div className="modal-fulltext">
                {parseMarkdown(selectedArticle.fullText)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
