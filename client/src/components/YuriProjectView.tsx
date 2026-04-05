import { motion } from "framer-motion";
import { ArrowLeft, Heart, Share2, Download, Star, Users, Calendar, Info } from "lucide-react";

interface Props {
  onClose: () => void;
}

const theme = {
  primary: "#9D4EDD",
  secondary: "#7C3AED",
  bg: "from-[#1a0a2e] to-[#0d0d24]",
  accent: "#9D4EDD",
  font: "'DDLCFont', sans-serif",
};

const project = {
  id: 3,
  name: "Just Yuri",
  subtitle: "Misterio, literatura y lo sobrenatural",
  description:
    "Una aventura literaria con Yuri como protagonista. Descubre su amor por los libros, los misterios que la rodean y una historia que mezcla lo cotidiano con lo sobrenatural en una narrativa única.",
  longDescription: `Just Yuri es una novela visual que explora el mundo interior de Yuri, su pasión por la literatura y los misterios que rodean su existencia.

Con una atmósfera envolvente que mezcla lo cotidiano con elementos sobrenaturales, seguimos a Yuri en un viaje de descubrimiento personal. Una historia que celebra la belleza de la literatura y la complejidad de la naturaleza humana.`,
  image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663518113549/KEigSkzYpCzkACRU.png",
  gallery: [
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663518113549/KEigSkzYpCzkACRU.png",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663518113549/KEigSkzYpCzkACRU.png",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663518113549/KEigSkzYpCzkACRU.png"
  ],
  status: "Disponible",
  rating: 4.6,
  downloads: 950,
  playtime: "4-5 horas",
  language: "Español",
  engine: "Ren'Py",
  themes: ["Misterio", "Literatura", "Sobrenatural"],
};

export default function YuriProjectView({ onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[100] bg-gradient-to-br ${theme.bg} text-white overflow-y-auto`}
    >
      {/* Hero Section */}
      <section className="pt-12 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#080818]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.button
            onClick={onClose}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
            whileHover={{ x: -4 }}
          >
            <ArrowLeft size={20} />
            Volver a Proyectos
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4"
              style={{ fontFamily: theme.font, color: theme.primary }}
            >
              {project.name}
            </h1>
            <p className="text-xl text-white/70 mb-6 max-w-2xl">{project.subtitle}</p>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold" style={{ color: theme.primary }}>
                  {project.rating}
                </span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={20} 
                      fill={i < Math.floor(project.rating) ? theme.primary : "transparent"} 
                      style={{ color: i < Math.floor(project.rating) ? theme.primary : "rgba(255,255,255,0.2)" }} 
                    />
                  ))}
                </div>
              </div>
              <span
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{ background: `${theme.primary}20`, color: theme.primary, border: `1px solid ${theme.primary}50` }}
              >
                {project.status}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-2"
            >
              {/* Description */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: theme.font }}>
                  Sobre este proyecto
                </h2>
                <p className="text-white/70 leading-relaxed mb-4">{project.description}</p>
                <p className="text-white/60 leading-relaxed whitespace-pre-line">{project.longDescription}</p>
              </div>

              {/* Gallery */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: theme.font }}>
                  Galería
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {project.gallery.map((img: string, i: number) => (
                    <motion.div
                      key={i}
                      className="aspect-video rounded-lg overflow-hidden glass-card cursor-pointer border border-white/10"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img src={img} alt={`Galería ${i + 1}`} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              {/* Info Card */}
              <div className="glass-card p-6 space-y-4 border border-white/10">
                <h3 className="text-lg font-bold flex items-center gap-2" style={{ fontFamily: theme.font }}>
                  <Info size={18} className="text-[#9D4EDD]" />
                  Información
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <p className="text-white/50">Tiempo de juego</p>
                    <p className="text-white font-medium">{project.playtime}</p>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <p className="text-white/50">Idioma</p>
                    <p className="text-white font-medium">{project.language}</p>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <p className="text-white/50">Motor</p>
                    <p className="text-white font-medium">{project.engine}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-white/50">Descargas</p>
                    <p className="text-white font-medium">{project.downloads.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Themes */}
              <div className="glass-card p-6 border border-white/10">
                <h3 className="text-lg font-bold mb-4" style={{ fontFamily: theme.font }}>
                  Temas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.themes.map((t: string) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ background: `${theme.primary}20`, color: theme.primary, border: `1px solid ${theme.primary}40` }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  className="w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#9D4EDD]/20"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                    color: "white",
                  }}
                >
                  <Download size={20} />
                  Descargar Mod
                </button>
                <button
                  className="w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 glass-card hover:bg-white/10 border border-white/10"
                >
                  <Share2 size={20} />
                  Compartir
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
