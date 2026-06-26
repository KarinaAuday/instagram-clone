# 📸 Instagram Clone - API REST Backend

API REST completa desarrollada con **Node.js**, **Express** y **PostgreSQL** para un clon de Instagram.

---

## 📋 Tabla de Contenidos

1. [Arquitectura](#arquitectura)
2. [Requisitos](#requisitos)
3. [Instalación](#instalación)
4. [Configuración](#configuración)
5. [Estructura de Base de Datos](#estructura-de-base-de-datos)
6. [Endpoints](#endpoints)
7. [Autenticación JWT](#autenticación-jwt)
8. [Ejemplos de Uso](#ejemplos-de-uso)
9. [Checklist de Entrega](#checklist-de-entrega)

---

## 🏗️ Arquitectura

El proyecto sigue una **arquitectura por capas** (Layered Architecture) que garantiza mantenibilidad, escalabilidad y separación de responsabilidades:

```
API REST - Instagram Clone
├── 🌐 HTTP Requests/Responses
│
└── Express App (src/app.js)
    ├── 🔴 Global Middlewares (CORS, JSON parsing, logging)
    │
    ├── 📍 Routes Layer (src/routes/)
    │   ├── authRoutes.js
    │   ├── userRoutes.js
    │   └── postRoutes.js
    │
    ├── 🔐 Middlewares Layer (src/middlewares/)
    │   ├── authMiddleware.js (JWT validation)
    │   └── validationMiddleware.js (data validation)
    │
    ├── 🧠 Controllers Layer (src/controllers/)
    │   ├── authController.js (login/register logic)
    │   ├── userController.js (profile logic)
    │   └── postController.js (posts logic)
    │
    └── 💾 Services Layer (src/services/)
        ├── authService.js (SQL queries for auth)
        ├── userService.js (SQL queries for users)
        └── postService.js (SQL queries for posts)
        │
        └── 🗄️ Database Layer (PostgreSQL)
            ├── Pool conexión (src/config/db.js)
            └── Tablas (usuarios, publicaciones)
```

### Responsabilidades por Capa:

| Capa | Archivo | Responsabilidad |
|------|---------|-----------------|
| **Routes** | `authRoutes.js`, `userRoutes.js`, etc | Definir endpoints (GET, POST, etc) y mapear a controladores |
| **Middlewares** | `authMiddleware.js`, `validationMiddleware.js` | Validar JWT, verificar datos antes de controller |
| **Controllers** | `authController.js`, etc | Orquestar la lógica, llamar servicios, manejar respuestas HTTP |
| **Services** | `authService.js`, etc | Ejecutar **SOLO** queries SQL, NO conocen req/res |
| **Config** | `db.js` | Conexión al pool de PostgreSQL |

---

## 📦 Requisitos

- **Node.js** v14+ 
- **PostgreSQL** v12+
- **npm** o **yarn**

---

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd instagram-api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Crear archivo .env

```bash
cp .env.example .env
```

### 4. Configurar variables de entorno

Editar `.env` con tus credenciales de PostgreSQL:

```env
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=5432
DB_NAME=instagram_clone

JWT_SECRET=tu_secreto_muy_largo_y_seguro_aqui

PORT=3000
NODE_ENV=development
```

### 5. Crear base de datos PostgreSQL

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE instagram_clone;
```

### 6. Iniciar servidor

```bash
npm start
# O con nodemon (modo desarrollo)
npm run dev
```

**Salida esperada:**
```
════════════════════════════════════════════════════════════
🚀 Servidor Express iniciado correctamente
════════════════════════════════════════════════════════════

📡 URL: http://localhost:3000
✅ Tablas usuarios y publicaciones creadas automáticamente
```

---

## 🗄️ Estructura de Base de Datos

### Tabla: `usuarios`

Almacena la información de las cuentas registradas.

```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre_usuario VARCHAR(50) UNIQUE NOT NULL,        -- Username único
  nombre_completo VARCHAR(100) NOT NULL,             -- Nombre y apellido
  email VARCHAR(100) UNIQUE NOT NULL,                -- Email único
  password VARCHAR(255) NOT NULL,                    -- Hash bcrypt
  foto_perfil VARCHAR(255) DEFAULT '...',            -- URL de foto
  biografia TEXT,                                    -- Descripción personal
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Cuándo se registró
);
```

**Índices:**
- `id` (PRIMARY KEY)
- `email` (UNIQUE)
- `nombre_usuario` (UNIQUE)

---

### Tabla: `publicaciones`

Almacena las fotos y posts de gatos de los usuarios (Relación One-to-Many con usuarios).

```sql
CREATE TABLE publicaciones (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  url_imagen VARCHAR(255) NOT NULL,                  -- URL de la foto
  descripcion TEXT,                                  -- Texto del post
  likes INT DEFAULT 0,                               -- Contador de likes
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Cuándo se publicó
);

-- Índice para optimizar búsquedas por usuario
CREATE INDEX idx_publicaciones_usuario_id ON publicaciones(usuario_id);
```

**Relaciones:**
- `usuario_id` → Referencia a `usuarios(id)` con `ON DELETE CASCADE` (si se borra usuario, se borran sus posts)

---

## 🔌 Endpoints

### Leyenda

- 🟦 **Público** - Sin autenticación requerida
- 🟩 **Protegido** - Requiere JWT válido en header `Authorization: Bearer <token>`

---

### **AUTENTICACIÓN** (`/api/auth`)

#### 🟦 POST `/api/auth/register`

**Registrar nuevo usuario**

**Request:**
```json
{
  "nombre_usuario": "gato_programador",
  "nombre_completo": "Juan Gatoz",
  "email": "juan@example.com",
  "password": "miContraseña123",
  "confirmPassword": "miContraseña123"
}
```

**Response (201):**
```json
{
  "mensaje": "Usuario registrado exitosamente",
  "usuario": {
    "id": 1,
    "nombre_usuario": "gato_programador",
    "nombre_completo": "Juan Gatoz",
    "email": "juan@example.com",
    "fecha_registro": "2024-01-15T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores:**
- `400` - Email o usuario duplicado
- `400` - Campos requeridos faltantes
- `500` - Error en servidor

---

#### 🟦 POST `/api/auth/login`

**Iniciar sesión y obtener JWT**

**Request:**
```json
{
  "email": "juan@example.com",
  "password": "miContraseña123"
}
```

**Response (200):**
```json
{
  "mensaje": "Login exitoso",
  "usuario": {
    "id": 1,
    "nombre_usuario": "gato_programador",
    "nombre_completo": "Juan Gatoz",
    "email": "juan@example.com",
    "foto_perfil": "https://..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores:**
- `401` - Credenciales inválidas
- `400` - Email/password requeridos
- `500` - Error en servidor

---

### **USUARIOS** (`/api/usuarios`)

#### 🟩 GET `/api/usuarios/perfil`

**Obtener perfil del usuario autenticado**

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "mensaje": "Perfil obtenido exitosamente",
  "usuario": {
    "id": 1,
    "nombre_usuario": "gato_programador",
    "nombre_completo": "Juan Gatoz",
    "email": "juan@example.com",
    "foto_perfil": "https://...",
    "biografia": "Programador y amante de gatos 🐱",
    "fecha_registro": "2024-01-15T10:30:00.000Z",
    "totalPublicaciones": 5,
    "publicaciones": [
      {
        "id": 1,
        "url_imagen": "https://...",
        "descripcion": "Mi gato durmiendo",
        "likes": 42,
        "fecha_creacion": "2024-01-16T15:45:00.000Z"
      }
    ]
  }
}
```

**Errores:**
- `401` - Token faltante o inválido
- `404` - Usuario no encontrado
- `500` - Error en servidor

---

#### 🟩 PUT `/api/usuarios/perfil`

**Actualizar información del perfil**

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "nombre_completo": "Juan Gatoz Actualizado",
  "biografia": "Programador fullstack y gatomania total 🐱❤️",
  "foto_perfil": "https://example.com/foto.jpg"
}
```

**Response (200):**
```json
{
  "mensaje": "Perfil actualizado exitosamente",
  "usuario": {
    "id": 1,
    "nombre_usuario": "gato_programador",
    "nombre_completo": "Juan Gatoz Actualizado",
    "email": "juan@example.com",
    "foto_perfil": "https://example.com/foto.jpg",
    "biografia": "Programador fullstack y gatomania total 🐱❤️"
  }
}
```

**Errores:**
- `401` - Token inválido
- `400` - Al menos un campo requerido
- `500` - Error en servidor

---

### **PUBLICACIONES** (`/api/publicaciones`)

#### 🟦 GET `/api/publicaciones`

**Obtener feed (todas las publicaciones)**

**Query Parameters:**
- `pagina` (opcional) - Número de página (default: 1)

**Request:**
```
GET /api/publicaciones?pagina=1
```

**Response (200):**
```json
{
  "mensaje": "Feed obtenido exitosamente",
  "paginacion": {
    "total": 25,
    "pagina": 1,
    "limit": 10,
    "totalPaginas": 3
  },
  "publicaciones": [
    {
      "id": 1,
      "usuario_id": 1,
      "url_imagen": "https://...",
      "descripcion": "Gato en la ventana",
      "likes": 42,
      "fecha_creacion": "2024-01-16T15:45:00.000Z",
      "nombre_usuario": "gato_programador",
      "foto_perfil": "https://..."
    }
  ]
}
```

---

#### 🟩 POST `/api/publicaciones`

**Crear nueva publicación**

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "url_imagen": "https://thiscatdoesnotexist.com/image.jpg",
  "descripcion": "Mi gato haciendo cosas de gato 😸"
}
```

**Response (201):**
```json
{
  "mensaje": "Publicación creada exitosamente",
  "publicacion": {
    "id": 26,
    "usuario_id": 1,
    "url_imagen": "https://thiscatdoesnotexist.com/image.jpg",
    "descripcion": "Mi gato haciendo cosas de gato 😸",
    "likes": 0,
    "fecha_creacion": "2024-01-17T10:00:00.000Z"
  }
}
```

**Errores:**
- `401` - Token inválido
- `400` - URL de imagen requerida
- `500` - Error en servidor

---

#### 🟩 POST `/api/publicaciones/:id/like`

**Dar like a una publicación**

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "mensaje": "Like agregado",
  "publicacion": {
    "id": 1,
    "likes": 43
  }
}
```

---

#### 🟩 DELETE `/api/publicaciones/:id/like`

**Quitar like de una publicación**

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "mensaje": "Like removido",
  "publicacion": {
    "id": 1,
    "likes": 42
  }
}
```

---

#### 🟩 DELETE `/api/publicaciones/:id`

**Eliminar publicación (solo el dueño)**

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "mensaje": "Publicación eliminada exitosamente"
}
```

**Errores:**
- `401` - Token inválido
- `403` - No tienes permiso (no eres el dueño)
- `404` - Publicación no encontrada
- `500` - Error en servidor

---

## 🔐 Autenticación JWT

### ¿Cómo funciona?

1. **Login exitoso** → Backend genera JWT firmado con `JWT_SECRET`
2. **Token enviado** → Cliente lo guarda en localStorage/sessionStorage
3. **Request protegida** → Cliente envía token en header `Authorization: Bearer <token>`
4. **Middleware valida** → Verifica firma y extrae datos del usuario
5. **Si válido** → `req.usuario` contiene los datos decodificados
6. **Si inválido/expirado** → Responde 401 Unauthorized

### Estructura del Token

```javascript
// Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload (datos codificados)
{
  "id": 1,
  "email": "juan@example.com",
  "nombre_usuario": "gato_programador",
  "iat": 1705309200,  // Fecha de emisión
  "exp": 1705395600   // Fecha de expiración (7 días)
}

// Signature
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  tu_secreto_super_seguro
)
```

### Datos Protegidos en el Payload

✅ **Guardados en JWT:**
- `id` - ID del usuario
- `email` - Email del usuario
- `nombre_usuario` - Username
- `iat` (Issued At) - Timestamp de emisión
- `exp` (Expiration) - Timestamp de expiración

❌ **NO guardar en JWT:**
- Contraseña
- Datos sensibles
- Información médica
- Tokens de acceso a otros servicios

---

## 💡 Ejemplos de Uso

### Usando cURL

```bash
# 1️⃣ REGISTRO
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_usuario": "gato_coder",
    "nombre_completo": "Gato Programador",
    "email": "gato@example.com",
    "password": "Password123",
    "confirmPassword": "Password123"
  }'

# 2️⃣ LOGIN (obtener token)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gato@example.com",
    "password": "Password123"
  }'

# Respuesta contiene "token": "eyJhbGciOiJIUzI1NiIs..."

# 3️⃣ OBTENER PERFIL (protegido)
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  http://localhost:3000/api/usuarios/perfil

# 4️⃣ CREAR PUBLICACIÓN (protegido)
curl -X POST http://localhost:3000/api/publicaciones \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "url_imagen": "https://thiscatdoesnotexist.com/image.jpg",
    "descripcion": "Gato durmiendo"
  }'

# 5️⃣ OBTENER FEED (público)
curl http://localhost:3000/api/publicaciones?pagina=1
```

### Usando JavaScript/Fetch API

```javascript
// 1️⃣ Registrarse
async function registrarse() {
  const res = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre_usuario: 'gato_coder',
      nombre_completo: 'Gato Programador',
      email: 'gato@example.com',
      password: 'Password123',
      confirmPassword: 'Password123'
    })
  });
  
  const data = await res.json();
  localStorage.setItem('token', data.token); // Guardar token
  return data.usuario;
}

