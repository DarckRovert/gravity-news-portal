import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIRS = [
  { path: 'F:/Gravity_AI_bridge/ensayos_generados', category: 'Ensayo' },
  { path: 'F:/Gravity_AI_bridge/ficcion_generada', category: 'Ficción' },
  { path: 'F:/Gravity_AI_bridge/libros_generados', category: 'Libro' }
];

const PUBLIC_BOOKS_DIR = path.join(__dirname, 'public', 'books');
const DATA_DIR = path.join(__dirname, 'src', 'data');
const BOOKS_JSON_PATH = path.join(DATA_DIR, 'books.json');

// Ensure directories exist
if (!fs.existsSync(PUBLIC_BOOKS_DIR)) fs.mkdirSync(PUBLIC_BOOKS_DIR, { recursive: true });
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function extractDescription(bookDir) {
  // Intentar leer 2_escaleta.json primero
  const escaletaPath = path.join(bookDir, '2_escaleta.json');
  if (fs.existsSync(escaletaPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(escaletaPath, 'utf8'));
      if (Array.isArray(data) && data.length > 0 && data[0].resumen_eventos) {
        return data[0].resumen_eventos;
      }
    } catch { /* ignore */ }
  }
  
  // Intentar leer 1_sinopsis.md
  const sinopsisPath = path.join(bookDir, '1_sinopsis.md');
  if (fs.existsSync(sinopsisPath)) {
    try {
      const content = fs.readFileSync(sinopsisPath, 'utf8');
      // Obtener el primer parrafo real
      const paragraphs = content.split('\n').filter(p => p.trim().length > 20 && !p.startsWith('#'));
      if (paragraphs.length > 0) return paragraphs[0].trim();
    } catch { /* ignore */ }
  }

  return "Una obra generada por Gravity AI, explorando conceptos profundos en el límite del conocimiento.";
}

const booksCatalog = [];

SOURCE_DIRS.forEach(source => {
  if (!fs.existsSync(source.path)) {
    console.log(`[Warning] Directorio no encontrado: ${source.path}`);
    return;
  }

  const bookDirs = fs.readdirSync(source.path, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  bookDirs.forEach(bookDirName => {
    const bookPath = path.join(source.path, bookDirName);
    
    // Buscar archivo HTML (suele tener el mismo nombre que la carpeta u otro similar)
    const files = fs.readdirSync(bookPath);
    const htmlFile = files.find(f => f.endsWith('.html'));
    
    if (htmlFile) {
      const bookId = slugify(bookDirName);
      const title = bookDirName.replace(/_/g, ' ');
      const description = extractDescription(bookPath);
      
      // Copiar el HTML a public/books
      const srcHtmlPath = path.join(bookPath, htmlFile);
      const destHtmlPath = path.join(PUBLIC_BOOKS_DIR, `${bookId}.html`);
      fs.copyFileSync(srcHtmlPath, destHtmlPath);

      booksCatalog.push({
        id: bookId,
        title: title,
        author: 'DarckRovert (Gravity AI)',
        category: source.category,
        description: description,
        htmlUrl: `/books/${bookId}.html`,
        // Portada generica premium si no hay (se pueden generar luego)
        cover: `https://images.unsplash.com/photo-1618172193763-c511deb635ce?q=80&w=600&auto=format&fit=crop&sig=${bookId.length}`
      });
      
      console.log(`[Synced] ${title}`);
    }
  });
});

fs.writeFileSync(BOOKS_JSON_PATH, JSON.stringify(booksCatalog, null, 2), 'utf8');
console.log(`\n¡Sincronización completada! ${booksCatalog.length} libros procesados y listos en books.json`);
