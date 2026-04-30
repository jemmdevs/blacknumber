'use client';

import HPBar from './HPBar';

interface PlayerRowProps {
  nombre: string;
  hp: number;
  hpMax: number;
  hidden?: boolean;
  eliminado?: boolean;
  isActive?: boolean;
  compact?: boolean;
}

export default function PlayerRow({
  nombre,
  hp,
  hpMax,
  hidden = false,
  eliminado = false,
  isActive = false,
  compact = false,
}: PlayerRowProps) {
  const pct = hpMax > 0 ? Math.round((hp / hpMax) * 100) : 0;

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded transition-all ${
        isActive ? 'ring-1 ring-[var(--color-accent-gold)]' : ''
      } ${eliminado ? 'opacity-40' : ''}`}
      style={{ background: 'var(--color-bg-secondary)' }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span
            className={`font-display truncate ${compact ? 'text-xs' : 'text-sm'} ${
              eliminado ? 'line-through' : ''
            }`}
            style={{ color: isActive ? 'var(--color-accent-gold)' : 'var(--color-text-primary)' }}
          >
            {nombre}
            {eliminado && (
              <span className="ml-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                ELIMINADO
              </span>
            )}
          </span>
          <span
            className="font-mono-game text-xs shrink-0"
            style={{ color: hidden ? 'var(--color-text-muted)' : 'var(--color-text-secondary)' }}
          >
            {hidden ? '???' : `${hp}/${hpMax}`}
          </span>
        </div>
        <HPBar hp={hp} hpMax={hpMax} hidden={hidden || eliminado} />
      </div>
    </div>
  );
}
