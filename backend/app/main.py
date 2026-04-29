from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from apscheduler.schedulers.background import BackgroundScheduler

# Rutas de tu API
from app.api import juegos 
from app.api import usuarios
from app.api import noticias
from app.api import equipo

# Base de datos
from app.db.session import engine
from app.models.database import Base

# Scrapers
from app.scraper.roster_scraper import extraer_roster_leones
from app.scraper.buscador_juegos import buscar_id_juego_de_hoy
from app.scraper.scraper_en_vivo import actualizar_pizarra_en_vivo

#Base.metadata.create_all(bind=engine)

# ==========================================
# EL GRAN MOTOR CENTRAL DE TAREAS (Lifespan)
# ==========================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🤖 Encendiendo el motor central de Scrapers Automáticos...")
    scheduler = BackgroundScheduler()
    
    # --- TAREA 1: El Roster ---
    # 🔥 CAMBIO APLICADO: Actualiza el roster todos los días a las 17:00 (5:00 PM)
    scheduler.add_job(extraer_roster_leones, 'cron', hour=17, minute=0) 
    
    # --- TAREA 2: El Buscador Matutino ---
    # Todos los días a las 9:00 AM busca contra quién jugamos y saca el ID
    scheduler.add_job(buscar_id_juego_de_hoy, 'cron', hour=9, minute=0)
    
    # --- TAREA 3: El Marcador en Vivo ---
    # Corre cada 10 segundos (internamente solo se ejecuta si hay juego activo)
    scheduler.add_job(actualizar_pizarra_en_vivo, 'interval', seconds=10)

    # Encendemos todo
    scheduler.start()
    yield # Aquí el servidor de FastAPI atiende a los usuarios
    
    # Apagado seguro
    scheduler.shutdown()
    print("🛑 Motores apagados.")

# ==========================================
# CONFIGURACIÓN DE FASTAPI
# ==========================================
app = FastAPI(
    title="Leones Fan API",
    version="1.0",
    lifespan=lifespan,
    root_path="/api"
)

# Configuración de CORS para permitir peticiones desde tu frontend en React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],# Tu puerto de Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conexión de Rutas
app.include_router(juegos.router, prefix="/api/juegos", tags=["Juegos"])
app.include_router(usuarios.router, prefix="/api/usuarios", tags=["Usuarios"])
app.include_router(noticias.router, prefix="/api/noticias", tags=["Noticias"])
app.include_router(equipo.router, prefix="/api/equipo", tags=["Equipo"])

@app.get("/")
async def root():
    return {"message": "API Leones Fan App en línea"}
