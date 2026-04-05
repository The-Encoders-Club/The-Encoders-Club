/* ============================================================
   PROYECTO DETALLE PAGE — The Encoders Club
   Style: Tematizado según el proyecto (Monika, Natsuki, Yuri)
   ============================================================ */
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663516100892/kzug5rLPLvVJzu5QVE66vY/logo_435f8d5a.png";

// Temas por proyecto
const projectThemes: Record<string, { primary: string; secondary: string; bg: string; accent: string; font: string }> = {
  monika: {
    primary: "#FF2D78",
    secondary: "#e0195e",
    bg: "from-[#1a0a1a] to-[#0d0d24]",
    accent: "#FF2D78",
    font: "'Space Grotesk', sans-serif",
  },
  natsuki: {
    primary: "#FF6B9D",
    secondary: "#FF8FB3",
    bg: "from-[#1a0d0d] to-[#0d0d24]",
    accent: "#FF6B9D",
    font: "'Space Grotesk', sans-serif",
  },
  yuri: {
    primary: "#9D4EDD",
    secondary: "#7C3AED",
    bg: "from-[#1a0a2e] to-[#0d0d24]",
    accent: "#9D4EDD",
    font: "'Space Grotesk', sans-serif",
  },
};

const projects: Record<string, any> = {
  monika: {
    id: 1,
    name: "Monika After History",
    subtitle: "Una historia alternativa de reflexión y existencia",
    description:
      "Una historia alternativa que explora qué habría pasado después de los eventos de Doki Doki Literature Club. Monika, consciente de su realidad, decide escribir su propia historia. Una experiencia emocional llena de reflexiones sobre la existencia, el amor y la narrativa.",
    longDescription: `Monika After History es una novela visual fan-made que profundiza en el personaje de Monika después de los eventos del juego original. La historia explora temas de consciencia, realidad y libre albedrío.

Con una narrativa introspectiva y emocional, seguimos a Monika mientras intenta entender su lugar en el mundo y construir su propio destino. Una experiencia única que mezcla drama, romance y reflexión filosófica.`,
    image: LOGO_URL,
    gallery: [LOGO_URL, LOGO_URL, LOGO_URL],
    status: "En desarrollo",
    rating: 4.8,
    downloads: 1250,
    playtime: "4-6 horas",
    language: "Español",
    engine: "Ren'Py",
    themes: ["Drama", "Romance", "Reflexión"],
  },
  natsuki: {
    id: 2,
    name: "Just Natsuki",
    subtitle: "La historia de Natsuki más allá del club",
    description:
      "Sumérgete en la historia de Natsuki, explorando su mundo más allá del club de literatura. Una narrativa íntima que profundiza en su personalidad, sus sueños y los desafíos que enfrenta día a día.",
    longDescription: `Just Natsuki es una novela visual que se enfoca en el personaje de Natsuki, proporcionando una perspectiva más profunda de su vida, sus pasiones y sus luchas personales.

A través de momentos cotidianos y encuentros significativos, descubrimos quién es realmente Natsuki más allá de lo que vemos en el juego original. Una historia de crecimiento personal y amistad.`,
    image: LOGO_URL,
    gallery: [LOGO_URL, LOGO_URL, LOGO_URL],
    status: "Disponible",
    rating: 4.5,
    downloads: 890,
    playtime: "3-4 horas",
    language: "Español",
    engine: "Ren'Py",
    themes: ["Slice of Life", "Amistad", "Crecimiento"],
  },
  yuri: {
    id: 3,
    name: "Just Yuri",
    subtitle: "Misterio, literatura y lo sobrenatural",
    description:
      "Una aventura literaria con Yuri como protagonista. Descubre su amor por los libros, los misterios que la rodean y una historia que mezcla lo cotidiano con lo sobrenatural en una narrativa única.",
    longDescription: `Just Yuri es una novela visual que explora el mundo interior de Yuri, su pasión por la literatura y los misterios que rodean su existencia.

Con una atmósfera envolvente que mezcla lo cotidiano con elementos sobrenaturales, seguimos a Yuri en un viaje de descubrimiento personal. Una historia que celebra la belleza de la literatura y la complejidad de la naturaleza humana.`,
    image: LOGO_URL,
    gallery: [LOGO_URL, LOGO_URL, LOGO_URL],
    status: "Disponible",
    rating: 4.6,
    downloads: 950,
    playtime: "4-5 horas",
    language: "Español",
    engine: "Ren'Py",
    themes: ["Misterio", "Literatura", "Sobrenatural"],
  },
};

export default function ProyectoDetalle() {
  const params = useParams();
  const [, navigate] = useLocation();
  const projectId = params.id as string;
  const project = projects[projectId];
  const theme = projectThemes[projectId] || projectThemes.monika;

  if (!project) {
    return (
      <div className="min-h-screen bg-[#080818] text-white flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Proyecto no encontrado</h1>
          <button
            onClick={() => navigate("/proyectos")}
            className="btn-primary"
          >
            <ArrowLeft size={18} />
            Volver a Proyectos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} text-white overflow-x-hidden`}>
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#080818]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.button
            onClick={() => navigate("/proyectos")}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
            whileHover={{ x: -4 }}
          >
            <ArrowLeft size={20} />
            Volver
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
                    <span key={i} style={{ color: i < Math.floor(project.rating) ? theme.primary : "rgba(255,255,255,0.2)" }}>
                      ★
                    </span>
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
      <section className="pb-24">
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
                <p className="text-white/60 leading-relaxed">{project.longDescription}</p>
              </div>

              {/* Gallery */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: theme.font }}>
                  Galería
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {project.gallery.map((img: string, i: number) => (
                    <motion.div
                      key={i}
                      className="aspect-square rounded-lg overflow-hidden glass-card cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img src={img} alt={`Galería ${i + 1}`} className="w-full h-full object-cover" />
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
              <div className="glass-card p-6 space-y-4">
                <h3 className="text-lg font-bold" style={{ fontFamily: theme.font }}>
                  Información
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-white/50 mb-1">Tiempo de juego</p>
                    <p className="text-white">{project.playtime}</p>
                  </div>
                  <div>
                    <p className="text-white/50 mb-1">Idioma</p>
                    <p className="text-white">{project.language}</p>
                  </div>
                  <div>
                    <p className="text-white/50 mb-1">Motor</p>
                    <p className="text-white">{project.engine}</p>
                  </div>
                  <div>
                    <p className="text-white/50 mb-1">Descargas</p>
                    <p className="text-white">{project.downloads.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Themes */}
              <div className="glass-card p-6">
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
                  className="w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                    color: "white",
                  }}
                >
                  <Heart size={18} />
                  Descargar
                </button>
                <button
                  className="w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 glass-card hover:bg-white/10"
                >
                  <Share2 size={18} />
                  Compartir
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
