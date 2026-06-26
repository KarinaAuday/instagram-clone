// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validarRegistro, validarLogin } = require('../middlewares/validationMiddleware');

// ════════════════════════════════════════════════════════════
// 🔐 RUTAS DE AUTENTICACIÓN (PÚBLICAS)
// ════════════════════════════════════════════════════════════

/**
 * POST /api/auth/register
 * Registrar nuevo usuario
 * Body: { nombre_usuario, nombre_completo, email, password, confirmPassword }
 */
router.post('/register', validarRegistro, authController.registro);

/**
 * POST /api/auth/login
 * Iniciar sesión
 * Body: { email, password }
 */
router.post('/login', validarLogin, authController.login);

module.exports = router;
