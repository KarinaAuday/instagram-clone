// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// ════════════════════════════════════════════════════════════
// 👤 RUTAS DE USUARIOS (PROTEGIDAS - Requieren JWT)
// ════════════════════════════════════════════════════════════

/**
 * GET /api/usuarios/perfil
 * Obtener perfil del usuario autenticado
 * Headers: Authorization: Bearer <token>
 */
router.get('/perfil', authMiddleware, userController.obtenerPerfil);

/**
 * PUT /api/usuarios/perfil
 * Actualizar perfil del usuario autenticado
 * Headers: Authorization: Bearer <token>
 * Body: { nombre_completo?, biografia?, foto_perfil? }
 */
router.put('/perfil', authMiddleware, userController.actualizarPerfil);

module.exports = router;
