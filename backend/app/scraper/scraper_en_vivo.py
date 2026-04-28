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
            ahora = datetime.now()
            juego = db.query(Juego).filter(
                Juego.id_lmb.isnot(None),
                Juego.estado == "programado",
                Juego.fecha == ahora.date(), 
                Juego.hora <= ahora.time()   
            ).first()

        # 🛡️ EL ESCUDO: Si después de buscar no encontró nada, apagamos en silencio
        if not juego:
            # Puedes dejar un print("Zzz... Esperando la hora del juego") si quieres, o solo un return
            return

        # Si llegamos aquí, es porque SÍ hay un juego válido
        print(f"⚾ Conectando a la Matrix de la MLB (Juego: {juego.id_lmb})...")
        
        # 2. La API secreta y oficial de Grandes Ligas
        url_mlb = f"https://statsapi.mlb.com/api/v1.1/game/{juego.id_lmb}/feed/live"
        
        # Esta API es pública, no requiere headers raros ni tokens
        response = requests.get(url_mlb, timeout=10)
        
        if response.status_code != 200:
            print(f"❌ Error de la API: {response.status_code}")
            return
            
        data = response.json()

        # 3. Extraemos el 'Linescore' (El corazón del marcador)
        live_data = data.get('liveData', {})
        linescore = live_data.get('linescore', {})
        
        if not linescore:
            print("⏳ El juego tiene ID, pero la MLB aún no abre la pizarra.")
            return

        # 4. Actualizamos TODA nuestra base de datos con los datos en vivo
        juego.estado = "en vivo"
        
        raw_half = linescore.get('inningHalf', 'alta').lower()
        juego.mitad_inning = "alta" if raw_half in ['top', 'alta'] else "baja"
        
        # Inning
        juego.inning_num = linescore.get('currentInning', 1)
        juego.mitad_inning = linescore.get('inningHalf', 'alta').lower()
        juego.inning_actual = f"{juego.mitad_inning.capitalize()} {juego.inning_num}"
        
        # Cuenta
        juego.outs = linescore.get('outs', 0)
        juego.bolas = linescore.get('balls', 0)
        juego.strikes = linescore.get('strikes', 0)

        # Marcador (Carreras)
        teams = linescore.get('teams', {})
        juego.score_local = teams.get('home', {}).get('runs', 0)
        juego.score_visitante = teams.get('away', {}).get('runs', 0)

        # Corredores en base (El diamante)
        offense = linescore.get('offense', {})
        juego.corredor_1b = 'first' in offense
        juego.corredor_2b = 'second' in offense
        juego.corredor_3b = 'third' in offense

        # Quién está bateando/lanzando (Opcional, pero le da un toque pro)
        try:
            juego.bateador_actual = live_data['plays']['currentPlay']['matchup']['batter']['fullName']
            juego.pitcher_actual = live_data['plays']['currentPlay']['matchup']['pitcher']['fullName']
        except KeyError:
            pass # Si es entre innings, puede que no haya bateador

        db.commit()
        
        # Mensaje de éxito estilo consola de narrador
        print("✅ ¡Pizarra Sincronizada!")
        print(f"   Marcador: YUC {juego.score_local} - {juego.score_visitante} VIS")
        print(f"   Inning: {juego.inning_actual} | Outs: {juego.outs} | Cuenta: {juego.bolas}-{juego.strikes}")
        print(f"   Bases: 1B[{'X' if juego.corredor_1b else ' '}] 2B[{'X' if juego.corredor_2b else ' '}] 3B[{'X' if juego.corredor_3b else ' '}]")

    except Exception as e:
        print(f"❌ Error crítico en el scraper en vivo: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    actualizar_pizarra_en_vivo()