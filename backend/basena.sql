-- Creación de la base de datos "basena" según el diagrama proporcionado
CREATE DATABASE IF NOT EXISTS basena;
USE basena;

-- Tablas base sin llaves foráneas
CREATE TABLE rol (
    ID_Rol INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_Rol VARCHAR(255)
);

CREATE TABLE centro_de_formacion (
    ID_Centro INT AUTO_INCREMENT PRIMARY KEY,
    Codigo_Centro INT,
    Nombre_Centro VARCHAR(255),
    Direccion VARCHAR(255),
    Responsable VARCHAR(255)
);

-- Usuarios y Sedes
CREATE TABLE usuarios (
    ID_Usuario INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(255),
    Apellidos VARCHAR(255),
    Correo VARCHAR(255),
    Contrasena VARCHAR(255),
    Estado VARCHAR(255),
    ID_Rol INT,
    FOREIGN KEY (ID_Rol) REFERENCES rol(ID_Rol)
);

CREATE TABLE sedes (
    ID_Sede INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_Sede VARCHAR(255),
    Direccion VARCHAR(255),
    Coordinador VARCHAR(255),
    Areas_Disponibles INT,
    FK_ID_Centro INT,
    FOREIGN KEY (FK_ID_Centro) REFERENCES centro_de_formacion(ID_Centro)
);

-- Area y Bodega
CREATE TABLE area (
    ID_Area INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_Area VARCHAR(255),
    Ambiente VARCHAR(255),
    FK_ID_Usuario INT,
    FK_ID_Sedes INT,
    FOREIGN KEY (FK_ID_Usuario) REFERENCES usuarios(ID_Usuario),
    FOREIGN KEY (FK_ID_Sedes) REFERENCES sedes(ID_Sede)
);

CREATE TABLE bodega (
    ID_Bodega INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_Bodega VARCHAR(255),
    FK_ID_Area INT,
    FOREIGN KEY (FK_ID_Area) REFERENCES area(ID_Area)
);

-- =========================================================
-- TABLA FALTANTE AÑADIDA: "categoria" o "proveedor"
-- Según el diseño, se nota que Material tiene un Tipo_Material (VARCHAR) 
-- lo cual indica que la categoría o tipo no está normalizado.
-- Adicionalmente, se puede añadir un "proveedor".
-- Aquí se añade "categoria" como la tabla faltante más evidente 
-- para relacionar los tipos de materiales.
-- =========================================================
CREATE TABLE categoria (
    ID_Categoria INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_Categoria VARCHAR(255),
    Descripcion VARCHAR(255)
);

-- Opcionalmente:
-- CREATE TABLE proveedor (
--     ID_Proveedor INT AUTO_INCREMENT PRIMARY KEY,
--     Nombre_Proveedor VARCHAR(255),
--     Telefono VARCHAR(255)
-- );

-- =========================================================

CREATE TABLE material (
    ID_Material INT AUTO_INCREMENT PRIMARY KEY,
    Codigo_SENA INT,
    Nombre_Material VARCHAR(255),
    Stock_Minimo INT,
    Stock_Total INT,
    Unida_Medida VARCHAR(255),
    Descripcion VARCHAR(255),
    Tipo_Material VARCHAR(255), -- Podría ser reemplazado por FK_ID_Categoria
    Fecha_Vencimiento DATE,
    FK_ID_Bodega INT,
    FK_ID_Categoria INT, -- Nueva relación a la tabla faltante
    FOREIGN KEY (FK_ID_Bodega) REFERENCES bodega(ID_Bodega),
    FOREIGN KEY (FK_ID_Categoria) REFERENCES categoria(ID_Categoria)
);

CREATE TABLE solicitud (
    ID_Solicitud INT AUTO_INCREMENT PRIMARY KEY,
    Fecha_Solicitud DATE,
    Motivo VARCHAR(255),
    Estado VARCHAR(255),
    FK_ID_Usuario INT,
    FOREIGN KEY (FK_ID_Usuario) REFERENCES usuarios(ID_Usuario)
);

CREATE TABLE movimiento (
    ID_Movimiento INT AUTO_INCREMENT PRIMARY KEY,
    Cantidad INT,
    Fecha DATE,
    Estado VARCHAR(255),
    FK_ID_Material INT,
    FK_ID_Solicitud INT,
    FOREIGN KEY (FK_ID_Material) REFERENCES material(ID_Material),
    FOREIGN KEY (FK_ID_Solicitud) REFERENCES solicitud(ID_Solicitud)
);

CREATE TABLE asigna (
    ID_Asignacion INT AUTO_INCREMENT PRIMARY KEY,
    Tipo_Asignacion VARCHAR(255),
    FK_ID_Usuario INT,
    FK_ID_Movimiento INT,
    FOREIGN KEY (FK_ID_Usuario) REFERENCES usuarios(ID_Usuario),
    FOREIGN KEY (FK_ID_Movimiento) REFERENCES movimiento(ID_Movimiento)
);

-- =========================================================
-- DATOS INICIALES (seed data)
-- =========================================================

-- Rol Admin
INSERT INTO rol (Nombre_Rol) VALUES ('Admin');

-- Usuario admin | usuario: admin | contraseña: Admin123
INSERT INTO usuarios (Nombre, Apellidos, Correo, Contrasena, Estado, ID_Rol)
VALUES ('Admin', 'Sistema', 'admin', '$2b$10$LSGzjqdn6YFsV6DgGuBk6eq3k8odl/NXMhAj48xpSQgZAYa12KWLq', 'Activo', 1);
