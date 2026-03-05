import { motion } from 'framer-motion';
import { Copy, CreditCard, Heart, Shield, Smartphone, Smile, Users } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';

const Donations = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom' | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  const amounts = [
    { value: 20000, label: 'Alimentación', icon: Smile, desc: 'Un almuerzo nutritivo' },
    { value: 50000, label: 'Salud', icon: Heart, desc: 'Kit de primeros auxilios' },
    { value: 100000, label: 'Educación', icon: Users, desc: 'Materiales escolares' }
  ];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount('custom');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 bg-blue-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20 fixed-bg"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/80"></div>
        
        <div className="container-custom relative z-10 text-center text-white">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-pink-300 mb-6"
          >
            <Heart size={32} className="fill-pink-300 animate-pulse" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
          >
            Tu ayuda transforma <span className="text-pink-300">vidas</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-blue-100 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Cada aporte cuenta. Con tu donación, podemos seguir brindando apoyo psicológico y ayuda humanitaria a quienes más lo necesitan.
          </motion.p>
        </div>
      </section>

      <div className="container-custom -mt-16 relative z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Donation Form */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-7 bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Selecciona un monto</h2>
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium">
                <Shield size={14} />
                Pago Seguro
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {amounts.map((item) => (
                <button
                  key={item.value}
                  onClick={() => handleAmountSelect(item.value)}
                  className={`relative overflow-hidden p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 group ${
                    selectedAmount === item.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg shadow-blue-100'
                      : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                  }`}
                >
                  <item.icon size={24} className={`transition-colors ${selectedAmount === item.value ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-400'}`} />
                  <span className="text-xl font-bold">${item.value.toLocaleString('es-CO')}</span>
                  <span className="text-xs font-medium text-gray-500 text-center">{item.desc}</span>

                  {selectedAmount === item.value && (
                    <motion.div layoutId="active-border" className="absolute inset-0 border-2 border-blue-500 rounded-2xl" />
                  )}
                </button>
              ))}
            </div>

            <div className="mb-8">
              <label className={`block text-sm font-bold mb-3 ${selectedAmount === 'custom' ? 'text-blue-600' : 'text-gray-600'}`}>
                O ingresa otro valor
              </label>
              <div className="relative group">
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold text-xl transition-colors ${selectedAmount === 'custom' ? 'text-blue-600' : 'text-gray-400'}`}>$</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  onFocus={() => setSelectedAmount('custom')}
                  placeholder="0"
                  className={`w-full pl-10 pr-4 py-4 rounded-xl border-2 outline-none transition-all font-bold text-lg ${
                    selectedAmount === 'custom'
                      ? 'border-blue-500 ring-4 ring-blue-500/10'
                      : 'border-gray-100 hover:border-gray-300 focus:border-blue-500'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-pink-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3">
                <CreditCard size={24} />
                Donar con Tarjeta
              </button>
              <button className="w-full bg-[#0032A0] hover:bg-[#002a85] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-900/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3">
                <Smartphone size={24} />
                PSE / Nequi / Daviplata
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-2">
              <Shield size={14} className="text-green-500" />
              Tus datos están protegidos con encriptación SSL de 256 bits.
            </p>
          </motion.div>

          {/* Sidebar Info */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Impact Box */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <h3 className="text-2xl font-bold mb-6 relative z-10">¿Cómo usamos tus donaciones?</h3>
              <ul className="space-y-4 relative z-10">
                <li className="flex items-start gap-4">
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <Heart className="text-pink-300" size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-lg block">80% Impacto Directo</span>
                    <span className="text-blue-100 text-sm">Programas sociales y atención psicológica.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <Users className="text-green-300" size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-lg block">15% Sostenibilidad</span>
                    <span className="text-blue-100 text-sm">Crecimiento y alcance de la fundación.</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Bank Transfer Box */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/10 rounded-bl-full transition-transform group-hover:scale-110"></div>

              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-2 h-8 bg-yellow-400 rounded-full"></div>
                Transferencia Bancaria
              </h3>

              <div className="space-y-4 text-gray-600">
                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                  <span className="font-medium">Banco</span>
                  <span className="font-bold text-gray-900">Bancolombia</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                  <span className="font-medium">Tipo</span>
                  <span className="font-bold text-gray-900">Ahorros</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                  <span className="font-medium">Titular</span>
                  <span className="font-bold text-gray-900">Fundación Azulanza</span>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Número de cuenta</p>
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100 group-hover:border-yellow-400/30 transition-colors">
                    <span className="font-mono text-xl font-bold text-gray-800 tracking-wider">47700009820</span>
                    <button
                      onClick={() => { navigator.clipboard.writeText('47700009820'); toast.success('Copiado al portapapeles'); }}
                      className="ml-auto p-2 hover:bg-white rounded-lg transition-all text-gray-500 hover:text-blue-600 shadow-sm"
                      title="Copiar número"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-center text-gray-400 mt-4">
                  NIT: 901645631
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Donations;
