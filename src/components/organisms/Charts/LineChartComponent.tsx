import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface LineChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  color?: string;
}

export const LineChartComponent: React.FC<LineChartProps> = React.memo(({
  data,
  xKey,
  yKey,
  color = '#2196f3',
}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey={yKey} 
          stroke={color} 
          activeDot={{ r: 8 }} 
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
});
