'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import CutContainer from '@/components/ui/CutContainer';
import { useGame } from '@/store/gameStore';
import { GameMode } from '@/lib/types';
import { HP_CONFIG, calcularRondaConfig } from '@/lib/gameEngine';

const MAX_NAME_LENGTH = 16;
const MAX_PLAYERS = 5;

const modes: { id: GameMode; label: string; desc: string }[] = [
  {
    id: 'clasico',
    label: 'Clasico',
    desc: 'Rango fijo 1-10. El umbral se mantiene constante.',
  },
  {
    id: 'escalada',
    label: 'Escalada',
    desc: 'El rango sube cada ronda y el umbral se recalcula.',
  },
];

export default function ModeSelectScreen() {
  const { navigate, initGame } = useGame();
  const [nPlayers, setNPlayers] = useState(2);
  const [names, setNames] = useState<string[]>(['', '', '', '', '']);
  const [modo, setModo] = useState<GameMode>('clasico');

  const activeNames = names.slice(0, nPlayers);
  const canStart = activeNames.every(n => n.trim().length > 0);
  const hp = HP_CONFIG[nPlayers] ?? 10;
  const rondaConfig = calcularRondaConfig(modo, 1, nPlayers);
  const umbral = rondaConfig.umbral;

  const updateName = (index: number, value: string) => {
    const next = [...names];
    next[index] = value;
    setNames(next);
  };

  const removePlayer = (index: number) => {
    if (nPlayers <= 2) return;
    const next = [...names];
    next.splice(index, 1);
    next.push('');
    setNames(next);
    setNPlayers(nPlayers - 1);
  };

  const handleStart = () => {
    if (!canStart) return;
    initGame(activeNames.map(n => n.trim()), modo);
  };

  return (
    <div className="flex h-screen flex-col animate-fade-in">
      <header className="flex items-center justify-between border-b border-neutral-200 px-4 py-4">
        <button
          onClick={() => navigate('home')}
          className="font-display text-sm font-semibold tracking-[0.18em] uppercase"
        >
          blacknumbers
        </button>
        <div className="flex items-center gap-2 text-[10px] tracking-[0.16em] text-neutral-500 uppercase">
          <span>{nPlayers} jugadores</span>
          <span>/</span>
          <span>{modo}</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex max-w-xl flex-col gap-9">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-medium tracking-[0.18em] text-neutral-500 uppercase">
                Jugadores
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setNPlayers(c => Math.max(2, c - 1))}
                  disabled={nPlayers <= 2}
                  className="h-8 w-8 border border-neutral-300 bg-white text-lg leading-none disabled:opacity-30"
                >
                  -
                </button>
                <span className="w-5 text-center text-sm font-semibold tabular-nums">{nPlayers}</span>
                <button
                  type="button"
                  onClick={() => setNPlayers(c => Math.min(MAX_PLAYERS, c + 1))}
                  disabled={nPlayers >= MAX_PLAYERS}
                  className="h-8 w-8 border border-neutral-300 bg-white text-lg leading-none disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {Array.from({ length: nPlayers }).map((_, i) => (
                <CutContainer key={i} hoverEffect={false}>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-black font-mono-game text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <input
                      type="text"
                      value={names[i]}
                      maxLength={MAX_NAME_LENGTH}
                      placeholder={`Jugador ${i + 1}`}
                      onChange={e => updateName(i, e.target.value)}
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
                    />
                    <button
                      type="button"
                      onClick={() => removePlayer(i)}
                      disabled={nPlayers <= 2}
                      className="h-7 w-7 text-lg leading-none text-neutral-400 disabled:opacity-0"
                      aria-label="Quitar jugador"
                    >
                      x
                    </button>
                  </div>
                </CutContainer>
              ))}
            </div>
          </section>

          <section>
            <span className="mb-4 block text-xs font-medium tracking-[0.18em] text-neutral-500 uppercase">
              Modo
            </span>
            <div className="grid grid-cols-1 gap-3">
              {modes.map(mode => {
                const active = modo === mode.id;
                return (
                  <CutContainer
                    key={mode.id}
                    active={active}
                    onClick={() => setModo(mode.id)}
                  >
                    <div className="flex items-center justify-between gap-4 px-4 py-4">
                      <div>
                        <p className="font-display text-sm font-semibold tracking-[0.16em] uppercase">
                          {mode.label}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-neutral-500">{mode.desc}</p>
                      </div>
                      <span className={`h-2 w-2 shrink-0 ${active ? 'bg-black' : 'bg-neutral-300'}`} />
                    </div>
                  </CutContainer>
                );
              })}
            </div>
          </section>

          <CutContainer hoverEffect={false}>
            <div className="grid grid-cols-3 gap-3 px-4 py-4 text-center">
              <div>
                <p className="font-mono-game text-lg">{hp}</p>
                <p className="mt-1 text-[10px] tracking-[0.14em] text-neutral-500 uppercase">HP</p>
              </div>
              <div>
                <p className="font-mono-game text-lg">{umbral}</p>
                <p className="mt-1 text-[10px] tracking-[0.14em] text-neutral-500 uppercase">Umbral</p>
              </div>
              <div>
                <p className="font-mono-game text-lg">5</p>
                <p className="mt-1 text-[10px] tracking-[0.14em] text-neutral-500 uppercase">Rondas</p>
              </div>
            </div>
          </CutContainer>
        </div>
      </main>

      <footer className="border-t border-neutral-200 px-4 py-5">
        <Button size="lg" disabled={!canStart} onClick={handleStart} className="w-full">
          {canStart ? 'Comenzar partida' : 'Rellena los nombres'}
        </Button>
      </footer>
    </div>
  );
}
