import { AnimatePresence, motion } from 'framer-motion';
import { Search, Shield, UserPlus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Skeleton from '../../components/UI/Skeleton';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

const UsersAdmin = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      const err = error as Error;
      toast.error('Error al cargar usuarios: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(p =>
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Administradores</h1>
          <p className="text-gray-500">Administra quién tiene acceso al panel de control.</p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary-blue text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
        >
          <UserPlus size={20} />
          Nuevo Administrador
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar por nombre o rol..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none w-full bg-white shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-6 space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="w-32 h-4" />
                  <Skeleton className="w-24 h-3" />
                </div>
              </div>
              <Skeleton className="w-20 h-6 rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Última Actividad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProfiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-primary-blue">
                          {profile.full_name?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{profile.full_name || 'Sin nombre'}</p>
                          <p className="text-sm text-gray-500">ID: {profile.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-primary-blue text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1 w-fit">
                        <Shield size={12} />
                        {profile.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(profile.updated_at || '').toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative"
            >
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 text-primary-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Crear Nuevo Administrador</h2>
                <p className="text-gray-500 mt-2 text-sm">
                  Por seguridad, para crear usuarios que puedan acceder al panel, utiliza el dashboard de Supabase (Authentication &gt; Users).
                </p>
              </div>

              <div className="space-y-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                <p className="font-bold">Guía de pasos:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Ve a tu dashboard de Supabase.</li>
                  <li>Sección <strong>Authentication</strong> &gt; <strong>Users</strong>.</li>
                  <li>Clic en <strong>Add User</strong> &gt; <strong>Create new user</strong>.</li>
                  <li>Ingresa el email y la contraseña.</li>
                  <li>¡Listo! El perfil se creará automáticamente aquí.</li>
                </ol>
              </div>

              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="w-full mt-6 py-3 bg-primary-blue text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg"
              >
                Entendido
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UsersAdmin;
