import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import Badge from '../ui/Badge';
import { SkeletonRow } from '../ui/Skeleton';
import { formatCurrency, formatDate } from '../../utils/format';
import { getCategoryIcon } from '../../utils/constants';
import { Pencil, Trash2, ArrowLeftRight } from 'lucide-react';

export const TransactionTable = ({
  transactions = [],
  isLoading = false,
  onEdit,
  onDelete,
  showTypeBadge = false,
  emptyTitle = 'No transactions recorded',
  emptyDescription = 'Start logging transactions to see your records here.',
  onAddAction,
  addActionLabel,
}) => {
  if (isLoading) {
    return (
      <Card padding={false} className="overflow-hidden">
        <div className="divide-y divide-[var(--color-border)]">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        icon={ArrowLeftRight}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={addActionLabel}
        onAction={onAddAction}
      />
    );
  }

  return (
    <Card padding={false} className="overflow-hidden">
      {/* ================= DESKTOP TABLE (≥md) ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-text-subtle)] text-xs font-semibold uppercase tracking-wider">
              <th scope="col" className="py-3 px-4">Date</th>
              <th scope="col" className="py-3 px-4">Description</th>
              <th scope="col" className="py-3 px-4">Category</th>
              {showTypeBadge && <th scope="col" className="py-3 px-4">Type</th>}
              <th scope="col" className="py-3 px-4 text-right">Amount</th>
              <th scope="col" className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-surface)]">
            {transactions.map((tx, idx) => {
              const txId = tx._id || tx.id || idx;
              const isIncome = tx.type === 'income';
              const Icon = getCategoryIcon(tx.category);

              return (
                <tr
                  key={txId}
                  className="hover:bg-[var(--color-surface-muted)]/60 transition-colors"
                >
                  <td className="py-3.5 px-4 text-xs font-medium text-[var(--color-text-subtle)] whitespace-nowrap">
                    {formatDate(tx.date)}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[var(--color-text)]">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0 ${
                          isIncome
                            ? 'bg-[var(--color-income-bg)] text-[var(--color-income)]'
                            : 'bg-[var(--color-expense-bg)] text-[var(--color-expense)]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate max-w-xs">{tx.description}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[var(--color-text-muted)] whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] font-medium">
                      {tx.category}
                    </span>
                  </td>
                  {showTypeBadge && (
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge variant={isIncome ? 'income' : 'expense'} size="sm">
                        {isIncome ? 'Income' : 'Expense'}
                      </Badge>
                    </td>
                  )}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span
                      className={`font-bold tabular-nums text-sm ${
                        isIncome
                          ? 'text-[var(--color-income)]'
                          : 'text-[var(--color-expense)]'
                      }`}
                    >
                      {isIncome ? `+${formatCurrency(tx.amount)}` : `−${formatCurrency(tx.amount)}`}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(tx)}
                          aria-label={`Edit ${tx.description}`}
                          title="Edit"
                          className="p-1.5 text-[var(--color-text-subtle)] hover:text-[var(--color-info)] hover:bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(tx)}
                          aria-label={`Delete ${tx.description}`}
                          title="Delete"
                          className="p-1.5 text-[var(--color-text-subtle)] hover:text-[var(--color-expense)] hover:bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS (<md) ================= */}
      <div className="md:hidden divide-y divide-[var(--color-border)]">
        {transactions.map((tx, idx) => {
          const txId = tx._id || tx.id || idx;
          const isIncome = tx.type === 'income';
          const Icon = getCategoryIcon(tx.category);

          return (
            <div
              key={txId}
              className="p-4 flex flex-col gap-2.5 hover:bg-[var(--color-surface-muted)]/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center shrink-0 ${
                      isIncome
                        ? 'bg-[var(--color-income-bg)] text-[var(--color-income)]'
                        : 'bg-[var(--color-expense-bg)] text-[var(--color-expense)]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-text)] truncate">
                      {tx.description}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--color-text-subtle)]">
                      <span>{formatDate(tx.date)}</span>
                      <span>•</span>
                      <span className="truncate">{tx.category}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-base font-bold tabular-nums shrink-0 ${
                    isIncome
                      ? 'text-[var(--color-income)]'
                      : 'text-[var(--color-expense)]'
                  }`}
                >
                  {isIncome ? `+${formatCurrency(tx.amount)}` : `−${formatCurrency(tx.amount)}`}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[var(--color-border)]/60 text-xs">
                {showTypeBadge ? (
                  <Badge variant={isIncome ? 'income' : 'expense'} size="sm">
                    {isIncome ? 'Income' : 'Expense'}
                  </Badge>
                ) : (
                  <span className="text-[11px] text-[var(--color-text-subtle)]">
                    {tx.category}
                  </span>
                )}

                <div className="flex items-center gap-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(tx)}
                      className="px-2 py-1 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded hover:bg-[var(--color-surface-muted)] flex items-center gap-1"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(tx)}
                      className="px-2 py-1 text-xs font-medium text-[var(--color-expense)] rounded hover:bg-[var(--color-expense-bg)] flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default TransactionTable;
