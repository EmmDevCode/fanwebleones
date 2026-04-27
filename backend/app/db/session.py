import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Cargamos las variables de entorno desde el archivo .env
load_dotenv()

# Obtenemos la URL de conexión. 
# Si no encuentra el .env, usa una cadena por defecto (útil para desarrollo rápido)
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:admin123@localhost:5432/fanwebleones"
)

# Creamos el motor de la base de datos
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Configuramos la fábrica de sesiones
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Esta es la dependencia que usaremos en nuestros endpoints (ej. Depends(get_db))
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()