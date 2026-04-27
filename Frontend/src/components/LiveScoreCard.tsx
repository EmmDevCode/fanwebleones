import React from 'react';
import type { JuegoEnVivo } from '@/types';

interface LiveScoreCardProps {
  juego: JuegoEnVivo;
}

const LiveScoreCard: React.FC<LiveScoreCardProps> = ({ juego }) => {
  const { 
    local, 
    visitante, 
    score_local, 
    score_visitante, 
    inning_actual, 
    outs, 
    bolas, 
    strikes,
    corredor_1b,
    corredor_2b,
    corredor_3b
  } = juego;

  return (
    <div className="bg-black text-white p-6 rounded-[2rem] border border-[#1c1c1e] w-full max-w-sm font-sans shadow-2xl tracking-wide">
      
      {/* Cabecera: Estado y Conteo */}
      <div className="flex justify-between items-center mb-6 px-1">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          <span className="text-xs font-semibold uppercase text-gray-300">
            {inning_actual}
          </span>
        </div>
        <div className="flex space-x-3 text-xs font-medium text-gray-400">
          <span>B <strong className="text-white">{bolas}</strong></span>
          <span>S <strong className="text-white">{strikes}</strong></span>
          <span>O <strong className="text-white">{outs}</strong></span>
        </div>
      </div>

      {/* Marcador Principal */}
      <div className="flex justify-between items-center mb-6">
        {/* Visitante */}
        <div className="flex flex-col items-center flex-1">
          <div className="w-16 h-16 bg-[#1c1c1e] rounded-full flex items-center justify-center mb-3">
            <span className="text-xl font-bold text-white">{visitante.slug}</span>
          </div>
          <span className="text-4xl font-light tabular-nums">{score_visitante}</span>
        </div>

        {/* Separador */}
        <div className="text-[#3a3a3c] font-medium text-sm px-4">VS</div>

        {/* Local (Leones) */}
        <div className="flex flex-col items-center flex-1">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3">
             <span className="text-xl font-bold text-black">{local.slug}</span>
          </div>
          <span className="text-4xl font-bold tabular-nums">{score_local}</span>
        </div>
      </div>

      {/* Mini Diamante (Opcional, representación minimalista de bases) */}
      <div className="flex justify-center mt-4 pt-4 border-t border-[#1c1c1e]">
        <div className="relative w-8 h-8 rotate-45">
          <div className={`absolute top-0 right-0 w-3 h-3 rounded-sm ${corredor_1b ? 'bg-white' : 'bg-[#1c1c1e]'}`}></div>
          <div className={`absolute top-0 left-0 w-3 h-3 rounded-sm ${corredor_2b ? 'bg-white' : 'bg-[#1c1c1e]'}`}></div>
          <div className={`absolute bottom-0 left-0 w-3 h-3 rounded-sm ${corredor_3b ? 'bg-white' : 'bg-[#1c1c1e]'}`}></div>
        </div>
      </div>

    </div>
  );
};

export default LiveScoreCard;