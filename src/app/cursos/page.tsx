'use client';

import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Code, Palette, Gamepad2, Lightbulb } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundParticles from '@/components/BackgroundParticles';

const comingSoonCourses = [
  { icon: Code, title: 'Introducción a Ren\'Py', desc: 'Aprende desde cero a crear tu primera novela visual con Ren\'Py.', color: '#FF2D78', lessons: 12, level: 'Principiante' },
  { icon: Palette, title: 'Diseño de Personajes', desc: 'Técnicas de diseño y sprite creation para tus personajes.', color: '#00F2FE', lessons: 8, level: 'Intermedio' },
  { icon: Gamepad2, title: 'Programación Avanzada', desc: 'Sistemas complejos: inventarios, minijuegos y pantallas personalizadas.', color: '#9d4edd', lessons: 15, level: 'Avanzado' },
  { icon: Lightbulb, title: 'Escritura Narrativa', desc: 'Crea historias envolventes con múltiples rutas y finales.', color: '#22c55e', lessons: 10, level: 'Principiante' },
  { icon: BookOpen, title: 'UI/UX en Visual Novels', desc: 'Diseña interfaces atractivas y menús interactivos.', color: '#FF2D78', lessons: 7, level: 'Intermedio' },
  { icon: GraduationCap, title: 'Publicación y Distribución', desc: 'Todo lo necesario para lanzar tu novela visual al mundo.', color: '#00F2FE', lessons: 6, level: 'Todos los niveles' },
];

export default function Cursos() {
  return (
    <div className="min-h-screen bg-[#030308] text-white overflow-x-hidden">
      <Navbar />
      <BackgroundParticles />

      {/* Hero */}
      <section className="relative pt-16 sm:pt-20 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="font-cyber font-bold text-sm tracking-widest text-[#00F2FE] mb-3 block">{'// '}Aprende con nosotros</span>
            <h1 className="font-cyber text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 uppercase">
              Cursos y{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F2FE] to-[#9d4edd]">
                Tutoriales
              </span>
            </h1>
            <p className="font-code text-sm text-white/60 max-w-2xl">
              Domina el arte de crear novelas visuales con nuestros cursos completos. Desde los fundamentos hasta técnicas avanzadas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Courses Preview */}
      <section className="py-12 lg:py-20 bg-[#05050d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="font-cyber font-bold text-sm tracking-widest text-[#9d4edd] mb-3 block">{'// '}Próximamente</span>
            <h2 className="section-title text-white">Cursos en <span className="brand-gradient-text">Desarrollo</span></h2>
            <p className="font-code text-sm text-white/50 mt-4 max-w-lg mx-auto">Estos cursos están siendo creados con dedicación. ¡Mantente atento a las novedades!</p>
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
                        {course.title}
                      </h3>
                      <p className="font-code text-[10px] text-white/40 mt-1">{course.lessons} lecciones · {course.level}</p>
                    </div>
                  </div>
                  <p className="font-code text-[11px] text-white/55 leading-relaxed">{course.desc}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="font-code text-[10px] px-2.5 py-1 bg-[#080812] border border-white/8 text-white/40">Próximamente</span>
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
