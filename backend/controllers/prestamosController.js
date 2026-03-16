// Mock data for prestamos
let prestamos = [
    { id_prestamo: 1, id_solicitud: 1, fecha_prestamo: '2023-01-01', fecha_devolucion_esperada: '2023-01-10', fecha_devolucion_real: null, entregado_por: 'Juan Perez', id_recibido_por: 1, estado: 'activo' },
    { id_prestamo: 2, id_solicitud: 2, fecha_prestamo: '2023-01-02', fecha_devolucion_esperada: '2023-01-11', fecha_devolucion_real: '2023-01-09', entregado_por: 'Ana Gomez', id_recibido_por: 2, estado: 'devuelto' }
];

export const crearPrestamo = (req, res) => {
    const { id_solicitud, fecha_prestamo, fecha_devolucion_esperada, fecha_devolucion_real, entregado_por, id_recibido_por, estado } = req.body;
    const newId = prestamos.length > 0 ? Math.max(...prestamos.map(p => p.id_prestamo)) + 1 : 1;
    const newPrestamo = { id_prestamo: newId, id_solicitud, fecha_prestamo, fecha_devolucion_esperada, fecha_devolucion_real, entregado_por, id_recibido_por, estado };
    prestamos.push(newPrestamo);
    res.status(201).json({ ...newPrestamo, mensaje: 'Prestamo creado con éxito' });
};

export const obtenerPrestamos = (req, res) => {
    res.status(200).json(prestamos);
};

export const obtenerPrestamoPorId = (req, res) => {
    const { id } = req.params;
    const prestamo = prestamos.find(p => p.id_prestamo == id);
    if (!prestamo) {
        return res.status(404).json({ mensaje: 'Prestamo no encontrado' });
    }
    res.status(200).json(prestamo);
};

export const actualizarPrestamo = (req, res) => {
    const { id } = req.params;
    const { id_solicitud, fecha_prestamo, fecha_devolucion_esperada, fecha_devolucion_real, entregado_por, id_recibido_por, estado } = req.body;
    const prestamoIndex = prestamos.findIndex(p => p.id_prestamo == id);
    if (prestamoIndex === -1) {
        return res.status(404).json({ mensaje: 'Prestamo no encontrado' });
    }
    prestamos[prestamoIndex] = { ...prestamos[prestamoIndex], id_solicitud, fecha_prestamo, fecha_devolucion_esperada, fecha_devolucion_real, entregado_por, id_recibido_por, estado };
    res.status(200).json({ ...prestamos[prestamoIndex], mensaje: 'Prestamo actualizado con éxito' });
};

export const eliminarPrestamo = (req, res) => {
    const { id } = req.params;
    const prestamoIndex = prestamos.findIndex(p => p.id_prestamo == id);
    if (prestamoIndex === -1) {
        return res.status(404).json({ mensaje: 'Prestamo no encontrado' });
    }
    prestamos.splice(prestamoIndex, 1);
    res.status(200).json({ mensaje: 'Prestamo eliminado con éxito', id });
};