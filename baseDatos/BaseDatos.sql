-- ==========================================
-- CREAR BASE DE DATOS Y USARLA
-- ==========================================
CREATE DATABASE IF NOT EXISTS REPORTATO;
USE REPORTATO;

-- ==========================================
-- TABLA DE USUARIOS
-- ==========================================
CREATE TABLE IF NOT EXISTS USUARIOS (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  correo VARCHAR(100),
  rol ENUM('Administrador', 'Organizador', 'Usuario'),
  contrasena VARCHAR(100),
  contrasena_temporal BOOLEAN DEFAULT TRUE
);

-- Insertar usuarios de prueba
INSERT INTO USUARIOS (nombre, correo, rol, contrasena) VALUES
  ('Admin', 'admin@correo.com', 'Administrador', '123456'),
  ('AdminTest', 'adminstest@correo.com', 'Administrador', '$2b$10$2y1wV1CtktKUgSf/vmGvzO49TbOPLTESMf9JFpmi3gpjIbIja3aA.'),
  ('Carlos Pérez', 'carlos@correo.com', 'Administrador', '$2y$10$abcdefgHIJKLMNOpqrstuvWXyz1234567890abcdefgHIJKLMNO'),
  ('Laura Gómez', 'laura@correo.com', 'Organizador', '$2y$10$1111111111111111111111111111111111111111111111111111'),
  ('Andrés Silva', 'andres@correo.com', 'Usuario', '$2y$10$2222222222222222222222222222222222222222222222222222'),
  ('Marta Ruiz', 'marta@correo.com', 'Usuario', '$2y$10$3333333333333333333333333333333333333333333333333333'),
  ('Luis Torres', 'luis@correo.com', 'Organizador', '$2y$10$4444444444444444444444444444444444444444444444444444'),
  ('Ana López', 'ana@correo.com', 'Usuario', '$2y$10$5555555555555555555555555555555555555555555555555555'),
  ('Jorge Díaz', 'jorge@correo.com', 'Administrador', '$2y$10$6666666666666666666666666666666666666666666666666666'),
  ('Patricia Vega', 'patricia@correo.com', 'Usuario', '$2y$10$7777777777777777777777777777777777777777777777777777'),
  ('Gabriel Mena', 'gabriel@correo.com', 'Usuario', '$2y$10$8888888888888888888888888888888888888888888888888888'),
  ('Lucía Herrera', 'lucia@correo.com', 'Organizador', '$2y$10$9999999999999999999999999999999999999999999999999999');

