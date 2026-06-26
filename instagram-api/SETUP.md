# 🚀 SETUP - Guía de Instalación Paso a Paso

Esta guía te ayudará a configurar la API del Instagram Clone en tu máquina local.

---

## 1️⃣ Requisitos Previos

Antes de empezar, verifica que tienes instalado:

### Node.js y npm

```bash
node --version  # Debe ser v14 o superior
npm --version   # Debe ser v6 o superior
```

Si no los tienes, descarga de: https://nodejs.org/

### PostgreSQL

```bash
psql --version  # Debe ser v12 o superior
```

Descarga de: https://www.postgresql.org/download/

Después de instalar, verifica que el servicio PostgreSQL está corriendo:

**Windows:**
```bash
# Abre Services y busca "PostgreSQL"
```

**Mac/Linux:**
```bash
# PostgreSQL debería iniciar automáticamente
pg_isready  # Debería responder "accepting connections"
```

---

## 2️⃣ Clonar y Descargar el Proyecto

```bash
# Opción A: Si tienes Git
git clone <url-del-repositorio>
cd instagram-api

# Opción B: Descargar como ZIP y extraer
# Luego:
cd instagram-api
```

---

## 3️⃣ Instalar Dependencias

```bash
npm install
```

Esto instalará todas las librerías necesarias en la carpeta `node_modules/`.

**Dependencias principales:**
- `express` - Framework web
- `pg` - Cliente PostgreSQL
- `jsonwebtoken` - Para JWT
- `bcrypt` - Para encriptar contraseñas
- `cors` - Para permitir requests entre dominios
- `dotenv` - Para variables de entorno

---

## 4️⃣ Configurar PostgreSQL

### Paso A: Crear Base de Datos

```bash
# Abrir PostgreSQL
psql -U postgres

# Dentro de psql, ejecutar:
CREATE DATABASE instagram_clone;

# Salir de psql
\q
```

**Alternativa:** Usar DBeaver o pgAdmin para crear la BD gráficamente.

### Paso B: Verificar Conexión

```bash
psql -U postgres -d instagram_clone -c "SELECT 1;"
```

Si responde `1`, la conexión está correcta ✅

---

## 5️⃣ Configurar Variables de Entorno

### Crear archivo `.env`

```bash
cp .env.example .env
```

### Editar `.env` con tus datos

```env
# 🔐 Credenciales PostgreSQL
DB_USER=postgres
DB_PASSWORD=tu_contraseña_de_postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=instagram_clone

# 🔐 JWT Secret (cambiar por algo seguro)
JWT_SECRET=tu_secreto_super_duper_largo_y_seguro_minimo_32_caracteres_aleatorio

# 🌐 Puerto del servidor
PORT=3000

# 🔧 Ambiente
NODE_ENV=development
```

**⚠️ IMPORTANTE:**
- **Nunca** subas `.env` a Git (ya está en `.gitignore`)
- **JWT_SECRET** debe ser largo y aleatorio (mínimo 32 caracteres)
- Cambia la contraseña si es necesario

---

## 6️⃣ Iniciar el Servidor

```bash
# Modo producción
npm start

# Modo desarrollo (con auto-reload)
npm run dev
```

**Salida esperada:**
```
════════════════════════════════════════════════════════════
🚀 Servidor Express iniciado correctamente
════════════════════════════════════════════════════════════

📡 URL: http://localhost:3000
🔧 Ambiente: development
🔐 JWT Secret configurado: ✅ Sí
📊 Base de datos: instagram_clone en localhost

✅ Tabla usuarios lista
✅ Tabla publicaciones lista
✅ Índices creados
```

Si ves esto, ¡todo está funcionando! ✅

---

## 7️⃣ Probar la API

### Opción A: Usando cURL

```bash
# Health check
curl http://localhost:3000

# Registrar usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_usuario": "gato_test",
    "nombre_completo": "Gato Test",
    "email": "gato@test.com",
    "password": "Password123",
    "confirmPassword": "Password123"
  }'
```

### Opción B: Usando Postman

1. Descargar Postman: https://www.postman.com/downloads/
2. Importar colección de requests (si la tienes)
3. O crear requests manualmente:

