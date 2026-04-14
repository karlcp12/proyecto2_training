import { pool } from '../db.js';

export const getDashboardStats = async (req, res) => {
    try {
        // 1. Total Materials
        const [totalMatRows] = await pool.query('SELECT COUNT(*) as total FROM MATERIALES');
        
        // 2. Active Requests (Pendiente)
        const [pendingSolRows] = await pool.query("SELECT COUNT(*) as total FROM SOLICITUDES WHERE ESTADO = 'Pendiente'");
        
        // 3. Critical Stock (< 5 units)
        const [criticalRows] = await pool.query('SELECT COUNT(*) as total FROM MATERIALES WHERE CANTIDAD <= 5');
        
        // 4. Distribution by Type
        const [typeDistRows] = await pool.query('SELECT TIPO as name, SUM(CANTIDAD) as value FROM MATERIALES GROUP BY TIPO');
        
        // 5. Status Distribution (Solicitudes)
        const [statusDistRows] = await pool.query('SELECT ESTADO as name, COUNT(*) as value FROM SOLICITUDES GROUP BY ESTADO');
        
        // 6. Movement History (Last 7 days of préstamos)
        const [movementRows] = await pool.query(`
            SELECT FECHA_PRESTAMO as date, COUNT(*) as count 
            FROM PRESTAMOS 
            WHERE FECHA_PRESTAMO >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY FECHA_PRESTAMO
            ORDER BY FECHA_PRESTAMO ASC
        `);

        // 7. Top Materials (by quantity)
        const [topMatRows] = await pool.query('SELECT NOMBRE as name, CANTIDAD as quantity FROM MATERIALES ORDER BY CANTIDAD DESC LIMIT 5');

        res.status(200).json({
            totals: {
                materials: totalMatRows[0].total,
                pendingSolicitudes: pendingSolRows[0].total,
                criticalStock: criticalRows[0].total,
                recentMovements: movementRows.reduce((a, b) => a + b.count, 0)
            },
            charts: {
                typeDistribution: typeDistRows,
                statusDistribution: statusDistRows,
                movementHistory: movementRows,
                topMaterials: topMatRows
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getReportesData = async (req, res) => {
    try {
        // Detailed list of requests for the report table
        const query = `
            SELECT s.ID_SOLICITUD as numero, s.FECHA as fecha, a.NOMBRE_AREA as area, 
                   u.NOMBRE as responsable, s.ESTADO as estado
            FROM SOLICITUDES s
            LEFT JOIN FICHAS f ON s.ID_FICHA = f.ID_FICHA
            LEFT JOIN PROGRAMAS p ON f.ID_PROGRAMA = p.ID_PROGRAMA
            LEFT JOIN AREA a ON p.ID_CENTRO = a.ID_AREA
            LEFT JOIN USUARIOS u ON s.ID_APRENDIZ = u.ID_USUARIO
        `;
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAlertas = async (req, res) => {
    try {
        const alerts = [];
        
        // 1. Low stock alerts
        const [lowStock] = await pool.query('SELECT NOMBRE, CANTIDAD FROM MATERIALES WHERE CANTIDAD <= 5');
        lowStock.forEach(m => {
            alerts.push({
                id_alerta: `stock-${m.NOMBRE}`,
                tipo_alerta: 'Stock Bajo',
                descripcion: `El material ${m.NOMBRE} tiene solo ${m.CANTIDAD} unidades restantes.`,
                fecha: new Date().toLocaleDateString('es-CO')
            });
        });

        // 2. Pending solicitudes alert
        const [pending] = await pool.query("SELECT COUNT(*) as count FROM SOLICITUDES WHERE ESTADO = 'Pendiente'");
        if (pending[0].count > 0) {
            alerts.push({
                id_alerta: 'pending-requests',
                tipo_alerta: 'Solicitudes Pendientes',
                descripcion: `Hay ${pending[0].count} solicitudes esperando aprobación.`,
                fecha: new Date().toLocaleDateString('es-CO')
            });
        }

        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
