# Innovasoft - Sistema de Gestión de Licencias

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Base de Datos](#base-de-datos)
- [API Endpoints](#api-endpoints)
- [Uso](#uso)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

## Características

### Autenticación y Seguridad

- ✅ Registro de usuarios con validación
- ✅ Login con JWT (JSON Web Tokens)
- ✅ Logout con invalidación de sesión
- ✅ Recuperación de contraseña por email
- ✅ Restablecimiento de contraseña con token temporal
- ✅ Validación de sesión única (un usuario, una sesión activa)
- ✅ Middleware de protección de rutas

### Gestión de Licencias

- ✅ Visualización de licencias por usuario
- ✅ Estados de licencia (Activa/Inactiva)
- ✅ Relación licencia-servicio-usuario
- ✅ Validación de caducidad automática
- ✅ Dashboard interactivo

### Procesamiento de Archivos

- ✅ Subida de archivos a Cloudinary
- ✅ Validación de tipos de archivo por servicio
- ✅ Estados de proceso: APAGADO, PROCESANDO, EJECUTANDO, COMPLETADO, ERROR, PAUSADO
- ✅ Monitoreo en tiempo real del estado del proceso
- ✅ Auto-refresh cada 15 segundos
- ✅ Visualización de resultados y errores
- ✅ Barra de progreso animada
- ✅ Registro de fecha inicio/fin de proceso

### Interfaz de Usuario

- ✅ Dashboard responsivo y moderno
- ✅ Componentes reutilizables con shadcn/ui
- ✅ Notificaciones toast con Sonner
- ✅ Diseño moderno con TailwindCSS 4
- ✅ Iconografía con Lucide React
- ✅ Soporte para modo oscuro/claro

---

## Tecnologías

### Frontend

- **Framework:** [Next.js 15.5.2](https://nextjs.org/) (App Router)
- **React:** 19.1.0
- **TypeScript:** 5
- **Styling:** [TailwindCSS 4](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)

### Backend

- **Runtime:** Node.js con Next.js API Routes
- **ORM:** [Prisma 6.16.0](https://www.prisma.io/)
- **Base de Datos:** SQL Server
- **Autenticación:** [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- **Hashing:** [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Email:** [Nodemailer](https://nodemailer.com/)
- **Storage:** [Cloudinary](https://cloudinary.com/)

### Herramientas de Desarrollo

- **Package Manager:** pnpm
- **Linter:** ESLint 9
- **Build Tool:** Turbopack

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (o npm/yarn)
- **SQL Server** (local o Azure SQL)
- **Cuenta de Cloudinary** (para almacenamiento de archivos)
- **Servidor SMTP** (para envío de emails)

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/innovasoft.git
cd innovasoft
```

### 2. Instalar dependencias

```bash
pnpm install
# o
npm install
# o
yarn install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales (ver [Configuración](#configuración))

### 4. Configurar la base de datos

```bash
# Generar el cliente de Prisma
pnpm prisma generate

# Ejecutar migraciones
pnpm prisma migrate dev

# (Opcional) Poblar la base de datos con datos de prueba
pnpm prisma db seed
```

### 5. Ejecutar en modo desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

---

## Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Base de Datos
DATABASE_URL="sqlserver://localhost:1433;database=innovasoft;user=sa;password=TuPassword;encrypt=true;trustServerCertificate=true"

# JWT
JWT_SECRET="tu-secreto-super-seguro-aqui-cambiar-en-produccion"
JWT_EXPIRES_IN="7d"

# Cloudinary
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"

# Email (SMTP)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="tu-email@gmail.com"
EMAIL_PASSWORD="tu-password-de-aplicacion"
EMAIL_FROM="Innovasoft <noreply@innovasoft.com>"

# URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### Configuración de SQL Server

#### Opción 1: SQL Server Local

1. Instala SQL Server Express
2. Crea una base de datos llamada `innovasoft`
3. Actualiza `DATABASE_URL` en `.env`

#### Opción 2: Azure SQL

1. Crea una base de datos en Azure SQL
2. Obtén la cadena de conexión
3. Actualiza `DATABASE_URL` en `.env`

### Configuración de Cloudinary

1. Crea una cuenta en [Cloudinary](https://cloudinary.com/)
2. Obtén tus credenciales del Dashboard
3. Actualiza las variables `CLOUDINARY_*` en `.env`

### Configuración de Email

#### Gmail

1. Habilita la verificación en 2 pasos
2. Genera una contraseña de aplicación
3. Usa la contraseña de aplicación en `EMAIL_PASSWORD`

#### Otros proveedores SMTP

Actualiza `EMAIL_HOST`, `EMAIL_PORT` según tu proveedor.

---

## Estructura del Proyecto

```
innovasoft/
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   └── migrations/            # Migraciones de Prisma
├── public/                    # Archivos estáticos
├── src/
│   ├── app/                   # App Router de Next.js
│   │   ├── (auth)/           # Rutas de autenticación
│   │   │   ├── login/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── api/              # API Routes
│   │   │   ├── auth/         # Endpoints de autenticación
│   │   │   ├── licencias/    # Endpoints de licencias
│   │   │   ├── servicios/    # Endpoints de servicios
│   │   │   └── procesos/     # Endpoints de procesos
│   │   ├── dashboard/        # Dashboard principal
│   │   ├── layout.tsx        # Layout principal
│   │   └── page.tsx          # Página de inicio
│   ├── components/           # Componentes React
│   │   ├── auth/            # Componentes de autenticación
│   │   ├── ui/              # Componentes UI (shadcn/ui)
│   │   ├── license-card.tsx
│   │   ├── user-card.tsx
│   │   └── ...
│   ├── hooks/               # Custom hooks
│   │   └── useProceso.ts
│   ├── lib/                 # Utilidades y configuración
│   │   ├── prisma.ts       # Cliente de Prisma
│   │   ├── email.ts        # Configuración de email
│   │   └── utils.ts        # Utilidades generales
│   ├── types/              # Definiciones de TypeScript
│   │   ├── auth/
│   │   └── ProcesoInterface.ts
│   ├── utils/              # Funciones utilitarias
│   │   ├── api/
│   │   └── formatFecha.ts
│   └── middleware.ts       # Middleware de Next.js
├── .env                    # Variables de entorno (no versionado)
├── .env.example           # Ejemplo de variables de entorno
├── next.config.ts         # Configuración de Next.js
├── package.json
├── tsconfig.json          # Configuración de TypeScript
└── README.md
```

---

## Base de Datos

### Modelos

#### Usuario

```prisma
model Usuario {
  id                  Int        @id @default(autoincrement())
  nombre              String
  usuario             String     @unique
  contrasena          String
  correo              String     @unique
  estado              Boolean    @default(true)
  sesion_token        String?
  sesion_expira       DateTime?
  reset_token         String?
  reset_expira        DateTime?
  licencias           Licencia[]
}
```

#### Servicio

```prisma
model Servicio {
  id                  Int        @id @default(autoincrement())
  nombre              String
  descripcion         String
  precio              Decimal
  tipos_archivo       String     @default(".txt")
  licencias           Licencia[]
}
```

#### Licencia

```prisma
model Licencia {
  id                  Int       @id @default(autoincrement())
  id_usuario          Int
  id_servicio         Int
  caducidad           DateTime
  estado              Boolean   @default(false)
  usuario             Usuario   @relation(...)
  servicio            Servicio  @relation(...)
  procesos            Proceso[]
}
```

#### Proceso

```prisma
model Proceso {
  id            Int       @id @default(autoincrement())
  id_licencia   Int
  archivo_path  String
  estado        String    @default("APAGADO")
  fecha_inicio  DateTime?
  fecha_fin     DateTime?
  resultado     String?
  error_mensaje String?
  licencia      Licencia  @relation(...)
}
```

### Migraciones

```bash
# Crear una nueva migración
pnpm prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
pnpm prisma migrate deploy

# Resetear la base de datos (desarrollo)
pnpm prisma migrate reset
```

---

##  API Endpoints

### Autenticación

#### POST `/api/auth/register`

Registrar un nuevo usuario.

**Body:**

```json
{
  "nombre": "Juan Pérez",
  "usuario": "juanperez",
  "correo": "juan@example.com",
  "contrasena": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente"
}
```

#### POST `/api/auth/login`

Iniciar sesión.

**Body:**

```json
{
  "usuario": "juanperez",
  "contrasena": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": 1,
    "nombre": "Juan Pérez",
    "usuario": "juanperez",
    "correo": "juan@example.com",
    "licencias": [...]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/api/auth/logout`

Cerrar sesión.

**Response:**

```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

#### POST `/api/auth/forgot-password`

Solicitar restablecimiento de contraseña.

**Body:**

```json
{
  "correo": "juan@example.com"
}
```

#### POST `/api/auth/reset-password`

Restablecer contraseña.

**Body:**

```json
{
  "token": "abc123...",
  "nuevaContrasena": "newpassword123"
}
```

### Licencias

#### GET `/api/licencias`

Obtener todas las licencias del usuario autenticado.

#### POST `/api/licencias`

Crear una nueva licencia.

### Servicios

#### GET `/api/servicios`

Obtener todos los servicios disponibles.

### Procesos

#### GET `/api/procesos/consultar?procesoId=1`

Consultar el estado de un proceso.

#### POST `/api/procesos/subir-archivo`

Subir un archivo para procesamiento.

**Body (FormData):**

```
file: [archivo]
licenciaId: 1
```

---

## Uso

### Desarrollo

```bash
# Modo desarrollo con hot-reload
pnpm dev

# Lint del código
pnpm lint

# Formatear código
pnpm format
```

### Producción

```bash
# Build para producción
pnpm build

# Iniciar servidor de producción
pnpm start
```

### Prisma Studio

```bash
# Abrir Prisma Studio (GUI para la base de datos)
pnpm prisma studio
```

---

## Deployment

### Vercel (Recomendado)

1. **Conecta tu repositorio a Vercel**

   ```bash
   vercel
   ```

2. **Configura las variables de entorno** en el dashboard de Vercel

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Dependencias
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Producción
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
# Build
docker build -t innovasoft .

# Run
docker run -p 3000:3000 --env-file .env innovasoft
```

### Variables de Entorno en Producción

Asegúrate de configurar todas las variables de entorno en tu plataforma de deployment:

- `DATABASE_URL`
- `JWT_SECRET`
- `CLOUDINARY_*`
- `EMAIL_*`
- `NEXT_PUBLIC_APP_URL`

---

## Troubleshooting

### Error de conexión a la base de datos

```
Error: Can't reach database server
```

**Solución:**

- Verifica que SQL Server esté ejecutándose
- Revisa la cadena de conexión en `DATABASE_URL`
- Asegúrate de que el firewall permita la conexión

### Error de Prisma Client

```
Error: @prisma/client did not initialize yet
```

**Solución:**

```bash
pnpm prisma generate
```

### Error de CORS

**Solución:**
Agrega la configuración de CORS en `next.config.ts`:

```typescript
module.exports = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ];
  },
};
```

### Error de Cloudinary

```
Error: Invalid cloud_name
```

**Solución:**

- Verifica las credenciales de Cloudinary en `.env`
- Asegúrate de que las variables estén correctamente configuradas

---

## Contacto

**Desarrollador:** Edwin Burbano  
**GitHub:** [@edwdev](https://github.com/edwdev)  
**Email:** contacto@innovasoft.com

---

