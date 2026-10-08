import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { LineChart as LineChartIcon } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import ErrorState from '../ui/ErrorState';
import { formatCurrency } from '../../utils/format';

const compact = (v) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(v);

const TrendTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 py-2 shadow-[var(--shadow-md)] text-xs">
      <p className="font-semibold text-[var(--color-text)] mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            {p.name}
          </span>
          <span className="font-semibold tabular-nums text-[var(--color-text)]">
            {formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export const MonthlyTrendChart = ({ data = [], error, onRetry }) => {
  const hasData = data.some((d) => d.income > 0 || d.expense > 0);
  const chartData = data.map((d) => ({ ...d, label: `${d.month} ${String(d.year).slice(2)}` }));

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div>
          <CardTitle>Income vs Expenses</CardTitle>
          <p className="text-xs text-[var(--color-text-subtle)] mt-0.5">
            Monthly trend over the last {data.length || 6} months
          </p>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <ErrorState
            title="Could not load income and expense trend"
            message={error}
            onRetry={onRetry}
            className="border-none py-8 bg-transparent"
          />
        ) : !hasData ? (
          <EmptyState
            icon={LineChartIcon}
            title="No trend data yet"
            description="Add income and expenses to see how your finances move month to month."
            className="border-none py-8 bg-transparent"
          />
        ) : (
          <div className="h-64 sm:h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: 'var(--chart-axis)', fontSize: 11 }}
                  axisLine={{ stroke: 'var(--chart-grid)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'var(--chart-axis)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={compact}
                  width={44}
                />
                <Tooltip content={<TrendTooltip />} cursor={{ stroke: 'var(--chart-grid)' }} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12, color: 'var(--color-text-muted)' }}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="var(--chart-income)"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: 'var(--chart-income)', strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  name="Expenses"
                  stroke="var(--chart-expense)"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: 'var(--chart-expense)', strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyTrendChart;