// 2️⃣ Obtener perfil (protegido)
async function obtenerPerfil() {
  const token = localStorage.getItem('token');
  
  const res = await fetch('http://localhost:3000/api/usuarios/perfil', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await res.json();
}

// 3️⃣ Crear publicación
async function crearPublicacion(url_imagen, descripcion) {
  const token = localStorage.getItem('token');
  
  const res = await fetch('http://localhost:3000/api/publicaciones', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      url_imagen,
      descripcion
    })
  });
  
  return await res.json();
}

// 4️⃣ Obtener feed (público)
async function obtenerFeed(pagina = 1) {
  const res = await fetch(`http://localhost:3000/api/publicaciones?pagina=${pagina}`);
  return await res.json();
}
```

---

## ✅ Checklist de Entrega

- [x] Servidor web corriendo con Node.js y Express sin errores
- [x] Base de datos PostgreSQL activa con tablas creadas
- [x] Arquitectura separada en carpetas independientes:
  - [x] `/routes` - Definición de endpoints
  - [x] `/middlewares` - Validación y autenticación
  - [x] `/controllers` - Lógica de negocio
  - [x] `/services` - Consultas SQL
  - [x] `/config` - Configuración BD
- [x] Emisión de JWT válidos tras login exitoso
- [x] Middleware de autenticación validando tokens JWT
- [x] Endpoints de perfil retornando datos dinámicos según token
- [x] Contraseñas encriptadas con bcrypt
- [x] Variables de entorno configuradas (.env)
- [x] README técnico con documentación completa

---

## 📚 Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Node.js | 14+ | Runtime JavaScript |
| Express | 4.18+ | Framework web |
| PostgreSQL | 12+ | Base de datos relacional |
| JWT | - | Autenticación sin estado |
| bcrypt | 5.1+ | Hash de contraseñas |
| CORS | 2.8+ | Acceso entre dominios |
| dotenv | 16+ | Variables de entorno |
| pg | 8.8+ | Cliente PostgreSQL |

---

## 🐛 Troubleshooting

### Error: `Cannot connect to PostgreSQL`
- Verificar que PostgreSQL está corriendo
- Revisar credenciales en `.env`
- Confirmar que la BD `instagram_clone` existe

### Error: `EADDRINUSE: Address already in use`
- Puerto 3000 ya está en uso
- Cambiar `PORT` en `.env` o matar proceso en ese puerto

### Error: `JWT malformed`
- Token incompleto o corrupto
- Verificar que se envía `Authorization: Bearer <token>`

---

## 📧 Contacto y Soporte

Para preguntas o reportar bugs, contactar al equipo de desarrollo.

**Última actualización:** Enero 2024
