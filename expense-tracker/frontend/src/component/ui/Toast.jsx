import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const toastIcons = {
  success: <CheckCircle className="w-5 h-5 text-[var(--color-income)] shrink-0" />,
  error: <AlertCircle className="w-5 h-5 text-[var(--color-expense)] shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-[var(--color-warning)] shrink-0" />,
  info: <Info className="w-5 h-5 text-[var(--color-info)] shrink-0" />,
};

const toastBorderColors = {
  success: 'border-l-4 border-l-[var(--color-income)]',
  error: 'border-l-4 border-l-[var(--color-expense)]',
  warning: 'border-l-4 border-l-[var(--color-warning)]',
  info: 'border-l-4 border-l-[var(--color-info)]',
};

const ToastItem = ({ toast, onDismiss }) => {
  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-3 p-4 bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] border border-[var(--color-border)] ${
        toastBorderColors[toast.type] || toastBorderColors.info
      } transition-all duration-200 animate-in fade-in slide-in-from-top-2 w-full max-w-sm`}
    >
      <div className="pt-0.5">{toastIcons[toast.type] || toastIcons.info}</div>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <h4 className="text-sm font-semibold text-[var(--color-text)]">
            {toast.title}
          </h4>
        )}
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-relaxed break-words">
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Close notification"
        className="p-1 -mr-1 text-[var(--color-text-subtle)] hover:text-[var(--color-text)] rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed z-50 top-4 right-4 sm:top-5 sm:right-5 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
