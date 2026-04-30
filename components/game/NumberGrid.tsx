'use client';

interface NumberGridProps {
  rangoMin: number;
  rangoMax: number;
  selected: number | null;
  confirmed: boolean;
  onSelect: (n: number) => void;
}

export default function NumberGrid({
  rangoMin,
  rangoMax,
  selected,
  confirmed,
  onSelect,
}: NumberGridProps) {
  const allNumbers = Array.from({ length: 12 }, (_, i) => i + 1);

  if (confirmed) {
    return (
      <div
        className="flex items-center justify-center rounded gap-2 py-4"
        style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
        }}
      >
        <span
          className="font-display text-sm tracking-widest"
          style={{ color: 'var(--color-accent-gold)' }}
        >
          ✓ NÚMERO ELEGIDO
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {allNumbers.map(n => {
        const inRange = n >= rangoMin && n <= rangoMax;
        const isSelected = selected === n;

        let cellClass = 'number-cell';
        if (!inRange) cellClass += ' number-cell--disabled';
        else if (isSelected) cellClass += ' number-cell--selected';

        const isNew = inRange && n > 10;

        return (
          <button
            key={n}
            className={cellClass}
            onClick={() => inRange && onSelect(n)}
            disabled={!inRange}
            aria-disabled={!inRange}
            style={isNew ? { animation: 'escaladaUnlock 0.4s ease forwards' } : undefined}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
