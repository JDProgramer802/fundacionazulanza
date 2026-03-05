# Documentación Técnica - Fundación Azulanza

Bienvenido a la documentación técnica del proyecto Fundación Azulanza. Esta carpeta contiene información detallada sobre la arquitectura, configuración, despliegue y mantenimiento del sistema.

## Índice de Contenidos

1. [Arquitectura del Sistema](ARCHITECTURE.md)
   - Visión general
   - Diagramas de flujo
   - Esquema de Base de Datos (Supabase)
   - Políticas de Seguridad (RLS)
   - Almacenamiento (Storage)

2. [Guía de Desarrollo](DEVELOPMENT.md)
   - Requisitos previos
   - Instalación y Configuración
   - Variables de Entorno
   - Scripts disponibles
   - Estructura del Proyecto

3. [Guía de Despliegue](DEPLOYMENT.md)
   - Build de producción
   - Configuración en Supabase
   - Despliegue en Vercel/Netlify

4. [Inventario de Dependencias](DEPENDENCIES.md)
   - Librerías principales
   - Herramientas de desarrollo

5. [Glosario Técnico](GLOSSARY.md)
   - Definición de términos y conceptos clave

## Tecnologías Principales

- **Frontend**: React + Vite + TypeScript
- **Estilos**: Tailwind CSS + Lucide Icons
- **Backend/DB**: Supabase (PostgreSQL, Auth, Storage)
- **Routing**: React Router DOM
- **Estado Global**: React Context API

## Código Fuente

La documentación inline se encuentra directamente en los archivos fuente (`src/`). Los módulos principales documentados incluyen:

- **Core**: `src/lib/supabase.ts`, `src/context/*`
- **Hooks**: `src/hooks/*`
- **Admin**: `src/pages/Admin/*`
