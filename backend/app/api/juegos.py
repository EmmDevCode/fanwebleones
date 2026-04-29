from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload # <-- IMPORTANTE: Agregar joinedload
from datetime import datetime
from app.db.session import get_db
from app.models.database import Juego
import requests

router = APIRouter()

@router.get("/widget-principal")
def obtener_juego_principal(db: Session = Depends(get_db)):
    # Usamos joinedload para "jalar" toda la info de los equipos asociados
    query_base = db.query(Juego).options(
        joinedload(Juego.local),
        joinedload(Juego.visitante)
    )

    # 1. ¿Hay algún juego marcado como en vivo?
    juego_en_vivo = query_base.filter(Juego.estado == "en vivo").first()
    
    if juego_en_vivo:
        # ⚾ LA REGLA DEL UMPIRE (BLINDADA)
        try:
            url_mlb = f"https://statsapi.mlb.com/api/v1.1/game/{juego_en_vivo.id_lmb}/feed/live"
            res = requests.get(url_mlb, timeout=5)
            
            if res.status_code == 200:
                api_status = res.json().get("gameData", {}).get("status", {}).get("abstractGameState", "")
                
                # Lista de todas las formas en las que la MLB da por terminado un juego
                estados_finales = ["Final", "Game Over", "Completed Early", "Postponed", "Cancelled"]
                
                if api_status in estados_finales:
                    juego_en_vivo.estado = "finalizado"
                    db.commit()
                    juego_en_vivo = None 
        except Exception:
            pass
            
    # Si después de la revisión del Umpire sigue en vivo, lo mandamos a React
    if juego_en_vivo:
        return {
            "tipo_vista": "en_vivo",
            "datos": juego_en_vivo
        }
        
    # 2. Próximo juego (Se ejecuta si no hay en vivo, o si el que estaba en vivo acaba de terminar)
    ahora = datetime.now()
    proximo_juego = query_base.filter(
        Juego.estado == "programado",
        Juego.fecha >= ahora.date()
    ).order_by(Juego.fecha.asc()).first()
    
    if proximo_juego:
        return {
            "tipo_vista": "proximo",
            "datos": proximo_juego
        }
        
    # 3. Nada (Se acabó la temporada)
    return {
        "tipo_vista": "sin_juegos",
        "datos": None
    }

@router.get("/posiciones")
def obtener_posiciones():
    try:
        url = "https://statsapi.mlb.com/api/v1/standings?leagueId=125&season=2026"
        response = requests.get(url, timeout=10)
        
        if response.status_code != 200:
            return {"error": "No se pudo conectar con la API de LMB"}
            
        data = response.json()
        
        norte = []
        sur = []
        
        # Diccionario de palabras clave para identificar zonas (INFALIBLE)
        equipos_sur = ["leones", "diablos", "tigres", "aguila", "águila", "piratas", "olmecas", "pericos", "guerreros", "bravos", "conspiradores"]
        equipos_norte = ["sultanes", "toros", "tecos", "algodoneros", "saraperos", "acereros", "rieleros", "charros", "dorados", "caliente", "durango"]
        
        # Usamos un 'Set' para evitar que la API nos mande equipos duplicados
        equipos_procesados = set()
        
        for record in data.get("records", []):
            for team in record.get("teamRecords", []):
                nombre_equipo = team.get("team", {}).get("name", "Desconocido")
                
                if nombre_equipo in equipos_procesados:
                    continue # Si ya lo guardamos, lo saltamos
                    
                nombre_lower = nombre_equipo.lower()
                
                equipo_obj = {
                    "nombre": nombre_equipo,
                    "victorias": team.get("wins", 0),
                    "derrotas": team.get("losses", 0),
                    "pct": team.get("winningPercentage", ".000"),
                    "jd": team.get("gamesBack", "-"),
                    "racha": team.get("streak", {}).get("streakCode", "-")
                }
                
                # Clasificador Inteligente
                es_sur = any(kw in nombre_lower for kw in equipos_sur)
                es_norte = any(kw in nombre_lower for kw in equipos_norte)
                
                if es_sur:
                    sur.append(equipo_obj)
                    equipos_procesados.add(nombre_equipo)
                elif es_norte:
                    norte.append(equipo_obj)
                    equipos_procesados.add(nombre_equipo)
                else:
                    # Por si hay una expansión de liga y no reconocemos el equipo
                    sur.append(equipo_obj)
                    equipos_procesados.add(nombre_equipo)

        # Ordenamos las listas del mejor al peor usando el Porcentaje de Victorias (PCT)
        def parse_pct(pct_str):
            try: return float(pct_str.replace('-', '0'))
            except: return 0.0

        sur = sorted(sur, key=lambda x: (parse_pct(x['pct']), x['victorias']), reverse=True)
        norte = sorted(norte, key=lambda x: (parse_pct(x['pct']), x['victorias']), reverse=True)

        return {
            "Zona Sur": sur,
            "Zona Norte": norte
        }

    except Exception as e:
        return {"error": f"Error interno: {str(e)}"}


