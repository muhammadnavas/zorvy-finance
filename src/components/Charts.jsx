import { useEffect, useMemo, useRef } from 'react';
import { useFinance } from '../context/FinanceContext';

export const Charts = () => {
  const { transactions } = useFinance();
  const categoryChartRef = useRef(null);
  const trendChartRef = useRef(null);

  const chartData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categorySpending = {};
    
    expenses.forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + Math.abs(t.amount);
    });

    const monthlyData = {};
    transactions.forEach(t => {
      const month = t.date.substring(0, 7);
      if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
      if (t.type === 'income') monthlyData[month].income += t.amount;
      else monthlyData[month].expense += Math.abs(t.amount);
    });

    return { categorySpending, monthlyData };
  }, [transactions]);

  // Draw spending by category pie chart
  useEffect(() => {
    const canvas = categoryChartRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const data = Object.entries(chartData.categorySpending);
    if (data.length === 0) return;

    const total = data.reduce((sum, [_, val]) => sum + val, 0);
    const colors = ['#00d9ff', '#ff006e', '#a855f7', '#06b6d4', '#ec4899', '#8b5cf6'];

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;

    let currentAngle = 0;
    data.forEach(([category, amount], idx) => {
      const sliceAngle = (amount / total) * 2 * Math.PI;

      ctx.fillStyle = colors[idx % colors.length];
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();

      // Draw label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

      ctx.fillStyle = '#000';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const percentage = ((amount / total) * 100).toFixed(0);
      ctx.fillText(`${percentage}%`, labelX, labelY);

      currentAngle += sliceAngle;
    });
  }, [chartData]);

  // Draw balance trend line chart
  useEffect(() => {
    const canvas = trendChartRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const months = Object.keys(chartData.monthlyData).sort();
    
    if (months.length === 0) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 40;
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;

    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Calculate balance over time
    let balance = 0;
    const balances = months.map(month => {
      const data = chartData.monthlyData[month];
      balance += data.income - data.expense;
      return balance;
    });

    const minBalance = Math.min(...balances);
    const maxBalance = Math.max(...balances);
    const range = maxBalance - minBalance || 1;

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i <= 4; i++) {
      const y = padding + (height * i) / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    // Draw line
    ctx.strokeStyle = '#00d9ff';
    ctx.lineWidth = 3;
    ctx.beginPath();

    balances.forEach((balance, idx) => {
      const x = padding + (width * idx) / (months.length - 1 || 1);
      const y = canvas.height - padding - ((balance - minBalance) / range) * height;
      
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#ff006e';
    balances.forEach((balance, idx) => {
      const x = padding + (width * idx) / (months.length - 1 || 1);
      const y = canvas.height - padding - ((balance - minBalance) / range) * height;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    months.forEach((month, idx) => {
      const x = padding + (width * idx) / (months.length - 1 || 1);
      ctx.fillText(month, x, canvas.height - padding + 20);
    });
  }, [chartData]);

  return (
    <div className="charts-section">
      <h2>Financial Overview</h2>
      
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Spending by Category</h3>
          <canvas ref={categoryChartRef} width={300} height={250}></canvas>
        </div>

        <div className="chart-card">
          <h3>Balance Trend</h3>
          <canvas ref={trendChartRef} width={400} height={250}></canvas>
        </div>
      </div>
    </div>
  );
};
