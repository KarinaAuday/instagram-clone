# Instagram Clone

Una aplicación web completa de tipo red social (clon de Instagram) desarrollada con **Node.js + Express** en el backend, **React** en el frontend y **PostgreSQL** como base de datos.

**Tabla de Contenidos:**
- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Arquitectura](#-arquitectura)
- [Seguridad](#-seguridad)
- [Autor](#-autor)

---

##  Características

### ✅ Autenticación
- Registro de usuarios con validación
- Login con email y contraseña
- Autenticación con JWT (JSON Web Tokens)
- Contraseñas encriptadas con bcryptjs
- Tokens con duración de 7 días

### ✅ Publicaciones
- Crear publicaciones con URL de imagen y descripción
- Ver feed global con todas las publicaciones
- Dar likes a publicaciones
- Eliminar propias publicaciones
- Paginación en el feed

### ✅ Perfil de Usuario
- Ver perfil personal con datos
- Editar información del perfil (nombre, biografía, foto)
- Ver todas las publicaciones del usuario
- Contador de publicaciones

### ✅ Frontend
- Interfaz moderna y responsiva
- Navegación intuitiva
- Autenticación persistente (localStorage)
- Actualización en tiempo real

---

##  Stack Tecnológico

### Backend
```
Node.js 24.x          - Runtime JavaScript
Express 4.18.x        - Framework web
PostgreSQL 16         - Base de datos relacional
JWT 9.0.x             - Autenticación segura
bcryptjs 2.4.x        - Encriptación de contraseñas
CORS 2.8.x            - Cross-Origin Resource Sharing
```

### Frontend
```
React 18.2.x          - Librería UI
JavaScript ES6+       - Lenguaje
CSS3                  - Estilos
Fetch API             - Llamadas HTTP
localStorage          - Persistencia de datos
```

### Herramientas
```
Git                   - Control de versiones
pgAdmin 4             - Administrador PostgreSQL
Postman               - Prueba de APIs
VS Code               - Editor de código
```

---

## 📁 Estructura del Proyecto

```
instagram-clone/
│
├── 📁 instagram-api/                 Backend (Node.js + Express)
│   ├── src/
│   │   ├── 📁 config/
│   │   │   └── db.js                 Conexión PostgreSQL
│   │   │
│   │   ├── 📁 middlewares/
│   │   │   ├── authMiddleware.js     Validación JWT
│   │   │   └── validationMiddleware.js Validación de datos
│   │   │
│   │   ├── 📁 routes/
│   │   │   ├── authRoutes.js         Rutas /api/auth
│   │   │   ├── userRoutes.js         Rutas /api/usuarios
│   │   │   └── postRoutes.js         Rutas /api/publicaciones
│   │   │
│   │   ├── 📁 controllers/
│   │   │   ├── authController.js     Lógica autenticación
│   │   │   ├── userController.js     Lógica usuarios
│   │   │   └── postController.js     Lógica publicaciones
│   │   │
│   │   ├── 📁 services/
│   │   │   ├── authService.js        Queries BD autenticación
│   │   │   ├── userService.js        Queries BD usuarios
│   │   │   └── postService.js        Queries BD publicaciones
│   │   │
│   │   └── app.js                    Entrada principal Express
│   │
│   ├── package.json
│   ├── .env.example
│   ├── README.md
│   └── SETUP.md
│
├── 📁 instagram-frontend/            Frontend (React)
│   ├── public/
│   │   └── index.html                HTML principal
│   │
│   ├── src/
│   │   ├── 📁 components/
│   │   │   ├── Login.js              Pantalla login
│   │   │   ├── Register.js           Pantalla registro
│   │   │   ├── Feed.js               Pantalla feed
│   │   │   └── Profile.js            Pantalla perfil
│   │   │
│   │   ├── App.js                    Componente raíz
│   │   ├── App.css                   Estilos principales
│   │   ├── index.js                  Entrada React
│   │   └── index.css                 Estilos globales
│   │
│   ├── package.json
│   ├── README.md
│   └── GUIA_RAPIDA.md
│
├── .gitignore                        Archivos a ignorar en Git
└── README.md                         Este archivo

```

---

## 🛠️ Instalación

### Requisitos Previos
- Node.js v14 o superior
- PostgreSQL v12 o superior
- npm (incluido con Node.js)
- Git

### Backend

```bash
# 1. Navegar a la carpeta backend
cd instagram-api

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales PostgreSQL

# 4. Crear base de datos
psql -U postgres
CREATE DATABASE instagram_clone;
\q

# 5. Iniciar servidor
npm start
# Servidor en: http://localhost:3000
```

### Frontend

```bash
# 1. Navegar a la carpeta frontend (en otra terminal)
cd instagram-frontend

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor React
npm start
# Página en: http://localhost:3000 (o 3001 si 3000 está ocupado)
```

---

## Uso

### 1. Registrarse
1. Abre http://localhost:3000
2. Haz clic en "✍️ Registrarse"
3. Llena el formulario:
   - Nombre de usuario
   - Nombre completo
   - Email
   - Contraseña
4. Haz clic en "✅ Registrarse"

### 2. Iniciar Sesión
1. Ingresa email y contraseña
2. Haz clic en "🔐 Ingresar"

### 3. Crear Publicación
1. En el Feed, ingresa URL de imagen
2. Agrega descripción (opcional)
3. Haz clic en "📤 Publicar"

### 4. Dar Like
1. Haz clic en "❤️ 0" en cualquier publicación
2. El contador sube automáticamente

### 5. Ver/Editar Perfil
1. Haz clic en "👤 Mi Perfil"
2. Haz clic en "✏️ Editar Perfil"
3. Modifica datos y guarda

### 6. Cerrar Sesión
1. Haz clic en "🚪 Logout"

---

##  API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Autenticación

#### Registrar Usuario
```
POST /auth/register

Body:
{
  "nombre_usuario": "gato_programador",
  "nombre_completo": "Juan Gatoz",
  "email": "juan@example.com",
  "password": "Password123",
  "confirmPassword": "Password123"
}

Response (201):
{
  "mensaje": "Usuario registrado exitosamente",
  "usuario": { ... },
  "token": "eyJhbGc..."
}
```

#### Iniciar Sesión
```
POST /auth/login

Body:
{
  "email": "juan@example.com",
  "password": "Password123"
}

Response (200):
{
  "mensaje": "Login exitoso",
  "usuario": { ... },
  "token": "eyJhbGc..."
}
```

### Publicaciones

#### Obtener Feed
```
GET /publicaciones?pagina=1

Response (200):
{
  "paginacion": { ... },
  "publicaciones": [...]
}
```

#### Crear Publicación
```
POST /publicaciones
Authorization: Bearer TOKEN

Body:
{
  "url_imagen": "https://...",
  "descripcion": "Mi gato"
}

Response (201):
{
  "mensaje": "Publicación creada exitosamente",
  "publicacion": { ... }
}
```

#### Dar Like
```
POST /publicaciones/:id/like
Authorization: Bearer TOKEN

Response (200):
{
  "mensaje": "Like agregado",
  "publicacion": { "id": 1, "likes": 1 }
}
```

#### Quitar Like
```
DELETE /publicaciones/:id/like
Authorization: Bearer TOKEN

Response (200):
{
  "mensaje": "Like removido",
  "publicacion": { "id": 1, "likes": 0 }
}
```

#### Eliminar Publicación
```
DELETE /publicaciones/:id
Authorization: Bearer TOKEN

Response (200):
{
  "mensaje": "Publicación eliminada exitosamente"
}
```

### Usuarios

#### Obtener Perfil
```
GET /usuarios/perfil
Authorization: Bearer TOKEN

Response (200):
{
  "mensaje": "Perfil obtenido exitosamente",
  "usuario": { ... }
}
```

#### Actualizar Perfil
```
PUT /usuarios/perfil
Authorization: Bearer TOKEN

Body:
{
  "nombre_completo": "Juan Gatoz Updated",
  "biografia": "Programador fullstack",
  "foto_perfil": "https://..."
}

Response (200):
{
  "mensaje": "Perfil actualizado exitosamente",
  "usuario": { ... }
}
```

---

## 🏗️ Arquitectura

### Patrón: Arquitectura por Capas

```
                    Cliente (React)
                          ↓
                    ┌─────────────┐
                    │   Routes    │ ← Define endpoints
                    └──────┬──────┘
                           ↓
                    ┌─────────────┐
                    │ Middlewares │ ← Valida JWT y datos
                    └──────┬──────┘
                           ↓
                    ┌─────────────┐
                    │ Controllers │ ← Lógica de negocio
                    └──────┬──────┘
                           ↓
                    ┌─────────────┐
                    │  Services   │ ← Queries SQL
                    └──────┬──────┘
                           ↓
                    ┌─────────────┐
                    │ PostgreSQL  │ ← Base de datos
                    └─────────────┘
```

### Base de Datos

#### Tabla: usuarios
```sql
id                SERIAL PRIMARY KEY
nombre_usuario    VARCHAR(50) UNIQUE NOT NULL
nombre_completo   VARCHAR(100) NOT NULL
email             VARCHAR(100) UNIQUE NOT NULL
password          VARCHAR(255) NOT NULL (encriptado)
foto_perfil       VARCHAR(255) DEFAULT
biografia         TEXT
fecha_registro    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

#### Tabla: publicaciones
```sql
id                SERIAL PRIMARY KEY
usuario_id        INT REFERENCES usuarios(id) ON DELETE CASCADE
url_imagen        VARCHAR(255) NOT NULL
descripcion       TEXT
likes             INT DEFAULT 0
fecha_creacion    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

**Relación:** 1 usuario → Muchas publicaciones (One-to-Many)

---

## 🔐 Seguridad

### ✅ Implementado

1. **Encriptación de Contraseñas**
   - Uso de bcryptjs (10 rounds)
   - Nunca se almacenan en texto plano

2. **JWT (JSON Web Tokens)**
   - Tokens firmados con secreto
   - Duración: 7 días
   - Validación en cada request protegido

3. **CORS (Cross-Origin Resource Sharing)**
   - Configurado para permitir solo orígenes autorizados

4. **Validación de Datos**
   - Email format
   - Contraseña mínimo 6 caracteres
   - URL válida en publicaciones

5. **Middlewares de Protección**
   - authMiddleware: Valida JWT
   - validationMiddleware: Valida datos de entrada

### ⚠️ Para Producción

1. Cambiar JWT_SECRET a valor largo y aleatorio
2. Usar variables de entorno para credenciales
3. Implementar HTTPS
4. Agregar rate limiting
5. Implementar refresh tokens
6. Validar CORS específicamente

---

##  Documentación Adicional

- **Backend:** Ver `instagram-api/README.md` para detalles técnicos
- **Backend Setup:** Ver `instagram-api/SETUP.md` para instalación
- **Frontend:** Ver `instagram-frontend/README.md`
- **Frontend Guía:** Ver `instagram-frontend/GUIA_RAPIDA.md`

---

##  Troubleshooting

### Error: "Cannot connect to database"
- Verifica que PostgreSQL está corriendo
- Verifica credenciales en `.env`

### Error: "CORS error"
- Verifica que el backend está en puerto 3000
- Revisa configuración de CORS en `app.js`

### Error: "Token expired"
- Haz login de nuevo
- Los tokens duran 7 días

### Error: "Module not found"
- Ejecuta `npm install` en la carpeta
- Verifica que no hay errores en dependencias

---


---

##  Autor

**Karina Auday**
- GitHub: [@KarinaAuday](https://github.com/KarinaAuday)



```
