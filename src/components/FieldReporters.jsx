import { useState, useEffect } from 'react';
import { MapPin, Radio, Clock, Activity, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import YoutubeChannel from './YoutubeChannel';
import './FieldReporters.css';

import agentRegistry from '../data/agents_registry.json';
import newsData from '../data/news.json';

const FieldReporters = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [fullScreenReporter, setFullScreenReporter] = useState(null);
  const [reporters] = useState(() => {
    const latestRegion = newsData[0]?.region || 'Global';
    let matched = agentRegistry.filter(a => 
      latestRegion.toLowerCase().includes(a.region.toLowerCase()) && a.region !== 'Global'
    );
    if (matched.length === 0) {
       matched = agentRegistry.filter(a => a.region === 'Global');
    }
    if (matched.length === 0) {
        matched = [agentRegistry[0]];
    }
    return matched.slice(0, 1);
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && fullScreenReporter) {
        setFullScreenReporter(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fullScreenReporter]);

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
                src={reporter.iframe_src}
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
                src={fullScreenReporter.iframe_src}
                title="TikTok Live Fullscreen"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* YouTube Channel Recommendation */}
      <YoutubeChannel />
    </section>
  );
};

export default FieldReporters;
