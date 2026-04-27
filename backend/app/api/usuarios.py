from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.database import Usuario
from app.core.security import obtener_hash_password, verificar_password, crear_token_acceso
from pydantic import BaseModel, EmailStr

router = APIRouter()

# Esquemas de validación rápidos
class UsuarioRegistro(BaseModel):
    nombre: str
    email: EmailStr
    password: str

class UsuarioLogin(BaseModel):
    email: EmailStr
    password: str

@router.post("/registro")
def registrar_usuario(datos: UsuarioRegistro, db: Session = Depends(get_db)):
    # Verificar si el correo ya existe [cite: 131, 290]
    existe = db.query(Usuario).filter(Usuario.email == datos.email).first()
    if existe:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    
    nuevo_usuario = Usuario(
        nombre=datos.nombre,
        email=datos.email,
        password_hash=obtener_hash_password(datos.password) # Encriptamos
    )
    db.add(nuevo_usuario)
    db.commit()
    return {"message": "Usuario creado con éxito"}

@router.post("/login")
def login(datos: UsuarioLogin, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == datos.email).first()
    
    if not usuario or not verificar_password(datos.password, usuario.password_hash):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    
    # Si la contraseña es correcta, creamos su pasaporte (Token)
    token = crear_token_acceso(data={"sub": usuario.email, "id": usuario.id_usuario})
    
    # Devolvemos el token y los datos básicos
    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": {
            "nombre": usuario.nombre,
            "email": usuario.email
        }
    }