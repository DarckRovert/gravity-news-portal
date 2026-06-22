/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    let savedTheme = 'onyx';
    try {
      const item = localStorage.getItem('gravity-theme');
      if (item) savedTheme = item;
    } catch (error) {
      console.warn("Acceso a localStorage denegado para el tema.", error);
    }
    // Prevención de FOUC (Flash of Unstyled Content): 
    // mutamos el DOM sincrónicamente antes del primer render.
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    return savedTheme;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('gravity-theme', theme);
    } catch (error) {
      console.warn("No se pudo guardar el tema en localStorage.", error);
    }
  }, [theme]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
