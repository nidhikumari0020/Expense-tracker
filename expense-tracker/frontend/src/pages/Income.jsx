import { useState, useEffect, useCallback, useMemo } from 'react';
import { incomeService } from '../services/incomeService';
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
import { INCOME_CATEGORIES } from '../utils/constants';
import { TrendingUp, Calculator, Hash, Plus } from 'lucide-react';

export const Income = () => {
  const toast = useToast();

  const [incomes, setIncomes] = useState([]);
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

  // Fetch all income records and range overview
  const loadData = useCallback(() => {
    return Promise.all([
      incomeService.getAll(),
      incomeService.getOverview(range),
    ])
      .then(([listData, overviewData]) => {
        setIncomes(listData);
        setOverview(overviewData);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to load income:', err);
        setError(err.message || 'Failed to load income records');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [range]);

  useEffect(() => {
    let ignore = false;
    Promise.all([
      incomeService.getAll(),
      incomeService.getOverview(range),
    ])
      .then(([listData, overviewData]) => {
        if (!ignore) {
          setIncomes(listData);
          setOverview(overviewData);
          setError(null);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('Failed to load income:', err);
          setError(err.message || 'Failed to load income records');
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [range]);

  // Client-side filtering
  const filteredIncomes = useMemo(() => {
    return incomes.filter((item) => {
      const matchesCategory =
        !selectedCategory || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [incomes, selectedCategory, searchQuery]);

  // Derived calculations
  const totalAmount = useMemo(() => {
    if (selectedCategory || searchQuery) {
      return filteredIncomes.reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0);
    }
    return overview?.totalIncome ?? filteredIncomes.reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0);
  }, [filteredIncomes, overview, selectedCategory, searchQuery]);

  const averageAmount = useMemo(() => {
    const count = filteredIncomes.length;
    return count > 0 ? totalAmount / count : 0;
  }, [filteredIncomes, totalAmount]);

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deletingTransaction) return;
    const txId = deletingTransaction._id || deletingTransaction.id;
    setIsDeleting(true);

    try {
      await incomeService.delete(txId);
      toast.success('Income deleted successfully');
      setDeletingTransaction(null);
      loadData();
    } catch (err) {
      console.error('Delete income failed:', err);
      toast.error(err.message || 'Failed to delete income');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Excel Export
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await incomeService.downloadExcel();
      toast.success('Income spreadsheet downloaded');
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
            Income Management
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-0.5">
            Log, track, and export all your revenue streams and salaries.
          </p>
        </div>

        <Button
          icon={Plus}
          onClick={() => setIsAddModalOpen(true)}
          className="self-start sm:self-auto"
        >
          Add Income
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <ErrorState
          title="Could not load income records"
          message={error}
          onRetry={loadData}
        />
      )}

      {/* Summary Strip */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Income"
            value={totalAmount}
            type="income"
            icon={TrendingUp}
            caption={`${range.charAt(0).toUpperCase() + range.slice(1)} total`}
          />
          <StatCard
            label="Average Income"
            value={averageAmount}
            type="income"
            icon={Calculator}
            caption="Per logged entry"
          />
          <StatCard
            label="Total Transactions"
            value={filteredIncomes.length}
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
        categories={INCOME_CATEGORIES}
        range={range}
        onRangeChange={setRange}
        onExport={handleExport}
        isExporting={isExporting}
        exportLabel="Export Income (.xlsx)"
      />

      {/* Transactions Table / Cards */}
      <TransactionTable
        transactions={filteredIncomes}
        isLoading={isLoading}
        onEdit={(tx) => setEditingTransaction(tx)}
        onDelete={(tx) => setDeletingTransaction(tx)}
        emptyTitle="No income found"
        emptyDescription={
          searchQuery || selectedCategory
            ? 'No income entries match your active filter criteria.'
            : 'Start logging your earnings to compute savings and net worth.'
        }
        addActionLabel="Add First Income"
        onAddAction={() => setIsAddModalOpen(true)}
      />

      {/* Add Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultType="income"
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
        title="Delete Income"
        description={`Are you sure you want to permanently delete "${deletingTransaction?.description}"? This action cannot be reversed.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Income;
