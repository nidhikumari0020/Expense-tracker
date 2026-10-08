import { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import { formatCurrency } from '../../utils/format';
import { getCategoryIcon } from '../../utils/constants';
import { PieChart as PieChartIcon } from 'lucide-react';

const CHART_COLORS = [
  'var(--chart-series-1)',
  'var(--chart-series-2)',
  'var(--chart-series-3)',
  'var(--chart-series-4)',
  'var(--chart-series-5)',
  'var(--chart-series-6)',
];

export const CategoryExpenseChart = ({ distribution = [], totalExpense = 0 }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const hasData = Array.isArray(distribution) && distribution.length > 0 && totalExpense > 0;

  // Calculate SVG donut segments
  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;
  const segments = hasData
    ? distribution.map((item, index) => {
        const percent = totalExpense > 0 ? (item.amount / totalExpense) * 100 : 0;
        const strokeDasharray = `${(percent / 100) * circumference} ${circumference}`;
        const strokeDashoffset = -((cumulativePercent / 100) * circumference);
        cumulativePercent += percent;

        return {
          ...item,
          percent: Math.round(percent),
          color: CHART_COLORS[index % CHART_COLORS.length],
          strokeDasharray,
          strokeDashoffset,
        };
      })
    : [];

  const activeItem = hoveredIndex !== null ? segments[hoveredIndex] : null;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div>
          <CardTitle>Expense by Category</CardTitle>
          <p className="text-xs text-[var(--color-text-subtle)] mt-0.5">
            Spending distribution for current month
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-center">
        {!hasData ? (
          <EmptyState
            icon={PieChartIcon}
            title="No expense data"
            description="Log your expenses this month to see your category breakdown."
            className="border-none py-8 bg-transparent"
          />
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* SVG Donut Chart */}
            <div className="relative flex items-center justify-center shrink-0">
              <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="rotate-[-90deg] transition-transform duration-300"
              >
                {/* Background Ring */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke="var(--color-surface-muted)"
                  strokeWidth={strokeWidth}
                />

                {/* Data Segments */}
                {segments.map((seg, index) => (
                  <circle
                    key={seg.category || index}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth={hoveredIndex === index ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={seg.strokeDasharray}
                    strokeDashoffset={seg.strokeDashoffset}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                ))}
              </svg>

              {/* Center Info Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
                <span className="text-[10px] font-medium text-[var(--color-text-subtle)] uppercase tracking-wider truncate max-w-[100px]">
                  {activeItem ? activeItem.category : 'Total Spent'}
                </span>
                <span className="text-sm sm:text-base font-bold text-[var(--color-text)] tabular-nums mt-0.5">
                  {formatCurrency(activeItem ? activeItem.amount : totalExpense)}
                </span>
                {activeItem && (
                  <span className="text-[10px] font-semibold text-[var(--color-expense)] bg-[var(--color-expense-bg)] px-1.5 py-0.2 rounded mt-0.5">
                    {activeItem.percent}%
                  </span>
                )}
              </div>
            </div>

            {/* Category Legend & Progress Bars */}
            <div className="w-full flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1 flex-1">
              {segments.map((item, index) => {
                const Icon = getCategoryIcon(item.category);
                const isHovered = hoveredIndex === index;

                return (
                  <div
                    key={item.category || index}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`flex flex-col gap-1 p-2 rounded-[var(--radius-md)] transition-all cursor-pointer ${
                      isHovered
                        ? 'bg-[var(--color-surface-muted)] shadow-[var(--shadow-sm)]'
                        : 'hover:bg-[var(--color-surface-muted)]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="w-5 h-5 rounded-[var(--radius-sm)] bg-[var(--color-surface)] flex items-center justify-center shrink-0 border border-[var(--color-border)]">
                          <Icon className="w-3 h-3 text-[var(--color-text-muted)]" />
                        </div>
                        <span className="font-medium text-[var(--color-text)] truncate">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-semibold text-[var(--color-text)] tabular-nums">
                          {formatCurrency(item.amount)}
                        </span>
                        <span className="text-[10px] font-medium text-[var(--color-text-subtle)] bg-[var(--color-surface)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
                          {item.percent}%
                        </span>
                      </div>
                    </div>

                    {/* Mini Progress Bar */}
                    <div className="w-full h-1 bg-[var(--color-surface-muted)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${item.percent}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryExpenseChart;
