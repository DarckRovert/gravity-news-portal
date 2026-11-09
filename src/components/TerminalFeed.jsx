import { useState, useEffect, useRef } from 'react';
import './TerminalFeed.css';

const TerminalFeed = ({ bridgeUrl, bridgeStatus }) => {
  const [logs, setLogs] = useState([
    "> INITIALIZING GRAVITY PROTOCOL...",
    "> BYPASSING SECURITY NODES [OK]",
    "> CONNECTING TO MAINFRAME..."
  ]);
  const bodyRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom whenever logs change without hijacking window scroll
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    if (bridgeStatus === 'online' && bridgeUrl) {
      let isMounted = true;
      const controller = new AbortController();

      const fetchLogs = async () => {
        if (document.hidden) return;
        try {
          const res = await fetch(`${bridgeUrl}/v1/journalist/log`, {
            signal: controller.signal
          });
          if (res.ok && isMounted) {
            const data = await res.json();
            if (data.ok && data.logs) {
              const lines = data.logs.split('\n').filter(l => l.trim().length > 0);
              // Take the last 20 lines to avoid blowing up the UI
              setLogs(lines.slice(-20));
            }
          }
        } catch {
          // Silent fail
        }
      };
      
      // Fetch immediately and then poll
      fetchLogs();
      const interval = setInterval(fetchLogs, 2000);

      const handleVisibility = () => {
        if (!document.hidden) fetchLogs();
      };
      document.addEventListener('visibilitychange', handleVisibility);

      return () => {
        isMounted = false;
        controller.abort();
        clearInterval(interval);
        document.removeEventListener('visibilitychange', handleVisibility);
      };
    } else {
      // Fallback cinematic mode
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
        if (document.hidden) return;
        const newLog = `> ${possibleLogs[Math.floor(Math.random() * possibleLogs.length)]}`;
        setLogs(prev => {
          const newLogs = [...prev, newLog];
          if (newLogs.length > 8) return newLogs.slice(1);
          return newLogs;
        });
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [bridgeStatus, bridgeUrl]);

  return (
    <div className="terminal-feed-container glass-panel" aria-hidden="true">
      <div className="terminal-header">
        <span className="terminal-title">SYS.LOG</span>
        <span className="blinking-cursor">_</span>
      </div>
      <div className="terminal-body" ref={bodyRef}>
        {logs.map((log, i) => (
          <div key={i} className={`terminal-line ${log.includes('Alerta') || log.includes('ENCRIPTADO') || log.includes('ERROR') || log.includes('CRITICAL') ? 'text-warn' : ''}`}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TerminalFeed;
