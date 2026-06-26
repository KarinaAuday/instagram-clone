// src/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validarPublicacion } = require('../middlewares/validationMiddleware');

// ════════════════════════════════════════════════════════════
// 📸 RUTAS DE PUBLICACIONES
// ════════════════════════════════════════════════════════════

/**
 * GET /api/publicaciones
 * Obtener feed (PÚBLICA - sin protección)
 * Query: ?pagina=1
 */
router.get('/', postController.obtenerFeed);

/**
 * POST /api/publicaciones
 * Crear nueva publicación (PROTEGIDA)
 * Headers: Authorization: Bearer <token>
 * Body: { url_imagen, descripcion? }
 */
router.post('/', authMiddleware, validarPublicacion, postController.crearPublicacion);

/**
 * POST /api/publicaciones/:id/like
 * Dar like a una publicación (PROTEGIDA)
 * Headers: Authorization: Bearer <token>
 */
router.post('/:id/like', authMiddleware, postController.darLike);

/**
 * DELETE /api/publicaciones/:id/like
 * Quitar like de una publicación (PROTEGIDA)
 * Headers: Authorization: Bearer <token>
 */
router.delete('/:id/like', authMiddleware, postController.quitarLike);

/**
 * DELETE /api/publicaciones/:id
 * Eliminar publicación (PROTEGIDA - solo el dueño)
 * Headers: Authorization: Bearer <token>
 */
router.delete('/:id', authMiddleware, postController.eliminarPublicacion);

module.exports = router;
