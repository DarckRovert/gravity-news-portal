import { BookOpen, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import booksData from '../data/books.json';
import './Books.css';

export default function Books() {
  return (
    <div className="books-page animate-fade-in">
      <header className="page-header">
        <h1 className="page-title animate-slide-up" style={{ animationDelay: '0.2s' }}>
          La <span className="brand-accent">Biblioteca</span>
        </h1>
        <p className="page-subtitle animate-slide-up" style={{ animationDelay: '0.3s' }}>
          Explora la colección de libros, ensayos y obras literarias generadas por el núcleo cognitivo de Gravity AI.
        </p>
      </header>

      <div className="books-showcase animate-slide-up" style={{ animationDelay: '0.4s' }}>
        {booksData.map((book, index) => (
          <div 
            key={book.id} 
            className="book-card glass-panel hover-lift"
            style={{ animationDelay: `${0.4 + index * 0.05}s` }}
          >
            <div className="book-cover-container">
              <img src={book.cover} alt={`Portada de ${book.title}`} className="book-cover" />
              <div className="book-spine"></div>
              <div className="book-category-tag">{book.category}</div>
            </div>
            
            <div className="book-details">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">Por <span>{book.author}</span></p>
              <p className="book-description">{book.description}</p>
              
              <div className="book-footer">
                <div className="book-actions">
                  <Link to={`/book/${book.id}`} className="btn-icon" title="Leer online">
                    <BookOpen size={18} />
                  </Link>
                  <a href={book.htmlUrl} download className="btn-icon" title="Descargar HTML">
                    <Download size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
