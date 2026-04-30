'use client';

import { useEffect, useRef } from 'react';
import { useGame } from '@/store/gameStore';
import { calcularPuntosClase } from '@/lib/gameEngine';
import { generarAnalisis } from '@/lib/analytics';
import { updatePlayers, savePartida } from '@/lib/storage';
import HPBar from '@/components/game/HPBar';
import RoundHistory from '@/components/game/RoundHistory';
import Button from '@/components/ui/Button';

export default function GameOverScreen() {
  const { state, navigate, initGame, reset } = useGame();
  const { jugadores, historialRondas, finPartida, modo, golpePerfectoOcurrido } = state;
  const savedRef = useRef(false);

  const clasificacion = finPartida?.clasificacion ?? [];
  const ganadores = finPartida?.ganadores ?? [];
  const firstGanadorId = ganadores[0] ?? '';

  const puntosClase = clasificacion.length > 0
    ? calcularPuntosClase(clasificacion, jugadores, historialRondas, modo!)
    : [];

  const analisis = generarAnalisis(historialRondas, jugadores, firstGanadorId);

  useEffect(() => {
    if (savedRef.current || clasificacion.length === 0 || !modo) return;
    savedRef.current = true;

    const ganadorNombre =
      jugadores.find(j => j.id === firstGanadorId)?.nombre ?? 'Empate';

    const puntosUpdates = puntosClase.map(p => {
      const j = jugadores.find(x => x.id === p.jugadorId)!;
      const esPrimero = ganadores.includes(p.jugadorId);
      return { nombre: j.nombre, puntos: p.puntos, esPrimero };
    });

    try {
      updatePlayers(puntosUpdates);
      savePartida({
        fecha: new Date().toISOString(),
        jugadores: jugadores.map(j => j.nombre),
        modo,
        nJugadores: jugadores.length,
        clasificacion: clasificacion.map(c => {
          const j = jugadores.find(x => x.id === c.jugadorId)!;
          return { nombre: j.nombre, hp: c.hp, puesto: c.puesto };
        }),
        ganador: ganadorNombre,
        puntosClase: puntosClase.map(p => {
          const j = jugadores.find(x => x.id === p.jugadorId)!;
          return { nombre: j.nombre, puntos: p.puntos };
        }),
        rondasJugadas: historialRondas,
        golpePerfecto: golpePerfectoOcurrido,
      });
    } catch {
      // localStorage not available
    }
  }, []);

  const handleRevancha = () => {
    const nombres = jugadores.map(j => j.nombre);
    initGame(nombres, modo!);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center py-10 px-4 gap-8 animate-fade-in"
      style={{ background: 'var(--color-bg-primary)' }}
    >
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {/* Title */}
        <div className="text-center">
          <h1
            className="font-display text-3xl sm:text-4xl font-bold tracking-widest"
            style={{ color: 'var(--color-accent-gold)' }}
          >
            FIN DE PARTIDA
          </h1>
          {ganadores.length === 0 ? (
            <p className="mt-2" style={{ color: 'var(--color-text-secondary)' }}>
              Empate total — nadie gana
            </p>
          ) : ganadores.length === 1 ? (
            <p className="mt-2 font-display text-lg" style={{ color: 'var(--color-text-primary)' }}>
              Ganador:{' '}
              <span style={{ color: 'var(--color-accent-gold)' }}>
                {jugadores.find(j => j.id === firstGanadorId)?.nombre}
              </span>
            </p>
          ) : (
            <p className="mt-2 font-display" style={{ color: 'var(--color-text-secondary)' }}>
              Empate entre:{' '}
              {ganadores
                .map(id => jugadores.find(j => j.id === id)?.nombre)
                .join(', ')}
            </p>
          )}
        </div>

        {/* Clasificación */}
        <div
          className="p-4 rounded flex flex-col gap-2"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <h2
            className="font-display text-xs tracking-widest mb-2"
            style={{ color: 'var(--color-text-muted)' }}
          >
            CLASIFICACIÓN FINAL
          </h2>
          {clasificacion.map(c => {
            const j = jugadores.find(x => x.id === c.jugadorId)!;
            const pts = puntosClase.find(p => p.jugadorId === c.jugadorId)?.puntos ?? 0;
            const isGanador = ganadores.includes(c.jugadorId);

            return (
              <div
                key={c.jugadorId}
                className="flex items-center gap-3 px-3 py-3 rounded"
                style={{
                  background: isGanador ? 'var(--color-accent-gold-dim)' : 'transparent',
                  border: isGanador
                    ? '1px solid var(--color-border-strong)'
                    : '1px solid transparent',
                  opacity: j.eliminado ? 0.6 : 1,
                }}
              >
                <span
                  className="font-mono-game text-2xl w-8 text-center"
                  style={{
                    color: isGanador ? 'var(--color-accent-gold)' : 'var(--color-text-muted)',
                  }}
                >
                  {c.puesto}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="font-display truncate"
                      style={{
                        color: isGanador
                          ? 'var(--color-accent-gold)'
                          : 'var(--color-text-primary)',
                        textDecoration: j.eliminado ? 'line-through' : 'none',
                      }}
                    >
                      {j.nombre}
                      {j.eliminado && (
                        <span
                          className="ml-2 text-xs"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          ELIMINADO
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className="font-mono-game text-xs"
                        style={{
                          color: pts >= 0 ? 'var(--color-world-high-text)' : '#f87171',
                        }}
                      >
                        {pts >= 0 ? `+${pts}` : pts} PC
                      </span>
                      <span
                        className="font-mono-game text-sm"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {c.hp} HP
                      </span>
                    </div>
                  </div>
                  <HPBar hp={c.hp} hpMax={j.hpMax} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Analysis */}
        <div
          className="p-4 rounded"
          style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
            borderLeft: '3px solid var(--color-accent-gold)',
          }}
        >
          <h2
            className="font-display text-xs tracking-widest mb-2"
            style={{ color: 'var(--color-text-muted)' }}
          >
            ANÁLISIS PSICOLÓGICO
          </h2>
          <p
            className="text-base leading-relaxed"
            style={{
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-crimson-pro), serif',
              fontStyle: 'italic',
            }}
          >
            {analisis}
          </p>
        </div>

        {/* Round history */}
        <div
          className="p-4 rounded"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <h2
            className="font-display text-xs tracking-widest mb-3"
            style={{ color: 'var(--color-text-muted)' }}
          >
            HISTORIAL COMPLETO
          </h2>
          <RoundHistory historial={historialRondas} jugadores={jugadores} />
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap justify-center">
          <Button size="md" onClick={handleRevancha}>
            Revancha
          </Button>
          <Button variant="secondary" size="md" onClick={() => { reset(); }}>
            Menú principal
          </Button>
          <Button variant="secondary" size="md" onClick={() => navigate('leaderboard')}>
            Clasificación
          </Button>
        </div>
      </div>
    </div>
  );
}
