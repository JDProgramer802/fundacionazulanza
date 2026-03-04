import { HandHeart, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '../../lib/supabase';

const VolunteerForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    availability: 'Fines de semana',
    skills: '',
    motivation: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('volunteers').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          availability: formData.availability,
          skills: formData.skills,
          motivation: formData.motivation,
          status: 'pending'
        }
      ]);

      if (error) throw error;

      toast.success('¡Registro exitoso! Gracias por querer ser parte del equipo.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        availability: 'Fines de semana',
        skills: '',
        motivation: ''
      });
    } catch (error: any) {
      toast.error('Error al registrar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1">Nombre Completo</label>
        <input
          type="text"
          name="name"
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all"
          placeholder="Tu nombre"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Teléfono</label>
          <input
            type="tel"
            name="phone"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all"
            placeholder="+57 300..."
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Disponibilidad</label>
          <select
            name="availability"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all bg-white"
            value={formData.availability}
            onChange={handleChange}
          >
            <option value="Fines de semana">Fines de semana</option>
            <option value="Días de semana">Días de semana</option>
            <option value="Flexible">Flexible</option>
            <option value="Por horas">Por horas</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1">Correo Electrónico</label>
        <input
          type="email"
          name="email"
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all"
          placeholder="tucorreo@ejemplo.com"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1">Habilidades / Profesión</label>
        <input
          type="text"
          name="skills"
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all"
          placeholder="Ej: Psicología, Diseño, Logística..."
          value={formData.skills}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1">¿Por qué quieres ser voluntario?</label>
        <textarea
          name="motivation"
          rows={3}
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all resize-none"
          placeholder="Cuéntanos brevemente..."
          value={formData.motivation}
          onChange={handleChange}
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-primary-blue text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-300 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Enviando...
          </>
        ) : (
          <>
            <HandHeart size={20} />
            Quiero ser Voluntario
          </>
        )}
      </button>
    </form>
  );
};

export default VolunteerForm;
