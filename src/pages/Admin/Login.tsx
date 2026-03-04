import { motion } from 'framer-motion';
import { KeyRound, Loader2, LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import loginBg from '../../assets/images/login-bg.jpg';
import logo from '../../assets/images/logo-azulanza.png';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success('¡Bienvenido de vuelta!');
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  if (session) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={loginBg} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/20 via-transparent to-primary-pink/20"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-8 space-y-8 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50"
      >
        <div className="text-center">
          <img src={logo} alt="Fundación Azulanza" className="w-32 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Acceso Administrativo</h1>
          <p className="text-gray-500">Ingresa tus credenciales para continuar</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600">Correo Electrónico</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue outline-none transition-all"
              placeholder="admin@azulanza.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600">Contraseña</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-blue text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-300 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Verificando...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Ingresar
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <Link to="/admin/register" className="text-sm text-primary-blue hover:underline font-medium">
              ¿No tienes cuenta? Regístrate como administrador
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
