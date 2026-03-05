# 💻 Guía de Desarrollo

> **Bienvenido al equipo!** Esta guía te ayudará a configurar tu entorno local y entender el flujo de trabajo para contribuir al proyecto.

## 🛠️ Requisitos Previos

Asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v18 o superior)
- [Git](https://git-scm.com/)
- Un editor de código (Recomendamos **VS Code**)

---

## 🚀 Inicio Rápido

Sigue estos pasos para levantar el proyecto en menos de 5 minutos:

### 1. Clonar el repositorio
```bash
git clone https://github.com/JDProgramer802/fundacionazulanza.git
cd fundacionazulanza
```

### 2. Instalar dependencias
Usamos `npm` para gestionar paquetes.
```bash
npm install
```

### 3. Configurar Variables de Entorno
Duplica el archivo `.env.example` (si existe) o crea uno nuevo `.env`:

```env
# URL de tu proyecto Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co

# Clave Anónima (Pública)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Ejecutar en local
```bash
npm run dev
```
> El servidor iniciará en `http://localhost:5173`.

---

## 📂 Estructura de Directorios Clave

Entiende dónde va cada cosa para mantener el orden:

| Ruta | Descripción |
| :--- | :--- |
| `src/components/UI` | **Átomos y Moléculas**: Botones, Inputs, Cards reutilizables. |
| `src/components/Layout` | **Organismos**: Navbar, Footer, SidebarAdmin. |
| `src/pages/Admin` | **Vistas Privadas**: Gestión de contenido (CMS). |
| `src/pages/Public` | **Vistas Públicas**: Home, Nosotros, Contacto. |
| `src/context` | **Estado Global**: `AuthContext` (Sesión), `ThemeContext` (Apariencia). |
| `src/lib` | **Configuración**: Cliente Supabase, utilidades API. |

---

## 🧪 Scripts Disponibles

| Comando | Acción |
| :--- | :--- |
| `npm run dev` | Inicia servidor de desarrollo con HMR (Hot Module Replacement). |
| `npm run build` | Compila TypeScript y genera archivos optimizados en `/dist`. |
| `npm run lint` | Analiza el código en busca de errores y problemas de estilo. |
| `npm run preview` | Sirve la versión de producción localmente para pruebas. |

---

## 💡 Buenas Prácticas

1.  **Componentes**: Usa componentes funcionales y Hooks. Evita clases.
2.  **Estilos**: Utiliza clases de **Tailwind CSS**. Evita CSS modules a menos que sea estrictamente necesario.
3.  **Commits**: Usa [Conventional Commits](https://www.conventionalcommits.org/) (ej. `feat: agregar slider`, `fix: corregir login`).
4.  **Ramas**: Trabaja en ramas separadas (`feature/nueva-funcionalidad`) y haz PR a `main`.

---

## 🐛 Solución de Problemas (Troubleshooting)

<details>
<summary><b>❌ Error: "VITE_SUPABASE_URL is not defined"</b></summary>

*   **Causa**: No has creado el archivo `.env` o no has reiniciado el servidor.
*   **Solución**: Crea el archivo `.env` con las credenciales y ejecuta `npm run dev` nuevamente.
</details>

<details>
<summary><b>❌ Error de Tipos TypeScript al construir</b></summary>

*   **Causa**: Hay discrepancias entre los tipos esperados y los datos.
*   **Solución**: Ejecuta `npm run build` localmente para ver los errores específicos y corrígelos antes de subir cambios.
</details>
