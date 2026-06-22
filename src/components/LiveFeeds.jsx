import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, Radio, Film, FolderLock, Play } from 'lucide-react';
import FieldReporters from './FieldReporters';
import './LiveFeeds.css';

const mediaCategories = [
  { id: 'live', label: 'Monitoreo Global', icon: Radio, pulse: true },
  { id: 'cinema', label: 'Cine de Resistencia', icon: Film, pulse: false },
  { id: 'docs', label: 'Archivos Desclasificados', icon: FolderLock, pulse: false }
];

const mediaData = {
  live: [
    { id: 'nasa', title: 'NASA ISS LIVE (ORBITAL)', videoId: 'XkM_04Ch76E', badge: 'LIVE' },
    { id: 'aljazeera', title: 'AL JAZEERA (SUR GLOBAL)', channelId: 'UCNye-wNBqNL5ZzHSJj3l8Bg', badge: 'LIVE' },
    { id: 'dw', title: 'DW NEWS (EUROASIA)', videoId: '2E8QS55GwpY', badge: 'LIVE' },
    { id: 'skynews', title: 'SKY NEWS (MONITOR GLOBAL)', videoId: 'YDvsBbKfLPA', badge: 'LIVE' }
  ],
  cinema: [
    { id: 'atenas', title: 'DESCALZO EN ATENAS (1966)', videoId: 'j_R9kCqxYxY', badge: 'FILOSOFÍA' },
    { id: 'banquete', title: 'EL BANQUETE DE PLATÓN (1989)', videoId: '3p9DLD_rbm0', badge: 'FILOSOFÍA' },
    { id: 'inshadow', title: 'IN SHADOW: A Modern Odyssey', videoId: 'j800SVeiS5I', badge: 'ANIMACIÓN' },
    { id: 'kungfury', title: 'KUNG FURY (Cyber-Retro 80s)', videoId: 'bS5P_LAqiVg', badge: 'CULT CLASH' },
    { id: 'hyper', title: 'HYPER-REALITY (Saturación AR)', videoId: 'YJg02ivYzSs', badge: 'VISION' },
    { id: 'wanderers', title: 'WANDERERS (El Futuro Humano)', videoId: 'YH3c1QZzRK4', badge: 'SCI-FI' },
    { id: 'metropolis', title: 'METROPOLIS (1927 - Distopía Clásica)', videoId: 'gdtZv3XROnc', badge: 'CINE CLÁSICO' },
    { id: 'lajetee', title: 'LA JETÉE (1962 - Viajes en el Tiempo)', videoId: 'aOjaEOgMv4M', badge: 'CULT CLASH' },
    { id: 'luna', title: 'EL VIAJE A LA LUNA (1902 - George Méliès)', videoId: 'ZNAHcMMOHE8', badge: 'HISTORIA' },
    { id: 'nosferatu', title: 'NOSFERATU (1922 - Terror Mudo)', videoId: 'FC6jFoYm3xs', badge: 'CINE CLÁSICO' },
    { id: 'charlie', title: 'TIEMPOS MODERNOS (1936 - C. Chaplin)', videoId: 'HAPifiEQflE', badge: 'CRÍTICA' },
    { id: 'caverna', title: 'EL MITO DE LA CAVERNA (Platón Animado)', videoId: '69F7GhASOdM', badge: 'ANIMACIÓN' }
  ],
  docs: [
    { id: 'internetboy', title: 'THE INTERNET\'S OWN BOY (Aaron Swartz)', videoId: '9vz06QO3UkQ', badge: 'LEAK' },
    { id: 'horses', title: 'EL FIN DEL TRABAJO (CGP Grey)', videoId: '7Pq-S557XQU', badge: 'DOC' },
    { id: 'nsa', title: 'VIGILANCIA GLOBAL (John Oliver)', videoId: 'XEVlyP4_11M', badge: 'LEAK' },
    { id: 'egg', title: 'EL HUEVO (La Vida y el Universo)', videoId: 'h6fcK_fRYaI', badge: 'DOC' },
    { id: 'nihilism', title: 'NIHILISMO OPTIMISTA (Kurzgesagt)', videoId: 'MBRqu0YOH14', badge: 'FILOSOFÍA' },
    { id: 'fermi', title: 'LA PARADOJA DE FERMI (¿Dónde están?)', videoId: 'sNhhvQGsMEc', badge: 'COSMOS' },
    { id: 'dalio', title: 'CÓMO FUNCIONA LA MÁQUINA ECONÓMICA', videoId: 'PHe0bXAIuk0', badge: 'GEOPOLÍTICA' },
    { id: 'snowden', title: 'EDWARD SNOWDEN: Entrevista Extendida', videoId: 'tEHWZvGEt7M', badge: 'LEAK' },
    { id: 'deepweb', title: 'LA DEEP WEB Y EL CIFRADO', videoId: '5iONN9n6sZ0', badge: 'CYBER' },
    { id: 'blackholes', title: 'EL FINAL DEL UNIVERSO (Agujeros Negros)', videoId: 'Qam5BkXIGYA', badge: 'COSMOS' }
  ]
};

const LiveFeeds = () => {
  const [activeTab, setActiveTab] = useState('live');
  const [fullScreenVideo, setFullScreenVideo] = useState(null);

  const handleExpand = (feed) => {
    setFullScreenVideo(feed);
  };

  const handleCloseFullScreen = () => {
    setFullScreenVideo(null);
  };

  const currentMedia = mediaData[activeTab] || [];

  return (
    <section className="live-feeds-container">
      <div className="live-feeds-header">
        <div>
          <h2 className="glitch-text" data-text="[ NEXO MULTIMEDIA ]">[ NEXO MULTIMEDIA ]</h2>
          <p className="nexus-subtitle">Interceptando transmisiones, cine independiente y archivos desclasificados.</p>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="nexus-tabs">
        {mediaCategories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              className={`nexus-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(cat.id)}
            >
              <span className="tab-icon-wrapper">
                <Icon size={16} />
                {cat.pulse && <span className="tab-pulse-dot"></span>}
              </span>
              <span className="tab-label">{cat.label}</span>
              {isActive && (
                <motion.div layoutId="nexusTabIndicator" className="nexus-tab-indicator" />
              )}
            </button>
          );
        })}
      </div>

      {/* Media Grid with Animation */}
      <div className="live-feeds-grid-wrapper">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, staggerChildren: 0.1 }}
            className="live-feeds-grid"
          >
            {currentMedia.map((feed, index) => (
              <motion.div 
                key={feed.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="feed-card"
              >
                <div className="feed-title-bar">
                  <span className="feed-title" title={feed.title}>{feed.title}</span>
                  <span className={`feed-badge ${activeTab}`}>{feed.badge}</span>
                </div>
                <div className="feed-video-wrapper">
                  <iframe 
                    src={feed.videoId 
                      ? `https://www.youtube.com/embed/${feed.videoId}?autoplay=0&mute=0&controls=1&modestbranding=1`
                      : `https://www.youtube.com/embed/live_stream?channel=${feed.channelId}&autoplay=0&mute=0&controls=1&modestbranding=1`
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
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
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
                <span className={`feed-badge ${activeTab}`}>{fullScreenVideo.badge}</span>
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
      
      {/* Field Reporters Section (Always visible below media) */}
      <FieldReporters />
    </section>
  );
};

export default LiveFeeds;
