import './NewsTicker.css';

const NewsTicker = () => {
  const headlines = [
    "INTERCEPTANDO NODO PRINCIPAL...",
    "CONEXIÓN ENCRIPTADA ESTABLECIDA",
    "EL SALVADOR: LEYES DE IA ANTES DE INFRAESTRUCTURA",
    "PERÚ: GARITAS CONVERTIDAS EN NODOS BIOMÉTRICOS",
    "MERCADO INMOBILIARIO EXTRAE DATOS COGNITIVOS",
    "INICIANDO DESCARGA DE DATOS...",
    "VIGILANCIA DEL LEVIATÁN ACTIVA"
  ];

  return (
    <div className="ticker-container">
      <div className="ticker-label">LIVE FEED</div>
      <div className="ticker-scroll">
        <div className="ticker-content">
          {headlines.map((text, i) => (
            <span key={i} className="ticker-item">
              <span className="ticker-dot"></span> {text}
            </span>
          ))}
          {/* Duplicado para efecto infinito perfecto */}
          {headlines.map((text, i) => (
            <span key={`dup-${i}`} className="ticker-item">
              <span className="ticker-dot"></span> {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
