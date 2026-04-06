import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Globe, Cpu, MessageSquare, Heart, BookOpen, ChevronRight, Play, Download, Share2, Filter, Search, Grid, List } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackgroundParticles from '../components/BackgroundParticles';

// Importar los nuevos componentes de vista de proyecto
import MonikaProjectView from '../components/MonikaProjectView';
import NatsukiProjectView from '../components/NatsukiProjectView';
import YuriProjectView from '../components/YuriProjectView';

const Proyectos = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [filter, setFilter] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Datos de los proyectos con las URLs de imágenes correctas
  const projects = [
    {
      id: 'monika',
      title: 'Monika After History',
      subtitle: 'Novela Visual Fan-Made',
      description: 'Una historia alternativa que explora qué habría pasado después de los eventos de Doki Doki Literature Club. Monika, consciente de su realidad, decide escribir su propia historia.',
      rating: 4.8,
      status: 'En desarrollo',
      tags: ['Fan-Made', 'Drama', 'Romance'],
      image: 'https://images.alphacoders.com/883/883394.png', // Imagen de Monika
      featured: true
    },
    {
      id: 'natsuki',
      title: 'Just Natsuki',
      subtitle: 'Novela Visual Fan-Made',
      description: 'Sumérgete en la historia de Natsuki, explorando su mundo más allá del club de literatura. Una narrativa íntima que profundiza en su personalidad.',
      rating: 4.5,
      status: 'Disponible',
      tags: ['Fan-Made', 'Slice of Life'],
      image: 'https://images.alphacoders.com/883/883396.png', // Imagen de Natsuki
      featured: false
    },
    {
      id: 'yuri',
      title: 'Just Yuri',
      subtitle: 'Novela Visual Fan-Made',
      description: 'Una aventura literaria con Yuri como protagonista. Descubre su amor por los libros, los misterios que la rodean y una historia que mezcla lo cotidiano con lo sobrenatural.',
      rating: 4.6,
      status: 'Disponible',
      tags: ['Fan-Made', 'Misterio', 'Literatura'],
      image: 'https://images.alphacoders.com/883/883398.png', // Imagen de Yuri
      featured: false
    }
  ];

  const filteredProjects = projects.filter(p => 
    (filter === 'todos' || p.tags.includes(filter)) &&
    (p.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen text-white overflow-x-hidden relative bg-[#080818]">
      <BackgroundParticles />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-[#FF2D78] font-black uppercase tracking-[0.3em] text-sm mb-4 block">Nuestras creaciones</span>
            <h1 className="text-7xl md:text-8xl font-black italic tracking-tighter mb-6">
              Proyectos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D78] to-[#00F3FF]">Destacados</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-medium italic">
              Novelas visuales creadas con pasión por nuestra comunidad usando el motor Ren'Py. Historias únicas en español.
            </p>
          </motion.div>

          {/* Grid de Proyectos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10 }}
                className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm hover:border-[#FF2D78]/50 transition-all duration-500"
              >
                {/* Imagen del Proyecto */}
                <div className="aspect-video overflow-hidden relative">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080818] via-transparent to-transparent opacity-80" />
                  
                  {/* Badge de Estado */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {project.featured && (
                      <span className="px-3 py-1 rounded-full bg-[#FF2D78] text-white text-[10px] font-black uppercase tracking-wider shadow-[0_0_15px_rgba(255,45,120,0.5)]">
                        Destacado
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-wider">
                      {project.status}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[#00F3FF] text-[10px] font-black flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> {project.rating}
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-8">
                  <h3 className="text-2xl font-black italic tracking-tight mb-2 group-hover:text-[#FF2D78] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-[#FF2D78] text-xs font-bold uppercase tracking-widest mb-4">{project.subtitle}</p>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 font-medium italic">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Botón Explorar */}
                  <button 
                    onClick={() => setSelectedProject(project.id)}
                    className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-tighter flex items-center justify-center gap-2 group-hover:bg-[#FF2D78] group-hover:border-[#FF2D78] transition-all duration-300"
                  >
                    Explorar Proyecto
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Modales de Proyectos */}
      <MonikaProjectView 
        isOpen={selectedProject === 'monika'} 
        onClose={() => setSelectedProject(null)} 
      />
      <NatsukiProjectView 
        isOpen={selectedProject === 'natsuki'} 
        onClose={() => setSelectedProject(null)} 
      />
      <YuriProjectView 
        isOpen={selectedProject === 'yuri'} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
};

export default Proyectos;
