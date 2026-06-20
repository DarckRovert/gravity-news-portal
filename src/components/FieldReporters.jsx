import React, { useState, useEffect } from 'react';
import { MapPin, Radio, Clock, ExternalLink, Activity } from 'lucide-react';
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
              {/* Fake video feed with glitch effect */}
              <div className="viewport-overlay">
                <div className="scanline"></div>
                <div className="hud-data top-left">
                  <Activity size={14} /> SYS.OP.NORMAL
                </div>
                <div className="hud-data bottom-left">
                  <MapPin size={14} /> {reporter.location}
                </div>
                <div className="hud-data bottom-right">
                  <Clock size={14} /> T-LOCAL: {time}
                </div>
                
                <a href={reporter.url} target="_blank" rel="noopener noreferrer" className="connect-btn">
                  <ExternalLink size={18} />
                  <span>INTERCEPTAR SEÑAL (TIKTOK LIVE)</span>
                </a>
              </div>
              <div className="viewport-background noise-bg"></div>
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
    </section>
  );
};

export default FieldReporters;
