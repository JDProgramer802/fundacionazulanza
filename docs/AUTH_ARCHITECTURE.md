# Arquitectura de Autenticación y Autorización (OAuth 2.0 / OIDC)

## Visión General
Este documento detalla la implementación del sistema de autenticación de la Fundación Azulanza. La solución utiliza **Supabase Auth** como el motor de identidad (Identity Provider - IdP), que implementa estrictamente los protocolos OAuth 2.0 y OpenID Connect (OIDC).

Esta arquitectura cumple con los requisitos de seguridad de nivel empresarial, incluyendo almacenamiento seguro de credenciales, rotación de tokens y protección contra ataques comunes (OWASP Top 10).

## 1. Servidor de Autorización Interno
Aunque utilizamos Supabase como backend, el flujo de autorización se comporta como un servicio interno gracias a la integración profunda con la base de datos PostgreSQL y las políticas RLS.

- **Protocolo**: OAuth 2.0 con PKCE (Proof Key for Code Exchange) para clientes públicos (SPA).
- **Flujo**: Authorization Code Flow + PKCE.
- **Tokens**:
  - **Access Token (JWT)**: Vida corta (1 hora). Firmado con HS256/RS256. Contiene claims de usuario y rol.
  - **Refresh Token**: Vida larga. Opaco. Se usa para rotar el Access Token sin re-autenticar al usuario.

## 2. Componentes del Sistema

### A. Cliente HTTP Robusto (`src/lib/apiClient.ts`)
Hemos implementado un cliente HTTP personalizado que actúa como un interceptor para todas las peticiones salientes.
- **Inyección de Token**: Automáticamente añade `Authorization: Bearer <token>` a las cabeceras.
- **Manejo de Errores 401**: Intercepta respuestas de "No Autorizado".
- **Refresh Silencioso**: Intenta renovar el token automáticamente antes de fallar la petición o redirigir al login.

### B. UI de Autenticación Embebida
- **Login (`/admin/login`)**: Interfaz limpia y segura para inicio de sesión.
- **Registro (`/admin/register`)**: Formulario de alta para nuevos administradores con validación de contraseña fuerte.
- **Gestión (`/admin/usuarios`)**: Panel para visualizar y auditar administradores.

### C. Almacenamiento Seguro
- **Credenciales**: Las contraseñas NUNCA se almacenan en texto plano. Supabase utiliza el algoritmo **Argon2id**, el estándar actual recomendado por OWASP para hashing de contraseñas.
- **Tokens en Cliente**: Se almacenan en `localStorage` (por defecto de supabase-js) con opción de migrar a `Secure Cookies` si se implementa un backend proxy.

## 3. Flujos de Seguridad

### Registro y Login
1. El usuario ingresa credenciales en el frontend.
2. Se envían vía HTTPS (TLS 1.2+) al endpoint `/auth/v1/token` de Supabase.
3. El servidor valida y retorna `access_token` y `refresh_token`.
4. El cliente guarda los tokens y redirige al dashboard.

### Rotación de Tokens (Auto-Refresh)
1. El `apiClient` detecta un token próximo a expirar o un error 401.
2. Llama al endpoint `/auth/v1/token?grant_type=refresh_token`.
3. Supabase invalida el refresh token anterior (Rotation Family) y emite uno nuevo.
4. Esto previene ataques de replay de tokens robados.

### Logout (Revocación)
1. El usuario solicita cerrar sesión.
2. Se llama a `/auth/v1/logout`.
3. El servidor revoca el refresh token activo.
4. El cliente limpia el almacenamiento local y redirige a `/admin/login`.

## 4. Cumplimiento OWASP

| Riesgo OWASP | Mitigación Implementada |
|--------------|-------------------------|
| **Broken Access Control** | Políticas RLS (Row Level Security) en PostgreSQL aseguran que solo admins vean datos sensibles. |
| **Cryptographic Failures** | Hashing con Argon2id. Tráfico forzado sobre HTTPS. |
| **Injection** | Uso de parámetros preparados en todas las consultas SQL (vía postgREST). |
| **Security Logging** | Supabase registra eventos de autenticación (Login, Refresh, Logout). |
| **Vulnerable Components** | Dependencias auditadas vía `npm audit`. |

## 5. Guía de Mantenimiento

### Añadir nuevos scopes/roles
Para añadir nuevos roles, modificar la tabla `profiles` y actualizar las políticas RLS en `supabase_setup.sql`.

```sql
CREATE POLICY "Solo SuperAdmins" ON sensitive_table
FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');
```

### Rotación de Secretos
Si se compromete la `SUPABASE_SERVICE_ROLE_KEY`, debe regenerarse inmediatamente desde el dashboard de Supabase y actualizarse en las variables de entorno del despliegue.
