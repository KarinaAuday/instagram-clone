# 📸 Instagram Clone - Frontend React

Frontend mínimo en React para conectar con la API de Instagram Clone.

## 🚀 Instalación

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar servidor React
```bash
npm start
```

Abrirá automáticamente `http://localhost:3000`

## 📋 Requisitos

- Node.js v14+
- Backend corriendo en `http://localhost:3000/api`
- Base de datos PostgreSQL activa

## ✨ Características

✅ **Registrarse** - Crear nueva cuenta  
✅ **Login** - Iniciar sesión  
✅ **Feed** - Ver publicaciones de todos  
✅ **Crear publicaciones** - Subir fotos de gatos  
✅ **Dar likes** - Marcar como favorito  
✅ **Mi perfil** - Ver datos personales  
✅ **Editar perfil** - Cambiar nombre, foto, biografía  

## 📁 Estructura

```
src/
├── App.js                    ← Componente principal
├── App.css                   ← Estilos
├── components/
│   ├── Login.js             ← Login
│   ├── Register.js          ← Registro
│   ├── Feed.js              ← Feed de publicaciones
│   └── Profile.js           ← Mi perfil
├── index.js                 ← Entrada
└── index.css                ← Estilos globales
```

## 🔧 Configuración

Por defecto conecta a: `http://localhost:3000/api`

Si tu backend está en otro puerto, edita en `App.js`:
```javascript
const API_URL = 'http://localhost:PUERTO/api';
```

## 📱 Funcionalidades Principales

### 1. Autenticación
- Registro con validación
- Login con email y contraseña
- Token guardado en localStorage
- Logout automático

### 2. Feed
- Ver todas las publicaciones
- Crear nuevas publicaciones
- Dar likes
- Eliminar propias publicaciones

### 3. Perfil
- Ver información personal
- Editar nombre, biografía, foto
- Ver mis publicaciones
- Contador de publicaciones

## 🎨 Estilos

App moderna y responsiva con:
- Navbar sticky
- Cards limpas
- Formularios intuitivos
- Responsive para móvil

## 🐛 Troubleshooting

**Error: "Cannot connect to localhost:3000/api"**
- Verifica que el backend está corriendo
- Verifica que está en puerto 3000

**Error: "CORS error"**
- El backend debe tener CORS habilitado
- Verifica config en backend `app.js`

**Token no se mantiene**
- Verifica que localStorage está habilitado
- Verifica que el token se guarda en login

## 📚 Más Información

Lee el README.md del backend para entender cómo funciona la API.

---

**¡Happy coding! 🎉**
