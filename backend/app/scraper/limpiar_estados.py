from app.db.session import SessionLocal
from app.models.database import Juego

def resetear_pizarra():
    db = SessionLocal()
    try:
        # 1. Ponemos TODOS los juegos en "programado"
        db.query(Juego).update({Juego.estado: "programado"})
        db.commit()
        
        # 2. Ahora, activamos SOLO el que tú quieres ver hoy (el 846692)
        juego_hoy = db.query(Juego).filter(Juego.id_lmb == "846692").first()
        if juego_hoy:
            juego_hoy.estado = "en vivo"
            db.commit()
            print(f"✅ Sistema reseteado. Solo el juego {juego_hoy.id_lmb} está EN VIVO.")
    finally:
        db.close()

if __name__ == "__main__":
    resetear_pizarra()