import Button from './Button';
import { AlertCircle, RotateCcw } from 'lucide-react';

export const ErrorState = ({
  title = 'Something went wrong',
  message = "We couldn't load this data. Please try again.",
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-expense-bg)] ${className}`}
    >
      <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--color-expense-bg)] text-[var(--color-expense)] flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-[var(--color-text)]">
        {title}
      </h4>
      <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-sm mt-1 mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="secondary"
          size="md"
          icon={RotateCcw}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
