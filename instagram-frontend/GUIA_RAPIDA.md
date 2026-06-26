# 🚀 FRONTEND REACT - GUÍA RÁPIDA

## ¿QUÉ ES?

Es la interfaz visual (sitio web) que te permite usar la API de Instagram Clone desde el navegador.

Te permite:
- 📝 Registrarte y crear cuenta
- 🔐 Iniciar sesión
- 📸 Ver el feed de publicaciones
- 📤 Crear nuevas publicaciones (fotos)
- ❤️ Dar likes a publicaciones
- 👤 Ver y editar tu perfil
- 🚪 Cerrar sesión

## 📥 DESCARGAR

La carpeta `instagram-frontend` contiene todo el código.

## 🚀 INSTALACIÓN (3 pasos)

### 1. Abre terminal en la carpeta `instagram-frontend`

```bash
cd instagram-frontend
```

### 2. Instala dependencias

```bash
npm install
```

(Esto descarga React y todas las librerías necesarias)

### 3. Inicia el servidor React

```bash
npm start
```

**Automáticamente se abrirá:** `http://localhost:3000`

## ⚠️ IMPORTANTE

**El backend DEBE estar corriendo ANTES que el frontend:**

1. Abre **terminal 1** y ejecuta el backend:
```bash
cd instagram-api
npm start
# http://localhost:3000 (backend)
```

2. Abre **terminal 2** y ejecuta el frontend:
```bash
cd instagram-frontend
npm start
# http://localhost:3000 (React, pero usa puerto 3001)
```

¿Por qué dos terminales? Porque React automáticamente usa el puerto 3001 si el 3000 está ocupado.

## 🧪 FLUJO DE PRUEBA

### Paso 1: Registrarse

Haz clic en "✍️ Registrarse"

Llena el formulario:
```
Nombre de usuario: gato_programador
Nombre completo: Juan Gatoz
Email: juan@example.com
Contraseña: Password123
Confirmar: Password123
```

Haz clic en "✅ Registrarse"

### Paso 2: Ya estás logueado

Deberías ver el Feed automáticamente.

### Paso 3: Crear una publicación

En el Feed, llena:
```
URL de imagen: https://thiscatdoesnotexist.com/image.jpg
Descripción: Mi gato durmiendo
```

Haz clic en "📤 Publicar"

### Paso 4: Dar likes

Haz clic en "❤️ 0" para dar like a cualquier publicación

### Paso 5: Ver mi perfil

Haz clic en "👤 Mi Perfil" en la navbar

### Paso 6: Editar perfil

Haz clic en "✏️ Editar Perfil"

Cambia nombre o biografía y haz clic en "💾 Guardar"

### Paso 7: Logout

Haz clic en "🚪 Logout" para cerrar sesión

## 📱 PANTALLAS

### 1. Login
- Email y contraseña
- Si no tienes cuenta → Registrarse

### 2. Register
- Nombre de usuario
- Nombre completo
- Email
- Contraseña (mínimo 6 caracteres)
- Confirmación de contraseña

### 3. Feed
- Crear publicación (URL + descripción)
- Ver todas las publicaciones
- Dar likes
- Eliminar propias publicaciones

### 4. Perfil
- Foto y datos personales
- Editar perfil
- Ver mis publicaciones en grid

## 🎨 ESTRUCTURA

```
instagram-frontend/
├── public/
│   └── index.html           ← HTML principal
├── src/
│   ├── components/
│   │   ├── Login.js         ← Pantalla login
│   │   ├── Register.js      ← Pantalla registro
│   │   ├── Feed.js          ← Pantalla feed
│   │   └── Profile.js       ← Pantalla perfil
│   ├── App.js               ← Componente raíz
│   ├── App.css              ← Estilos
│   ├── index.js             ← Entrada
│   └── index.css            ← Estilos globales
├── package.json             ← Dependencias
└── README.md                ← Documentación
```

## 💾 DATOS GUARDADOS

- **Token JWT** → Se guarda en `localStorage` del navegador
- **Usuario** → Se obtiene del backend cuando haces login
- **Publicaciones** → Se obtienen del backend en tiempo real

Si cierras el navegador y vuelves a abrir → El token sigue ahí → Te mantiene logueado automáticamente

Si haces logout → Se borra el token → Tienes que login de nuevo

## 🔄 COMUNICACIÓN CON BACKEND

```
Frontend (React)           Backend (Express)          BD (PostgreSQL)
   ↓                          ↓                           ↓
Usuario rellena             Request JSON        Consulta SQL
formulario                       ↓                        ↓
   ↓                      Validación                 Resultado
Haz clic enviar          Procesamiento                ↓
   ↓                           ↓              Response JSON
fetch() request          Response JSON                  ↓
   ↓←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
Recibe JSON
   ↓
Actualiza pantalla
   ↓
Usuario ve resultado
```

## 🐛 TROUBLESHOOTING

### "Error: Cannot connect to backend"
- Verifica que el backend está corriendo en puerto 3000
- Verifica que no hay errores en el backend

### "Blank page"
- Abre Developer Tools (F12)
- Mira la consola por errores
- Intenta actualizar la página (Ctrl+R)

### "CORS error"
- El backend necesita tener CORS habilitado
- (Ya está configurado en el backend que creamos)

### "Token expirado"
- Haz logout y login de nuevo
- El token expira cada 7 días

## 📚 COMPONENTES

### App.js
- Componente raíz
- Maneja navegación principal
- Guarda el token en state

### Login.js
- Formulario de login
- Valida email y password
- Llamada a `/api/auth/login`

### Register.js
- Formulario de registro
- Valida todos los campos
- Llamada a `/api/auth/register`

### Feed.js
- Muestra todas las publicaciones
- Formulario para crear
- Botones de like y eliminar
- Llamadas a `/api/publicaciones`

### Profile.js
- Muestra datos del usuario
- Permite editar perfil
- Muestra grid de publicaciones
- Llamada a `/api/usuarios/perfil`

## 🎯 PRÓXIMOS PASOS

1. ✅ Prueba el flujo completo (registrar → crear post → dar like)
2. ✅ Edita los estilos en `App.css` si quieres cambiar colores
3. ✅ Agrega más funcionalidades (comentarios, búsqueda, etc)
4. ✅ Despliega en Vercel/Netlify

## 📞 AYUDA

Si algo no funciona:
1. Verifica que el backend está corriendo
2. Mira la consola del navegador (F12)
3. Mira los logs del backend
4. Lee el README del backend

---

**¡Diviértete usando tu app! 🎉**
