import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cpu, Wifi, WifiOff, BookOpen, PenTool, Microscope, ArrowRight, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import booksData from '../data/books.json';
import essaysData from '../data/essays.json';
import scienceData from '../data/science.json';
import { playSound } from '../utils/audio';

export default function Sidebar({
  bridgeStatus,
  bridgeUrl,
  setBridgeUrl,
  bridgePrompt,
  setBridgePrompt,
  isGenerating,
  handleRequestBridgeNews
}) {
  const navigate = useNavigate();
  const [vigiaStatus, setVigiaStatus] = useState(null);

  useEffect(() => {
    if (bridgeStatus === 'online' && bridgeUrl) {
      const fetchVigia = async () => {
        try {
          const res = await fetch(`${bridgeUrl}/v1/autonomy/status`);
          if (res.ok) {
            const data = await res.json();
            if (data.autonomy_engine && data.autonomy_engine.vigia) {
              setVigiaStatus(data.autonomy_engine.vigia);
            }
          }
        } catch {
          // Silent fail
        }
      };
      fetchVigia();
      const interval = setInterval(fetchVigia, 5000);
      return () => clearInterval(interval);
    }
  }, [bridgeStatus, bridgeUrl]);

  return (
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

      {/* Vigia Dashboard Panel */}
      <AnimatePresence>
        {bridgeStatus === 'online' && vigiaStatus && (
          <motion.div 
            className="sidebar-card glass-panel vigia-panel"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="panel-header">
              <ShieldAlert size={20} className={`panel-icon ${vigiaStatus.overall_status === 'CRITICAL' ? 'text-warn' : ''}`} />
              <h3>Vigía Homeostasis</h3>
              <div className={`status-indicator ${vigiaStatus.overall_status === 'CRITICAL' ? 'offline' : 'online'}`}>
                <span>{vigiaStatus.overall_status || 'NORMAL'}</span>
              </div>
            </div>
            
            <div className="vigia-stats animate-fade-in">
              <div className="stat-row">
                <span className="stat-label">Entropía del Periodista:</span>
                <span className="stat-value">{vigiaStatus.journalist_entropy?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Errores Consecutivos:</span>
                <span className="stat-value">{vigiaStatus.consecutive_errors || 0}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Última Anomalía:</span>
                <span className="stat-value truncate" title={vigiaStatus.last_anomaly || 'Ninguna'}>
                  {vigiaStatus.last_anomaly || 'Ninguna'}
                </span>
              </div>
              
              {/* Progress bar for entropy */}
              <div className="entropy-bar-container">
                <div 
                  className={`entropy-bar-fill ${vigiaStatus.journalist_entropy > 0.8 ? 'bg-warn' : 'bg-safe'}`} 
                  style={{ width: `${Math.min(100, (vigiaStatus.journalist_entropy || 0) * 100)}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <img src={book.cover} alt={book.title} onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'; }}/>
              </div>
              <div className="mini-details">
                <h4>{book.title}</h4>
                <span>{book.category}</span>
                <Link to={`/book/${book.id}`} className="mini-read-link">
                  Leer Tomo <ArrowRight size={12} />
                </Link>
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
            <div key={essay.id} className="sidebar-book-item hover-lift" onClick={() => navigate('/ensayos')}>
              <div className="mini-cover">
                <img src={essay.image} alt={essay.title} onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'; }}/>
              </div>
              <div className="mini-details">
                <h4 style={{ fontSize: '0.85rem' }}>{essay.title}</h4>
                <span style={{ color: 'var(--accent-primary)' }}>{essay.category}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <Link to="/ensayos" className="btn-glow-read" style={{ textDecoration: 'none' }}>Ver Todos</Link>
        </div>
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
            <div key={article.id} className="sidebar-book-item hover-lift" onClick={() => navigate('/ciencia')}>
              <div className="mini-cover">
                <img src={article.image} alt={article.title} onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'; }}/>
              </div>
              <div className="mini-details">
                <h4 style={{ fontSize: '0.85rem' }}>{article.title}</h4>
                <span style={{ color: '#60a5fa' }}>{article.category}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <Link to="/ciencia" className="btn-glow-read" style={{ textDecoration: 'none', borderColor: '#60a5fa', color: '#60a5fa' }}>Ver Todos</Link>
        </div>
      </motion.div>
    </aside>
  );
}
