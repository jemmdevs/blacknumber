'use client';

import { useState } from 'react';
import { useGame } from '@/store/gameStore';
import NumberGrid from '@/components/game/NumberGrid';
import RoundHistory from '@/components/game/RoundHistory';
import HPBar from '@/components/game/HPBar';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import CutContainer from '@/components/ui/CutContainer';

export default function DuelScreen() {
  const { state, confirmSelection, navigate } = useGame();
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showAbandon, setShowAbandon] = useState(false);

  const hotSeatPhase = state.hotSeatPhase;
  if (!hotSeatPhase || hotSeatPhase.type !== 'selecting') return null;

  const currentIdx = hotSeatPhase.jugadorIndex;
  const currentPlayer = state.jugadores[currentIdx];
  const rivals = state.jugadores
    .filter((_, i) => i !== currentIdx)
    .map(j => ({ id: j.id, nombre: j.nombre, eliminado: j.eliminado }));

  const { rondaActual, totalRondas, rondaConfig, historialRondas, modo, jugadores } = state;
  const activeCount = jugadores.filter(j => !j.eliminado).length;

  const handleConfirm = () => {
    if (selectedNumber === null || confirmed) return;
    setConfirmed(true);
    confirmSelection(selectedNumber);
  };

  return (
    <div className="flex h-screen flex-col bg-[var(--color-bg-primary)] animate-fade-in">
      <header className="shrink-0 border-b border-neutral-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowAbandon(true)}
            className="font-display text-sm font-semibold tracking-[0.18em] uppercase"
          >
            blacknumbers
          </button>
          <span className="text-[10px] tracking-[0.18em] text-neutral-500 uppercase">
            R{rondaActual}/{totalRondas} / {modo}
          </span>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {rivals.map(r => (
            <div
              key={r.id}
              className="min-w-[120px] flex-1 border border-neutral-200 bg-[var(--color-bg-primary)] px-3 py-2"
            >
              <p className={`truncate text-xs ${r.eliminado ? 'line-through text-neutral-400' : 'text-neutral-700'}`}>
                {r.nombre}
              </p>
              <p className="mt-1 font-mono-game text-[10px] text-neutral-400">HP: ???</p>
            </div>
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-5">
        <div className="mx-auto flex max-w-md flex-col gap-5">
          <div className="text-center">
            <p className="text-[10px] tracking-[0.22em] text-neutral-500 uppercase">
              Umbral {rondaConfig.umbral}
            </p>
            {modo === 'escalada' && (
              <p className="mt-1 text-xs text-neutral-500">
                Rango {rondaConfig.rangoMin}-{rondaConfig.rangoMax}
              </p>
            )}
          </div>

          <NumberGrid
            rangoMin={rondaConfig.rangoMin}
            rangoMax={rondaConfig.rangoMax}
            selected={selectedNumber}
            confirmed={confirmed}
            onSelect={n => !confirmed && setSelectedNumber(n)}
          />

          <CutContainer hoverEffect={false}>
            <div className="px-4 py-4">
              <p className="mb-3 text-center text-[10px] tracking-[0.18em] text-neutral-500 uppercase">
                Numeros elegidos
              </p>
              <div className="flex justify-center gap-2">
                {Array.from({ length: activeCount }).map((_, i) => (
                  <div
                    key={i}
                    className="flex h-12 w-12 items-center justify-center bg-[var(--color-bg-number)] font-mono-game text-xl text-neutral-400"
                  >
                    ?
                  </div>
                ))}
              </div>
            </div>
          </CutContainer>

          <CutContainer hoverEffect={false}>
            <div className="px-4 py-4">
              <p className="mb-3 text-[10px] tracking-[0.18em] text-neutral-500 uppercase">
                Historial
              </p>
              <RoundHistory historial={historialRondas} jugadores={jugadores} />
            </div>
          </CutContainer>
        </div>
      </main>

      <footer className="shrink-0 border-t border-neutral-200 bg-white px-4 py-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-base font-semibold tracking-[0.08em]">
              {currentPlayer.nombre}
            </p>
            <HPBar hp={currentPlayer.hp} hpMax={currentPlayer.hpMax} className="mt-2" />
          </div>
          <span className="font-mono-game text-sm text-neutral-600">
            {currentPlayer.hp}/{currentPlayer.hpMax}
          </span>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" size="md" onClick={() => setShowAbandon(true)}>
            Pausa
          </Button>
          <Button
            size="md"
            className="flex-1"
            disabled={selectedNumber === null || confirmed}
            onClick={handleConfirm}
          >
            {confirmed
              ? 'Confirmado'
              : selectedNumber === null
                ? 'Elige numero'
                : `Confirmar ${selectedNumber}`}
          </Button>
        </div>
      </footer>

      <Modal open={showAbandon} onClose={() => setShowAbandon(false)}>
        <div className="flex flex-col gap-4 p-6">
          <h3 className="font-display text-lg font-semibold tracking-[0.12em] uppercase">
            Abandonar partida
          </h3>
          <p className="text-sm leading-relaxed text-neutral-500">
            La partida no se guardara. No se otorgaran puntos.
          </p>
          <div className="flex flex-col gap-3">
            <Button variant="secondary" onClick={() => setShowAbandon(false)}>
              Seguir jugando
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
