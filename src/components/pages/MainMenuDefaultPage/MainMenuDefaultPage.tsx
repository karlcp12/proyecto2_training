import { useState, useEffect } from 'react';
import { SummaryCard } from "../../organisms/Charts/SummaryCard";
import { BarChartComponent } from "../../organisms/Charts/BarChartComponent";
import { LineChartComponent } from "../../organisms/Charts/LineChartComponent";
import { PieChartComponent } from "../../organisms/Charts/PieChartComponent";
import { FaBox, FaClipboardList, FaExclamationTriangle, FaExchangeAlt } from 'react-icons/fa';
import "../../organisms/Charts/Charts.css";
import "./MainMenuDefaultPage.css";

const API_BASE = 'http://localhost:3001';

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
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/stats/dashboard`);
        const data = await res.json();
        
        setStats({
          totalMaterials: data.totals.materials,
          activeRequests: data.totals.pendingSolicitudes,
          criticalStock: data.totals.criticalStock,
          recentMovements: data.totals.recentMovements,
          materialsData: data.charts.topMaterials,
          movementsData: data.charts.movementHistory,
          statusData: data.charts.statusDistribution
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchStats();
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

        <div className="dashboard-card dashboard-card-large">
          <div className="dashboard-card-title">Movimientos Recientes</div>
          <LineChartComponent data={stats.movementsData} xKey="date" yKey="count" />
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-title">Estado de Solicitudes</div>
          <PieChartComponent data={stats.statusData} />
        </div>

        <div className="dashboard-card dashboard-card-full">
          <div className="dashboard-card-title">Stock de Materiales Principales</div>
          <BarChartComponent data={stats.materialsData} xKey="name" yKey="quantity" />
        </div>
      </div>
    </div>
  );
};
