/* ============================================================
   HOME PAGE — The Encoders Club
   Style: Neon Synthwave Gaming
   Sections: Hero, About, News, Team, Stats
   ============================================================ */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight, BookOpen, Download, Users, Eye,
  Gamepad2, Sparkles, ChevronRight, Star
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCountUp } from "@/hooks/useCountUp";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663516100892/kzug5rLPLvVJzu5QVE66vY/logo_435f8d5a.png";
const PERSONAJE_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663518852144/ZbUNPMDpcLvHgznH.png";
const BG_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663516100892/kzug5rLPLvVJzu5QVE66vY/hero_bg-nZF9vsy8Qjc3eRVqRoEgy7.webp";

const newsItems = [
  {
    id: 1,
    title: "Nuevo Tutorial de Ren'Py",
    description: "Aprende los conceptos básicos de programación en Ren'Py con nuestro nuevo tutorial interactivo paso a paso.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=220&fit=crop",
    date: "1 Abr 2026",
    tag: "Tutorial",
    tagColor: "#4D9FFF",
  },
  {
    id: 2,
    title: "Concurso de Novelas Visuales",
    description: "Participa en nuestro concurso anual y gana premios increíbles. ¡Las inscripciones ya están abiertas!",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=220&fit=crop",
    date: "28 Mar 2026",
    tag: "Evento",
    tagColor: "#FF2D78",
  },
  {
    id: 3,
    title: "Webinar: Diseño de Personajes",
    description: "Únete a nuestro webinar gratuito sobre técnicas avanzadas de diseño de personajes para novelas visuales.",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=220&fit=crop",
    date: "25 Mar 2026",
    tag: "Webinar",
    tagColor: "#a855f7",
  },
  {
    id: 4,
    title: "Actualización de Herramientas",
    description: "Descubre las nuevas herramientas y mejoras que hemos añadido a nuestra plataforma de desarrollo.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=220&fit=crop",
    date: "20 Mar 2026",
    tag: "Actualización",
    tagColor: "#22c55e",
  },
];

const teamMembers = [
  {
    id: 1,
    name: "Slytharbez",
    cargo: "Desarrollador",
    cargo: "Moderador",
    cargo: "Traductor",
    cargo: "Ideas",
    color: "#FF2D78",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/sYvfOcdjjpxwpsYH.jpg"
  },
  {
    id: 2,
    name: "The_Player_Madness",
    cargo: "Desarrollador",
    cargo: "Traductor",
    color: "#4D9FFF",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/NdddEeYbkRaZUwAf.jpg"
  },
  {
    id: 3,
    name: "«[×𝐹ɾαɳƈιʂƈσ×]»",
    cargo: "Beta Tester",
    cargo: "Traductor",
    color: "#a855f7",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/fqvycZADioutZyXg.jpg"
  },
  {
    id: 4,
    name: "Ashi",
    cargo: "Traductor",
    color: "#22c55e",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/owXrIjTwHSFTkmKB.jpg"
  },
  {
    id: 5,
    name: "mondongo8360",
    cargo: "Traductor",
    color: "#FF2D78",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/cCtjHYrvAzaOHjEd.jpg"
  },
  {
    id: 6,
    name: "FlagBro23",
    cargo: "Traductor",
    color: "#4D9FFF",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/iecokdxZIrlMEbyP.jpg"
  },
  {
    id: 7,
    name: "Manu",
    cargo: "Traductor",
    color: "#a855f7",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/bIiIQjvPOSUKgAUl.jpg"
  },
];

