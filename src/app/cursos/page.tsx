'use client';

import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Code, Palette, Gamepad2, Lightbulb } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundParticles from '@/components/BackgroundParticles';
import { useI18n } from '@/hooks/useLocale';

const courseData = [
  { icon: Code, color: '#FF2D78', lessons: 12, levelKey: 'courses.level.beginner' as const, titleKey: 'courses.c1.title' as const, descKey: 'courses.c1.desc' as const },
  { icon: Palette, color: '#00F2FE', lessons: 8, levelKey: 'courses.level.intermediate' as const, titleKey: 'courses.c2.title' as const, descKey: 'courses.c2.desc' as const },
  { icon: Gamepad2, color: '#9d4edd', lessons: 15, levelKey: 'courses.level.advanced' as const, titleKey: 'courses.c3.title' as const, descKey: 'courses.c3.desc' as const },
  { icon: Lightbulb, color: '#22c55e', lessons: 10, levelKey: 'courses.level.beginner' as const, titleKey: 'courses.c4.title' as const, descKey: 'courses.c4.desc' as const },
  { icon: BookOpen, color: '#FF2D78', lessons: 7, levelKey: 'courses.level.intermediate' as const, titleKey: 'courses.c5.title' as const, descKey: 'courses.c5.desc' as const },
  { icon: GraduationCap, color: '#00F2FE', lessons: 6, levelKey: 'courses.level.all' as const, titleKey: 'courses.c6.title' as const, descKey: 'courses.c6.desc' as const },
];

export default function Cursos() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-[#030308] text-white overflow-x-hidden">
      <Navbar />
      <BackgroundParticles />

      {/* Coming Soon Courses Preview */}
      <section className="pt-16 sm:pt-20 pb-12 lg:pb-20 bg-[#05050d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="font-cyber font-bold text-sm tracking-widest text-[#9d4edd] mb-3 block">{'// '}{t('courses.comingTag')}</span>
            <h2 className="section-title text-white">{t('courses.comingTitle')} <span className="brand-gradient-text">{t('courses.comingAccent')}</span></h2>
            <p className="font-code text-sm text-white/50 mt-4 max-w-lg mx-auto">{t('courses.comingDesc')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseData.map((course, i) => {
              const Icon = course.icon;
              return (
                <motion.div
                  key={course.titleKey}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="clip-card bg-[#0e0e1f] border border-white/10 p-6 group relative overflow-hidden hover:border-[#00F2FE]/30 transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-30" style={{ backgroundImage: `linear-gradient(to right, ${course.color}, transparent)` }} />
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                      style={{ background: `${course.color}15`, border: `1px solid ${course.color}30` }}
                    >
                      <Icon size={22} style={{ color: course.color }} />
                    </div>
                    <div>
                      <h3 className="font-cyber font-bold text-white text-sm">
                        {t(course.titleKey)}
                      </h3>
                      <p className="font-code text-[10px] text-white/40 mt-1">{course.lessons} {t('courses.lessons')} · {t(course.levelKey)}</p>
                    </div>
                  </div>
                  <p className="font-code text-[11px] text-white/55 leading-relaxed">{t(course.descKey)}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="font-code text-[10px] px-2.5 py-1 bg-[#080812] border border-white/8 text-white/40">{t('courses.soon')}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
