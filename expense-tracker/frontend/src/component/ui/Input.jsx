import React from 'react';
import { AlertCircle } from 'lucide-react';

export const Input = React.forwardRef(
  (
    {
      id,
      name,
      label,
      type = 'text',
      error,
      helperText,
      required = false,
      disabled = false,
      className = '',
      inputClassName = '',
      icon: Icon,
      prefix,
      suffix,
      ...props
    },
    ref
  ) => {
    const inputId = id || name;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    return (
      <div className={`w-full flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-[var(--color-text)] flex items-center gap-1"
          >
            {label}
            {required && <span className="text-[var(--color-expense)]">*</span>}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {Icon && (
            <div className="absolute left-3 text-[var(--color-text-subtle)] pointer-events-none flex items-center justify-center">
              <Icon className="w-4 h-4" />
            </div>
          )}

          {prefix && (
            <span className="absolute left-3 text-sm text-[var(--color-text-subtle)] pointer-events-none">
              {prefix}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={errorId || helperId}
            className={`w-full h-10 px-3.5 bg-[var(--color-surface)] text-[var(--color-text)] text-sm rounded-[var(--radius-md)] border transition-all duration-150 placeholder:text-[var(--color-text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-info)] focus:border-[var(--color-info)] disabled:bg-[var(--color-surface-muted)] disabled:cursor-not-allowed ${
              Icon ? 'pl-9' : prefix ? 'pl-8' : ''
            } ${suffix ? 'pr-9' : ''} ${
              error
                ? 'border-[var(--color-expense)] focus:ring-[var(--color-expense)] focus:border-[var(--color-expense)]'
                : 'border-[var(--color-border-strong)]'
            } ${inputClassName}`}
            {...props}
          />

          {suffix && (
            <span className="absolute right-3 text-sm text-[var(--color-text-subtle)] pointer-events-none">
              {suffix}
            </span>
          )}
        </div>

        {error ? (
          <p
            id={errorId}
            className="text-xs text-[var(--color-expense)] flex items-center gap-1 mt-0.5"
            role="alert"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-[var(--color-text-subtle)] mt-0.5">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
