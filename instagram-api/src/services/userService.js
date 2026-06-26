// src/services/userService.js
const pool = require('../config/db');

// ════════════════════════════════════════════════════════════
// 👤 SERVICIO DE USUARIOS - CAPA DE DATOS
// ════════════════════════════════════════════════════════════

/**
 * Obtener perfil del usuario con sus publicaciones
 * @param {number} usuarioId - ID del usuario
 * @returns {Promise<object>} Datos del usuario + sus publicaciones
 */
const obtenerPerfilCompleto = async (usuarioId) => {
  try {
    // 1️⃣ Obtener datos del usuario
    const usuarioResult = await pool.query(
      `SELECT id, nombre_usuario, nombre_completo, email, foto_perfil, 
              biografia, fecha_registro 
       FROM usuarios WHERE id = $1`,
      [usuarioId]
    );

    if (usuarioResult.rows.length === 0) {
      return null;
    }

    const usuario = usuarioResult.rows[0];

    // 2️⃣ Obtener publicaciones del usuario
    const publicacionesResult = await pool.query(
      `SELECT id, url_imagen, descripcion, likes, fecha_creacion 
       FROM publicaciones 
       WHERE usuario_id = $1 
       ORDER BY fecha_creacion DESC`,
      [usuarioId]
    );

    // 3️⃣ Combinar datos
    return {
      ...usuario,
      totalPublicaciones: publicacionesResult.rows.length,
      publicaciones: publicacionesResult.rows
    };

  } catch (err) {
    throw new Error(`Error al obtener perfil: ${err.message}`);
  }
};

/**
 * Actualizar información del perfil
 * @param {number} usuarioId - ID del usuario
 * @param {object} datos - { nombre_completo, biografia, foto_perfil }
 * @returns {Promise<object>} Usuario actualizado
 */
const actualizarPerfil = async (usuarioId, datos) => {
  const { nombre_completo, biografia, foto_perfil } = datos;

  try {
    // Construir query dinámicamente según qué campos se actualicen
    let query = 'UPDATE usuarios SET ';
    const valores = [];
    let contador = 1;

    if (nombre_completo !== undefined) {
      query += `nombre_completo = $${contador}, `;
      valores.push(nombre_completo);
      contador++;
    }

    if (biografia !== undefined) {
      query += `biografia = $${contador}, `;
      valores.push(biografia);
      contador++;
    }

    if (foto_perfil !== undefined) {
      query += `foto_perfil = $${contador}, `;
      valores.push(foto_perfil);
      contador++;
    }

    // Remover la última coma
    query = query.slice(0, -2);

    query += ` WHERE id = $${contador} RETURNING id, nombre_usuario, nombre_completo, email, foto_perfil, biografia`;
    valores.push(usuarioId);

    const result = await pool.query(query, valores);
    return result.rows[0];

  } catch (err) {
    throw new Error(`Error al actualizar perfil: ${err.message}`);
  }
};

/**
 * Obtener datos básicos del usuario (sin contraseña)
 * @param {number} usuarioId - ID del usuario
 * @returns {Promise<object|null>} Usuario o null
 */
const obtenerDatosPublicos = async (usuarioId) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre_usuario, nombre_completo, foto_perfil, 
              biografia, fecha_registro 
       FROM usuarios WHERE id = $1`,
      [usuarioId]
    );
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Error al obtener datos del usuario: ${err.message}`);
  }
};

module.exports = {
  obtenerPerfilCompleto,
  actualizarPerfil,
  obtenerDatosPublicos
};
