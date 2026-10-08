import {
  Utensils,
  Home,
  Car,
  ShoppingBag,
  Film,
  Wifi,
  Heart,
  Briefcase,
  TrendingUp,
  Gift,
  DollarSign,
  FileText,
  CreditCard,
  Tag,
} from 'lucide-react';

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Bonus',
  'Gift',
  'Other',
];

export const EXPENSE_CATEGORIES = [
  'Food',
  'Housing',
  'Transport',
  'Shopping',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Other',
];

export const RANGE_OPTIONS = [
  { label: 'Day', value: 'daily' },
  { label: 'Week', value: 'weekly' },
  { label: 'Month', value: 'monthly' },
  { label: 'Year', value: 'yearly' },
];

export const CATEGORY_ICONS = {
  // Expense icons
  Food: Utensils,
  Housing: Home,
  Transport: Car,
  Shopping: ShoppingBag,
  Entertainment: Film,
  Utilities: Wifi,
  Healthcare: Heart,

  // Income icons
  Salary: Briefcase,
  Freelance: CreditCard,
  Investment: TrendingUp,
  Bonus: FileText,
  Gift: Gift,

  // Fallback
  Other: DollarSign,
};

export const getCategoryIcon = (category) => {
  return CATEGORY_ICONS[category] || Tag;
};
