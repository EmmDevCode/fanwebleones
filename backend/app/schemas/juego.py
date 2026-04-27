from pydantic import BaseModel
from typing import Optional

# Esquema para el Equipo
class EquipoBase(BaseModel):
    id_equipo: int
    nombre: str
    slug: str
    logo_url: Optional[str] = None

    class Config:
        from_attributes = True

# Esquema para el Juego en Vivo
class JuegoEnVivoOut(BaseModel):
    id_juego: int
    estado: str
    inning_actual: str
    outs: int
    bolas: int
    strikes: int
    score_local: int
    score_visitante: int
    corredor_1b: bool
    corredor_2b: bool
    corredor_3b: bool
    pitcher_actual: Optional[str] = None
    bateador_actual: Optional[str] = None
    
    # Anidamos los equipos para que coincida exactamente con tu TypeScript
    local: EquipoBase
    visitante: EquipoBase

    class Config:
        from_attributes = True