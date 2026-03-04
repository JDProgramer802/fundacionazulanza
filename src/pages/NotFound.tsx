import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 relative inline-block"
        >
          <div className="text-9xl font-bold text-gray-200">404</div>
          <div className="absolute inset-0 flex items-center justify-center text-primary-pink">
            <Search size={80} strokeWidth={2.5} className="opacity-80" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold text-primary-blue mb-4"
        >
          Página no encontrada
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-gray-500 text-lg mb-8"
        >
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary-blue text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-300"
          >
            <Home size={20} />
            Volver al Inicio
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
