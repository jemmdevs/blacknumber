'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { useGame } from '@/store/gameStore';
import RulesOverlay from './RulesOverlay';

export default function HomeScreen() {
  const { navigate } = useGame();
  const [showRules, setShowRules] = useState(false);

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center gap-14 px-6 animate-fade-in">
        <button
          type="button"
          onClick={() => setShowRules(true)}
          aria-label="Rules"
          className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center bg-black font-mono-game text-sm text-white"
        >
          ?
        </button>

        <div className="text-center">
          <h1 className="font-display text-5xl font-semibold tracking-[0.22em] uppercase sm:text-6xl">
            blacknumbers
          </h1>
          <p className="mt-4 text-xs tracking-[0.26em] text-neutral-500 uppercase">
            High / low / threshold
          </p>
        </div>

        <div className="h-px w-28 bg-neutral-300" />

        <div className="flex flex-col items-center gap-3">
          <Button size="lg" onClick={() => navigate('modeSelect')}>
            New game
          </Button>
        </div>

        <p className="absolute bottom-6 text-[10px] tracking-[0.3em] text-neutral-400 uppercase">
          black numbers only
        </p>
      </div>

      {showRules && <RulesOverlay onClose={() => setShowRules(false)} />}
    </>
  );
}
