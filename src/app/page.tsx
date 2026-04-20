'use client';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Download, Users, Eye, Gamepad2, Sparkles, ChevronRight, Star } from "lucide-react";
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
    const step = value / 40; // Reduced from 60 to 40 steps (faster, less interval ticks)
    const interval = setInterval(() => {
      current += step;
      if (current >= value) { setCount(value); clearInterval(interval); }
      else setCount(Math.floor(current));
    }, 30);
    return () => clearInterval(interval);
  }, [triggered, value]);

  const formatted = count >= 1000000 ? `${(count / 1000000).toFixed(1)}M` : count >= 1000 ? `${(count / 1000).toFixed(0)}K` : count.toString();

  return (
    <div ref={ref} className="flex flex-col items-center text-center p-6">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
        <Icon size={22} style={{ color }} />
      </div>
      <span className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color }}>{formatted}{suffix}</span>
      <span className="text-sm text-white/50">{label}</span>
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

export default function Home() {
  const { t, locale } = useI18n();
  const isEs = locale === 'es';
  const newsItems = isEs ? newsItemsEs : newsItemsEn;

  return (
    <div className="min-h-screen bg-[#080818] text-white overflow-x-hidden">
      <Navbar />
      <BackgroundParticles />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={BG_URL} alt="" className="w-full h-full object-cover opacity-30" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080818]/60 via-transparent to-[#080818]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080818] via-transparent to-[#080818]/60" />
        </div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#FF2D78]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#4D9FFF]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            <div className="hidden lg:flex flex-col items-center justify-center relative order-1 lg:order-1">
              <div className="absolute w-72 h-72 lg:w-96 lg:h-96 rounded-full bg-[#FF2D78]/10 blur-3xl" />
            </div>
            <div className="flex flex-col justify-center lg:pl-8 order-2 lg:order-2">
              {/* Hero animations: these are one-shot (no infinite loop) so they're fine */}
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
                <Link href="/proyectos" className="btn-primary text-base px-7 py-3.5">
                  {t('home.seeProjects')} <ArrowRight size={18} />
                </Link>
                <Link href="/cursos" className="btn-outline text-base px-7 py-3.5">
                  <BookOpen size={18} /> {t('home.learnMore')}
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
                  <p className="text-xs text-white/45">{t('home.projectsLabel')}</p>
                </div>
                <div className="w-px h-10 bg-white/15" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#4D9FFF]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>7+</p>
                  <p className="text-xs text-white/45">{t('home.coursesLabel')}</p>
                </div>
                <div className="w-px h-10 bg-white/15" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#a855f7]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>&infin;</p>
                  <p className="text-xs text-white/45">{t('home.creativityLabel')}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator — CSS animation instead of framer-motion infinite */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
          style={{ animation: 'scrollBounce 2s ease-in-out infinite' }}
        >
          <span className="text-xs">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
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
              <p className="text-white/65 leading-relaxed mb-5">
                {t('home.about.text1')}
              </p>
              <p className="text-white/65 leading-relaxed mb-8">
                {t('home.about.text2')}
              </p>
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

      {/* NEWS */}
      <section className="py-20 lg:py-28 bg-[#06060f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-[#4D9FFF] text-sm font-semibold uppercase tracking-widest mb-3 block">{t('home.news.tag')}</span>
              <h2 className="section-title text-white">{t('home.news.title')} <span className="brand-gradient-text">{t('home.news.accent')}</span></h2>
            </div>
            <Link href="/noticias" className="btn-outline text-sm px-5 py-2.5 whitespace-nowrap">
              {t('home.seeAll')} <ArrowRight size={15} />
            </Link>
          </div>
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

      {/* TEAM */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
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

      {/* STATS */}
      <section className="py-16 bg-[#06060f] border-y border-white/6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/8">
            <StatCounter value={3} label={t('home.projectsLabel')} icon={BookOpen} color="#FF2D78" suffix="+" />
            <StatCounter value={15000} label={t('home.downloadsLabel')} icon={Download} color="#4D9FFF" suffix="+" />
            <StatCounter value={7} label={t('home.coursesLabel')} icon={Users} color="#a855f7" suffix="+" />
            <StatCounter value={50000} label={t('home.visitsLabel')} icon={Eye} color="#22c55e" suffix="+" />
          </div>
        </div>
      </section>

      {/* CTA */}
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
