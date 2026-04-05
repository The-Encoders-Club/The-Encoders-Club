/* ============================================================
   PROYECTOS PAGE — The Encoders Club
   Style: Neon Synthwave Gaming
   ============================================================ */
import { motion } from "framer-motion";
import { Download, ExternalLink, Gamepad2, Star } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663516100892/kzug5rLPLvVJzu5QVE66vY/logo_435f8d5a.png";

const projectIds: Record<string, string> = {
  "Monika After History": "monika",
  "Just Natsuki": "natsuki",
  "Just Yuri": "yuri",
};

const projects = [
  {
    id: 1,
    slug: "monika",
    name: "Monika After History",
    subtitle: "Novela Visual Fan-Made",
    description:
      "Una historia alternativa que explora qué habría pasado después de los eventos de Doki Doki Literature Club. Monika, consciente de su realidad, decide escribir su propia historia. Una experiencia emocional llena de reflexiones sobre la existencia, el amor y la narrativa.",
    image: LOGO_URL,
    downloadUrl: "https://ko-fi.com/theencodersclub",
    tags: ["Fan-Made", "Drama", "Romance"],
    status: "En desarrollo",
    statusColor: "#FF2D78",
    rating: 4.8,
    featured: true,
  },
  {
    id: 2,
    slug: "natsuki",
    name: "Just Natsuki",
    subtitle: "Novela Visual Fan-Made",
    description:
      "Sumérgete en la historia de Natsuki, explorando su mundo más allá del club de literatura. Una narrativa íntima que profundiza en su personalidad, sus sueños y los desafíos que enfrenta día a día.",
    image: LOGO_URL,
    downloadUrl: "https://ko-fi.com/theencodersclub",
    tags: ["Fan-Made", "Slice of Life"],
    status: "Disponible",
    statusColor: "#22c55e",
    rating: 4.5,
    featured: false,
  },
  {
    id: 3,
    slug: "yuri",
    name: "Just Yuri",
    subtitle: "Novela Visual Fan-Made",
    description:
      "Una aventura literaria con Yuri como protagonista. Descubre su amor por los libros, los misterios que la rodean y una historia que mezcla lo cotidiano con lo sobrenatural en una narrativa única.",
    image: LOGO_URL,
    downloadUrl: "https://ko-fi.com/theencodersclub",
    tags: ["Fan-Made", "Misterio", "Literatura"],
    status: "Disponible",
    statusColor: "#22c55e",
    rating: 4.6,
    featured: false,
  },
];

export default function Proyectos() {
  return (
    <div className="min-h-screen bg-[#080818] text-white overflow-x-hidden">
      <Navbar />

      {/* Page Header */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF2D78]/5 to-transparent pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-64 h-64 rounded-full bg-[#FF2D78]/8 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#FF2D78] text-sm font-semibold uppercase tracking-widest mb-3 block">
              Nuestras creaciones
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Proyectos <span className="brand-gradient-text">Destacados</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl">
              Novelas visuales creadas con pasión por nuestra comunidad usando el motor Ren'Py. Historias únicas en español.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured project */}
          {projects.filter(p => p.featured).map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="glass-card overflow-hidden mb-8 relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 brand-gradient" />
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative h-64 lg:h-auto min-h-64 bg-gradient-to-br from-[#FF2D78]/10 to-[#4D9FFF]/10 flex items-center justify-center overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-48 h-48 object-contain opacity-80"
                    style={{ filter: "drop-shadow(0 0 30px rgba(255,45,120,0.4))" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d0d24]/60 hidden lg:block" />
                  <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full bg-[#FF2D78] text-white">
                    DESTACADO
                  </span>
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
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {project.name}
                  </h2>
                  <p className="text-[#FF2D78] text-sm font-medium mb-4">{project.subtitle}</p>
                  <p className="text-white/60 leading-relaxed mb-6 text-sm">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/8 border border-white/12 text-white/60">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={`/proyectos/${project.slug}`}
                      className="btn-primary text-sm px-5 py-2.5"
                    >
                      <ExternalLink size={16} />
                      Ver Proyecto
                    </Link>
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
                className="glass-card overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-[#4D9FFF]/10 to-[#a855f7]/10 flex items-center justify-center overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-32 h-32 object-contain opacity-70"
                    style={{ filter: "drop-shadow(0 0 20px rgba(77,159,255,0.3))" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d24]/80 to-transparent" />
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
                </div>
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {project.name}
                  </h3>
                  <p className="text-[#4D9FFF] text-xs font-medium mb-3">{project.subtitle}</p>
                  <p className="text-white/55 text-sm leading-relaxed mb-4 line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full bg-white/6 border border-white/10 text-white/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/proyectos/${project.slug}`}
                    className="btn-primary text-sm px-5 py-2.5 w-full justify-center"
                  >
                    <ExternalLink size={15} />
                    Ver Proyecto
                  </Link>
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
            className="mt-10 glass-card p-8 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF2D78]/5 via-[#a855f7]/5 to-[#4D9FFF]/5 pointer-events-none" />
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
