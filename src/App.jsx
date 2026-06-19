import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Newspaper, Library, Menu, X, PenTool, Microscope } from 'lucide-react';
import { useState } from 'react';
import Home from './pages/Home';
import Books from './pages/Books';
import Reader from './pages/Reader';
import Essays from './pages/Essays';
import Science from './pages/Science';
import CustomCursor from './components/CustomCursor';
import NewsTicker from './components/NewsTicker';
import './App.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Noticias', icon: <Newspaper size={18} /> },
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

      {/* Mobile Toggle */}
      <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu animate-fade-in">
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
        </div>
      )}
    </nav>
  );
}

function App() {
  return (
    <div className="app-container">
      <CustomCursor />
      {/* Background Aurora Engine */}
      <div className="god-tier-aurora">
        <div className="aurora-orb aurora-1"></div>
        <div className="aurora-orb aurora-2"></div>
        <div className="aurora-orb aurora-3"></div>
      </div>
      <Navbar />
      <NewsTicker />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ensayos" element={<Essays />} />
          <Route path="/ciencia" element={<Science />} />
          <Route path="/books" element={<Books />} />
          <Route path="/book/:id" element={<Reader />} />
        </Routes>
      </main>
      
      <footer className="footer glass-panel">
        <p>© 2026 Gravity Portal. Redefiniendo los límites.</p>
      </footer>
    </div>
  );
}

export default App;
