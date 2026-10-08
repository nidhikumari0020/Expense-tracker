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

const EditTransactionForm = ({
  transaction,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();

  const type = transaction?.type || 'expense';
  const txId = transaction?._id || transaction?.id;

  const [formData, setFormData] = useState({
    description: transaction?.description || '',
    amount: transaction?.amount !== undefined ? String(transaction.amount) : '',
    category:
      transaction?.category ||
      (type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]),
    date: formatDateForInput(transaction?.date),
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

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
    if (!validate() || !txId) return;

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
        await incomeService.update(txId, payload);
        toast.success('Income updated successfully');
      } else {
        await expenseService.update(txId, payload);
        toast.success('Expense updated successfully');
      }

      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Update transaction failed:', err);
      setServerError(err.message || 'Failed to update transaction');
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

      <Input
        id="edit-description"
        name="description"
        label="Description"
        placeholder="e.g. Grocery Store"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        required
        autoFocus
      />

      <Input
        id="edit-amount"
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
        id="edit-category"
        name="category"
        label="Category"
        value={formData.category}
        onChange={handleChange}
        options={categories}
        error={errors.category}
        required
      />

      <Input
        id="edit-date"
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
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export const EditTransactionModal = ({
  isOpen,
  onClose,
  transaction,
  onSuccess,
}) => {
  if (!isOpen || !transaction) return null;

  const type = transaction?.type || 'expense';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${type === 'income' ? 'Income' : 'Expense'}`}
      description="Modify the transaction details below."
    >
      <EditTransactionForm
        transaction={transaction}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </Modal>
  );
};

export default EditTransactionModal;
