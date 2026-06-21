import os
import re
import json
import shutil

PORTAL_DIR = os.path.dirname(os.path.abspath(__file__))
BRIDGE_DIR = "F:/Gravity_AI_bridge"

SOURCE_DIRS = [
    {"path": f"{BRIDGE_DIR}/ensayos_generados", "category": "Ensayo"},
    {"path": f"{BRIDGE_DIR}/ficcion_generada", "category": "Ficción"},
    {"path": f"{BRIDGE_DIR}/libros_generados", "category": "Libro"}
]

PUBLIC_BOOKS_DIR = os.path.join(PORTAL_DIR, 'public', 'books')
DATA_DIR = os.path.join(PORTAL_DIR, 'src', 'data')
BOOKS_JSON_PATH = os.path.join(DATA_DIR, 'books.json')

os.makedirs(PUBLIC_BOOKS_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def extract_description(book_dir):
    escaleta_path = os.path.join(book_dir, '2_escaleta.json')
    if os.path.exists(escaleta_path):
        try:
            with open(escaleta_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                if isinstance(data, list) and len(data) > 0 and 'resumen_eventos' in data[0]:
                    return data[0]['resumen_eventos']
        except Exception:
            pass
            
    sinopsis_path = os.path.join(book_dir, '1_sinopsis.md')
    if os.path.exists(sinopsis_path):
        try:
            with open(sinopsis_path, 'r', encoding='utf-8') as f:
                content = f.read()
                paragraphs = [p.strip() for p in content.split('\n') if len(p.strip()) > 20 and not p.startswith('#')]
                if paragraphs:
                    return paragraphs[0]
        except Exception:
            pass
            
    return "Una obra generada por Gravity AI, explorando conceptos profundos en el límite del conocimiento."

books_catalog = []

for source in SOURCE_DIRS:
    src_path = source['path']
    if not os.path.exists(src_path):
        print(f"[Warning] Directorio no encontrado: {src_path}")
        continue
        
    for item in os.listdir(src_path):
        book_dir_path = os.path.join(src_path, item)
        if not os.path.isdir(book_dir_path):
            continue
            
        html_files = [f for f in os.listdir(book_dir_path) if f.endswith('.html')]
        if html_files:
            html_file = html_files[0]
            book_id = slugify(item)
            title = item.replace('_', ' ')
            description = extract_description(book_dir_path)
            
            src_html_path = os.path.join(book_dir_path, html_file)
            dest_html_path = os.path.join(PUBLIC_BOOKS_DIR, f"{book_id}.html")
            shutil.copy2(src_html_path, dest_html_path)
            
            books_catalog.append({
                "id": book_id,
                "title": title,
                "author": "DarckRovert (Gravity AI)",
                "category": source['category'],
                "description": description,
                "htmlUrl": f"/books/{book_id}.html",
                "cover": f"https://picsum.photos/seed/{book_id}/800/600"
            })
            print(f"[Synced] {title}")

with open(BOOKS_JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(books_catalog, f, indent=2, ensure_ascii=False)
    
print(f"\n¡Sincronización completada! {len(books_catalog)} libros procesados y listos en books.json")
