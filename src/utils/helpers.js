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

export const getReadingTime = (article) => {
  if (!article) return 1;
  let text = '';
  if (typeof article === 'string') {
    text = article;
  } else if (typeof article === 'object') {
    text = [
      article.fullText || '',
      article.context || '',
      article.analysis || '',
      article.tldr ? article.tldr.join(' ') : ''
    ].join(' ');
  }
  const words = text.split(/\s+/).filter(w => w.trim().length > 0).length;
  return Math.max(1, Math.ceil(words / 200));
};

export const DEFAULT_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80';

export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      return true;
    }
  } catch (err) {
    console.error('Copy failed:', err);
    return false;
  }
};

