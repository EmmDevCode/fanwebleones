from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.database import Jugador

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