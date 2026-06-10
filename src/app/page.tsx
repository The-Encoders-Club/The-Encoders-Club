'use client';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Download, Users, Eye, Gamepad2, ChevronRight, ChevronLeft, Zap, Heart, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundParticles from "@/components/BackgroundParticles";
import { useI18n } from "@/hooks/useLocale";

const BG_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663516100892/kzug5rLPLvVJzu5QVE66vY/hero_bg-nZF9vsy8Qjc3eRVqRoEgy7.webp";

const newsItemsEs = [
  { id: 1, title: "Nuevo Tutorial de Ren'Py", description: "Aprende los conceptos básicos de programación en Ren'Py con nuestro nuevo tutorial interactivo.", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=220&fit=crop", date: "1 Abr 2026", tag: "Tutorial", tagColor: "#4D9FFF" },
  { id: 2, title: "Concurso de Novelas Visuales", description: "Participa en nuestro concurso anual y gana premios increíbles. ¡Las inscripciones ya están abiertas!", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=220&fit=crop", date: "28 Mar 2026", tag: "Evento", tagColor: "#FF2D78" },
  { id: 3, title: "Webinar: Diseño de Personajes", description: "Únete a nuestro webinar gratuito sobre técnicas avanzadas de diseño de personajes.", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=220&fit=crop", date: "25 Mar 2026", tag: "Webinar", tagColor: "#a855f7" },
  { id: 4, title: "Actualización de Herramientas", description: "Descubre las nuevas herramientas y mejoras que hemos añadido a nuestra plataforma.", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=220&fit=crop", date: "20 Mar 2026", tag: "Actualización", tagColor: "#22c55e" },
];

const newsItemsEn = [
  { id: 1, title: "New Ren'Py Tutorial", description: "Learn the basics of Ren'Py programming with our new interactive tutorial.", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=220&fit=crop", date: "Apr 1, 2026", tag: "Tutorial", tagColor: "#4D9FFF" },
  { id: 2, title: "Visual Novel Contest", description: "Join our annual contest and win amazing prizes. Registration is now open!", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=220&fit=crop", date: "Mar 28, 2026", tag: "Event", tagColor: "#FF2D78" },
  { id: 3, title: "Webinar: Character Design", description: "Join our free webinar on advanced character design techniques.", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=220&fit=crop", date: "Mar 25, 2026", tag: "Webinar", tagColor: "#a855f7" },
  { id: 4, title: "Tools Update", description: "Discover the new tools and improvements we've added to our platform.", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=220&fit=crop", date: "Mar 20, 2026", tag: "Update", tagColor: "#22c55e" },
];

const teamMembers = [
  { id: 1, name: "Slytharbez", cargo: ["Desarrollador", "Moderador", "Traductor", "Ideas"], color: "#FF2D78", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/sYvfOcdjjpxwpsYH.jpg" },
  { id: 2, name: "The_Player_Madness", cargo: ["Desarrollador", "Traductor"], color: "#4D9FFF", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/fqvycZADioutZyXg.jpg" },
  { id: 3, name: "Francisco", cargo: ["Beta Tester", "Traductor"], color: "#a855f7", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/NdddEeYbkRaZUwAf.jpg" },
  { id: 4, name: "Ashi", cargo: ["Ideas"], color: "#22c55e", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/owXrIjTwHSFTkmKB.jpg" },
  { id: 5, name: "mondongo8360", cargo: ["Traductor"], color: "#FF2D78", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/cCtjHYrvAzaOHjEd.jpg" },
  { id: 6, name: "FlagBro23", cargo: ["Traductor"], color: "#4D9FFF", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/iecokdxZIrlMEbyP.jpg" },
  { id: 7, name: "Manu", cargo: ["Traductor"], color: "#a855f7", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/bIiIQjvPOSUKgAUl.jpg" },
];

function StatCounter({ value, label, icon: Icon, color, suffix = "" }: { value: number; label: string; icon: React.ElementType; color: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered) { setTriggered(true); }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;
    let current = 0;
    const step = value / 40;
    const interval = setInterval(() => {
      current += step;
      if (current >= value) { setCount(value); clearInterval(interval); }
      else setCount(Math.floor(current));
    }, 30);
    return () => clearInterval(interval);
  }, [triggered, value]);

  const formatted = count.toLocaleString('en-US');

  return (
    <div
      ref={ref}
      className="glass-card p-5 sm:p-6 flex flex-col items-center text-center group hover:border-opacity-50 transition-all duration-300 relative overflow-hidden"
      style={{ borderColor: `${color}25` }}
    >
      {/* Colored top accent line */}
      <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      {/* Soft glow behind icon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full pointer-events-none opacity-[0.07]" style={{ background: color, filter: 'blur(30px)' }} />
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 relative" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <span className="text-3xl sm:text-4xl font-bold mb-1.5 relative" style={{ fontFamily: "'Space Grotesk', sans-serif", color }}>{formatted}{suffix}</span>
      <span className="text-xs text-white/45 uppercase tracking-wider font-medium">{label}</span>
      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-[10%] w-[80%] h-[1px] opacity-30" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    </div>
  );
}

// Lightweight fade-up variants (only triggers once via whileInView)
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

// Fallback stat values (used while API loads or if it fails)
const FALLBACK_STATS = { downloads: 15000, visits: 50000 };

// Compact number formatter for hero mini-stats
const compact = (n: number) => {
  if (n >= 1000) {
    const k = n / 1000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`;
  }
  return n.toString();
};

export default function Home() {
  const { t, locale } = useI18n();
  const isEs = locale === 'es';
  const newsItems = isEs ? newsItemsEs : newsItemsEn;

  // Fetch live stats from API (visits & downloads) and refresh every 60 seconds
  const [liveStats, setLiveStats] = useState<{ downloads: number; visits: number } | null>(null);

  useEffect(() => {
    const fetchStats = () => {
      fetch('/api/stats')
        .then(r => r.json())
        .then(data => {
          if (data.visits !== undefined && data.downloads !== undefined) {
            setLiveStats({ downloads: data.downloads, visits: data.visits });
          }
        })
        .catch(() => {}); // silently fail — fallback values will be used
    };

    // Initial fetch
    fetchStats();

    // Refresh every 60 seconds to keep stats near real-time
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  // Use live data if available, otherwise fallback
  const stats = liveStats || FALLBACK_STATS;

  return (
    <div className="min-h-screen bg-[#080818] text-white overflow-x-hidden">
      <Navbar />
      <BackgroundParticles />

      {/* ═══════════════════════════════════════════════════════════
          1. HERO — The Encoders Club + Botón Unirse
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={BG_URL} alt="" className="w-full h-full object-cover opacity-30" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080818]/60 via-transparent to-[#080818]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080818] via-transparent to-[#080818]/60" />
        </div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#FF2D78]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#4D9FFF]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="flex flex-col justify-center w-full max-w-2xl">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <span className="text-white">{t('home.hero.title1')} </span> <span className="brand-gradient-text">{t('home.hero.title2')}</span><br /><span className="text-white">{t('home.hero.title3')}</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-lg text-white/65 leading-relaxed mb-8 max-w-lg"
              >
                {t('home.hero.subtitle')}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-wrap gap-4"
              >
                <a
                  href="https://discord.gg/2DB5k7sb8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-base px-7 py-3.5"
                >
                  {isEs ? 'Unirse' : 'Join Us'} <ArrowRight size={18} />
                </a>
                <Link href="/proyectos" className="btn-outline text-base px-7 py-3.5">
                  {t('home.seeProjects')} <BookOpen size={18} />
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center gap-6 mt-10 pt-8 border-t border-white/10"
              >
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#FF2D78]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>3+</p>
                  <p className="text-xs text-white/45">{isEs ? 'Novelas Visuales' : 'Visual Novels'}</p>
                </div>
                <div className="w-px h-10 bg-white/15" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#4D9FFF]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{compact(stats.downloads)}+</p>
                  <p className="text-xs text-white/45">{isEs ? 'Descargas' : 'Downloads'}</p>
                </div>
                <div className="w-px h-10 bg-white/15" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#a855f7]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>7+</p>
                  <p className="text-xs text-white/45">{isEs ? 'Colaboradores' : 'Collaborators'}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
          style={{ animation: 'scrollBounce 2s ease-in-out infinite' }}
        >
          <span className="text-xs">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ── Gradient separator ── */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* ═══════════════════════════════════════════════════════════
          2. SOBRE NOSOTROS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-14 lg:py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="text-[#FF2D78] text-sm font-semibold uppercase tracking-widest mb-3 block">{t('home.about.tag')}</span>
            <h2 className="section-title text-white mb-5">{t('home.about.title')} <span className="brand-gradient-text">{t('home.about.accent')}</span></h2>
            <p className="text-white/65 leading-relaxed mb-5">
              {t('home.about.text1')}
            </p>
            <p className="text-white/65 leading-relaxed mb-8">
              {t('home.about.text2')}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/cursos" className="btn-primary text-sm px-5 py-2.5">
                {t('home.seeCourses')} <ChevronRight size={16} />
              </Link>
              <Link href="/proyectos" className="btn-outline text-sm px-5 py-2.5">
                {t('home.exploreProjects')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Gradient separator ── */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* ═══════════════════════════════════════════════════════════
          3. EQUIPO
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-14 lg:py-20 bg-[#06060f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#a855f7] text-sm font-semibold uppercase tracking-widest mb-3 block">{t('home.team.tag')}</span>
            <h2 className="section-title text-white">{t('home.team.title')} <span className="brand-gradient-text">{t('home.team.accent')}</span></h2>
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
                  viewport={{ once: true }}
                  className="glass-card p-8 flex flex-col items-center text-center group flex-shrink-0 w-56 sm:w-64 lg:w-72"
                >
                  <div
                    className="w-32 h-32 lg:w-36 lg:h-36 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${member.color}20, ${member.color}10)`, border: `2px solid ${member.color}40` }}
                  >
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity" style={{ background: member.color }} />
                  </div>
                  <h3 className="font-bold text-base lg:text-lg mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: member.color }}>
                    {member.name}
                  </h3>
                  <div className="flex flex-col gap-1">
                    {member.cargo.map((role, idx) => (
                      <p key={idx} className="text-xs text-white/50">{role}</p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Gradient separator ── */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* ═══════════════════════════════════════════════════════════
          4. NOTICIAS — Carrusel horizontal
      ═══════════════════════════════════════════════════════════ */}
      <NewsCarousel newsItems={newsItems} t={t} isEs={isEs} />

      {/* ── Gradient separator ── */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* ═══════════════════════════════════════════════════════════
          5. ESTADÍSTICAS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-14 lg:py-20 bg-[#06060f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#4D9FFF] text-sm font-semibold uppercase tracking-widest mb-3 block">{isEs ? 'Estadísticas' : 'Statistics'}</span>
            <h2 className="section-title text-white">{isEs ? 'Números que' : 'Numbers that'} <span className="brand-gradient-text">{isEs ? 'hablan' : 'speak'}</span></h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <StatCounter value={3} label={isEs ? 'Novelas Visuales' : 'Visual Novels'} icon={Gamepad2} color="#FF2D78" suffix="+" />
            <StatCounter value={stats.downloads} label={isEs ? 'Descargas' : 'Downloads'} icon={Download} color="#4D9FFF" suffix="+" />
            <StatCounter value={7} label={isEs ? 'Colaboradores' : 'Collaborators'} icon={Users} color="#a855f7" suffix="+" />
            <StatCounter value={stats.visits} label={isEs ? 'Visitas' : 'Visits'} icon={Eye} color="#22c55e" suffix="+" />
          </div>
        </div>
      </section>

      {/* ── Gradient separator ── */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* ═══════════════════════════════════════════════════════════
          6. EXTRAS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#22c55e] text-sm font-semibold uppercase tracking-widest mb-3 block">{isEs ? 'Extras' : 'Extras'}</span>
            <h2 className="section-title text-white">{isEs ? 'Más que proyectos' : 'More than projects'} <span className="brand-gradient-text">{isEs ? 'una comunidad' : 'a community'}</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card p-6 group hover:border-[#FF2D78]/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FF2D78]/15 border border-[#FF2D78]/30 flex items-center justify-center mb-4">
                <Zap size={24} className="text-[#FF2D78]" />
              </div>
              <h3 className="font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{isEs ? 'Traducciones' : 'Translations'}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{isEs ? 'Localizamos novelas visuales al español con la máxima calidad, manteniendo la esencia y el tono original de cada obra.' : 'We localize visual novels into Spanish with the highest quality, preserving the essence and original tone of each work.'}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-card p-6 group hover:border-[#4D9FFF]/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#4D9FFF]/15 border border-[#4D9FFF]/30 flex items-center justify-center mb-4">
                <Heart size={24} className="text-[#4D9FFF]" />
              </div>
              <h3 className="font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{isEs ? 'Código Abierto' : 'Open Source'}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{isEs ? 'Todos nuestros proyectos son de código abierto. Puedes contribuir, aprender y formar parte del desarrollo activamente.' : 'All our projects are open source. You can contribute, learn, and actively be part of the development.'}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-card p-6 group hover:border-[#a855f7]/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#a855f7]/15 border border-[#a855f7]/30 flex items-center justify-center mb-4">
                <Globe size={24} className="text-[#a855f7]" />
              </div>
              <h3 className="font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{isEs ? 'Comunidad Global' : 'Global Community'}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{isEs ? 'Colaboramos con personas de todo el mundo. Sin importar tu nivel de experiencia, hay un lugar para ti aquí.' : 'We collaborate with people from all over the world. Regardless of your experience level, there is a place for you here.'}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          7. INFORMACIÓN SECUNDARIA (CTA Discord)
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-14 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-10 lg:p-16 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 brand-gradient" />
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#FF2D78]/8 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-[#4D9FFF]/8 blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <span className="text-[#FF2D78] text-sm font-semibold uppercase tracking-widest mb-4 block">{t('home.cta.tag')}</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {t('home.cta.title')} <span className="brand-gradient-text">{t('home.cta.accent')}</span>
              </h2>
              <p className="text-white/60 mb-8 max-w-xl mx-auto leading-relaxed">
                {t('home.cta.text')}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="https://discord.gg/2DB5k7sb8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-base px-8 py-3.5"
                >
                  {t('home.cta.discord')} <ArrowRight size={18} />
                </a>
                <Link href="/cursos" className="btn-outline text-base px-8 py-3.5">
                  {t('home.cta.learn')}
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

/* ─── News Carousel Component (horizontal scroll) ─── */
function NewsCarousel({ newsItems, t, isEs }: { newsItems: typeof newsItemsEs; t: ReturnType<typeof useI18n>['t']; isEs: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[#4D9FFF] text-sm font-semibold uppercase tracking-widest mb-3 block">{t('home.news.tag')}</span>
            <h2 className="section-title text-white">{t('home.news.title')} <span className="brand-gradient-text">{t('home.news.accent')}</span></h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => scroll('left')} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll('right')} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
              <ChevronRight size={18} />
            </button>
            <Link href="/noticias" className="btn-outline text-sm px-5 py-2.5 whitespace-nowrap ml-2">
              {t('home.seeAll')} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
        <div className="relative group/carousel">
          <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4">
            {newsItems.map((item, i) => (
              <motion.article
                key={item.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="glass-card overflow-hidden group flex-shrink-0 snap-start"
                style={{ width: 'calc(33.333% - 14px)', minWidth: 280 }}
              >
                <div className="relative overflow-hidden h-40">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span
                    className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: `${item.tagColor}25`, border: `1px solid ${item.tagColor}50`, color: item.tagColor }}
                  >
                    {item.tag}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-xs text-white/40 mb-2">{item.date}</p>
                  <h3 className="font-semibold text-white text-sm mb-2 leading-snug line-clamp-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed line-clamp-3 mb-4">{item.description}</p>
                  <span className="text-xs text-[#FF2D78] font-semibold hover:text-[#ff4d8d] transition-colors flex items-center gap-1">
                    {t('common.readMore')} <ChevronRight size={13} />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}
