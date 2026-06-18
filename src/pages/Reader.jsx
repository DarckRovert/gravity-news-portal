import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import booksData from '../data/books.json';
import './Reader.css';

export default function Reader() {
  const { id } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  
  const book = booksData.find(b => b.id === id);

  useEffect(() => {
    if (book) {
      setLoading(true);
      fetch(book.htmlUrl)
        .then(res => res.text())
        .then(html => {
          // Extraer el body si es un documento completo HTML, o usar todo si es fragmento
          const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
          setContent(bodyMatch ? bodyMatch[1] : html);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading book:', err);
          setContent('<p>Error al cargar el contenido del libro.</p>');
          setLoading(false);
        });
    }
  }, [book]);

  if (!book) {
    return (
      <div className="reader-page error">
        <h2>Libro no encontrado</h2>
        <Link to="/books" className="back-link"><ArrowLeft /> Volver a la Biblioteca</Link>
      </div>
    );
  }

  return (
    <div className="reader-page animate-fade-in">
      <div className="reader-nav">
        <Link to="/books" className="back-link">
          <ArrowLeft size={18} /> Volver
        </Link>
        <span className="reader-title">{book.title}</span>
      </div>

      <article className="reader-container">
        {loading ? (
          <div className="reader-loading">Iniciando interfaz neural...</div>
        ) : (
          <div 
            className="reader-content animate-slide-up"
            dangerouslySetInnerHTML={{ __html: content }} 
          />
        )}
      </article>
    </div>
  );
}
