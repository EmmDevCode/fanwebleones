import { useEffect, useState } from 'react';
import axios from 'axios';
import './Linescore.css';

interface LinescoreProps {
  idLmb: number | string;
}

const Linescore = ({ idLmb }: LinescoreProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchLinescore = async () => {
      try {
        const res = await axios.get(`/api/juegos/${idLmb}/gamecast`);
        setData(res.data.pizarra);
      } catch (error) {
        console.error("Error fetching linescore", error);
      }
    };

    fetchLinescore();
    const interval = setInterval(fetchLinescore, 5000); // Se actualiza cada 5 segundos
    return () => clearInterval(interval);
  }, [idLmb]);

  if (!data) return <div className="linescore-loading">Cargando pizarra...</div>;

  // Lógica para las columnas del Linescore (Mínimo 9 entradas)
  const totalInnings = Math.max(9, data.innings?.length || 9);
  const inningsArray = Array.from({ length: totalInnings }, (_, i) => i);

  // Función para obtener las carreras de una entrada específica
  const getInningRuns = (inningIndex: number, isHome: boolean) => {
    const inning = data.innings?.[inningIndex];
    if (!inning) return <span className="empty-inning">-</span>;
    const teamData = isHome ? inning.home : inning.away;
    return teamData?.runs !== undefined ? teamData.runs : <span className="empty-inning">-</span>;
  };

  return (
    <div className="linescore-container">
      <div className="ls-wrapper">
        <table className="ls-table">
          <thead>
            <tr>
              <th className="col-team">EQP</th>
              {inningsArray.map(i => <th key={i}>{i + 1}</th>)}
              <th className="col-r col-divider">R</th>
              <th className="col-h">H</th>
              <th className="col-e">E</th>
            </tr>
          </thead>
          <tbody>
            {/* Fila Visitante */}
            <tr>
              <td className="col-team team-visitante">{data.equipos?.visitante || 'VIS'}</td>
              {inningsArray.map(i => <td key={i}>{getInningRuns(i, false)}</td>)}
              <td className="col-r col-divider val-r">{data.RHE?.visitante?.runs || 0}</td>
              <td className="col-h">{data.RHE?.visitante?.hits || 0}</td>
              <td className="col-e">{data.RHE?.visitante?.errors || 0}</td>
            </tr>
            {/* Fila Local */}
            <tr>
              <td className="col-team team-local">{data.equipos?.local || 'LOC'}</td>
              {inningsArray.map(i => <td key={i}>{getInningRuns(i, true)}</td>)}
              <td className="col-r col-divider val-r">{data.RHE?.local?.runs || 0}</td>
              <td className="col-h">{data.RHE?.local?.hits || 0}</td>
              <td className="col-e">{data.RHE?.local?.errors || 0}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Linescore;