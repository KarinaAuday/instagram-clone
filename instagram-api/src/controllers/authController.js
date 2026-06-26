// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const authService = require('../services/authService');
require('dotenv').config();

// ════════════════════════════════════════════════════════════
// 🔐 CONTROLADOR DE AUTENTICACIÓN
// ════════════════════════════════════════════════════════════

/**
 * POST /api/auth/register
 * Registrar nuevo usuario
 */
const registro = async (req, res) => {
  try {
    const { nombre_usuario, nombre_completo, email, password } = req.body;

    // 1️⃣ Verificar si el email ya existe
    const usuarioExistente = await authService.buscarPorEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({
        error: 'Email ya registrado',
        codigo: 'EMAIL_EXISTE'
      });
    }

    // 2️⃣ Verificar si el nombre de usuario ya existe
    const nombreUsuarioExistente = await authService.buscarPorNombreUsuario(nombre_usuario);
    if (nombreUsuarioExistente) {
      return res.status(400).json({
        error: 'Nombre de usuario ya existe',
        codigo: 'USUARIO_EXISTE'
      });
    }

    // 3️⃣ Crear el usuario
    const nuevoUsuario = await authService.crearUsuario({
      nombre_usuario,
      nombre_completo,
      email,
      password
    });

    // 4️⃣ Generar JWT
    const token = jwt.sign(
      { 
        id: nuevoUsuario.id, 
        email: nuevoUsuario.email,
        nombre_usuario: nuevoUsuario.nombre_usuario
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token válido por 7 días
    );

    console.log(`✅ Usuario registrado: ${nuevoUsuario.nombre_usuario}`);

    // 5️⃣ Responder con éxito
    return res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario.id,
        nombre_usuario: nuevoUsuario.nombre_usuario,
        nombre_completo: nuevoUsuario.nombre_completo,
        email: nuevoUsuario.email,
        fecha_registro: nuevoUsuario.fecha_registro
      },
      token
    });

  } catch (err) {
    console.error('❌ Error en registro:', err.message);
    return res.status(500).json({
      error: 'Error al registrar usuario',
      detalles: err.message
    });
  }
};

/**
 * POST /api/auth/login
 * Validar credenciales y generar JWT
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Buscar usuario por email
    const usuario = await authService.buscarPorEmail(email);
    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        codigo: 'USUARIO_NO_ENCONTRADO'
      });
    }

    // 2️⃣ Verificar contraseña
    const passwordValida = await authService.verificarContraseña(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        codigo: 'PASSWORD_INCORRECTA'
      });
    }

    // 3️⃣ Generar JWT
    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email,
        nombre_usuario: usuario.nombre_usuario
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`✅ Login exitoso: ${usuario.nombre_usuario}`);

    // 4️⃣ Responder con éxito
    return res.status(200).json({
      mensaje: 'Login exitoso',
      usuario: {
        id: usuario.id,
        nombre_usuario: usuario.nombre_usuario,
        nombre_completo: usuario.nombre_completo,
        email: usuario.email,
        foto_perfil: usuario.foto_perfil
      },
      token
    });

  } catch (err) {
    console.error('❌ Error en login:', err.message);
    return res.status(500).json({
      error: 'Error al iniciar sesión',
      detalles: err.message
    });
  }
};

module.exports = {
  registro,
  login
};
