import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const API_URL = 'http://localhost:3001/bodega';

export const DashboardRadarChart = () => {
  const [data, setData] = useState([
    { subject: 'Consumibles', A: 0, fullMark: 100 },
    { subject: 'No consumibles', A: 0, fullMark: 100 },
    { subject: 'Herramientas', A: 0, fullMark: 100 },
    { subject: 'Equipos', A: 0, fullMark: 100 },
  ]);

  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        const res = await fetch(API_URL);
        const materiales = await res.json();
        
        let consumible = 0;
        let noConsumible = 0;
        let herramienta = 0;
        let equipos = 0;

        materiales.forEach((m: any) => {
          const qty = Number(m.cantidad) || 0;
          if (m.categoria === 'Consumible') consumible += qty;
          else if (m.categoria === 'No consumible') noConsumible += qty;
          else if (m.categoria === 'Herramienta') herramienta += qty;
          else if (m.categoria === 'Equipos') equipos += qty;
        });

        setData([
          { subject: 'Consumibles', A: consumible, fullMark: Math.max(100, consumible) },
          { subject: 'No consumibles', A: noConsumible, fullMark: Math.max(100, noConsumible) },
          { subject: 'Herramientas', A: herramienta, fullMark: Math.max(100, herramienta) },
          { subject: 'Equipos', A: equipos, fullMark: Math.max(100, equipos) },
        ]);
      } catch (error) {
        console.error('Error fetching materiales:', error);
      }
    };
    
    fetchMateriales();
  }, []);

  return (
    <div style={{ width: '100%', height: 400, backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Materiales de Formación</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
          <Tooltip />
          <Radar name="Cantidad" dataKey="A" stroke="#4caf50" fill="#4caf50" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
