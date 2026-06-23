// Relative Time Calculator
export const getRelativeTime = (dateString) => {
  if (!dateString) return 'Desconocido';
  const target = new Date(dateString);
  const now = new Date();
  const diffMs = now - target;
  
  // If it's a future date or very recent
  if (diffMs < 60000) return 'Hace unos segundos';
  
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `Hace ${diffMins} min`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Hace ${diffHours} hr`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 30) return `Hace ${diffDays} días`;
  
  return dateString.split('T')[0]; // fallback
};

export const getReadingTime = (text) => {
  if (!text) return 1;
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};
