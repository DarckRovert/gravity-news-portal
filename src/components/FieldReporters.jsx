import { useState, useEffect } from 'react';
import { MapPin, Radio, Clock, Activity, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './FieldReporters.css';

const reporters = [
  {
    id: 'arquimedes',
    name: 'Arquímedes Prensa',
    handle: '@arquimedes_prensa2',
    location: 'CDMX, México (19.4326° N, 99.1332° W)',
    status: 'EN CAMPO',
    url: 'https://www.tiktok.com/@arquimedes_prensa2/live',
    avatar: 'https://ui-avatars.com/api/?name=Arquimedes+Prensa&background=0D1117&color=00FF41&bold=true'
  }
];

const FieldReporters = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [fullScreenReporter, setFullScreenReporter] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleExpand = (reporter) => {
    setFullScreenReporter(reporter);
  };

  const handleCloseFullScreen = () => {
    setFullScreenReporter(null);
  };

  return (
    <section className="field-reporters-container animate-slide-up" style={{ animationDelay: '0.4s' }}>
      <div className="reporters-header">
        <h2 className="glitch-text" data-text="[ ENLACE TERRESTRE: REPORTEROS ]">[ ENLACE TERRESTRE: REPORTEROS ]</h2>
        <div className="status-pulse tactical-pulse">
          <span className="pulse-dot green"></span>
          <span className="pulse-text">COMUNICACIONES ENCRIPTADAS ESTABLES</span>
        </div>
      </div>

      <div className="reporters-grid">
        {reporters.map((reporter) => (
          <div key={reporter.id} className="reporter-card glass-panel">
            <div className="reporter-hud-top">
              <div className="reporter-identity">
                <img src={reporter.avatar} alt={reporter.name} className="reporter-avatar" />
                <div className="reporter-info">
                  <h3>{reporter.name}</h3>
                  <span className="reporter-handle">{reporter.handle}</span>
                </div>
              </div>
              <div className="live-indicator">
                <Radio size={16} className="blink" />
                <span>EN VIVO</span>
              </div>
            </div>

            <div className="reporter-viewport">
              <iframe 
                src="https://www.tiktok.com/embed/@arquimedes_prensa2"
                title="TikTok Live"
                className="tiktok-iframe"
                frameBorder="0"
                allowFullScreen
                allow="encrypted-media"
              ></iframe>
              <div className="viewport-overlay reporter-overlay">
                <div className="hud-data top-left">
                  <Activity size={14} /> SYS.OP.NORMAL
                </div>
                <div className="hud-data bottom-left">
                  <MapPin size={14} /> {reporter.location}
                </div>
                <div className="hud-data bottom-right">
                  <Clock size={14} /> T-LOCAL: {time}
                </div>
                
                <button 
                  className="btn-expand-video"
                  onClick={() => handleExpand(reporter)}
                  title="Ver en Pantalla Completa"
                >
                  <Maximize2 size={20} />
                </button>
              </div>
            </div>

            <div className="reporter-hud-bottom">
              <div className="data-bar">
                <span>LATENCIA: 24ms</span>
                <span>UPLINK: SECURE</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Screen Reporter Modal */}
      <AnimatePresence>
        {fullScreenReporter && (
          <motion.div 
            className="fullscreen-video-modal"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          >
            <button className="btn-close-fullscreen" onClick={handleCloseFullScreen}>
              <X size={24} /> <span>CERRAR PANTALLA COMPLETA</span>
            </button>
            <div className="fullscreen-video-container">
              <div className="feed-title-bar fullscreen-title-bar">
                <span className="feed-title">{fullScreenReporter.name} ({fullScreenReporter.handle})</span>
                <span className="feed-badge">EN CAMPO</span>
              </div>
              <iframe 
                src="https://www.tiktok.com/embed/@arquimedes_prensa2"
                title="TikTok Live Fullscreen" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FieldReporters;
