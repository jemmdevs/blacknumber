'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-display tracking-wider transition-all duration-200 select-none cursor-pointer border disabled:opacity-40 disabled:cursor-not-allowed';

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const variants = {
    primary: `
      bg-transparent border-[var(--color-accent-gold)] text-[var(--color-accent-gold)]
      hover:bg-[var(--color-accent-gold-dim)] hover:shadow-[0_0_12px_var(--color-accent-gold-glow)]
      active:scale-95
    `,
    secondary: `
      bg-transparent border-[var(--color-border-strong)] text-[var(--color-text-secondary)]
      hover:border-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
      active:scale-95
    `,
    danger: `
      bg-transparent border-red-700 text-red-400
      hover:bg-red-900/20 hover:shadow-[0_0_12px_rgba(220,38,38,0.3)]
      active:scale-95
    `,
    ghost: `
      bg-transparent border-transparent text-[var(--color-text-muted)]
      hover:text-[var(--color-text-secondary)]
      active:scale-95
    `,
  };

  return (
    <button
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
