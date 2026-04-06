import { motion } from "framer-motion";
import { ArrowLeft, Heart, Share2, Download, Star, Users, Calendar, Info } from "lucide-react";

interface Props {
  onClose: () => void;
}

const theme = {
  primary: "#FF6B9D",
  secondary: "#FF8FB3",
  accent: "#FFB6D9",
  bg: "from-[#1a0d0d] via-[#2a1a1a] to-[#1a0d0d]",
  text: "#F0F0FF",
  font: "'Space Grotesk', sans-serif",
};

const project = {
  id: 2,
  name: "Just Natsuki",
  subtitle: "La historia de Natsuki más allá del club",
  description:
    "Sumérgete en la historia de Natsuki, explorando su mundo más allá del club de literatura. Una narrativa íntima que profundiza en su personalidad, sus sueños y los desafíos que enfrenta día a día.",
  longDescription: `Just Natsuki es una novela visual que se enfoca en el personaje de Natsuki, proporcionando una perspectiva más profunda de su vida, sus pasiones y sus luchas personales.

A través de momentos cotidianos y encuentros significativos, descubrimos quién es realmente Natsuki más allá de lo que vemos en el juego original. Una historia de crecimiento personal y amistad.`,
  image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663518113549/DPGVHSibyvFIguxX.png",
  gallery: [
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663518113549/jratWxEJRZdNhGWL.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663518113549/MmBSWSqNDgmynfPd.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663518113549/EpB1Il67Biom.jpg"
  ],
  status: "Disponible",
  rating: 4.5,
  downloads: 890,
  playtime: "3-4 horas",
  language: "Español",
  engine: "Ren'Py",
  themes: ["Slice of Life", "Amistad", "Crecimiento"],
};

export default function NatsukiProjectView({ onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[100] bg-[#1a0d0d] text-white overflow-y-auto natsuki-theme`}
    >
      {/* Background Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} opacity-95 pointer-events-none`} />
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255, 107, 157, 0.1) 0%, transparent 50%)"
      }} />
      
      {/* Hero Section */}
      <section className="pt-12 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1a0d0d]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.button
            onClick={onClose}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
            whileHover={{ x: -4 }}
            style={{ fontFamily: theme.font }}
          >
            <ArrowLeft size={20} />
            Volver a Proyectos
          </motion.button>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4"
                style={{ fontFamily: theme.font, color: theme.primary, textShadow: `0 0 15px ${theme.accent}40` }}
              >
                {project.name}
              </h1>
              <p className="text-xl text-white/70 mb-6 max-w-2xl" style={{ fontFamily: theme.font }}>
                {project.subtitle}
              </p>

              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold" style={{ color: theme.primary, fontFamily: theme.font }}>
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
                  style={{ 
                    background: `${theme.primary}20`, 
                    color: theme.primary, 
                    border: `2px solid ${theme.primary}50`,
                    fontFamily: theme.font,
                    boxShadow: `0 0 10px ${theme.primary}40`
                  }}
                >
                  {project.status}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-video rounded-2xl overflow-hidden border-2"
              style={{
                borderColor: theme.primary,
                boxShadow: `0 0 30px ${theme.primary}60`
              }}
            >
              <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0d0d] via-transparent to-transparent" />
            </motion.div>
          </div>
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
              <div className="mb-12 p-6 rounded-lg border-2" style={{
                borderColor: `${theme.primary}40`,
                background: `${theme.primary}08`
              }}>
                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: theme.font, color: theme.primary }}>
                  Sobre este proyecto
                </h2>
                <p className="text-white/70 leading-relaxed mb-4" style={{ fontFamily: theme.font }}>
                  {project.description}
                </p>
                <p className="text-white/60 leading-relaxed whitespace-pre-line" style={{ fontFamily: theme.font }}>
                  {project.longDescription}
                </p>
              </div>

              {/* Gallery */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: theme.font, color: theme.primary }}>
                  Galería (Español)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {project.gallery.map((img: string, i: number) => (
                    <motion.div
                      key={i}
                      className="aspect-video rounded-lg overflow-hidden border-2 cursor-pointer"
                      style={{
                        borderColor: `${theme.primary}40`,
                        boxShadow: `0 0 15px ${theme.primary}20`
                      }}
                      whileHover={{ 
                        scale: 1.05, 
                        borderColor: theme.primary,
                        boxShadow: `0 0 25px ${theme.primary}60`
                      }}
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
              <div className="p-6 space-y-4 border-2 rounded-2xl" style={{
                borderColor: `${theme.primary}40`,
                background: `${theme.primary}08`,
                boxShadow: `0 0 20px ${theme.primary}30`
              }}>
                <h3 className="text-lg font-bold flex items-center gap-2" style={{ fontFamily: theme.font, color: theme.primary }}>
                  <Info size={18} />
                  Información
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center border-b" style={{ borderColor: `${theme.primary}20` }}>
                    <p className="text-white/50" style={{ fontFamily: theme.font }}>Tiempo de juego</p>
                    <p className="text-white font-medium" style={{ fontFamily: theme.font }}>{project.playtime}</p>
                  </div>
                  <div className="flex justify-between items-center border-b" style={{ borderColor: `${theme.primary}20` }}>
                    <p className="text-white/50" style={{ fontFamily: theme.font }}>Idioma</p>
                    <p className="text-white font-medium" style={{ fontFamily: theme.font }}>{project.language}</p>
                  </div>
                  <div className="flex justify-between items-center border-b" style={{ borderColor: `${theme.primary}20` }}>
                    <p className="text-white/50" style={{ fontFamily: theme.font }}>Motor</p>
                    <p className="text-white font-medium" style={{ fontFamily: theme.font }}>{project.engine}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-white/50" style={{ fontFamily: theme.font }}>Descargas</p>
                    <p className="text-white font-medium" style={{ fontFamily: theme.font }}>{project.downloads.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Themes */}
              <div className="p-6 border-2 rounded-2xl" style={{
                borderColor: `${theme.primary}40`,
                background: `${theme.primary}08`
              }}>
                <h3 className="text-lg font-bold mb-4" style={{ fontFamily: theme.font, color: theme.primary }}>
                  Temas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.themes.map((t: string) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ 
                        background: `${theme.primary}20`, 
                        color: theme.primary, 
                        border: `1px solid ${theme.primary}40`,
                        fontFamily: theme.font
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  className="w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                    color: "white",
                    fontFamily: theme.font,
                    boxShadow: `0 0 20px ${theme.primary}60`,
                    border: `2px solid ${theme.primary}60`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 30px ${theme.primary}80`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 20px ${theme.primary}60`;
                  }}
                >
                  <Download size={20} />
                  Descargar Mod
                </button>
                <button
                  className="w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border-2"
                  style={{
                    borderColor: `${theme.primary}60`,
                    background: `${theme.primary}08`,
                    color: theme.primary,
                    fontFamily: theme.font,
                    boxShadow: `0 0 15px ${theme.primary}40`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${theme.primary}15`;
                    e.currentTarget.style.boxShadow = `0 0 25px ${theme.primary}60`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${theme.primary}08`;
                    e.currentTarget.style.boxShadow = `0 0 15px ${theme.primary}40`;
                  }}
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
