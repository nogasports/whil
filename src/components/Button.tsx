import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center border-0 font-medium shadow-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed border-none',
        {
          'border-transparent text-white': variant !== 'outline',
          'bg-primary-DEFAULT hover:bg-primary-dark': variant === 'primary',
          'bg-secondary-DEFAULT hover:bg-secondary-dark': variant === 'secondary',
          'border border-primary-DEFAULT text-primary-DEFAULT hover:bg-primary-DEFAULT hover:text-white': variant === 'outline',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}