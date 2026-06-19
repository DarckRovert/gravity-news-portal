import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './CustomCursor.css';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (
        e.target.tagName.toLowerCase() === 'button' ||
        e.target.tagName.toLowerCase() === 'a' ||
        e.target.closest('.bento-card') ||
        e.target.closest('.hero-article')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1,
      backgroundColor: 'rgba(0, 240, 255, 0.2)',
      border: '1px solid rgba(0, 240, 255, 0.5)',
    },
    hover: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      scale: 1.5,
      backgroundColor: 'rgba(0, 240, 255, 0.1)',
      border: '2px solid rgba(0, 240, 255, 1)',
      boxShadow: '0 0 20px rgba(0, 240, 255, 0.6)',
    }
  };

  return (
    <>
      <div 
        className="cursor-dot" 
        style={{ left: mousePosition.x, top: mousePosition.y }} 
      />
      <motion.div
        className="cursor-ring"
        variants={variants}
        animate={isHovering ? "hover" : "default"}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
      />
    </>
  );
};

export default CustomCursor;
