'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { useGame } from '@/store/gameStore';
import { GameMode } from '@/lib/types';
import { HP_CONFIG, calcularUmbral } from '@/lib/gameEngine';

const MAX_NAME_LENGTH = 16;

export default function ModeSelectScreen() {
  const { navigate, initGame } = useGame();
  const [nPlayers, setNPlayers] = useState(2);
  const [names, setNames] = useState<string[]>(['', '', '', '', '']);
  const [modo, setModo] = useState<GameMode>('clasico');

  const activePlayers = nPlayers;
  const activeNames = names.slice(0, activePlayers);
  const canStart = activeNames.every(n => n.trim().length > 0);

  const handleStart = () => {
    if (!canStart) return;
    initGame(activeNames.map(n => n.trim()), modo);
  };

  const umbral = calcularUmbral(nPlayers, 10);
  const hp = HP_CONFIG[nPlayers] ?? 10;

  return (
    <div
      className="min-h-screen flex flex-col items-center py-10 px-4 gap-8 animate-fade-in"
      style={{ background: 'var(--color-bg-primary)' }}
    >
      <div className="w-full max-w-lg flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('home')}>
            ← Volver
          </Button>
          <h2
            className="font-display text-xl tracking-widest"
            style={{ color: 'var(--color-accent-gold)' }}
          >
            NUEVA PARTIDA
          </h2>
        </div>

        {/* Player count */}
        <div
          className="p-4 rounded flex flex-col gap-3"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <label
            className="font-display text-xs tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            NÚMERO DE JUGADORES
          </label>
          <div className="flex gap-2">
            {[2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => setNPlayers(n)}
                className="flex-1 py-3 font-display text-lg tracking-wider transition-all"
                style={{
                  background: nPlayers === n ? 'var(--color-accent-gold-dim)' : 'transparent',
                  border:
                    nPlayers === n
                      ? '1px solid var(--color-accent-gold)'
                      : '1px solid var(--color-border)',
                  color: nPlayers === n ? 'var(--color-accent-gold)' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                }}
              >
                {n}
              </button>
            ))}
          </div>

          {/* Config preview */}
          <div
            className="flex gap-4 text-xs font-mono-game mt-1 pt-3"
            style={{
              borderTop: '1px solid var(--color-border)',
              color: 'var(--color-text-muted)',
            }}
          >
            <span>HP inicial: {hp}</span>
            <span>Umbral clásico: {umbral}</span>
            <span>Rondas: 5</span>
          </div>
        </div>

        {/* Names */}
        <div
          className="p-4 rounded flex flex-col gap-3"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <label
            className="font-display text-xs tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            NOMBRES DE JUGADORES
          </label>
          {Array.from({ length: activePlayers }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Jugador {i + 1}
              </span>
              <input
                type="text"
                value={names[i]}
                maxLength={MAX_NAME_LENGTH}
                placeholder={`Jugador ${i + 1}`}
                onChange={e => {
                  const next = [...names];
                  next[i] = e.target.value;
                  setNames(next);
                }}
                className="px-3 py-2 text-sm outline-none transition-all"
                style={{
                  background: 'var(--color-bg-primary)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'inherit',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = 'var(--color-border-strong)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
              />
            </div>
          ))}
        </div>

        {/* Mode */}
        <div
          className="p-4 rounded flex flex-col gap-3"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <label
            className="font-display text-xs tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            MODO DE JUEGO
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                {
                  id: 'clasico',
                  label: 'Clásico',
                  desc: 'Rango fijo 1–10. Umbral constante.',
                },
                {
                  id: 'escalada',
                  label: 'Escalada',
                  desc: 'Rango y umbral crecen cada ronda.',
                },
              ] as { id: GameMode; label: string; desc: string }[]
            ).map(m => (
              <button
                key={m.id}
                onClick={() => setModo(m.id)}
                className="p-4 text-left transition-all"
                style={{
                  background: modo === m.id ? 'var(--color-accent-gold-dim)' : 'transparent',
                  border:
                    modo === m.id
                      ? '1px solid var(--color-accent-gold)'
                      : '1px solid var(--color-border)',
                  cursor: 'pointer',
                }}
              >
                <div
                  className="font-display text-sm tracking-wider mb-1"
                  style={{
                    color:
                      modo === m.id ? 'var(--color-accent-gold)' : 'var(--color-text-primary)',
                  }}
                >
                  {m.label}
                </div>
                <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {m.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Start */}
        <Button size="lg" disabled={!canStart} onClick={handleStart} className="w-full">
          {canStart ? 'Comenzar partida →' : 'Rellena todos los nombres'}
        </Button>
      </div>
    </div>
  );
}
