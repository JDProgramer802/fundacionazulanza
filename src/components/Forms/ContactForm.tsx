import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular envío
    setTimeout(() => {
      setLoading(false);
      toast.success('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Teléfono</label>
          <input
            type="tel"
            name="phone"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all"
            placeholder="+57 300 123 4567"
            value={formData.phone}
            onChange={handleChange}
          />
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
        <label className="text-sm font-bold text-gray-700 ml-1">Asunto</label>
        <select
          name="subject"
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all bg-white"
          value={formData.subject}
          onChange={handleChange}
        >
          <option value="">Selecciona un asunto</option>
          <option value="Información General">Información General</option>
          <option value="Voluntariado">Voluntariado</option>
          <option value="Donaciones">Donaciones</option>
          <option value="Alianzas">Alianzas Corporativas</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1">Mensaje</label>
        <textarea
          name="message"
          required
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all resize-none"
          placeholder="Escribe tu mensaje aquí..."
          value={formData.message}
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
            <Send size={20} />
            Enviar Mensaje
          </>
        )}
      </button>
    </form>
  );
};

export default ContactForm;
