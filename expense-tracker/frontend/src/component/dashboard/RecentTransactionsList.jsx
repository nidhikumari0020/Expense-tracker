import { Link } from 'react-router-dom';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import Badge from '../ui/Badge';
import { formatCurrency, formatDate } from '../../utils/format';
import { getCategoryIcon } from '../../utils/constants';
import { ArrowRight, ArrowLeftRight } from 'lucide-react';

export const RecentTransactionsList = ({ transactions = [] }) => {
  const hasTransactions = transactions && transactions.length > 0;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <p className="text-xs text-[var(--color-text-subtle)] mt-0.5">
            Latest transactions recorded this month
          </p>
        </div>
        {hasTransactions && (
          <Link
            to="/transactions"
            className="text-xs font-semibold text-[var(--color-info)] hover:underline inline-flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </CardHeader>

      <CardContent className="flex-1 p-0">
        {!hasTransactions ? (
          <EmptyState
            icon={ArrowLeftRight}
            title="No transactions yet"
            description="Your recent income and expense activity will appear here."
            className="border-none py-8 bg-transparent"
          />
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {transactions.map((tx, index) => {
              const isIncome = tx.type === 'income';
              const Icon = getCategoryIcon(tx.category);
              const txId = tx._id || tx.id || index;

              return (
                <div
                  key={txId}
                  className="flex items-center justify-between p-3.5 sm:px-4 hover:bg-[var(--color-surface-muted)] transition-colors"
                >
                  {/* Left: Icon & Description */}
                  <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                    <div
                      className={`w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center shrink-0 ${
                        isIncome
                          ? 'bg-[var(--color-income-bg)] text-[var(--color-income)]'
                          : 'bg-[var(--color-expense-bg)] text-[var(--color-expense)]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--color-text)] truncate">
                        {tx.description}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-[var(--color-text-subtle)]">
                          {formatDate(tx.date, { relative: true })}
                        </span>
                        <span className="text-[10px] text-[var(--color-border-strong)]">•</span>
                        <span className="text-xs text-[var(--color-text-muted)] truncate">
                          {tx.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Badge & Amount */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={`text-sm sm:text-base font-bold tabular-nums ${
                        isIncome
                          ? 'text-[var(--color-income)]'
                          : 'text-[var(--color-expense)]'
                      }`}
                    >
                      {isIncome ? `+${formatCurrency(tx.amount)}` : `−${formatCurrency(tx.amount)}`}
                    </span>
                    <Badge
                      variant={isIncome ? 'income' : 'expense'}
                      size="sm"
                    >
                      {isIncome ? 'Income' : 'Expense'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactionsList;
