'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { useGame } from '@/store/gameStore';
import { getExpulsados } from '@/lib/storage';

export default function HomeScreen() {
  const { navigate } = useGame();
  const [expulsados] = useState<string[]>(() => {
    try {
      return getExpulsados();
    } catch {
      return [];
    }
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-14 px-6 animate-fade-in">
      {expulsados.length > 0 && (
        <div className="absolute top-6 flex w-full max-w-sm flex-col gap-2 px-6">
          {expulsados.map(nombre => (
            <div
              key={nombre}
              className="border border-red-200 bg-red-50 px-4 py-2 text-center text-[11px] tracking-[0.16em] text-red-700 uppercase"
            >
              Expulsado - {nombre}
            </div>
          ))}
        </div>
      )}

      <div className="text-center">
        <h1 className="font-display text-5xl font-semibold tracking-[0.22em] uppercase sm:text-6xl">
          blacknumbers
        </h1>
        <p className="mt-4 text-xs tracking-[0.26em] text-neutral-500 uppercase">
          Alto / bajo / umbral
        </p>
      </div>

      <div className="h-px w-28 bg-neutral-300" />

      <div className="flex flex-col items-center gap-3">
        <Button size="lg" onClick={() => navigate('modeSelect')}>
          Nueva partida
        </Button>
        <Button variant="secondary" size="md" onClick={() => navigate('leaderboard')}>
          Clasificacion
        </Button>
      </div>

      <p className="absolute bottom-6 text-[10px] tracking-[0.3em] text-neutral-400 uppercase">
        black numbers only
      </p>
    </div>
  );
}
