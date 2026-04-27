-- 1. Tabla de Equipos [cite: 108-120]
CREATE TABLE equipos (
    id_equipo SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    ciudad VARCHAR(100),
    logo_url VARCHAR(255)
);

-- 2. Tabla de Estadios [cite: 185, 205-214]
CREATE TABLE estadios (
    id_estadio SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100)
);

-- 3. Tabla de Usuarios [cite: 121-136, 288-291]
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de Juegos [cite: 137-183, 273-278]
CREATE TABLE juegos (
    id_juego BIGINT PRIMARY KEY,
    fecha DATE,
    hora TIME,
    local_id INT REFERENCES equipos(id_equipo),
    visitante_id INT REFERENCES equipos(id_equipo),
    id_estadio INT REFERENCES estadios(id_estadio),
    estado VARCHAR(20) DEFAULT 'programado', -- programado, en_vivo, finalizado
    inning_num INT DEFAULT 1,
    mitad_inning VARCHAR(10), -- alta, baja
    inning_actual VARCHAR(20), -- ej: 'Alta 1'
    outs INT DEFAULT 0,
    bolas INT DEFAULT 0,
    strikes INT DEFAULT 0,
    score_local INT DEFAULT 0,
    score_visitante INT DEFAULT 0,
    corredor_1b BOOLEAN DEFAULT FALSE,
    corredor_2b BOOLEAN DEFAULT FALSE,
    corredor_3b BOOLEAN DEFAULT FALSE,
    pitcher_actual VARCHAR(100),
    bateador_actual VARCHAR(100),
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla de Eventos de Juego (Play-by-Play) [cite: 184-204, 279-287]
CREATE TABLE eventos_juego (
    id_evento SERIAL PRIMARY KEY,
    juego_id BIGINT REFERENCES juegos(id_juego),
    equipo_id INT REFERENCES equipos(id_equipo),
    inning VARCHAR(20),
    orden INT,
    tipo VARCHAR(50), -- hit, home_run, out, walk
    jugador VARCHAR(100),
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabla de Notificaciones / Dispositivos Push [cite: 215-231]
CREATE TABLE dispositivos_push (
    id_push SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuarios(id_usuario),
    token TEXT NOT NULL,
    plataforma VARCHAR(50), -- web, ios, android
    activo BOOLEAN DEFAULT TRUE
);

-- 7. Tabla de Noticias [cite: 216, 232-244]
CREATE TABLE noticias (
    id_noticia SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT,
    imagen_url VARCHAR(255),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);