import { useState } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { supabase } from '../../lib/supabase';

const CounselingForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    modality: 'Virtual',
    date: '',
    time: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('counseling_requests').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          modality: formData.modality,
          date: formData.date,
          time: formData.time,
          message: formData.message,
          status: 'pending'
        }
      ]);

      if (error) throw error;

      toast.success('¡Solicitud enviada! Te confirmaremos la cita pronto.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        modality: 'Virtual',
        date: '',
        time: '',
        message: ''
      });
    } catch (error: any) {
      toast.error('Error al enviar solicitud: ' + error.message);
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
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-pink focus:border-transparent outline-none transition-all"
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
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-pink focus:border-transparent outline-none transition-all"
            placeholder="+57 300..."
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Modalidad</label>
          <select
            name="modality"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-pink focus:border-transparent outline-none transition-all bg-white"
            value={formData.modality}
            onChange={handleChange}
          >
            <option value="Virtual">Virtual</option>
            <option value="Presencial">Presencial</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1">Correo Electrónico</label>
        <input
          type="email"
          name="email"
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-pink focus:border-transparent outline-none transition-all"
          placeholder="tucorreo@ejemplo.com"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Fecha Preferida</label>
          <input
            type="date"
            name="date"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-pink focus:border-transparent outline-none transition-all"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Hora Preferida</label>
          <input
            type="time"
            name="time"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-pink focus:border-transparent outline-none transition-all"
            value={formData.time}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1">Motivo de Consulta (Breve)</label>
        <textarea
          name="message"
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-pink focus:border-transparent outline-none transition-all resize-none"
          placeholder="Opcional..."
          value={formData.message}
          onChange={handleChange}
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-primary-pink text-white rounded-xl font-bold text-lg hover:bg-pink-600 transition-all shadow-lg hover:shadow-pink-300 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Procesando...
          </>
        ) : (
          <>
            <Calendar size={20} />
            Solicitar Cita
          </>
        )}
      </button>
    </form>
  );
};

export default CounselingForm;
