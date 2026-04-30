'use client';

import { useState } from 'react';
import { RondaRecord, Player, FinPartidaResult } from '@/lib/types';
import NumberReveal from './NumberReveal';
import HPBar from './HPBar';
import Button from '@/components/ui/Button';

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

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-y-auto animate-fade-in"
      style={{ background: 'var(--color-bg-primary)' }}
    >
      <div className="flex-1 flex flex-col items-center justify-start py-8 px-4 gap-6 max-w-2xl mx-auto w-full">
        {/* Header */}
        <h2
          className="font-display text-2xl font-bold tracking-widest"
          style={{ color: 'var(--color-accent-gold)' }}
        >
          RONDA {ronda.ronda}
        </h2>

        {/* Reveal */}
        <div
          className="w-full p-6 rounded"
          style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
          }}
        >
          <NumberReveal
            ronda={ronda}
            jugadores={jugadores}
            onAnimationEnd={() => setAnimDone(true)}
          />
        </div>

        {/* HP Status */}
        {animDone && (
          <div className="w-full animate-slide-up">
            <h3
              className="font-display text-xs tracking-widest mb-3"
              style={{ color: 'var(--color-text-muted)' }}
            >
              ESTADO DE HP
            </h3>
            <div className="flex flex-col gap-2">
              {jugadores.map(j => {
                const isWinner = ronda.ganadores.includes(j.id);
                const dano = ronda.danos.find(d => d.jugadorId === j.id);
                const isGolpeado =
                  ronda.golpePerfecto && j.id === ronda.jugadorGolpeado;

                return (
                  <div
                    key={j.id}
                    className="flex items-center gap-3 px-3 py-2 rounded"
                    style={{
                      background: 'var(--color-bg-secondary)',
                      border: isWinner
                        ? '1px solid var(--color-border-strong)'
                        : '1px solid var(--color-border)',
                      opacity: j.eliminado ? 0.5 : 1,
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="font-display text-sm"
                          style={{
                            color: isWinner
                              ? 'var(--color-accent-gold)'
                              : 'var(--color-text-primary)',
                          }}
                        >
                          {j.nombre}
                          {isWinner && (
                            <span
                              className="ml-2 text-xs"
                              style={{ color: 'var(--color-accent-gold)' }}
                            >
                              ★ GANA
                            </span>
                          )}
                          {j.eliminado && (
                            <span
                              className="ml-2 text-xs"
                              style={{ color: 'var(--color-world-low-text)' }}
                            >
                              ✗ ELIMINADO
                            </span>
                          )}
                        </span>
                        <div className="flex items-center gap-2">
                          {dano && dano.cantidad > 0 && (
                            <span
                              className="font-mono-game text-xs"
                              style={{
                                color: isGolpeado ? '#ff6600' : 'var(--color-world-low-text)',
                                fontWeight: isGolpeado ? 700 : 400,
                              }}
                            >
                              −{dano.cantidad}
                              {isGolpeado && ' ⚡×2'}
                            </span>
                          )}
                          <span
                            className="font-mono-game text-xs"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            {j.hp}/{j.hpMax}
                          </span>
                        </div>
                      </div>
                      <HPBar hp={j.hp} hpMax={j.hpMax} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action button */}
        {animDone && (
          <div className="animate-slide-up">
            {finPartida ? (
              <Button size="lg" onClick={onEndGame}>
                Ver resultado final →
              </Button>
            ) : (
              <Button size="lg" onClick={onNextRound}>
                Siguiente ronda →
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
