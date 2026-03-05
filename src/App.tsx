import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from './components/Layout/AdminLayout';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from './context/ThemeContext';
import About from './pages/About';
import CounselingAdmin from './pages/Admin/CounselingAdmin';
import DashboardHome from './pages/Admin/DashboardHome';
import DonationsAdmin from './pages/Admin/DonationsAdmin';
import GalleryAdmin from './pages/Admin/GalleryAdmin';
import HeroAdmin from './pages/Admin/HeroAdmin';
import AdminLogin from './pages/Admin/Login';
import PagesAdmin from './pages/Admin/PagesAdmin';
import AdminRegister from './pages/Admin/Register';
import SettingsAdmin from './pages/Admin/SettingsAdmin';
import UsersAdmin from './pages/Admin/UsersAdmin';
import VolunteersAdmin from './pages/Admin/VolunteersAdmin';
import Contact from './pages/Contact';
import Counseling from './pages/Counseling';
import Donations from './pages/Donations';
import Gallery from './pages/Gallery';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Page from './pages/Page';
import Volunteers from './pages/Volunteers';

function App() {
  return (
    <Router>
      {/* Proveedor de tema para modo oscuro/claro */}
      <ThemeProvider>
        <ScrollToTop />
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />

        <Routes>
          {/* =================================================================
              RUTAS PÚBLICAS
              Utilizan el Layout principal (Header + Footer)
             ================================================================= */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/nosotros" element={<Layout><About /></Layout>} />
          <Route path="/asesoria" element={<Layout><Counseling /></Layout>} />
          <Route path="/donaciones" element={<Layout><Donations /></Layout>} />
          <Route path="/galeria" element={<Layout><Gallery /></Layout>} />

          {/* Ruta dinámica para páginas creadas desde el CMS */}
          <Route path="/p/:slug" element={<Layout><Page /></Layout>} />

          <Route path="/voluntarios" element={<Layout><Volunteers /></Layout>} />
          <Route path="/contacto" element={<Layout><Contact /></Layout>} />

          {/* Ruta 404 para páginas no encontradas */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />

          {/* =================================================================
              RUTAS ADMINISTRATIVAS
              Requieren autenticación (ProtectedRoute) y usan AdminLayout
             ================================================================= */}

          {/* Autenticación Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          {/* Panel Protegido */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/admin/dashboard"
              element={
                <AdminLayout>
                  <DashboardHome />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/paginas"
              element={
                <AdminLayout>
                  <PagesAdmin />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/ajustes"
              element={
                <AdminLayout>
                  <SettingsAdmin />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/asesorias"
              element={
                <AdminLayout>
                  <CounselingAdmin />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/hero"
              element={
                <AdminLayout>
                  <HeroAdmin />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/galeria"
              element={
                <AdminLayout>
                  <GalleryAdmin />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/donaciones"
              element={
                <AdminLayout>
                  <DonationsAdmin />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/voluntarios"
              element={
                <AdminLayout>
                  <VolunteersAdmin />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/usuarios"
              element={
                <AdminLayout>
                  <UsersAdmin />
                </AdminLayout>
              }
            />
          </Route>
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
