import { ArrowLeft, Calendar, Share2, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Skeleton from '../components/UI/Skeleton';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type NewsItem = Database['public']['Tables']['news']['Row'];

const NewsDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('slug', slug)
          .eq('active', true)
          .single();
        
        if (error) throw error;
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchNews();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news?.title,
        text: news?.summary || '',
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Enlace copiado al portapapeles');
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-10 w-3/4 rounded-lg" />
          <Skeleton className="h-96 w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Noticia no encontrada</h2>
        <p className="text-gray-500 mb-8">La noticia que buscas no existe o ha sido eliminada.</p>
        <Link to="/noticias" className="px-6 py-3 bg-primary-blue text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
          Ver otras noticias
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-white min-h-screen">
      {/* Header con Imagen */}
      <div className="relative h-[50vh] min-h-[400px]">
        <img 
          src={news.image_url || 'https://via.placeholder.com/1200x600?text=Noticia'} 
          alt={news.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container-custom max-w-4xl mx-auto">
            <Link 
              to="/noticias" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full text-sm font-medium"
            >
              <ArrowLeft size={16} /> Volver a Noticias
            </Link>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {news.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm font-medium">
              <span className="flex items-center gap-2">
                <Calendar size={18} />
                {new Date(news.published_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-2">
                <User size={18} />
                {news.author || 'Fundación Azulanza'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          {/* Resumen destacado */}
          {news.summary && (
            <div className="bg-blue-50 border-l-4 border-primary-blue p-6 rounded-r-xl mb-10">
              <p className="text-xl text-blue-900 font-medium italic leading-relaxed">
                {news.summary}
              </p>
            </div>
          )}

          {/* Cuerpo del artículo */}
          <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-loose">
            {news.content.split('\n').map((paragraph, idx) => (
              paragraph.trim() && <p key={idx} className="mb-6">{paragraph}</p>
            ))}
          </div>

          {/* Botón Compartir */}
          <div className="border-t border-gray-100 mt-12 pt-8 flex justify-between items-center">
            <p className="font-bold text-gray-800">¿Te gustó esta noticia?</p>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              <Share2 size={18} />
              Compartir
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsDetail;
