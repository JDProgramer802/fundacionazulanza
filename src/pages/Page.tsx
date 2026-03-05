import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Componente para renderizar páginas dinámicas públicas basadas en el slug.
const Page = () => {
  const { slug } = useParams();
  const [content, setContent] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscar la página en Supabase por su slug y verificar que esté publicada
    const fetchPage = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('pages')
          .select('title, content')
          .eq('slug', slug)
          .eq('status', 'published')
          .limit(1);

        if (error) throw error;
        if (data && data.length > 0) {
          setContent({ title: data[0].title, content: data[0].content });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) return <div className="container-custom py-16 text-center text-gray-500">Cargando...</div>;
  if (!content) return <div className="container-custom py-16 text-center text-gray-500">Página no encontrada</div>;

  return (
    <div className="bg-white">
      <section className="py-16">
        <div className="container-custom max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">{content.title}</h1>
          {/* Renderizar contenido HTML seguro */}
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content.content }} />
        </div>
      </section>
    </div>
  );
};

export default Page;
