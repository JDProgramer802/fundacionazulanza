import { motion } from 'framer-motion';
import { CheckCircle, CreditCard, Gift, Heart, Shield } from 'lucide-react';
import { useState } from 'react';
import type { ChangeEvent } from 'react';

const Donations = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom' | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  const amounts = [20000, 50000, 100000];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount('custom');
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block p-4 rounded-full bg-pink-100 text-primary-pink mb-6"
          >
            <Heart size={48} fill="currentColor" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-blue mb-6">Tu ayuda transforma vidas</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cada aporte cuenta. Con tu donación, podemos seguir brindando apoyo psicológico y ayuda humanitaria a quienes más lo necesitan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Donation Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Selecciona un monto</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {amounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAmountSelect(amount)}
                  className={`py-4 px-2 rounded-xl font-bold text-lg transition-all ${
                    selectedAmount === amount
                      ? 'bg-primary-blue text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  ${amount.toLocaleString('es-CO')}
                </button>
              ))}
              <div className="relative col-span-2 sm:col-span-3 mt-2">
                <label className={`block text-sm font-medium mb-2 ${selectedAmount === 'custom' ? 'text-primary-blue' : 'text-gray-500'}`}>
                  O ingresa otro valor
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    onFocus={() => setSelectedAmount('custom')}
                    placeholder="0"
                    className={`w-full pl-8 pr-4 py-3 rounded-xl border-2 outline-none transition-all ${
                      selectedAmount === 'custom'
                        ? 'border-primary-blue ring-2 ring-blue-100'
                        : 'border-gray-200 focus:border-primary-blue'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full btn-primary bg-primary-pink hover:bg-pink-600 py-4 text-xl shadow-xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02]">
                <CreditCard size={24} />
                Donar con Tarjeta
              </button>
              <button className="w-full btn-secondary bg-blue-500 hover:bg-blue-600 py-4 text-xl shadow-xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02]">
                <span className="font-bold">PSE</span> / Nequi / Daviplata
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-2">
              <Shield size={14} /> Pagos 100% seguros y encriptados.
            </p>
          </div>

          {/* Impact Info */}
          <div className="space-y-8">
            <div className="bg-blue-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-primary-blue mb-4">¿Cómo usamos tus donaciones?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 shrink-0 mt-1" />
                  <span className="text-gray-700"><strong>80%</strong> va directamente a programas sociales y atención psicológica.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 shrink-0 mt-1" />
                  <span className="text-gray-700"><strong>15%</strong> para sostenibilidad y crecimiento de la fundación.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 shrink-0 mt-1" />
                  <span className="text-gray-700"><strong>5%</strong> para gastos administrativos.</span>
                </li>
              </ul>
            </div>

            <div className="bg-pink-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-primary-pink mb-4">Tu impacto tangible</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-full text-primary-pink shadow-sm">
                    <Gift size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">$50.000</p>
                    <p className="text-sm text-gray-600">Cubre una sesión de asesoría psicológica para una persona de bajos recursos.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-full text-primary-pink shadow-sm">
                    <Heart size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">$100.000</p>
                    <p className="text-sm text-gray-600">Ayuda a financiar una jornada de salud mental en una comunidad.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donations;
