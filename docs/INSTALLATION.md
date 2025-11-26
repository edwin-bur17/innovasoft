# Guía de Instalación - Innovasoft

Esta guía te llevará paso a paso por el proceso de instalación y configuración del proyecto Innovasoft.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

### Software Requerido

1. **Node.js** (versión 18 o superior)

   - Descarga desde: https://nodejs.org/
   - Verifica la instalación: `node --version`

2. **pnpm** (gestor de paquetes)

   ```bash
   npm install -g pnpm
   # Verifica: pnpm --version
   ```

3. **SQL Server**

   - **Opción A:** SQL Server Express (local) - https://www.microsoft.com/sql-server/sql-server-downloads
   - **Opción B:** Azure SQL Database (nube)

4. **Git**
   - Descarga desde: https://git-scm.com/

### Cuentas de Servicios Externos

1. **Cloudinary** (almacenamiento de archivos)

   - Regístrate en: https://cloudinary.com/
   - Plan gratuito disponible

2. **Servidor SMTP** (envío de emails)
   - Gmail (con contraseña de aplicación)

---

## Instalación Paso a Paso

### Paso 1: Clonar el Repositorio

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/innovasoft.git

# Navega al directorio del proyecto
cd innovasoft
```

### Paso 2: Instalar Dependencias

```bash
# Instala todas las dependencias del proyecto
pnpm install

# Esto puede tardar unos minutos...
```

### Paso 3: Configurar Variables de Entorno

1. **Crea el archivo `.env`:**

   ```bash
   # En Windows (PowerShell)
   Copy-Item .env.example .env

   # En Linux/Mac
   cp .env.example .env
   ```

2. **Edita el archivo `.env`** con tus credenciales:

   ```env
   # Base de Datos
   DATABASE_URL="sqlserver://localhost:1433;database=innovasoft;user=sa;password=TuPassword;encrypt=true;trustServerCertificate=true"

   # JWT
   JWT_SECRET="genera-un-secreto-seguro-aqui"
   JWT_EXPIRES_IN="7d"

   # Cloudinary
   CLOUDINARY_CLOUD_NAME="tu-cloud-name"
   CLOUDINARY_API_KEY="tu-api-key"
   CLOUDINARY_API_SECRET="tu-api-secret"

   # Email
   EMAIL_HOST="smtp.gmail.com"
   EMAIL_PORT="587"
   EMAIL_USER="tu-email@gmail.com"
   EMAIL_PASSWORD="tu-password-de-aplicacion"
   EMAIL_FROM="Innovasoft <noreply@innovasoft.com>"

   # URLs
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   NEXT_PUBLIC_API_URL="http://localhost:3000/api"
   ```

### Paso 4: Configurar la Base de Datos

#### Opción A: SQL Server Local

1. **Instala SQL Server Express:**

   - Descarga desde: https://www.microsoft.com/sql-server/sql-server-downloads
   - Instala con configuración predeterminada

2. **Crea la base de datos:**

   ```sql
   CREATE DATABASE innovasoft;
   ```

3. **Actualiza `DATABASE_URL` en `.env`:**
   ```env
   DATABASE_URL="sqlserver://localhost:1433;database=innovasoft;user=sa;password=TuPassword;encrypt=true;trustServerCertificate=true"
   ```

#### Opción B: Azure SQL

1. **Crea una base de datos en Azure Portal**
2. **Obtén la cadena de conexión**
3. **Actualiza `DATABASE_URL` en `.env`**

### Paso 5: Ejecutar Migraciones de Prisma

```bash
# Genera el cliente de Prisma
pnpm prisma generate

# Ejecuta las migraciones para crear las tablas
pnpm prisma migrate dev

# Esto creará las tablas: Usuario, Servicio, Licencia, Proceso
```

### Paso 6: (Opcional) Poblar la Base de Datos

Puedes crear datos de prueba manualmente o usar Prisma Studio:

```bash
# Abre Prisma Studio (interfaz gráfica)
pnpm prisma studio

