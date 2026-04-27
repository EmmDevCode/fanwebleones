# backend/app/scraper/noticias_scraper.py
import sys
import os
import requests
from bs4 import BeautifulSoup
from datetime import datetime

# --- TRUCO DE RUTAS ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(BASE_DIR)

from app.db.session import SessionLocal
from app.models.database import Noticia

def scrapear_leones_news():
    print("🦁 Buscando noticias melenudas...")
    # Usamos la sección de noticias oficial
    url = "https://lmb.com.mx/noticias" 
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        db = SessionLocal()
        
        # Este selector depende de la web, pero suele ser una tarjeta o item
        articulos = soup.find_all('article', class_='post') # Clase ejemplo
        insertadas = 0

        for art in articulos:
            titulo = art.find('h2').text.strip()
            
            # FILTRO CRÍTICO: Si por alguna razón la web mezcla noticias de la liga,
            # nosotros solo guardamos lo que hable de Yucatán o Leones.
            if "Leones" in titulo or "Yucatán" in titulo:
                existe = db.query(Noticia).filter(Noticia.titulo == titulo).first()
                
                if not existe:
                    # Intentamos sacar la imagen y el link
                    link = art.find('a')['href']
                    img_tag = art.find('img')
                    img_url = img_tag['src'] if img_tag else "https://via.placeholder.com/400x200?text=Leones+News"

                    nueva = Noticia(
                        titulo=titulo,
                        resumen=art.find('p').text.strip()[:150] + "...",
                        url_imagen=img_url,
                        url_noticia=link,
                        equipo="Leones de Yucatán"
                    )
                    db.add(nueva)
                    insertadas += 1

        db.commit()
        print(f"¡Éxito! {insertadas} noticias nuevas añadidas.")
    except Exception as e:
        print(f"Error en el scraper de noticias: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    scrapear_leones_news()