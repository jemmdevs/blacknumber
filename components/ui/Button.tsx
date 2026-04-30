'use client';

import { ButtonHTMLAttributes, ReactNode, useState } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const CUT = '10px';
const CLIP_DEFAULT = `polygon(${CUT} 0%, 100% 0%, 100% 0%, 100% calc(100% - ${CUT}), calc(100% - ${CUT}) 100%, 0% 100%, 0% 100%, 0% ${CUT})`;
const CLIP_HOVER = `polygon(0% 0%, calc(100% - ${CUT}) 0%, 100% ${CUT}, 100% 100%, 100% 100%, ${CUT} 100%, 0% calc(100% - ${CUT}), 0% 0%)`;

const sizes = {
  sm: 'h-9 px-4 text-[11px]',
  md: 'h-11 px-6 text-xs',
  lg: 'h-12 px-9 text-sm',
};

const variants = {
  primary: {
    border: '#0a0a0a',
    fill: '#0a0a0a',
    text: '#ffffff',
    hoverFill: '#242424',
  },
  secondary: {
    border: '#0a0a0a',
    fill: '#ffffff',
    text: '#0a0a0a',
    hoverFill: '#eeeeea',
  },
  danger: {
    border: '#b42318',
    fill: '#ffffff',
    text: '#b42318',
    hoverFill: '#fff0f0',
  },
  ghost: {
    border: 'transparent',
    fill: 'transparent',
    text: '#525252',
    hoverFill: 'transparent',
  },
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const clip = hovered ? CLIP_HOVER : CLIP_DEFAULT;
  const palette = variants[variant];

  const handleEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) setHovered(true);
    onMouseEnter?.(event);
  };

  const handleLeave = (event: React.MouseEvent<HTMLButtonElement>) => {
    setHovered(false);
    onMouseLeave?.(event);
  };

  return (
    <button
      disabled={disabled}
      className={`relative inline-flex cursor-pointer items-center justify-center select-none font-display tracking-[0.14em] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98] ${className}`}
      style={{ background: 'transparent', border: 'none', padding: 0 }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      {...props}
    >
      <span
        className="absolute inset-0"
        style={{
          clipPath: clip,
          backgroundColor: palette.border,
          transition: 'clip-path 0.5s cubic-bezier(0.2, 0, 0.2, 1)',
        }}
        aria-hidden="true"
      />
      <span
        className={`relative z-10 inline-flex w-full items-center justify-center font-semibold uppercase ${sizes[size]}`}
        style={{
          clipPath: clip,
          margin: variant === 'ghost' ? 0 : '1.5px',
          color: palette.text,
          backgroundColor: hovered ? palette.hoverFill : palette.fill,
          transition: 'clip-path 0.5s cubic-bezier(0.2, 0, 0.2, 1), background-color 0.2s ease',
        }}
      >
        {children}
      </span>
    </button>
  );
}
