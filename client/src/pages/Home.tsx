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
    cargo: ["Desarrollador", "Moderador", "Traductor", "Ideas"],
    color: "#FF2D78",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/sYvfOcdjjpxwpsYH.jpg"
  },
  {
    id: 2,
    name: "The_Player_Madness",
    cargo: ["Desarrollador", "Traductor"],
    color: "#4D9FFF",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/fqvycZADioutZyXg.jpg"
  },
  {
    id: 3,
    name: "«[×𝐹ɾαɳƈιʂƈσ×]»",
    cargo: ["Beta Tester", "Traductor"],
    color: "#a855f7",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/NdddEeYbkRaZUwAf.jpg"
  },
  {
    id: 4,
    name: "Ashi",
    cargo: ["Ideas"],
    color: "#22c55e",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/owXrIjTwHSFTkmKB.jpg"
  },
  {
    id: 5,
    name: "mondongo8360",
    cargo: ["Traductor"],
    color: "#FF2D78",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/cCtjHYrvAzaOHjEd.jpg"
  },
  {
    id: 6,
    name: "FlagBro23",
    cargo: ["Traductor"],
    color: "#4D9FFF",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/iecokdxZIrlMEbyP.jpg"
  },
  {
    id: 7,
    name: "Manu",
    cargo: ["Traductor"],
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

// Optimizamos las variantes de animación para móviles
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

const fadeUp = {
  hidden: { opacity: 0, y: isMobile ? 15 : 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: isMobile ? 0.4 : 0.6, 
      delay: isMobile ? 0.05 : i * 0.1,
      ease: "easeOut"
    },
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

        <div className="overflow-x-auto pb-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 lg:gap-8 w-max">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="glass-card p-8 flex flex-col items-center text-center group flex-shrink-0 w-56 sm:w-64 lg:w-72"
              >
                <div
                  className="w-32 h-32 lg:w-36 lg:h-36 rounded-2xl mb-6 flex items-center justify-center text-2xl font-bold relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${member.color}20, ${member.color}10)`,
                    border: `2px solid ${member.color}40`,
                  }}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
                    style={{ background: member.color }}
                  />
                </div>
                <h3
                  className="font-bold text-base lg:text-lg mb-3"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: member.color }}
                >
                  {member.name}
                </h3>
                <div className="flex flex-col gap-1">
                  {Array.isArray(member.cargo) ? (
                    member.cargo.map((role, idx) => (
                      <p key={idx} className="text-xs text-white/50">{role}</p>
                    ))
                  ) : (
                    <p className="text-xs text-white/50">{member.cargo}</p>
                  )}
                </div>
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
        {/* Background - Optimized with lazy loading and reduced opacity */}
        <div className="absolute inset-0 z-0">
          <img
            src={BG_URL}
            alt=""
            loading="eager"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080818]/60 via-transparent to-[#080818]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080818] via-transparent to-[#080818]/60" />
        </div>

        {/* Decorative orbs - Reduced blur and size for mobile performance */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-[#FF2D78]/5 blur-2xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-[#4D9FFF]/5 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            <div className="hidden lg:flex flex-col items-center justify-center relative order-1 lg:order-1">
              <div className="absolute w-72 h-72 lg:w-96 lg:h-96 rounded-full bg-[#FF2D78]/10 blur-3xl" />
            </div>

            <div className="flex flex-col justify-center lg:pl-8 order-2 lg:order-2">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Crea tu propia <br />
                <span className="brand-gradient-text">Novela Visual</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg sm:text-xl text-white/70 mb-10 max-w-xl leading-relaxed"
              >
                Únete a la comunidad más grande de creadores de novelas visuales en español. Aprende Ren'Py, comparte tus proyectos y colabora con otros artistas.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-5"
              >
                <Link href="/proyectos" className="btn-primary text-lg px-10 py-4">
                  Ver Proyectos
                  <ArrowRight size={20} />
                </Link>
                <Link href="/cursos" className="btn-outline text-lg px-10 py-4">
                  Aprender Ren'Py
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter value={1500} label="Miembros" icon={Users} color="#FF2D78" suffix="+" />
            <StatCounter value={120} label="Proyectos" icon={Gamepad2} color="#4D9FFF" />
            <StatCounter value={45} label="Cursos" icon={BookOpen} color="#a855f7" />
            <StatCounter value={50000} label="Descargas" icon={Download} color="#22c55e" suffix="+" />
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#4D9FFF]/10 blur-3xl rounded-full" />
              <div className="glass-card p-2 relative z-10 overflow-hidden rounded-3xl">
                <img
                  src={PERSONAJE_URL}
                  alt="Mascota"
                  loading="lazy"
                  className="w-full h-auto rounded-2xl animate-float"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[#FF2D78] text-sm font-semibold uppercase tracking-widest mb-4 block">
                Sobre el Club
              </span>
              <h2 className="section-title text-white mb-6">
                Impulsando la creatividad en <span className="brand-gradient-text">Español</span>
              </h2>
              <p className="text-white/60 text-lg mb-8 leading-relaxed">
                The Encoders Club nació con la misión de centralizar y potenciar el desarrollo de novelas visuales en el mundo hispanohablante. Proporcionamos las herramientas, el conocimiento y la plataforma necesaria para que cualquier persona pueda contar su historia.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Sparkles, text: "Comunidad activa y colaborativa" },
                  { icon: Star, text: "Recursos exclusivos para Ren'Py" },
                  { icon: Eye, text: "Visibilidad para tus proyectos" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <item.icon size={20} className="text-[#4D9FFF]" />
                    </div>
                    <span className="text-white/80 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── NEWS ── */}
      <section className="py-24 lg:py-32 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="text-[#4D9FFF] text-sm font-semibold uppercase tracking-widest mb-3 block">
                Novedades
              </span>
              <h2 className="section-title text-white">
                Últimas <span className="brand-gradient-text">Noticias</span>
              </h2>
            </div>
            <Link href="/noticias" className="text-white/50 hover:text-[#FF2D78] transition-colors flex items-center gap-2 font-medium">
              Ver todas las noticias
              <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newsItems.map((item, i) => (
              <motion.div
                key={item.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="glass-card group overflow-hidden flex flex-col h-full"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-white"
                      style={{ backgroundColor: item.tagColor }}
                    >
                      {item.tag}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-xs text-white/40 mb-2">{item.date}</span>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#FF2D78] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/50 line-clamp-3 mb-6">
                    {item.description}
                  </p>
                  <Link href={`/noticias/${item.id}`} className="mt-auto text-sm font-bold text-[#4D9FFF] flex items-center gap-2 group/link">
                    Leer más
                    <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <TeamCarousel />

      {/* ── CTA ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-10 lg:p-16 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 brand-gradient" />
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#FF2D78]/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-[#4D9FFF]/5 blur-3xl pointer-events-none" />

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
