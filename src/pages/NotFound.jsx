import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import './NotFound.css';

function NotFound() {
  return (
    <motion.div 
      className="not-found-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <SEO 
        title="Error 404 - No Encontrado"
        description="Esta zona del Nexo está vacía o corrompida."
      />
      <div className="not-found-content">
        <Terminal size={64} className="error-icon" />
        <h1 className="glitch-text" data-text="ERROR 404">ERROR 404</h1>
        <p className="error-subtitle">LA TRANSMISIÓN SE HA PERDIDO EN EL SUSTRATO</p>
        
        <div className="error-terminal-box glass-panel">
          <p><span className="terminal-prompt">$</span> ping protocol.agora</p>
          <p className="terminal-response">request timeout...</p>
          <p><span className="terminal-prompt">$</span> route list</p>
          <p className="terminal-response">target node unlisted.</p>
          <p><span className="terminal-prompt">$</span> status</p>
          <p className="terminal-response" style={{ color: 'var(--accent-secondary)' }}>leviatan countermeasures detected. aborting.</p>
        </div>

        <Link to="/" className="btn-glow-read" style={{ marginTop: '2rem', display: 'inline-block' }}>
          Restablecer Conexión a la Red Central
        </Link>
      </div>
    </motion.div>
  );
}

export default NotFound;
