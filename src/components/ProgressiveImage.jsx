import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './ProgressiveImage.css';

const ProgressiveImage = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Generamos un thumbnail de baja resolución si es de picsum, o usamos un blur por CSS
  const lowResSrc = src && typeof src === 'string' && src.includes('picsum.photos') 
    ? src.replace(/\/\d+\/\d+$/, '/20/20') 
    : src;

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
  }, [src]);

  return (
    <div className={`progressive-img-container ${className}`}>
      {/* Imagen de baja resolución desenfocada */}
      <img
        src={lowResSrc}
        alt=""
        className={`progressive-img progressive-img-thumb ${isLoaded ? 'progressive-img-hidden' : ''}`}
        aria-hidden="true"
      />
      
      {/* Imagen final en alta resolución */}
      <motion.img
        src={src}
        alt={alt}
        className={`progressive-img progressive-img-full ${isLoaded ? 'progressive-img-visible' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        loading="lazy"
      />
    </div>
  );
};

export default ProgressiveImage;