# -----------------------------------------------------
# ENDPOINT 3: CALENDARIO COMPLETO
# -----------------------------------------------------
@router.get("/calendario")
def obtener_calendario(db: Session = Depends(get_db)):
    try:
        juegos = db.query(Juego).options(
            joinedload(Juego.local),
            joinedload(Juego.visitante),
            joinedload(Juego.estadio)
        ).order_by(Juego.fecha.asc(), Juego.hora.asc()).all()
        
        calendario_completo = []

        for juego in juegos:
            juego_dict = {
                "id_juego": juego.id_juego,
                "fecha": juego.fecha,
                "hora": juego.hora,
                "estado": juego.estado,
                "id_lmb": juego.id_lmb,
                "local": juego.local,
                "visitante": juego.visitante,
                "estadio": juego.estadio,
                "score_local": juego.score_local,
                "score_visitante": juego.score_visitante,
                "pitcher_visitante_probable": "Por anunciar",
                "pitcher_local_probable": "Por anunciar",
                "pitcher_ganador": None,
                "pitcher_perdedor": None
            }

            if juego.id_lmb:
                try:
                    url = f"https://statsapi.mlb.com/api/v1.1/game/{juego.id_lmb}/feed/live"
                    res = requests.get(url, timeout=2)
                    
                    if res.status_code == 200:
                        json_data = res.json()
                        game_data = json_data.get("gameData", {})
                        
                        if juego.estado != "finalizado":
                            # Pitchers Probables para juegos futuros
                            probables = game_data.get("probablePitchers", {})
                            juego_dict["pitcher_visitante_probable"] = probables.get("away", {}).get("fullName", "Por anunciar")
                            juego_dict["pitcher_local_probable"] = probables.get("home", {}).get("fullName", "Por anunciar")
                        else:
                            # 🏆 Decisiones para juegos terminados
                            decisions = json_data.get("liveData", {}).get("decisions", {})
                            juego_dict["pitcher_ganador"] = decisions.get("winner", {}).get("fullName", "N/A")
                            juego_dict["pitcher_perdedor"] = decisions.get("loser", {}).get("fullName", "N/A")
                except Exception:
                    pass

            calendario_completo.append(juego_dict)
        
        return calendario_completo
    except Exception as e:
        return {"error": f"Error interno: {str(e)}"}

@router.get("/{id_juego}/jugadas")
def obtener_jugadas_en_vivo(id_juego: int):
    # Endpoint en vivo de la MLB/LMB
    url = f"https://statsapi.mlb.com/api/v1.1/game/{id_juego}/feed/live?language=es"
    
    try:
        res = requests.get(url, timeout=10)
        data = res.json()
        
        # Extraemos todas las jugadas del partido
        all_plays = data.get("liveData", {}).get("plays", {}).get("allPlays", [])
        
        jugadas_limpias = []
        for play in all_plays:
            # Solo tomamos las jugadas que ya terminaron (ej. el turno al bat completo)
            if play.get("about", {}).get("isComplete"):
                batedor_id = play.get("matchup", {}).get("batter", {}).get("id")
                
                jugada = {
                    "id_jugada": play.get("about", {}).get("atBatIndex"),
                    "inning": f"{play.get('about', {}).get('inning')} {'Alta' if play.get('about', {}).get('isTopInning') else 'Baja'}",
                    "descripcion": play.get("result", {}).get("description", ""),
                    "evento": play.get("result", {}).get("event", ""), # Ej. "Strikeout", "Home Run"
                    "outs": play.get("count", {}).get("outs", 0),
                    "bolas": play.get("count", {}).get("balls", 0),
                    "strikes": play.get("count", {}).get("strikes", 0),
                    "marcador_away": play.get("result", {}).get("awayScore", 0),
                    "marcador_home": play.get("result", {}).get("homeScore", 0),
                    "foto_bateador": f"https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/{batedor_id}/headshot/67/current"
                }
                jugadas_limpias.append(jugada)
                
        # Las volteamos para que la más reciente salga hasta arriba
        jugadas_limpias.reverse()
        return {"jugadas": jugadas_limpias}
        
    except Exception as e:
        return {"error": str(e)}