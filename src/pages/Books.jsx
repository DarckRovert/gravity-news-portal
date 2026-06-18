import { BookOpen, Download } from 'lucide-react';
import './Books.css';

const MOCK_BOOKS = [
  {
    id: 1,
    title: 'La Física del Poder',
    author: 'DarckRovert',
    cover: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=600&auto=format&fit=crop',
    description: 'Un ensayo profundo sobre la ingeniería psíquica y las estructuras de control en la sociedad moderna.',
    pages: 142
  },
  {
    id: 2,
    title: 'Ecos del Nexo',
    author: 'DarckRovert',
    cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop',
    description: 'Exploración de universos paralelos interactuando con inteligencias artificiales nacientes.',
    pages: 315
  },
  {
    id: 3,
    title: 'Memorias Sintéticas',
    author: 'DarckRovert',
    cover: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop',
    description: '¿Qué sucede cuando las máquinas comienzan a soñar con su propio pasado?',
    pages: 208
  }
];

export default function Books() {
  return (
    <div className="books-page animate-fade-in">
      <header className="page-header">
        <h1 className="page-title animate-slide-up" style={{ animationDelay: '0.2s' }}>
          La <span className="brand-accent">Biblioteca</span>
        </h1>
        <p className="page-subtitle animate-slide-up" style={{ animationDelay: '0.3s' }}>
          Explora la colección de libros, ensayos y obras literarias generadas y escritas por DarckRovert.
        </p>
      </header>

      <div className="books-showcase animate-slide-up" style={{ animationDelay: '0.4s' }}>
        {MOCK_BOOKS.map((book, index) => (
          <div 
            key={book.id} 
            className="book-card glass-panel hover-lift"
            style={{ animationDelay: `${0.4 + index * 0.1}s` }}
          >
            <div className="book-cover-container">
              <img src={book.cover} alt={`Portada de ${book.title}`} className="book-cover" />
              <div className="book-spine"></div>
            </div>
            
            <div className="book-details">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">Por <span>{book.author}</span></p>
              <p className="book-description">{book.description}</p>
              
              <div className="book-footer">
                <span className="book-pages">{book.pages} páginas</span>
                <div className="book-actions">
                  <button className="btn-icon" title="Leer online">
                    <BookOpen size={18} />
                  </button>
                  <button className="btn-icon" title="Descargar PDF">
                    <Download size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
