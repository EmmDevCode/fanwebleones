import sys
import os
import requests
from datetime import datetime

# --- TRUCO DE RUTAS ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(BASE_DIR)

from app.db.session import SessionLocal
from app.models.database import Juego

def actualizar_pizarra_en_vivo():
    db = SessionLocal()
    try:
        # 1. Buscamos el juego de hoy que ya tiene su ID
        juego = db.query(Juego).filter(Juego.estado == "en vivo").first()

        if not juego:
            # Buscamos cualquier juego programado para la fecha de hoy.
            # (Quitamos el validador estricto de hora para no pelear con la zona horaria UTC del VPS)
            ahora = datetime.now()
            juego = db.query(Juego).filter(
                Juego.id_lmb.isnot(None),
                Juego.estado == "programado",
                Juego.fecha == ahora.date()
            ).first()

        # 🛡️ EL ESCUDO: Si no hay juego programado ni en vivo hoy, apagamos
        if not juego:
            return

        print(f"⚾ Conectando a la Matrix de la MLB (Juego: {juego.id_lmb})...")
        
        # 2. La API de Grandes Ligas
        url_mlb = f"https://statsapi.mlb.com/api/v1.1/game/{juego.id_lmb}/feed/live"
        response = requests.get(url_mlb, timeout=10)
        
        if response.status_code != 200:
            print(f"❌ Error de la API: {response.status_code}")
            return
            
        data = response.json()

        # --- LA SOLUCIÓN: VERIFICAR EL ESTADO REAL EN LA MLB ---
        estado_abstracto = data.get('gameData', {}).get('status', {}).get('abstractGameState', '')
        estado_detallado = data.get('gameData', {}).get('status', {}).get('detailedState', '')

        # Si el juego es apenas un "Preview", "Scheduled", "Pre-Game" o "Warmup":
        if estado_abstracto == 'Preview' or estado_detallado in ['Scheduled', 'Pre-Game', 'Warmup']:
            print(f"⏳ El juego sigue en {estado_detallado}. Esperando a que inicie...")
            
            # Auto-sanación: Si se nos coló el "en vivo", lo regresamos a programado
            if juego.estado != "programado":
                juego.estado = "programado"
                db.commit()
            return

        # Si el juego ya terminó
        if estado_abstracto == 'Final':
            juego.estado = "finalizado"
        else:
            # Si no es Preview ni Final, entonces ¡Playball!
            juego.estado = "en vivo"

        # 3. Extraemos el 'Linescore' (El corazón del marcador)
        live_data = data.get('liveData', {})
        linescore = live_data.get('linescore', {})
        
        if not linescore:
            return
        
        raw_half = linescore.get('inningHalf', 'alta').lower()
        juego.mitad_inning = "alta" if raw_half in ['top', 'alta'] else "baja"
        
        # Inning
        juego.inning_num = linescore.get('currentInning', 1)
        juego.inning_actual = f"{juego.mitad_inning.capitalize()} {juego.inning_num}"
        
        # Cuenta
        juego.outs = linescore.get('outs', 0)
        juego.bolas = linescore.get('balls', 0)
        juego.strikes = linescore.get('strikes', 0)

        # Marcador (Carreras)
        teams = linescore.get('teams', {})
        juego.score_local = teams.get('home', {}).get('runs', 0)
        juego.score_visitante = teams.get('away', {}).get('runs', 0)

        # Corredores en base
        offense = linescore.get('offense', {})
        juego.corredor_1b = 'first' in offense
        juego.corredor_2b = 'second' in offense
        juego.corredor_3b = 'third' in offense

        # Quién está bateando/lanzando
        try:
            juego.bateador_actual = live_data['plays']['currentPlay']['matchup']['batter']['fullName']
            juego.pitcher_actual = live_data['plays']['currentPlay']['matchup']['pitcher']['fullName']
        except KeyError:
            pass 

        db.commit()
        
        print(f"✅ Pizarra Sincronizada | Estado actual: {juego.estado}")

    except Exception as e:
        print(f"❌ Error crítico en el scraper: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    actualizar_pizarra_en_vivo()