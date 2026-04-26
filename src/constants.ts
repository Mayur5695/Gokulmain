export const CATEGORIES = {
  warehouse: { label: 'Warehouse Deposit', icon: '🏭', color: 'blue' },
  rent: { label: 'Rent (दरमहा)', icon: '🏠', color: 'blue' },
  vehicle: { label: 'Vehicle / Petrol', icon: '🚗', color: 'gold' },
  banner: { label: 'Banner / Marketing', icon: '🪧', color: 'gold' },
  advance: { label: 'Dealership Advance', icon: '💼', color: 'saffron' },
  inventory: { label: 'Inventory / Material', icon: '📦', color: 'green' },
  transport: { label: 'Transport / Delivery', icon: '🚚', color: 'green' },
  misc: { label: 'Miscellaneous', icon: '📌', color: 'muted' },
};

export const PARTNERS = ['Mayur', 'Suhail', 'Rahul', 'Common'];

export type Expense = {
  id: string;
  date: string;
  category: keyof typeof CATEGORIES;
  amount: number;
  paidBy: string;
  notes: string;
  createdAt: number;
};

export type FixedExpense = {
  id: string;
  name: string;
  amount: number;
  dayOfMonth: number;
  notes: string;
};
