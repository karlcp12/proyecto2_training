// Mock data for devoluciones
let devoluciones = [
    { id_devolucion: 1, id_prestamo: 1, id_usuario: 1, fecha_devolucion: '2023-01-10', estado_materiales: 'bueno' },
    { id_devolucion: 2, id_prestamo: 2, id_usuario: 2, fecha_devolucion: '2023-01-09', estado_materiales: 'dañado' }
];

export const crearDevolucion = (req, res) => {
    const { id_prestamo, id_usuario, fecha_devolucion, estado_materiales } = req.body;
    const newId = devoluciones.length > 0 ? Math.max(...devoluciones.map(d => d.id_devolucion)) + 1 : 1;
    const newDevolucion = { id_devolucion: newId, id_prestamo, id_usuario, fecha_devolucion, estado_materiales };
    devoluciones.push(newDevolucion);
    res.status(201).json({ ...newDevolucion, mensaje: 'Devolucion creada con éxito' });
};

export const obtenerDevoluciones = (req, res) => {
    res.status(200).json(devoluciones);
};

export const obtenerDevolucionPorId = (req, res) => {
    const { id } = req.params;
    const devolucion = devoluciones.find(d => d.id_devolucion == id);
    if (!devolucion) {
        return res.status(404).json({ mensaje: 'Devolucion no encontrada' });
    }
    res.status(200).json(devolucion);
};

export const actualizarDevolucion = (req, res) => {
    const { id } = req.params;
    const { id_prestamo, id_usuario, fecha_devolucion, estado_materiales } = req.body;
    const devolucionIndex = devoluciones.findIndex(d => d.id_devolucion == id);
    if (devolucionIndex === -1) {
        return res.status(404).json({ mensaje: 'Devolucion no encontrada' });
    }
    devoluciones[devolucionIndex] = { ...devoluciones[devolucionIndex], id_prestamo, id_usuario, fecha_devolucion, estado_materiales };
    res.status(200).json({ ...devoluciones[devolucionIndex], mensaje: 'Devolucion actualizada con éxito' });
};

export const eliminarDevolucion = (req, res) => {
    const { id } = req.params;
    const devolucionIndex = devoluciones.findIndex(d => d.id_devolucion == id);
    if (devolucionIndex === -1) {
        return res.status(404).json({ mensaje: 'Devolucion no encontrada' });
    }
    devoluciones.splice(devolucionIndex, 1);
    res.status(200).json({ mensaje: 'Devolucion eliminada con éxito', id });
};