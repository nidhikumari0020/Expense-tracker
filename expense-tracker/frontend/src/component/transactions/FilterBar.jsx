import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { RANGE_OPTIONS } from '../../utils/constants';
import { Search, Download, Filter } from 'lucide-react';

export const FilterBar = ({
  search = '',
  onSearchChange,
  category = '',
  onCategoryChange,
  categories = [],
  range = 'monthly',
  onRangeChange,
  onExport,
  isExporting = false,
  showSearch = true,
  showRange = true,
  showCategory = true,
  showExport = true,
  exportLabel = 'Export Excel',
}) => {
  const categoryOptions = [
    { label: 'All Categories', value: '' },
    ...categories.map((c) => ({ label: c, value: c })),
  ];

  return (
    <div className="flex flex-col gap-3 bg-[var(--color-surface)] p-3 sm:p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
      {/* Top Row: Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {showSearch && (
          <div className="flex-1">
            <Input
              id="search-filter"
              name="search"
              placeholder="Search by description..."
              icon={Search}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full"
            />
          </div>
        )}

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {showCategory && (
            <div className="w-full sm:w-44">
              <Select
                id="category-filter"
                name="category"
                value={category}
                onChange={(e) => onCategoryChange(e.target.value)}
                options={categoryOptions}
                placeholder="Category"
              />
            </div>
          )}

          {showExport && onExport && (
            <Button
              variant="secondary"
              icon={Download}
              onClick={onExport}
              isLoading={isExporting}
              className="w-full sm:w-auto shrink-0"
            >
              {exportLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Bottom Row: Range Segmented Control (if enabled) */}
      {showRange && onRangeChange && (
        <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)] overflow-x-auto gap-2">
          <div className="flex items-center gap-1 text-xs text-[var(--color-text-subtle)] font-medium shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Timeframe:</span>
          </div>

          <div className="flex rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-0.5 border border-[var(--color-border)] shrink-0">
            {RANGE_OPTIONS.map((opt) => {
              const isActive = range === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onRangeChange(opt.value)}
                  className={`py-1 px-2.5 rounded-[var(--radius-sm)] text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-[var(--shadow-sm)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
