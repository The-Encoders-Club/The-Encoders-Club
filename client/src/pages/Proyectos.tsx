import React, { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles, ArrowRight, Gamepad2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Lazy loading de los modales pesados — solo se cargan cuando el usuario los abre
const MonikaProjectView = lazy(() => import('../components/MonikaProjectView'));
const NatsukiProjectView = lazy(() => import('../components/NatsukiProjectView'));
const YuriProjectView = lazy(() => import('../components/YuriProjectView'));

const PROYECTOS_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663520694523/gdw63Pfk2mCpqaap3WKi6Q/ProyectoFondo_c3356f10.jpg";

const projects = [
  {
    id: 1,
    name: "Monika After History",
    subtitle: "Novela Visual Fan-Made",
    description:
      "Una historia alternativa que explora qué habría pasado después de los eventos de Doki Doki Literature Club. Monika, consciente de su realidad, decide escribir su propia historia.",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663520694523/QNUnZaUiQJdXtlLQ.png",
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
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663520694523/ImCZGjlQqWHkygmQ.png",
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
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663522621232/wWSuFRWkAQVXHGQp.png",
    tags: ["Fan-Made", "Misterio", "Literatura"],
    status: "Disponible",
    statusColor: "#22c55e",
    rating: 4.6,
    featured: false,
  },
];

// Fallback minimalista para Suspense
function ModalFallback() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a1a] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#FF2D78] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function Proyectos() {
  const [activeProject, setActiveProject] = useState<number | null>(null);

  return (
    /* background-attachment: fixed eliminado — causa repaint constante en móvil */
    <div
      className="min-h-screen text-white overflow-x-hidden relative bg-[#080818]"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(8, 8, 24, 0.85) 0%, rgba(26, 10, 26, 0.8) 50%, rgba(8, 8, 24, 0.85) 100%), url("${PROYECTOS_BG}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Navbar />

      {/* Modales cargados con lazy + Suspense */}
      <AnimatePresence>
        {activeProject !== null && (
          <Suspense fallback={<ModalFallback />}>
            {activeProject === 1 && (
              <MonikaProjectView isOpen={true} onClose={() => setActiveProject(null)} />
            )}
            {activeProject === 2 && (
              <NatsukiProjectView isOpen={true} onClose={() => setActiveProject(null)} />
            )}
            {activeProject === 3 && (
              <YuriProjectView isOpen={true} onClose={() => setActiveProject(null)} />
            )}
          </Suspense>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[#FF2D78] text-sm font-semibold uppercase tracking-widest mb-3 block">
              Nuestras creaciones
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Proyectos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D78] to-[#00F3FF]">Destacados</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl">
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
              transition={{ duration: 0.5 }}
              onClick={() => setActiveProject(project.id)}
              className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden mb-8 relative cursor-pointer group hover:border-[#FF2D78]/40 transition-colors"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF2D78] to-[#00F3FF]" />
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative h-64 lg:h-auto min-h-64 bg-[#0d0d24] flex items-center justify-center overflow-hidden border-r border-white/5">
                  {/* Imagen principal con lazy loading */}
                  <img
                    src={project.image}
                    alt={project.name}
                    loading="lazy"
                    decoding="async"
                    className="relative z-10 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d0d24]/40 hidden lg:block" />
                  <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full bg-[#FF2D78] text-white z-20">
                    DESTACADO
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 z-20">
                    <div className="bg-white/10 border border-white/20 px-6 py-3 rounded-full flex items-center gap-2 text-sm font-bold">
                      <Sparkles size={16} className="text-[#FF2D78]" />
                      Explorar Proyecto
                    </div>
                  </div>
                </div>
                {/* Info */}
                <div className="p-8 lg:p-10 flex flex-col justify-center">
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
                  <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
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
                transition={{ duration: 0.5, delay: i * 0.08 }}
                onClick={() => setActiveProject(project.id)}
                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden cursor-pointer group hover:border-[#00F3FF]/40 transition-colors"
              >
                {/* Image */}
                <div className="relative h-48 bg-[#0d0d24] flex items-center justify-center overflow-hidden border-b border-white/5">
                  <img
                    src={project.image}
                    alt={project.name}
                    loading="lazy"
                    decoding="async"
                    className="relative z-10 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d24]/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-center gap-2 z-10">
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
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 z-20">
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
            transition={{ duration: 0.5 }}
            className="mt-10 bg-white/5 border border-white/10 rounded-3xl p-8 text-center relative overflow-hidden"
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
