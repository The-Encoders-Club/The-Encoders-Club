import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles, ArrowRight, Gamepad2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackgroundParticles from '../components/BackgroundParticles';

// Importar los nuevos componentes de vista de proyecto
import MonikaProjectView from '../components/MonikaProjectView';
import NatsukiProjectView from '../components/NatsukiProjectView';
import YuriProjectView from '../components/YuriProjectView';

const PROYECTOS_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663520694523/gdw63Pfk2mCpqaap3WKi6Q/ProyectoFondo_c3356f10.jpg";

const projects = [
  {
    id: 1,
    name: "Monika After History",
    subtitle: "Novela Visual Fan-Made",
    description:
      "Una historia alternativa que explora qué habría pasado después de los eventos de Doki Doki Literature Club. Monika, consciente de su realidad, decide escribir su propia historia.",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663520694523/QNUnZaUiQJdXtlLQ.png", // PORTADA MONIKA
    tags: ["Fan-Made", "Drama", "Romance"],
    status: "En desarrollo",
    statusColor: "#FF2D78",
    rating: 4.8,
    featured: true,
  },
  {
    id: 2,
    name: "Just Natsuki",
    subtitle: "Novela Visual Fan-Made",
    description:
      "Sumérgete en la historia de Natsuki, explorando su mundo más allá del club de literatura. Una narrativa íntima que profundiza en su personalidad.",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663520694523/ImCZGjlQqWHkygmQ.png", // PORTADA NATSUKI
    tags: ["Fan-Made", "Slice of Life"],
    status: "Disponible",
    statusColor: "#22c55e",
    rating: 4.5,
    featured: false,
  },
  {
    id: 3,
    name: "Just Yuri",
    subtitle: "Novela Visual Fan-Made",
    description:
      "Una aventura literaria con Yuri como protagonista. Descubre su amor por los libros, los misterios que la rodean y una historia que mezcla lo cotidiano con lo sobrenatural en una narrativa única.",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663522621232/wWSuFRWkAQVXHGQp.png", // PORTADA YURI
    tags: ["Fan-Made", "Misterio", "Literatura"],
    status: "Disponible",
    statusColor: "#22c55e",
    rating: 4.6,
    featured: false,
  },
];

