'use client';

import { useState } from 'react';
import { useGame } from '@/store/gameStore';
import { getHistorial, getAllPlayers } from '@/lib/storage';
import { PartidaRecord, PlayerStorage } from '@/lib/types';
import Button from '@/components/ui/Button';
import CutContainer from '@/components/ui/CutContainer';

export default function LeaderboardScreen() {
  const { navigate } = useGame();
  const [historial] = useState<PartidaRecord[]>(() => {
    try {
      return getHistorial();
    } catch {
      return [];
    }
  });
  const [players] = useState<{ [nombre: string]: PlayerStorage }>(() => {
    try {
      return getAllPlayers();
    } catch {
      return {};
    }
  });

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
    <div className="min-h-screen bg-[var(--color-bg-primary)] px-4 py-6 animate-fade-in">
      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        <header className="flex items-center justify-between">
          <button
            onClick={() => navigate('home')}
            className="font-display text-sm font-semibold tracking-[0.18em] uppercase"
          >
            blacknumbers
          </button>
          <Button variant="ghost" size="sm" onClick={() => navigate('home')}>
            Volver
          </Button>
        </header>

        <div>
          <p className="text-[10px] tracking-[0.24em] text-neutral-500 uppercase">Registro</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-[0.16em] uppercase">
            Clasificacion
          </h1>
        </div>

        {Object.keys(players).length > 0 && (
          <section>
            <p className="mb-3 text-[10px] tracking-[0.18em] text-neutral-500 uppercase">
              Jugadores
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {Object.entries(players)
                .sort(([, a], [, b]) => b.puntosTotales - a.puntosTotales)
                .map(([nombre, data]) => (
                  <CutContainer key={nombre} hoverEffect={false}>
                    <div className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <p className={`truncate text-sm font-medium ${data.expulsado ? 'text-red-700 line-through' : ''}`}>
                          {nombre}
                        </p>
                        {data.expulsado && (
                          <p className="mt-1 text-[10px] tracking-[0.12em] text-red-700 uppercase">
                            Expulsado {data.victoriasConsecutivasDesdeExpulsion}/3
                          </p>
                        )}
                      </div>
                      <span className={`font-mono-game text-sm ${data.puntosTotales >= 0 ? 'text-black' : 'text-red-700'}`}>
                        {data.puntosTotales >= 0 ? `+${data.puntosTotales}` : data.puntosTotales} PC
                      </span>
                    </div>
                  </CutContainer>
                ))}
            </div>
          </section>
        )}

        <section>
          <p className="mb-3 text-[10px] tracking-[0.18em] text-neutral-500 uppercase">
            Partidas recientes
          </p>
          <CutContainer hoverEffect={false}>
            <div className="px-4 py-4">
              {historial.length === 0 ? (
                <p className="py-8 text-center text-sm text-neutral-400">
                  No hay partidas registradas todavia.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-neutral-200">
                        {['Fecha', 'Modo', 'N', 'Jugadores', 'Ganador', 'PC'].map(h => (
                          <th
                            key={h}
                            className="px-2 py-2 text-left font-display font-normal tracking-[0.12em] text-neutral-500"
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
                          <tr key={i} className="border-b border-neutral-200 last:border-0">
                            <td className="px-2 py-3 font-mono-game text-neutral-500">
                              {formatDate(p.fecha)}
                            </td>
                            <td className="px-2 py-3 text-neutral-700">
                              {p.modo === 'clasico' ? 'Clasico' : 'Escalada'}
                            </td>
                            <td className="px-2 py-3 text-center font-mono-game text-neutral-500">
                              {p.nJugadores}
                            </td>
                            <td className="px-2 py-3 text-neutral-700">
                              {p.jugadores.join(', ')}
                            </td>
                            <td className="px-2 py-3">
                              <span className={ganadorExpulsado ? 'text-red-700 line-through' : 'font-medium text-black'}>
                                {p.ganador}
                              </span>
                              {p.golpePerfecto && <span className="ml-1 text-[10px]">GP</span>}
                            </td>
                            <td className="px-2 py-3">
                              <div className="flex flex-col gap-1">
                                {p.puntosClase.map(pc => (
                                  <span
                                    key={pc.nombre}
                                    className={`font-mono-game text-[10px] ${pc.puntos >= 0 ? 'text-black' : 'text-red-700'}`}
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
          </CutContainer>
        </section>
      </div>
    </div>
  );
}
