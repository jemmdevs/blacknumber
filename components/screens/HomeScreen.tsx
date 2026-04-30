'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { useGame } from '@/store/gameStore';
import { getExpulsados } from '@/lib/storage';

export default function HomeScreen() {
  const { navigate } = useGame();
  const [expulsados, setExpulsados] = useState<string[]>([]);

  useEffect(() => {
    try {
      setExpulsados(getExpulsados());
    } catch {
      // localStorage not available
    }
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center h-screen gap-8 px-6 animate-fade-in"
      style={{ background: 'var(--color-bg-primary)' }}
    >
      {/* Expulsado banners */}
      {expulsados.length > 0 && (
        <div className="w-full max-w-md flex flex-col gap-2">
          {expulsados.map(nombre => (
            <div
              key={nombre}
              className="px-4 py-2 text-sm font-display tracking-wider text-center"
              style={{
                background: 'rgba(139,0,0,0.3)',
                border: '1px solid rgba(220,38,38,0.5)',
                color: '#f87171',
              }}
            >
              ESTADO: EXPULSADO — {nombre.toUpperCase()}
            </div>
          ))}
        </div>
      )}

      {/* Title */}
      <div className="text-center">
        <h1
          className="font-display font-bold tracking-[0.3em]"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', color: 'var(--color-accent-gold)' }}
        >
          THRESHOLD
        </h1>
        <p
          className="mt-3 text-lg"
          style={{
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-crimson-pro), serif',
            fontStyle: 'italic',
          }}
        >
          ¿Cuánto sabes lo que piensan los demás?
        </p>
      </div>

      {/* Decorative line */}
      <div
        className="w-32"
        style={{ height: '1px', background: 'var(--color-border-strong)' }}
      />

      {/* Actions */}
      <div className="flex flex-col gap-4 items-center">
        <Button size="lg" onClick={() => navigate('modeSelect')}>
          Nueva partida
        </Button>
        <Button variant="secondary" size="md" onClick={() => navigate('leaderboard')}>
          Clasificación
        </Button>
      </div>

      {/* Footer */}
      <p
        className="absolute bottom-6 text-xs tracking-widest"
        style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-cinzel), serif' }}
      >
        ALTO · BAJO · UMBRAL
      </p>
    </div>
  );
}
