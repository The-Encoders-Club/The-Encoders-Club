'use client';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Download, Users, Eye, Gamepad2, Sparkles, ChevronRight, Star, Heart, ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import BackgroundParticles from "@/components/BackgroundParticles";
import { useI18n } from "@/hooks/useLocale";

const BG_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663516100892/kzug5rLPLvVJzu5QVE66vY/hero_bg-nZF9vsy8Qjc3eRVqRoEgy7.webp";

const newsItemsEs = [
  { id: 1, title: "Nuevo Tutorial de Ren'Py", description: "Aprende los conceptos básicos de programación en Ren'Py con nuestro nuevo tutorial interactivo paso a paso.", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=340&fit=crop", date: "1 Abr 2026", tag: "Tutorial", tagColor: "#4D9FFF" },
  { id: 2, title: "Concurso de Novelas Visuales", description: "Participa en nuestro concurso anual y gana premios increíbles. ¡Las inscripciones ya están abiertas!", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=340&fit=crop", date: "28 Mar 2026", tag: "Evento", tagColor: "#FF2D78" },
  { id: 3, title: "Webinar: Diseño de Personajes", description: "Únete a nuestro webinar gratuito sobre técnicas avanzadas de diseño de personajes para novelas visuales.", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&h=340&fit=crop", date: "25 Mar 2026", tag: "Webinar", tagColor: "#a855f7" },
  { id: 4, title: "Actualización de Herramientas", description: "Descubre las nuevas herramientas y mejoras que hemos añadido a nuestra plataforma de desarrollo.", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=340&fit=crop", date: "20 Mar 2026", tag: "Actualización", tagColor: "#22c55e" },
];

const newsItemsEn = [
  { id: 1, title: "New Ren'Py Tutorial", description: "Learn the basics of Ren'Py programming with our new step-by-step interactive tutorial.", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=340&fit=crop", date: "Apr 1, 2026", tag: "Tutorial", tagColor: "#4D9FFF" },
  { id: 2, title: "Visual Novel Contest", description: "Join our annual contest and win amazing prizes. Registration is now open!", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=340&fit=crop", date: "Mar 28, 2026", tag: "Event", tagColor: "#FF2D78" },
  { id: 3, title: "Webinar: Character Design", description: "Join our free webinar on advanced character design techniques for visual novels.", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&h=340&fit=crop", date: "Mar 25, 2026", tag: "Webinar", tagColor: "#a855f7" },
  { id: 4, title: "Tools Update", description: "Discover the new tools and improvements we've added to our development platform.", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=340&fit=crop", date: "Mar 20, 2026", tag: "Update", tagColor: "#22c55e" },
];

const teamMembers = [
  { id: 1, name: "Slytharbez", cargo: ["Desarrollador", "Moderador", "Traductor", "Ideas"], cargoEn: ["Developer", "Moderator", "Translator", "Ideas"], color: "#FF2D78", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/sYvfOcdjjpxwpsYH.jpg" },
  { id: 2, name: "The_Player_Madness", cargo: ["Desarrollador", "Traductor"], cargoEn: ["Developer", "Translator"], color: "#4D9FFF", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/fqvycZADioutZyXg.jpg" },
  { id: 3, name: "Francisco", cargo: ["Beta Tester", "Traductor"], cargoEn: ["Beta Tester", "Translator"], color: "#a855f7", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/NdddEeYbkRaZUwAf.jpg" },
  { id: 4, name: "Ashi", cargo: ["Ideas"], cargoEn: ["Ideas"], color: "#22c55e", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/owXrIjTwHSFTkmKB.jpg" },
  { id: 5, name: "mondongo8360", cargo: ["Traductor"], cargoEn: ["Translator"], color: "#FF2D78", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/cCtjHYrvAzaOHjEd.jpg" },
  { id: 6, name: "FlagBro23", cargo: ["Traductor"], cargoEn: ["Translator"], color: "#4D9FFF", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/iecokdxZIrlMEbyP.jpg" },
  { id: 7, name: "Manu", cargo: ["Traductor"], cargoEn: ["Translator"], color: "#a855f7", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/bIiIQjvPOSUKgAUl.jpg" },
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

  const formatted = count >= 1000000 ? `${(count / 1000000).toFixed(1)}M` : count >= 1000 ? `${(count / 1000).toFixed(0)}K` : count.toString();

  return (
    <div ref={ref} className="flex flex-col items-center text-center p-4 md:p-6">
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center mb-2.5 md:mb-3" style={{ background: `${color}18`, border: `1px solid ${color}35` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <span className="text-2xl md:text-3xl font-bold mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif", color }}>{formatted}{suffix}</span>
      <span className="text-xs md:text-sm text-white/45">{label}</span>
    </div>
  );
}

// Fade-up variants for scroll animations
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

const FALLBACK_STATS = { downloads: 15000, visits: 50000 };

export default function Home() {
  const { t, locale } = useI18n();
  const isEs = locale === 'es';
  const newsItems = isEs ? newsItemsEs : newsItemsEn;

  const [liveStats, setLiveStats] = useState<{ downloads: number; visits: number } | null>(null);

  // News scroll ref
  const newsScrollRef = useRef<HTMLDivElement>(null);
  const [newsCanScrollLeft, setNewsCanScrollLeft] = useState(false);
  const [newsCanScrollRight, setNewsCanScrollRight] = useState(true);

  // Team scroll ref
  const teamScrollRef = useRef<HTMLDivElement>(null);
  const [teamCanScrollLeft, setTeamCanScrollLeft] = useState(false);
  const [teamCanScrollRight, setTeamCanScrollRight] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(data => {
        if (data.visits !== undefined && data.downloads !== undefined) {
          setLiveStats({ downloads: data.downloads, visits: data.visits });
        }
      })
      .catch(() => {});
  }, []);

  const stats = liveStats || FALLBACK_STATS;

  // Scroll helpers
  const checkScroll = (ref: React.RefObject<HTMLDivElement | null>, setLeft: (v: boolean) => void, setRight: (v: boolean) => void) => {
    if (!ref.current) return;
    const el = ref.current;
    setLeft(el.scrollLeft > 10);
    setRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, dir: 'left' | 'right') => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  useEffect(() => {
    const newsEl = newsScrollRef.current;
    const teamEl = teamScrollRef.current;
    if (newsEl) {
      newsEl.addEventListener('scroll', () => checkScroll(newsScrollRef, setNewsCanScrollLeft, setNewsCanScrollRight));
      checkScroll(newsScrollRef, setNewsCanScrollLeft, setNewsCanScrollRight);
    }
    if (teamEl) {
      teamEl.addEventListener('scroll', () => checkScroll(teamScrollRef, setTeamCanScrollLeft, setTeamCanScrollRight));
      checkScroll(teamScrollRef, setTeamCanScrollLeft, setTeamCanScrollRight);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#080818] text-white overflow-x-hidden">
      <Navbar />
      <BackgroundParticles />

      {/* ============================================ */}
      {/* HERO SECTION — Compact, Visual Novel themed */}
      {/* ============================================ */}
      <section className="relative pt-16 pb-6 md:pt-20 md:pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={BG_URL} alt="" className="w-full h-full object-cover opacity-25" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080818]/70 via-[#080818]/50 to-[#080818]" />
        </div>
        <div className="absolute top-1/3 left-1/6 w-48 h-48 md:w-64 md:h-64 rounded-full bg-[#FF2D78]/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/6 w-56 h-56 md:w-80 md:h-80 rounded-full bg-[#4D9FFF]/8 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            {/* VN-inspired badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 md:mb-6 border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <Gamepad2 size={14} className="text-[#FF2D78]" />
              <span className="text-xs font-medium text-white/60 tracking-wide">
                {isEs ? 'Comunidad de Novelas Visuales' : 'Visual Novel Community'}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-4 md:mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <span className="text-white">{t('home.hero.title1')} </span>
              <span className="brand-gradient-text">{t('home.hero.title2')}</span>
              <br />
              <span className="text-white">{t('home.hero.title3')}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-sm md:text-lg text-white/55 leading-relaxed mb-6 md:mb-8 max-w-xl mx-auto md:mx-0"
            >
              {t('home.hero.subtitle')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-wrap gap-3 justify-center md:justify-start"
            >
              <Link href="/proyectos" className="btn-primary text-sm md:text-base px-6 py-3 md:px-7 md:py-3.5">
                {t('home.seeProjects')} <ArrowRight size={16} />
              </Link>
              <Link href="/cursos" className="btn-outline text-sm md:text-base px-6 py-3 md:px-7 md:py-3.5">
                <BookOpen size={16} /> {t('home.learnMore')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* STATS SECTION — Immediately after hero      */}
      {/* 2x2 grid on mobile, 4 cols on desktop       */}
      {/* ============================================ */}
      <section className="py-6 md:py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-0 md:divide-x divide-white/8">
            <div className="app-stat-card">
              <StatCounter value={3} label={t('home.projectsLabel')} icon={BookOpen} color="#FF2D78" suffix="+" />
            </div>
            <div className="app-stat-card">
              <StatCounter value={stats.downloads} label={t('home.downloadsLabel')} icon={Download} color="#4D9FFF" suffix="+" />
            </div>
            <div className="app-stat-card">
              <StatCounter value={7} label={t('home.coursesLabel')} icon={Users} color="#a855f7" suffix="+" />
            </div>
            <div className="app-stat-card">
              <StatCounter value={stats.visits} label={t('home.visitsLabel')} icon={Eye} color="#22c55e" suffix="+" />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* ABOUT SECTION — Ren'Py Focus (desktop only)  */}
      {/* On mobile: integrated into a compact card    */}
      {/* ============================================ */}
      <section className="py-8 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile: Compact card */}
          <div className="md:hidden">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="app-card p-5 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-0.5 brand-gradient" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#FF2D78]/15 border border-[#FF2D78]/25 flex items-center justify-center flex-shrink-0">
                  <Gamepad2 size={20} className="text-[#FF2D78]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {t('home.about.renpyTitle')}
                  </h3>
                  <p className="text-xs text-white/40">{t('home.about.renpySub')}</p>
                </div>
              </div>
              <p className="text-white/55 text-xs leading-relaxed mb-4">
                {t('home.about.renpyText')}
              </p>
              <div className="flex flex-wrap gap-2">
                {[t('home.about.easyToLearn'), t('home.about.python'), t('home.about.crossPlatform'), t('home.about.activeCommunity')].map(feat => (
                  <span key={feat} className="inline-flex items-center gap-1 text-[10px] text-white/50 bg-white/5 px-2.5 py-1 rounded-full border border-white/8">
                    <Star size={10} className="text-[#FF2D78]" />{feat}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Desktop: Full about section */}
          <div className="hidden md:grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="glass-card p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 brand-gradient" />
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF2D78]/15 border border-[#FF2D78]/30 flex items-center justify-center">
                    <Gamepad2 size={24} className="text-[#FF2D78]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{t('home.about.renpyTitle')}</h3>
                    <p className="text-sm text-white/50">{t('home.about.renpySub')}</p>
                  </div>
                </div>
                <p className="text-white/65 text-sm leading-relaxed mb-6">
                  {t('home.about.renpyText')}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[t('home.about.easyToLearn'), t('home.about.python'), t('home.about.crossPlatform'), t('home.about.activeCommunity')].map(feat => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-white/60">
                      <Star size={12} className="text-[#FF2D78] flex-shrink-0" />{feat}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-[#FF2D78] text-sm font-semibold uppercase tracking-widest mb-3 block">{t('home.about.tag')}</span>
              <h2 className="section-title text-white mb-5">{t('home.about.title')} <span className="brand-gradient-text">{t('home.about.accent')}</span></h2>
              <p className="text-white/65 leading-relaxed mb-5">{t('home.about.text1')}</p>
              <p className="text-white/65 leading-relaxed mb-8">{t('home.about.text2')}</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/cursos" className="btn-primary text-sm px-5 py-2.5">
                  {t('home.seeCourses')} <ChevronRight size={16} />
                </Link>
                <Link href="/proyectos" className="btn-outline text-sm px-5 py-2.5">
                  {t('home.exploreProjects')}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* NEWS SECTION — Horizontal scroll on mobile  */}
      {/* Grid on desktop                              */}
      {/* ============================================ */}
      <section className="py-8 md:py-20 bg-[#06060f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 md:mb-12">
            <div>
              <span className="text-[#4D9FFF] text-xs md:text-sm font-semibold uppercase tracking-widest mb-2 md:mb-3 block">{t('home.news.tag')}</span>
              <h2 className="text-xl md:text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {t('home.news.title')} <span className="brand-gradient-text">{t('home.news.accent')}</span>
              </h2>
            </div>
            <Link href="/noticias" className="btn-outline text-xs md:text-sm px-4 py-2 md:px-5 md:py-2.5 whitespace-nowrap self-start">
              {t('home.seeAll')} <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile: Horizontal scroll */}
          <div className="md:hidden relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#06060f] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#06060f] to-transparent z-10 pointer-events-none" />

            <div
              ref={newsScrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-4 px-4"
            >
              {newsItems.map((item, i) => (
                <motion.article
                  key={item.id}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="app-news-card flex-shrink-0 w-[280px] snap-start"
                >
                  <div className="relative overflow-hidden h-36">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span
                      className="absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: `${item.tagColor}20`, border: `1px solid ${item.tagColor}40`, color: item.tagColor }}
                    >
                      {item.tag}
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="font-bold text-white text-sm leading-snug line-clamp-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[11px] text-white/40 mb-1.5">{item.date}</p>
                    <p className="text-xs text-white/50 leading-relaxed line-clamp-2 mb-3">{item.description}</p>
                    <span className="text-[11px] text-[#FF2D78] font-semibold flex items-center gap-1">
                      {t('common.readMore')} <ChevronRight size={11} />
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          {/* Desktop: Grid */}
          <div className="hidden md:grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
      </section>

      {/* ============================================ */}
      {/* TEAM SECTION — Horizontal carousel mobile   */}
      {/* Grid on desktop                               */}
      {/* ============================================ */}
      <section id="equipo" className="py-8 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-14">
            <span className="text-[#a855f7] text-xs md:text-sm font-semibold uppercase tracking-widest mb-2 md:mb-3 block">{t('home.team.tag')}</span>
            <h2 className="text-xl md:text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {t('home.team.title')} <span className="brand-gradient-text">{t('home.team.accent')}</span>
            </h2>
          </div>

          {/* Mobile: Horizontal carousel */}
          <div className="md:hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#080818] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#080818] to-transparent z-10 pointer-events-none" />

            <div
              ref={teamScrollRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-4 px-4"
            >
              {teamMembers.map((member, i) => (
                <motion.div
                  key={member.id}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="app-team-card flex-shrink-0 w-44 snap-start"
                >
                  <div
                    className="w-20 h-20 rounded-2xl mb-3 flex items-center justify-center relative overflow-hidden mx-auto"
                    style={{ background: `linear-gradient(135deg, ${member.color}20, ${member.color}08)`, border: `2px solid ${member.color}35` }}
                  >
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <h3 className="font-bold text-sm text-center mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: member.color }}>
                    {member.name}
                  </h3>
                  <div className="flex flex-wrap justify-center gap-1">
                    {(isEs ? member.cargo : member.cargoEn).map((role, idx) => (
                      <span key={idx} className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                        {role}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Desktop: Horizontal scroll with cards */}
          <div className="hidden md:block">
            <div className="overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 lg:-mx-8 lg:px-8">
              <div className="flex gap-6 lg:gap-8 w-max">
                {teamMembers.map((member, i) => (
                  <motion.div
                    key={member.id}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="glass-card p-8 flex flex-col items-center text-center group flex-shrink-0 w-64 lg:w-72"
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
                      {(isEs ? member.cargo : member.cargoEn).map((role, idx) => (
                        <p key={idx} className="text-xs text-white/50">{role}</p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA SECTION — Join the community             */}
      {/* ============================================ */}
      <section className="py-8 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="app-card p-6 md:p-10 lg:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-0.5 brand-gradient" />
            <div className="absolute -top-16 -right-16 w-48 h-48 md:w-60 md:h-60 rounded-full bg-[#FF2D78]/6 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 md:w-60 md:h-60 rounded-full bg-[#4D9FFF]/6 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 md:mb-5 border border-white/10 bg-white/5"
              >
                <Sparkles size={12} className="text-[#FF2D78]" />
                <span className="text-xs font-medium text-white/50">{t('home.cta.tag')}</span>
              </motion.div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {t('home.cta.title')} <span className="brand-gradient-text">{t('home.cta.accent')}</span>
              </h2>
              <p className="text-white/50 text-sm md:text-base mb-6 md:mb-8 max-w-xl mx-auto leading-relaxed">
                {t('home.cta.text')}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <a
                  href="https://discord.gg/2DB5k7sb8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm md:text-base px-6 py-3 md:px-8 md:py-3.5"
                >
                  {t('home.cta.discord')} <ArrowRight size={16} />
                </a>
                <Link href="/cursos" className="btn-outline text-sm md:text-base px-6 py-3 md:px-8 md:py-3.5">
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