**Request 1: Registrar**
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "nombre_usuario": "gato_test",
  "nombre_completo": "Gato Test",
  "email": "gato@test.com",
  "password": "Password123",
  "confirmPassword": "Password123"
}
```

**Copiar el token de la respuesta**

**Request 2: Obtener Perfil**
```
GET http://localhost:3000/api/usuarios/perfil
Authorization: Bearer <pegar_token_aqui>
```

### Opción C: Usando VS Code REST Client

Instalar extensión: "REST Client" (Huachao Mao)

Crear archivo `test.http`:
```http
### Registrar usuario
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "nombre_usuario": "gato_test",
  "nombre_completo": "Gato Test",
  "email": "gato@test.com",
  "password": "Password123",
  "confirmPassword": "Password123"
}

### Obtener Feed
GET http://localhost:3000/api/publicaciones
```

Luego hacer click en "Send Request"

---

## 📂 Estructura del Proyecto

```
instagram-api/
├── src/
│   ├── config/
│   │   └── db.js                 ← Conexión PostgreSQL
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js     ← Validar JWT
│   │   └── validationMiddleware.js ← Validar datos
│   │
│   ├── controllers/
│   │   ├── authController.js     ← Login/Register lógica
│   │   ├── userController.js     ← Perfil lógica
│   │   └── postController.js     ← Posts lógica
│   │
│   ├── services/
│   │   ├── authService.js        ← Queries auth
│   │   ├── userService.js        ← Queries usuarios
│   │   └── postService.js        ← Queries posts
│   │
│   ├── routes/
│   │   ├── authRoutes.js         ← /api/auth
│   │   ├── userRoutes.js         ← /api/usuarios
│   │   └── postRoutes.js         ← /api/publicaciones
│   │
│   └── app.js                    ← Entrada principal
│
├── .env                          ← Variables (NO subir a Git)
├── .env.example                  ← Template para otros
├── .gitignore                    ← Archivos a ignorar en Git
├── package.json                  ← Dependencias npm
├── README.md                     ← Documentación
├── SETUP.md                      ← Este archivo
└── node_modules/                 ← Librerías (NO subir a Git)
```

---

## 🔧 Troubleshooting

### Error: `Cannot find module 'express'`

```bash
# Solución: Instalar dependencias
npm install
```

### Error: `EADDRINUSE: Address already in use :::3000`

Otro proceso está usando el puerto 3000:

```bash
# Opción A: Cambiar puerto en .env
PORT=3001

# Opción B: Matar el proceso (Linux/Mac)
lsof -i :3000
kill -9 <PID>

# Opción B: Matar el proceso (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error: `connect ECONNREFUSED 127.0.0.1:5432`

PostgreSQL no está corriendo:

```bash
# Iniciar PostgreSQL
# Windows: Services → PostgreSQL → Start
# Mac: brew services start postgresql
# Linux: sudo service postgresql start
```

### Error: `password authentication failed`

Credenciales incorrectas en `.env`:

```bash
# Verificar contraseña
psql -U postgres -c "SELECT 1;"
# Ingresar contraseña correcta
```

### Error: `database "instagram_clone" does not exist`

Crear la base de datos:

```bash
psql -U postgres -c "CREATE DATABASE instagram_clone;"
```

---

## ✅ Checklist Completo

- [ ] Node.js v14+ instalado
- [ ] PostgreSQL v12+ instalado
- [ ] `npm install` ejecutado
- [ ] Base de datos `instagram_clone` creada
- [ ] Archivo `.env` configurado
- [ ] Servidor inicia sin errores (`npm start`)
- [ ] Puedo registrarme en `POST /api/auth/register`
- [ ] Puedo hacer login en `POST /api/auth/login`
- [ ] Puedo obtener perfil con token válido
- [ ] Tablas creadas automáticamente en PostgreSQL

---

## 📞 Soporte

Si algo no funciona:

1. Verificar que PostgreSQL está corriendo
2. Revisar credenciales en `.env`
3. Revisar los logs del servidor (debe mostrar ✅ o ❌)
4. Leer README.md para más detalles

---

**¡Listo! Tu API está funcionando correctamente** 🎉

Ahora puedes conectar tu frontend React para consumir esta API.
