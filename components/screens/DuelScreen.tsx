'use client';

import { useState } from 'react';
import { useGame } from '@/store/gameStore';
import NumberGrid from '@/components/game/NumberGrid';
import RoundHistory from '@/components/game/RoundHistory';
import HPBar from '@/components/game/HPBar';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

export default function DuelScreen() {
  const { state, confirmSelection, navigate } = useGame();
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showAbandon, setShowAbandon] = useState(false);

  const hotSeatPhase = state.hotSeatPhase;
  if (!hotSeatPhase || hotSeatPhase.type !== 'selecting') return null;

  const currentIdx = hotSeatPhase.jugadorIndex;
  const currentPlayer = state.jugadores[currentIdx];

  // SECURITY: rivals only receive name + eliminado — no HP, no numeroSeleccionado in DOM
  const rivals = state.jugadores
    .filter((_, i) => i !== currentIdx)
    .map(j => ({ id: j.id, nombre: j.nombre, eliminado: j.eliminado }));

  const { rondaActual, totalRondas, rondaConfig, historialRondas, modo, jugadores } = state;

  const activeCount = jugadores.filter(j => !j.eliminado).length;

  const handleSelect = (n: number) => {
    if (!confirmed) setSelectedNumber(n);
  };

  const handleConfirm = () => {
    if (selectedNumber === null || confirmed) return;
    setConfirmed(true);
    confirmSelection(selectedNumber);
  };

  return (
    <div
      className="flex flex-col h-screen"
      style={{ background: 'var(--color-bg-primary)' }}
    >
      {/* ── Rivals top bar ────────────────────────────────── */}
      <div
        className="shrink-0 px-3 py-2 flex flex-col gap-2"
        style={{
          background: 'var(--color-bg-secondary)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        {rivals.map(r => (
          <div key={r.id} className="flex items-center gap-3">
            <span
              className="font-display text-sm flex-1 truncate"
              style={{
                color: r.eliminado ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
                textDecoration: r.eliminado ? 'line-through' : 'none',
              }}
            >
              {r.nombre}
              {r.eliminado && (
                <span className="ml-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  ELIMINADO
                </span>
              )}
            </span>
            <span className="font-mono-game text-xs" style={{ color: 'var(--color-text-muted)' }}>
              HP: ???
            </span>
            <div className="hp-bar w-20">
              <div
                className="h-full rounded-[5px]"
                style={{ background: '#333344', width: '100%' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Scrollable middle ─────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4 flex flex-col gap-5 max-w-2xl mx-auto">
          {/* Round header */}
          <div className="text-center">
            <p
              className="font-display text-sm tracking-widest"
              style={{ color: 'var(--color-text-muted)' }}
            >
              RONDA {rondaActual} DE {totalRondas} ·{' '}
              {modo === 'clasico' ? 'Clásico' : 'Escalada'} · Umbral:{' '}
              {rondaConfig.umbral}
            </p>
            {modo === 'escalada' && (
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                Rango disponible esta ronda: {rondaConfig.rangoMin}–{rondaConfig.rangoMax}
              </p>
            )}
          </div>

          {/* Number grid */}
          <NumberGrid
            rangoMin={rondaConfig.rangoMin}
            rangoMax={rondaConfig.rangoMax}
            selected={selectedNumber}
            confirmed={confirmed}
            onSelect={handleSelect}
          />

          {/* Reveal zone: ? markers */}
          <div className="flex flex-col items-center gap-2">
            <p
              className="font-display text-xs tracking-widest"
              style={{ color: 'var(--color-text-muted)' }}
            >
              NÚMEROS ELEGIDOS
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              {Array.from({ length: activeCount }).map((_, i) => (
                <div
                  key={i}
                  className="w-14 h-14 rounded flex items-center justify-center font-mono-game text-2xl"
                  style={{
                    background: 'var(--color-bg-number)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  ?
                </div>
              ))}
            </div>
          </div>

          {/* History */}
          <div>
            <p
              className="font-display text-xs tracking-widest mb-3"
              style={{ color: 'var(--color-text-muted)' }}
            >
              HISTORIAL
            </p>
            <div
              className="rounded p-3"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
              }}
            >
              <RoundHistory historial={historialRondas} jugadores={jugadores} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Current player footer ──────────────────────────── */}
      <div
        className="shrink-0 px-4 py-4 flex flex-col gap-3"
        style={{
          borderTop: '1px solid var(--color-border-strong)',
          background: 'var(--color-bg-secondary)',
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="font-display text-base font-semibold flex-1 truncate"
            style={{ color: 'var(--color-accent-gold)' }}
          >
            {currentPlayer.nombre}
          </span>
          <span
            className="font-mono-game text-sm shrink-0"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {currentPlayer.hp}/{currentPlayer.hpMax} HP
          </span>
        </div>
        <HPBar hp={currentPlayer.hp} hpMax={currentPlayer.hpMax} />

        <div className="flex gap-3 items-center">
          <Button variant="ghost" size="sm" onClick={() => setShowAbandon(true)}>
            ⏸
          </Button>
          <Button
            size="md"
            className="flex-1"
            disabled={selectedNumber === null || confirmed}
            onClick={handleConfirm}
          >
            {confirmed
              ? '✓ CONFIRMADO'
              : selectedNumber === null
                ? 'Selecciona un número'
                : `CONFIRMAR — ${selectedNumber}`}
          </Button>
        </div>
      </div>

      {/* Abandon modal */}
      <Modal open={showAbandon} onClose={() => setShowAbandon(false)}>
        <div className="p-6 flex flex-col gap-4">
          <h3
            className="font-display text-lg tracking-wider"
            style={{ color: 'var(--color-accent-gold)' }}
          >
            ¿Abandonar la partida?
          </h3>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            La partida no se guardará. No se otorgarán puntos ni consecuencias.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Button variant="secondary" onClick={() => setShowAbandon(false)}>
              Continuar jugando
            </Button>
            <Button variant="danger" onClick={() => navigate('home')}>
              Abandonar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
