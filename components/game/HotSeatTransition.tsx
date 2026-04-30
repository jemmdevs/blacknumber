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
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-8 animate-fade-in"
      style={{ background: '#000000' }}
    >
      {/* Icon */}
      <div style={{ color: 'var(--color-text-muted)' }}>
        {isReveal ? (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ) : (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        )}
      </div>

      {/* Title */}
      <div className="text-center px-6">
        {isReveal ? (
          <>
            <h1
              className="font-display text-4xl sm:text-5xl font-bold tracking-widest mb-3"
              style={{ color: 'var(--color-accent-gold)' }}
            >
              ¡MOMENTO DE LA VERDAD!
            </h1>
            <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              Todos pueden mirar.
            </p>
          </>
        ) : (
          <>
            <p
              className="font-display text-sm tracking-widest mb-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              TURNO DE
            </p>
            <h1
              className="font-display text-4xl sm:text-5xl font-bold tracking-widest mb-3"
              style={{ color: 'var(--color-accent-gold)' }}
            >
              {playerName?.toUpperCase()}
            </h1>
            <p className="text-base" style={{ color: 'var(--color-text-secondary)' }}>
              Pasa el dispositivo a {playerName}.
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
              El resto: apartad la vista hasta que {playerName} confirme.
            </p>
          </>
        )}
      </div>

      {/* CTA */}
      <Button size="lg" onClick={onContinue}>
        {isReveal ? 'Revelar números' : 'Estoy listo — elegir número'}
      </Button>
    </div>
  );
}
