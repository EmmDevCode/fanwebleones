import sys
import os
import requests
import json
import re
from datetime import date

# --- TRUCO DE RUTAS ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(BASE_DIR)

from app.db.session import SessionLocal
from app.models.database import Juego

def buscar_id_recursivo(data):
    """El Perro Sabueso: Navega por cualquier estructura JSON"""
    if isinstance(data, dict):
        # Si este bloque tiene gamePk, revisamos si es de Yucatán
        if 'gamePk' in data:
            texto_bloque = json.dumps(data).lower()
            if 'yucat' in texto_bloque or 'leones' in texto_bloque:
                return data['gamePk']
        
        # Seguimos escarbando
        for key, value in data.items():
            resultado = buscar_id_recursivo(value)
            if resultado: return resultado
                
    elif isinstance(data, list):
        for item in data:
            resultado = buscar_id_recursivo(item)
            if resultado: return resultado
                
    return None

def buscar_id_juego_de_hoy():
    print("🌅 Iniciando Buscador Matutino de la LMB...")
    db = SessionLocal()
    
    try:
        hoy = date.today()
        juego_hoy = db.query(Juego).filter(
            Juego.estado == "programado",
            Juego.fecha == hoy
        ).first()

        if not juego_hoy:
            print("📭 No hay juego de los Leones programado para hoy en la BD.")
            return
            
        try:
            nombre_rival = juego_hoy.visitante.nombre
        except:
            nombre_rival = "el rival"
            
        print(f"🦁 Hoy jugamos contra {nombre_rival}. Buscando el ID oficial...")

        # 1. Modo Infiltración: Usamos el header RSC para pedir datos en lugar de visuales
        url_scores = "https://lmb.com.mx/" 
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'RSC': '1' 
        }

        response = requests.get(url_scores, headers=headers, timeout=15)
        response.encoding = 'utf-8'
        
        id_encontrado = None

        # 2. Parseo de Chunks RSC (Next.js App Router)
        # El servidor manda líneas raras como '0:{"datos": ...}' o '2:["array"]'
        lineas = response.text.split('\n')
        for linea in lineas:
            # Regex para ignorar el prefijo '0:', '1:', 'a:' y quedarnos con el JSON
            match = re.match(r'^[a-zA-Z0-9]+:(.*)$', linea)
            if match:
                json_str = match.group(1)
                try:
                    # Si es un JSON válido, le soltamos al sabueso
                    data = json.loads(json_str)
                    resultado = buscar_id_recursivo(data)
                    if resultado:
                        id_encontrado = resultado
                        break
                except json.JSONDecodeError:
                    continue

        # 3. Plan B de emergencia (Fuerza bruta sobre el texto)
        if not id_encontrado:
            partes = response.text.split('gamePk":')
            for i in range(1, len(partes)):
                # Revisamos los siguientes 300 caracteres después de cada gamePk
                pedazo = partes[i][:300].lower() 
                if "leones" in pedazo or "yucat" in pedazo:
                    id_match = re.search(r'^(\d+)', partes[i])
                    if id_match:
                        id_encontrado = id_match.group(1)
                        break

        # 4. Guardamos la victoria
        if id_encontrado:
            juego_hoy.id_lmb = str(id_encontrado)
            db.commit()
            print(f"✅ ¡Éxito! El juego de hoy tiene el ID de LMB: {id_encontrado}")
        else:
            print("⚠️ No se pudo encontrar el ID del juego. Es posible que LMB aún no haya subido la cartelera de hoy.")

    except Exception as e:
        print(f"❌ Error en el buscador matutino: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    buscar_id_juego_de_hoy()