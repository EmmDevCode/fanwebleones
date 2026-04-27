import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Agregamos la ruta del backend al sistema para poder importar nuestros modelos
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
from app.models.database import Juego, EventoJuego, Equipo

# Reemplaza esto con tus credenciales reales o usa un archivo .env
DB_URL = os.environ.get("DATABASE_URL", "postgresql://usuario:password@localhost:5432/leones_db")

engine = create_engine(DB_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()