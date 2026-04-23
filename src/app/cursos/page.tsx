'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Construction, BookOpen, GraduationCap, Code, Palette, Gamepad2, Lightbulb, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundParticles from '@/components/BackgroundParticles';

const comingSoonCourses = [
  { icon: Code, title: 'Introducción a Ren\'Py', desc: 'Aprende desde cero a crear tu primera novela visual con Ren\'Py.', color: '#FF2D78', lessons: 12, level: 'Principiante' },
  { icon: Palette, title: 'Diseño de Personajes', desc: 'Técnicas de diseño y sprite creation para tus personajes.', color: '#4D9FFF', lessons: 8, level: 'Intermedio' },
  { icon: Gamepad2, title: 'Programación Avanzada', desc: 'Sistemas complejos: inventarios, minijuegos y pantallas personalizadas.', color: '#a855f7', lessons: 15, level: 'Avanzado' },
  { icon: Lightbulb, title: 'Escritura Narrativa', desc: 'Crea historias envolventes con múltiples rutas y finales.', color: '#22c55e', lessons: 10, level: 'Principiante' },
  { icon: BookOpen, title: 'UI/UX en Visual Novels', desc: 'Diseña interfaces atractivas y menús interactivos.', color: '#FF2D78', lessons: 7, level: 'Intermedio' },
  { icon: GraduationCap, title: 'Publicación y Distribución', desc: 'Todo lo necesario para lanzar tu novela visual al mundo.', color: '#4D9FFF', lessons: 6, level: 'Todos los niveles' },
];

export default function Cursos() {
  return (
    <div className="min-h-screen bg-[#080818] text-white overflow-x-hidden">
      <Navbar />
      <BackgroundParticles />

      {/* Hero */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-[#4D9FFF] text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3 block">Aprende con nosotros</span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Cursos y{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4D9FFF] to-[#a855f7]">
                Tutoriales
              </span>
            </h1>
            <p className="text-white/60 text-base sm:text-lg max-w-2xl">
              Domina el arte de crear novelas visuales con nuestros cursos completos. Desde los fundamentos hasta técnicas avanzadas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Under Construction Banner */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF2D78]/20 via-[#a855f7]/20 to-[#4D9FFF]/20" />
            <div className="absolute inset-0 border border-white/10 rounded-3xl" />
            <div className="relative p-8 sm:p-12 lg:p-16 text-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#FF2D78]/15 border border-[#FF2D78]/30 mb-6"
              >
                <Construction size={36} className="text-[#FF2D78]" />
              </motion.div>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Página en{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D78] to-[#a855f7]">
                  Construcción
                </span>
              </h2>
              <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                Estamos trabajando duro para traerte los mejores cursos de novelas visuales. ¡Pronto estarán disponibles! Mientras tanto, explora nuestros proyectos.
              </p>

              {/* Animated construction elements */}
              <div className="flex justify-center gap-4 mb-8">
                {['🎨', '📝', '💻', '🎮'].map((emoji, i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                    className="text-2xl"
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/proyectos" className="btn-primary text-base px-7 py-3.5">
                  Ver Proyectos <ArrowRight size={18} />
                </Link>
                <a
                  href="https://discord.gg/2DB5k7sb8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-base px-7 py-3.5"
                >
                  Unirse al Discord
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Courses Preview */}
      <section className="py-16 lg:py-24 bg-[#06060f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#a855f7] text-sm font-semibold uppercase tracking-widest mb-3 block">Próximamente</span>
            <h2 className="section-title text-white">Cursos en <span className="brand-gradient-text">Desarrollo</span></h2>
            <p className="text-white/50 mt-4 max-w-lg mx-auto text-sm">Estos cursos están siendo creados con dedicación. ¡Mantente atento a las novedades!</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {comingSoonCourses.map((course, i) => {
              const Icon = course.icon;
              return (
                <motion.div
                  key={course.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-card p-6 group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-30" style={{ backgroundImage: `linear-gradient(to right, ${course.color}, transparent)` }} />
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${course.color}15`, border: `1px solid ${course.color}30` }}
                    >
                      <Icon size={22} style={{ color: course.color }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {course.title}
                      </h3>
                      <p className="text-xs text-white/40 mt-1">{course.lessons} lecciones · {course.level}</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/55 leading-relaxed">{course.desc}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/40">Próximamente</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-white/6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-[#FF2D78]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>6</p>
              <p className="text-sm text-white/50 mt-1">Cursos planeados</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-[#4D9FFF]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>58</p>
              <p className="text-sm text-white/50 mt-1">Lecciones totales</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-[#a855f7]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>3</p>
              <p className="text-sm text-white/50 mt-1">Niveles de dificultad</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
