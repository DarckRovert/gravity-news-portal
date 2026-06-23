import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, Radio, Film, FolderLock, Play, Bookmark } from 'lucide-react';
import FieldReporters from './FieldReporters';
import { useSearch } from '../contexts/SearchContext';
import { useBookmarks } from '../contexts/BookmarkContext';
import './LiveFeeds.css';

import mediaData from '../data/media.json';

const mediaCategories = [
  { id: 'live', label: 'Monitoreo Global', icon: Radio, pulse: true },
  { id: 'cinema', label: 'Cine de Resistencia', icon: Film, pulse: false },
  { id: 'docs', label: 'Archivos Desclasificados', icon: FolderLock, pulse: false },
  { id: 'guardados', label: 'Guardados', icon: Bookmark, pulse: false }
];

const LiveFeeds = () => {
  const [activeTab, setActiveTab] = useState('live');
  const [fullScreenVideo, setFullScreenVideo] = useState(null);
  const [playingVideo, setPlayingVideo] = useState({});
  const [visibleCount, setVisibleCount] = useState(8);
  const { searchTerm } = useSearch();
  const { toggleBookmark, isBookmarked } = useBookmarks();

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setVisibleCount(8); // Reset pagination on tab change
  };

  const handleExpand = (feed) => {
    setFullScreenVideo(feed);
  };

  const handleCloseFullScreen = () => {
    setFullScreenVideo(null);
  };

  // Combine all media arrays to find bookmarks easily
  const allMediaFlat = Object.values(mediaData).flat();
  const currentMedia = activeTab === 'guardados' 
    ? allMediaFlat.filter(feed => isBookmarked(feed.id))
    : mediaData[activeTab] || [];
  
  // Filter by search term
  const filteredMedia = currentMedia.filter((feed) => {
    const title = feed.title || '';
    const badge = feed.badge || '';
    return title.toLowerCase().includes((searchTerm || '').toLowerCase()) || 
           badge.toLowerCase().includes((searchTerm || '').toLowerCase());
  });

  const visibleMedia = filteredMedia.slice(0, visibleCount);
  const hasMore = visibleCount < filteredMedia.length;

  const loadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const playVideo = (feedId) => {
    setPlayingVideo((prev) => ({ ...prev, [feedId]: true }));
  };

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
              onClick={() => handleTabChange(cat.id)}
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
            {visibleMedia.map((feed, index) => (
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
                  {playingVideo[feed.id] || feed.badge === 'LIVE' || !feed.videoId ? (
                    <iframe 
                      src={feed.videoId 
                        ? `https://www.youtube.com/embed/${feed.videoId}?autoplay=${feed.badge === 'LIVE' ? '0' : '1'}&mute=0&controls=1&modestbranding=1`
                        : `https://www.youtube.com/embed/live_stream?channel=${feed.channelId}&autoplay=0&mute=0&controls=1&modestbranding=1`
                      } 
                      title={feed.title} 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  ) : (
                    <div className="lazy-thumbnail-wrapper" onClick={() => playVideo(feed.id)}>
                      <img 
                        src={`https://img.youtube.com/vi/${feed.videoId}/maxresdefault.jpg`} 
                        onError={(e) => { 
                          if (!e.target.dataset.triedHq) {
                            e.target.dataset.triedHq = 'true';
                            e.target.src = `https://img.youtube.com/vi/${feed.videoId}/hqdefault.jpg`;
                          } else if (!e.target.dataset.triedMq) {
                            e.target.dataset.triedMq = 'true';
                            e.target.src = `https://img.youtube.com/vi/${feed.videoId}/mqdefault.jpg`;
                          } else if (!e.target.dataset.triedFallback) {
                            e.target.dataset.triedFallback = 'true';
                            e.target.src = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'; // generic matrix/cyber fallback
                          }
                        }}
                        alt={feed.title} 
                        className="lazy-thumbnail"
                      />
                      <div className="play-button-overlay">
                        <Play fill="white" size={36} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="feed-overlay">
                  <button 
                    className="btn-expand-video"
                    onClick={() => handleExpand(feed)}
                    title="Ver en Pantalla Completa"
                  >
                    <Maximize2 size={20} />
                  </button>
                  <button 
                    className="btn-expand-video"
                    onClick={(e) => { e.stopPropagation(); toggleBookmark(feed.id); }}
                    title={isBookmarked(feed.id) ? "Quitar Guardado" : "Guardar Video"}
                    style={{ 
                      color: isBookmarked(feed.id) ? 'var(--accent-secondary)' : '#fff'
                    }}
                  >
                    <Bookmark size={20} fill={isBookmarked(feed.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        {hasMore && (
          <div className="load-more-container">
            <button className="btn-load-more" onClick={loadMore}>
              CARGAR MÁS ARCHIVOS
            </button>
          </div>
        )}
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
