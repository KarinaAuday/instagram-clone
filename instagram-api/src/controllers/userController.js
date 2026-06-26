// src/controllers/userController.js
const userService = require('../services/userService');

// ════════════════════════════════════════════════════════════
// 👤 CONTROLADOR DE USUARIOS
// ════════════════════════════════════════════════════════════

/**
 * GET /api/usuarios/perfil
 * Obtener perfil del usuario autenticado
 */
const obtenerPerfil = async (req, res) => {
  try {
    // req.usuario viene del middleware de autenticación
    const usuarioId = req.usuario.id;

    // 1️⃣ Obtener perfil completo con publicaciones
    const perfil = await userService.obtenerPerfilCompleto(usuarioId);

    if (!perfil) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    console.log(`✅ Perfil obtenido para usuario: ${usuarioId}`);

    // 2️⃣ Responder con el perfil
    return res.status(200).json({
      mensaje: 'Perfil obtenido exitosamente',
      usuario: perfil
    });

  } catch (err) {
    console.error('❌ Error al obtener perfil:', err.message);
    return res.status(500).json({
      error: 'Error al obtener perfil',
      detalles: err.message
    });
  }
};

/**
 * PUT /api/usuarios/perfil
 * Actualizar información del perfil
 */
const actualizarPerfil = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { nombre_completo, biografia, foto_perfil } = req.body;

    // 1️⃣ Validar que al menos un campo se actualice
    if (!nombre_completo && !biografia && !foto_perfil) {
      return res.status(400).json({
        error: 'Al menos un campo es requerido para actualizar'
      });
    }

    // 2️⃣ Actualizar perfil
    const perfilActualizado = await userService.actualizarPerfil(usuarioId, {
      nombre_completo,
      biografia,
      foto_perfil
    });

    if (!perfilActualizado) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    console.log(`✅ Perfil actualizado para usuario: ${usuarioId}`);

    // 3️⃣ Responder con el perfil actualizado
    return res.status(200).json({
      mensaje: 'Perfil actualizado exitosamente',
      usuario: perfilActualizado
    });

  } catch (err) {
    console.error('❌ Error al actualizar perfil:', err.message);
    return res.status(500).json({
      error: 'Error al actualizar perfil',
      detalles: err.message
    });
  }
};

module.exports = {
  obtenerPerfil,
  actualizarPerfil
};
