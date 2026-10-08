import React from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

export const Select = React.forwardRef(
  (
    {
      id,
      name,
      label,
      options = [],
      placeholder = 'Select an option',
      error,
      helperText,
      required = false,
      disabled = false,
      className = '',
      selectClassName = '',
      ...props
    },
    ref
  ) => {
    const selectId = id || name;
    const errorId = error ? `${selectId}-error` : undefined;
    const helperId = helperText ? `${selectId}-helper` : undefined;

    return (
      <div className={`w-full flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-medium text-[var(--color-text)] flex items-center gap-1"
          >
            {label}
            {required && <span className="text-[var(--color-expense)]">*</span>}
          </label>
        )}

        <div className="relative flex items-center w-full">
          <select
            ref={ref}
            id={selectId}
            name={name}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={errorId || helperId}
            className={`w-full h-10 px-3.5 pr-10 bg-[var(--color-surface)] text-[var(--color-text)] text-sm rounded-[var(--radius-md)] border appearance-none transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-info)] focus:border-[var(--color-info)] disabled:bg-[var(--color-surface-muted)] disabled:cursor-not-allowed ${
              error
                ? 'border-[var(--color-expense)] focus:ring-[var(--color-expense)] focus:border-[var(--color-expense)]'
                : 'border-[var(--color-border-strong)]'
            } ${selectClassName}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => {
              const value = typeof opt === 'string' ? opt : opt.value;
              const label = typeof opt === 'string' ? opt : opt.label;
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>

          <ChevronDown className="w-4 h-4 text-[var(--color-text-subtle)] absolute right-3 pointer-events-none" />
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

Select.displayName = 'Select';

export default Select;
