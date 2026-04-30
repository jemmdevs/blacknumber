'use client';

import { RondaRecord, Player } from '@/lib/types';

interface RoundHistoryProps {
  historial: RondaRecord[];
  jugadores: Player[];
}

export default function RoundHistory({ historial, jugadores }: RoundHistoryProps) {
  if (historial.length === 0) {
    return (
      <p className="text-center text-xs py-4" style={{ color: 'var(--color-text-muted)' }}>
        El historial aparecerá aquí al completar la primera ronda.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            <th
              className="py-1 px-2 text-left font-display tracking-wider"
              style={{ color: 'var(--color-text-muted)' }}
            >
              R
            </th>
            {jugadores.map(j => (
              <th
                key={j.id}
                className="py-1 px-2 text-center font-display tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {j.nombre.slice(0, 6)}
              </th>
            ))}
            <th
              className="py-1 px-2 text-center font-display tracking-wider"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Suma
            </th>
            <th
              className="py-1 px-2 text-center font-display tracking-wider"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Mundo
            </th>
            <th
              className="py-1 px-2 text-center font-display tracking-wider"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Gana
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
              <tr
                key={r.ronda}
                style={{ borderBottom: '1px solid var(--color-border)' }}
                className="hover:bg-white/5 transition-colors"
              >
                <td
                  className="py-1 px-2 font-mono-game text-center"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {r.ronda}
                </td>
                {jugadores.map(j => {
                  const num = r.numeros.find(n => n.jugadorId === j.id);
                  const dano = r.danos.find(d => d.jugadorId === j.id);
                  const isWinner = r.ganadores.includes(j.id);
                  return (
                    <td key={j.id} className="py-1 px-2 text-center">
                      <span
                        className="font-mono-game"
                        style={{
                          color: isWinner
                            ? 'var(--color-accent-gold)'
                            : num
                              ? 'var(--color-text-primary)'
                              : 'var(--color-text-muted)',
                          fontWeight: isWinner ? 700 : 400,
                        }}
                      >
                        {num ? num.valor : '—'}
                      </span>
                      {dano && dano.cantidad > 0 && (
                        <span
                          className="ml-1"
                          style={{ color: 'var(--color-world-low-text)', fontSize: '0.65rem' }}
                        >
                          −{dano.cantidad}
                        </span>
                      )}
                    </td>
                  );
                })}
                <td
                  className="py-1 px-2 text-center font-mono-game"
                  style={{
                    color:
                      r.suma === r.umbral
                        ? 'var(--color-accent-gold)'
                        : 'var(--color-text-secondary)',
                  }}
                >
                  {r.suma}
                  {r.suma === r.umbral && ' ★'}
                </td>
                <td className="py-1 px-2 text-center">
                  <span
                    className={`world-badge ${r.mundo === 'alto' ? 'world-badge--alto' : 'world-badge--bajo'}`}
                    style={{ fontSize: '0.6rem', padding: '2px 6px' }}
                  >
                    {r.mundo === 'alto' ? '↑ ALTO' : '↓ BAJO'}
                  </span>
                </td>
                <td
                  className="py-1 px-2 text-center font-mono-game"
                  style={{ color: 'var(--color-accent-gold)', fontSize: '0.7rem' }}
                >
                  {r.valorGanador}
                  {r.golpePerfecto && (
                    <span className="ml-1" title="Golpe Perfecto">
                      ⚡
                    </span>
                  )}
                  <br />
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.6rem' }}>
                    {gana}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
