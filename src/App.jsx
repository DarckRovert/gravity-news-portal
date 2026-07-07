import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import { Newspaper, Library, Menu, X, PenTool, Microscope, ChevronUp, Terminal, Search, Palette, Globe } from 'lucide-react';
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useTheme } from './contexts/ThemeContext';
import { useSearch } from './contexts/SearchContext';
import CustomCursor from './components/CustomCursor';
import NewsTicker from './components/NewsTicker';
import { motion, AnimatePresence, useScroll, useSpring, useMotionValueEvent } from 'framer-motion';
import './App.css';

const Home = lazy(() => import('./pages/Home'));
const Books = lazy(() => import('./pages/Books'));
const Reader = lazy(() => import('./pages/Reader'));
const Essays = lazy(() => import('./pages/Essays'));
const Science = lazy(() => import('./pages/Science'));
const Geopolitics = lazy(() => import('./pages/Geopolitics'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PageLoader = () => (
  <div role="status" aria-live="polite" aria-label="Cargando contenido" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '20px' }}>
    <div className="loading-logo-spin"></div>
    <p style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>DECRYPTING_ZONE...</p>
  </div>
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Anomalía estructural detectada en el sector de rutas:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--accent-primary)', marginBottom: '10px' }}>Anomalía en la Conexión</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>El enlace de datos se ha interrumpido. No se pudo cargar este sector.</p>
          <button onClick={() => window.location.reload()} className="glass-panel" style={{ padding: '10px 20px', cursor: 'pointer', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--accent-primary)' }}>
            Reestablecer Conexión
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const NAV_LINKS = [
  { path: '/', label: 'Noticias', icon: <Newspaper size={18} /> },
  { path: '/geopolitica', label: 'Geopolítica', icon: <Globe size={18} /> },
  { path: '/ensayos', label: 'Ensayos', icon: <PenTool size={18} /> },
  { path: '/ciencia', label: 'Ciencia', icon: <Microscope size={18} /> },
  { path: '/books', label: 'Biblioteca', icon: <Library size={18} /> },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, changeTheme } = useTheme();
  const { searchTerm, setSearchTerm } = useSearch();
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [prevSearchTerm, setPrevSearchTerm] = useState(searchTerm);

  // Sincronizar si searchTerm cambia desde otro componente (Render phase update)
  if (searchTerm !== prevSearchTerm) {
    setPrevSearchTerm(searchTerm);
    setLocalSearch(searchTerm);
  }

  // Debounce para proteger el hilo principal de render storms
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(localSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch, setSearchTerm]);

  // Scroll Lock & Resize auto-close for Mobile Menu
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleResize = () => {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  return (
    <nav className="glass-panel navbar animate-slide-up" style={{ animationDelay: '0.1s' }} aria-label="Navegación principal">
      <Link to="/" className="nav-brand" style={{ textDecoration: 'none' }}>
        <span className="brand-accent">Gravity</span>Portal
      </Link>
      
      {/* Desktop Menu */}
      <div className="nav-links">
        {NAV_LINKS.map((link) => (
          <NavLink 
            key={link.path} 
            to={link.path} 
            end={link.path === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Center Search Bar */}
      <div className="nav-search-desktop">
        <div className="search-bar-wrapper">
          <Search size={16} className="search-icon" />
          <input 
            type="search" 
            placeholder="Buscar en el Nexus..." 
            className="global-search-input"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            aria-label="Buscar noticias o eventos"
          />
        </div>
      </div>

      {/* Global Actions (Desktop) */}
      <div className="nav-global-actions">
        
        <div className="theme-selector">
          <Palette size={16} className="theme-icon" />
          <select 
            className="theme-dropdown" 
            value={theme} 
            onChange={(e) => changeTheme(e.target.value)}
            aria-label="Seleccionar tema visual"
          >
            <option value="onyx">Deep Onyx</option>
            <option value="matrix">Matrix</option>
            <option value="void">Void</option>
          </select>
        </div>
      </div>

      {/* Mobile Toggle */}
      <button 
        className="mobile-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            key="mobile-menu"
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {NAV_LINKS.map((link) => (
              <NavLink 
                key={link.path} 
                to={link.path} 
                end={link.path === '/'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
            
            {/* Mobile Actions */}
            <div className="mobile-actions-wrapper">
              <div className="search-bar-wrapper mobile-search">
                <Search size={16} className="search-icon" />
                <input 
                  type="search" 
                  placeholder="Buscar..." 
                  className="global-search-input"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  aria-label="Buscar noticias o eventos en móvil"
                />
              </div>
              
              <div className="theme-selector mobile-theme">
                <Palette size={16} className="theme-icon" />
                <select 
                  className="theme-dropdown" 
                  value={theme} 
                  onChange={(e) => changeTheme(e.target.value)}
                  aria-label="Seleccionar tema visual para móvil"
                >
                  <option value="onyx">Onyx</option>
                  <option value="matrix">Matrix</option>
                  <option value="void">Void</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

const LiveClock = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return <>{time} LCT</>;
};

const ScrollTracker = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div 
      className="scroll-progress-bar" 
      style={{ scaleX, transformOrigin: '0%' }}
      role="progressbar"
      aria-hidden="true"
    />
  );
};

const ScrollToTopFAB = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowScrollTop(latest > 400);
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainContent = document.getElementById('main');
    if (mainContent) {
      mainContent.focus({ preventScroll: true });
    } else if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <AnimatePresence>
      {showScrollTop && (
        <motion.button 
          key="scroll-top-btn"
          className="scroll-to-top-btn glass-panel"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Volver arriba"
        >
          <ChevronUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

function App() {
  const location = useLocation();

  return (
    <div className="app-container">
      <a href="#main" className="skip-to-content" style={{ position: 'absolute', top: '-40px', left: '0', background: 'var(--bg-card)', color: 'var(--text-primary)', padding: '8px 16px', zIndex: '9999', transition: 'top 0.3s' }} onFocus={(e) => e.target.style.top = '0'} onBlur={(e) => e.target.style.top = '-40px'}>
        Saltar al contenido principal
      </a>
      
      <CustomCursor />
      
      <ScrollTracker />

      {/* Background Aurora Engine */}
      <div className="god-tier-aurora">
        <div className="aurora-orb aurora-1"></div>
        <div className="aurora-orb aurora-2"></div>
        <div className="aurora-orb aurora-3"></div>
      </div>
      
      <Navbar />
      <NewsTicker />
      
      <main className="main-content" id="main" tabIndex={-1} style={{ outline: 'none' }}>
        <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
          <ErrorBoundary key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<Suspense fallback={<PageLoader />}><Home /></Suspense>} />
              <Route path="/ensayos" element={<Suspense fallback={<PageLoader />}><Essays /></Suspense>} />
              <Route path="/ciencia" element={<Suspense fallback={<PageLoader />}><Science /></Suspense>} />
              <Route path="/geopolitica" element={<Suspense fallback={<PageLoader />}><Geopolitics /></Suspense>} />
              <Route path="/books" element={<Suspense fallback={<PageLoader />}><Books /></Suspense>} />
              <Route path="/book/:id" element={<Suspense fallback={<PageLoader />}><Reader /></Suspense>} />
              <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFound /></Suspense>} />
            </Routes>
          </ErrorBoundary>
        </AnimatePresence>
      </main>
      
      {/* Enhanced Dynamic Footer */}
      <footer className="footer glass-panel">
        <div className="footer-content">
          <div className="footer-status">
            <span className="status-dot"></span>
            <span>SYSTEMS ONLINE</span>
          </div>
          <div className="footer-brand">
            <Terminal size={14} className="footer-icon" />
            <p>© 2026 Gravity Portal. Redefiniendo los límites.</p>
          </div>
          <div className="footer-time" aria-hidden="true">
            <LiveClock />
          </div>
        </div>
      </footer>

      <ScrollToTopFAB />
    </div>
  );
}

export default App;
