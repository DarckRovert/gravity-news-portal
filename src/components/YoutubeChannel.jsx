import { useState, useEffect } from 'react';
import { ExternalLink, Video, Users, PlayCircle, TrendingUp, X, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './YoutubeChannel.css';

const channel = {
  name: 'Los Liberales 🗽por Nicolás Morás',
  host: 'Nicolás Morás',
  handle: '@losliberales',
  url: 'https://www.youtube.com/@losliberales',
  subscribers: '768K',
  badge: 'CANAL RECOMENDADO',
  avatar: 'https://yt3.googleusercontent.com/5zvoX78Qjo4dWhGH9c1sQ-LlBKNXD6QtsIXwgeSj9or5cCjJeIhQkyR78511DtkxndweFOYTi84=s160-c-k-c0x00ffffff-no-rj',
  description: 'Uno de los principales medios periodísticos independientes en español. Análisis a fondo de la política y economía global sin rendir cuentas a ningún partido, gobierno o corporación. Financiado únicamente por la audiencia.',
  tags: ['Política', 'Economía', 'Geopolítica', 'Historia', 'Libertad'],
  latestVideos: [
    { id: 'FxwX6C_oqQI', title: 'Lo que NADIE DIJO del SINIESTRO CLUB de la VIDA ETERNA, OVNIS, PUTIN y TRUMP' },
    { id: 'tJoYpoaOIBI', title: 'ABELARDO GANÓ en COLOMBIA y HUBO FRAUDE en PERÚ — EXPERTO' },
    { id: '61UVMUi976I', title: 'PLAN de SHEINBAUM para TAPAR la CRISIS con MUNDIAL de FÚTBOL' },
  ]
};

const YoutubeChannel = () => {
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [videos, setVideos] = useState(channel.latestVideos);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const rssUrl = 'https://www.youtube.com/feeds/videos.xml?channel_id=UC8WwqW8uW2X6ys3PWMiDSzg';
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
        const data = await res.json();
        
        if (data.status === 'ok' && data.items && data.items.length > 0) {
          // Extraemos los IDs de los videos (ya sean regulares o shorts)
          const parsedVideos = data.items.map(item => {
            let vidId = null;
            if (item.link.includes('/watch?v=')) vidId = item.link.split('v=')[1]?.split('&')[0];
            else if (item.link.includes('/shorts/')) vidId = item.link.split('/shorts/')[1]?.split('?')[0];
            
            // Decodificamos entidades HTML en el título
            const decodedTitle = item.title.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&gt;/g, '>').replace(/&lt;/g, '<');

            return {
              id: vidId || (item.guid && item.guid.split(':')[2]),
              title: decodedTitle
            };
          }).filter(v => v.id).slice(0, 3);
          
          if (parsedVideos.length > 0) {
            setVideos(parsedVideos);
          }
        }
      } catch (err) {
        console.error("Failed to fetch latest YT videos", err);
      }
    };
    
    fetchLatest();
  }, []);

  return (
    <section className="yt-channel-section animate-slide-up" style={{ animationDelay: '0.5s' }}>
      <div className="yt-section-header">
        <h2 className="glitch-text" data-text="[ CANAL ALIADO: TRANSMISIÓN RECOMENDADA ]">
          [ CANAL ALIADO: TRANSMISIÓN RECOMENDADA ]
        </h2>
        <div className="yt-section-badge">
          <Video size={14} />
          <span>YOUTUBE</span>
        </div>
      </div>

      <motion.div
        className="yt-channel-card glass-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="yt-identity-col">
          <div className="yt-avatar-wrapper">
            <img
              src={channel.avatar}
              alt={channel.name}
              className="yt-avatar"
              onError={e => {
                e.target.src = 'https://ui-avatars.com/api/?name=Los+Liberales&background=FF0000&color=fff&bold=true';
              }}
            />
            <div className="yt-avatar-ring" />
            <div className="yt-yt-badge">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-2.75 12.77 12.77 0 0 0-7.94 0A4.83 4.83 0 0 1 4.41 6.69C3.4 8.76 3 10.83 3 12s.4 3.24 1.41 5.31a4.83 4.83 0 0 1 3.77 2.75 12.77 12.77 0 0 0 7.94 0 4.83 4.83 0 0 1 3.77-2.75C20.6 15.24 21 13.17 21 12s-.4-3.24-1.41-5.31zM10 15V9l5 3-5 3z"/></svg>
            </div>
          </div>

          <div className="yt-identity-info">
            <h3 className="yt-channel-name">{channel.name}</h3>
            <p className="yt-host">por <strong>{channel.host}</strong></p>
            <p className="yt-handle">{channel.handle}</p>
          </div>

          <div className="yt-stats-row">
            <div className="yt-stat">
              <Users size={14} />
              <span>{channel.subscribers}</span>
              <small>suscriptores</small>
            </div>
            <div className="yt-stat">
              <TrendingUp size={14} />
              <span>Diario</span>
              <small>publicaciones</small>
            </div>
          </div>

          <div className="yt-tags">
            {channel.tags.map(tag => (
              <span key={tag} className="yt-tag">{tag}</span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
            <a
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="yt-subscribe-btn"
            >
              <Video size={16} />
              <span>VISITAR CANAL</span>
              <ExternalLink size={13} className="yt-ext-icon" />
            </a>
            
            <button 
              className="yt-live-btn"
              onClick={() => setIsLiveOpen(true)}
            >
              <Radio size={16} className="blink" />
              <span>VER EN VIVO</span>
            </button>
          </div>
        </div>

        <div className="yt-content-col">
          <div className="yt-recommended-badge">
            <PlayCircle size={14} />
            <span>{channel.badge}</span>
          </div>

          <p className="yt-description">{channel.description}</p>

          <div className="yt-preview-label">
            <span>// CONTENIDO RECIENTE</span>
          </div>

          <div className="yt-preview-grid">
            {videos.map((video, i) => (
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="yt-preview-thumb"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <img
                  src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                  alt={video.title}
                  onError={e => {
                    e.target.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                  }}
                />
                <div className="yt-thumb-overlay">
                  <PlayCircle size={32} className="yt-play-icon" />
                </div>
                <div className="yt-thumb-title-bar">
                  <span className="yt-thumb-title">{video.title}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Full Screen Live Video Modal */}
      <AnimatePresence>
        {isLiveOpen && (
          <motion.div 
            className="fullscreen-video-modal"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          >
            <button className="btn-close-fullscreen" onClick={() => setIsLiveOpen(false)}>
              <X size={24} /> <span>CERRAR TRANSMISIÓN</span>
            </button>
            <div className="fullscreen-video-container">
              <div className="feed-title-bar fullscreen-title-bar">
                <span className="feed-title">{channel.name} - TRANSMISIÓN EN VIVO</span>
                <span className="feed-badge" style={{ backgroundColor: '#ff0000', color: 'white' }}>EN VIVO</span>
              </div>
              <iframe 
                src="https://www.youtube.com/embed/live_stream?channel=UC8WwqW8uW2X6ys3PWMiDSzg&autoplay=1&mute=0&controls=1&modestbranding=1" 
                title={`${channel.name} Live Stream`}
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

export default YoutubeChannel;

