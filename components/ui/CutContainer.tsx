'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';

const CUT = '10px';
const CLIP_DEFAULT = `polygon(${CUT} 0%, 100% 0%, 100% 0%, 100% calc(100% - ${CUT}), calc(100% - ${CUT}) 100%, 0% 100%, 0% 100%, 0% ${CUT})`;
const CLIP_HOVER = `polygon(0% 0%, calc(100% - ${CUT}) 0%, 100% ${CUT}, 100% 100%, 100% 100%, ${CUT} 100%, 0% calc(100% - ${CUT}), 0% 0%)`;

interface CutContainerProps {
  children: ReactNode;
  className?: string;
  borderColor?: string;
  active?: boolean;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export default function CutContainer({
  children,
  className = '',
  borderColor = '#d4d4d4',
  active = false,
  hoverEffect = true,
  onClick,
}: CutContainerProps) {
  const [hovered, setHovered] = useState(false);
  const shouldAnimate = hoverEffect && (hovered || active);
  const clip = shouldAnimate ? CLIP_HOVER : CLIP_DEFAULT;
  const Tag = onClick ? 'button' : 'div';

  const dashShared: CSSProperties = {
    position: 'absolute',
    width: 10,
    height: 2,
    backgroundColor: active ? '#0a0a0a' : '#a3a3a3',
    borderRadius: 99,
    pointerEvents: 'none',
    zIndex: 20,
    transition: 'transform 0.25s ease',
  };

  return (
    <Tag
      className={`relative flex flex-col text-left ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      type={onClick ? 'button' : undefined}
    >
      <span
        className="absolute inset-0"
        style={{
          clipPath: clip,
          backgroundColor: active ? '#0a0a0a' : borderColor,
          transition: 'clip-path 0.5s cubic-bezier(0.2, 0, 0.2, 1), background-color 0.2s ease',
        }}
        aria-hidden="true"
      />
      <div
        className="relative z-10 flex-1"
        style={{
          clipPath: clip,
          margin: '1.5px',
          backgroundColor: hovered && onClick ? 'var(--surface-hover)' : 'var(--surface)',
          transition: 'clip-path 0.5s cubic-bezier(0.2, 0, 0.2, 1), background-color 0.2s ease',
        }}
      >
        {children}
      </div>
      <span aria-hidden="true" style={{ ...dashShared, top: 8, left: 4, transform: `rotate(-45deg) scaleX(${shouldAnimate ? 0 : 1})` }} />
      <span aria-hidden="true" style={{ ...dashShared, bottom: 8, right: 4, transform: `rotate(-45deg) scaleX(${shouldAnimate ? 0 : 1})` }} />
      <span aria-hidden="true" style={{ ...dashShared, top: 8, right: 4, transform: `rotate(45deg) scaleX(${shouldAnimate ? 1 : 0})` }} />
      <span aria-hidden="true" style={{ ...dashShared, bottom: 8, left: 4, transform: `rotate(45deg) scaleX(${shouldAnimate ? 1 : 0})` }} />
    </Tag>
  );
}
