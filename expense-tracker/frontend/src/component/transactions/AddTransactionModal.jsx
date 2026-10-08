import { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useToast } from '../../hooks/useToast';
import { expenseService } from '../../services/expenseService';
import { incomeService } from '../../services/incomeService';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../utils/constants';
import { formatDateForInput } from '../../utils/format';
import { TrendingDown, TrendingUp } from 'lucide-react';

const AddTransactionForm = ({
  defaultType = 'expense',
  lockType = false,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();

  const [type, setType] = useState(defaultType);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: defaultType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
    date: formatDateForInput(),
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleTypeChange = (newType) => {
    if (lockType) return;
    setType(newType);
    setFormData((prev) => ({
      ...prev,
      category: newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.description || formData.description.trim().length === 0) {
      errs.description = 'Description is required';
    }

    const num = Number(formData.amount);
    if (!formData.amount || isNaN(num) || num <= 0) {
      errs.amount = 'Please enter a valid amount greater than 0';
    }

    if (!formData.category) {
      errs.category = 'Category is required';
    }

    if (!formData.date) {
      errs.date = 'Date is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setServerError('');

    const payload = {
      description: formData.description.trim(),
      amount: Number(formData.amount),
      category: formData.category,
      date: formData.date,
    };

    try {
      if (type === 'income') {
        await incomeService.add(payload);
        toast.success('Income added successfully');
      } else {
        await expenseService.add(payload);
        toast.success('Expense added successfully');
      }

      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Add transaction failed:', err);
      setServerError(err.message || 'Failed to add transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {serverError && (
        <div
          role="alert"
          className="p-3 text-xs text-[var(--color-expense)] bg-[var(--color-expense-bg)] border border-[var(--color-expense)]/20 rounded-[var(--radius-md)]"
        >
          {serverError}
        </div>
      )}

      {/* Type Toggle Segmented Control (if not locked) */}
      {!lockType && (
        <div className="flex rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-1 border border-[var(--color-border)]">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex-1 py-1.5 px-3 rounded-[var(--radius-sm)] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              type === 'expense'
                ? 'bg-[var(--color-surface)] text-[var(--color-expense)] shadow-[var(--shadow-sm)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Expense</span>
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex-1 py-1.5 px-3 rounded-[var(--radius-sm)] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              type === 'income'
                ? 'bg-[var(--color-surface)] text-[var(--color-income)] shadow-[var(--shadow-sm)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Income</span>
          </button>
        </div>
      )}

      <Input
        id="tx-description"
        name="description"
        label="Description"
        placeholder="e.g. Grocery Store, Client Invoice"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        required
        autoFocus
      />

      <Input
        id="tx-amount"
        name="amount"
        type="number"
        step="0.01"
        min="0.01"
        inputMode="decimal"
        label="Amount"
        placeholder="0.00"
        prefix="₹"
        value={formData.amount}
        onChange={handleChange}
        error={errors.amount}
        required
      />

      <Select
        id="tx-category"
        name="category"
        label="Category"
        value={formData.category}
        onChange={handleChange}
        options={categories}
        error={errors.category}
        required
      />

      <Input
        id="tx-date"
        name="date"
        type="date"
        label="Date"
        value={formData.date}
        onChange={handleChange}
        error={errors.date}
        required
      />

      <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[var(--color-border)]">
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
        >
          Save {type === 'income' ? 'Income' : 'Expense'}
        </Button>
      </div>
    </form>
  );
};

export const AddTransactionModal = ({
  isOpen,
  onClose,
  defaultType = 'expense',
  lockType = false,
  onSuccess,
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lockType ? `Add ${defaultType === 'income' ? 'Income' : 'Expense'}` : 'Add Transaction'}
      description="Record a new ledger entry with details below."
    >
      <AddTransactionForm
        defaultType={defaultType}
        lockType={lockType}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </Modal>
  );
};

export default AddTransactionModal;
