'use client';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Download, Users, Eye, Gamepad2, ChevronRight, ChevronLeft, Zap, Heart, Globe, Send } from "lucide-react";
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

/* ─── Stat Counter with easeOutExpo ─── */
function StatCounter({ value, label, icon: Icon, color, suffix = "" }: { value: number; label: string; icon: React.ElementType; color: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered) { setTriggered(true); }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;
    const duration = 2200;
    const start = performance.now();
    const easeOutExpo = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    const formatNum = (n: number) => {
      if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
      return n.toString();
    };
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(easeOutExpo(progress) * value);
      setCount(current);
      if (progress < 1) requestAnimationFrame(step);
      else setCount(value);
    };
    requestAnimationFrame(step);
  }, [triggered, value]);

  const formatDisplay = (n: number) => {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return n.toLocaleString('en-US');
  };

  return (
    <div
      ref={ref}
      className="p-7 rounded-[14px] bg-white/[0.04] border border-white/[0.08] text-center relative overflow-hidden transition-all duration-300 hover:-translate-y-[3px] hover:border-white/[0.12] hover:bg-white/[0.06]"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] opacity-60" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center mx-auto mb-3.5" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div className="font-bold text-3xl leading-none mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif", color, textShadow: `0 0 16px ${color}25` }}>
        {formatDisplay(count)}{suffix}
      </div>
      <div className="text-[0.7rem] text-white/40 uppercase tracking-wider font-medium">{label}</div>
      <div className="absolute bottom-0 left-[10%] w-[80%] h-px opacity-20" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
};

const FALLBACK_STATS = { downloads: 15000, visits: 50000 };

