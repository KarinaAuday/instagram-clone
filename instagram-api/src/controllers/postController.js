// src/controllers/postController.js
const postService = require('../services/postService');

// ════════════════════════════════════════════════════════════
// 📸 CONTROLADOR DE PUBLICACIONES
// ════════════════════════════════════════════════════════════

/**
 * GET /api/publicaciones
 * Obtener todas las publicaciones (feed)
 */
const obtenerFeed = async (req, res) => {
  try {
    // 1️⃣ Obtener parámetros de paginación
    const pagina = parseInt(req.query.pagina) || 1;
    const limit = 10;
    const offset = (pagina - 1) * limit;

    // 2️⃣ Obtener publicaciones
    const publicaciones = await postService.obtenerTodasLasPublicaciones(limit, offset);
    const total = await postService.obtenerTotalPublicaciones();

    console.log(`✅ Feed obtenido: ${publicaciones.length} publicaciones`);

    // 3️⃣ Responder con el feed
    return res.status(200).json({
      mensaje: 'Feed obtenido exitosamente',
      paginacion: {
        total,
        pagina,
        limit,
        totalPaginas: Math.ceil(total / limit)
      },
      publicaciones
    });

  } catch (err) {
    console.error('❌ Error al obtener feed:', err.message);
    return res.status(500).json({
      error: 'Error al obtener feed',
      detalles: err.message
    });
  }
};

/**
 * POST /api/publicaciones
 * Crear nueva publicación
 */
const crearPublicacion = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { url_imagen, descripcion } = req.body;

    // 1️⃣ Crear publicación
    const publicacion = await postService.crearPublicacion(usuarioId, {
      url_imagen,
      descripcion
    });

    console.log(`✅ Publicación creada para usuario: ${usuarioId}`);

    // 2️⃣ Responder
    return res.status(201).json({
      mensaje: 'Publicación creada exitosamente',
      publicacion: {
        ...publicacion,
        usuario_id: usuarioId
      }
    });

  } catch (err) {
    console.error('❌ Error al crear publicación:', err.message);
    return res.status(500).json({
      error: 'Error al crear publicación',
      detalles: err.message
    });
  }
};

/**
 * POST /api/publicaciones/:id/like
 * Dar like a una publicación
 */
const darLike = async (req, res) => {
  try {
    const publicacionId = req.params.id;

    // 1️⃣ Verificar que la publicación existe
    const publicacion = await postService.obtenerPublicacionPorId(publicacionId);
    if (!publicacion) {
      return res.status(404).json({
        error: 'Publicación no encontrada'
      });
    }

    // 2️⃣ Dar like
    const publicacionActualizada = await postService.darLike(publicacionId);

    console.log(`✅ Like dado a publicación ${publicacionId}`);

    return res.status(200).json({
      mensaje: 'Like agregado',
      publicacion: publicacionActualizada
    });

  } catch (err) {
    console.error('❌ Error al dar like:', err.message);
    return res.status(500).json({
      error: 'Error al dar like',
      detalles: err.message
    });
  }
};

/**
 * DELETE /api/publicaciones/:id/like
 * Quitar like de una publicación
 */
const quitarLike = async (req, res) => {
  try {
    const publicacionId = req.params.id;

    // 1️⃣ Verificar que la publicación existe
    const publicacion = await postService.obtenerPublicacionPorId(publicacionId);
    if (!publicacion) {
      return res.status(404).json({
        error: 'Publicación no encontrada'
      });
    }

    // 2️⃣ Quitar like
    const publicacionActualizada = await postService.quitarLike(publicacionId);

    console.log(`✅ Like removido de publicación ${publicacionId}`);

    return res.status(200).json({
      mensaje: 'Like removido',
      publicacion: publicacionActualizada
    });

  } catch (err) {
    console.error('❌ Error al quitar like:', err.message);
    return res.status(500).json({
      error: 'Error al quitar like',
      detalles: err.message
    });
  }
};

/**
 * DELETE /api/publicaciones/:id
 * Eliminar publicación (solo el dueño)
 */
const eliminarPublicacion = async (req, res) => {
  try {
    const publicacionId = req.params.id;
    const usuarioId = req.usuario.id;

    // 1️⃣ Verificar que la publicación existe
    const publicacion = await postService.obtenerPublicacionPorId(publicacionId);
    if (!publicacion) {
      return res.status(404).json({
        error: 'Publicación no encontrada'
      });
    }

    // 2️⃣ Verificar que es el dueño
    if (publicacion.usuario_id !== usuarioId) {
      return res.status(403).json({
        error: 'No tienes permiso para eliminar esta publicación'
      });
    }

    // 3️⃣ Eliminar
    await postService.eliminarPublicacion(publicacionId, usuarioId);

    console.log(`✅ Publicación ${publicacionId} eliminada por usuario ${usuarioId}`);

    return res.status(200).json({
      mensaje: 'Publicación eliminada exitosamente'
    });

  } catch (err) {
    console.error('❌ Error al eliminar publicación:', err.message);
    return res.status(500).json({
      error: 'Error al eliminar publicación',
      detalles: err.message
    });
  }
};

module.exports = {
  obtenerFeed,
  crearPublicacion,
  darLike,
  quitarLike,
  eliminarPublicacion
};
