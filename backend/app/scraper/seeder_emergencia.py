import sys
import os
from datetime import date, time

# --- TRUCO DE RUTAS ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(BASE_DIR)

# IMPORTAMOS TAMBIÉN EL ESTADIO
from app.db.session import SessionLocal
from app.models.database import Juego, Equipo, Estadio 

def inyectar_juego_hoy():
    db = SessionLocal()
    try:
        print("💉 Preparando inyección de datos de prueba...")

        # 1. Asegurarnos de que los equipos existen
        leones = db.query(Equipo).filter(Equipo.nombre.ilike("%Leones%")).first()
        if not leones:
            leones = Equipo(nombre="Leones de Yucatán", slug="leones", ciudad="Mérida")
            db.add(leones)
            
        aguila = db.query(Equipo).filter(Equipo.nombre.ilike("%Águila%")).first()
        if not aguila:
            aguila = Equipo(nombre="El Águila de Veracruz", slug="el-aguila", ciudad="Veracruz")
            db.add(aguila)

        # 2. Asegurarnos de que el Estadio existe
        kukulcan = db.query(Estadio).filter(Estadio.nombre.ilike("%Kukulcán%")).first()
        if not kukulcan:
            # Ponemos datos básicos del Kukulcán
            kukulcan = Estadio(nombre="Parque Kukulcán Alamo", ciudad="Mérida") 
            db.add(kukulcan)
            
        # Guardamos todo para que se generen los IDs reales
        db.commit() 

        # 3. Inyectar el partido de HOY usando los IDs que la base de datos nos acaba de dar
        juego_hoy = Juego(
            fecha=date.today(),      
            hora=time(18, 0),        
            local_id=leones.id_equipo,
            visitante_id=aguila.id_equipo,
            estado="programado",
            id_estadio=kukulcan.id_estadio  # <-- USAMOS EL ID REAL DEL ESTADIO CREADO
        )
        db.add(juego_hoy)
        db.commit()
        
        print("✅ ¡BUM! Juego de Leones vs El Águila inyectado para el día de hoy.")

    except Exception as e:
        print(f"❌ Falló la inyección: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    inyectar_juego_hoy()