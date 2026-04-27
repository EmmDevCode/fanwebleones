import os
import firebase_admin
from firebase_admin import credentials, messaging
from datetime import datetime

# Ruta al archivo JSON de credenciales que descargas de Firebase
# Asegúrate de agregar este archivo a tu .gitignore para no subirlo a GitHub
CREDENTIALS_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'firebase-credentials.json')

def inicializar_firebase():
    """Inicializa la app de Firebase si no está inicializada ya."""
    if not firebase_admin._apps:
        try:
            cred = credentials.Certificate(CREDENTIALS_PATH)
            firebase_admin.initialize_app(cred)
            print("Firebase inicializado correctamente.")
        except Exception as e:
            print(f"Error al inicializar Firebase: {e}")

def enviar_notificacion_carrera(score_leones: int, score_visitante: int, equipo_visitante: str, inning: str):
    """
    Envía una notificación Push a todos los usuarios suscritos al topic 'juegos_leones'.
    """
    inicializar_firebase()
    
    titulo = "¡Carrera anotada! 🦁"
    cuerpo = f"Leones {score_leones} - {score_visitante} {equipo_visitante} | {inning}"

    # El mensaje se envía a un 'topic'. Todos los dispositivos de tu PWA 
    # que se suscriban a este topic recibirán la alerta simultáneamente.
    mensaje = messaging.Message(
        notification=messaging.Notification(
            title=titulo,
            body=cuerpo,
        ),
        topic="juegos_leones"
    )

    try:
        response = messaging.send(mensaje)
        print(f"[{datetime.now()}] Notificación enviada con éxito: {response}")
    except Exception as e:
        print(f"[{datetime.now()}] Error enviando notificación: {e}")

# Ejecutamos la inicialización al importar el módulo
inicializar_firebase()