'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Newspaper, Users, MoreHorizontal, X, Globe } from "lucide-react";
import { useI18n } from "@/hooks/useLocale";

const navItems = [
  { key: 'home', label_es: 'Inicio', label_en: 'Home', href: '/', icon: Home },
  { key: 'news', label_es: 'Noticias', label_en: 'News', href: '/noticias', icon: Newspaper },
  { key: 'team', label_es: 'Equipo', label_en: 'Team', href: '/#equipo', icon: Users },
  { key: 'more', label_es: 'Más', label_en: 'More', href: '', icon: MoreHorizontal },
];

const moreLinks = [
  { label_es: 'Proyectos', label_en: 'Projects', href: '/proyectos' },
  { label_es: 'Cursos', label_en: 'Courses', href: '/cursos' },
  { label_es: 'Donar', label_en: 'Donate', href: '/donar' },
  { label_es: 'Discord', label_en: 'Discord', href: 'https://discord.gg/2DB5k7sb8' },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { locale, toggleLocale } = useI18n();
  const isEs = locale === 'es';
  const [showMore, setShowMore] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const getLabel = (item: typeof navItems[0]) => isEs ? item.label_es : item.label_en;

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        {/* Gradient fade above nav */}
        <div className="h-8 bg-gradient-to-t from-[#080818] to-transparent pointer-events-none" />

        <div className="bg-[#0a0a1f]/95 backdrop-blur-xl border-t border-white/10 px-2 pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.key === 'more' ? false : isActive(item.href);

              if (item.key === 'more') {
                return (
                  <button
                    key={item.key}
                    onClick={() => setShowMore(!showMore)}
                    className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
                  >
                    <div className={`p-1.5 rounded-xl transition-all ${showMore ? 'bg-[#a855f7]/20' : ''}`}>
                      <Icon size={20} className={showMore ? 'text-[#a855f7]' : 'text-white/50'} />
                    </div>
                    <span className={`text-[10px] font-medium transition-all ${showMore ? 'text-[#a855f7]' : 'text-white/40'}`}>
                      {getLabel(item)}
                    </span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
                >
                  <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-gradient-to-br from-[#FF2D78]/25 to-[#a855f7]/25' : ''}`}>
                    <Icon size={20} className={active ? 'text-[#FF2D78]' : 'text-white/50'} />
                  </div>
                  <span className={`text-[10px] font-medium transition-all ${active ? 'text-[#FF2D78]' : 'text-white/40'}`}>
                    {getLabel(item)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* More Menu Overlay */}
      <AnimatePresence>
        {showMore && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setShowMore(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-20 left-3 right-3 z-50 md:hidden"
            >
              <div className="bg-[#12122a]/98 backdrop-blur-2xl border border-white/15 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-white/8">
                  <span className="text-sm font-bold text-white/70" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {isEs ? 'Más opciones' : 'More options'}
                  </span>
                  <button onClick={() => setShowMore(false)} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all">
                    <X size={18} />
                  </button>
                </div>
                <div className="p-2">
                  {moreLinks.map((link, i) => (
                    <motion.a
                      key={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      href={link.href}
                      onClick={() => setShowMore(false)}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/8 transition-all"
                    >
                      <span className="text-sm font-medium">{isEs ? link.label_es : link.label_en}</span>
                    </motion.a>
                  ))}
                  <div className="h-px bg-white/8 my-1" />
                  <button
                    onClick={() => { toggleLocale(); setShowMore(false); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/8 transition-all w-full"
                  >
                    <Globe size={16} />
                    <span className="text-sm font-medium">{isEs ? 'English' : 'Español'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
