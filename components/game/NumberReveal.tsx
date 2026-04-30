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
    const timers: ReturnType<typeof setTimeout>[] = [];
    let interval: ReturnType<typeof setInterval> | null = null;

    if (!ronda) {
      timers.push(setTimeout(() => {
        setPhase('idle');
        setDisplayedSum(0);
      }, 0));
      return () => timers.forEach(timer => clearTimeout(timer));
    }

    timers.push(setTimeout(() => setPhase('flashing'), 0));
    timers.push(setTimeout(() => setPhase('numbers'), 450));
    timers.push(setTimeout(() => {
      setPhase('counting');
      const target = ronda.suma;
      const duration = 550;
      const steps = 25;
      const increment = target / steps;
      let current = 0;
      interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          setDisplayedSum(target);
          if (interval) clearInterval(interval);
          setTimeout(() => {
            setPhase('world');
            setTimeout(() => {
              setPhase('winner');
              setTimeout(() => {
                setPhase('done');
                onAnimationEnd?.();
              }, 500);
            }, 350);
          }, 180);
        } else {
          setDisplayedSum(Math.round(current));
        }
      }, duration / steps);
    }, 850));

    return () => {
      timers.forEach(timer => clearTimeout(timer));
      if (interval) clearInterval(interval);
    };
  }, [ronda, onAnimationEnd]);

  if (!ronda) {
    const n = jugadores.filter(j => !j.eliminado).length;
    return (
      <div className="flex justify-center gap-2 py-2">
        {Array.from({ length: n }).map((_, i) => (
          <div
            key={i}
            className="flex h-12 w-12 items-center justify-center bg-[var(--color-bg-number)] font-mono-game text-xl text-neutral-400"
          >
            ?
          </div>
        ))}
      </div>
    );
  }

  const isAlto = ronda.mundo === 'alto';
  const worldColor = isAlto ? 'var(--color-world-high-text)' : 'var(--color-world-low-text)';
  const worldBg = isAlto ? 'var(--color-world-high-bg)' : 'var(--color-world-low-bg)';

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-wrap justify-center gap-2">
        {ronda.numeros.map((n, i) => {
          const jugador = jugadores.find(j => j.id === n.jugadorId);
          const isWinner = ronda.ganadores.includes(n.jugadorId);
          const dano = ronda.danos.find(d => d.jugadorId === n.jugadorId);
          const showNumber = phase !== 'idle' && phase !== 'flashing';

          return (
            <div key={n.jugadorId} className="flex flex-col items-center gap-1">
              <div
                className="relative flex h-14 w-14 items-center justify-center font-mono-game text-2xl transition-all"
                style={{
                  background: isWinner && phase === 'winner' ? '#0a0a0a' : 'var(--color-bg-number)',
                  border: isWinner && phase === 'winner'
                    ? '2px solid #0a0a0a'
                    : '1px solid var(--color-border)',
                  transform: isWinner && phase === 'winner' ? 'translateY(-2px)' : 'translateY(0)',
                  color: showNumber
                    ? isWinner && phase === 'winner'
                      ? '#ffffff'
                      : 'var(--color-text-primary)'
                    : 'var(--color-text-muted)',
                  animation: phase === 'flashing' ? 'numberReveal 0.45s ease' : undefined,
                  clipPath: 'polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)',
                }}
              >
                {showNumber ? n.valor : '?'}
                {dano && dano.cantidad > 0 && phase === 'winner' && (
                  <span
                    className="absolute -top-7 left-1/2 -translate-x-1/2 font-mono-game text-xs font-bold animate-float-damage"
                    style={{
                      color:
                        ronda.golpePerfecto && n.jugadorId === ronda.jugadorGolpeado
                          ? '#b45309'
                          : 'var(--color-world-low-text)',
                      animationDelay: `${i * 80}ms`,
                    }}
                  >
                    -{dano.cantidad}
                  </span>
                )}
              </div>
              <span className="max-w-[72px] truncate text-[10px] tracking-[0.08em] text-neutral-500">
                {jugador?.nombre ?? '?'}
              </span>
            </div>
          );
        })}
      </div>

      {phase !== 'idle' && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-baseline gap-3">
            <span
              className="font-mono-game text-5xl"
              style={{
                color:
                  phase === 'counting' || phase === 'world' || phase === 'winner' || phase === 'done'
                    ? worldColor
                    : 'var(--color-text-primary)',
              }}
            >
              {phase === 'counting' || phase === 'numbers' ? displayedSum : ronda.suma}
            </span>
            <span className="font-mono-game text-sm text-neutral-400">/ {ronda.umbral}</span>
          </div>

          {(phase === 'world' || phase === 'winner' || phase === 'done') && (
            <div
              className="world-badge animate-fade-in"
              style={{ background: worldBg, color: worldColor }}
            >
              {isAlto ? 'ALTO gana' : 'BAJO gana'}
            </div>
          )}
        </div>
      )}

      {ronda.golpePerfecto && phase === 'winner' && (
        <div className="border border-neutral-900 bg-white px-5 py-3 text-center animate-scale-in">
          <div className="font-display text-base font-semibold tracking-[0.16em] uppercase">
            Golpe perfecto
          </div>
          <div className="mt-1 text-xs text-neutral-500">
            El jugador del 10 recibe doble dano
          </div>
        </div>
      )}
    </div>
  );
}
