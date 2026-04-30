'use client';

import { useEffect, useState } from 'react';
import { useGame } from '@/store/gameStore';
import { getHistorial, getAllPlayers } from '@/lib/storage';
import { PartidaRecord, PlayerStorage } from '@/lib/types';
import Button from '@/components/ui/Button';

export default function LeaderboardScreen() {
  const { navigate } = useGame();
  const [historial, setHistorial] = useState<PartidaRecord[]>([]);
  const [players, setPlayers] = useState<{ [nombre: string]: PlayerStorage }>({});

  useEffect(() => {
    try {
      setHistorial(getHistorial());
      setPlayers(getAllPlayers());
    } catch {
      // localStorage not available
    }
  }, []);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center py-10 px-4 gap-6 animate-fade-in"
      style={{ background: 'var(--color-bg-primary)' }}
    >
      <div className="w-full max-w-3xl flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('home')}>
            ← Volver
          </Button>
          <h1
            className="font-display text-2xl tracking-widest"
            style={{ color: 'var(--color-accent-gold)' }}
          >
            CLASIFICACIÓN
          </h1>
        </div>

        {/* Player stats */}
        {Object.keys(players).length > 0 && (
          <div
            className="p-4 rounded flex flex-col gap-2"
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <h2
              className="font-display text-xs tracking-widest mb-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              JUGADORES REGISTRADOS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(players)
                .sort(([, a], [, b]) => b.puntosTotales - a.puntosTotales)
                .map(([nombre, data]) => (
                  <div
                    key={nombre}
                    className="flex items-center justify-between px-3 py-2 rounded"
                    style={{
                      background: 'var(--color-bg-primary)',
                      border: data.expulsado
                        ? '1px solid rgba(220,38,38,0.5)'
                        : '1px solid var(--color-border)',
                    }}
                  >
                    <div>
                      <span
                        className="font-display text-sm"
                        style={{
                          color: data.expulsado ? '#f87171' : 'var(--color-text-primary)',
                          textDecoration: data.expulsado ? 'line-through' : 'none',
                        }}
                      >
                        {nombre}
                      </span>
                      {data.expulsado && (
                        <span
                          className="ml-2 text-xs"
                          style={{ color: '#f87171' }}
                        >
                          [EXPULSADO]
                        </span>
                      )}
                      {data.expulsado && data.victoriasConsecutivasDesdeExpulsion > 0 && (
                        <span
                          className="ml-2 text-xs"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          {data.victoriasConsecutivasDesdeExpulsion}/3 victorias
                        </span>
                      )}
                    </div>
                    <span
                      className="font-mono-game text-sm"
                      style={{
                        color:
                          data.puntosTotales >= 0
                            ? 'var(--color-world-high-text)'
                            : '#f87171',
                      }}
                    >
                      {data.puntosTotales >= 0
                        ? `+${data.puntosTotales}`
                        : data.puntosTotales}{' '}
                      PC
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Match history */}
        <div
          className="p-4 rounded flex flex-col gap-3"
          style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
          }}
        >
          <h2
            className="font-display text-xs tracking-widest mb-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            PARTIDAS RECIENTES
          </h2>

          {historial.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: 'var(--color-text-muted)' }}>
              No hay partidas registradas todavía.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    {['Fecha', 'Modo', 'N', 'Jugadores', 'Ganador', 'Puntos de Clase'].map(h => (
                      <th
                        key={h}
                        className="py-2 px-2 text-left font-display tracking-wider"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {historial.map((p, i) => {
                    const ganadorData = players[p.ganador];
                    const ganadorExpulsado = ganadorData?.expulsado ?? false;

                    return (
                      <tr
                        key={i}
                        className="hover:bg-white/5 transition-colors"
                        style={{ borderBottom: '1px solid var(--color-border)' }}
                      >
                        <td
                          className="py-2 px-2 font-mono-game"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          {formatDate(p.fecha)}
                        </td>
                        <td className="py-2 px-2" style={{ color: 'var(--color-text-secondary)' }}>
                          {p.modo === 'clasico' ? 'Clásico' : 'Escalada'}
                        </td>
                        <td
                          className="py-2 px-2 font-mono-game text-center"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          {p.nJugadores}
                        </td>
                        <td className="py-2 px-2" style={{ color: 'var(--color-text-secondary)' }}>
                          {p.jugadores.join(', ')}
                        </td>
                        <td className="py-2 px-2">
                          <span
                            style={{
                              color: ganadorExpulsado ? '#f87171' : 'var(--color-accent-gold)',
                              textDecoration: ganadorExpulsado ? 'line-through' : 'none',
                              fontWeight: 600,
                            }}
                          >
                            {p.ganador}
                          </span>
                          {p.golpePerfecto && (
                            <span
                              className="ml-1"
                              title="Golpe Perfecto ocurrió en esta partida"
                            >
                              ⚡
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-2">
                          <div className="flex flex-col gap-0.5">
                            {p.puntosClase.map(pc => (
                              <span
                                key={pc.nombre}
                                className="font-mono-game"
                                style={{
                                  color:
                                    pc.puntos >= 0
                                      ? 'var(--color-world-high-text)'
                                      : '#f87171',
                                  fontSize: '0.65rem',
                                }}
                              >
                                {pc.nombre.slice(0, 8)}: {pc.puntos >= 0 ? `+${pc.puntos}` : pc.puntos}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
