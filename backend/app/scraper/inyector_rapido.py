import sys
import os
import unicodedata
import re
from datetime import datetime

# --- TRUCO DE RUTAS ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(BASE_DIR)

from app.db.session import SessionLocal
from app.models.database import Juego, Equipo

# ⚾ LLENA ESTA LISTA CON TU MES COMPLETO
# Formato: ("YYYY-MM-DD", "HH:MM", "Local", "Visitante", "ID_LMB")
juegos_manuales = [
    # --- SEMANA 1: ABRIL ---
    ("2026-04-27", "19:30", "Tigres de Quintana roo", "Leones de Yucatán", "846276"),
    ("2026-04-28", "18:30", "Tigres de Quintana roo", "Leones de Yucatán", "846274"),
    ("2026-04-29", "18:30", "Tigres de Quintana roo", "Leones de Yucatán", "846275"),
    ("2026-05-01", "19:30", "Leones de Yucatán", "Pericos de Puebla", "846690"),
    ("2026-05-02", "19:00", "Leones de Yucatán", "Pericos de Puebla", "846697"),
    ("2026-05-03", "18:00", "Leones de Yucatán", "Pericos de Puebla", "846694"),
    # Agrega el resto de tus juegos aquí abajo...
]

def inyectar_juegos():
    print("💉 Iniciando el Inyector Rápido de Juegos...")
    db = SessionLocal()
    juegos_agregados = 0

    def obtener_o_crear_equipo(nombre_crudo):
        nombre_espanol = nombre_crudo.split(' de ')[0].split(' del ')[0].strip()
        equipo = db.query(Equipo).filter(Equipo.nombre.ilike(f"%{nombre_espanol}%")).first()
        
        if not equipo:
            slug_sin_acentos = unicodedata.normalize('NFKD', nombre_crudo).encode('ASCII', 'ignore').decode('utf-8')
            slug = re.sub(r'[^a-z0-9]+', '-', slug_sin_acentos.lower()).strip('-')
            equipo = Equipo(nombre=nombre_crudo, slug=slug, ciudad="Por definir")
            db.add(equipo)
            db.commit()
            db.refresh(equipo)
        return equipo

    try:
        # El for ahora recibe las 5 variables, incluyendo el id_real
        for fecha_str, hora_str, local, visitante, id_real in juegos_manuales:
            
            fecha_obj = datetime.strptime(fecha_str, "%Y-%m-%d").date()
            hora_obj = datetime.strptime(hora_str, "%H:%M").time()
            
            eq_local = obtener_o_crear_equipo(local)
            eq_visita = obtener_o_crear_equipo(visitante)

            # Validar si el ID ya existe para no duplicar ni causar errores
            existe = db.query(Juego).filter(Juego.id_lmb == str(id_real)).first()

            if existe:
                print(f"⚠️ El juego {local} vs {visitante} con ID {id_real} ya está en BD. Saltando...")
                continue

            nuevo_juego = Juego(
                fecha=fecha_obj,
                hora=hora_obj,
                local_id=eq_local.id_equipo,
                visitante_id=eq_visita.id_equipo,
                estado="programado",
                id_lmb=str(id_real), # <--- Guardamos el ID real para el Marcador En Vivo
                id_estadio=1 
            )
            
            db.add(nuevo_juego)
            juegos_agregados += 1
            print(f"✅ Agregado: {fecha_str} | {visitante} @ {local} | ID: {id_real}")

        db.commit()
        print(f"\n🎉 ¡Misión Cumplida! Se inyectaron {juegos_agregados} juegos limpiamente en PostgreSQL.")

    except Exception as e:
        print(f"❌ Error en la inyección: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    inyectar_juegos()