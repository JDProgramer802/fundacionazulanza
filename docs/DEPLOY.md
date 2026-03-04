# Guía de Despliegue en Vercel

Esta aplicación está optimizada para desplegarse en [Vercel](https://vercel.com). Sigue estos pasos para poner tu sitio en línea.

## Prerrequisitos

1. Tener el código subido a un repositorio de GitHub, GitLab o Bitbucket.
2. Tener una cuenta en Vercel.
3. Tener tu proyecto de Supabase configurado.

## Pasos para Desplegar

1. **Iniciar sesión en Vercel** y hacer clic en "Add New..." -> "Project".
2. **Importar repositorio**: Selecciona el repositorio `fundacionazulanza`.
3. **Configurar Proyecto**:
   - **Framework Preset**: Vite (Vercel lo detectará automáticamente).
   - **Root Directory**: `./` (o déjalo por defecto).
   - **Build Command**: `npm run build` (o déjalo por defecto).
   - **Output Directory**: `dist` (o déjalo por defecto).

4. **Variables de Entorno (Environment Variables)**:
   Es CRÍTICO que agregues las siguientes variables de entorno en la sección "Environment Variables" de Vercel. Copia los valores de tu archivo `.env` local o de tu dashboard de Supabase.

   | Nombre | Valor (Ejemplo) |
   |--------|-----------------|
   | `VITE_SUPABASE_URL` | `https://tu-proyecto.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI...` |

5. **Desplegar**: Haz clic en "Deploy".

## Configuración Adicional (Ya incluida)

El proyecto ya incluye un archivo `vercel.json` en la raíz con la siguiente configuración para asegurar que el enrutamiento de la SPA (React Router) funcione correctamente al recargar páginas:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Solución de Problemas Comunes

- **Error 404 al recargar**: Si al recargar una página interna (ej: `/admin/login`) ves un error 404 de Vercel, asegúrate de que el archivo `vercel.json` esté en la raíz del repositorio.
- **Errores de Build**: Si el despliegue falla por errores de TypeScript (`tsc`), corrige los errores localmente ejecutando `npm run build` antes de subir los cambios.
- **Variables de Entorno**: Si la app carga pero no puedes iniciar sesión o ver datos, verifica que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` estén configuradas correctamente en Vercel.
