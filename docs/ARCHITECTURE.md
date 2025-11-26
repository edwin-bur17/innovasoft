# Arquitectura del Proyecto - Innovasoft

Este documento describe la arquitectura técnica del sistema de gestión de licencias Innovasoft.

## Visión General

Innovasoft es una aplicación web full-stack construida con Next.js 15 que utiliza el App Router y Server Components para una experiencia de usuario óptima.

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │  React 19    │  │ TailwindCSS  │      │
│  │  (Chrome,    │──│  Components  │──│   + Radix    │      │
│  │   Firefox)   │  │              │  │      UI      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              App Router (RSC)                        │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │   │
│  │  │   Pages    │  │    API     │  │ Middleware │    │   │
│  │  │ (Server    │  │   Routes   │  │   (Auth)   │    │   │
│  │  │Components) │  │            │  │            │    │   │
│  │  └────────────┘  └────────────┘  └────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┼───────────┐
                │           │           │
                ▼           ▼           ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │  Prisma  │ │Cloudinary│ │Nodemailer│
        │   ORM    │ │  (Files) │ │ (Email)  │
        └──────────┘ └──────────┘ └──────────┘
                │
                ▼
        ┌──────────────┐
        │  SQL Server  │
        │  (Database)  │
        └──────────────┘
```

---

## Capas de la Aplicación

### 1. Capa de Presentación (Frontend)

**Tecnologías:**

- React 19.1.0 (Server Components + Client Components)
- Next.js 15.5.2 (App Router)
- TailwindCSS 4
- shadcn/ui (Radix UI)

**Responsabilidades:**

- Renderizado de UI
- Interacción con el usuario
- Validación de formularios (cliente)
- Gestión de estado local
- Comunicación con API

**Componentes Principales:**

```
src/components/
├── auth/                    # Componentes de autenticación
│   ├── login-form.tsx
│   ├── forgot-password-form.tsx
│   └── reset-password-form.tsx
├── ui/                      # Componentes UI reutilizables
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ...
├── license-card.tsx         # Tarjeta de licencia
├── user-card.tsx           # Tarjeta de usuario
└── logout-dialog.tsx       # Diálogo de logout
```

### 2. Capa de Aplicación (Backend)

**Tecnologías:**

- Next.js API Routes
- TypeScript 5
- Middleware personalizado

**Responsabilidades:**

- Lógica de negocio
- Validación de datos (servidor)
- Autenticación y autorización
- Procesamiento de archivos
- Envío de emails

**Estructura de API:**

```
src/app/api/
├── auth/
│   ├── login/route.ts           # POST - Login
│   ├── logout/route.ts          # POST - Logout
│   ├── register/route.ts        # POST - Registro
│   ├── forgot-password/route.ts # POST - Solicitar reset
│   └── reset-password/route.ts  # POST - Restablecer
├── licencias/
│   └── route.ts                 # GET, POST - Licencias
├── servicios/
│   └── route.ts                 # GET, POST - Servicios
└── procesos/
    ├── consultar/route.ts       # GET - Estado proceso
    └── subir-archivo/route.ts   # POST - Subir archivo
```

### 3. Capa de Datos (Database)

**Tecnología:**

- Prisma ORM 6.16.0
- SQL Server

**Modelos de Datos:**

```prisma
Usuario (1) ──< (N) Licencia (N) >── (1) Servicio
                        │
                        │ (1)
                        │
                        ▼
                    (N) Proceso
```

**Responsabilidades:**

- Persistencia de datos
- Relaciones entre entidades
- Migraciones de esquema
- Consultas optimizadas

---

## Flujo de Autenticación

```
┌────────┐                ┌────────┐              ┌──────────┐
│Cliente │                │Servidor│              │ Database │
└───┬────┘                └───┬────┘              └────┬─────┘
    │                         │                        │
    │ POST /api/auth/login    │                        │
    │ {usuario, contraseña}   │                        │
    ├────────────────────────>│                        │
    │                         │                        │
    │                         │ Buscar usuario         │
    │                         ├───────────────────────>│
    │                         │                        │
    │                         │ Usuario encontrado     │
    │                         │<───────────────────────┤
    │                         │                        │
    │                         │ Verificar contraseña   │
    │                         │ (bcrypt.compare)       │
    │                         │                        │
    │                         │ Generar JWT            │
    │                         │ (jsonwebtoken.sign)    │
    │                         │                        │
    │                         │ Guardar sesión         │
    │                         ├───────────────────────>│
    │                         │                        │
    │ {success, user, token}  │                        │
    │<────────────────────────┤                        │
    │                         │                        │
    │ Guardar token en        │                        │
    │ localStorage            │                        │
    │                         │                        │
