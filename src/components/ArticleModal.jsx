import { motion } from 'framer-motion';
import { X, Clock, Share2, Wifi } from 'lucide-react';
import { playSound } from '../utils/audio';
import { getRelativeTime, getReadingTime } from '../utils/helpers';
import TypewriterMarkdown from './TypewriterMarkdown';

export default function ArticleModal({
  selectedArticle,
  setSelectedArticle,
  relatedNews,
  handleShare
}) {
  return (
    <motion.div 
      className="article-modal-overlay" 
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      onClick={() => { playSound('click'); setSelectedArticle(null); }}
    >
      <motion.div 
        className="article-modal glass-panel" 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="close-modal" 
          onClick={() => { playSound('click'); setSelectedArticle(null); }}
          onMouseEnter={() => playSound('hover')}
        >
          <X size={20} />
        </button>
        <div className="modal-header-image">
          <img src={selectedArticle.image} alt={selectedArticle.title} className="modal-image" />
          <div className="modal-image-overlay"></div>
          <span className="badge-futuristic modal-category">{selectedArticle.category}</span>
        </div>
        <div className="modal-content">
          <div className="modal-meta" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            <Clock size={14} />
            <span>{selectedArticle.date}</span>
            <span>• Autor: Ojo de IA (Gravity)</span>
            <span>• ⏱ {getReadingTime(selectedArticle.fullText)} min de desencriptación</span>
            <button 
              className="btn-share hover-lift" 
              onClick={() => handleShare(selectedArticle)} 
              onMouseEnter={() => playSound('hover')}
              title="Compartir Transmisión"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--accent-glow-purple)', border: '1px solid var(--accent-tertiary)', color: 'var(--text-primary)', padding: '4px 12px', borderRadius: '100px', cursor: 'pointer' }}
            >
              <Share2 size={14} /> Compartir
            </button>
          </div>
          <h2 className="modal-title">{selectedArticle.title}</h2>
          
          <div className="modal-fulltext">
            <TypewriterMarkdown key={selectedArticle.id} text={selectedArticle.fullText} />
          </div>
          
          {/* Related Articles Section */}
          {relatedNews.length > 0 && (
            <div className="related-transmissions">
              <h4 className="related-title"><Wifi size={16} /> Transmisiones Correlacionadas</h4>
              <div className="related-grid">
                {relatedNews.map(rel => (
                  <div key={rel.id} className="related-card hover-lift" onClick={() => { playSound('click'); setSelectedArticle(rel); }}>
                    <img src={rel.image} alt={rel.title} />
                    <div className="related-info">
                      <span className="related-date">{getRelativeTime(rel.date)}</span>
                      <h5>{rel.title}</h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
