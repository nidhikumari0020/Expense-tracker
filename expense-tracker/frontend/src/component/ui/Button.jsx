import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      type = 'button',
      className = '',
      icon: Icon,
      iconPosition = 'left',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-[var(--radius-md)] cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-info)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

    const variants = {
      primary:
        'bg-[var(--color-primary)] text-[var(--color-primary-contrast)] hover:bg-[var(--color-primary-hover)] active:translate-y-[1px]',
      secondary:
        'bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-muted)] shadow-[var(--shadow-sm)] active:translate-y-[1px]',
      danger:
        'bg-[var(--color-expense)] text-[var(--color-bg)] hover:brightness-110 active:translate-y-[1px] shadow-[var(--shadow-sm)]',
      ghost:
        'bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]',
      icon: 'bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] p-2',
    };

    const sizes = {
      sm: 'h-9 px-3 text-xs gap-1.5 min-w-[36px]',
      md: 'h-10 px-4 text-sm gap-2 min-w-[40px]',
      lg: 'h-12 px-6 text-base gap-2.5 min-w-[48px]',
      icon: 'h-10 w-10 p-0',
    };

    const isIconVariant = variant === 'icon';
    const sizeStyle = isIconVariant ? sizes.icon : sizes[size] || sizes.md;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant] || variants.primary} ${sizeStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            {!isIconVariant && <span>Loading...</span>}
          </>
        ) : (
          <>
            {Icon && iconPosition === 'left' && (
              <Icon className="w-4 h-4 shrink-0" />
            )}
            {children}
            {Icon && iconPosition === 'right' && (
              <Icon className="w-4 h-4 shrink-0" />
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