export default function Proyectos() {
  const [activeProject, setActiveProject] = useState<number | null>(null);

  return (
    <div className="projects-page min-h-screen text-white overflow-x-hidden relative bg-[#080818]" style={{ backgroundImage: `linear-gradient(135deg, rgba(8, 8, 24, 0.88) 0%, rgba(26, 10, 26, 0.84) 50%, rgba(8, 8, 24, 0.88) 100%), url("${PROYECTOS_BG}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <BackgroundParticles />
      <Navbar />

      <AnimatePresence>
        {activeProject === 1 && (
          <MonikaProjectView isOpen={true} onClose={() => setActiveProject(null)} />
        )}
        {activeProject === 2 && (
          <NatsukiProjectView isOpen={true} onClose={() => setActiveProject(null)} />
        )}
        {activeProject === 3 && (
          <YuriProjectView isOpen={true} onClose={() => setActiveProject(null)} />
        )}
      </AnimatePresence>

      {/* Page Header */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center sm:text-left"
          >
            <span className="text-[#FF2D78] text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3 block">
              Nuestras creaciones
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Proyectos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D78] to-[#00F3FF]">Destacados</span>
            </h1>
            <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto sm:mx-0">
              Novelas visuales creadas con pasión por nuestra comunidad usando el motor Ren'Py. Historias únicas en español.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <section className="pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured project */}
          {projects.filter(p => p.featured).map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              onClick={() => setActiveProject(project.id)}
              className="project-card bg-white/5 border border-white/10 rounded-3xl overflow-hidden mb-8 relative cursor-pointer group hover:border-[#FF2D78]/40 transition-all backdrop-blur-none"
              style={{ contain: 'layout style paint' }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF2D78] to-[#00F3FF]" />
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Image - SIN OPACIDAD */}
                <div className="project-card-media relative h-48 sm:h-64 lg:h-auto min-h-[200px] sm:min-h-64 bg-[#0d0d24] flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5 group">
                  {/* Background Blur Fill */}
                  <img
                    src={project.image}
                    alt=""
                    className="project-cover-backdrop absolute inset-0 w-full h-full object-cover opacity-30 scale-105"
                    loading="lazy"
                    decoding="async"
                    aria-hidden="true"
                  />
                  {/* Main Image (Complete) */}
                  <img
                    src={project.image}
                    alt={project.name}
                    className="project-cover-img relative z-10 w-full h-full object-contain opacity-100 group-hover:scale-105 transition-transform duration-700 p-3 sm:p-4"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d0d24]/40 hidden lg:block" />
                  <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full bg-[#FF2D78] text-white">
                    DESTACADO
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-none">
                    <div className="bg-white/10 border border-white/20 px-6 py-3 rounded-full flex items-center gap-2 text-sm font-bold">
                      <Sparkles size={16} className="text-[#FF2D78]" />
                      Explorar Proyecto
                    </div>
                  </div>
                </div>
                {/* Info */}
                <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        background: `${project.statusColor}20`,
                        border: `1px solid ${project.statusColor}40`,
                        color: project.statusColor,
                      }}
                    >
                      {project.status}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-400 text-xs">
                      <Star size={12} fill="currentColor" />
                      <span>{project.rating}</span>
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {project.name}
                  </h2>
                  <p className="text-[#FF2D78] text-sm font-medium mb-4">{project.subtitle}</p>
                  <p className="text-white/60 text-base leading-relaxed mb-6">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-[#FF2D78] font-bold text-sm group-hover:translate-x-2 transition-transform">
                    Ver detalles del proyecto <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Other projects */}
          <div className="grid sm:grid-cols-2 gap-6">
            {projects.filter(p => !p.featured).map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                onClick={() => setActiveProject(project.id)}
                className="project-card bg-white/5 border border-white/10 rounded-3xl overflow-hidden cursor-pointer group hover:border-[#00F3FF]/40 transition-all backdrop-blur-none"
                style={{ contain: 'layout style paint' }}
              >
                {/* Image - SIN OPACIDAD */}
                <div className="project-card-media relative h-48 bg-[#0d0d24] flex items-center justify-center overflow-hidden border-b border-white/5 group">
                  {/* Background Blur Fill */}
                  <img
                    src={project.image}
                    alt=""
                    className="project-cover-backdrop absolute inset-0 w-full h-full object-cover opacity-30 scale-105"
                    loading="lazy"
                    decoding="async"
                    aria-hidden="true"
                  />
                  {/* Main Image (Complete) */}
                  <img
                    src={project.image}
                    alt={project.name}
                    className="project-cover-img relative z-10 w-full h-full object-contain opacity-100 group-hover:scale-105 transition-transform duration-700 p-4"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d24]/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-center gap-2">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        background: `${project.statusColor}20`,
                        border: `1px solid ${project.statusColor}40`,
                        color: project.statusColor,
                      }}
                    >
                      {project.status}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-400 text-xs">
                      <Star size={11} fill="currentColor" />
                      <span>{project.rating}</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-none">
                    <Sparkles size={24} className="text-[#00F3FF]" />
                  </div>
                </div>
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {project.name}
                  </h3>
                  <p className="text-[#00F3FF] text-xs font-medium mb-3">{project.subtitle}</p>
                  <p className="text-white/55 text-sm leading-relaxed mb-4 line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-[#00F3FF] font-bold text-xs group-hover:translate-x-2 transition-transform">
                    Explorar <ArrowRight size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Coming soon banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-10 bg-white/5 border border-white/10 rounded-3xl p-8 text-center relative overflow-hidden backdrop-blur-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF2D78]/5 via-[#a855f7]/5 to-[#00F3FF]/5 pointer-events-none" />
            <Gamepad2 size={32} className="text-[#FF2D78] mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Más proyectos en camino
            </h3>
            <p className="text-white/50 text-sm max-w-md mx-auto">
              Estamos trabajando en nuevas novelas visuales. Únete a nuestro Discord para ser el primero en enterarte.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
