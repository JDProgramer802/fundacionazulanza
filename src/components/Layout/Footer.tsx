import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../../assets/images/logo-azulanza.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container-custom grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Column 1: Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img
              src={logo}
              alt="Fundación Azulanza"
              className="h-14 md:h-16 lg:h-20 w-auto object-contain bg-white rounded-lg p-1"
            />
          </div>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Trabajamos con pasión y compromiso para brindar esperanza y apoyo psicológico a quienes más lo necesitan.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary-blue transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary-pink transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-400 transition-colors">
              <Twitter size={20} />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-lg font-bold mb-6 text-primary-pink">Enlaces Rápidos</h4>
          <ul className="space-y-3">
            <li>
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">Inicio</Link>
            </li>
            <li>
              <Link to="/nosotros" className="text-gray-400 hover:text-white transition-colors">Sobre Nosotros</Link>
            </li>
            <li>
              <Link to="/asesoria" className="text-gray-400 hover:text-white transition-colors">Asesoría Psicológica</Link>
            </li>
            <li>
              <Link to="/donaciones" className="text-gray-400 hover:text-white transition-colors">Donaciones</Link>
            </li>
            <li>
              <Link to="/galeria" className="text-gray-400 hover:text-white transition-colors">Galería</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div>
          <h4 className="text-lg font-bold mb-6 text-primary-pink">Contáctanos</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-gray-400">
              <MapPin className="shrink-0 text-primary-blue" size={20} />
              <span>Calle 123 # 45-67, Ciudad, País</span>
            </li>
            <li className="flex items-center gap-3 text-gray-400">
              <Phone className="shrink-0 text-primary-blue" size={20} />
              <span>+57 300 123 4567</span>
            </li>
            <li className="flex items-center gap-3 text-gray-400">
              <Mail className="shrink-0 text-primary-blue" size={20} />
              <span>contacto@fundacionazulanza.org</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter/Action */}
        <div>
          <h4 className="text-lg font-bold mb-6 text-primary-pink">Suscríbete</h4>
          <p className="text-gray-400 mb-4 text-sm">
            Recibe noticias y actualizaciones de nuestras jornadas y campañas.
          </p>
          <form className="space-y-2 mb-6" onSubmit={(e) => { e.preventDefault(); toast.success('¡Gracias por suscribirte!'); }}>
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-blue outline-none text-white text-sm"
              required
            />
            <button type="submit" className="w-full py-2 bg-primary-blue hover:bg-blue-700 text-white rounded-lg transition-colors font-bold text-sm">
              Suscribirme
            </button>
          </form>
          <Link to="/voluntarios" className="inline-block w-full text-center py-2 border border-primary-pink text-primary-pink hover:bg-primary-pink hover:text-white rounded-lg transition-all font-bold text-sm">
            Ser Voluntario
          </Link>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Fundación Azulanza. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
