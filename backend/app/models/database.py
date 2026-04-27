from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, BigInteger, Date, Time, Text
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class Equipo(Base):
    __tablename__ = "equipos"

    id_equipo = Column(Integer, primary_key=True, index=True) # [cite: 111, 112]
    nombre = Column(String, nullable=False) # [cite: 113, 114]
    slug = Column(String, unique=True, index=True) # [cite: 115, 116]
    ciudad = Column(String) # [cite: 117, 118]
    logo_url = Column(String) # [cite: 119, 120]

    # Relaciones
    juegos_como_local = relationship("Juego", foreign_keys="[Juego.local_id]", back_populates="local")
    juegos_como_visitante = relationship("Juego", foreign_keys="[Juego.visitante_id]", back_populates="visitante")

class Estadio(Base):
    __tablename__ = "estadios"

    id_estadio = Column(Integer, primary_key=True, index=True) # [cite: 208, 210]
    nombre = Column(String, nullable=False) # [cite: 211, 212]
    ciudad = Column(String) # [cite: 213, 214]

    juegos = relationship("Juego", back_populates="estadio")

class Juego(Base):
    __tablename__ = "juegos"

    id_juego = Column(BigInteger, primary_key=True, index=True) # [cite: 141, 142, 143]
    fecha = Column(Date) # [cite: 144, 145]
    hora = Column(Time) # [cite: 146, 147]
    
    # Llaves foráneas
    local_id = Column(Integer, ForeignKey("equipos.id_equipo")) # [cite: 148, 149, 150]
    visitante_id = Column(Integer, ForeignKey("equipos.id_equipo")) # [cite: 151, 152, 153]
    id_estadio = Column(Integer, ForeignKey("estadios.id_estadio")) # [cite: 154, 155, 156]

    # Estado del juego [cite: 275]
    estado = Column(String, default="programado") # programado, en_vivo, finalizado [cite: 157, 158]
    inning_num = Column(Integer, default=1) # [cite: 159, 160]
    mitad_inning = Column(String, default="alta") # alta, baja [cite: 161, 162]
    inning_actual = Column(String, default="Alta 1") # ej. Alta 1 [cite: 163, 164]
    id_lmb = Column(String(50), nullable=True)
    
    # Conteo [cite: 277, 278]
    outs = Column(Integer, default=0) # [cite: 165, 166]
    bolas = Column(Integer, default=0) # [cite: 167, 168]
    strikes = Column(Integer, default=0) # [cite: 169, 170]
    
    # Marcador
    score_local = Column(Integer, default=0) # [cite: 171]
    score_visitante = Column(Integer, default=0) # [cite: 172]
    
    # Diamante (Corredores) [cite: 257-260]
    corredor_1b = Column(Boolean, default=False) # [cite: 173, 174]
    corredor_2b = Column(Boolean, default=False) # [cite: 175, 176]
    corredor_3b = Column(Boolean, default=False) # [cite: 177, 178]

    # Jugadores actuales
    pitcher_actual = Column(String, nullable=True) # [cite: 179]
    bateador_actual = Column(String, nullable=True) # [cite: 180]
    ultima_actualizacion = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) # [cite: 181, 182, 183]

    # Relaciones
    local = relationship("Equipo", foreign_keys=[local_id], back_populates="juegos_como_local")
    visitante = relationship("Equipo", foreign_keys=[visitante_id], back_populates="juegos_como_visitante")
    estadio = relationship("Estadio", back_populates="juegos")
    eventos = relationship("EventoJuego", back_populates="juego")

class EventoJuego(Base):
    __tablename__ = "eventos_juego"

    id_evento = Column(Integer, primary_key=True, index=True) # [cite: 188, 189]
    juego_id = Column(BigInteger, ForeignKey("juegos.id_juego")) # [cite: 190, 191, 192]
    equipo_id = Column(Integer, ForeignKey("equipos.id_equipo")) # [cite: 193, 194, 195]
    
    inning = Column(String) # [cite: 196, 197]
    orden = Column(Integer) # [cite: 198, 199]
    tipo = Column(String) # hit, out, home_run, etc. [cite: 200, 201, 281-285]
    jugador = Column(String) # [cite: 202, 286]
    descripcion = Column(Text) # [cite: 203, 287]
    created_at = Column(DateTime, default=datetime.utcnow) # [cite: 204]

    # Relaciones
    juego = relationship("Juego", back_populates="eventos")

class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(Integer, primary_key=True, index=True) # [cite: 125, 126, 127]
    nombre = Column(String, nullable=False) # [cite: 128, 129]
    email = Column(String, unique=True, index=True, nullable=False) # [cite: 130, 131, 290]
    password_hash = Column(String, nullable=False) # [cite: 132, 291]
    activo = Column(Boolean, default=True) # [cite: 133, 134]
    created_at = Column(DateTime, default=datetime.utcnow) # [cite: 135, 136]

class DispositivoPush(Base):
    __tablename__ = "dispositivos_push"
    
    id_push = Column(Integer, primary_key=True, index=True) # [cite: 220, 221, 222]
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario")) # [cite: 223, 224, 225]
    token = Column(Text, nullable=False) # [cite: 226, 227]
    plataforma = Column(String) # web, ios, android [cite: 228, 229]
    activo = Column(Boolean, default=True) # [cite: 230, 231]


class Noticia(Base):
    __tablename__ = "noticias"

    id_noticia = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(255), nullable=False)
    resumen = Column(Text)
    contenido = Column(Text)
    url_imagen = Column(String(500))
    url_noticia = Column(String(500))
    fecha_publicacion = Column(DateTime, default=datetime.utcnow)
    equipo = Column(String(100), default="Leones de Yucatán") # Filtro de seguridad


class Jugador(Base):
    __tablename__ = "jugadores"

    id_jugador = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False)
    numero = Column(String(10))
    posicion = Column(String(50))
    bateo = Column(String(5))      # <-- Esta es la que faltaba
    picheo = Column(String(5))     # <-- Y esta también
    foto_url = Column(String(500))
    equipo = Column(String(100), default="Leones de Yucatán")
    activo = Column(Boolean, default=True)