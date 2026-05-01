'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useGame } from '@/store/gameStore';
import { calcularPuntosClase } from '@/lib/gameEngine';
import { generarAnalisis } from '@/lib/analytics';
import { updatePlayers, savePartida } from '@/lib/storage';
import HPBar from '@/components/game/HPBar';
import RoundHistory from '@/components/game/RoundHistory';
import Button from '@/components/ui/Button';
import CutContainer from '@/components/ui/CutContainer';

export default function GameOverScreen() {
  const { state, initGame, reset } = useGame();
  const { jugadores, historialRondas, finPartida, modo, golpePerfectoOcurrido } = state;
  const savedRef = useRef(false);

  const clasificacion = useMemo(() => finPartida?.clasificacion ?? [], [finPartida]);
  const ganadores = useMemo(() => finPartida?.ganadores ?? [], [finPartida]);
  const firstGanadorId = ganadores[0] ?? '';

  const puntosClase = useMemo(
    () =>
      clasificacion.length > 0
        ? calcularPuntosClase(clasificacion, jugadores, historialRondas, modo!)
        : [],
    [clasificacion, historialRondas, jugadores, modo]
  );

  const analisis = generarAnalisis(historialRondas, jugadores, firstGanadorId);

  useEffect(() => {
    if (savedRef.current || clasificacion.length === 0 || !modo) return;
    savedRef.current = true;

    const ganadorNombre =
      jugadores.find(j => j.id === firstGanadorId)?.nombre ?? 'Tie';

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
  }, [
    clasificacion,
    firstGanadorId,
    ganadores,
    golpePerfectoOcurrido,
    historialRondas,
    jugadores,
    modo,
    puntosClase,
  ]);

  const handleRevancha = () => {
    const nombres = jugadores.map(j => j.nombre);
    initGame(nombres, modo!);
  };

  const ganadorTexto =
    ganadores.length === 0
      ? 'Total tie'
      : ganadores.length === 1
        ? jugadores.find(j => j.id === firstGanadorId)?.nombre
        : ganadores.map(id => jugadores.find(j => j.id === id)?.nombre).join(', ');

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] px-4 py-6 animate-fade-in">
      <div className="mx-auto flex max-w-md flex-col gap-5">
        <header className="flex items-center justify-between">
          <button
            onClick={() => reset()}
            className="font-display text-sm font-semibold tracking-[0.18em] uppercase"
          >
            blacknumbers
          </button>
        </header>

        <div className="text-center">
          <p className="text-[10px] tracking-[0.24em] text-neutral-500 uppercase">
            Game Over
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-[0.16em] uppercase">
            {ganadorTexto}
          </h1>
          <p className="mt-3 text-sm text-neutral-500">
            {ganadores.length > 1 ? 'Tie for first place' : 'Final result'}
          </p>
        </div>

        <section>
          <p className="mb-3 text-[10px] tracking-[0.18em] text-neutral-500 uppercase">
            Final standings
          </p>
          <div className="flex flex-col gap-2">
            {clasificacion.map(c => {
              const j = jugadores.find(x => x.id === c.jugadorId)!;
              const pts = puntosClase.find(p => p.jugadorId === c.jugadorId)?.puntos ?? 0;
              const isGanador = ganadores.includes(c.jugadorId);

              return (
                <CutContainer key={c.jugadorId} active={isGanador} hoverEffect={false}>
                  <div className="px-4 py-3">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="w-7 text-center font-mono-game text-xl">
                        {c.puesto}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-sm font-medium ${j.eliminado ? 'line-through text-neutral-400' : ''}`}>
                          {j.nombre}
                        </p>
                        <HPBar hp={c.hp} hpMax={j.hpMax} className="mt-2" />
                      </div>
                      <div className="shrink-0 text-right">
                        <p className={`font-mono-game text-xs ${pts >= 0 ? 'text-black' : 'text-red-700'}`}>
                          {pts >= 0 ? `+${pts}` : pts} CP
                        </p>
                        <p className="mt-1 font-mono-game text-xs text-neutral-500">
                          {c.hp} HP
                        </p>
                      </div>
                    </div>
                  </div>
                </CutContainer>
              );
            })}
          </div>
        </section>

        <CutContainer hoverEffect={false}>
          <div className="px-4 py-4">
            <p className="mb-2 text-[10px] tracking-[0.18em] text-neutral-500 uppercase">
              Analysis
            </p>
            <p className="text-sm leading-relaxed text-neutral-600">{analisis}</p>
          </div>
        </CutContainer>

        <CutContainer hoverEffect={false}>
          <div className="px-4 py-4">
            <p className="mb-3 text-[10px] tracking-[0.18em] text-neutral-500 uppercase">
              Full history
            </p>
            <RoundHistory historial={historialRondas} jugadores={jugadores} />
          </div>
        </CutContainer>

        <div className="flex flex-col gap-3 pb-4">
          <Button size="lg" onClick={handleRevancha}>
            Rematch
          </Button>
          <Button variant="secondary" size="md" onClick={() => reset()}>
            Main menu
          </Button>
        </div>
      </div>
    </div>
  );
}