# Se abrirá en http://localhost:5555
```

### Paso 7: Iniciar el Servidor de Desarrollo

```bash
# Inicia el servidor en modo desarrollo
pnpm dev

# El servidor estará disponible en:
# http://localhost:3000
```

---

## Verificación de la Instalación

### 1. Verifica que el servidor esté corriendo

Abre tu navegador y ve a: http://localhost:3000

Deberías ver la página de inicio de Innovasoft.

### 2. Prueba el registro de usuario

1. Ve a: http://localhost:3000/login
2. Haz clic en "Registrarse"
3. Completa el formulario
4. Verifica que puedas iniciar sesión

### 3. Verifica la conexión a la base de datos

```bash
# Abre Prisma Studio
pnpm prisma studio

# Verifica que puedas ver las tablas y datos
```

---

## Configuración Adicional

### Configurar Gmail para Envío de Emails

1. **Habilita la verificación en 2 pasos:**

   - Ve a: https://myaccount.google.com/security
   - Activa "Verificación en 2 pasos"

2. **Genera una contraseña de aplicación:**

   - Ve a: https://myaccount.google.com/apppasswords
   - Selecciona "Correo" y "Otro (nombre personalizado)"
   - Copia la contraseña generada

3. **Actualiza `.env`:**
   ```env
   EMAIL_USER="tu-email@gmail.com"
   EMAIL_PASSWORD="la-contraseña-de-aplicacion-generada"
   ```

### Configurar Cloudinary

1. **Regístrate en Cloudinary:**

   - Ve a: https://cloudinary.com/users/register/free

2. **Obtén tus credenciales:**

   - Ve al Dashboard: https://cloudinary.com/console
   - Copia: Cloud Name, API Key, API Secret

3. **Actualiza `.env`:**
   ```env
   CLOUDINARY_CLOUD_NAME="tu-cloud-name"
   CLOUDINARY_API_KEY="123456789012345"
   CLOUDINARY_API_SECRET="tu-api-secret"
   ```

### Generar un JWT Secret Seguro

```bash
# En Linux/Mac
openssl rand -base64 32

# En Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Copia el resultado y actualiza JWT_SECRET en .env
```

---

## Solución de Problemas Comunes

### Error: "Can't reach database server"

**Causa:** SQL Server no está ejecutándose o la cadena de conexión es incorrecta.

**Solución:**

1. Verifica que SQL Server esté ejecutándose
2. Revisa la cadena de conexión en `DATABASE_URL`
3. Verifica usuario y contraseña
4. Asegúrate de que el puerto 1433 esté abierto

### Error: "Prisma Client is not generated"

**Solución:**

```bash
pnpm prisma generate
```

### Error: "Port 3000 is already in use"

**Solución:**

```bash
# Cambia el puerto en package.json o usa:
PORT=3001 pnpm dev
```

### Error de Email: "Invalid login"

**Solución:**

- Verifica que uses una contraseña de aplicación (no tu contraseña normal)
- Asegúrate de que la verificación en 2 pasos esté habilitada en Gmail

### Error de Cloudinary: "Invalid cloud_name"

**Solución:**

- Verifica que las credenciales sean correctas
- Asegúrate de copiar exactamente desde el dashboard de Cloudinary

---

## Próximos Pasos

Una vez que la instalación esté completa:

1. **Lee la documentación de la API:** Ver `docs/API.md`
2. **Explora el código:** Revisa la estructura en `src/`
3. **Crea tu primer servicio y licencia:** Usa Prisma Studio
4. **Prueba la subida de archivos:** En el dashboard

---

## Ayuda Adicional

Si encuentras problemas:

1. Revisa la sección de [Troubleshooting](../README.md#troubleshooting) en el README principal
2. Verifica los logs en la consola
3. Revisa la documentación de Prisma: https://www.prisma.io/docs
4. Contacta al equipo de desarrollo

---

## ¡Listo!

Si llegaste hasta aquí sin errores, ¡felicidades! 

Tu instalación de Innovasoft web está completa y lista para usar o modificar.
