import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';
import FieldReporters from './FieldReporters';
import './LiveFeeds.css';

const LiveFeeds = () => {
  // Canales sugeridos: NASA (Espacio), Al Jazeera (Geopolítica global), DW (Europa), Sky News (UK/Global)
  // Nota: Los IDs de los videos en vivo pueden cambiar si la transmisión se corta. 
  // La forma más estable es usar las URLs de canal en vivo, pero el embed de YouTube para canales en vivo 
  // es: https://www.youtube.com/embed/live_stream?channel=CHANNEL_ID
  
  const feeds = [
    { id: 'nasa', title: 'NASA ISS LIVE FEED (MONITOREO ORBITAL)', videoId: 'XkM_04Ch76E' },
    { id: 'aljazeera', title: 'AL JAZEERA (SEÑAL GEOPOLÍTICA - SUR GLOBAL)', channelId: 'UCNye-wNBqNL5ZzHSJj3l8Bg' },
    { id: 'dw', title: 'DW NEWS (EJE EUROASIÁTICO)', videoId: '2E8QS55GwpY' },
    { id: 'skynews', title: 'SKY NEWS (MONITOR GLOBAL)', videoId: 'YDvsBbKfLPA' }
  ];

  const [fullScreenVideo, setFullScreenVideo] = useState(null);

  const handleExpand = (feed) => {
    setFullScreenVideo(feed);
  };

  const handleCloseFullScreen = () => {
    setFullScreenVideo(null);
  };

  return (
    <section className="live-feeds-container">
      <div className="live-feeds-header">
        <h2 className="glitch-text" data-text="[ MONITOREO GLOBAL ACTIVO ]">[ MONITOREO GLOBAL ACTIVO ]</h2>
        <div className="status-pulse">
          <span className="pulse-dot"></span>
          <span className="pulse-text">INTERCEPTANDO REDES SATELITALES</span>
        </div>
      </div>
      
      <div className="live-feeds-grid">
        {feeds.map((feed) => (
          <div key={feed.id} className="feed-card">
            <div className="feed-title-bar">
              <span className="feed-title">{feed.title}</span>
              <span className="feed-badge">LIVE</span>
            </div>
            <div className="feed-video-wrapper">
              <iframe 
                src={feed.videoId 
                  ? `https://www.youtube.com/embed/${feed.videoId}?autoplay=1&mute=1&controls=1&modestbranding=1`
                  : `https://www.youtube.com/embed/live_stream?channel=${feed.channelId}&autoplay=1&mute=1&controls=1&modestbranding=1`
                } 
                title={feed.title} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
            <div className="feed-overlay">
              <button 
                className="btn-expand-video"
                onClick={() => handleExpand(feed)}
                title="Ver en Pantalla Completa"
              >
                <Maximize2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Full Screen Video Modal */}
      <AnimatePresence>
        {fullScreenVideo && (
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
                <span className="feed-title">{fullScreenVideo.title}</span>
                <span className="feed-badge">LIVE</span>
              </div>
              <iframe 
                src={fullScreenVideo.videoId 
                  ? `https://www.youtube.com/embed/${fullScreenVideo.videoId}?autoplay=1&mute=0&controls=1&modestbranding=1`
                  : `https://www.youtube.com/embed/live_stream?channel=${fullScreenVideo.channelId}&autoplay=1&mute=0&controls=1&modestbranding=1`
                } 
                title={fullScreenVideo.title} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Field Reporters Section */}
      <FieldReporters />
    </section>
  );
};

export default LiveFeeds;
