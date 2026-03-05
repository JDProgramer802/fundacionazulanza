import { motion } from 'framer-motion';
import { FileText, Loader2, Mail, MessageSquare, Phone, Send, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const inputClasses = (fieldName: string) => `
    w-full px-12 py-4 bg-gray-50 border-2 rounded-xl outline-none transition-all duration-300
    ${focusedField === fieldName
      ? 'border-blue-500 bg-white shadow-[0_0_20px_rgba(59,130,246,0.15)]'
      : 'border-transparent hover:bg-gray-100 hover:border-gray-200'}
  `;

  const labelClasses = "text-sm font-bold text-gray-700 ml-1 mb-2 block";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="space-y-1 relative group">
          <label className={labelClasses}>Nombre Completo</label>
          <div className="relative">
            <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'name' ? 'text-blue-500' : 'text-gray-400'}`} size={20} />
            <input
              type="text"
              name="name"
              required
              className={inputClasses('name')}
              placeholder="Tu nombre"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-1 relative">
          <label className={labelClasses}>Teléfono</label>
          <div className="relative">
            <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'phone' ? 'text-blue-500' : 'text-gray-400'}`} size={20} />
            <input
              type="tel"
              name="phone"
              className={inputClasses('phone')}
              placeholder="+57 300 123 4567"
              value={formData.phone}
              onChange={handleChange}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
            />
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="space-y-1 relative">
        <label className={labelClasses}>Correo Electrónico</label>
        <div className="relative">
          <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'}`} size={20} />
          <input
            type="email"
            name="email"
            required
            className={inputClasses('email')}
            placeholder="tucorreo@ejemplo.com"
            value={formData.email}
            onChange={handleChange}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-1 relative">
        <label className={labelClasses}>Asunto</label>
        <div className="relative">
          <FileText className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'subject' ? 'text-blue-500' : 'text-gray-400'}`} size={20} />
          <select
            name="subject"
            required
            className={`${inputClasses('subject')} appearance-none cursor-pointer`}
            value={formData.subject}
            onChange={handleChange}
            onFocus={() => setFocusedField('subject')}
            onBlur={() => setFocusedField(null)}
          >
            <option value="">Selecciona un asunto</option>
            <option value="Información General">Información General</option>
            <option value="Voluntariado">Voluntariado</option>
            <option value="Donaciones">Donaciones</option>
            <option value="Alianzas">Alianzas Corporativas</option>
            <option value="Otro">Otro</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-1 relative">
        <label className={labelClasses}>Mensaje</label>
        <div className="relative">
          <MessageSquare className={`absolute left-4 top-6 transition-colors duration-300 ${focusedField === 'message' ? 'text-blue-500' : 'text-gray-400'}`} size={20} />
          <textarea
            name="message"
            required
            rows={4}
            className={`${inputClasses('message')} pt-5`}
            placeholder="¿Cómo podemos ayudarte?"
            value={formData.message}
            onChange={handleChange}
            onFocus={() => setFocusedField('message')}
            onBlur={() => setFocusedField(null)}
          ></textarea>
        </div>
      </motion.div>

      <motion.button
        variants={itemVariants}
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>Enviando...</span>
          </>
        ) : (
          <>
            <Send size={20} className="group-hover:translate-x-1 transition-transform" />
            <span>Enviar Mensaje</span>
          </>
        )}
      </motion.button>
    </motion.form>
  );
};

export default ContactForm;
