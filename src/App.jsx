import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Newspaper, Library, Menu, X, PenTool, Microscope, ChevronUp, Terminal, Search, Palette, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from './contexts/ThemeContext';
import { useSearch } from './contexts/SearchContext';
import Home from './pages/Home';
import Books from './pages/Books';
import Reader from './pages/Reader';
import Essays from './pages/Essays';
import Science from './pages/Science';
import Geopolitics from './pages/Geopolitics';
import NotFound from './pages/NotFound';
import CustomCursor from './components/CustomCursor';
import NewsTicker from './components/NewsTicker';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, changeTheme } = useTheme();
  const { searchTerm, setSearchTerm } = useSearch();

  const navLinks = [
    { path: '/', label: 'Noticias', icon: <Newspaper size={18} /> },
    { path: '/geopolitica', label: 'Geopolítica', icon: <Globe size={18} /> },
    { path: '/ensayos', label: 'Ensayos', icon: <PenTool size={18} /> },
    { path: '/ciencia', label: 'Ciencia', icon: <Microscope size={18} /> },
    { path: '/books', label: 'Biblioteca', icon: <Library size={18} /> },
  ];

  return (
    <nav className="glass-panel navbar animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="nav-brand">
        <span className="brand-accent">Gravity</span>Portal
      </div>
      
      {/* Desktop Menu */}
      <div className="nav-links">
        {navLinks.map((link) => (
          <Link 
            key={link.path} 
            to={link.path} 
            className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </div>

      {/* Center Search Bar */}
      <div className="nav-search-desktop">
        <div className="search-bar-wrapper">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar en el Nexus..." 
            className="global-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          >
            <option value="onyx">Deep Onyx</option>
            <option value="matrix">Matrix</option>
            <option value="void">Void</option>
          </select>
        </div>
      </div>

      {/* Mobile Toggle */}
      <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsOpen(false)}
                className={`mobile-nav-item ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            
            {/* Mobile Actions */}
            <div className="mobile-actions-wrapper">
              <div className="search-bar-wrapper mobile-search">
                <Search size={16} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  className="global-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="theme-selector mobile-theme">
                <Palette size={16} className="theme-icon" />
                <select 
                  className="theme-dropdown" 
                  value={theme} 
                  onChange={(e) => changeTheme(e.target.value)}
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

function App() {
  const location = useLocation();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  // Update dynamic Title
  useEffect(() => {
    const titles = {
      '/': 'Gravity Portal | Transmisiones Crudas',
      '/ensayos': 'Gravity Portal | Ensayos',
      '/ciencia': 'Gravity Portal | Ciencia',
      '/books': 'Gravity Portal | Biblioteca'
    };
    
    // Si estamos en un artículo del Reader
    if (location.pathname.startsWith('/book/')) {
      document.title = 'Gravity Portal | Leyendo...';
    } else {
      document.title = titles[location.pathname] || 'Gravity Portal | 404';
    }
  }, [location]);

  // Scroll logic for Progress Bar & ScrollToTop
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = windowHeight > 0 ? totalScroll / windowHeight : 0;
      
      setScrollProgress(scroll * 100);
      setShowScrollTop(totalScroll > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <CustomCursor />
      
      {/* Scroll Progress Bar */}
      <div 
        className="scroll-progress-bar" 
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* Background Aurora Engine */}
      <div className="god-tier-aurora">
        <div className="aurora-orb aurora-1"></div>
        <div className="aurora-orb aurora-2"></div>
        <div className="aurora-orb aurora-3"></div>
      </div>
      
      <Navbar />
      <NewsTicker />
      
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/ensayos" element={<Essays />} />
            <Route path="/ciencia" element={<Science />} />
            <Route path="/geopolitica" element={<Geopolitics />} />
            <Route path="/books" element={<Books />} />
            <Route path="/book/:id" element={<Reader />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
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
          <div className="footer-time">
            {time} LCT
          </div>
        </div>
      </footer>

      {/* Scroll to Top FAB */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button 
            className="scroll-to-top-btn glass-panel"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
