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
  const numbers = Array.from({ length: rangoMax - rangoMin + 1 }, (_, i) => rangoMin + i);

  if (confirmed) {
    return (
      <div className="flex items-center justify-center border border-neutral-200 bg-white py-4">
        <span className="font-display text-xs tracking-[0.18em] uppercase">
          Number chosen
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-6 gap-2">
      {numbers.map(n => {
        const isSelected = selected === n;
        const cellClass = `number-cell${isSelected ? ' number-cell--selected' : ''}`;

        return (
          <button
            key={n}
            className={cellClass}
            onClick={() => onSelect(n)}
            style={n > 10 ? { animation: 'escaladaUnlock 0.4s ease forwards' } : undefined}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
