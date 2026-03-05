import { Image as ImageIcon, Loader2, Save, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '../../lib/supabase';

type Setting = { key: string; value: string | null };

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
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [, setLoading] = useState(true);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;
      const map: Record<string, string> = {};
      data?.forEach((s: Setting) => { map[s.key] = s.value || ''; });
      defaultKeys.forEach(k => { if (!(k in map)) map[k] = ''; });
      setSettings(map);
    } catch (e: any) {
      toast.error('Error al cargar ajustes: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

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

  const uploadLogo = async () => {
    if (!logoFile) return;
    try {
      setLogoUploading(true);
      const ext = logoFile.name.split('.').pop();
      const fileName = `logo_${Date.now()}.${ext}`;
      const filePath = `public/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('assets').upload(filePath, logoFile, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('assets').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setLogoFile(f);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ajustes del Sitio</h1>
          <p className="text-gray-500">Gestiona enlaces y datos institucionales.</p>
        </div>
        <button onClick={saveSettings} className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700">
          <Save size={18} />
          Guardar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
          <input value={settings['instagram_url'] || ''} onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })} placeholder="Instagram URL" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input value={settings['phone_whatsapp'] || ''} onChange={(e) => setSettings({ ...settings, phone_whatsapp: e.target.value })} placeholder="Teléfono WhatsApp" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input value={settings['address'] || ''} onChange={(e) => setSettings({ ...settings, address: e.target.value })} placeholder="Dirección" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {settings['logo_url'] ? (
                <img src={settings['logo_url']} alt="Logo" className="h-20 w-20 rounded-xl border object-contain bg-white" />
              ) : (
                <div className="h-20 w-20 rounded-xl border flex items-center justify-center bg-gray-50 text-gray-400">
                  <ImageIcon size={28} />
                </div>
              )}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="flex-1 border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-gray-600">
                    {logoFile ? (
                      <span className="font-bold text-gray-800">{logoFile.name}</span>
                    ) : (
                      <span>Arrastra una imagen aquí o selecciona un archivo</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                      Seleccionar archivo
                    </button>
                    <button
                      onClick={uploadLogo}
                      disabled={logoUploading || !logoFile}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
                    >
                      {logoUploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                      {logoUploading ? 'Subiendo...' : 'Subir Logo'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
          <input value={settings['bank_account_bank'] || ''} onChange={(e) => setSettings({ ...settings, bank_account_bank: e.target.value })} placeholder="Banco" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input value={settings['bank_account_type'] || ''} onChange={(e) => setSettings({ ...settings, bank_account_type: e.target.value })} placeholder="Tipo de cuenta" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input value={settings['bank_account_holder'] || ''} onChange={(e) => setSettings({ ...settings, bank_account_holder: e.target.value })} placeholder="Titular" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input value={settings['bank_account_nit'] || ''} onChange={(e) => setSettings({ ...settings, bank_account_nit: e.target.value })} placeholder="NIT" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input value={settings['bank_account_number'] || ''} onChange={(e) => setSettings({ ...settings, bank_account_number: e.target.value })} placeholder="Número de cuenta" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default SettingsAdmin;
