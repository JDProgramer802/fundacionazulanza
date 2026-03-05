# 📖 Glosario Técnico

> Diccionario de términos técnicos utilizados en el proyecto **Fundación Azulanza**.

---

## A

### **API (Application Programming Interface)**
Conjunto de reglas que permite que el Frontend (React) se comunique con el Backend (Supabase).

### **AuthContext**
Componente de React que envuelve la aplicación y provee la información del usuario logueado a cualquier parte del sistema que lo necesite.

---

## B

### **Bucket**
Contenedor virtual en **Supabase Storage** donde se guardan archivos.
*   `gallery`: Para fotos de eventos.
*   `assets`: Para logos y documentos estáticos.

---

## C

### **CMS (Content Management System)**
Panel de administración construido a medida que permite a los usuarios no técnicos gestionar el contenido del sitio (noticias, sliders, textos).

### **Componente**
Pieza de código reutilizable en React (ej. un Botón, una Tarjeta, el Navbar).

---

## H

### **Hook**
Función especial de React (comienza con `use`) que permite "enganchar" funcionalidades.
*   `useState`: Para guardar datos temporales.
*   `useEffect`: Para ejecutar código al cargar la página.
*   `useAuth`: Nuestro hook personalizado para manejar sesiones.

---

## R

### **RLS (Row Level Security)**
Sistema de seguridad de PostgreSQL que decide quién puede ver o editar cada fila de una tabla. Es nuestra principal barrera de seguridad.

### **Responsive (Responsivo)**
Capacidad del diseño web de adaptarse automáticamente al tamaño de la pantalla (Móvil, Tablet, PC).

---

## S

### **SPA (Single Page Application)**
Tipo de aplicación web que carga una sola página HTML y actualiza el contenido dinámicamente, brindando una experiencia fluida similar a una app nativa.

### **Slug**
Parte final de una URL que identifica una página de forma legible.
*   Ejemplo: en `azulanza.org/p/nuestra-historia`, el slug es `nuestra-historia`.

### **Supabase**
La plataforma "todo en uno" que usamos como backend. Nos da Base de Datos, Autenticación y Almacenamiento.

---

## T

### **Tailwind CSS**
Herramienta de diseño que nos permite dar estilo al sitio usando clases predefinidas (ej. `text-blue-500`, `p-4`) directamente en el HTML.

### **TypeScript**
Versión mejorada de JavaScript que añade "tipos" (reglas estrictas) para evitar errores comunes de programación antes de ejecutar el código.
