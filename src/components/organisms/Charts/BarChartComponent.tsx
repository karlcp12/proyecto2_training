import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface BarChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  colors?: string[];
  horizontal?: boolean;
  onBarClick?: (data: any) => void;
}

export const BarChartComponent: React.FC<BarChartProps> = React.memo(({
  data,
  xKey,
  yKey,
  colors = ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0'],
  horizontal = false,
  onBarClick,
}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        layout={horizontal ? 'vertical' : 'horizontal'}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={horizontal} horizontal={!horizontal} />
        {horizontal ? (
          <>
            <XAxis type="number" />
            <YAxis dataKey={xKey} type="category" width={100} />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} />
            <YAxis />
          </>
        )}
        <Tooltip />
        <Legend />
        <Bar 
          dataKey={yKey} 
          fill="#4caf50" 
          onClick={(data) => onBarClick && onBarClick(data)}
          style={{ cursor: onBarClick ? 'pointer' : 'default' }}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
});
