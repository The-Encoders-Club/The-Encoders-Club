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
  Gamepad2, Sparkles, ChevronRight, Star, Send
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCountUp } from "@/hooks/useCountUp";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663516100892/kzug5rLPLvVJzu5QVE66vY/logo_435f8d5a.png";
const MASCOT_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/LCQWMNLoTKaJlDdO.png";
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
  { id: 1, name: "NICKNAME", cargo: "Desarrollador Principal", color: "#FF2D78" },
  { id: 2, name: "NICKNAME", cargo: "Diseñadora UX/UI", color: "#4D9FFF" },
  { id: 3, name: "NICKNAME", cargo: "Escritor de Historias", color: "#a855f7" },
  { id: 4, name: "NICKNAME", cargo: "Community Manager", color: "#22c55e" },
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
          <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[70vh]">
            
            {/* Left: Mascot */}
            <div className="flex justify-center lg:justify-start">
              <motion.img
                src={MASCOT_URL}
                alt="Mascota Ren'Py"
                className="w-80 h-auto object-contain animate-float"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>

            {/* Right: Text Content */}
            <div className="flex flex-col justify-center">
              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <span className="text-white">The</span>{" "}
                <span className="brand-gradient-text">Encoders</span>{" "}
                <span className="text-white">Club</span>
              </motion.h1>

              {/* Subtitle / Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-lg text-white/70 leading-relaxed mb-10 max-w-2xl"
              >
                Tu portal a las mejores experiencias de{" "}
                <span className="text-[#FF2D78] font-semibold">novelas visuales</span>
                {" "}en español. Aprende{" "}
                <span className="text-[#4D9FFF] font-semibold">Ren'Py</span>, crea historias únicas y comparte tu arte con la comunidad.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/proyectos" className="btn-primary text-base px-8 py-3">
                  Ver más
                  <ArrowRight size={18} />
                </Link>
                <Link href="/cursos" className="btn-outline text-base px-8 py-3">
                  <BookOpen size={18} />
                  Aprender
                </Link>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ── ABOUT / FEATURES ── */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="glass-card p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FF2D78]/10 flex items-center justify-center mb-6 border border-[#FF2D78]/20">
                <Gamepad2 className="text-[#FF2D78]" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Crea Juegos</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Domina el motor Ren'Py y transforma tus ideas en novelas visuales interactivas de alta calidad.
              </p>
            </motion.div>

            <motion.div
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="glass-card p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-[#4D9FFF]/10 flex items-center justify-center mb-6 border border-[#4D9FFF]/20">
                <Users className="text-[#4D9FFF]" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Comunidad Activa</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Conecta con otros desarrolladores, artistas y escritores apasionados por el género en español.
              </p>
            </motion.div>

            <motion.div
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="glass-card p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-[#a855f7]/10 flex items-center justify-center mb-6 border border-[#a855f7]/20">
                <Download className="text-[#a855f7]" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Recursos Gratuitos</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Accede a una biblioteca de activos, scripts y plantillas listas para usar en tus propios proyectos.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── NEWS / BLOG ── */}
      <section className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="section-title mb-4">Últimas <span className="text-[#FF2D78]">Noticias</span></h2>
              <p className="text-white/50 max-w-xl">Mantente al día con las novedades de la comunidad, nuevos tutoriales y eventos próximos.</p>
            </div>
            <Link href="/noticias" className="flex items-center gap-2 text-[#FF2D78] font-bold hover:gap-3 transition-all">
              Ver todas las noticias <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newsItems.map((item, idx) => (
              <motion.div
                key={item.id}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4 border border-white/10">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: item.tagColor }}>
                    {item.tag}
                  </div>
                </div>
                <p className="text-xs text-white/40 mb-2">{item.date}</p>
                <h3 className="text-lg font-bold mb-2 group-hover:text-[#FF2D78] transition-colors line-clamp-2">{item.title}</h3>
                <p className="text-sm text-white/60 line-clamp-2 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter value={1250} label="Miembros" icon={Users} color="#FF2D78" suffix="+" />
            <StatCounter value={45} label="Juegos Creados" icon={Gamepad2} color="#4D9FFF" />
            <StatCounter value={8500} label="Descargas" icon={Download} color="#a855f7" />
            <StatCounter value={120} label="Tutoriales" icon={BookOpen} color="#22c55e" />
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Nuestro <span className="text-[#4D9FFF]">Equipo</span></h2>
            <p className="text-white/50 max-w-2xl mx-auto">Las mentes creativas detrás de The Encoders Club trabajando para fortalecer la comunidad.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={member.id}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="glass-card p-8 text-center group"
              >
                <div className="w-24 h-24 rounded-full mx-auto mb-6 relative">
                  <div className="absolute inset-0 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: member.color }} />
                  <div className="w-full h-full rounded-full bg-white/10 border-2 border-white/10 flex items-center justify-center relative z-10 overflow-hidden">
                    <Users size={40} className="text-white/20" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-sm font-medium mb-4" style={{ color: member.color }}>{member.cargo}</p>
                <div className="flex justify-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                    <Star size={14} className="text-white/40" />
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                    <Eye size={14} className="text-white/40" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF2D78]/10 to-[#4D9FFF]/10" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="glass-card p-12 md:p-20 text-center border-[#FF2D78]/20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">¿Listo para crear tu propia <span className="brand-gradient-text">historia</span>?</h2>
            <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto">
              Únete a cientos de creadores y comienza tu viaje en el desarrollo de novelas visuales hoy mismo.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/comunidad" className="btn-primary text-lg px-10 py-4">
                ¡Únete ahora!
                <Send size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
