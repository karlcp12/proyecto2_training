import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PieChartProps {
  data: { name: string; value: number }[];
  colors?: string[];
  onPieClick?: (data: any) => void;
}

export const PieChartComponent: React.FC<PieChartProps> = React.memo(({
  data,
  colors = ['#4caf50', '#ff9800', '#f44336', '#2196f3', '#9c27b0'],
  onPieClick,
}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart style={{ cursor: onPieClick ? 'pointer' : 'default' }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          onClick={(data) => onPieClick && onPieClick(data)}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
});
