# 🚀 Guía de Despliegue (Deployment)

Esta guía detalla cómo llevar la aplicación **Fundación Azulanza** a producción. Al ser una SPA (Single Page Application) construida con Vite, se puede desplegar en cualquier host de archivos estáticos.

---

## ✅ Checklist Pre-Despliegue

Antes de desplegar, verifica:

- [ ] **Variables de Entorno**: ¿Tienes las claves de Supabase de producción?
- [ ] **Build Local**: ¿El comando `npm run build` se ejecuta sin errores?
- [ ] **Rutas**: ¿Has configurado las redirecciones para SPA (evitar errores 404 al recargar)?
- [ ] **Optimización**: ¿Las imágenes en `src/assets` están optimizadas?

---

## ☁️ Opción 1: Despliegue en Netlify (Recomendado)

Netlify es excelente para proyectos React + Vite.

1.  **Conectar Repositorio**:
    *   Inicia sesión en Netlify.
    *   "Add new site" -> "Import an existing project".
    *   Selecciona GitHub y busca el repositorio `fundacionazulanza`.

2.  **Configuración de Build**:
    *   **Build command**: `npm run build`
    *   **Publish directory**: `dist`

3.  **Variables de Entorno**:
    *   Ve a "Site settings" -> "Environment variables".
    *   Agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.

4.  **Redirecciones SPA**:
    *   Asegúrate de que exista el archivo `public/_redirects` con el contenido:
        ```text
        /*  /index.html  200
        ```
    *   *Nota: Si no existe, créalo en tu repositorio.*

---

## ▲ Opción 2: Despliegue en Vercel

1.  **Importar Proyecto**:
    *   Desde el dashboard de Vercel, "Add New..." -> "Project".
    *   Importa desde GitHub.

2.  **Configuración**:
    *   Framework Preset: **Vite**.
    *   Root Directory: `./`

3.  **Variables**:
    *   En la sección "Environment Variables", añade las claves de Supabase.

4.  **Deploy**:
    *   Clic en "Deploy". Vercel detectará automáticamente la configuración para SPA.

---

## ⚡ Configuración de Supabase (Producción)

Para que el login y las redirecciones funcionen en el dominio final:

1.  Ve a tu Dashboard de Supabase -> **Authentication** -> **URL Configuration**.
2.  **Site URL**: Pon la URL principal de tu sitio (ej. `https://fundacion-azulanza.netlify.app`).
3.  **Redirect URLs**: Añade todas las URLs donde el usuario pueda ser redirigido tras el login:
    *   `https://fundacion-azulanza.netlify.app/**`
    *   `http://localhost:5173/**` (para seguir probando en local)

---

## 🔄 Integración Continua (CI/CD)

Tanto Netlify como Vercel se integran con GitHub.
*   Cada vez que hagas un **Push** a la rama `main`, se disparará un nuevo despliegue automático.
*   Las Pull Requests generarán "Preview Deployments" para probar cambios antes de fusionar.
