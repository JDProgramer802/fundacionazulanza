import { Image as ImageIcon, Loader2, Save } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '../../lib/supabase';

// Tipo para ajustes de configuración
type Setting = { key: string; value: string | null };

// Claves de configuración por defecto
const defaultKeys = [
  'instagram_url',
  'phone_whatsapp',
  'address',
  'bank_account_number',
  'bank_account_bank',
  'bank_account_type',
  'bank_account_holder',
  'bank_account_nit'
];

const SettingsAdmin = () => {
  // Estado para almacenar los ajustes (clave-valor)
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [, setLoading] = useState(true);

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
      const rows = Object.entries(settings).map(([key, value]) => ({ key, value }));
      const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
      if (error) throw error;
      toast.success('Ajustes guardados');
    } catch (e: any) {
      toast.error('Error al guardar: ' + e.message);
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
    } catch (e: any) {
      toast.error('Error al subir logo: ' + e.message);
    } finally {
      setLogoUploading(false);
      setLogoFile(null);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Ajustes del Sitio</h1>
          <p className="text-gray-500 dark:text-gray-400">Gestiona enlaces y datos institucionales.</p>
        </div>
        <button onClick={saveSettings} className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700">
          <Save size={18} />
          Guardar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel de Enlaces y Contacto */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">Contacto y Redes</h3>
          <input
            value={settings['instagram_url'] || ''}
            onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
            placeholder="Instagram URL"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <input
            value={settings['phone_whatsapp'] || ''}
            onChange={(e) => setSettings({ ...settings, phone_whatsapp: e.target.value })}
            placeholder="Teléfono WhatsApp"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <textarea
            value={settings['address'] || ''}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            placeholder="Dirección Física"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg h-24 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Panel de Logo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Logo Institucional</h3>
            <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files?.[0]) setLogoFile(e.target.files[0]);
                    }}
                />

                {logoFile ? (
                    <div className="text-center">
                        <p className="text-sm font-medium text-green-600 mb-2">Archivo seleccionado: {logoFile.name}</p>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                uploadLogo();
                            }}
                            disabled={logoUploading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
                        >
                            {logoUploading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Subir Ahora'}
                        </button>
                    </div>
                ) : (
                    <>
                        {settings['logo_url'] ? (
                            <img src={settings['logo_url']} alt="Logo actual" className="h-20 mb-4 object-contain" />
                        ) : (
                            <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-400">Arrastra tu logo aquí o haz clic</p>
                    </>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsAdmin;
