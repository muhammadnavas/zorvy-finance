import {
  Briefcase, Laptop, BarChart3, Home, UtensilsCrossed, ShoppingBag,
  Clapperboard, Zap, Car, Pill, GraduationCap, ArrowDownToLine, ArrowUpFromLine,
} from 'lucide-react';

// Map category names to Lucide icon components
const iconMap = {
  Salary: Briefcase,
  Freelance: Laptop,
  Investment: BarChart3,
  Rent: Home,
  'Food & Dining': UtensilsCrossed,
  Shopping: ShoppingBag,
  Entertainment: Clapperboard,
  Utilities: Zap,
  Transport: Car,
  Health: Pill,
  Education: GraduationCap,
};

// Category → color mapping for icon tinting
const iconColors = {
  Salary: '#10b981',
  Freelance: '#06b6d4',
  Investment: '#8b5cf6',
  Rent: '#f59e0b',
  'Food & Dining': '#3b82f6',
  Shopping: '#ec4899',
  Entertainment: '#f97316',
  Utilities: '#eab308',
  Transport: '#6366f1',
  Health: '#ef4444',
  Education: '#14b8a6',
};

/**
 * Renders a Lucide icon for a given transaction category.
 * Falls back to ArrowDown (income) or ArrowUp (expense) if category is unknown.
 */
export const CategoryIcon = ({ category, type, size = 18 }) => {
  const IconComponent = iconMap[category] || (type === 'income' ? ArrowDownToLine : ArrowUpFromLine);
  const color = iconColors[category] || (type === 'income' ? '#10b981' : '#ef4444');

  return <IconComponent size={size} color={color} />;
};

export { iconColors };