// Stat counter component
function StatCounter({
  value, label, icon: Icon, color, suffix = ""
}: {
  value: number; label: string; icon: React.ElementType; color: string; suffix?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { count, start } = useCountUp(value, 2200);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
          start();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [triggered, start]);

  const formatted = count >= 1000
    ? count >= 1000000
      ? `${(count / 1000000).toFixed(1)}M`
      : `${(count / 1000).toFixed(0)}K`
    : count.toString();

  return (
    <div ref={ref} className="flex flex-col items-center text-center p-6">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
        style={{ background: `${color}20`, border: `1px solid ${color}40` }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <span
        className="text-3xl md:text-4xl font-bold mb-1"
        style={{ fontFamily: "'Space Grotesk', sans-serif", color }}
      >
        {formatted}{suffix}
      </span>
      <span className="text-sm text-white/50">{label}</span>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

// Team Carousel Component
function TeamCarousel() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-[#a855f7] text-sm font-semibold uppercase tracking-widest mb-3 block">
            Quiénes somos
          </span>
          <h2 className="section-title text-white">
            Integrantes del <span className="brand-gradient-text">Equipo</span>
          </h2>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-x-auto pb-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="flex gap-5 lg:gap-8 min-w-min">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="glass-card p-8 flex flex-col items-center text-center group flex-shrink-0 w-56"
              >
                {/* Avatar - Larger */}
                <div
                  className="w-32 h-32 rounded-2xl mb-6 flex items-center justify-center text-2xl font-bold relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${member.color}20, ${member.color}10)`,
                    border: `2px solid ${member.color}40`,
                  }}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
                    style={{ background: member.color }}
                  />
                </div>
                <h3
                  className="font-bold text-base mb-2"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: member.color }}
                >
                  {member.name}
                </h3>
                <p className="text-xs text-white/50 whitespace-pre-line">{member.cargo}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080818] text-white overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={BG_URL}
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080818]/60 via-transparent to-[#080818]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080818] via-transparent to-[#080818]/60" />
        </div>

        {/* Decorative orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#FF2D78]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#4D9FFF]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left: Mascot */}
            <div className="flex flex-col items-center justify-center relative order-1 lg:order-1">
              {/* Glow behind mascot */}
              <div className="absolute w-72 h-72 lg:w-96 lg:h-96 rounded-full bg-[#FF2D78]/10 blur-3xl" />
              {/* Mascot */}
              <motion.img
                src={PERSONAJE_URL}
                alt="Mascota Ren'Py"
                className="w-full max-w-[300px] lg:max-w-[450px] h-auto object-contain relative z-10 animate-float"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>

            {/* Right: Text */}
            <div className="flex flex-col justify-center lg:pl-8 order-2 lg:order-2">
              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <span className="text-white">The</span>{" "}
                <span className="brand-gradient-text">Encoders</span>
                <br />
                <span className="text-white">Club</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-lg text-white/65 leading-relaxed mb-8 max-w-lg"
              >
                Tu portal a las mejores experiencias de novelas visuales en español. Aprende Ren'Py, crea historias únicas y comparte tu arte con la comunidad.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/proyectos" className="btn-primary text-base px-7 py-3.5">
                  Ver Proyectos
                  <ArrowRight size={18} />
                </Link>
                <Link href="/cursos" className="btn-outline text-base px-7 py-3.5">
                  <BookOpen size={18} />
                  Aprender
                </Link>
              </motion.div>

              {/* Mini stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center gap-6 mt-10 pt-8 border-t border-white/10"
              >
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#FF2D78]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>3+</p>
                  <p className="text-xs text-white/45">Proyectos</p>
                </div>
                <div className="w-px h-10 bg-white/15" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#4D9FFF]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>7+</p>
                  <p className="text-xs text-white/45">Cursos</p>
                </div>
                <div className="w-px h-10 bg-white/15" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#a855f7]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>∞</p>
                  <p className="text-xs text-white/45">Creatividad</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </section>

      {/* ── ABOUT ── */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Visual */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="glass-card p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 brand-gradient" />
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF2D78]/15 border border-[#FF2D78]/30 flex items-center justify-center">
                    <Gamepad2 size={24} className="text-[#FF2D78]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Motor Ren'Py</h3>
                    <p className="text-sm text-white/50">Novelas Visuales</p>
                  </div>
                </div>
                <p className="text-white/65 text-sm leading-relaxed mb-6">
                  Ren'Py es el motor de referencia para crear novelas visuales. Con Python como base, permite crear historias interactivas con múltiples finales, personajes expresivos y música envolvente.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {["Fácil de aprender", "Python-based", "Multiplataforma", "Comunidad activa"].map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-white/60">
                      <Star size={12} className="text-[#FF2D78] flex-shrink-0" />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-[#FF2D78] text-sm font-semibold uppercase tracking-widest mb-3 block">
                Sobre nosotros
              </span>
              <h2 className="section-title text-white mb-5">
                Nuestro <span className="brand-gradient-text">Enfoque</span>
              </h2>
              <p className="text-white/65 leading-relaxed mb-5">
                En The Encoders Club nos dedicamos a fomentar la creación y el aprendizaje de novelas visuales utilizando el motor Ren'Py. Nuestro objetivo es crear una comunidad vibrante donde desarrolladores, escritores y artistas puedan colaborar.
              </p>
              <p className="text-white/65 leading-relaxed mb-8">
                Desde tutoriales para principiantes hasta proyectos avanzados, aquí encontrarás todo lo que necesitas para dar vida a tus historias en español.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/cursos" className="btn-primary text-sm px-5 py-2.5">
                  Ver Cursos
                  <ChevronRight size={16} />
                </Link>
                <Link href="/proyectos" className="btn-outline text-sm px-5 py-2.5">
                  Explorar Proyectos
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── NOTICIAS ── */}
      <section className="py-20 lg:py-28 bg-[#06060f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-[#4D9FFF] text-sm font-semibold uppercase tracking-widest mb-3 block">
                Lo último
              </span>
              <h2 className="section-title text-white">
                Noticias <span className="brand-gradient-text">Recientes</span>
              </h2>
            </div>
            <Link href="/noticias" className="btn-outline text-sm px-5 py-2.5 whitespace-nowrap">
              Ver todas
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {newsItems.map((item, i) => (
              <motion.article
                key={item.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="glass-card overflow-hidden group"
              >
                <div className="relative overflow-hidden h-40">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span
                    className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background: `${item.tagColor}25`,
                      border: `1px solid ${item.tagColor}50`,
                      color: item.tagColor,
                    }}
                  >
                    {item.tag}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-xs text-white/40 mb-2">{item.date}</p>
                  <h3 className="font-semibold text-white text-sm mb-2 leading-snug line-clamp-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed line-clamp-3 mb-4">
                    {item.description}
                  </p>
                  <button className="text-xs text-[#FF2D78] font-semibold hover:text-[#ff4d8d] transition-colors flex items-center gap-1">
                    Leer más <ChevronRight size={13} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <TeamCarousel />

      {/* ── STATS ── */}
      <section className="py-16 bg-[#06060f] border-y border-white/6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/8">
            <StatCounter value={3} label="Proyectos" icon={BookOpen} color="#FF2D78" suffix="+" />
            <StatCounter value={15000} label="Descargas" icon={Download} color="#4D9FFF" suffix="+" />
            <StatCounter value={7} label="Cursos" icon={Users} color="#a855f7" suffix="+" />
            <StatCounter value={50000} label="Visitas" icon={Eye} color="#22c55e" suffix="+" />
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-card p-10 lg:p-16 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 brand-gradient" />
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#FF2D78]/8 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-[#4D9FFF]/8 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <span className="text-[#FF2D78] text-sm font-semibold uppercase tracking-widest mb-4 block">
                Únete a nosotros
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                ¿Listo para crear tu{" "}
                <span className="brand-gradient-text">novela visual?</span>
              </h2>
              <p className="text-white/60 mb-8 max-w-xl mx-auto leading-relaxed">
                Únete a nuestra comunidad, aprende con nuestros cursos y comparte tus proyectos con cientos de creadores hispanohablantes.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="https://discord.gg/2DB5k7sb8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-base px-8 py-3.5"
                >
                  Unirse al Discord
                  <ArrowRight size={18} />
                </a>
                <Link href="/cursos" className="btn-outline text-base px-8 py-3.5">
                  Empezar a Aprender
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
