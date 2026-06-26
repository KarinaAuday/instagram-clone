// src/services/authService.js
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// ════════════════════════════════════════════════════════════
// 🔐 SERVICIO DE AUTENTICACIÓN - CAPA DE DATOS
// ════════════════════════════════════════════════════════════

/**
 * Buscar usuario por email
 * @param {string} email - Email del usuario
 * @returns {Promise<object|null>} Usuario encontrado o null
 */
const buscarPorEmail = async (email) => {
  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Error al buscar usuario por email: ${err.message}`);
  }
};

/**
 * Buscar usuario por nombre de usuario
 * @param {string} nombreUsuario - Nombre de usuario
 * @returns {Promise<object|null>} Usuario encontrado o null
 */
const buscarPorNombreUsuario = async (nombreUsuario) => {
  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE nombre_usuario = $1',
      [nombreUsuario]
    );
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Error al buscar usuario: ${err.message}`);
  }
};

/**
 * Crear nuevo usuario con contraseña encriptada
 * @param {object} datos - { nombre_usuario, nombre_completo, email, password }
 * @returns {Promise<object>} Usuario creado (sin contraseña)
 */
const crearUsuario = async (datos) => {
  const { nombre_usuario, nombre_completo, email, password } = datos;
  
  try {
    // 1️⃣ Encriptar contraseña con bcrypt (10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2️⃣ Insertar en BD
    const result = await pool.query(
      `INSERT INTO usuarios (nombre_usuario, nombre_completo, email, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre_usuario, nombre_completo, email, fecha_registro`,
      [nombre_usuario, nombre_completo, email, hashedPassword]
    );

    return result.rows[0];

  } catch (err) {
    if (err.code === '23505') { // Violación de constraint UNIQUE
      throw new Error(`El email o nombre de usuario ya existe`);
    }
    throw new Error(`Error al crear usuario: ${err.message}`);
  }
};

/**
 * Verificar contraseña
 * @param {string} passwordIngresada - Contraseña que ingresó el usuario
 * @param {string} passwordEnBD - Hash almacenado en BD
 * @returns {Promise<boolean>} true si coinciden, false si no
 */
const verificarContraseña = async (passwordIngresada, passwordEnBD) => {
  try {
    return await bcrypt.compare(passwordIngresada, passwordEnBD);
  } catch (err) {
    throw new Error(`Error al verificar contraseña: ${err.message}`);
  }
};

/**
 * Buscar usuario por ID
 * @param {number} id - ID del usuario
 * @returns {Promise<object|null>} Usuario encontrado o null
 */
const buscarPorId = async (id) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre_usuario, nombre_completo, email, foto_perfil, biografia, fecha_registro FROM usuarios WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Error al buscar usuario por ID: ${err.message}`);
  }
};

module.exports = {
  buscarPorEmail,
  buscarPorNombreUsuario,
  crearUsuario,
  verificarContraseña,
  buscarPorId
};
