import { ExternalLink, Video, Users, PlayCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
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
            {channel.latestVideos.map((video, i) => (
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
                  <PlayCircle size={28} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default YoutubeChannel;

