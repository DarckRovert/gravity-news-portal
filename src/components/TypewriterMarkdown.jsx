import { useState, useEffect, useMemo } from 'react';
import { playSound } from '../utils/audio';

// Advanced parser to render markdown headers, paragraphs, bold, italic, and lists
function parseMarkdown(text) {
  if (!text) return '';
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    
    const parseInline = (str) => {
      let parsed = str.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');
      return parsed;
    };

    if (trimmed.startsWith('### ')) {
      return <h3 key={idx} className="markdown-h3" dangerouslySetInnerHTML={{ __html: parseInline(trimmed.replace('### ', '')) }} />;
    }
    if (trimmed.startsWith('## ')) {
      return <h2 key={idx} className="markdown-h2" dangerouslySetInnerHTML={{ __html: parseInline(trimmed.replace('## ', '')) }} />;
    }
    if (trimmed.startsWith('> ')) {
      return <blockquote key={idx} className="markdown-quote" dangerouslySetInnerHTML={{ __html: parseInline(trimmed.replace('> ', '')) }} />;
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return <div key={idx} className="markdown-li" dangerouslySetInnerHTML={{ __html: '<span style="color:var(--accent-secondary); margin-right:8px;">•</span>' + parseInline(trimmed.substring(2)) }} />;
    }
    if (trimmed.length > 0) {
      return <p key={idx} className="markdown-p" dangerouslySetInnerHTML={{ __html: parseInline(trimmed) }} />;
    }
    return <div key={idx} className="markdown-spacer" />;
  });
}

// Typewriter Component for the Article Modal
export default function TypewriterMarkdown({ text, animated = true }) {
  const lines = useMemo(() => text ? text.split('\n') : [], [text]);
  const [visibleLines, setVisibleLines] = useState(animated ? 0 : lines.length);

  useEffect(() => {
    if (!animated) {
      setTimeout(() => setVisibleLines(lines.length), 0);
      return;
    }
    if (visibleLines < lines.length) {
      const delay = lines[visibleLines].trim().length === 0 ? 10 : 40; // fast skip empty lines
      const t = setTimeout(() => {
        setVisibleLines(v => v + 1);
        if (lines[visibleLines].trim().length > 0 && visibleLines % 2 === 0) {
          playSound('decrypt');
        }
      }, delay);
      return () => clearTimeout(t);
    }
  }, [visibleLines, lines, animated]);

  // Update visibleLines if animated prop changes on the fly
  useEffect(() => {
    if (!animated) {
      setTimeout(() => setVisibleLines(lines.length), 0);
    }
  }, [animated, lines.length]);

  const visibleText = animated ? lines.slice(0, visibleLines).join('\n') : text;
  
  return (
    <div className={`typewriter-container ${!animated ? 'reading-mode' : ''}`}>
      {parseMarkdown(visibleText)}
      {animated && visibleLines < lines.length && <span className="typewriter-cursor">_</span>}
    </div>
  );
}
