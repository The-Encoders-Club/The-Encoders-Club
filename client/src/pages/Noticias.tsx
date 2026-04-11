/* ============================================================
   NOTICIAS PAGE — The Encoders Club
   Style: Neon Synthwave Gaming
   ============================================================ */
import { motion } from "framer-motion";
import { Calendar, Tag, ArrowRight, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const allNews = [
  {
    id: 1,
    title: "Nuevo Tutorial de Ren'Py: Desde Cero",
    description:
      "Hemos lanzado un tutorial completo para principiantes que cubre todo lo que necesitas saber para empezar a crear tu primera novela visual con Ren'Py. Desde la instalación hasta tu primera escena con diálogos, música y personajes.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    date: "1 Abr 2026",
    tag: "Tutorial",
    tagColor: "#4D9FFF",
    featured: true,
  },
  {
    id: 2,
    title: "Concurso Anual de Novelas Visuales 2026",
    description:
      "¡Inscripciones abiertas para nuestro concurso anual! Este año el tema es 'Conexiones Inesperadas'. Participa con tu novela visual y gana premios increíbles, incluyendo menciones en nuestro canal de YouTube y la comunidad.",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop",
    date: "28 Mar 2026",
    tag: "Evento",
    tagColor: "#FF2D78",
    featured: false,
  },
  {
    id: 3,
    title: "Webinar Gratuito: Diseño de Personajes",
    description:
      "Únete a nuestro webinar gratuito donde exploraremos técnicas avanzadas de diseño de personajes para novelas visuales. Aprenderás sobre expresiones, poses y cómo dar vida a tus protagonistas.",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=400&fit=crop",
    date: "25 Mar 2026",
    tag: "Webinar",
    tagColor: "#a855f7",
    featured: false,
  },
  {
    id: 4,
    title: "Actualización de la Plataforma",
    description:
      "Hemos mejorado nuestra plataforma con nuevas herramientas para los creadores. Ahora puedes subir tus proyectos más fácilmente y conectar con otros miembros de la comunidad.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
    date: "20 Mar 2026",
    tag: "Actualización",
    tagColor: "#22c55e",
    featured: false,
  },
  {
    id: 5,
    title: "Just Natsuki — Versión 1.2 Disponible",
    description:
      "La nueva versión de Just Natsuki ya está disponible con correcciones de errores, nuevas escenas y una banda sonora mejorada. Descárgala ahora desde nuestra sección de proyectos.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=400&fit=crop",
    date: "15 Mar 2026",
    tag: "Lanzamiento",
    tagColor: "#FF2D78",
    featured: false,
  },
  {
    id: 6,
    title: "Comunidad supera los 500 miembros en Discord",
    description:
      "¡Hemos alcanzado un hito increíble! Nuestra comunidad en Discord ya cuenta con más de 500 miembros activos. Gracias a todos por ser parte de este proyecto y ayudarnos a crecer.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=400&fit=crop",
    date: "10 Mar 2026",
    tag: "Comunidad",
    tagColor: "#4D9FFF",
    featured: false,
  },
];

export default function Noticias() {
  const featured = allNews.find(n => n.featured);
  const rest = allNews.filter(n => !n.featured);

  return (
    <div className="min-h-screen bg-[#080818] text-white overflow-x-hidden">
      <Navbar />

      {/* Page Header */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#a855f7]/5 to-transparent pointer-events-none" />
        <div className="absolute top-20 right-1/3 w-64 h-64 rounded-full bg-[#a855f7]/8 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#a855f7] text-sm font-semibold uppercase tracking-widest mb-3 block">
              Mantente al día
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Noticias y <span className="brand-gradient-text">Novedades</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl">
              Entérate de las últimas actualizaciones, eventos y lanzamientos de The Encoders Club.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured news */}
          {featured && (
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="glass-card overflow-hidden mb-10 relative group cursor-pointer"
              onClick={() => toast.info("Artículo completo próximamente disponible.")}
            >
              <div className="absolute top-0 left-0 w-full h-1 brand-gradient" />
              <div className="grid lg:grid-cols-5 gap-0">
                {/* Image */}
                <div className="lg:col-span-3 relative h-64 lg:h-80 overflow-hidden">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d0d24]/70 hidden lg:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d24]/80 to-transparent lg:hidden" />
                  <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full bg-[#FF2D78] text-white">
                    DESTACADO
                  </span>
                </div>
                {/* Content */}
                <div className="lg:col-span-2 p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
                      style={{
                        background: `${featured.tagColor}20`,
                        border: `1px solid ${featured.tagColor}40`,
                        color: featured.tagColor,
                      }}
                    >
                      <Tag size={10} />
                      {featured.tag}
                    </span>
                    <span className="text-xs text-white/40 flex items-center gap-1">
                      <Calendar size={11} />
                      {featured.date}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3 leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {featured.title}
                  </h2>
                  <p className="text-white/55 text-sm leading-relaxed mb-6 line-clamp-4">
                    {featured.description}
                  </p>
                  <button className="text-[#FF2D78] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                    Leer artículo completo <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </motion.article>
          )}

          {/* News grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((item, i) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card overflow-hidden group cursor-pointer"
                onClick={() => toast.info("Artículo completo próximamente disponible.")}
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span
                    className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
                    style={{
                      background: `${item.tagColor}25`,
                      border: `1px solid ${item.tagColor}50`,
                      color: item.tagColor,
                    }}
                  >
                    <Tag size={9} />
                    {item.tag}
                  </span>
                </div>
                {/* Content */}
                <div className="p-5">
                  <p className="text-xs text-white/40 flex items-center gap-1.5 mb-2">
                    <Calendar size={11} />
                    {item.date}
                  </p>
                  <h3 className="font-bold text-white text-sm mb-2 leading-snug line-clamp-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed line-clamp-3 mb-4">
                    {item.description}
                  </p>
                  <button className="text-xs text-[#FF2D78] font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                    Leer más <ChevronRight size={12} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
