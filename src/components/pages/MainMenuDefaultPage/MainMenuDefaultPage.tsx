import { useState, useEffect } from 'react';
import { SummaryCard } from "../../organisms/Charts/SummaryCard";
import { BarChartComponent } from "../../organisms/Charts/BarChartComponent";
import { LineChartComponent } from "../../organisms/Charts/LineChartComponent";
import { PieChartComponent } from "../../organisms/Charts/PieChartComponent";
import { FaBox, FaClipboardList, FaExclamationTriangle, FaExchangeAlt } from 'react-icons/fa';
import "../../organisms/Charts/Charts.css";
import "./MainMenuDefaultPage.css";

const API_BASE = 'http://localhost:3000';

interface ChartData {
  name: string;
  value: number;
}

interface LineData {
  date: string;
  count: number;
}

interface BarData {
  name: string;
  quantity: number;
}

interface DashboardStats {
  totalMaterials: number;
  activeRequests: number;
  criticalStock: number;
  recentMovements: number;
  materialsData: BarData[];
  movementsData: LineData[];
  statusData: ChartData[];
}

export const MainMenuDefaultPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalMaterials: 0,
    activeRequests: 0,
    criticalStock: 0,
    recentMovements: 0,
    materialsData: [],
    movementsData: [],
    statusData: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Materials
        const matRes = await fetch(`${API_BASE}/bodega`);
        const materials = await matRes.json();
        
        // Fetch Solicitudes
        const solRes = await fetch(`${API_BASE}/solicitudes`);
        const solicitudes = await solRes.json();

        // Process data
        const totalMat = materials.length;
        const critical = materials.filter((m: any) => Number(m.cantidad) <= 5).length;
        const pending = solicitudes.filter((s: any) => s.estado === 'Pendiente').length;
        
        // Mock data for movements (since backend might not have history yet)
        const mockMovements = [
          { date: '2026-04-07', count: 12 },
          { date: '2026-04-08', count: 19 },
          { date: '2026-04-09', count: 15 },
          { date: '2026-04-10', count: 22 },
          { date: '2026-04-11', count: 30 },
          { date: '2026-04-12', count: 25 },
          { date: '2026-04-13', count: 28 },
        ];

        // Process status distribution
        const statusCounts = solicitudes.reduce((acc: any, curr: any) => {
          acc[curr.estado] = (acc[curr.estado] || 0) + 1;
          return acc;
        }, {});
        
        const statusData = Object.keys(statusCounts).map(key => ({
          name: key,
          value: statusCounts[key]
        }));

        setStats({
          totalMaterials: totalMat,
          activeRequests: pending,
          criticalStock: critical,
          recentMovements: mockMovements.reduce((a, b) => a + b.count, 0),
          materialsData: materials.slice(0, 5).map((m: any) => ({ name: m.nombre, quantity: Number(m.cantidad) })),
          movementsData: mockMovements,
          statusData: statusData.length > 0 ? statusData : [
            { name: 'Pendiente', value: 10 },
            { name: 'Aprobado', value: 15 },
            { name: 'Rechazado', value: 5 }
          ]
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        // Fallback mock data if server is down
        setStats({
          totalMaterials: 45,
          activeRequests: 8,
          criticalStock: 3,
          recentMovements: 151,
          materialsData: [
            { name: 'Laptop HP', quantity: 15 },
            { name: 'Monitor 24', quantity: 25 },
            { name: 'Teclado Mecánico', quantity: 10 },
            { name: 'Mouse Logitech', quantity: 40 },
            { name: 'Cable HDMI', quantity: 33 }
          ],
          movementsData: [
            { date: '07/04', count: 12 },
            { date: '08/04', count: 19 },
            { date: '09/04', count: 15 },
            { date: '10/04', count: 22 },
            { date: '11/04', count: 30 },
            { date: '12/04', count: 25 },
            { date: '13/04', count: 28 },
          ],
          statusData: [
            { name: 'Pendiente', value: 40 },
            { name: 'Aprobado', value: 45 },
            { name: 'Rechazado', value: 15 }
          ]
        });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="main-menu-default">
      <div className="dashboard-section-title">Resumen General del Sistema</div>
      
      <div className="dashboard-grid">
        <SummaryCard 
          title="Total Materiales" 
          value={stats.totalMaterials} 
          icon={<FaBox />} 
          color="#2196f3" 
        />
        <SummaryCard 
          title="Solicitudes Pendientes" 
          value={stats.activeRequests} 
          icon={<FaClipboardList />} 
          color="#ff9800" 
        />
        <SummaryCard 
          title="Stock Crítico" 
          value={stats.criticalStock} 
          icon={<FaExclamationTriangle />} 
          color="#f44336" 
          subtitle="Materiales con < 5 unidades"
        />
        <SummaryCard 
          title="Movimientos (7 días)" 
          value={stats.recentMovements} 
          icon={<FaExchangeAlt />} 
          color="#4caf50" 
        />

        <div className="dashboard-card" style={{ gridColumn: 'span 3' }}>
          <div className="dashboard-card-title">Movimientos Recientes</div>
          <LineChartComponent data={stats.movementsData} xKey="date" yKey="count" />
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-title">Estado de Solicitudes</div>
          <PieChartComponent data={stats.statusData} />
        </div>

        <div className="dashboard-card" style={{ gridColumn: 'span 4' }}>
          <div className="dashboard-card-title">Stock de Materiales Principales</div>
          <BarChartComponent data={stats.materialsData} xKey="name" yKey="quantity" />
        </div>
      </div>
    </div>
  );
};
