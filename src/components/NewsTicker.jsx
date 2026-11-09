import { useState, useEffect, useCallback } from 'react';
import newsData from '../data/news.json';
import './NewsTicker.css';

const NewsTicker = () => {
  const getHeadlines = useCallback(() => {
    let custom = [];
    try {
      custom = JSON.parse(localStorage.getItem('gravity-custom-news') || '[]');
    } catch {
      // fallback
    }

    const combined = Array.isArray(custom) && custom.length > 0
      ? [...custom, ...newsData]
      : newsData;

    const dynamicHeadlines = combined
      .map(item => item.title?.toUpperCase())
      .filter(Boolean)
      .slice(0, 10);

    if (dynamicHeadlines.length > 0) {
      return dynamicHeadlines;
    }

    return [
      "INTERCEPTANDO NODO PRINCIPAL...",
      "CONEXIÓN ENCRIPTADA ESTABLECIDA",
      "VIGILANCIA DEL LEVIATÁN ACTIVA",
      "TELEMETRÍA COGNITIVA SINCRONIZADA"
    ];
  }, []);

  const [headlines, setHeadlines] = useState(getHeadlines);

  useEffect(() => {
    const handleUpdate = () => {
      setHeadlines(getHeadlines());
    };
    window.addEventListener('gravity-news-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('gravity-news-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [getHeadlines]);

  return (
    <div className="ticker-container" aria-label="Titulares en vivo" aria-live="off" role="marquee">
      <div className="ticker-label" aria-hidden="true">LIVE FEED</div>
      <div className="ticker-scroll">
        <div className="ticker-content">
          {headlines.map((text, i) => (
            <span key={i} className="ticker-item">
              <span className="ticker-dot"></span> {text}
            </span>
          ))}
          {/* Duplicado para efecto infinito perfecto */}
          {headlines.map((text, i) => (
            <span key={`dup-${i}`} className="ticker-item">
              <span className="ticker-dot"></span> {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
