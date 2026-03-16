

// Mock data for programas
let programas = [
    { id_programa: 1, codigo: 'P001', nombre_programa: 'Programa 1', id_centro: 1, estado: 'activo' },
    { id_programa: 2, codigo: 'P002', nombre_programa: 'Programa 2', id_centro: 2, estado: 'activo' }
];

export const crearPrograma = (req, res) => {
    const { codigo, nombre_programa, id_centro, estado } = req.body;
    const newId = programas.length > 0 ? Math.max(...programas.map(p => p.id_programa)) + 1 : 1;
    const newPrograma = { id_programa: newId, codigo, nombre_programa, id_centro, estado };
    programas.push(newPrograma);
    res.status(201).json({ ...newPrograma, mensaje: 'Programa creado con éxito' });
};

export const obtenerProgramas = (req, res) => {
    res.status(200).json(programas);
};

export const obtenerProgramaPorId = (req, res) => {
    const { id } = req.params;
    const programa = programas.find(p => p.id_programa == id);
    if (!programa) {
        return res.status(404).json({ mensaje: 'Programa no encontrado' });
    }
    res.status(200).json(programa);
};

export const actualizarPrograma = (req, res) => {
    const { id } = req.params;
    const { codigo, nombre_programa, id_centro, estado } = req.body;
    const programaIndex = programas.findIndex(p => p.id_programa == id);
    if (programaIndex === -1) {
        return res.status(404).json({ mensaje: 'Programa no encontrado' });
    }
    programas[programaIndex] = { ...programas[programaIndex], codigo, nombre_programa, id_centro, estado };
    res.status(200).json({ ...programas[programaIndex], mensaje: 'Programa actualizado con éxito' });
};

export const eliminarPrograma = (req, res) => {
    const { id } = req.params;
    const programaIndex = programas.findIndex(p => p.id_programa == id);
    if (programaIndex === -1) {
        return res.status(404).json({ mensaje: 'Programa no encontrado' });
    }
    programas.splice(programaIndex, 1);
    res.status(200).json({ mensaje: 'Programa eliminado con éxito', id });
};