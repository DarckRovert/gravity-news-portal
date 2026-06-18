import { useState } from 'react';
import { ArrowRight, Clock, X } from 'lucide-react';
import './Home.css';

const MOCK_NEWS = [
  {
    id: 1,
    category: 'Gravedad Cognitiva',
    title: 'Gravity AI revoluciona la automatización del conocimiento',
    excerpt: 'El puente híbrido ha logrado conectar la ejecución neural local con las capacidades expansivas de la nube en tiempo real.',
    fullText: 'La actualización más reciente de Gravity AI ha demostrado una capacidad sin precedentes para delegar subrutinas a modelos ligeros mientras mantiene la estructura de pensamiento lógico en modelos masivos en la nube. Este sistema de balanceo de carga cognitivo abre una nueva era en la interacción máquina-humano, donde la latencia ya no es una barrera para el razonamiento profundo.',
    date: 'Hace 2 horas',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop',
    featured: true
  },
  {
    id: 2,
    category: 'Física',
    title: 'Nuevos descubrimientos desafían el modelo estándar',
    excerpt: 'La fluctuación cuántica observada en entornos estabilizados sugiere dimensiones plegadas.',
    fullText: 'Investigadores han logrado aislar variables probabilísticas que no encajan en las predicciones clásicas de la física cuántica, apuntando directamente a la existencia de estructuras hiperdimensionales que interactúan con nuestro plano únicamente a través de distorsiones gravitacionales menores.',
    date: 'Hace 5 horas',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 3,
    category: 'Sociedad',
    title: 'El ocaso de las Tulpas Colectivas',
    excerpt: 'Un análisis sobre cómo la tecnología descentralizada está disolviendo los paradigmas de control.',
    fullText: 'A medida que los individuos recuperan la soberanía cognitiva a través de IA personal, las narrativas impuestas por entidades centralizadas pierden su agarre psicológico. Este fenómeno está causando una reestructuración en la forma en que la sociedad consume y procesa verdades axiomáticas.',
    date: 'Ayer',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=800&auto=format&fit=crop'
  }
];

export default function Home() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="home-page animate-fade-in">
      <header className="page-header">
        <h1 className="page-title animate-slide-up" style={{ animationDelay: '0.2s' }}>
          El <span className="brand-accent">Nexo</span> de Información
        </h1>
        <p className="page-subtitle animate-slide-up" style={{ animationDelay: '0.3s' }}>
          Sincronizando el conocimiento global a través del filtro de Gravity.
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
              <div className="news-overlay"></div>
              <span className="news-category">{item.category}</span>
            </div>
            
            <div className="news-content">
              <div className="news-meta">
                <Clock size={14} />
                <span>{item.date}</span>
              </div>
              
              <h2 className="news-title">{item.title}</h2>
              <p className="news-excerpt">{item.excerpt}</p>
              
              <button 
                className="read-more" 
                onClick={() => setSelectedArticle(item)}
              >
                Leer reporte <ArrowRight size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Modal para Leer Artículos */}
      {selectedArticle && (
        <div className="article-modal-overlay animate-fade-in" onClick={() => setSelectedArticle(null)}>
          <div className="article-modal glass-panel animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedArticle(null)}>
              <X size={24} />
            </button>
            <img src={selectedArticle.image} alt={selectedArticle.title} className="modal-image" />
            <div className="modal-content">
              <span className="news-category modal-category">{selectedArticle.category}</span>
              <h2 className="modal-title">{selectedArticle.title}</h2>
              <p className="modal-fulltext">{selectedArticle.fullText}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
