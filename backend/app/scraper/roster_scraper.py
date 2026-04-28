import sys
import os
import requests
import re
import json

# --- TRUCO DE RUTAS ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(BASE_DIR)

from app.db.session import SessionLocal
from app.models.database import Jugador

def mapear_posicion(pos):
    """Convierte las siglas en inglés a las posiciones de nuestro frontend"""
    pos = pos.upper()
    if pos == "P": return "Lanzador"
    if pos == "C": return "Receptor"
    if pos in ["1B", "2B", "3B", "SS", "IF"]: return "Infielder"
    if pos in ["LF", "CF", "RF", "OF"]: return "Outfielder"
    return "Desconocido"

def extraer_roster_leones():
    print("🦁 Infiltrándonos en la API de Next.js de la LMB...")
    url = "https://lmb.com.mx/equipos/leones/roster"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'RSC': '1' 
    }

    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.encoding = 'utf-8' 
        
        # El Regex Mágico
        patron = r'\{"uuid":\d+,"name":".*?"edad":\d+\}'
        jugadores_raw = re.findall(patron, response.text)

        if not jugadores_raw:
            print("❌ No se encontraron jugadores. Revisa si la estructura de la LMB cambió.")
            return

        db = SessionLocal()
        insertados = 0
        actualizados = 0

        nombres_activos_lmb = []

        for jugador_str in jugadores_raw:
            data = json.loads(jugador_str)
            
            # 1. ¡AQUÍ ESTÁ LA MAGIA! Extraemos el ID oficial de la MLB/LMB
            id_oficial = str(data.get("uuid", ""))
            
            raw_name = data.get("name", "")
            if " #" in raw_name:
                nombre, numero = raw_name.split(" #")
            else:
                nombre = raw_name
                numero = "S/N"

            posicion_limpia = mapear_posicion(data.get("pos", ""))
            
            nombres_activos_lmb.append(nombre)

            # Verificamos si ya existe
            existe = db.query(Jugador).filter(Jugador.nombre == nombre).first()

            if not existe:
                nuevo_jugador = Jugador(
                    nombre=nombre,
                    numero=numero,
                    posicion=posicion_limpia,
                    bateo=data.get("bat", ""),
                    picheo=data.get("pitch", ""),
                    foto_url=data.get("imageUrl", ""),
                    equipo="Leones de Yucatán",
                    id_lmb=id_oficial # <-- 2. Lo guardamos al crear
                )
                db.add(nuevo_jugador)
                insertados += 1
            else:
                # 3. Lo actualizamos si el jugador ya existía en tu base
                existe.foto_url = data.get("imageUrl", "")
                existe.numero = numero
                existe.id_lmb = id_oficial # <-- Aseguramos que los viejos también lo tengan
                actualizados += 1

        db.commit()
        print(f"✅ ¡Hack completado! {insertados} jugadores nuevos insertados y {actualizados} actualizados.")

        # Lógica de bajas (se queda intacta)
        jugadores_db = db.query(Jugador).filter(Jugador.equipo == "Leones de Yucatán").all()
        
        bajas = 0
        for j_db in jugadores_db:
            if j_db.nombre not in nombres_activos_lmb:
                if j_db.activo:
                    j_db.activo = False
                    bajas += 1
            else:
                j_db.activo = True

        db.commit()
        print(f"✅ Sincronización completa: {insertados} insertados, {actualizados} actualizados, {bajas} dados de baja.")

    except Exception as e:
        print(f"❌ Error durante el scraping: {e}")
    finally:
        if 'db' in locals():
            db.close()

if __name__ == "__main__":
    extraer_roster_leones()