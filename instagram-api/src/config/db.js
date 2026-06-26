// src/config/db.js
const { Pool } = require('pg');
require('dotenv').config();

// ════════════════════════════════════════════════════════════
// POOL DE CONEXIONES A POSTGRESQL
// ════════════════════════════════════════════════════════════
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Evento de conexión exitosa
pool.on('connect', () => {
  console.log(' Conexión a PostgreSQL establecida');
});

// Evento de error en la conexión
pool.on('error', (err) => {
  console.error(' Error en el pool de PostgreSQL:', err);
});

// ════════════════════════════════════════════════════════════
//  CREAR TABLAS (si no existen)
// ════════════════════════════════════════════════════════════
const crearTablas = async () => {
  try {
    //  Tabla de usuarios
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
        nombre_completo VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        foto_perfil VARCHAR(255) DEFAULT 'https://via.placeholder.com/150',
        biografia TEXT,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log(' Tabla usuarios lista');

    //  Tabla de publicaciones
    await pool.query(`
      CREATE TABLE IF NOT EXISTS publicaciones (
        id SERIAL PRIMARY KEY,
        usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        url_imagen VARCHAR(255) NOT NULL,
        descripcion TEXT,
        likes INT DEFAULT 0,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log(' Tabla publicaciones lista');

    //  Crear índices para optimizar búsquedas
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_publicaciones_usuario_id 
      ON publicaciones(usuario_id);
    `);
    console.log('Índices creados');

  } catch (err) {
    console.error('Error al crear tablas:', err);
  }
};

// Ejecutar creación de tablas al iniciar
crearTablas();

module.exports = pool;
