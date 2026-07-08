'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Star, Sparkles, ArrowRight, Gamepad2, Search, X
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundParticles from '@/components/BackgroundParticles';
import { useI18n } from '@/hooks/useLocale';
import { projects } from '@/data/projects';
import type { DynamicProject } from '@/data/dynamic-projects';

const PROYECTOS_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663520694523/gdw63Pfk2mCpqaap3WKi6Q/ProyectoFondo_c3356f10.jpg';

/* ─── Normalized project shape (works for both hardcoded & dynamic) ─── */
interface NormalizedProject {
  id: string;
  name: string;
  subtitle?: string;
  description: string;
  descriptionEn?: string;
  image: string;
  coverBg?: string | null;
  coverFit?: 'contain' | 'cover';
  tags: readonly string[] | string[];
  status: string;
  statusEn?: string;
  statusColor: string;
  rating: number;
  featured: boolean;
  themeColor: string;
  /** marks hardcoded projects so the grid can keep them visually identical */
  isHardcoded: boolean;
}

function normalizeHardcoded(p: typeof projects[number]): NormalizedProject {
  return {
    id: p.id,
    name: p.name,
    subtitle: p.subtitle,
    description: p.description,
    descriptionEn: p.descriptionEn,
    image: p.image,
    coverBg: p.coverBg,
    coverFit: p.coverFit as 'contain' | 'cover' | undefined,
    tags: p.tags,
    status: p.status,
    statusEn: p.statusEn,
    statusColor: p.statusColor,
    rating: p.rating,
    featured: !!p.featured,
    themeColor: p.themeColor,
    isHardcoded: true,
  };
}

function normalizeDynamic(p: DynamicProject): NormalizedProject {
  return {
    id: p.id,
    name: p.name,
    subtitle: p.subtitle,
    description: p.description,
    descriptionEn: p.descriptionEn,
    image: p.image,
    coverBg: p.coverBg,
    coverFit: p.coverFit,
    tags: p.tags,
    status: p.status,
    statusEn: p.statusEn,
    statusColor: p.statusColor,
    rating: p.rating,
    featured: !!p.featured,
    themeColor: p.themeColor,
    isHardcoded: false,
  };
}

