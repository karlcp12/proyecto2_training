// Mock data for detalle_prestamo
let detallePrestamo = [
    { id_detalle_prestamo: 1, id_prestamo: 1, id_material: 1, cantidad_prestada: 5, estado_material: 'bueno' },
    { id_detalle_prestamo: 2, id_prestamo: 2, id_material: 2, cantidad_prestada: 3, estado_material: 'regular' }
];

export const crearDetallePrestamo = (req, res) => {
    const { id_prestamo, id_material, cantidad_prestada, estado_material } = req.body;
    const newId = detallePrestamo.length > 0 ? Math.max(...detallePrestamo.map(d => d.id_detalle_prestamo)) + 1 : 1;
    const newDetalle = { id_detalle_prestamo: newId, id_prestamo, id_material, cantidad_prestada, estado_material };
    detallePrestamo.push(newDetalle);
    res.status(201).json({ ...newDetalle, mensaje: 'Detalle de prestamo creado con éxito' });
};

export const obtenerDetallesPrestamo = (req, res) => {
    res.status(200).json(detallePrestamo);
};

export const obtenerDetallePrestamoPorId = (req, res) => {
    const { id } = req.params;
    const detalle = detallePrestamo.find(d => d.id_detalle_prestamo == id);
    if (!detalle) {
        return res.status(404).json({ mensaje: 'Detalle de prestamo no encontrado' });
    }
    res.status(200).json(detalle);
};

export const actualizarDetallePrestamo = (req, res) => {
    const { id } = req.params;
    const { id_prestamo, id_material, cantidad_prestada, estado_material } = req.body;
    const detalleIndex = detallePrestamo.findIndex(d => d.id_detalle_prestamo == id);
    if (detalleIndex === -1) {
        return res.status(404).json({ mensaje: 'Detalle de prestamo no encontrado' });
    }
    detallePrestamo[detalleIndex] = { ...detallePrestamo[detalleIndex], id_prestamo, id_material, cantidad_prestada, estado_material };
    res.status(200).json({ ...detallePrestamo[detalleIndex], mensaje: 'Detalle de prestamo actualizado con éxito' });
};

export const eliminarDetallePrestamo = (req, res) => {
    const { id } = req.params;
    const detalleIndex = detallePrestamo.findIndex(d => d.id_detalle_prestamo == id);
    if (detalleIndex === -1) {
        return res.status(404).json({ mensaje: 'Detalle de prestamo no encontrado' });
    }
    detallePrestamo.splice(detalleIndex, 1);
    res.status(200).json({ mensaje: 'Detalle de prestamo eliminado con éxito', id });
};