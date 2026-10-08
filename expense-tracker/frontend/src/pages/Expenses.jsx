import { useState, useEffect, useCallback, useMemo } from 'react';
import { expenseService } from '../services/expenseService';
import { useToast } from '../hooks/useToast';
import StatCard from '../component/ui/StatCard';
import Button from '../component/ui/Button';
import ErrorState from '../component/ui/ErrorState';
import ConfirmDialog from '../component/ui/ConfirmDialog';
import { SkeletonCard } from '../component/ui/Skeleton';
import FilterBar from '../component/transactions/FilterBar';
import TransactionTable from '../component/transactions/TransactionTable';
import AddTransactionModal from '../component/transactions/AddTransactionModal';
import EditTransactionModal from '../component/transactions/EditTransactionModal';
import { EXPENSE_CATEGORIES } from '../utils/constants';
import { TrendingDown, Calculator, Hash, Plus } from 'lucide-react';

export const Expenses = () => {
  const toast = useToast();

  const [expenses, setExpenses] = useState([]);
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [range, setRange] = useState('monthly');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch all expenses and range overview
  const loadData = useCallback(() => {
    return Promise.all([
      expenseService.getAll(),
      expenseService.getOverview(range),
    ])
      .then(([listData, overviewData]) => {
        setExpenses(listData);
        setOverview(overviewData);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to load expenses:', err);
        setError(err.message || 'Failed to load expense records');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [range]);

  useEffect(() => {
    let ignore = false;
    Promise.all([
      expenseService.getAll(),
      expenseService.getOverview(range),
    ])
      .then(([listData, overviewData]) => {
        if (!ignore) {
          setExpenses(listData);
          setOverview(overviewData);
          setError(null);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('Failed to load expenses:', err);
          setError(err.message || 'Failed to load expense records');
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [range]);

  // Client-side filtering for search & category
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const matchesCategory =
        !selectedCategory || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [expenses, selectedCategory, searchQuery]);

  // Derived summaries for the filtered set or overview
  const totalAmount = useMemo(() => {
    if (selectedCategory || searchQuery) {
      return filteredExpenses.reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0);
    }
    return overview?.totalExpense ?? filteredExpenses.reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0);
  }, [filteredExpenses, overview, selectedCategory, searchQuery]);

  const averageAmount = useMemo(() => {
    const count = filteredExpenses.length;
    return count > 0 ? totalAmount / count : 0;
  }, [filteredExpenses, totalAmount]);

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deletingTransaction) return;
    const txId = deletingTransaction._id || deletingTransaction.id;
    setIsDeleting(true);

    try {
      await expenseService.delete(txId);
      toast.success('Expense deleted successfully');
      setDeletingTransaction(null);
      loadData();
    } catch (err) {
      console.error('Delete expense failed:', err);
      toast.error(err.message || 'Failed to delete expense');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Excel Export
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await expenseService.downloadExcel();
      toast.success('Expense spreadsheet downloaded');
    } catch (err) {
      console.error('Export error:', err);
      toast.error(err.message || 'Failed to export Excel file');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text)]">
            Expense Management
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-0.5">
            Log, filter, and export your personal expenditure ledger.
          </p>
        </div>

        <Button
          icon={Plus}
          onClick={() => setIsAddModalOpen(true)}
          className="self-start sm:self-auto"
        >
          Add Expense
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <ErrorState
          title="Could not load expenses"
          message={error}
          onRetry={loadData}
        />
      )}

      {/* Summary Strip (Skeletons or StatCards) */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Expenses"
            value={totalAmount}
            type="expense"
            icon={TrendingDown}
            caption={`${range.charAt(0).toUpperCase() + range.slice(1)} total`}
          />
          <StatCard
            label="Average Expense"
            value={averageAmount}
            type="expense"
            icon={Calculator}
            caption="Per logged entry"
          />
          <StatCard
            label="Total Transactions"
            value={filteredExpenses.length}
            isCurrency={false}
            type="neutral"
            icon={Hash}
            caption="Entries recorded"
          />
        </div>
      )}

      {/* Filters & Actions Bar */}
      <FilterBar
        search={searchQuery}
        onSearchChange={setSearchQuery}
        category={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={EXPENSE_CATEGORIES}
        range={range}
        onRangeChange={setRange}
        onExport={handleExport}
        isExporting={isExporting}
        exportLabel="Export Expenses (.xlsx)"
      />

      {/* Transactions Table / Cards */}
      <TransactionTable
        transactions={filteredExpenses}
        isLoading={isLoading}
        onEdit={(tx) => setEditingTransaction(tx)}
        onDelete={(tx) => setDeletingTransaction(tx)}
        emptyTitle="No expenses found"
        emptyDescription={
          searchQuery || selectedCategory
            ? 'No expenses match your active filter criteria.'
            : 'Start logging your expenses to track your spending habits.'
        }
        addActionLabel="Add First Expense"
        onAddAction={() => setIsAddModalOpen(true)}
      />

      {/* Add Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultType="expense"
        lockType={true}
        onSuccess={loadData}
      />

      {/* Edit Modal */}
      <EditTransactionModal
        isOpen={Boolean(editingTransaction)}
        onClose={() => setEditingTransaction(null)}
        transaction={editingTransaction}
        onSuccess={loadData}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingTransaction)}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Expense"
        description={`Are you sure you want to permanently delete "${deletingTransaction?.description}"? This action cannot be reversed.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Expenses;
