# Documentación de la API - Innovasoft

Esta documentación describe todos los endpoints disponibles en la API de Innovasoft.

## Tabla de Contenidos

- [Autenticación](#autenticación)
- [Licencias](#licencias)
- [Servicios](#servicios)
- [Procesos](#procesos)
- [Códigos de Estado](#códigos-de-estado)
- [Manejo de Errores](#manejo-de-errores)

---

## Autenticación

Todos los endpoints (excepto login, register y forgot-password) requieren autenticación mediante JWT.

### Headers Requeridos

```http
Authorization: Bearer <tu-token-jwt>
Content-Type: application/json
```

---

## Endpoints de Autenticación

### POST `/api/auth/register`

Registra un nuevo usuario en el sistema.

**Request Body:**

```json
{
  "nombre": "Juan Pérez",
  "usuario": "juanperez",
  "correo": "juan@example.com",
  "contrasena": "Password123!"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente"
}
```

**Errores Posibles:**

- `400` - Datos inválidos o incompletos
- `409` - Usuario o correo ya existe

---

### POST `/api/auth/login`

Inicia sesión y obtiene un token JWT.

**Request Body:**

```json
{
  "usuario": "juanperez",
  "contrasena": "Password123!"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "user": {
    "id": 1,
    "nombre": "Juan Pérez",
    "usuario": "juanperez",
    "correo": "juan@example.com",
    "estado": true,
    "licencias": [
      {
        "id": 1,
        "caducidad": "2025-12-31T00:00:00.000Z",
        "estado": true,
        "servicio": {
          "id": 1,
          "nombre": "Servicio Premium",
          "descripcion": "Descripción del servicio",
          "precio": "99.99",
          "tipos_archivo": ".txt,.pdf"
        }
      }
    ]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores Posibles:**

- `400` - Credenciales inválidas
- `401` - Usuario o contraseña incorrectos
- `403` - Usuario desactivado

---

### POST `/api/auth/logout`

Cierra la sesión actual e invalida el token.

**Headers:**

```http
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

---

### POST `/api/auth/forgot-password`

Solicita un enlace para restablecer la contraseña.

**Request Body:**

```json
{
  "correo": "juan@example.com"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Se ha enviado un correo con instrucciones para restablecer tu contraseña"
}
```

**Nota:** Se enviará un email con un token que expira en 1 hora.

---

### POST `/api/auth/reset-password`

Restablece la contraseña usando el token recibido por email.

**Request Body:**

```json
{
  "token": "abc123def456...",
  "nuevaContrasena": "NewPassword123!"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente"
}
```

**Errores Posibles:**

- `400` - Token inválido o expirado
- `400` - Contraseña no cumple requisitos

---

## Licencias

### GET `/api/licencias`

Obtiene todas las licencias del usuario autenticado.

**Headers:**

```http
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "success": true,
  "licencias": [
    {
      "id": 1,
      "id_usuario": 1,
      "id_servicio": 1,
      "caducidad": "2025-12-31T00:00:00.000Z",
      "estado": true,
      "fecha_creacion": "2025-01-01T00:00:00.000Z",
      "servicio": {
        "id": 1,
        "nombre": "Servicio Premium",
        "descripcion": "Descripción del servicio",
        "precio": "99.99",
        "tipos_archivo": ".txt,.pdf"
      }
    }
  ]
}
```

---

### POST `/api/licencias`

Crea una nueva licencia (solo administradores).

**Headers:**

```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "id_usuario": 1,
  "id_servicio": 1,
  "caducidad": "2025-12-31",
  "estado": true
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "licencia": {
    "id": 2,
    "id_usuario": 1,
    "id_servicio": 1,
    "caducidad": "2025-12-31T00:00:00.000Z",
    "estado": true
  }
}
```

---

## Servicios

### GET `/api/servicios`

Obtiene todos los servicios disponibles.

**Response (200 OK):**

```json
{
  "success": true,
  "servicios": [
    {
      "id": 1,
      "nombre": "Servicio Premium",
      "descripcion": "Procesamiento avanzado de archivos",
      "precio": "99.99",
      "tipos_archivo": ".txt,.pdf,.docx",
      "fecha_creacion": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### POST `/api/servicios`

Crea un nuevo servicio (solo administradores).

**Request Body:**

```json
{
  "nombre": "Servicio Básico",
  "descripcion": "Procesamiento básico de archivos",
  "precio": 49.99,
  "tipos_archivo": ".txt"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "servicio": {
    "id": 2,
    "nombre": "Servicio Básico",
    "descripcion": "Procesamiento básico de archivos",
    "precio": "49.99",
    "tipos_archivo": ".txt"
  }
}
```

---

## Procesos

### GET `/api/procesos/consultar`

Consulta el estado de un proceso específico.

**Query Parameters:**

- `procesoId` (required): ID del proceso a consultar

**Example:**

```http
GET /api/procesos/consultar?procesoId=1
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "success": true,
  "proceso": {
    "id": 1,
    "id_licencia": 1,
    "archivo_path": "https://res.cloudinary.com/...",
    "estado": "COMPLETADO",
    "fecha_inicio": "2025-11-26T10:00:00.000Z",
    "fecha_fin": "2025-11-26T10:05:00.000Z",
    "resultado": "Proceso completado exitosamente",
    "error_mensaje": null
  }
}
```

**Estados Posibles:**

- `APAGADO` - Proceso no iniciado
- `PROCESANDO` - Archivo siendo procesado
- `EJECUTANDO` - Proceso en ejecución
- `COMPLETADO` - Proceso finalizado exitosamente
- `ERROR` - Proceso finalizado con error
- `PAUSADO` - Proceso pausado

---

### POST `/api/procesos/subir-archivo`

Sube un archivo para procesamiento.

**Headers:**

```http
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**

- `file` (File): Archivo a procesar
- `licenciaId` (number): ID de la licencia a usar

**Example (JavaScript):**

```javascript
const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("licenciaId", "1");

const response = await fetch("/api/procesos/subir-archivo", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});
```

**Response (200 OK):**

```json
{
  "success": true,
  "proceso": {
    "id": 2,
    "id_licencia": 1,
    "archivo_path": "https://res.cloudinary.com/...",
    "estado": "PROCESANDO",
    "fecha_inicio": "2025-11-26T10:00:00.000Z"
  },
  "message": "Archivo subido exitosamente"
}
```

**Errores Posibles:**

- `400` - Archivo no válido o tipo no permitido
- `403` - Licencia inactiva o expirada
- `404` - Licencia no encontrada
- `413` - Archivo demasiado grande

---

## Códigos de Estado HTTP

| Código | Significado           | Descripción                       |
| ------ | --------------------- | --------------------------------- |
| 200    | OK                    | Solicitud exitosa                 |
| 201    | Created               | Recurso creado exitosamente       |
| 400    | Bad Request           | Datos inválidos o incompletos     |
| 401    | Unauthorized          | No autenticado o token inválido   |
| 403    | Forbidden             | No autorizado para esta acción    |
| 404    | Not Found             | Recurso no encontrado             |
| 409    | Conflict              | Conflicto (ej: usuario ya existe) |
| 413    | Payload Too Large     | Archivo demasiado grande          |
| 500    | Internal Server Error | Error del servidor                |

---

## Manejo de Errores

Todos los errores siguen el mismo formato:

```json
{
  "success": false,
  "error": "Mensaje de error descriptivo",
  "code": "ERROR_CODE"
}
```

### Códigos de Error Comunes

| Código                | Descripción                   |
| --------------------- | ----------------------------- |
| `INVALID_CREDENTIALS` | Credenciales incorrectas      |
| `USER_EXISTS`         | Usuario ya existe             |
| `EMAIL_EXISTS`        | Email ya registrado           |
| `INVALID_TOKEN`       | Token JWT inválido o expirado |
| `EXPIRED_TOKEN`       | Token de reset expirado       |
| `LICENSE_EXPIRED`     | Licencia expirada             |
| `LICENSE_INACTIVE`    | Licencia inactiva             |
| `INVALID_FILE_TYPE`   | Tipo de archivo no permitido  |
| `FILE_TOO_LARGE`      | Archivo excede tamaño máximo  |
| `PROCESS_NOT_FOUND`   | Proceso no encontrado         |

---

##  Seguridad

### Rate Limiting

La API implementa rate limiting para prevenir abuso:

- **Login:** 5 intentos por minuto
- **Register:** 3 intentos por minuto
- **Otros endpoints:** 100 requests por minuto

### Validación de Archivos

- **Tamaño máximo:** 10 MB
- **Tipos permitidos:** Definidos por servicio
- **Escaneo de virus:** Recomendado en producción

### Tokens JWT

- **Expiración:** 7 días (configurable)
- **Algoritmo:** HS256
- **Almacenamiento:** LocalStorage (cliente)

---

## Ejemplos de Uso

### JavaScript/Fetch

```javascript
// Login
const login = async (usuario, contrasena) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, contrasena }),
  });
  const data = await response.json();
  localStorage.setItem("token", data.token);
  return data;
};

// Obtener licencias
const getLicencias = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch("/api/licencias", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await response.json();
};

// Subir archivo
const subirArchivo = async (file, licenciaId) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("licenciaId", licenciaId);

  const response = await fetch("/api/procesos/subir-archivo", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return await response.json();
};
```

### cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"juanperez","contrasena":"Password123!"}'

# Obtener licencias
curl http://localhost:3000/api/licencias \
  -H "Authorization: Bearer <tu-token>"

# Subir archivo
curl -X POST http://localhost:3000/api/procesos/subir-archivo \
  -H "Authorization: Bearer <tu-token>" \
  -F "file=@archivo.txt" \
  -F "licenciaId=1"
```

---

## Versionado

Versión actual: **v1**

La API sigue versionado semántico. Los cambios breaking se comunicarán con anticipación.

---

## Soporte

Para reportar problemas o sugerir mejoras:

- **Email:** edwinburbano473@gmail.com
- **GitHub Issues:** [github.com/edwin-bur17/innovasoft/issues](https://github.com)

---

**Última actualización:** 26 de noviembre de 2025
