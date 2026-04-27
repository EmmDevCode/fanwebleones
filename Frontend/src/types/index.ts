export interface Equipo {
  id_equipo: number;
  nombre: string;
  slug: string;
  logo_url: string;
}

export interface JuegoEnVivo {
  id_juego: number;
  estado: 'programado' | 'en_vivo' | 'finalizado';
  inning_actual: string; // ej. "Alta 7"
  outs: number;
  bolas: number;
  strikes: number;
  score_local: number;
  score_visitante: number;
  local: Equipo;
  visitante: Equipo;
  corredor_1b: boolean;
  corredor_2b: boolean;
  corredor_3b: boolean;
}