/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const BookmarkContext = createContext();

export const useBookmarks = () => useContext(BookmarkContext);

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('gravity-bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error reading bookmarks", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('gravity-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (id) => {
    setBookmarks(prev => 
      prev.includes(id) 
        ? prev.filter(bId => bId !== id)
        : [...prev, id]
    );
  };

  const isBookmarked = (id) => bookmarks.includes(id);

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
};
