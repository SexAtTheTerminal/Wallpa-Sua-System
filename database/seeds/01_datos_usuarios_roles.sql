-- ============================================================
-- INITIAL SEEDS: ROLES
-- ============================================================
INSERT INTO roles (nombre, descripcion) VALUES
('admin', 'Administrador general con acceso total al sistema de gestión'),
('cashier', 'Personal de caja encargado de cobros y emisión de comprobantes'),
('cooker', 'Personal de cocina encargado de la preparación de pedidos'),
('waiter', 'Personal de salón encargado de tomar pedidos en las mesas')
ON CONFLICT (nombre) DO NOTHING;

-- ============================================================
-- INITIAL SEEDS: USUARIOS DE PRUEBA
-- ============================================================
-- NOTA: Hashes bcrypt generados para contraseñas de prueba.
-- Passwords: admin123, caja123, cocina123, mozo123
INSERT INTO usuarios (id, nombre, apellido, email, password, rol_id) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Carlos', 'Mendoza', 'admin@wallpasua.com', '$2a$10$QsuKcuhhS48f/NG.SEafCeljnssBqfTGw5R8Yhkseew75zTgbUgQK', (SELECT id FROM roles WHERE nombre = 'admin')),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Laura', 'Gómez', 'caja@wallpasua.com', '$2a$10$Jn88.ae5Cdm/zU4DfwI09eyoZsHV52HrV302LeMH.lDFakiJEpOuq', (SELECT id FROM roles WHERE nombre = 'cashier')),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Manuel', 'Castro', 'cocina@wallpasua.com', '$2a$10$7bdfSj66HPRRN6jGpfQHoupbeAusjFR9FdG1886axYUh98ANoCKKm', (SELECT id FROM roles WHERE nombre = 'cooker')),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Juan', 'Quispe', 'mozo@wallpasua.com', '$2a$10$bKktrznZlnaHk7xON1sXuuAnQVn.jjpTszNAVB1PDi1nUT2ZhaqWS', (SELECT id FROM roles WHERE nombre = 'waiter'))
ON CONFLICT (email) DO NOTHING;