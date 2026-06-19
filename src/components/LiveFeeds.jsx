import React from 'react';
import './LiveFeeds.css';

const LiveFeeds = () => {
  // Canales sugeridos: NASA (Espacio), Al Jazeera (Geopolítica global), DW (Europa), Sky News (UK/Global)
  // Nota: Los IDs de los videos en vivo pueden cambiar si la transmisión se corta. 
  // La forma más estable es usar las URLs de canal en vivo, pero el embed de YouTube para canales en vivo 
  // es: https://www.youtube.com/embed/live_stream?channel=CHANNEL_ID
  
  const feeds = [
    {
      id: 'nasa',
      title: 'NASA ISS Live Feed (Monitoreo Orbital)',
      channelId: 'UCLA_DiR1FfKNvjuUpBHmylQ'
    },
    {
      id: 'aljazeera',
      title: 'Al Jazeera (Señal Geopolítica - MENA)',
      channelId: 'UCNye-wNBqNL5ZzHSJj3l8Bg'
    },
    {
      id: 'dw',
      title: 'DW News (Eje Euroasiático)',
      channelId: 'UCknLrEdhRCp1aegoMqRaCEg'
    },
    {
      id: 'sky',
      title: 'Sky News (Monitor Global)',
      channelId: 'UCoMdktPbSTixAyNGwb-PUIA'
    }
  ];

  return (
    <section className="live-feeds-container">
      <div className="live-feeds-header">
        <h2 className="glitch-text" data-text="[ MONITOREO GLOBAL ACTIVO ]">[ MONITOREO GLOBAL ACTIVO ]</h2>
        <div className="status-pulse">
          <span className="pulse-dot"></span>
          <span className="pulse-text">INTERCEPTANDO REDES SATELITALES</span>
        </div>
      </div>
      <div className="live-feeds-grid">
        {feeds.map((feed) => (
          <div key={feed.id} className="feed-card">
            <div className="feed-title-bar">
              <span className="feed-title">{feed.title}</span>
              <span className="feed-badge">LIVE</span>
            </div>
            <div className="feed-video-wrapper">
              <iframe 
                src={`https://www.youtube.com/embed/live_stream?channel=${feed.channelId}&autoplay=1&mute=1&controls=0&modestbranding=1`} 
                title={feed.title} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
            <div className="feed-overlay"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LiveFeeds;
