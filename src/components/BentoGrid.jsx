import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, ChevronDown, Bookmark } from 'lucide-react';
import { playSound } from '../utils/audio';
import { getRelativeTime } from '../utils/helpers';
import ProgressiveImage from './ProgressiveImage';

export default function BentoGrid({
  regularNews,
  isBookmarked,
  toggleBookmark,
  setSelectedArticle,
  hasMore,
  setVisibleCount
}) {
  return (
    <>
      <div className="bento-grid-container">
        <AnimatePresence mode="popLayout">
          {regularNews.map((item, index) => {
            // Algoritmo matemático predictivo para mampostería sin huecos
            let bentoType; 
            const mod = index % 5;
            const isLast = index === regularNews.length - 1;

            if (mod === 0) {
              bentoType = isLast ? "bento-wide bento-span-12" : "bento-tall";
            } else if (mod === 1) {
              bentoType = isLast ? "bento-tall" : "bento-large-square";
            } else if (mod === 2) {
              bentoType = "bento-large-square";
            } else if (mod === 3) {
              bentoType = isLast ? "bento-wide bento-span-12" : "bento-wide";
            } else {
              bentoType = "bento-small-square";
            }
            
            return (
              <motion.article 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                key={item.id} 
                tabIndex={0}
                role="button"
                aria-label={`Leer artículo: ${item.title}`}
                className={`bento-card ${bentoType} glass-panel hover-lift`}
                onMouseEnter={() => playSound('hover')}
                onClick={() => { playSound('click'); setSelectedArticle(item); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    playSound('click');
                    setSelectedArticle(item);
                  }
                }}
              >
                <div className="bento-image-wrapper">
                  <ProgressiveImage src={item.image} alt={item.title} className="bento-image" />
                  <div className="bento-image-overlay"></div>
                  <span className="badge-futuristic bento-badge">{item.category}</span>
                </div>
                <div className="bento-text-content">
                  <h3 className="bento-title">{item.title}</h3>
                  {(bentoType === "bento-tall" || bentoType === "bento-wide") && (
                    <p className="bento-excerpt">{item.excerpt}</p>
                  )}
                  <div className="bento-footer">
                    <span className="bento-date"><Clock size={12} /> {getRelativeTime(item.date)}</span>
                    <div className="bento-footer-actions">
                      <button 
                        className={`btn-bookmark-small ${isBookmarked(item.id) ? 'bookmarked' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleBookmark(item.id); }}
                        aria-label={isBookmarked(item.id) ? "Quitar de Guardados" : "Guardar noticia"}
                        title={isBookmarked(item.id) ? "Quitar de Guardados" : "Guardar noticia"}
                      >
                        <Bookmark size={14} fill={isBookmarked(item.id) ? 'currentColor' : 'none'} />
                      </button>
                      <div className="bento-read-icon"><ArrowRight size={16} /></div>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>
      
      {/* Pagination Button */}
      {hasMore && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="pagination-container"
          style={{ textAlign: 'center', marginTop: '30px' }}
        >
          <button 
            className="btn-bridge" 
            onClick={() => { playSound('click'); setVisibleCount(v => v + 5); }}
            onMouseEnter={() => playSound('hover')}
            style={{ padding: '12px 30px', margin: '0 auto' }}
          >
            <ChevronDown size={18} /> Cargar Más Anomalías
          </button>
        </motion.div>
      )}
    </>
  );
}
