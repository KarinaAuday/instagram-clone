// src/services/postService.js
const pool = require('../config/db');

// ════════════════════════════════════════════════════════════
// 📸 SERVICIO DE PUBLICACIONES - CAPA DE DATOS
// ════════════════════════════════════════════════════════════

/**
 * Obtener todas las publicaciones (feed global)
 * @param {number} limit - Cantidad de posts a retornar
 * @param {number} offset - Para paginación
 * @returns {Promise<array>} Lista de publicaciones con datos del usuario
 */
const obtenerTodasLasPublicaciones = async (limit = 10, offset = 0) => {
  try {
    const result = await pool.query(
      `SELECT p.id, p.usuario_id, p.url_imagen, p.descripcion, 
              p.likes, p.fecha_creacion,
              u.nombre_usuario, u.foto_perfil
       FROM publicaciones p
       JOIN usuarios u ON p.usuario_id = u.id
       ORDER BY p.fecha_creacion DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  } catch (err) {
    throw new Error(`Error al obtener publicaciones: ${err.message}`);
  }
};

/**
 * Obtener publicación por ID
 * @param {number} publicacionId - ID de la publicación
 * @returns {Promise<object|null>} Publicación o null
 */
const obtenerPublicacionPorId = async (publicacionId) => {
  try {
    const result = await pool.query(
      `SELECT p.id, p.usuario_id, p.url_imagen, p.descripcion, 
              p.likes, p.fecha_creacion,
              u.nombre_usuario, u.foto_perfil
       FROM publicaciones p
       JOIN usuarios u ON p.usuario_id = u.id
       WHERE p.id = $1`,
      [publicacionId]
    );
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Error al obtener publicación: ${err.message}`);
  }
};

/**
 * Crear nueva publicación
 * @param {number} usuarioId - ID del usuario que crea
 * @param {object} datos - { url_imagen, descripcion }
 * @returns {Promise<object>} Publicación creada
 */
const crearPublicacion = async (usuarioId, datos) => {
  const { url_imagen, descripcion } = datos;

  try {
    const result = await pool.query(
      `INSERT INTO publicaciones (usuario_id, url_imagen, descripcion)
       VALUES ($1, $2, $3)
       RETURNING id, usuario_id, url_imagen, descripcion, likes, fecha_creacion`,
      [usuarioId, url_imagen, descripcion || null]
    );
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error al crear publicación: ${err.message}`);
  }
};

/**
 * Aumentar likes de una publicación
 * @param {number} publicacionId - ID de la publicación
 * @returns {Promise<object>} Publicación actualizada
 */
const darLike = async (publicacionId) => {
  try {
    const result = await pool.query(
      `UPDATE publicaciones 
       SET likes = likes + 1
       WHERE id = $1
       RETURNING id, likes`,
      [publicacionId]
    );
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error al dar like: ${err.message}`);
  }
};

/**
 * Disminuir likes de una publicación
 * @param {number} publicacionId - ID de la publicación
 * @returns {Promise<object>} Publicación actualizada
 */
const quitarLike = async (publicacionId) => {
  try {
    const result = await pool.query(
      `UPDATE publicaciones 
       SET likes = CASE WHEN likes > 0 THEN likes - 1 ELSE 0 END
       WHERE id = $1
       RETURNING id, likes`,
      [publicacionId]
    );
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error al quitar like: ${err.message}`);
  }
};

/**
 * Eliminar publicación (solo el dueño)
 * @param {number} publicacionId - ID de la publicación
 * @param {number} usuarioId - ID del usuario que la elimina
 * @returns {Promise<boolean>} true si se eliminó, false si no existe
 */
const eliminarPublicacion = async (publicacionId, usuarioId) => {
  try {
    const result = await pool.query(
      `DELETE FROM publicaciones 
       WHERE id = $1 AND usuario_id = $2
       RETURNING id`,
      [publicacionId, usuarioId]
    );
    return result.rows.length > 0;
  } catch (err) {
    throw new Error(`Error al eliminar publicación: ${err.message}`);
  }
};

/**
 * Obtener cantidad total de publicaciones
 * @returns {Promise<number>} Total de publicaciones
 */
const obtenerTotalPublicaciones = async () => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM publicaciones');
    return parseInt(result.rows[0].count);
  } catch (err) {
    throw new Error(`Error al contar publicaciones: ${err.message}`);
  }
};

module.exports = {
  obtenerTodasLasPublicaciones,
  obtenerPublicacionPorId,
  crearPublicacion,
  darLike,
  quitarLike,
  eliminarPublicacion,
  obtenerTotalPublicaciones
};
