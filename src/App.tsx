import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from './components/Layout/AdminLayout';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import About from './pages/About';
import CounselingAdmin from './pages/Admin/CounselingAdmin';
import DashboardHome from './pages/Admin/DashboardHome';
import DonationsAdmin from './pages/Admin/DonationsAdmin';
import GalleryAdmin from './pages/Admin/GalleryAdmin';
import HeroAdmin from './pages/Admin/HeroAdmin';
import AdminLogin from './pages/Admin/Login';
import AdminRegister from './pages/Admin/Register';
import UsersAdmin from './pages/Admin/UsersAdmin';
import VolunteersAdmin from './pages/Admin/VolunteersAdmin';
import Contact from './pages/Contact';
import Counseling from './pages/Counseling';
import Donations from './pages/Donations';
import Gallery from './pages/Gallery';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Volunteers from './pages/Volunteers';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/nosotros" element={<Layout><About /></Layout>} />
        <Route path="/asesoria" element={<Layout><Counseling /></Layout>} />
        <Route path="/donaciones" element={<Layout><Donations /></Layout>} />
        <Route path="/galeria" element={<Layout><Gallery /></Layout>} />
        <Route path="/voluntarios" element={<Layout><Volunteers /></Layout>} />
        <Route path="/contacto" element={<Layout><Contact /></Layout>} />

        {/* 404 Route */}
        <Route path="*" element={<Layout><NotFound /></Layout>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
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
    </Router>
  );
}

export default App;
