import { ArrowRight, Clock } from 'lucide-react';
import './Home.css';

const MOCK_NEWS = [
  {
    id: 1,
    category: 'Tecnología',
    title: 'Gravity AI revoluciona la automatización de la IA con integración local y en la nube',
    excerpt: 'La última actualización introduce el modelo de puente híbrido que permite transiciones fluidas entre LM Studio local y Nvidia NIM...',
    date: 'Hace 2 horas',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
    featured: true
  },
  {
    id: 2,
    category: 'Ciencia',
    title: 'Nuevos descubrimientos en física cuántica desafían el modelo estándar',
    excerpt: 'Investigadores han logrado observar estados de la materia previamente teóricos a temperatura ambiente.',
    date: 'Hace 5 horas',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 3,
    category: 'Literatura',
    title: 'El auge de las novelas generadas por IA: ¿Un nuevo género literario?',
    excerpt: 'Autores independientes están utilizando modelos de lenguaje masivos para crear universos literarios expandidos.',
    date: 'Ayer',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=800&auto=format&fit=crop'
  }
];

export default function Home() {
  return (
    <div className="home-page animate-fade-in">
      <header className="page-header">
        <h1 className="page-title animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Últimas <span className="brand-accent">Noticias</span>
        </h1>
        <p className="page-subtitle animate-slide-up" style={{ animationDelay: '0.3s' }}>
          Mantente al día con los avances tecnológicos, artículos científicos y novedades de la comunidad.
        </p>
      </header>

      <div className="news-grid animate-slide-up" style={{ animationDelay: '0.4s' }}>
        {MOCK_NEWS.map((item, index) => (
          <article 
            key={item.id} 
            className={`news-card glass-panel hover-lift ${item.featured ? 'featured' : ''}`}
            style={{ animationDelay: `${0.4 + index * 0.1}s` }}
          >
            <div className="news-image-container">
              <img src={item.image} alt={item.title} className="news-image" />
              <span className="news-category">{item.category}</span>
            </div>
            
            <div className="news-content">
              <div className="news-meta">
                <Clock size={14} />
                <span>{item.date}</span>
              </div>
              
              <h2 className="news-title">{item.title}</h2>
              <p className="news-excerpt">{item.excerpt}</p>
              
              <button className="read-more">
                Leer artículo <ArrowRight size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
