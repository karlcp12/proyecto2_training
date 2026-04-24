import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';

interface GaugeChartProps {
  value: number; // 0 to 100
  label: string;
  color?: string;
}

export const GaugeChartComponent: React.FC<GaugeChartProps> = React.memo(({
  value,
  label,
  color = '#4caf50',
}) => {
  const data = [
    { name: 'Value', value: value },
    { name: 'Remainder', value: 100 - value },
  ];

  return (
    <div style={{ textAlign: 'center' }}>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
          >
            <Cell key="cell-0" fill={color} />
            <Cell key="cell-1" fill="#e0e0e0" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ marginTop: '-40px', fontSize: '24px', fontWeight: 'bold' }}>
        {value}%
      </div>
      <div style={{ fontSize: '14px', color: '#666' }}>{label}</div>
    </div>
  );
});
