import './CoreStatusBadge.css';

const CoreStatusBadge = () => {
  return (
    <div className="core-status-container" title="Gravity AI Core is online and synchronizing with Groq">
      <div className="core-pulse-dot"></div>
      <span className="core-status-text">CORE: <span className="text-highlight">ONLINE</span></span>
    </div>
  );
};

export default CoreStatusBadge;
