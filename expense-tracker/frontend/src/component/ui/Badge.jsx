export const Badge = ({
  children,
  variant = 'neutral', // 'income' | 'expense' | 'info' | 'warning' | 'neutral'
  size = 'md',
  icon: Icon,
  className = '',
}) => {
  const variantStyles = {
    income: 'bg-[var(--color-income-bg)] text-[var(--color-income)] border-transparent',
    expense: 'bg-[var(--color-expense-bg)] text-[var(--color-expense)] border-transparent',
    info: 'bg-[var(--color-info-bg)] text-[var(--color-info)] border-transparent',
    warning: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)] border-transparent',
    neutral: 'bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] border-[var(--color-border)]',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${
        variantStyles[variant] || variantStyles.neutral
      } ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
