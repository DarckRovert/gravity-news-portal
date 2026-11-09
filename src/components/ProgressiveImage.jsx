import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DEFAULT_IMAGE_FALLBACK } from '../utils/helpers';
import './ProgressiveImage.css';

const ProgressiveImage = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  // Reiniciar estado de carga durante render phase si cambia la URL de la imagen
  if (src !== prevSrc) {
    setPrevSrc(src);
    setIsLoaded(false);
  }

  // Generamos un thumbnail de baja resolución si es de picsum, o usamos un blur por CSS
  const lowResSrc = src && typeof src === 'string' && src.includes('picsum.photos') 
    ? src.replace(/\/\d+\/\d+$/, '/20/20') 
    : src;

  useEffect(() => {
    let active = true;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      if (active) setIsLoaded(true);
    };
    img.onerror = () => {
      if (active) setIsLoaded(true);
    };
    return () => {
      active = false;
    };
  }, [src]);

  return (
    <div className={`progressive-img-container ${className}`}>
      {/* Imagen de baja resolución desenfocada */}
      <img
        src={lowResSrc}
        alt=""
        className={`progressive-img progressive-img-thumb ${isLoaded ? 'progressive-img-hidden' : ''}`}
        aria-hidden="true"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = DEFAULT_IMAGE_FALLBACK;
        }}
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
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = DEFAULT_IMAGE_FALLBACK;
          setIsLoaded(true); // force load state to show the fallback
        }}
      />
    </div>
  );
};

export default ProgressiveImage;
