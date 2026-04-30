'use client';

import { useEffect, useState } from 'react';
import { RondaRecord, Player } from '@/lib/types';

interface NumberRevealProps {
  ronda: RondaRecord | null;
  jugadores: Player[];
  onAnimationEnd?: () => void;
}

type Phase = 'idle' | 'flashing' | 'numbers' | 'counting' | 'world' | 'winner' | 'done';

export default function NumberReveal({ ronda, jugadores, onAnimationEnd }: NumberRevealProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [displayedSum, setDisplayedSum] = useState(0);

  useEffect(() => {
    if (!ronda) {
      setPhase('idle');
      setDisplayedSum(0);
      return;
    }

    setPhase('flashing');
    const t1 = setTimeout(() => setPhase('numbers'), 500);
    const t2 = setTimeout(() => {
      setPhase('counting');
      const target = ronda.suma;
      const duration = 600;
      const steps = 30;
      const increment = target / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          setDisplayedSum(target);
          clearInterval(interval);
          setTimeout(() => {
            setPhase('world');
            setTimeout(() => {
              setPhase('winner');
              setTimeout(() => {
                setPhase('done');
                onAnimationEnd?.();
              }, 600);
            }, 400);
          }, 200);
        } else {
          setDisplayedSum(Math.round(current));
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }, 900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [ronda]);

  if (!ronda) {
    const n = jugadores.filter(j => !j.eliminado).length;
    return (
      <div className="flex justify-center gap-4 py-3">
        {Array.from({ length: n }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1"
          >
            <div
              className="w-14 h-14 rounded flex items-center justify-center font-mono-game text-2xl"
              style={{
                background: 'var(--color-bg-number)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
              }}
            >
              ?
            </div>
          </div>
        ))}
      </div>
    );
  }

  const isAlto = ronda.mundo === 'alto';
  const worldColor = isAlto ? 'var(--color-world-high-text)' : 'var(--color-world-low-text)';
  const worldBg = isAlto ? 'var(--color-world-high-bg)' : 'var(--color-world-low-bg)';

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Numbers row */}
      <div className="flex flex-wrap justify-center gap-3">
        {ronda.numeros.map((n, i) => {
          const jugador = jugadores.find(j => j.id === n.jugadorId);
          const isWinner = ronda.ganadores.includes(n.jugadorId);
          const dano = ronda.danos.find(d => d.jugadorId === n.jugadorId);
          const showNumber = phase !== 'idle' && phase !== 'flashing';

          return (
            <div key={n.jugadorId} className="flex flex-col items-center gap-1">
              <div
                className="w-14 h-14 rounded flex items-center justify-center font-mono-game text-2xl relative"
                style={{
                  background: 'var(--color-bg-number)',
                  border: isWinner && phase === 'winner'
                    ? '2px solid var(--color-accent-gold)'
                    : '1px solid var(--color-border)',
                  boxShadow:
                    isWinner && phase === 'winner'
                      ? '0 0 14px var(--color-accent-gold-glow)'
                      : 'none',
                  transform: isWinner && phase === 'winner' ? 'scale(1.2)' : 'scale(1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease',
                  color: showNumber
                    ? isWinner
                      ? 'var(--color-accent-gold)'
                      : 'var(--color-text-primary)'
                    : 'var(--color-text-muted)',
                  animation: phase === 'flashing' ? 'numberReveal 0.5s ease' : undefined,
                }}
              >
                {showNumber ? n.valor : '?'}
                {dano && dano.cantidad > 0 && phase === 'winner' && (
                  <span
                    className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono-game text-sm font-bold animate-float-damage"
                    style={{
                      color:
                        ronda.golpePerfecto && n.jugadorId === ronda.jugadorGolpeado
                          ? '#ff6600'
                          : 'var(--color-world-low-text)',
                      animationDelay: `${i * 100}ms`,
                    }}
                  >
                    −{dano.cantidad}
                  </span>
                )}
              </div>
              <span
                className="text-xs font-display tracking-wide"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {jugador?.nombre ?? '?'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Sum + World */}
      {phase !== 'idle' && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <span
              className="font-mono-game"
              style={{
                fontSize: '48px',
                color:
                  phase === 'counting' || phase === 'world' || phase === 'winner' || phase === 'done'
                    ? worldColor
                    : 'var(--color-text-secondary)',
                transition: 'color 0.3s ease',
              }}
            >
              {phase === 'counting' || phase === 'numbers' ? displayedSum : ronda.suma}
            </span>
            <span
              className="font-mono-game text-lg"
              style={{ color: 'var(--color-text-muted)' }}
            >
              / {ronda.umbral}
            </span>
          </div>

          {(phase === 'world' || phase === 'winner' || phase === 'done') && (
            <div
              className="world-badge animate-fade-in"
              style={{
                background: worldBg,
                color: worldColor,
                border: `1px solid ${worldColor}44`,
                fontSize: '14px',
                letterSpacing: '0.1em',
              }}
            >
              {isAlto ? 'SUMA ≤ UMBRAL — ALTO GANA ↑' : 'SUMA > UMBRAL — BAJO GANA ↓'}
            </div>
          )}
        </div>
      )}

      {/* Perfect Strike overlay */}
      {ronda.golpePerfecto && phase === 'winner' && (
        <div
          className="text-center animate-scale-in"
          style={{
            background: '#2a1f00',
            border: '1px solid var(--color-accent-gold)',
            padding: '12px 24px',
          }}
        >
          <div
            className="font-display text-xl font-bold tracking-widest"
            style={{ color: 'var(--color-accent-gold)' }}
          >
            ⚡ GOLPE PERFECTO ⚡
          </div>
          <div className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            El jugador del 10 recibe doble daño
          </div>
        </div>
      )}
    </div>
  );
}