const compact = (n: number) => {
  if (n >= 1000) {
    const k = n / 1000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`;
  }
  return n.toString();
};

const approachCards = [
  { emoji: "📖", title: "Tutoriales", desc: "Desde conceptos básicos hasta técnicas avanzadas, todo en español.", titleEn: "Tutorials", descEn: "From basics to advanced techniques, all in Spanish." },
  { emoji: "🤝", title: "Colaboración", desc: "Desarrolladores, escritores y artistas trabajando juntos.", titleEn: "Collaboration", descEn: "Developers, writers and artists working together." },
  { emoji: "🌐", title: "En Español", desc: "Accesible para toda la comunidad de habla hispana.", titleEn: "In Spanish", descEn: "Accessible for the entire Spanish-speaking community." },
  { emoji: "🎮", title: "Ren'Py", desc: "Motor especializado en novelas visuales interactivas.", titleEn: "Ren'Py", descEn: "Engine specialized in interactive visual novels." },
];

export default function Home() {
  const { t, locale } = useI18n();
  const isEs = locale === 'es';
  const newsItems = isEs ? newsItemsEs : newsItemsEn;

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
        .catch(() => {});
    };
    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const stats = liveStats || FALLBACK_STATS;

  return (
    <div className="min-h-screen bg-[#080818] text-white overflow-x-hidden">
      <Navbar />
      <BackgroundParticles />

      {/* ═══════════════════════════════════════════════════════════
          1. HERO — Cinematic 2-column layout
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={BG_URL} alt="" className="w-full h-full object-cover opacity-25" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080818]/50 via-[#080818]/20 to-[#080818]/85" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080818]/80 via-transparent to-[#080818]/60" />
        </div>
        <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] rounded-full bg-[#FF2D78]/8 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[25%] right-[15%] w-[350px] h-[350px] rounded-full bg-[#4D9FFF]/6 blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 w-full pt-[120px] pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 items-center">
            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF2D78]/8 border border-[#FF2D78]/12 text-[0.72rem] font-semibold text-[#FF2D78] uppercase tracking-wider mb-6"
              >
                <span className="w-[5px] h-[5px] rounded-full bg-[#FF2D78] shadow-[0_0_8px_rgba(255,45,120,0.4)] animate-pulse" />
                {isEs ? "Comunidad Ren'Py en Español" : "Ren'Py Community in Spanish"}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-bold leading-none mb-6 tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2.8rem, 6vw, 4.5rem)' }}
              >
                The <span className="brand-gradient-text">Encoders</span>
                <span className="block mt-1">Club</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-[1.05rem] text-white/65 leading-8 mb-7 max-w-[440px]"
              >
                {t('home.hero.subtitle')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex gap-2.5 flex-wrap"
              >
                <a href="https://discord.gg/2DB5k7sb8" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF2D78] via-[#a855f7] to-[#4D9FFF] text-white font-semibold text-[0.88rem] shadow-[0_0_20px_rgba(255,45,120,0.12)] hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(255,45,120,0.3)] transition-all duration-300"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {isEs ? 'Unirse' : 'Join Us'} <ArrowRight size={16} />
                </a>
                <Link href="/proyectos"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/12 text-white/65 font-semibold text-[0.88rem] hover:border-white/20 hover:text-white hover:bg-white/[0.04] transition-all duration-300"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {t('home.seeProjects')} <BookOpen size={16} />
                </Link>
              </motion.div>

              {/* Hero mini-stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex items-center gap-6 mt-8 pt-7 border-t border-white/[0.08]"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#FF2D78]" style={{ fontFamily: "'Space Grotesk', sans-serif", textShadow: '0 0 14px rgba(255,45,120,0.12)' }}>3+</div>
                  <div className="text-[0.68rem] text-white/40 mt-0.5 font-medium tracking-wide">{isEs ? 'Novelas Visuales' : 'Visual Novels'}</div>
                </div>
                <div className="w-px h-8 bg-white/12" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#4D9FFF]" style={{ fontFamily: "'Space Grotesk', sans-serif", textShadow: '0 0 14px rgba(77,159,255,0.12)' }}>{compact(stats.downloads)}+</div>
                  <div className="text-[0.68rem] text-white/40 mt-0.5 font-medium tracking-wide">{isEs ? 'Descargas' : 'Downloads'}</div>
                </div>
                <div className="w-px h-8 bg-white/12" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#a855f7]" style={{ fontFamily: "'Space Grotesk', sans-serif", textShadow: '0 0 14px rgba(168,85,247,0.12)' }}>7+</div>
                  <div className="text-[0.68rem] text-white/40 mt-0.5 font-medium tracking-wide">{isEs ? 'Colaboradores' : 'Collaborators'}</div>
                </div>
              </motion.div>
            </div>

            {/* Right — Featured card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3 }}
            >
              <div className="rounded-[18px] overflow-hidden bg-white/[0.04] border border-white/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.4)] relative group">
                <img
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/sYvfOcdjjpxwpsYH.jpg"
                  alt="Visual Novel"
                  className="w-full h-[340px] object-cover transition-transform duration-[8s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080818]/95 via-transparent to-transparent flex flex-col justify-end p-6">
                  <div className="text-[0.6rem] font-semibold uppercase tracking-widest text-[#4D9FFF] mb-1">{isEs ? 'Proyecto Destacado' : 'Featured Project'}</div>
                  <div className="font-semibold text-[1.1rem]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{isEs ? 'Novela Visual en Español' : 'Visual Novel in Spanish'}</div>
                  <div className="text-[0.78rem] text-white/40 mt-0.5">{isEs ? "Creado con Ren'Py por The Encoders Club" : "Created with Ren'Py by The Encoders Club"}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

      {/* ═══════════════════════════════════════════════════════════
          2. APPROACH — 2-column with cards grid
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
            >
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[0.7rem] font-semibold uppercase tracking-wider mb-4 text-[#FF2D78] bg-[#FF2D78]/8 border border-[#FF2D78]/10">
                ◆ {isEs ? 'Nuestra Misión' : 'Our Mission'}
              </div>
              <h2 className="font-bold text-[clamp(1.8rem,3.5vw,2.4rem)] leading-[1.15] tracking-tight mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {isEs ? 'Donde las historias' : 'Where stories'} <span className="brand-gradient-text">{isEs ? 'cobran vida' : 'come alive'}</span>
              </h2>
              <p className="text-white/65 leading-8 text-[0.95rem] mb-3">
                {t('home.about.text1')}
              </p>
              <p className="text-white/65 leading-8 text-[0.95rem]">
                {t('home.about.text2')}
              </p>
              <div className="flex gap-2.5 flex-wrap mt-5">
                <Link href="/cursos" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF2D78] via-[#a855f7] to-[#4D9FFF] text-white font-semibold text-[0.88rem] shadow-[0_0_20px_rgba(255,45,120,0.12)] hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(255,45,120,0.3)] transition-all duration-300" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {t('home.seeCourses')} <ChevronRight size={14} />
                </Link>
                <Link href="/proyectos" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/12 text-white/65 font-semibold text-[0.88rem] hover:border-white/20 hover:text-white hover:bg-white/[0.04] transition-all duration-300" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {t('home.exploreProjects')}
                </Link>
              </div>
            </motion.div>

            {/* Approach cards grid */}
            <div className="grid grid-cols-2 gap-3">
              {approachCards.map((card, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="p-6 rounded-[14px] bg-white/[0.04] border border-white/[0.08] relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-white/12 hover:bg-white/[0.06] group"
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, transparent, ${['#FF2D78', '#4D9FFF', '#a855f7', '#22c55e'][i]}, transparent)` }} />
                  <span className="text-[1.4rem] block mb-2.5">{card.emoji}</span>
                  <h4 className="font-semibold text-[0.9rem] mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{isEs ? card.title : card.titleEn}</h4>
                  <p className="text-[0.78rem] text-white/40 leading-snug">{isEs ? card.desc : card.descEn}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. STATS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#06060f]">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCounter value={3} label={isEs ? 'Novelas Visuales' : 'Visual Novels'} icon={Gamepad2} color="#FF2D78" suffix="+" />
          <StatCounter value={stats.downloads} label={isEs ? 'Descargas' : 'Downloads'} icon={Download} color="#4D9FFF" suffix="+" />
          <StatCounter value={7} label={isEs ? 'Colaboradores' : 'Collaborators'} icon={Users} color="#a855f7" suffix="+" />
          <StatCounter value={stats.visits} label={isEs ? 'Visitas' : 'Visits'} icon={Eye} color="#22c55e" suffix="+" />
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

      {/* ═══════════════════════════════════════════════════════════
          4. TEAM
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[0.7rem] font-semibold uppercase tracking-wider mb-3.5 text-[#a855f7] bg-[#a855f7]/8 border border-[#a855f7]/10">
              ◆ {t('home.team.tag')}
            </div>
            <h2 className="font-bold text-[1.8rem] tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {t('home.team.title')} <span className="brand-gradient-text">{t('home.team.accent')}</span>
            </h2>
          </motion.div>
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex gap-5 w-max">
              {teamMembers.map((member, i) => (
                <motion.div
                  key={member.id}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex-shrink-0 w-[220px] p-7 rounded-[14px] bg-white/[0.04] border border-white/[0.08] text-center transition-all duration-300 hover:-translate-y-1 hover:border-white/12 hover:bg-white/[0.06]"
                >
                  <div
                    className="w-20 h-20 rounded-[20px] mx-auto mb-3.5 overflow-hidden"
                    style={{ border: `2px solid ${member.color}40`, boxShadow: `0 0 20px ${member.color}12` }}
                  >
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" loading="lazy" />
                  </div>
                  <div className="font-bold text-[0.92rem] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: member.color }}>{member.name}</div>
                  <div className="text-[0.68rem] text-white/40 leading-relaxed">
                    {member.cargo.map((role, idx) => (
                      <span key={idx}>{role}{idx < member.cargo.length - 1 ? ' • ' : ''}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          5. NEWS
      ═══════════════════════════════════════════════════════════ */}
      <NewsCarousel newsItems={newsItems} t={t} isEs={isEs} />

      {/* ── Divider ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

      {/* ═══════════════════════════════════════════════════════════
          6. FEATURES (Extras)
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-28 bg-[#06060f]">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[0.7rem] font-semibold uppercase tracking-wider mb-3.5 text-[#22c55e] bg-[#22c55e]/8 border border-[#22c55e]/10">
              ◆ {isEs ? 'Extras' : 'Extras'}
            </div>
            <h2 className="font-bold text-[1.8rem] tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {isEs ? 'Más que proyectos' : 'More than projects'} <span className="brand-gradient-text">{isEs ? 'una comunidad' : 'a community'}</span>
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Zap, color: '#FF2D78', title: isEs ? 'Traducciones' : 'Translations', desc: isEs ? 'Localizamos novelas visuales al español con la más alta calidad, preservando la esencia y el tono original de cada obra.' : 'We localize visual novels into Spanish with the highest quality, preserving the essence and original tone of each work.' },
              { icon: Heart, color: '#4D9FFF', title: isEs ? 'Código Abierto' : 'Open Source', desc: isEs ? 'Todos nuestros proyectos son open source. Puedes contribuir, aprender y ser parte activa del desarrollo.' : 'All our projects are open source. You can contribute, learn, and actively be part of the development.' },
              { icon: Globe, color: '#a855f7', title: isEs ? 'Comunidad Global' : 'Global Community', desc: isEs ? 'Colaboramos con personas de todo el mundo. Sin importar tu nivel de experiencia, hay un lugar para ti aquí.' : 'We collaborate with people from all over the world. Regardless of your experience level, there is a place for you here.' },
            ].map((feat, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="p-7 rounded-[14px] bg-white/[0.04] border border-white/[0.08] relative overflow-hidden transition-all duration-300 hover:-translate-y-[3px] hover:border-white/12 hover:bg-white/[0.06] group"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, transparent, ${feat.color}, transparent)` }} />
                <div className="w-11 h-11 rounded-[14px] flex items-center justify-center mb-3.5" style={{ background: `${feat.color}15`, border: `1px solid ${feat.color}25` }}>
                  <feat.icon size={22} style={{ color: feat.color }} />
                </div>
                <h4 className="font-semibold text-[0.95rem] mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{feat.title}</h4>
                <p className="text-[0.82rem] text-white/40 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          7. CTA
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-28">
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="p-14 rounded-[20px] bg-white/[0.04] border border-white/[0.08] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF2D78] via-[#a855f7] to-[#4D9FFF]" />
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#FF2D78]/6 blur-[50px] pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-[#4D9FFF]/4 blur-[50px] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="font-bold mb-3.5 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
                {t('home.cta.title')} <span className="brand-gradient-text">{t('home.cta.accent')}</span>
              </h2>
              <p className="text-white/65 mb-7 text-[0.95rem] leading-7">{t('home.cta.text')}</p>
              <div className="flex justify-center gap-3 flex-wrap">
                <a href="https://discord.gg/2DB5k7sb8" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#FF2D78] via-[#a855f7] to-[#4D9FFF] text-white font-semibold text-[0.88rem] shadow-[0_0_20px_rgba(255,45,120,0.12)] hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(255,45,120,0.3)] transition-all duration-300"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {t('home.cta.discord')} <ArrowRight size={16} />
                </a>
                <Link href="/cursos"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl border border-white/12 text-white/65 font-semibold text-[0.88rem] hover:border-white/20 hover:text-white hover:bg-white/[0.04] transition-all duration-300"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
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

/* ─── News Carousel ─── */
function NewsCarousel({ newsItems, t, isEs }: { newsItems: typeof newsItemsEs; t: ReturnType<typeof useI18n>['t']; isEs: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 lg:py-28">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-end justify-between gap-4 mb-7 flex-wrap">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[0.7rem] font-semibold uppercase tracking-wider mb-3.5 text-[#4D9FFF] bg-[#4D9FFF]/8 border border-[#4D9FFF]/10">
              ◆ {t('home.news.tag')}
            </div>
            <h2 className="font-bold text-[1.8rem] tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {t('home.news.title')} <span className="brand-gradient-text">{t('home.news.accent')}</span>
            </h2>
          </motion.div>
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:bg-white/[0.06] hover:text-white hover:border-white/12 transition-all">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll('right')} className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:bg-white/[0.06] hover:text-white hover:border-white/12 transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-3">
          {newsItems.map((item, i) => (
            <motion.article
              key={item.id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex-shrink-0 snap-start rounded-[14px] overflow-hidden bg-white/[0.04] border border-white/[0.08] transition-all duration-300 hover:-translate-y-1 hover:border-white/12 hover:shadow-[0_12px_32px_rgba(0,0,0,0.3)]"
              style={{ width: 'calc(33.333% - 11px)', minWidth: 280 }}
            >
              <div className="relative overflow-hidden h-40">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080818]/50 to-transparent" />
                <span
                  className="absolute top-2.5 left-2.5 text-[0.6rem] font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: `${item.tagColor}15`, border: `1px solid ${item.tagColor}30`, color: item.tagColor }}
                >
                  {item.tag}
                </span>
              </div>
              <div className="p-4 pb-5">
                <div className="text-[0.66rem] text-white/40 mb-1.5">{item.date}</div>
                <h3 className="font-semibold text-white text-[0.88rem] leading-snug mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {item.title}
                </h3>
                <p className="text-[0.74rem] text-white/40 leading-relaxed line-clamp-2 mb-3">{item.description}</p>
                <span className="text-[0.74rem] text-[#FF2D78] font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all">
                  {t('common.readMore')} <ChevronRight size={12} />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}
