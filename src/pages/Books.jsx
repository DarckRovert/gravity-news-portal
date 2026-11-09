import { useState, useMemo } from 'react';
import { BookOpen, Download, Library, Bookmark, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { useSearch } from '../contexts/SearchContext';
import { useBookmarks } from '../contexts/BookmarkContext';
import { DEFAULT_IMAGE_FALLBACK } from '../utils/helpers';
import booksData from '../data/books.json';
import './Books.css';

export default function Books() {
  const { searchTerm } = useSearch();
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const [activeTab, setActiveTab] = useState('Todos');

  // Library statistics memoizadas
  const stats = useMemo(() => ({
    total: booksData.length,
    ensayos: booksData.filter(b => b.category === 'Ensayo').length,
    ficcion: booksData.filter(b => b.category === 'Ficción').length,
    libros: booksData.filter(b => b.category === 'Libro').length,
  }), []);

  const tabs = ['Todos', 'Guardados', 'Ensayo', 'Ficción', 'Libro'];

  // Filter books based on search query and category tab memoizado
  const filteredBooks = useMemo(() => {
    const term = (searchTerm || '').toLowerCase();
    return booksData.filter((book) => {
      const title = (book.title || '').toLowerCase();
      const description = (book.description || '').toLowerCase();
      
      const matchesSearch = !term || title.includes(term) || description.includes(term);
      
      let matchesTab = true;
      if (activeTab === 'Guardados') {
        matchesTab = isBookmarked(book.id);
      } else if (activeTab !== 'Todos') {
        matchesTab = book.category === activeTab;
      }
      
      return matchesSearch && matchesTab;
    });
  }, [searchTerm, activeTab, isBookmarked]);

  return (
    <motion.div 
      className="books-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <SEO 
        title="Biblioteca" 
        description="Archivos profundos y biblioteca de textos clave." 
      />
      <header className="page-header">
        <h1 className="page-title animate-slide-up" style={{ animationDelay: '0.1s' }}>
          La <span className="brand-accent">Biblioteca Soberana</span>
        </h1>
        <p className="page-subtitle animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Archivos cuánticos y textos de contingencia del núcleo de Gravity AI.
        </p>
      </header>

      {/* Library Stats Grid */}
      <div className="library-stats-grid animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="stat-card glass-panel">
          <Library size={24} className="stat-icon" />
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Tomos Totales</span>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <Bookmark size={24} className="stat-icon essays" />
          <div className="stat-info">
            <span className="stat-value">{stats.ensayos}</span>
            <span className="stat-label">Ensayos Científicos</span>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <Bookmark size={24} className="stat-icon fiction" />
          <div className="stat-info">
            <span className="stat-value">{stats.ficcion}</span>
            <span className="stat-label">Ficción de la Zona Ágora</span>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <Bookmark size={24} className="stat-icon research" />
          <div className="stat-info">
            <span className="stat-value">{stats.libros}</span>
            <span className="stat-label">Libros de Investigación</span>
          </div>
        </div>
      </div>

      {/* Search and Navigation Tabs */}
      <div className="books-filter-bar glass-panel animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="books-tabs">
          {tabs.map((tab) => (
            <button 
              key={tab} 
              className={`books-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'Todos' ? 'Todos los Archivos' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Showcase Grid */}
      {filteredBooks.length === 0 ? (
        <div className="empty-state-books glass-panel animate-slide-up" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', marginTop: '2rem', borderRadius: '16px' }}>
          <AlertTriangle size={36} style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>No se encontraron tomos coincidentes</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto', fontSize: '0.9rem' }}>
            Ajusta los términos de búsqueda o cambia la categoría de filtro para explorar el archivo de la biblioteca.
          </p>
        </div>
      ) : (
        <div className="books-showcase animate-slide-up" style={{ animationDelay: '0.5s' }}>
          {filteredBooks.map((book, index) => (
            <div 
              key={book.id} 
              className="book-card glass-panel hover-lift"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              {/* 3D Book Cover Simulator */}
              <div className="book-3d-wrapper">
                <div className="book-cover-container">
                  <img 
                    src={book.cover} 
                    alt={`Portada de ${book.title}`} 
                    className="book-cover" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_IMAGE_FALLBACK;
                    }}
                  />
                  <div className="book-spine"></div>
                  <div className="book-cover-overlay"></div>
                  <div className="book-category-tag">{book.category}</div>
                </div>
              </div>
              
              <div className="book-details">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">Por <span>{book.author}</span></p>
                <p className="book-description">{book.description}</p>
                
                <div className="book-footer">
                  <div className="book-actions">
                    <Link to={`/book/${book.id}`} className="btn-book-action primary" title="Leer online">
                      <BookOpen size={16} />
                      <span>Leer Tomo</span>
                    </Link>
                    <a href={book.htmlUrl} download={`${book.id}.html`} className="btn-book-action secondary" title="Descargar HTML">
                      <Download size={16} />
                    </a>
                    <button 
                      className={`btn-bookmark-book ${isBookmarked(book.id) ? 'bookmarked' : ''}`}
                      onClick={(e) => { e.preventDefault(); toggleBookmark(book.id); }}
                      title={isBookmarked(book.id) ? "Quitar de Guardados" : "Guardar para después"}
                      aria-label={isBookmarked(book.id) ? "Quitar de Guardados" : "Guardar para después"}
                    >
                      <Bookmark size={18} fill={isBookmarked(book.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
