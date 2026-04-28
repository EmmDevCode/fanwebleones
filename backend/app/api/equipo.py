from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.database import Jugador
import requests

router = APIRouter()

def jugador_to_dict(j):
    return {
        "id_jugador": j.id_jugador,  # ¡Corregido!
        "nombre": j.nombre,
        "numero": j.numero,
        "posicion": j.posicion,
        "bateo": j.bateo,          # Añadimos la data nueva
        "picheo": j.picheo,        # Añadimos la data nueva
        "foto_url": j.foto_url     # Añadimos la foto
    }

@router.get("/roster")
def get_roster(db: Session = Depends(get_db)):
    jugadores = db.query(Jugador).filter(Jugador.equipo == "Leones de Yucatán", Jugador.activo == True).all()

    return {
        "lanzadores": [jugador_to_dict(j) for j in jugadores if j.posicion == "Lanzador"],
        "infielders": [jugador_to_dict(j) for j in jugadores if j.posicion == "Infielder"],
        "outfielders": [jugador_to_dict(j) for j in jugadores if j.posicion == "Outfielder"],
        "receptores": [jugador_to_dict(j) for j in jugadores if j.posicion == "Receptor"]
    }

@router.get("/jugadores/{id_jugador}/stats")
def obtener_estadisticas_jugador(id_jugador: int, db: Session = Depends(get_db)):
    jugador = db.query(Jugador).filter(Jugador.id_jugador == id_jugador).first()
    
    if not jugador or not jugador.id_lmb:
        raise HTTPException(status_code=404, detail="Jugador no encontrado o sin ID oficial")

    grupo = "pitching" if jugador.posicion == "Lanzador" else "hitting"
    
    # 🔥 EL ATAJO SECRETO DE LA LMB
    # En lugar de traer todo el historial (yearByYear), pedimos directamente la temporada actual ("season")
    # Y le ponemos el candado: leagueId=125 (Liga Mexicana de Béisbol).
    # Así la MLB no nos mandará basura de otras ligas.
    url = f"https://statsapi.mlb.com/api/v1/people/{jugador.id_lmb}/stats?stats=season&group={grupo}&leagueId=125"
    
    try:
        res = requests.get(url, timeout=10)
        data = res.json()
        
        season_stats = {}
        stats_list = data.get("stats", [])
        
        if stats_list:
            splits = stats_list[0].get("splits", [])
            if splits:
                # Como la API ya filtró por la LMB desde la URL, el resultado que llega 
                # es exactamente el que ves en la página web oficial.
                season_stats = splits[0].get("stat", {})
        
        return {
            "perfil": jugador,
            "stats_temporada": season_stats
        }
    except Exception as e:
        return {"error": f"No se pudieron obtener stats: {str(e)}", "perfil": jugador}

# -----------------------------------------------------
# ENDPOINT: LÍDERES DEL EQUIPO
# -----------------------------------------------------
@router.get("/lideres")
def obtener_lideres_equipo(db: Session = Depends(get_db)):
    # 1. Traemos a todos los jugadores activos que tengan su ID mágico
    jugadores = db.query(Jugador).filter(Jugador.id_lmb.isnot(None), Jugador.activo == True).all()
    
    if not jugadores:
        return {"error": "No hay jugadores suficientes"}

    # 2. Unimos todos los IDs separados por coma (ej. "491624,123456,789012")
    ids_str = ",".join([str(j.id_lmb) for j in jugadores])
    
    # 3. MEGA-CONSULTA: Pedimos las stats de todos de un solo golpe, filtrados por LMB (125)
    url = f"https://statsapi.mlb.com/api/v1/people?personIds={ids_str}&hydrate=stats(group=[hitting,pitching],type=[season],leagueId=125)"
    
    try:
        res = requests.get(url, timeout=15)
        data = res.json()
        
        bateadores = []
        pitchers = []

        # Funciones seguras para evitar errores si la API manda campos vacíos ("-.--")
        def s_float(val, default=0.0):
            try: return float(val)
            except: return default
            
        def s_int(val, default=0):
            try: return int(val)
            except: return default

        # 4. Clasificamos a los jugadores
        for person in data.get("people", []):
            person_id = str(person.get("id"))
            db_player = next((j for j in jugadores if j.id_lmb == person_id), None)
            
            if not db_player: continue

            stats_list = person.get("stats", [])
            for stat_group in stats_list:
                group_name = stat_group.get("group", {}).get("displayName")
                splits = stat_group.get("splits", [])
                
                if not splits: continue
                stat_values = splits[0].get("stat", {})

                datos_limpios = {
                    "id_jugador": db_player.id_jugador,
                    "nombre": db_player.nombre,
                    "foto": db_player.foto_url or "https://via.placeholder.com/150",
                    "numero": db_player.numero,
                    "stats": stat_values            
                }

                # Filtro de calidad: Solo tomamos en cuenta a los que realmente están jugando
                if group_name == "hitting" and s_int(stat_values.get("atBats")) >= 10:
                    bateadores.append(datos_limpios)
                elif group_name == "pitching" and s_float(stat_values.get("inningsPitched")) >= 5:
                    pitchers.append(datos_limpios)

        # 5. EL COMBATE: Encontramos al Rey de cada categoría
        if not bateadores or not pitchers:
            return {"error": "Faltan datos de la temporada actual"}

        lideres = {
            "bateo": {
                "avg": max(bateadores, key=lambda x: s_float(x["stats"].get("avg"))),
                "hr": max(bateadores, key=lambda x: s_int(x["stats"].get("homeRuns"))),
                "rbi": max(bateadores, key=lambda x: s_int(x["stats"].get("rbi"))),
                "sb": max(bateadores, key=lambda x: s_int(x["stats"].get("stolenBases"))),
            },
            "pitcheo": {
                "w": max(pitchers, key=lambda x: s_int(x["stats"].get("wins"))),
                "so": max(pitchers, key=lambda x: s_int(x["stats"].get("strikeOuts"))),
                "sv": max(pitchers, key=lambda x: s_int(x["stats"].get("saves"))),
                # Para la efectividad (ERA), buscamos el MENOR valor
                "era": min(pitchers, key=lambda x: s_float(x["stats"].get("era", "99.9"))),
            }
        }
        return lideres

    except Exception as e:
        return {"error": f"Error interno: {str(e)}"}