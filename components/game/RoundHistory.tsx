'use client';

import { RondaRecord, Player } from '@/lib/types';

interface RoundHistoryProps {
  historial: RondaRecord[];
  jugadores: Player[];
}

export default function RoundHistory({ historial, jugadores }: RoundHistoryProps) {
  if (historial.length === 0) {
    return (
      <p className="py-4 text-center text-xs text-neutral-400">
        History will appear after the first round.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="border-b border-neutral-200">
            <th className="px-2 py-2 text-left font-display font-normal tracking-[0.14em] text-neutral-500">
              R
            </th>
            {jugadores.map(j => (
              <th
                key={j.id}
                className="px-2 py-2 text-center font-display font-normal tracking-[0.12em] text-neutral-500"
              >
                {j.nombre.slice(0, 6)}
              </th>
            ))}
            <th className="px-2 py-2 text-center font-display font-normal tracking-[0.12em] text-neutral-500">
              Sum
            </th>
            <th className="px-2 py-2 text-center font-display font-normal tracking-[0.12em] text-neutral-500">
              World
            </th>
            <th className="px-2 py-2 text-center font-display font-normal tracking-[0.12em] text-neutral-500">
              Wins
            </th>
          </tr>
        </thead>
        <tbody>
          {historial.map(r => {
            const gana = jugadores
              .filter(j => r.ganadores.includes(j.id))
              .map(j => j.nombre.slice(0, 6))
              .join(', ');

            return (
              <tr key={r.ronda} className="border-b border-neutral-200">
                <td className="px-2 py-2 text-center font-mono-game text-neutral-500">
                  {r.ronda}
                </td>
                {jugadores.map(j => {
                  const num = r.numeros.find(n => n.jugadorId === j.id);
                  const dano = r.danos.find(d => d.jugadorId === j.id);
                  const isWinner = r.ganadores.includes(j.id);
                  return (
                    <td key={j.id} className="px-2 py-2 text-center">
                      <span className={`font-mono-game ${isWinner ? 'font-bold text-black' : 'text-neutral-700'}`}>
                        {num ? num.valor : '-'}
                      </span>
                      {dano && dano.cantidad > 0 && (
                        <span className="ml-1 text-[10px] text-red-700">
                          -{dano.cantidad}
                        </span>
                      )}
                    </td>
                  );
                })}
                <td className="px-2 py-2 text-center font-mono-game text-neutral-700">
                  {r.suma}
                </td>
                <td className="px-2 py-2 text-center">
                  <span className={`world-badge ${r.mundo === 'alto' ? 'world-badge--alto' : 'world-badge--bajo'}`} style={{ fontSize: '0.58rem', padding: '2px 6px' }}>
                    {r.mundo === 'alto' ? 'HIGH' : 'LOW'}
                  </span>
                </td>
                <td className="px-2 py-2 text-center font-mono-game text-[11px] text-black">
                  {r.valorGanador}
                  {r.golpePerfecto && <span className="ml-1">PS</span>}
                  <br />
                  <span className="text-[10px] text-neutral-400">{gana}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
