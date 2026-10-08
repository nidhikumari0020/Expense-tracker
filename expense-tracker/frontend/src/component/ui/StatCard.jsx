import Card from './Card';
import { formatCurrency } from '../../utils/format';

export const StatCard = ({
  label,
  value,
  isCurrency = true,
  currency = '₹',
  type = 'neutral', // 'income' | 'expense' | 'savings' | 'rate' | 'neutral'
  icon: Icon,
  caption = 'This month',
  className = '',
}) => {
  const formattedValue = isCurrency ? formatCurrency(value, currency) : value;

  const valueColorStyles = {
    income: 'text-[var(--color-income)]',
    expense: 'text-[var(--color-expense)]',
    savings: Number(value) >= 0 ? 'text-[var(--color-income)]' : 'text-[var(--color-expense)]',
    rate: 'text-[var(--color-info)]',
    neutral: 'text-[var(--color-text)]',
  };

  const iconBgStyles = {
    income: 'bg-[var(--color-income-bg)] text-[var(--color-income)]',
    expense: 'bg-[var(--color-expense-bg)] text-[var(--color-expense)]',
    savings: Number(value) >= 0 ? 'bg-[var(--color-income-bg)] text-[var(--color-income)]' : 'bg-[var(--color-expense-bg)] text-[var(--color-expense)]',
    rate: 'bg-[var(--color-info-bg)] text-[var(--color-info)]',
    neutral: 'bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]',
  };

  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs sm:text-sm font-medium text-[var(--color-text-muted)]">
          {label}
        </span>
        {Icon && (
          <div
            className={`w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center shrink-0 ${
              iconBgStyles[type] || iconBgStyles.neutral
            }`}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <div
          className={`text-2xl sm:text-3xl font-bold tracking-tight tabular-nums ${
            valueColorStyles[type] || valueColorStyles.neutral
          }`}
        >
          {formattedValue}
        </div>
        {caption && (
          <p className="text-xs text-[var(--color-text-subtle)] mt-1">{caption}</p>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
