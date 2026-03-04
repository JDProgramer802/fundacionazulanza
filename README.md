# 💙 Fundación Azulanza - Plataforma Web

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

Plataforma oficial de la Fundación Azulanza, dedicada a brindar apoyo psicológico y ayuda humanitaria. Este sistema gestiona donaciones, voluntariado y solicitudes de asesoría a través de una interfaz moderna y un panel administrativo seguro.

---

## 🚀 Características Principales

### 🌐 Portal Público
- **Diseño Moderno & Responsivo**: Animaciones suaves con Framer Motion y diseño adaptable a cualquier dispositivo.
- **Hero Slider Dinámico**: Gestionado desde el panel administrativo.
- **Secciones Interactivas**: Testimonios, galería de impacto y estadísticas en tiempo real.
- **Formularios Integrados**: Solicitud de asesoría, registro de voluntarios y contacto.

### 🛡️ Panel Administrativo
- **Autenticación Segura**: Sistema OAuth 2.0 con Supabase (PKCE, Argon2id).
- **Gestión de Contenidos**: CRUD completo para el Slider del Home, Galería y Testimonios.
- **Gestión de Solicitudes**: Visualización y administración de voluntarios y asesorías.
- **Control de Acceso**: Roles y permisos para administradores.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend Core**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS + Lucide React (Iconos)
- **Animaciones**: Framer Motion
- **Backend / Database**: Supabase (PostgreSQL + Auth + Storage)
- **Componentes UI**: Swiper (Carruseles), React Toastify (Notificaciones), React Calendar

---

## 📦 Instalación y Despliegue

### Requisitos Previos
- Node.js (v18+)
- Cuenta en Supabase (para backend)

### Pasos
1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/fundacionazulanza.git
   cd fundacionazulanza
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno**
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_clave_anonima
   ```

4. **Iniciar Servidor de Desarrollo**
   ```bash
   npm run dev
   ```

---

## 📂 Estructura del Proyecto

```bash
src/
├── assets/          # Imágenes y recursos estáticos
├── components/      # Componentes reutilizables (UI, Layout)
├── context/         # Contextos de React (AuthContext)
├── hooks/           # Custom Hooks (useAuth, etc.)
├── lib/             # Configuraciones de librerías (Supabase, API Client)
├── pages/           # Vistas de la aplicación
│   ├── Admin/       # Vistas protegidas del panel administrativo
│   └── ...          # Vistas públicas (Home, About, etc.)
├── types/           # Definiciones de tipos TypeScript
└── utils/           # Funciones de utilidad
```

---

## 🔐 Seguridad

- **Protección de Rutas**: Componentes `ProtectedRoute` aseguran que solo usuarios autenticados accedan al panel.
- **Interceptor HTTP**: Cliente API personalizado (`apiClient.ts`) que inyecta tokens de autorización automáticamente.
- **Validación de Datos**: Formularios tipados y validados antes del envío.

---

## 🎨 Tipografía y Diseño

El proyecto utiliza la fuente **Quicksand** (Google Fonts) para una apariencia amigable y moderna, complementada con una paleta de colores institucional:

- **Azul Principal**: `#0356CB` (Confianza, Serenidad)
- **Rosa Acento**: `#EE84B5` (Empatía, Calidez)

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor, abre un issue o envía un pull request para mejoras.

1. Haz un Fork del proyecto.
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`).
3. Haz Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`).
4. Haz Push a la rama (`git push origin feature/AmazingFeature`).
5. Abre un Pull Request.

---

&copy; 2024 Fundación Azulanza. Todos los derechos reservados.
