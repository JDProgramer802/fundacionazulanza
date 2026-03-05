# 📦 Inventario de Dependencias

> Listado de las herramientas y librerías que dan vida al proyecto.

## 🧱 Dependencias de Producción (`dependencies`)

Librerías esenciales que se empaquetan con la aplicación final.

| Paquete | Versión Aprox. | Propósito | Categoría |
| :--- | :--- | :--- | :--- |
| **react** | `^18.2` | Biblioteca Core de UI. | Core |
| **react-router-dom** | `^6.20` | Manejo de rutas y navegación SPA. | Core |
| **@supabase/supabase-js** | `^2.39` | Cliente JS para Backend Supabase. | Data |
| **tailwindcss** | `^3.4` | Framework de estilos CSS. | UI |
| **framer-motion** | `^10.16` | Animaciones complejas y transiciones. | UI |
| **lucide-react** | `^0.294` | Paquete de iconos SVG. | UI |
| **react-toastify** | `^9.1` | Notificaciones flotantes (Toasts). | UI |
| **swiper** | `^11.0` | Carruseles y sliders táctiles. | UI |
| **date-fns** | `^2.30` | Formateo y manipulación de fechas. | Util |
| **jspdf** | `^2.5` | Generación de PDFs en cliente. | Util |
| **xlsx** | `^0.18` | Exportación a Excel. | Util |

---

## 🛠️ Dependencias de Desarrollo (`devDependencies`)

Herramientas para construir, probar y mantener el código.

| Paquete | Propósito |
| :--- | :--- |
| **vite** | Empaquetador y servidor de desarrollo ultrarrápido. |
| **typescript** | Lenguaje y compilador. |
| **eslint** | Linter para encontrar errores de código. |
| **postcss** | Procesador de CSS (necesario para Tailwind). |
| **autoprefixer** | Añade prefijos de navegador al CSS automáticamente. |

---

## 🔄 Gestión de Paquetes

### Instalar una nueva librería
```bash
npm install nombre-paquete
```

### Instalar una herramienta de desarrollo
```bash
npm install -D nombre-paquete
```

### Actualizar dependencias
```bash
npm update
```

### Auditoría de seguridad
```bash
npm audit
```