-- ==========================================
-- TABLA DE PRODUCTOS
-- ==========================================
CREATE TABLE IF NOT EXISTS PRODUCTOS (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  categoria VARCHAR(50),
  unidad_medida VARCHAR(20) DEFAULT 'kg',
  descripcion TEXT,
  estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar productos
INSERT INTO PRODUCTOS (nombre, categoria, unidad_medida, descripcion) VALUES
  ('Tomate', 'Verduras', 'kg', 'Tomate fresco'),
  ('Cebolla', 'Verduras', 'kg', 'Cebolla blanca'),
  ('Papa', 'Tubérculos', 'kg', 'Papa criolla'),
  ('Zanahoria', 'Verduras', 'kg', 'Zanahoria fresca'),
  ('Lechuga', 'Verduras', 'unidad', 'Lechuga crespa'),
  ('Plátano', 'Frutas', 'kg', 'Plátano maduro'),
  ('Manzana', 'Frutas', 'kg', 'Manzana roja'),
  ('Naranja', 'Frutas', 'kg', 'Naranja dulce'),
  ('Limón', 'Frutas', 'kg', 'Limón verde'),
  ('Cilantro', 'Hierbas', 'manojo', 'Cilantro fresco');

-- ==========================================
-- TABLA DE PROVEEDORES
-- ==========================================
CREATE TABLE IF NOT EXISTS PROVEEDORES (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  empresa VARCHAR(100),
  telefono VARCHAR(20),
  email VARCHAR(100),
  direccion TEXT,
  ciudad VARCHAR(50),
  tipo_proveedor ENUM('Mayorista', 'Minorista', 'Productor', 'Distribuidor') DEFAULT 'Mayorista',
  estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
  producto_id INT,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (producto_id) REFERENCES PRODUCTOS(id) ON DELETE SET NULL
);

-- ==========================================
-- TABLA DE INVENTARIO
-- ==========================================
CREATE TABLE IF NOT EXISTS INVENTARIO (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT NOT NULL,
  stock_actual INT DEFAULT 0,
  stock_minimo INT DEFAULT 0,
  precio_unitario DECIMAL(10,2) DEFAULT 0.00,
  fecha_ingreso DATE,
  fecha_vencimiento DATE NULL,
  estado ENUM('Disponible', 'Stock Bajo', 'Agotado') DEFAULT 'Disponible',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (producto_id) REFERENCES PRODUCTOS(id) ON DELETE CASCADE
);

-- Insertar inventario
INSERT INTO INVENTARIO (producto_id, stock_actual, stock_minimo, precio_unitario, fecha_ingreso, fecha_vencimiento) VALUES
  (1, 50, 10, 2.50, '2024-01-15', '2024-02-15'),
  (2, 30, 5, 1.80, '2024-01-16', '2024-03-16');

-- ==========================================
-- TABLA DE COMPRAS
-- ==========================================
CREATE TABLE IF NOT EXISTS COMPRAS (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  proveedor_id INT NOT NULL,
  fecha_realizada VARCHAR(50) NOT NULL,
  producto_id INT NOT NULL,
  precio_unitario DECIMAL(10,2) DEFAULT 0.00,
  cantidad_producto DECIMAL(10,2) DEFAULT 1.00,
  total DECIMAL(10,2) DEFAULT 0.00,
  FOREIGN KEY (usuario_id) REFERENCES USUARIOS(id) ON DELETE CASCADE,
  FOREIGN KEY (proveedor_id) REFERENCES PROVEEDORES(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES PRODUCTOS(id) ON DELETE CASCADE
);


-- ==========================================
-- TABLA DE SUCURSALES
-- ==========================================
CREATE TABLE IF NOT EXISTS sucursales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  tipo ENUM('verdulería', 'exportación', 'feria', 'mayorista') NOT NULL DEFAULT 'verdulería',
  ubicacion VARCHAR(500) NOT NULL,
  estado ENUM('activa', 'inactiva') NOT NULL DEFAULT 'activa',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tipo (tipo),
  INDEX idx_estado (estado),
  INDEX idx_nombre (nombre)
);

-- ==========================================
-- TABLA DE VENTAS DIARIAS
-- ==========================================
CREATE TABLE IF NOT EXISTS ventas_diarias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sucursal_id INT NOT NULL,
  fecha_venta DATE NOT NULL,
  venta_efectivo DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  venta_tarjeta DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  venta_sinpe DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  venta_total DECIMAL(12,2) GENERATED ALWAYS AS (venta_efectivo + venta_tarjeta + venta_sinpe) STORED,
  observaciones TEXT,
  estado ENUM('pendiente', 'confirmada', 'cerrada') NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sucursal_id) REFERENCES sucursales(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  UNIQUE KEY unique_sucursal_fecha (sucursal_id, fecha_venta),
  INDEX idx_sucursal_fecha (sucursal_id, fecha_venta),
  INDEX idx_fecha (fecha_venta),
  INDEX idx_estado (estado),
  INDEX idx_sucursal (sucursal_id)
);

-- ==========================================
-- VISTA: INFORME DE VENTAS DIARIAS
-- ==========================================
CREATE OR REPLACE VIEW vista_ventas_diarias AS
SELECT 
  vd.id,
  vd.sucursal_id,
  s.nombre AS sucursal_nombre,
  s.tipo AS sucursal_tipo,
  s.ubicacion AS sucursal_ubicacion,
  vd.fecha_venta,
  vd.venta_efectivo,
  vd.venta_tarjeta,
  vd.venta_sinpe,
  vd.venta_total,
  vd.observaciones,
  vd.estado,
  vd.created_at,
  vd.updated_at
FROM ventas_diarias vd
INNER JOIN sucursales s ON vd.sucursal_id = s.id
ORDER BY vd.fecha_venta DESC, s.nombre;

-- ==========================================
-- TABLA DE FIDELIZACIÓN
-- ==========================================
CREATE TABLE IF NOT EXISTS FIDELIZACION (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente VARCHAR(100) NOT NULL,
  fecha_afiliacion VARCHAR(100) NOT NULL,
  categoria VARCHAR(50) NOT NULL
);

-- ==========================================
-- TABLA DE RECUPERACIÓN DE CONTRASEÑA
-- ==========================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES USUARIOS(id) ON DELETE CASCADE
);



INSERT INTO usuarios (nombre, correo, rol, contrasena)
VALUES ('AdminTest', 'adminstest@correo.com', 'Administrador', '$2b$10$2y1wV1CtktKUgSf/vmGvzO49TbOPLTESMf9JFpmi3gpjIbIja3aA.');