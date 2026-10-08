import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

/**
 * Dark Mode ON/OFF switch. State + persistence live in ThemeContext.
 * `compact` hides the text label (used in tight headers).
 */
export const ThemeToggle = ({ compact = false, className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Dark mode ${isDark ? 'on' : 'off'}`}
      title={`Dark mode: ${isDark ? 'ON' : 'OFF'}`}
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 rounded-full cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-info)] ${className}`}
    >
      {!compact && (
        <span className="text-xs font-medium text-[var(--color-text-muted)] whitespace-nowrap text-left">
          Dark mode {isDark ? 'ON' : 'OFF'}
        </span>
      )}
      <span
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-200 ${
          isDark
            ? 'bg-[var(--color-secondary)] border-[var(--color-border-strong)]'
            : 'bg-[var(--color-surface-muted)] border-[var(--color-border-strong)]'
        }`}
      >
        <span
          className={`absolute left-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-primary-contrast)] transition-transform duration-200 ${
            isDark ? 'translate-x-5' : 'translate-x-0'
          }`}
        >
          {isDark ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;
