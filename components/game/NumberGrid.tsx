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
      <div className="flex items-center justify-center border border-neutral-200 bg-white py-4">
        <span className="font-display text-xs tracking-[0.18em] uppercase">
          Numero elegido
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 justify-items-center gap-2">
      {allNumbers.map(n => {
        const inRange = n >= rangoMin && n <= rangoMax;
        const isSelected = selected === n;
        let cellClass = 'number-cell';
        if (!inRange) cellClass += ' number-cell--disabled';
        else if (isSelected) cellClass += ' number-cell--selected';

        return (
          <button
            key={n}
            className={cellClass}
            onClick={() => inRange && onSelect(n)}
            disabled={!inRange}
            aria-disabled={!inRange}
            style={inRange && n > 10 ? { animation: 'escaladaUnlock 0.4s ease forwards' } : undefined}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
