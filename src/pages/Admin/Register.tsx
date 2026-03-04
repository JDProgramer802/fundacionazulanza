import { motion } from 'framer-motion';
import { KeyRound, Loader2, ShieldAlert, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import loginBg from '../../assets/images/login-bg.jpg';
import logo from '../../assets/images/logo-azulanza.png';
import { supabase } from '../../lib/supabase';

const AdminRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: email.split('@')[0], // Default name from email
            role: 'admin' // Default role
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        toast.success('¡Registro exitoso! Bienvenido al panel.');
        // Si el usuario se crea y auto-confirma, Supabase ya inicia la sesión.
        // Redirigimos directamente al dashboard.
        navigate('/admin/dashboard');
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={loginBg} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/20 via-transparent to-primary-pink/20"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-8 space-y-8 bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50"
      >
        <div className="text-center">
          <img src={logo} alt="Fundación Azulanza" className="w-24 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Crear Cuenta Administrativa</h1>
          <div className="flex items-center justify-center gap-2 mt-2 text-amber-600 bg-amber-50 py-2 px-4 rounded-lg text-xs border border-amber-200">
            <ShieldAlert size={14} />
            <span>Acceso restringido a personal autorizado</span>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleRegister}>
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-600 ml-1">Correo Institucional</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue outline-none transition-all"
              placeholder="nombre@azulanza.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-600 ml-1">Contraseña</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue outline-none transition-all"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-600 ml-1">Confirmar Contraseña</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue outline-none transition-all"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-blue text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-300 flex items-center justify-center gap-3 mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Registrando...
              </>
            ) : (
              <>
                <UserPlus size={20} />
                Crear Cuenta
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <Link to="/admin/login" className="text-sm text-primary-blue hover:underline font-medium">
              ¿Ya tienes cuenta? Inicia sesión aquí
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminRegister;
