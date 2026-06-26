// src/middlewares/validationMiddleware.js

// ════════════════════════════════════════════════════════════
// ✅ VALIDADORES DE DATOS
// ════════════════════════════════════════════════════════════

const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validarContraseña = (password) => {
  // Mínimo 6 caracteres
  return password && password.length >= 6;
};

const validarNombreUsuario = (nombreUsuario) => {
  // Solo letras, números y guiones bajos, 3-20 caracteres
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(nombreUsuario);
};

// ════════════════════════════════════════════════════════════
// 🔍 MIDDLEWARE DE VALIDACIÓN PARA REGISTRO
// ════════════════════════════════════════════════════════════
const validarRegistro = (req, res, next) => {
  const { nombre_usuario, nombre_completo, email, password, confirmPassword } = req.body;

  // 1️⃣ Verificar que todos los campos requeridos estén presentes
  if (!nombre_usuario || !nombre_completo || !email || !password) {
    return res.status(400).json({
      error: 'Campos requeridos faltantes',
      campos: ['nombre_usuario', 'nombre_completo', 'email', 'password']
    });
  }

  // 2️⃣ Validar formato de nombre de usuario
  if (!validarNombreUsuario(nombre_usuario)) {
    return res.status(400).json({
      error: 'Nombre de usuario inválido',
      requisitos: 'Solo letras, números y guiones bajos (3-20 caracteres)'
    });
  }

  // 3️⃣ Validar que nombre completo no esté vacío
  if (nombre_completo.trim().length === 0) {
    return res.status(400).json({
      error: 'Nombre completo no puede estar vacío'
    });
  }

  // 4️⃣ Validar formato de email
  if (!validarEmail(email)) {
    return res.status(400).json({
      error: 'Email inválido',
      ejemplo: 'usuario@ejemplo.com'
    });
  }

  // 5️⃣ Validar contraseña
  if (!validarContraseña(password)) {
    return res.status(400).json({
      error: 'Contraseña inválida',
      requisitos: 'Mínimo 6 caracteres'
    });
  }

  // 6️⃣ Validar que las contraseñas coincidan
  if (password !== confirmPassword) {
    return res.status(400).json({
      error: 'Las contraseñas no coinciden'
    });
  }

  next();
};

// ════════════════════════════════════════════════════════════
// 🔍 MIDDLEWARE DE VALIDACIÓN PARA LOGIN
// ════════════════════════════════════════════════════════════
const validarLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Email y contraseña requeridos'
    });
  }

  if (!validarEmail(email)) {
    return res.status(400).json({
      error: 'Email inválido'
    });
  }

  next();
};

// ════════════════════════════════════════════════════════════
// 🔍 MIDDLEWARE DE VALIDACIÓN PARA CREACIÓN DE POST
// ════════════════════════════════════════════════════════════
const validarPublicacion = (req, res, next) => {
  const { url_imagen, descripcion } = req.body;

  if (!url_imagen || url_imagen.trim().length === 0) {
    return res.status(400).json({
      error: 'URL de imagen requerida'
    });
  }

  // Validar que sea una URL válida
  try {
    new URL(url_imagen);
  } catch {
    return res.status(400).json({
      error: 'URL de imagen inválida'
    });
  }

  if (descripcion && descripcion.length > 500) {
    return res.status(400).json({
      error: 'Descripción muy larga (máximo 500 caracteres)'
    });
  }

  next();
};

module.exports = {
  validarRegistro,
  validarLogin,
  validarPublicacion
};