```

### Middleware de Autenticación

```typescript
// src/middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token && isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verificar token JWT
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
```

---

## Flujo de Procesamiento de Archivos

```
┌────────┐         ┌────────┐         ┌──────────┐        ┌──────────┐
│Cliente │         │Servidor│         │Cloudinary│        │ Database │
└───┬────┘         └───┬────┘         └────┬─────┘        └────┬─────┘
    │                  │                   │                   │
    │ 1. Seleccionar   │                   │                   │
    │    archivo       │                   │                   │
    │                  │                   │                   │
    │ 2. POST /api/    │                   │                   │
    │    procesos/     │                   │                   │
    │    subir-archivo │                   │                   │
    ├─────────────────>│                   │                   │
    │                  │                   │                   │
    │                  │ 3. Validar tipo   │                   │
    │                  │    de archivo     │                   │
    │                  │                   │                   │
    │                  │ 4. Subir a        │                   │
    │                  │    Cloudinary     │                   │
    │                  ├──────────────────>│                   │
    │                  │                   │                   │
    │                  │ 5. URL del archivo│                   │
    │                  │<──────────────────┤                   │
    │                  │                   │                   │
    │                  │ 6. Crear proceso  │                   │
    │                  │    en DB          │                   │
    │                  ├──────────────────────────────────────>│
    │                  │                   │                   │
    │                  │ 7. Proceso creado │                   │
    │                  │<──────────────────────────────────────┤
    │                  │                   │                   │
    │ 8. {success,     │                   │                   │
    │     proceso}     │                   │                   │
    │<─────────────────┤                   │                   │
    │                  │                   │                   │
    │ 9. Auto-refresh  │                   │                   │
    │    cada 15s      │                   │                   │
    │    (useProceso)  │                   │                   │
    │                  │                   │                   │
```

---

## Custom Hooks

### useProceso

Hook personalizado para monitorear el estado de un proceso en tiempo real.

```typescript
// src/hooks/useProceso.ts
export function useProceso({ procesoId, autoRefresh = false, refreshInterval = 15000 }) {
  const [proceso, setProceso] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!procesoId || !autoRefresh) return;

    const interval = setInterval(async () => {
      const data = await fetchProceso(procesoId);
      setProceso(data.proceso);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [procesoId, autoRefresh, refreshInterval]);

  return { proceso, loading, error };
}
```

---

## Modelo de Datos

### Diagrama ER

```
┌─────────────────────┐
│      Usuario        │
├─────────────────────┤
│ id (PK)             │
│ nombre              │
│ usuario (UNIQUE)    │
│ contrasena          │
│ correo (UNIQUE)     │
│ estado              │
│ sesion_token        │
│ sesion_expira       │
│ reset_token         │
│ reset_expira        │
└──────────┬──────────┘
           │
           │ 1:N
           │
           ▼
┌─────────────────────┐         ┌─────────────────────┐
│      Licencia       │   N:1   │      Servicio       │
├─────────────────────┤◄────────┤─────────────────────┤
│ id (PK)             │         │ id (PK)             │
│ id_usuario (FK)     │         │ nombre              │
│ id_servicio (FK)    │         │ descripcion         │
│ caducidad           │         │ precio              │
│ estado              │         │ tipos_archivo       │
└──────────┬──────────┘         └─────────────────────┘
           │
           │ 1:N
           │
           ▼
┌─────────────────────┐
│      Proceso        │
├─────────────────────┤
│ id (PK)             │
│ id_licencia (FK)    │
│ archivo_path        │
│ estado              │
│ fecha_inicio        │
│ fecha_fin           │
│ resultado           │
│ error_mensaje       │
└─────────────────────┘
```

### Estados del Proceso

```
APAGADO ──> PROCESANDO ──> EJECUTANDO ──> COMPLETADO
                │                             │
                │                             │
                └────────────> ERROR <────────┘
                                 │
                                 ▼
                              PAUSADO
```

---

## Seguridad

### 1. Autenticación

- **JWT** con expiración de 7 días
- **Sesión única** por usuario
- **Tokens de reset** con expiración de 1 hora

### 2. Contraseñas

- **Hashing** con bcryptjs (10 rounds)
- **Validación** de complejidad en cliente y servidor

### 3. Protección de Rutas

- **Middleware** de Next.js para rutas protegidas
- **Verificación de token** en cada request

### 4. Validación de Archivos

- **Tipo de archivo** según servicio
- **Tamaño máximo** de 10 MB
- **Sanitización** de nombres de archivo

### 5. Variables de Entorno

- **Secretos** nunca en el código
- **Validación** al inicio de la aplicación

---

## Rendimiento

### Optimizaciones

1. **Server Components** (RSC)

   - Renderizado en servidor
   - Menos JavaScript al cliente
   - Mejor SEO

2. **Lazy Loading**

   - Componentes cargados bajo demanda
   - Reducción de bundle inicial

3. **Caché de Prisma**

   - Queries optimizadas
   - Connection pooling

4. **Cloudinary**
   - CDN global
   - Optimización automática de imágenes

---

## Testing (Recomendado)

```
tests/
├── unit/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── integration/
│   └── api/
└── e2e/
    └── flows/
```

**Herramientas Sugeridas:**

- **Jest** - Unit tests
- **React Testing Library** - Component tests
- **Playwright** - E2E tests

---

## Escalabilidad

### Horizontal

- **Vercel** - Auto-scaling
- **Cloudinary** - CDN global
- **Azure SQL** - Escalado automático

### Vertical

- **Database indexing** en campos frecuentes
- **Connection pooling** con Prisma
- **Caching** con Redis (futuro)

---

## CI/CD (Recomendado)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm prisma generate
      - run: pnpm build
      - run: pnpm test
      - uses: amondnet/vercel-action@v20
```

---

## Contacto

Para preguntas sobre la arquitectura:

**Arquitecto:** Edwin Esneider Burbano Luna
**Email:** edwinburbano473@gmail.com

---

**Última actualización:** 26 de noviembre de 2025
