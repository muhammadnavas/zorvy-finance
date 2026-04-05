/**
 * Export transactions to CSV file and trigger download.
 */
export const exportToCSV = (transactions, filename = 'zorvy_transactions') => {
  if (!transactions.length) {
    alert('No transactions to export.');
    return;
  }

  const formatCell = (cell) => {
    const stringValue = String(cell ?? '');
    // If cell contains comma, newline or double quote, wrap in quotes and escape internal quotes
    if (/[,\n"]/.test(stringValue)) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const headers = ['Date', 'Type', 'Category', 'Description', 'Amount (INR)'];
  const dataRows = transactions.map(t => [
    t.date,
    t.type.charAt(0).toUpperCase() + t.type.slice(1),
    t.category,
    t.description,
    t.type === 'income' ? t.amount : -Math.abs(t.amount),
  ]);

  // Add summary row
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);
  
  const rows = [
    headers,
    ...dataRows,
    [], // Empty row
    ['', '', '', 'Total Income', totalIncome],
    ['', '', '', 'Total Expenses', -totalExpenses],
    ['', '', '', 'Net Savings', totalIncome - totalExpenses],
  ];

  const csvContent = rows.map(r => r.map(formatCell).join(',')).join('\n');

  // Add UTF-8 BOM for Excel compatibility
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
