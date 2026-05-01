'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import {
  Star, Sparkles, ArrowRight, Gamepad2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundParticles from '@/components/BackgroundParticles';
import { useI18n } from '@/hooks/useLocale';
import { projects } from '@/data/projects';

const PROYECTOS_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663520694523/gdw63Pfk2mCpqaap3WKi6Q/ProyectoFondo_c3356f10.jpg';

export default function Proyectos() {
  const { t, locale } = useI18n();
  const isEs = locale === 'es';

  // Ref para medir el contenedor de imagen de Natsuki
  const natsukiImgRef = useRef<HTMLDivElement>(null);
  const [yuriImgHeight, setYuriImgHeight] = useState<number | null>(null);

  useEffect(() => {
    const measure = () => {
      if (natsukiImgRef.current) {
        setYuriImgHeight(natsukiImgRef.current.offsetHeight);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const nonFeatured = projects.filter(p => !p.featured);

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden relative bg-[#080818]"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(8, 8, 24, 0.85) 0%, rgba(26, 10, 26, 0.8) 50%, rgba(8, 8, 24, 0.85) 100%), url("${PROYECTOS_BG}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <BackgroundParticles />
      <Navbar />

      {/* PAGE HEADER */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-[#FF2D78] text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3 block">
              {isEs ? 'Nuestras creaciones' : 'Our creations'}
            </span>
            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {t('projects.title')}
            </h1>
            <p className="text-white/60 text-base sm:text-lg max-w-2xl">
              {isEs
                ? "Novelas visuales creadas con pasión por nuestra comunidad usando el motor Ren'Py."
                : "Visual novels created with passion by our community using the Ren'Py engine."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* FEATURED */}
          {projects
            .filter(p => p.featured)
            .map(project => (
              <Link key={project.id} href={`/proyectos/${project.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden mb-8 cursor-pointer group hover:border-[#FF2D78]/40 transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF2D78] to-[#00F3FF]" />
                  <div className="flex flex-col lg:flex-row gap-0">
                    <div className="relative border-b lg:border-b-0 lg:border-r border-white/5 bg-black/20 lg:flex-shrink-0">
                      <div className="relative">
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-full lg:w-auto lg:max-h-[520px] block group-hover:scale-105 transition-transform duration-700"
                          style={{ objectFit: 'contain' }}
                        />
                        <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full bg-[#FF2D78] text-white z-10">
                          {t('projects.featured')}
                        </span>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 z-10">
                          <div className="bg-white/10 border border-white/20 px-6 py-3 rounded-full flex items-center gap-2 text-sm font-bold backdrop-blur-sm">
                            <Sparkles size={16} className="text-[#FF2D78]" />{t('projects.explore')}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${project.statusColor}20`, border: `1px solid ${project.statusColor}40`, color: project.statusColor }}>
                          {isEs ? project.status : (project.statusEn || project.status)}
                        </span>
                        <div className="flex items-center gap-1 text-yellow-400 text-xs">
                          <Star size={12} fill="currentColor" />
                          <span>{project.rating}</span>
                        </div>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {project.name}
                      </h2>
                      <p className="text-[#FF2D78] text-sm font-medium mb-4">{project.subtitle}</p>
                      <p className="text-white/60 text-base leading-relaxed mb-6">
                        {isEs ? project.description : (project.descriptionEn || project.description)}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map(tag => (
                          <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60">{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-[#FF2D78] font-bold text-sm group-hover:translate-x-2 transition-transform">
                        {t('common.viewMore')} <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}

          {/* GRID */}
          <div className="grid sm:grid-cols-2 gap-6">
            {nonFeatured.map((project, i) => {
              const isNatsuki = project.id === 'just-natsuki';
              const isYuri    = project.id === 'just-yuri';

              return (
                <Link key={project.id} href={`/proyectos/${project.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden cursor-pointer group hover:border-[#00F3FF]/40 transition-all duration-300"
                  >
                    {/* IMAGEN */}
                    <div className="relative border-b border-white/5">

                      {/* ── NATSUKI: sin tocar, igual que siempre ── */}
                      {isNatsuki && (
                        <div ref={natsukiImgRef} className="relative">
                          <img
                            src={project.image}
                            alt={project.name}
                            className="w-full block group-hover:scale-105 transition-transform duration-700"
                          />
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: 'linear-gradient(to top, rgba(13,13,36,0.75) 0%, transparent 40%)' }}
                          />
                          <div className="absolute bottom-3 left-4 flex items-center gap-2 z-10">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${project.statusColor}20`, border: `1px solid ${project.statusColor}40`, color: project.statusColor }}>
                              {isEs ? project.status : (project.statusEn || project.status)}
                            </span>
                            <div className="flex items-center gap-1 text-yellow-400 text-xs">
                              <Star size={11} fill="currentColor" />
                              <span>{project.rating}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ── YURI: forzado al mismo alto que Natsuki ── */}
                      {isYuri && (
                        <div
                          className="relative overflow-hidden"
                          style={{
                            height: yuriImgHeight ? `${yuriImgHeight}px` : 'auto',
                          }}
                        >
                          <img
                            src={project.image}
                            alt={project.name}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                          />
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: 'linear-gradient(to top, rgba(13,13,36,0.75) 0%, transparent 40%)' }}
                          />
                          <div className="absolute bottom-3 left-4 flex items-center gap-2 z-10">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${project.statusColor}20`, border: `1px solid ${project.statusColor}40`, color: project.statusColor }}>
                              {isEs ? project.status : (project.statusEn || project.status)}
                            </span>
                            <div className="flex items-center gap-1 text-yellow-400 text-xs">
                              <Star size={11} fill="currentColor" />
                              <span>{project.rating}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ── Resto de proyectos: sin cambios ── */}
                      {!isNatsuki && !isYuri && (
                        <div className="relative">
                          <img
                            src={project.image}
                            alt={project.name}
                            className="w-full block group-hover:scale-105 transition-transform duration-700"
                          />
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: 'linear-gradient(to top, rgba(13,13,36,0.75) 0%, transparent 40%)' }}
                          />
                          <div className="absolute bottom-3 left-4 flex items-center gap-2 z-10">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${project.statusColor}20`, border: `1px solid ${project.statusColor}40`, color: project.statusColor }}>
                              {isEs ? project.status : (project.statusEn || project.status)}
                            </span>
                            <div className="flex items-center gap-1 text-yellow-400 text-xs">
                              <Star size={11} fill="currentColor" />
                              <span>{project.rating}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* TEXTO */}
                    <div className="p-6">
                      <h3
                        className="text-lg font-bold text-white mb-1"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {project.name}
                      </h3>
                      <p className="text-[#00F3FF] text-xs font-medium mb-3">{project.subtitle}</p>
                      <p className="text-white/55 text-sm leading-relaxed mb-4 line-clamp-3">
                        {isEs ? project.description : (project.descriptionEn || project.description)}
                      </p>
                      <div className="flex items-center gap-2 text-[#00F3FF] font-bold text-xs group-hover:translate-x-2 transition-transform">
                        {t('common.viewMore')} <ArrowRight size={14} />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* COMING SOON */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 bg-white/5 border border-white/10 rounded-3xl p-8 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF2D78]/5 via-[#a855f7]/5 to-[#00F3FF]/5 pointer-events-none" />
            <Gamepad2 size={32} className="text-[#FF2D78] mx-auto mb-3" />
            <h3
              className="text-xl font-bold text-white mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {isEs ? 'Más proyectos en camino' : 'More projects coming'}
            </h3>
            <p className="text-white/50 text-sm max-w-md mx-auto">
              {isEs
                ? 'Estamos trabajando en nuevas novelas visuales. Únete a nuestro Discord para ser el primero en enterarte.'
                : 'We are working on new visual novels. Join our Discord to be the first to know.'}
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}