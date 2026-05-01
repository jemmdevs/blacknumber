'use client';

import Button from '@/components/ui/Button';

interface HotSeatTransitionProps {
  type: 'player' | 'reveal';
  playerName?: string;
  onContinue: () => void;
}

export default function HotSeatTransition({
  type,
  playerName,
  onContinue,
}: HotSeatTransitionProps) {
  const isReveal = type === 'reveal';

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-10 bg-[var(--color-bg-primary)] px-6 animate-fade-in">
      <div className="text-center">
        <p className="mb-3 text-xs tracking-[0.28em] text-neutral-500 uppercase">
          {isReveal ? 'Everyone can look' : 'Turn of'}
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-[0.18em] uppercase sm:text-5xl">
          {isReveal ? 'Reveal' : playerName}
        </h1>
        <p className="mt-5 max-w-xs text-sm leading-relaxed text-neutral-500">
          {isReveal
            ? 'Numbers are revealed simultaneously.'
            : `Pass the phone to ${playerName}. Everyone else, look away.`}
        </p>
      </div>

      <Button size="lg" onClick={onContinue}>
        {isReveal ? 'Reveal numbers' : "I'm ready"}
      </Button>
    </div>
  );
}
