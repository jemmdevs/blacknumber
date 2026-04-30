'use client';

interface HPBarProps {
  hp: number;
  hpMax: number;
  hidden?: boolean;
  className?: string;
}

export default function HPBar({ hp, hpMax, hidden = false, className = '' }: HPBarProps) {
  if (hidden) {
    return (
      <div className={`hp-bar ${className}`}>
        <div className="h-full rounded-[5px]" style={{ background: '#333344', width: '100%' }} />
      </div>
    );
  }

  const pct = hpMax > 0 ? Math.max(0, Math.min(100, (hp / hpMax) * 100)) : 0;
  const color =
    pct > 60
      ? 'var(--color-hp-high)'
      : pct > 30
        ? 'var(--color-hp-mid)'
        : 'var(--color-hp-low)';

  return (
    <div className={`hp-bar ${className}`}>
      <div
        className={`hp-bar__fill ${pct <= 30 ? 'animate-hp-pulse' : ''}`}
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}
