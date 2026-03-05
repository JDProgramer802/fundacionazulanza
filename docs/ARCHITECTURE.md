# 🏗️ Arquitectura del Sistema - Fundación Azulanza

> **Documento Vivo**: Este diagrama y especificaciones reflejan la estructura actual de la plataforma.

## 🧭 Visión General

La plataforma opera bajo una arquitectura **Serverless** utilizando **React** en el frontend y **Supabase** como Backend-as-a-Service (BaaS). Esto nos permite escalar automáticamente y delegar la complejidad de la infraestructura (Auth, DB, Storage).

### 🧩 Diagrama de Componentes

```mermaid
graph TD
    subgraph "Frontend (Cliente)"
        Browser[Navegador Web]
        App[React SPA]
        Admin[Panel Admin]
    end

    subgraph "Backend (Supabase)"
        Auth[Autenticación (JWT)]
        DB[(PostgreSQL)]
        Storage[Object Storage]
        Edge[Edge Functions]
    end

    Browser -->|Visita| App
    App -->|Lee Datos Públicos| DB
    App -->|Carga Imágenes| Storage
    
    Browser -->|Login Admin| Admin
    Admin -->|Auth Request| Auth
    Admin -->|Gestión Total| DB
    Admin -->|Upload| Storage
```

---

## 🗄️ Esquema de Base de Datos

Utilizamos **PostgreSQL** relacional. A continuación, las entidades principales:

### 1. Gestión de Contenido (CMS)

| Tabla | Descripción | Permisos (RLS) |
| :--- | :--- | :--- |
| `pages` | Páginas dinámicas (ej. 'Nosotros'). | 🟢 Público (Lectura) <br> 🔴 Admin (CRUD) |
| `site_settings` | Configuración global (Logo, Redes). | 🟢 Público (Lectura) <br> 🔴 Admin (CRUD) |
| `hero_slides` | Imágenes y textos del carrusel Home. | 🟢 Público (Lectura) <br> 🔴 Admin (CRUD) |
| `gallery` | Imágenes de eventos y actividades. | 🟢 Público (Lectura) <br> 🔴 Admin (CRUD) |

### 2. Operaciones & Usuarios

| Tabla | Descripción | Permisos (RLS) |
| :--- | :--- | :--- |
| `donations` | Registro de donaciones y pagos. | 🟡 Público (Crear) <br> 🔴 Admin (Lectura Total) |
| `volunteers` | Solicitudes de voluntariado. | 🟡 Público (Crear) <br> 🔴 Admin (Gestión) |
| `counseling_requests` | Solicitudes de citas psicológicas. | 🟡 Público (Crear) <br> 🔴 Admin (Gestión) |
| `profiles` | Perfiles extendidos de usuarios (Admin). | 🔴 Admin (CRUD) |

---

## 🔐 Seguridad y Acceso (RLS)

Implementamos **Row Level Security (RLS)** para garantizar que los datos estén protegidos a nivel de base de datos, no solo en la aplicación.

*   **Público (Anon)**: Puede leer contenido publicado (`pages`, `gallery`) e insertar solicitudes (`volunteers`, `contact`). No puede modificar ni eliminar nada.
*   **Autenticado (Admin)**: Tiene acceso total (CRUD) a todas las tablas y buckets de almacenamiento.

---

## 📦 Almacenamiento (Storage)

Buckets configurados para manejar archivos multimedia:

1.  **`gallery`** 🖼️
    *   **Uso**: Imágenes de eventos, jornadas y actividades.
    *   **Política**: Pública lectura, escritura solo Admin.
    *   **Formatos**: JPG, PNG, WEBP.

2.  **`assets`** 📂
    *   **Uso**: Recursos estáticos del sistema (Logo, Favicon, Documentos PDF).
    *   **Política**: Pública lectura, escritura solo Admin.

---

## 🔄 Flujos de Datos Críticos

### 1. Proceso de Donación
1.  Usuario llena formulario en `/donations`.
2.  Frontend valida datos.
3.  Se inserta registro en `donations` (Estado: 'Pendiente').
4.  (Futuro) Webhook de pasarela actualiza estado a 'Completado'.

### 2. Publicación de Contenido
1.  Admin sube imagen a Storage -> Obtiene URL pública.
2.  Admin crea registro en `gallery` con la URL.
3.  Frontend consulta `gallery` y renderiza la imagen optimizada.
