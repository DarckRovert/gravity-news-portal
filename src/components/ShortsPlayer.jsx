import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';
import './ShortsPlayer.css';

const ShortsPlayer = ({ videoUrl, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  const handleProgressClick = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clickedValue = x / rect.width;
      videoRef.current.currentTime = clickedValue * videoRef.current.duration;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="shorts-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="shorts-container"
          initial={{ scale: 0.9, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="shorts-close" onClick={onClose} aria-label="Cerrar video">
            <X size={24} />
          </button>

          <video
            ref={videoRef}
            className="shorts-video"
            src={videoUrl}
            autoPlay
            loop
            playsInline
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
          />

          {!isPlaying && (
            <div className="shorts-play-toggle">
              <Play size={40} fill="white" />
            </div>
          )}

          <div className="shorts-controls">
            <div className="shorts-progress-bar" onClick={handleProgressClick}>
              <div
                className="shorts-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ShortsPlayer;
