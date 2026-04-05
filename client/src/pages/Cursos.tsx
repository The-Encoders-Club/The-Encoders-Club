/* ============================================================
   CURSOS PAGE — The Encoders Club
   Style: Neon Synthwave Gaming
   ============================================================ */
import { motion } from "framer-motion";
import { BookOpen, Clock, ChevronRight, Zap, Code, Palette, Music, Users, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const courses = [
  {
    id: 1,
    name: "Introducción a Ren'Py",
    description: "Aprende los fundamentos del motor Ren'Py desde cero. Configura tu entorno, crea tu primer diálogo y entiende la estructura básica de una novela visual.",
    level: "Principiante",
    levelColor: "#22c55e",
    duration: "4 horas",
    lessons: 12,
    icon: BookOpen,
    iconColor: "#22c55e",
    available: true,
    topics: ["Instalación y configuración", "Sintaxis básica", "Personajes y escenas", "Música y efectos de sonido"],
  },
  {
    id: 2,
    name: "Programación Avanzada",
    description: "Domina las características avanzadas de Ren'Py. Aprende Python integrado, variables, condiciones, rutas múltiples y sistemas de puntos.",
    level: "Intermedio",
    levelColor: "#FF2D78",
    duration: "8 horas",
    lessons: 20,
    icon: Code,
    iconColor: "#FF2D78",
    available: true,
    topics: ["Python en Ren'Py", "Variables y condicionales", "Múltiples rutas", "Sistemas de puntos/karma"],
  },
  {
    id: 3,
    name: "Diseño de Narrativa",
    description: "Crea historias memorables con técnicas profesionales de escritura. Aprende estructura narrativa, desarrollo de personajes y cómo crear giros inesperados.",
    level: "Avanzado",
    levelColor: "#4D9FFF",
    duration: "6 horas",
    lessons: 15,
    icon: Palette,
    iconColor: "#4D9FFF",
    available: true,
    topics: ["Estructura narrativa", "Desarrollo de personajes", "Diálogos naturales", "Finales múltiples"],
  },
  {
    id: 4,
    name: "Arte y Sprites",
    description: "Aprende a crear y animar sprites para tus personajes. Desde el diseño básico hasta la integración perfecta con Ren'Py.",
    level: "Intermedio",
    levelColor: "#FF2D78",
    duration: "5 horas",
    lessons: 14,
    icon: Palette,
    iconColor: "#a855f7",
    available: false,
    topics: ["Diseño de sprites", "Expresiones faciales", "Animaciones", "Integración en Ren'Py"],
  },
  {
    id: 5,
    name: "Música y Sonido",
    description: "Descubre cómo crear la atmósfera perfecta con música y efectos de sonido. Aprende a integrar audio de manera profesional en tus proyectos.",
    level: "Principiante",
    levelColor: "#22c55e",
    duration: "3 horas",
    lessons: 8,
    icon: Music,
    iconColor: "#22c55e",
    available: false,
    topics: ["Tipos de audio en Ren'Py", "Música de fondo", "Efectos de sonido", "Transiciones de audio"],
  },
  {
    id: 6,
    name: "Publicación y Distribución",
    description: "Lleva tu novela visual al mundo. Aprende a exportar para múltiples plataformas, crear una página de descarga y conectar con tu audiencia.",
    level: "Avanzado",
    levelColor: "#4D9FFF",
    duration: "4 horas",
    lessons: 10,
    icon: Users,
    iconColor: "#4D9FFF",
    available: false,
    topics: ["Exportar para PC/Mac/Linux", "Publicar en itch.io", "Marketing básico", "Comunidad y feedback"],
  },
];

const levelOrder = ["Principiante", "Intermedio", "Avanzado"];

export default function Cursos() {
  return (
    <div className="min-h-screen bg-[#080818] text-white overflow-x-hidden">
      <Navbar />

      {/* Page Header */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4D9FFF]/5 to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-[#4D9FFF]/8 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#4D9FFF] text-sm font-semibold uppercase tracking-widest mb-3 block">
              Aprende con nosotros
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Cursos de <span className="brand-gradient-text">Ren'Py</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl">
              Desde principiante hasta experto. Aprende a crear novelas visuales profesionales en español con nuestros tutoriales.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Level legend */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Principiante", color: "#22c55e" },
              { label: "Intermedio", color: "#FF2D78" },
              { label: "Avanzado", color: "#4D9FFF" },
            ].map((lvl) => (
              <div
                key={lvl.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                style={{
                  background: `${lvl.color}12`,
                  border: `1px solid ${lvl.color}30`,
                  color: lvl.color,
                }}
              >
                <Zap size={13} />
                {lvl.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, i) => {
              const Icon = course.icon;
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className={`glass-card p-6 flex flex-col relative overflow-hidden ${!course.available ? "opacity-70" : ""}`}
                >
                  {/* Top accent */}
                  <div
                    className="absolute top-0 left-0 w-full h-0.5"
                    style={{ background: `linear-gradient(90deg, ${course.iconColor}, transparent)` }}
                  />

                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        background: `${course.iconColor}15`,
                        border: `1px solid ${course.iconColor}30`,
                      }}
                    >
                      <Icon size={22} style={{ color: course.iconColor }} />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          background: `${course.levelColor}15`,
                          border: `1px solid ${course.levelColor}30`,
                          color: course.levelColor,
                        }}
                      >
                        {course.level}
                      </span>
                      {!course.available && (
                        <span className="flex items-center gap-1 text-xs text-white/40">
                          <Lock size={11} />
                          Próximamente
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {course.name}
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed mb-5 flex-grow">
                    {course.description}
                  </p>

                  {/* Topics */}
                  <div className="mb-5">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Temas</p>
                    <ul className="space-y-1.5">
                      {course.topics.map((topic) => (
                        <li key={topic} className="flex items-center gap-2 text-xs text-white/60">
                          <ChevronRight size={12} style={{ color: course.iconColor }} className="flex-shrink-0" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 mb-5 text-xs text-white/40">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen size={12} />
                      {course.lessons} lecciones
                    </span>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => {
                      if (!course.available) {
                        toast.info("¡Próximamente! Este curso estará disponible pronto.");
                      } else {
                        toast.success(`Iniciando "${course.name}"...`);
                      }
                    }}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      course.available
                        ? "btn-primary"
                        : "bg-white/6 border border-white/12 text-white/40 cursor-not-allowed"
                    }`}
                    style={course.available ? {} : { background: "rgba(255,255,255,0.05)" }}
                  >
                    {course.available ? (
                      <>
                        Comenzar Curso
                        <ChevronRight size={16} />
                      </>
                    ) : (
                      <>
                        <Lock size={14} />
                        Próximamente
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
