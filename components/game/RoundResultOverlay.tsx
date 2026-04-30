'use client';

import { useCallback, useState } from 'react';
import { RondaRecord, Player, FinPartidaResult } from '@/lib/types';
import NumberReveal from './NumberReveal';
import HPBar from './HPBar';
import Button from '@/components/ui/Button';
import CutContainer from '@/components/ui/CutContainer';

interface RoundResultOverlayProps {
  ronda: RondaRecord;
  jugadores: Player[];
  finPartida: FinPartidaResult | null;
  onNextRound: () => void;
  onEndGame: () => void;
}

export default function RoundResultOverlay({
  ronda,
  jugadores,
  finPartida,
  onNextRound,
  onEndGame,
}: RoundResultOverlayProps) {
  const [animDone, setAnimDone] = useState(false);
  const handleAnimationEnd = useCallback(() => setAnimDone(true), []);

  return (
    <div className="fixed inset-0 flex flex-col overflow-y-auto bg-[var(--color-bg-primary)] animate-fade-in">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-4 py-6">
        <div className="text-center">
          <p className="text-[10px] tracking-[0.24em] text-neutral-500 uppercase">Resultado</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-[0.18em] uppercase">
            Ronda {ronda.ronda}
          </h2>
        </div>

        <CutContainer hoverEffect={false}>
          <div className="px-4 py-6">
            <NumberReveal
              ronda={ronda}
              jugadores={jugadores}
              onAnimationEnd={handleAnimationEnd}
            />
          </div>
        </CutContainer>

        {animDone && (
          <div className="animate-slide-up">
            <p className="mb-3 text-[10px] tracking-[0.18em] text-neutral-500 uppercase">
              Estado de HP
            </p>
            <div className="flex flex-col gap-2">
              {jugadores.map(j => {
                const isWinner = ronda.ganadores.includes(j.id);
                const dano = ronda.danos.find(d => d.jugadorId === j.id);
                const isGolpeado =
                  ronda.golpePerfecto && j.id === ronda.jugadorGolpeado;

                return (
                  <CutContainer key={j.id} active={isWinner} hoverEffect={false}>
                    <div className="px-4 py-3">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className={`truncate text-sm font-medium ${j.eliminado ? 'line-through text-neutral-400' : ''}`}>
                          {j.nombre}
                          {isWinner && <span className="ml-2 text-[10px] uppercase">gana</span>}
                        </span>
                        <div className="flex shrink-0 items-center gap-2">
                          {dano && dano.cantidad > 0 && (
                            <span
                              className="font-mono-game text-xs"
                              style={{ color: isGolpeado ? '#b45309' : 'var(--color-world-low-text)' }}
                            >
                              -{dano.cantidad}{isGolpeado ? ' x2' : ''}
                            </span>
                          )}
                          <span className="font-mono-game text-xs text-neutral-500">
                            {j.hp}/{j.hpMax}
                          </span>
                        </div>
                      </div>
                      <HPBar hp={j.hp} hpMax={j.hpMax} />
                    </div>
                  </CutContainer>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {animDone && (
        <footer className="border-t border-neutral-200 bg-white px-4 py-5 animate-slide-up">
          <Button
            size="lg"
            className="w-full"
            onClick={finPartida ? onEndGame : onNextRound}
          >
            {finPartida ? 'Ver final' : 'Siguiente ronda'}
          </Button>
        </footer>
      )}
    </div>
  );
}
