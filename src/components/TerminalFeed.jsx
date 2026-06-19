import { useState, useEffect } from 'react';
import './TerminalFeed.css';

const TerminalFeed = () => {
  const [logs, setLogs] = useState([
    "> INITIALIZING GRAVITY PROTOCOL...",
    "> BYPASSING SECURITY NODES [OK]",
    "> CONNECTING TO MAINFRAME..."
  ]);

  useEffect(() => {
    const possibleLogs = [
      "Extrayendo telemetría biométrica...",
      "Interceptando paquete de datos [ENCRIPTADO]",
      "Alerta: Homeostasis del poder fluctuando",
      "Calculando colapso probabilístico: 98.4%",
      "Descifrando nodo de la red eCITES...",
      "Voluntad soberana suprimida [OK]",
      "Detectando entropía social en sector 4...",
      "Sincronizando reloj atómico..."
    ];

    const interval = setInterval(() => {
      const newLog = `> ${possibleLogs[Math.floor(Math.random() * possibleLogs.length)]}`;
      setLogs(prev => {
        const newLogs = [...prev, newLog];
        if (newLogs.length > 8) return newLogs.slice(1);
        return newLogs;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="terminal-feed-container glass-panel">
      <div className="terminal-header">
        <span className="terminal-title">SYS.LOG</span>
        <span className="blinking-cursor">_</span>
      </div>
      <div className="terminal-body">
        {logs.map((log, i) => (
          <div key={i} className={`terminal-line ${log.includes('Alerta') || log.includes('ENCRIPTADO') ? 'text-warn' : ''}`}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TerminalFeed;
