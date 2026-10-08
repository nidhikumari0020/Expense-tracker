import Button from './Button';
import { Inbox } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No data found',
  description = 'Get started by creating your first entry.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] border-dashed ${className}`}
    >
      <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--color-surface-muted)] text-[var(--color-text-subtle)] flex items-center justify-center mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-[var(--color-text)]">
        {title}
      </h4>
      <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-sm mt-1 mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
