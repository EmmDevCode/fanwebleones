# backend/app/api/noticias.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.database import Noticia

router = APIRouter()

@router.get("/")
def listar_noticias(db: Session = Depends(get_db)):
    # Traemos las últimas 10 noticias, filtrando estrictamente por equipo
    return db.query(Noticia).filter(Noticia.equipo == "Leones de Yucatán")\
             .order_by(Noticia.fecha_publicacion.desc())\
             .limit(10).all()