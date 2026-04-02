
export const SummaryCard = ({ title, amount, icon, trend }) => {
  return (
    <div className="summary-card">
      <div className="summary-header">
        <span className="summary-icon">
          {icon}
        </span>
        <h3 className="summary-title">{title}</h3>
      </div>
      <div className="summary-content">
        <p className="summary-amount">{amount}</p>
        {trend && (
          <p className={`summary-trend ${trend.direction}`}>
            <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
            {trend.value}% from last month
          </p>
        )}
      </div>
    </div>
  );
};
