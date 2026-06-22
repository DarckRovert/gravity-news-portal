import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { SearchProvider } from './contexts/SearchContext.jsx';
import { BookmarkProvider } from './contexts/BookmarkContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <SearchProvider>
        <BookmarkProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </BookmarkProvider>
      </SearchProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
