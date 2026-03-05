import {
  Banknote,
  Building2,
  CreditCard,
  Globe,
  Image as ImageIcon,
  Instagram,
  Loader2,
  Mail,
  Map,
  MapPin,
  Phone,
  Save,
  UploadCloud
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '../../lib/supabase';

// Tipo para ajustes de configuración
type Setting = { key: string; value: string | null };

// Claves de configuración por defecto
const defaultKeys = [
  'instagram_url',
  'phone_whatsapp',
  'email_contact',
  'address',
  'bank_account_number',
  'bank_account_bank',
  'bank_account_type',
  'bank_account_holder',
  'bank_account_nit',
  'google_maps_embed_url'
];

const SettingsAdmin = () => {
  // Estado para almacenar los ajustes (clave-valor)
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estado para manejo de subida de logo
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Cargar ajustes desde Supabase
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;

      // Mapear array a objeto para fácil acceso
      const map: Record<string, string> = {};
      data?.forEach((s: Setting) => { map[s.key] = s.value || ''; });

      // Asegurar que existan las claves por defecto
      defaultKeys.forEach(k => { if (!(k in map)) map[k] = ''; });
      setSettings(map);
    } catch (e: any) {
      toast.error('Error al cargar ajustes: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  // Guardar todos los ajustes en la base de datos (upsert)
  const saveSettings = async () => {
    try {
      setSaving(true);
      const rows = Object.entries(settings).map(([key, value]) => ({ key, value }));
      const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
      if (error) throw error;
      toast.success('Ajustes guardados correctamente');
    } catch (e: any) {
      toast.error('Error al guardar: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  // Subir logo al Storage y actualizar la URL en settings
  const uploadLogo = async () => {
    if (!logoFile) return;
    try {
      setLogoUploading(true);
      const ext = logoFile.name.split('.').pop();
      const fileName = `logo_${Date.now()}.${ext}`;
      const filePath = `public/${fileName}`;

      // 1. Subir archivo
      const { error: uploadError } = await supabase.storage.from('assets').upload(filePath, logoFile, { upsert: true });
      if (uploadError) throw uploadError;

      // 2. Obtener URL pública
      const { data } = supabase.storage.from('assets').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      // 3. Guardar URL en settings
      setSettings({ ...settings, logo_url: publicUrl });
      const { error } = await supabase.from('site_settings').upsert([{ key: 'logo_url', value: publicUrl }], { onConflict: 'key' });
      if (error) throw error;

      toast.success('Logo actualizado');
      setLogoFile(null);
    } catch (e: any) {
      toast.error('Error al subir logo: ' + e.message);
    } finally {
      setLogoUploading(false);
    }
  };

  // Manejador de Drag & Drop para el logo
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith('image/')) {
        setLogoFile(f);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <Globe className="text-primary-blue" /> Ajustes Generales
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-lg">
            Configura la información pública, contacto y apariencia de la plataforma.
          </p>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary-blue text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed font-medium"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* COLUMNA IZQUIERDA (2/3) */}
        <div className="lg:col-span-2 space-y-8">

          {/* TARJETA 1: INFORMACIÓN DE CONTACTO */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <Phone className="text-primary-pink" size={22} /> Contacto y Redes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup
                label="WhatsApp / Teléfono"
                icon={<Phone size={18} />}
                value={settings['phone_whatsapp']}
                onChange={(v) => handleChange('phone_whatsapp', v)}
                placeholder="+57 300 123 4567"
              />
              <InputGroup
                label="Correo Electrónico"
                icon={<Mail size={18} />}
                value={settings['email_contact']}
                onChange={(v) => handleChange('email_contact', v)}
                placeholder="contacto@fundacion.org"
              />
              <InputGroup
                label="Instagram URL"
                icon={<Instagram size={18} />}
                value={settings['instagram_url']}
                onChange={(v) => handleChange('instagram_url', v)}
                placeholder="https://instagram.com/..."
                className="md:col-span-2"
              />
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" /> Dirección Física
                </label>
                <textarea
                  value={settings['address'] || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Ej: Cra 42 # 65 - 27, Barranquilla..."
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue outline-none transition-all dark:bg-gray-700 dark:text-white min-h-[100px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* TARJETA 2: MAPA */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Map className="text-green-500" size={22} /> Ubicación en Mapa
                </h3>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-md font-medium">Google Maps</span>
             </div>

             <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-sm text-blue-800 dark:text-blue-200 flex gap-3 items-start">
                  <div className="bg-blue-100 dark:bg-blue-800 p-1.5 rounded-full shrink-0">
                    <MapPin size={16} />
                  </div>
                  <p>
                    Ve a Google Maps, busca tu ubicación, haz clic en <strong>Compartir</strong> &gt; <strong>Insertar un mapa</strong> y copia el enlace dentro de <code>src="..."</code>.
                  </p>
                </div>

                <InputGroup
                  label="URL del Embed (src)"
                  icon={<Globe size={18} />}
                  value={settings['google_maps_embed_url']}
                  onChange={(v) => handleChange('google_maps_embed_url', v)}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  mono
                />

                {settings['google_maps_embed_url'] && (
                  <div className="mt-4 h-64 w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-600 shadow-inner">
                    <iframe
                      src={settings['google_maps_embed_url']}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      title="Vista previa del mapa"
                      className="grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
                    ></iframe>
                  </div>
                )}
             </div>
          </div>

          {/* TARJETA 3: DATOS BANCARIOS */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <Banknote className="text-yellow-500" size={22} /> Datos Bancarios (Donaciones)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup
                label="Banco"
                icon={<Building2 size={18} />}
                value={settings['bank_account_bank']}
                onChange={(v) => handleChange('bank_account_bank', v)}
                placeholder="Ej: Bancolombia"
              />
               <InputGroup
                label="Tipo de Cuenta"
                icon={<CreditCard size={18} />}
                value={settings['bank_account_type']}
                onChange={(v) => handleChange('bank_account_type', v)}
                placeholder="Ej: Ahorros"
              />
              <InputGroup
                label="Número de Cuenta"
                icon={<CreditCard size={18} />}
                value={settings['bank_account_number']}
                onChange={(v) => handleChange('bank_account_number', v)}
                placeholder="000-000000-00"
                mono
              />
              <InputGroup
                label="NIT / Identificación"
                icon={<Banknote size={18} />}
                value={settings['bank_account_nit']}
                onChange={(v) => handleChange('bank_account_nit', v)}
                placeholder="900.000.000-1"
              />
               <InputGroup
                label="Titular de la Cuenta"
                icon={<Building2 size={18} />}
                value={settings['bank_account_holder']}
                onChange={(v) => handleChange('bank_account_holder', v)}
                placeholder="Nombre del titular"
                className="md:col-span-2"
              />
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA (1/3) */}
        <div className="space-y-8">
            {/* TARJETA LOGO */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-28">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <ImageIcon className="text-purple-500" size={22} /> Logo Institucional
                </h3>

                <div className="flex flex-col items-center">
                    <div className="w-full aspect-square bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-600 mb-6 relative overflow-hidden group hover:border-primary-blue transition-colors">
                        {logoFile ? (
                             <div className="relative w-full h-full p-4 flex flex-col items-center justify-center">
                                <img
                                    src={URL.createObjectURL(logoFile)}
                                    className="max-w-full max-h-[80%] object-contain shadow-sm"
                                    alt="Vista previa"
                                />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-white font-medium text-sm">Cambiar archivo</p>
                                </div>
                             </div>
                        ) : settings['logo_url'] ? (
                             <img src={settings['logo_url']} alt="Logo actual" className="max-w-[80%] max-h-[80%] object-contain p-4" />
                        ) : (
                             <div className="text-center p-6">
                                <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-400 text-sm">Sin logo configurado</p>
                             </div>
                        )}

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files?.[0]) setLogoFile(e.target.files[0]);
                            }}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        />
                    </div>

                    {logoFile ? (
                         <div className="w-full animate-in fade-in slide-in-from-bottom-2">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3 text-center truncate px-4">
                                {logoFile.name}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setLogoFile(null)}
                                    className="flex-1 py-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-sm font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={uploadLogo}
                                    disabled={logoUploading}
                                    className="flex-[2] py-2.5 bg-primary-blue text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    {logoUploading ? <Loader2 className="animate-spin w-4 h-4" /> : <UploadCloud size={16} />}
                                    Subir Logo
                                </button>
                            </div>
                         </div>
                    ) : (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-3 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                        >
                            <UploadCloud size={18} />
                            Seleccionar Archivo
                        </button>
                    )}

                    <p className="mt-4 text-xs text-center text-gray-400 max-w-[200px]">
                        Recomendado: PNG transparente de al menos 500x500px.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// Componente reutilizable para Inputs
const InputGroup = ({
    label,
    icon,
    value,
    onChange,
    placeholder,
    className = '',
    mono = false
}: {
    label: string,
    icon: React.ReactNode,
    value?: string,
    onChange: (val: string) => void,
    placeholder?: string,
    className?: string,
    mono?: boolean
}) => (
    <div className={`space-y-2 ${className}`}>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <span className="text-gray-400">{icon}</span> {label}
        </label>
        <div className="relative group">
            <input
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full pl-4 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue outline-none transition-all dark:bg-gray-700 dark:text-white ${mono ? 'font-mono text-sm' : ''}`}
            />
        </div>
    </div>
);

export default SettingsAdmin;
