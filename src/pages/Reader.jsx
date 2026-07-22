import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sun, Moon, Book, Download, ZoomIn, ZoomOut, Type, Bookmark } from 'lucide-react';
import booksData from '../data/books.json';
import { useBookmarks } from '../contexts/BookmarkContext';
import SEO from '../components/SEO';
import './Reader.css';

export default function Reader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Custom reader settings states
  const [theme, setTheme] = useState('dark'); // dark | sepia | light
  const [fontSize, setFontSize] = useState(1.05); // in rem
  const [useSerif, setUseSerif] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const bookRef = useRef(null);
  const book = booksData.find(b => b.id === id);

  const [prevBookId, setPrevBookId] = useState(book?.id);

  if (book?.id !== prevBookId) {
    setPrevBookId(book?.id);
    setLoading(true);
  }

  // ESC key listener to return to books library
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        navigate('/books');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  useEffect(() => {
    if (book) {
      fetch(book.htmlUrl)
        .then(res => res.text())
        .then(html => {
          // Extract body content from the HTML document
          const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
          let rawContent = bodyMatch ? bodyMatch[1] : html;
          
          // Clean scripts and hardcoded local styles
          rawContent = rawContent.replace(/<script[\s\S]*?<\/script>/gi, '');
          let parsedContent = rawContent.replace(/style="[^"]*"/gi, '');
          setContent(parsedContent);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading book:', err);
          setContent('<p style="text-align:center;">Error de enlace cuántico al cargar el contenido del tomo.</p>');
          setLoading(false);
        });
    }
  }, [book]);

  // Track scroll progress inside reader container
  useEffect(() => {
    const handleScroll = () => {
      if (!bookRef.current) return;
      const element = bookRef.current;
      const totalHeight = element.scrollHeight - element.clientHeight;
      if (totalHeight <= 0) {
        setScrollProgress(100);
        return;
      }
      const progress = (element.scrollTop / totalHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, Math.round(progress))));
    };

    const container = bookRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loading]);

  if (!book) {
    return (
      <div className="reader-page error-state animate-fade-in">
        <SEO title="Tomo No Registrado" description="Error de base de datos en la biblioteca." />
        <div className="error-panel glass-panel">
          <h2>Tomo No Registrado</h2>
          <p>La base de datos de la Zona Ágora no reconoce esta identificación criptográfica.</p>
          <Link to="/books" className="btn-back"><ArrowLeft size={16} /> Volver a la Biblioteca</Link>
        </div>
      </div>
    );
  }

  const handleZoomIn = () => {
    setFontSize(prev => Math.min(1.5, prev + 0.05));
  };

  const handleZoomOut = () => {
    setFontSize(prev => Math.max(0.85, prev - 0.05));
  };

  return (
    <div className={`reader-page theme-${theme} animate-fade-in`}>
      <SEO 
        title={`Leyendo: ${book.title}`}
        description={book.description}
        article={true}
      />
      {/* Scroll Progress Bar */}
      <div className="tome-progress-container">
        <div className="tome-progress-bar" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Reader Navigation Header */}
      <header className="reader-nav-bar glass-panel">
        <div className="nav-left">
          <Link to="/books" className="btn-nav-back" title="Volver a Biblioteca">
            <ArrowLeft size={18} />
            <span>Biblioteca</span>
          </Link>
          <span className="divider">/</span>
          <span className="nav-tome-title">{book.title}</span>
        </div>

        {/* Reader Configuration Panel */}
        <div className="nav-right font-controls">
          <button 
            className={`btn-nav-control ${isBookmarked(book.id) ? 'active' : ''}`}
            onClick={() => toggleBookmark(book.id)}
            title={isBookmarked(book.id) ? "Quitar de Guardados" : "Guardar en Biblioteca"}
          >
            <Bookmark size={16} fill={isBookmarked(book.id) ? "currentColor" : "none"} />
          </button>
          <div className="vertical-divider"></div>
          <button className="btn-nav-control" onClick={handleZoomOut} title="Reducir fuente">
            <ZoomOut size={16} />
          </button>
          <span className="font-size-indicator">{Math.round(fontSize * 100)}%</span>
          <button className="btn-nav-control" onClick={handleZoomIn} title="Aumentar fuente">
            <ZoomIn size={16} />
          </button>

          <button 
            className={`btn-nav-control ${useSerif ? 'active' : ''}`} 
            onClick={() => setUseSerif(!useSerif)}
            title="Alternar tipografía Serif/Sans"
          >
            <Type size={16} />
          </button>

          <span className="divider">|</span>

          {/* Theme selectors */}
          <div className="theme-selectors">
            <button 
              className={`theme-dot dark ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
              title="Tema Oscuro"
            >
              <Moon size={12} />
            </button>
            <button 
              className={`theme-dot sepia ${theme === 'sepia' ? 'active' : ''}`}
              onClick={() => setTheme('sepia')}
              title="Tema Sepia"
            >
              <Book size={12} />
            </button>
            <button 
              className={`theme-dot light ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
              title="Tema Claro"
            >
              <Sun size={12} />
            </button>
          </div>

          <span className="divider">|</span>

          {/* Direct download */}
          <a href={book.htmlUrl} download={`${book.id}.html`} className="btn-nav-download" title="Descargar tomo HTML">
            <Download size={16} />
            <span>Descargar</span>
          </a>
        </div>
      </header>

      {/* Reader Container */}
      <main 
        ref={bookRef}
        className={`reader-container ${useSerif ? 'font-serif' : 'font-sans'}`}
        style={{ fontSize: `${fontSize}rem` }}
      >
        <div className="reader-inner">
          {loading ? (
            <div className="reader-loading-container">
              <div className="loading-logo-spin"></div>
              <p>Iniciando interfaz neural de lectura...</p>
              <span className="loading-binary">01100111 01110010 01100001 01110110 01101001 01110100 01111001</span>
            </div>
          ) : (
            <article 
              className="reader-content animate-slide-up"
              dangerouslySetInnerHTML={{ __html: content }} 
            />
          )}
        </div>
      </main>

      {/* Footer Progress bar details */}
      <footer className="reader-footer-info">
        <span>Progreso de Lectura: {scrollProgress}%</span>
        <span>•</span>
        <span>Modo de Fuga Activo</span>
      </footer>
    </div>
  );
}
