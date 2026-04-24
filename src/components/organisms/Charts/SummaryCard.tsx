import React from 'react';
import './Charts.css';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  subtitle?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = React.memo(({
  title,
  value,
  icon,
  color = '#4caf50',
  subtitle,
}) => {
  return (
    <div className="summary-card" style={{ borderLeft: `5px solid ${color}` }}>
      <div className="summary-card-content">
        <div className="summary-card-title">{title}</div>
        <div className="summary-card-value">{value}</div>
        {subtitle && <div className="summary-card-subtitle">{subtitle}</div>}
      </div>
      {icon && <div className="summary-card-icon" style={{ color: color }}>{icon}</div>}
    </div>
  );
});
