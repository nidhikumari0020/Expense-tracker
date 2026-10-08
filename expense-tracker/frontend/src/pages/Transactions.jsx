import { useState, useEffect, useCallback, useMemo } from 'react';
import { incomeService } from '../services/incomeService';
import { expenseService } from '../services/expenseService';
import { useToast } from '../hooks/useToast';
import StatCard from '../component/ui/StatCard';
import Card from '../component/ui/Card';
import Button from '../component/ui/Button';
import Select from '../component/ui/Select';
import Input from '../component/ui/Input';
import ErrorState from '../component/ui/ErrorState';
import ConfirmDialog from '../component/ui/ConfirmDialog';
import { SkeletonCard } from '../component/ui/Skeleton';
import TransactionTable from '../component/transactions/TransactionTable';
import AddTransactionModal from '../component/transactions/AddTransactionModal';
import EditTransactionModal from '../component/transactions/EditTransactionModal';
import { formatCurrency } from '../utils/format';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/constants';
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Search,
  Plus,
} from 'lucide-react';

export const Transactions = () => {
  const toast = useToast();

  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'income' | 'expense'
  const [selectedCategory, setSelectedCategory] = useState('');
  const [timeFilter, setTimeFilter] = useState('all'); // 'all' | 'today' | 'this_month' | 'this_year'
  const [sortBy, setSortBy] = useState('date_desc'); // 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all transactions from both sources
  const loadData = useCallback(() => {
    return Promise.all([
      incomeService.getAll(),
      expenseService.getAll(),
    ])
      .then(([incomeList, expenseList]) => {
        setIncomes(
          Array.isArray(incomeList)
            ? incomeList.map((item) => ({ ...item, type: 'income' }))
            : []
        );
        setExpenses(
          Array.isArray(expenseList)
            ? expenseList.map((item) => ({ ...item, type: 'expense' }))
            : []
        );
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to load transactions:', err);
        setError(err.message || 'Failed to load transaction history');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let ignore = false;
    Promise.all([
      incomeService.getAll(),
      expenseService.getAll(),
    ])
      .then(([incomeList, expenseList]) => {
        if (!ignore) {
          setIncomes(
            Array.isArray(incomeList)
              ? incomeList.map((item) => ({ ...item, type: 'income' }))
              : []
          );
          setExpenses(
            Array.isArray(expenseList)
              ? expenseList.map((item) => ({ ...item, type: 'expense' }))
              : []
          );
          setError(null);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('Failed to load transactions:', err);
          setError(err.message || 'Failed to load transaction history');
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Combined and filtered transaction list
  const mergedTransactions = useMemo(() => {
    let combined;
    if (typeFilter === 'income') {
      combined = [...incomes];
    } else if (typeFilter === 'expense') {
      combined = [...expenses];
    } else {
      combined = [...incomes, ...expenses];
    }

    // Apply Time filter
    const now = new Date();
    combined = combined.filter((tx) => {
      if (!tx.date) return true;
      const txDate = new Date(tx.date);

      if (timeFilter === 'today') {
        return (
          txDate.getDate() === now.getDate() &&
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      }
      if (timeFilter === 'this_month') {
        return (
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      }
      if (timeFilter === 'this_year') {
        return txDate.getFullYear() === now.getFullYear();
      }
      return true;
    });

    // Apply Category filter
    if (selectedCategory) {
      combined = combined.filter((tx) => tx.category === selectedCategory);
    }

    // Apply Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      combined = combined.filter(
        (tx) =>
          tx.description?.toLowerCase().includes(q) ||
          tx.category?.toLowerCase().includes(q)
      );
    }

    // Apply Sorting
    return combined.sort((a, b) => {
      if (sortBy === 'date_asc') {
        return new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt);
      }
      if (sortBy === 'amount_desc') {
        return Number(b.amount) - Number(a.amount);
      }
      if (sortBy === 'amount_asc') {
        return Number(a.amount) - Number(b.amount);
      }
      // default: date_desc
      return new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt);
    });
  }, [incomes, expenses, typeFilter, timeFilter, selectedCategory, searchQuery, sortBy]);

  // Financial calculations
  const totalInflow = useMemo(() => {
    return mergedTransactions
      .filter((t) => t.type === 'income')
      .reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0);
  }, [mergedTransactions]);

  const totalOutflow = useMemo(() => {
    return mergedTransactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0);
  }, [mergedTransactions]);

  const netBalance = totalInflow - totalOutflow;
  const cashFlowTotal = totalInflow + totalOutflow;
  const incomePercent = cashFlowTotal > 0 ? Math.round((totalInflow / cashFlowTotal) * 100) : 50;
  const expensePercent = cashFlowTotal > 0 ? 100 - incomePercent : 50;

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deletingTransaction) return;
    const txId = deletingTransaction._id || deletingTransaction.id;
    const isIncome = deletingTransaction.type === 'income';
    setIsDeleting(true);

    try {
      if (isIncome) {
        await incomeService.delete(txId);
        toast.success('Income deleted successfully');
      } else {
        await expenseService.delete(txId);
        toast.success('Expense deleted successfully');
      }
      setDeletingTransaction(null);
      loadData();
    } catch (err) {
      console.error('Delete transaction failed:', err);
      toast.error(err.message || 'Failed to delete transaction');
    } finally {
      setIsDeleting(false);
    }
  };

  const allCategories = useMemo(() => {
    return Array.from(new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text)]">
            Transactions History
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-0.5">
            Unified ledger of all income earnings and expenditures.
          </p>
        </div>

        <Button
          icon={Plus}
          onClick={() => setIsAddModalOpen(true)}
          className="self-start sm:self-auto"
        >
          Add Transaction
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <ErrorState
          title="Could not load transactions"
          message={error}
          onRetry={loadData}
        />
      )}

      {/* Summary Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Inflow"
            value={totalInflow}
            type="income"
            icon={TrendingUp}
            caption="Filtered income total"
          />
          <StatCard
            label="Total Outflow"
            value={totalOutflow}
            type="expense"
            icon={TrendingDown}
            caption="Filtered expense total"
          />
          <StatCard
            label="Net Balance"
            value={netBalance}
            type={netBalance >= 0 ? 'income' : 'expense'}
            icon={Scale}
            caption={netBalance >= 0 ? 'Net surplus' : 'Net deficit'}
          />
        </div>
      )}

      {/* Cash Flow Ratio Bar */}
      {!isLoading && (totalInflow > 0 || totalOutflow > 0) && (
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-[var(--color-text)]">
              Cash Flow Ratio
            </span>
            <div className="flex items-center gap-4">
              <span className="text-[var(--color-income)] font-bold">
                Income: {incomePercent}%
              </span>
              <span className="text-[var(--color-expense)] font-bold">
                Expense: {expensePercent}%
              </span>
            </div>
          </div>

          <div className="w-full h-2.5 rounded-full bg-[var(--color-surface-muted)] overflow-hidden flex">
            <div
              className="h-full bg-[var(--color-income)] transition-all duration-300"
              style={{ width: `${incomePercent}%` }}
              title={`Income: ${formatCurrency(totalInflow)} (${incomePercent}%)`}
            />
            <div
              className="h-full bg-[var(--color-expense)] transition-all duration-300"
              style={{ width: `${expensePercent}%` }}
              title={`Expense: ${formatCurrency(totalOutflow)} (${expensePercent}%)`}
            />
          </div>
        </Card>
      )}

      {/* Filter and Search Bar */}
      <Card className="p-4 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div>
            <Input
              id="transactions-search"
              name="search"
              placeholder="Search description..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Type Segment Control */}
          <div className="flex rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-1 border border-[var(--color-border)]">
            {[
              { label: 'All', value: 'all' },
              { label: 'Income', value: 'income' },
              { label: 'Expense', value: 'expense' },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setTypeFilter(tab.value)}
                className={`flex-1 py-1.5 px-2 rounded-[var(--radius-sm)] text-xs font-semibold transition-all cursor-pointer ${
                  typeFilter === tab.value
                    ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-[var(--shadow-sm)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Select */}
          <div>
            <Select
              id="transactions-category"
              name="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={[
                { label: 'All Categories', value: '' },
                ...allCategories.map((c) => ({ label: c, value: c })),
              ]}
              placeholder="Category"
            />
          </div>

          {/* Sort By Select */}
          <div>
            <Select
              id="transactions-sort"
              name="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { label: 'Newest First', value: 'date_desc' },
                { label: 'Oldest First', value: 'date_asc' },
                { label: 'Highest Amount', value: 'amount_desc' },
                { label: 'Lowest Amount', value: 'amount_asc' },
              ]}
              placeholder="Sort by"
            />
          </div>
        </div>

        {/* Timeframe Filter Tags */}
        <div className="flex items-center gap-2 pt-3 border-t border-[var(--color-border)] overflow-x-auto text-xs">
          <span className="text-[var(--color-text-subtle)] font-medium shrink-0">
            Time Period:
          </span>
          {[
            { label: 'All Time', value: 'all' },
            { label: 'Today', value: 'today' },
            { label: 'This Month', value: 'this_month' },
            { label: 'This Year', value: 'this_year' },
          ].map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTimeFilter(t.value)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                timeFilter === t.value
                  ? 'bg-[var(--color-primary)] text-[var(--color-primary-contrast)]'
                  : 'bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Unified Transaction Table */}
      <TransactionTable
        transactions={mergedTransactions}
        isLoading={isLoading}
        showTypeBadge={true}
        onEdit={(tx) => setEditingTransaction(tx)}
        onDelete={(tx) => setDeletingTransaction(tx)}
        emptyTitle="No transactions found"
        emptyDescription={
          searchQuery || selectedCategory || typeFilter !== 'all' || timeFilter !== 'all'
            ? 'No transactions match your combined filter settings.'
            : 'Start by creating your first income or expense transaction.'
        }
        addActionLabel="Add First Transaction"
        onAddAction={() => setIsAddModalOpen(true)}
      />

      {/* Add Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultType="expense"
        onSuccess={loadData}
      />

      {/* Edit Modal */}
      <EditTransactionModal
        isOpen={Boolean(editingTransaction)}
        onClose={() => setEditingTransaction(null)}
        transaction={editingTransaction}
        onSuccess={loadData}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingTransaction)}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${deletingTransaction?.type === 'income' ? 'Income' : 'Expense'}`}
        description={`Are you sure you want to permanently delete "${deletingTransaction?.description}"? This action cannot be reversed.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Transactions;
