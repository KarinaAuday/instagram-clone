// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// ════════════════════════════════════════════════════════════
// 🔐 MIDDLEWARE DE AUTENTICACIÓN JWT
// ════════════════════════════════════════════════════════════
const authMiddleware = (req, res, next) => {
  try {
    // 1️⃣ Obtener el token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token requerido',
        mensaje: 'Debes enviar: Authorization: Bearer <token>',
        codigo: 'NO_TOKEN'
      });
    }

    // 2️⃣ Extraer el token (remover "Bearer ")
    const token = authHeader.slice(7);

    // 3️⃣ Verificar la firma del token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Agregar datos del usuario al request
    req.usuario = decoded;
    
    console.log(`✅ Usuario autenticado: ${decoded.id} (${decoded.email})`);
    
    next(); // Pasar al siguiente middleware/handler

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
        codigo: 'TOKEN_EXPIRED'
      });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token inválido',
        codigo: 'INVALID_TOKEN'
      });
    }

    return res.status(500).json({
      error: 'Error en la verificación del token',
      detalles: err.message
    });
  }
};

module.exports = authMiddleware;
