import { pool } from '../config/db.js';

export const getDashboardStats = async (req, res) => {
    try {
        // 1. Totales
        const [totalMaterials] = await pool.query('SELECT COUNT(*) as count FROM materiales');
        const [pendingSolicitudes] = await pool.query("SELECT COUNT(*) as count FROM solicitudes WHERE Estado = 'Pendiente'");
        const [criticalStock] = await pool.query('SELECT COUNT(*) as count FROM materiales WHERE Stock_Total < 5');
        const [recentMovements] = await pool.query('SELECT COUNT(*) as count FROM movimiento WHERE Fecha >= DATE_SUB(NOW(), INTERVAL 7 DAY)');

        // 2. Gráfica de Barras: Top Materiales (Stock)
        const [topMaterials] = await pool.query(
            'SELECT Nombre_Material as name, Stock_Total as quantity FROM materiales ORDER BY Stock_Total DESC LIMIT 5'
        );

        // 3. Gráfica de Líneas: Historial de Movimientos (Últimos 7 días)
        const [movementHistory] = await pool.query(`
            SELECT DATE_FORMAT(Fecha, '%Y-%m-%d') as date, COUNT(*) as count 
            FROM movimiento 
            WHERE Fecha >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
            GROUP BY date 
            ORDER BY date ASC
        `);

        // 4. Gráfica Circular: Distribución de Estados de Solicitudes
        const [statusDistribution] = await pool.query(
            'SELECT Estado as name, COUNT(*) as value FROM solicitudes GROUP BY Estado'
        );

        res.status(200).json({
            totals: {
                materials: totalMaterials[0].count,
                pendingSolicitudes: pendingSolicitudes[0].count,
                criticalStock: criticalStock[0].count,
                recentMovements: recentMovements[0].count
            },
            charts: {
                topMaterials,
                movementHistory,
                statusDistribution
            }
        });

    } catch (error) {
        console.error("Error in getDashboardStats:", error);
        res.status(500).json({ error: error.message });
    }
};
