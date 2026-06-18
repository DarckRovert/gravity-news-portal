import { useState, useEffect } from 'react';
import { ArrowRight, Clock, X, Search, Cpu, Wifi, WifiOff, BookOpen, AlertTriangle } from 'lucide-react';
import newsData from '../data/news.json';
import booksData from '../data/books.json';
import './Home.css';

// Simple parser to render markdown headers and paragraphs
function parseMarkdown(text) {
  if (!text) return '';
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('### ')) {
      return <h3 key={idx} className="markdown-h3">{trimmed.replace('### ', '')}</h3>;
    }
    if (trimmed.startsWith('## ')) {
      return <h2 key={idx} className="markdown-h2">{trimmed.replace('## ', '')}</h2>;
    }
    if (trimmed.startsWith('> ')) {
      return <blockquote key={idx} className="markdown-quote">{trimmed.replace('> ', '')}</blockquote>;
    }
    if (trimmed.length > 0) {
      return <p key={idx} className="markdown-p">{trimmed}</p>;
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

  const categories = ['Todas', 'Control Biométrico', 'Resistencia Digital', 'Soberanía Criptográfica', 'Vigilancia del Leviatán', 'Tecnología Descentralizada', 'Geopolítica y Macro-Leviatán'];

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
      const prompt = `Investiga sobre: "${bridgePrompt}". Escribe un reporte periodístico internacional, pero con ÉNFASIS ESPECIAL EN PERÚ, con una óptica materialista, científica y analítica. Basa tu análisis en los conceptos de "La Física del Poder", "El Sustrato Primordial" y "La Voluntad Soberana" (extracción de trabajo cognitivo, el Lattice, homeostasis del poder). 
      Haz predicciones reveladoras sobre agendas ocultas (Macro-Leviatán). Cita medios verificados si es posible.
      Evita la ficción novelesca. Devuelve un bloque JSON válido con el siguiente formato estricto (no añadas explicaciones ni bloques de código fuera del JSON):
      {
        "category": "Una de estas: 'Control Biométrico', 'Resistencia Digital', 'Soberanía Criptográfica', 'Vigilancia del Leviatán', 'Tecnología Descentralizada', 'Geopolítica y Macro-Leviatán'",
        "title": "Título del reporte",
        "excerpt": "Resumen breve enfocado en geopolítica/Perú",
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
                    <img src={featuredNews.image} alt={featuredNews.title} className="news-image" />
                    <div className="news-overlay"></div>
                    <span className="badge-futuristic news-category-badge">{featuredNews.category}</span>
                  </div>
                  <div className="news-content">
                    <div className="news-meta">
                      <Clock size={14} />
                      <span>{featuredNews.date}</span>
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
                      <img src={item.image} alt={item.title} className="news-image" />
                      <div className="news-overlay"></div>
                      <span className="badge-futuristic news-category-badge">{item.category}</span>
                    </div>
                    <div className="news-content">
                      <div className="news-meta">
                        <Clock size={14} />
                        <span>{item.date}</span>
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
              <img src={selectedArticle.image} alt={selectedArticle.title} className="modal-image" />
              <div className="modal-image-overlay"></div>
              <span className="badge-futuristic modal-category">{selectedArticle.category}</span>
            </div>
            <div className="modal-content">
              <div className="modal-meta">
                <Clock size={14} />
                <span>{selectedArticle.date}</span>
                <span>• Autor: DarckRovert (Gravity AI)</span>
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