/* ─── Main page ─── */
export default function Proyectos() {
  const { t, locale } = useI18n();
  const isEs = locale === 'es';

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dynamic projects (admin-managed) — fetched on mount. Empty list
  // until the request completes (or fails silently, in which case
  // only the hardcoded projects are shown, exactly like before).
  const [dynamicProjects, setDynamicProjects] = useState<NormalizedProject[]>([]);
  const [dynamicLoading, setDynamicLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/projects')
      .then(r => r.ok ? r.json() : Promise.resolve({ projects: [] }))
      .then((raw: unknown) => {
        if (cancelled) return;
        const data = raw as { projects?: DynamicProject[] };
        const list: DynamicProject[] = Array.isArray(data?.projects) ? data.projects : [];
        setDynamicProjects(list.map(normalizeDynamic));
      })
      .catch(() => { /* fail silently — hardcoded projects still render */ })
      .finally(() => { if (!cancelled) setDynamicLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [searchQuery]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
  }, []);

  // Merge hardcoded + dynamic for the unified list. Hardcoded projects
  // always keep their original ordering and featured flag.
  const allProjects = useMemo(() => {
    const hardcodedNorm = projects.map(normalizeHardcoded);
    return [...hardcodedNorm, ...dynamicProjects];
  }, [dynamicProjects]);

  const featuredProjects = useMemo(() => allProjects.filter(p => p.featured), [allProjects]);
  const otherProjects = useMemo(() => allProjects.filter(p => !p.featured), [allProjects]);

  const isSearching = debouncedQuery.trim().length > 0;

  const filteredProjects = useMemo(() => {
    if (!isSearching) return { featured: featuredProjects, other: otherProjects };
    const q = debouncedQuery.toLowerCase().trim();
    const results = allProjects.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.descriptionEn && p.descriptionEn.toLowerCase().includes(q))
    );
    return { featured: [], other: results };
  }, [debouncedQuery, isSearching, featuredProjects, otherProjects, allProjects]);

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden relative bg-[#030308]"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(3, 3, 8, 0.85) 0%, rgba(26, 10, 26, 0.8) 50%, rgba(3, 3, 8, 0.85) 100%), url("${PROYECTOS_BG}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <BackgroundParticles />
      <Navbar />

      {/* PAGE HEADER */}
      <section className="pt-16 sm:pt-20 pb-12 sm:pb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="font-cyber font-bold text-sm tracking-widest text-[#FF2D78] mb-3 block">
              {'// '}{isEs ? 'Nuestras creaciones' : 'Our creations'}
            </span>
            <h1 className="font-cyber text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 uppercase tracking-tight">
              {t('projects.title')}
            </h1>
            <p className="font-code text-sm text-white/60 max-w-2xl">
              {isEs
                ? 'Novelas visuales creadas con pasión por nuestra comunidad usando el motor Ren\'Py.'
                : 'Visual novels created with passion by our community using the Ren\'Py engine.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative max-w-lg"
          >
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar proyecto..."
              className="w-full pl-11 pr-10 py-3 bg-[#0e0e1f] border border-white/10 text-white font-code text-sm placeholder:text-white/35 outline-none focus:border-[#00F2FE]/50 focus:ring-1 focus:ring-[#00F2FE]/30 transition-all duration-200"
            />
            {searchQuery.length > 0 && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors p-0.5"
                aria-label="Limpiar búsqueda"
              >
                <X size={16} />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── FEATURED (Monika + any dynamic project marked as featured) ── */}
          {!isSearching && filteredProjects.featured
            .map(project => (
              <Link key={project.id} href={`/proyectos/${project.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="relative clip-card bg-[#0e0e1f] neon-border-cyan overflow-hidden mb-8 cursor-pointer group transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF2D78] to-[#00F2FE]" />
                  <div className="grid lg:grid-cols-2 gap-0">
                    <div
                      className="relative flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5"
                      style={{
                        background: project.coverBg ?? `linear-gradient(145deg, ${project.themeColor}18 0%, #0d0d24 40%, ${project.themeColor}10 100%)`,
                      }}
                    >
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700"
                      />
                      <span className="absolute top-4 left-4 font-cyber font-bold text-xs px-3 py-1.5 bg-[#FF2D78] text-black z-10">
                        {t('projects.featured')}
                      </span>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 z-10">
                        <div className="clip-btn bg-[#080812]/80 border border-white/20 px-6 py-3 flex items-center gap-2 font-code text-sm font-bold backdrop-blur-sm text-[#00F2FE]">
                          <Sparkles size={16} className="text-[#FF2D78]" />{t('projects.explore')}
                        </div>
                      </div>
                    </div>
                    <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-code text-[10px] font-semibold px-2.5 py-1 bg-[#080812] border border-white/10" style={{ borderLeftColor: project.statusColor, borderLeftWidth: '2px', color: project.statusColor }}>
                          {isEs ? project.status : (project.statusEn || project.status)}
                        </span>
                        <div className="flex items-center gap-1 text-yellow-400 text-xs">
                          <Star size={12} fill="currentColor" />
                          <span className="font-code text-[10px]">{project.rating}</span>
                        </div>
                      </div>
                      <h2 className="font-cyber text-2xl sm:text-3xl font-bold text-white mb-2">
                        {project.name}
                      </h2>
                      <p className="text-[#FF2D78] font-code text-xs font-medium mb-4">{project.subtitle}</p>
                      <p className="text-white/60 text-base leading-relaxed mb-6">
                        {isEs ? project.description : (project.descriptionEn || project.description)}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map(tag => (
                          <span key={tag} className="font-code text-[10px] px-3 py-1 bg-[#080812] border border-white/8 text-white/60">{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-[#00F2FE] font-cyber font-bold text-sm group-hover:translate-x-2 transition-transform">
                        {t('common.viewMore')} <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}

          {/* ── GRID (Natsuki / Yuri / dynamic projects) ── */}
          {isSearching && filteredProjects.other.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center py-16"
            >
              <Search size={40} className="text-white/15 mx-auto mb-4" />
              <p className="font-cyber text-white/40 text-lg font-bold">No se encontraron proyectos</p>
              <p className="font-code text-white/25 text-sm mt-1">Intenta con otro término de búsqueda</p>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {filteredProjects.other
                .map((project, i) => {
                const isCover = project.coverFit === 'cover';
                return (
                  <Link key={project.id} href={`/proyectos/${project.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      className="clip-card bg-[#0e0e1f] border border-white/10 overflow-hidden cursor-pointer group hover:border-[#00F2FE]/40 transition-all duration-300"
                    >
                      <div
                        className="relative flex items-center justify-center overflow-hidden border-b border-white/5"
                        style={{
                          aspectRatio: isCover ? '16/9' : undefined,
                          background: project.coverBg ?? `linear-gradient(145deg, ${project.themeColor}18 0%, #0d0d24 40%, ${project.themeColor}10 100%)`,
                        }}
                      >
                        <img
                          src={project.image}
                          alt={project.name}
                          className={`group-hover:scale-105 transition-transform duration-700 ${
                            isCover
                              ? 'w-full h-full object-contain'
                              : 'w-full h-auto object-contain'
                          }`}
                        />
                        <div className="absolute bottom-3 left-4 flex items-center gap-2 z-10">
                          <span className="font-code text-[10px] font-semibold px-2.5 py-1 bg-[#080812] border border-white/10" style={{ borderLeftColor: project.statusColor, borderLeftWidth: '2px', color: project.statusColor }}>
                            {isEs ? project.status : (project.statusEn || project.status)}
                          </span>
                          <div className="flex items-center gap-1 text-yellow-400 text-xs">
                            <Star size={11} fill="currentColor" />
                            <span className="font-code text-[10px]">{project.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-cyber text-lg font-bold text-white mb-1">
                          {project.name}
                        </h3>
                        <p className="text-[#00F2FE] font-code text-xs font-medium mb-3">{project.subtitle}</p>
                        <p className="text-white/55 text-sm leading-relaxed mb-4 line-clamp-3">
                          {isEs ? project.description : (project.descriptionEn || project.description)}
                        </p>
                        <div className="flex items-center gap-2 text-[#00F2FE] font-cyber font-bold text-xs group-hover:translate-x-2 transition-transform">
                          {t('common.viewMore')} <ArrowRight size={14} />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Loading indicator while dynamic projects are being fetched */}
          {dynamicLoading && (
            <div className="mt-10 flex items-center justify-center gap-3 text-white/30">
              <div className="w-4 h-4 border-2 border-white/20 border-t-[#FF2D78] rounded-full animate-spin" />
              <span className="font-code text-xs">Cargando proyectos…</span>
            </div>
          )}

          {!isSearching && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 clip-card bg-[#0e0e1f] border border-white/10 p-8 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF2D78]/5 via-[#9d4edd]/5 to-[#00F2FE]/5 pointer-events-none" />
              <Gamepad2 size={32} className="text-[#FF2D78] mx-auto mb-3" />
              <h3 className="font-cyber text-xl font-bold text-white mb-2">
                {isEs ? 'Más proyectos en camino' : 'More projects coming'}
              </h3>
              <p className="font-code text-sm text-white/50 max-w-md mx-auto">
                {isEs
                  ? 'Estamos trabajando en nuevas novelas visuales. Únete a nuestro Discord para ser el primero en enterarte.'
                  : 'We are working on new visual novels. Join our Discord to be the first to know.'}
              </p>
            </motion.div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
