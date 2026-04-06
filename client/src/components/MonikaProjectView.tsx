import { motion } from "framer-motion";
import { ArrowLeft, Heart, Share2, Download, Star, Users, Calendar, Info } from "lucide-react";

interface Props {
  onClose: () => void;
}

const theme = {
  primary: "#FF2D78",
  secondary: "#e0195e",
  accent: "#00FF41",
  bg: "from-[#0a0a1a] via-[#1a0a1a] to-[#0a0a1a]",
  text: "#F0F0FF",
  font: "'M1Fixed', monospace",
};

const project = {
  id: 1,
  name: "Monika After History",
  subtitle: "Una historia alternativa de reflexión y existencia",
  description:
    "Una historia alternativa que explora qué habría pasado después de los eventos de Doki Doki Literature Club. Monika, consciente de su realidad, decide escribir su propia historia. Una experiencia emocional llena de reflexiones sobre la existencia, el amor y la narrativa.",
  longDescription: `Monika After History es una novela visual fan-made que profundiza en el personaje de Monika después de los eventos del juego original. La historia explora temas de consciencia, realidad y libre albedrío.

Con una narrativa introspectiva y emocional, seguimos a Monika mientras intenta entender su lugar en el mundo y construir su propio destino. Una experiencia única que mezcla drama, romance y reflexión filosófica.`,
  image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663518113549/lqfZTkbzoCrwSxwy.png",
  gallery: [
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663518113549/txUegLxciaFhYmJX.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663518113549/6DMnty8QCYU2.jpg",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663518113549/vtfvrwBddwZr.png"
  ],
  status: "En desarrollo",
  rating: 4.8,
  downloads: 1250,
  playtime: "4-6 horas",
  language: "Español",
  engine: "Ren'Py",
  themes: ["Drama", "Romance", "Reflexión"],
};

export default function MonikaProjectView({ onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[100] bg-[#0a0a1a] text-white overflow-y-auto monika-theme`}
    >
      {/* Background Overlay con efecto glitch */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} opacity-95 pointer-events-none`} />
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(0deg, rgba(0, 255, 65, 0.03) 0px, rgba(0, 255, 65, 0.03) 1px, transparent 1px, transparent 2px)"
      }} />
      
      {/* Hero Section */}
      <section className="pt-12 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a1a]" />
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
                className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 tracking-wider"
                style={{ fontFamily: theme.font, color: theme.primary, textShadow: `0 0 20px ${theme.accent}40` }}
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
                boxShadow: `0 0 30px ${theme.primary}60, inset 0 0 20px ${theme.accent}20`
              }}
            >
              <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-transparent" />
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
                background: `${theme.primary}08`,
                boxShadow: `inset 0 0 15px ${theme.accent}10`
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
                        boxShadow: `0 0 15px ${theme.accent}20`
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
                boxShadow: `0 0 20px ${theme.primary}30, inset 0 0 15px ${theme.accent}08`
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
                        fontFamily: theme.font,
                        boxShadow: `0 0 8px ${theme.accent}20`
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
                    boxShadow: `0 0 20px ${theme.primary}60, 0 0 40px ${theme.accent}30`,
                    border: `2px solid ${theme.primary}60`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 30px ${theme.primary}80, 0 0 60px ${theme.accent}50`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 20px ${theme.primary}60, 0 0 40px ${theme.accent}30`;
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
