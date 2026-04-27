from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

# Configuraciones de JWT
# En producción, esta SECRET_KEY debe ser una cadena muy larga y aleatoria guardada en tu .env
SECRET_KEY = os.getenv("SECRET_KEY", "super_secreto_leones_app_2026") 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # El token dura 7 días

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def obtener_hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verificar_password(password_plano: str, password_hasheado: str) -> bool:
    return pwd_context.verify(password_plano, password_hasheado)

def crear_token_acceso(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    # Creamos el JWT firmado
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt