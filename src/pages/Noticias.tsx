import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'wouter';
import { ArrowLeft, Calendar } from 'lucide-react';

export default function Noticias() {
  const noticias = [
    {
      id: 1,
      title: 'Nuevo Tutorial de Ren\'Py Disponible',
      date: '2026-04-01',
      category: 'Tutorial',
      image: 'https://picsum.photos/seed/news1/600/400',
      excerpt: 'Aprende los conceptos básicos de programación en Ren\'Py con nuestro nuevo tutorial interactivo paso a paso.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: 2,
      title: 'Concurso de Novelas Visuales 2026',
      date: '2026-03-28',
      category: 'Evento',
      image: 'https://picsum.photos/seed/news2/600/400',
      excerpt: 'Participa en nuestro concurso anual y gana premios increíbles. ¡Las inscripciones están abiertas!',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: 3,
      title: 'Webinar: Diseño Avanzado de Personajes',
      date: '2026-03-25',
      category: 'Webinar',
      image: 'https://picsum.photos/seed/news3/600/400',
      excerpt: 'Únete a nuestro webinar gratuito sobre técnicas avanzadas de diseño de personajes con expertos de la industria.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: 4,
      title: 'Actualización de Herramientas v2.5',
      date: '2026-03-20',
      category: 'Actualización',
      image: 'https://picsum.photos/seed/news4/600/400',
      excerpt: 'Descubre las nuevas herramientas y mejoras que hemos añadido a nuestra plataforma para facilitar tu trabajo.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: 5,
      title: 'Entrevista: Creadores de Éxito',
      date: '2026-03-15',
      category: 'Entrevista',
      image: 'https://picsum.photos/seed/news5/600/400',
      excerpt: 'Conoce la historia de los creadores que han triunfado en la industria de las novelas visuales.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: 6,
      title: 'Comunidad Alcanza 10,000 Miembros',
      date: '2026-03-10',
      category: 'Hito',
      image: 'https://picsum.photos/seed/news6/600/400',
      excerpt: 'Celebramos el crecimiento de nuestra comunidad que ha alcanzado los 10,000 miembros activos.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
  ];

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Tutorial': return 'bg-blue-500/20 text-blue-300';
      case 'Evento': return 'bg-purple-500/20 text-purple-300';
      case 'Webinar': return 'bg-pink-500/20 text-pink-300';
      case 'Actualización': return 'bg-green-500/20 text-green-300';
      case 'Entrevista': return 'bg-yellow-500/20 text-yellow-300';
      case 'Hito': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 border-b border-purple-900/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 hover:text-pink-400 transition-colors">
          <ArrowLeft size={20} />
          <span className="text-lg sm:text-2xl font-bold tracking-tight">The Encoders Club</span>
        </Link>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 sm:mb-12">Noticias Recientes</h1>
        
        <div className="space-y-6 sm:space-y-8">
          {noticias.map((noticia) => (
            <motion.article
              key={noticia.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-purple-950/30 rounded-2xl overflow-hidden border border-purple-800/50 hover:border-pink-500/50 transition-all hover:shadow-lg hover:shadow-pink-500/20"
            >
              <div className="flex flex-col sm:flex-row">
                <img 
                  src={noticia.image} 
                  alt={noticia.title} 
                  className="w-full sm:w-48 h-48 sm:h-auto object-cover" 
                  referrerPolicy="no-referrer" 
                />
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getCategoryColor(noticia.category)}`}>
                        {noticia.category}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Calendar size={14} />
                        <span>{new Date(noticia.date).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg sm:text-xl mb-2">{noticia.title}</h3>
                    <p className="text-sm sm:text-base text-gray-400">{noticia.excerpt}</p>
                  </div>
                  <button className="mt-4 text-pink-400 hover:text-pink-300 font-semibold text-sm transition-colors">
                    Leer más →
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </main>
    </div>
  );
}
