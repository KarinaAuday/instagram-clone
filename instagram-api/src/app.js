// src/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ════════════════════════════════════════════════════════════
// 🔴 MIDDLEWARES GLOBALES
// ════════════════════════════════════════════════════════════

// 1️⃣ CORS - Permitir requests desde otros dominios
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
console.log('✅ CORS habilitado');

// 2️⃣ Express JSON - Parsear body
app.use(express.json({ limit: '50mb' }));
console.log('✅ express.json() habilitado');

// 3️⃣ Logging de requests
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  const method = req.method.padEnd(6);
  const path = req.path.padEnd(30);
  const hasToken = req.headers.authorization ? '✅ Token' : '❌ Sin token';
  
  console.log(`\n📨 [${timestamp}] ${method} ${path} ${hasToken}`);
  next();
});

// ════════════════════════════════════════════════════════════
// 📍 RUTAS PÚBLICAS (Sin autenticación)
// ════════════════════════════════════════════════════════════

/**
 * GET /
 * Health check - Verificar que el servidor está activo
 */
app.get('/', (req, res) => {
  res.status(200).json({
    mensaje: '✅ API de Instagram Clone funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      autenticacion: [
        'POST /api/auth/register - Registrar usuario',
        'POST /api/auth/login - Iniciar sesión'
      ],
      publicaciones: [
        'GET /api/publicaciones - Obtener feed (sin autenticación)',
        'POST /api/publicaciones - Crear publicación (protegido)',
        'POST /api/publicaciones/:id/like - Dar like (protegido)',
        'DELETE /api/publicaciones/:id/like - Quitar like (protegido)',
        'DELETE /api/publicaciones/:id - Eliminar publicación (protegido)'
      ],
      usuarios: [
        'GET /api/usuarios/perfil - Obtener perfil (protegido)',
        'PUT /api/usuarios/perfil - Actualizar perfil (protegido)'
      ]
    }
  });
});

// ════════════════════════════════════════════════════════════
// 📍 MONTAR ROUTERS
// ════════════════════════════════════════════════════════════

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/publicaciones', postRoutes);

// ════════════════════════════════════════════════════════════
// 🟥 MANEJO DE ERRORES 404 (Ruta no encontrada)
// ════════════════════════════════════════════════════════════
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    ruta: req.method + ' ' + req.path,
    sugerencia: 'GET / para ver todos los endpoints disponibles'
  });
});

// ════════════════════════════════════════════════════════════
// ❌ ERROR HANDLER GLOBAL (4 parámetros = Express lo detecta)
// ════════════════════════════════════════════════════════════
app.use((err, req, res, next) => {
  console.error('❌ Error no manejado:', err.message);
  
  res.status(err.status || 500).json({
    error: 'Error en el servidor',
    mensaje: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ════════════════════════════════════════════════════════════
// 🚀 INICIAR SERVIDOR
// ════════════════════════════════════════════════════════════
app.listen(PORT, () => {
  console.log('\n' + '═'.repeat(60));
  console.log('🚀 Servidor Express iniciado correctamente');
  console.log('═'.repeat(60));
  console.log(`\n📡 URL: http://localhost:${PORT}`);
  console.log(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 JWT Secret configurado: ${process.env.JWT_SECRET ? '✅ Sí' : '❌ No'}`);
  console.log(`📊 Base de datos: ${process.env.DB_NAME} en ${process.env.DB_HOST}\n`);
});

module.exports = app;
