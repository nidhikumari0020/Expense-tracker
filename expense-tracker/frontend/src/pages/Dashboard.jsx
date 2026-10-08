import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { dashboardService } from '../services/dashboardService';
import StatCard from '../component/ui/StatCard';
import { SkeletonCard, Skeleton } from '../component/ui/Skeleton';
import ErrorState from '../component/ui/ErrorState';
import Button from '../component/ui/Button';
import CategoryExpenseChart from '../component/dashboard/CategoryExpenseChart';
import MonthlyTrendChart from '../component/dashboard/MonthlyTrendChart';
import RecentTransactionsList from '../component/dashboard/RecentTransactionsList';
import AddTransactionModal from '../component/transactions/AddTransactionModal';
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Percent,
  Plus,
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [trend, setTrend] = useState([]);
  const [trendError, setTrendError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const loadTrend = useCallback(() => {
    return dashboardService
      .getMonthlyTrend(6)
      .then((result) => {
        if (!Array.isArray(result)) {
          throw new Error('Monthly trend response was invalid.');
        }
        setTrend(result);
        setTrendError(null);
      })
      .catch((err) => {
        console.error('Failed to load monthly trend:', err);
        setTrendError(err.message || 'Failed to load monthly trend');
      });
  }, []);

  const loadData = useCallback(() => {
    loadTrend();
    return dashboardService
      .getDashboardData()
      .then((result) => {
        setData(result);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to load dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [loadTrend]);

  useEffect(() => {
    let ignore = false;
    dashboardService
      .getMonthlyTrend(6)
      .then((result) => {
        if (!ignore) {
          if (!Array.isArray(result)) {
            setTrendError('Monthly trend response was invalid.');
            return;
          }
          setTrend(result);
          setTrendError(null);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('Failed to load monthly trend:', err);
          setTrendError(err.message || 'Failed to load monthly trend');
        }
      });
    dashboardService
      .getDashboardData()
      .then((result) => {
        if (!ignore) {
          setData(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('Failed to load dashboard data:', err);
          setError(err.message || 'Failed to load dashboard data');
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const currentMonthName = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text)]">
            Welcome back, {user?.name || 'User'}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-0.5">
            Here is your financial overview for <span className="font-semibold text-[var(--color-text)]">{currentMonthName}</span>.
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
          title="Could not load dashboard"
          message={error}
          onRetry={loadData}
        />
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6">
              <Skeleton className="h-72 w-full rounded-[var(--radius-lg)]" />
            </div>
            <div className="lg:col-span-6">
              <Skeleton className="h-72 w-full rounded-[var(--radius-lg)]" />
            </div>
          </div>
        </div>
      )}

      {/* Main Loaded View */}
      {!isLoading && !error && data && (
        <>
          {/* Stat Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <StatCard
              label="Total Income"
              value={data.monthlyIncome}
              type="income"
              icon={TrendingUp}
              caption={`Earned in ${currentMonthName}`}
            />
            <StatCard
              label="Total Expenses"
              value={data.monthlyExpense}
              type="expense"
              icon={TrendingDown}
              caption={`Spent in ${currentMonthName}`}
            />
            <StatCard
              label="Net Savings"
              value={data.savings}
              type="savings"
              icon={PiggyBank}
              caption={data.savings >= 0 ? 'Surplus this month' : 'Deficit this month'}
            />
            <StatCard
              label="Savings Rate"
              value={`${data.savingsRate}%`}
              isCurrency={false}
              type="rate"
              icon={Percent}
              caption="Of total income saved"
            />
          </div>

          {/* Monthly Income vs Expense Trend */}
          <MonthlyTrendChart data={trend} error={trendError} onRetry={loadTrend} />

          {/* 2-Column Analytics & Recent Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Category Breakdown Chart */}
            <div className="lg:col-span-6 flex flex-col">
              <CategoryExpenseChart
                distribution={data.expenseDistribution || []}
                totalExpense={data.monthlyExpense || 0}
              />
            </div>

            {/* Recent Transactions List */}
            <div className="lg:col-span-6 flex flex-col">
              <RecentTransactionsList
                transactions={data.recentTransactions || []}
              />
            </div>
          </div>
        </>
      )}

      {/* Reusable Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};

export default Dashboard;
