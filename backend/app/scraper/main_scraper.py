import time
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from db_sync import SessionLocal
import sys
import os

from app.core.firebase_utils import enviar_notificacion_carrera

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
from app.models.database import Juego, EventoJuego

# URL hipotética de los marcadores en vivo de la LMB
# Nota: Tendremos que ajustar los selectores CSS cuando analicemos el DOM real de la LMB
LMB_URL_SCORES = "https://lmb.com.mx/juegos/846696"

def obtener_html_lmb():
    """Hace la petición a la página de la LMB simulando ser un navegador."""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    try:
        response = requests.get(LMB_URL_SCORES, headers=headers, timeout=10)
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"[{datetime.now()}] Error de conexión: {e}")
        return None

def extraer_datos_juego(html):
    """Analiza el HTML y extrae la información del juego de los Leones."""
    soup = BeautifulSoup(html, 'html.parser')
    
    # IMPORTANTE: Estos selectores (.team-score, .inning, etc.) son ejemplos. 
    # Deberás inspeccionar la página de la LMB para colocar las clases exactas.
    try:
        # Aquí buscaríamos el contenedor específico del juego de Yucatán
        # juego_contenedor = soup.find('div', {'data-team': 'leones-de-yucatan'})
        
        datos_simulados = {
            "estado": "en_vivo",
            "score_local": 4,          # Extraído de: juego_contenedor.find(class_='local-score').text
            "score_visitante": 2,      # Extraído de: juego_contenedor.find(class_='away-score').text
            "inning_actual": "Baja 6", # Extraído de: juego_contenedor.find(class_='inning-text').text
            "outs": 2,                 # Extraído contando iconos o texto
            "bolas": 3,
            "strikes": 2,
            "corredor_1b": True,
            "corredor_2b": False,
            "corredor_3b": True,
            "pitcher_actual": "C. Valdez",
            "bateador_actual": "J. Aguilar",
            # Ejemplo de un evento play-by-play recién detectado
            "ultimo_evento": {
                "tipo": "hit",
                "jugador": "J. Aguilar",
                "descripcion": "J. Aguilar batea sencillo al jardín central."
            }
        }
        return datos_simulados
    except Exception as e:
        print(f"[{datetime.now()}] Error parseando HTML: {e}")
        return None

def actualizar_bd(datos_extraidos):
    db = SessionLocal()
    try:
        juego_actual = db.query(Juego).filter(Juego.id_juego == 1).first()
        if not juego_actual:
            return

        # --- LÓGICA DE DETECCIÓN DE CARRERAS ---
        # Verificamos si el marcador extraído es mayor al que tenemos en la base de datos
        hubo_carrera = False
        if (datos_extraidos["score_local"] > juego_actual.score_local) or \
           (datos_extraidos["score_visitante"] > juego_actual.score_visitante):
            hubo_carrera = True

        # Actualizamos la base de datos con los nuevos datos
        juego_actual.estado = datos_extraidos["estado"]
        juego_actual.score_local = datos_extraidos["score_local"]
        juego_actual.score_visitante = datos_extraidos["score_visitante"]
        juego_actual.inning_actual = datos_extraidos["inning_actual"]
        # ... (resto de tus actualizaciones de outs, bolas, strikes, etc.)

        db.commit()

        # --- DISPARO DE LA NOTIFICACIÓN ---
        # Si hubo carrera, disparamos la alerta de Firebase DESPUÉS de guardar en BD
        if hubo_carrera:
            # Asumimos que podemos obtener el nombre del visitante de la relación en BD
            # Por simplicidad, aquí lo pasamos directo si lo tuvieras en el dict
            enviar_notificacion_carrera(
                score_leones=juego_actual.score_local,
                score_visitante=juego_actual.score_visitante,
                equipo_visitante="Visitante", # Aquí pondrías juego_actual.visitante.slug
                inning=juego_actual.inning_actual
            )

    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
    finally:
        db.close()

def iniciar_bot():
    print("Iniciando Scraper Fan App Leones...")
    while True:
        html = obtener_html_lmb()
        if html:
            datos = extraer_datos_juego(html)
            if datos:
                actualizar_bd(datos)
        
        # Pausa de 30 segundos antes de volver a consultar para no saturar el servidor destino
        time.sleep(30) 



if __name__ == "__main__":
    iniciar_bot()