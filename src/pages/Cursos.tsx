import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'wouter';
import { ArrowLeft, Users, Clock, Star } from 'lucide-react';

export default function Cursos() {
  const courses = [
    {
      id: 1,
      title: 'Introducción a Ren\'Py',
      level: 'Principiante',
      duration: '4 semanas',
      students: 1250,
      rating: 4.8,
      description: 'Aprende los conceptos básicos de Ren\'Py y crea tu primera novela visual.',
    },
    {
      id: 2,
      title: 'Programación Avanzada en Ren\'Py',
      level: 'Intermedio',
      duration: '6 semanas',
      students: 890,
      rating: 4.9,
      description: 'Domina técnicas avanzadas de programación y scripting en Ren\'Py.',
    },
    {
      id: 3,
      title: 'Diseño de Narrativa',
      level: 'Avanzado',
      duration: '8 semanas',
      students: 560,
      rating: 5.0,
      description: 'Crea historias cautivadoras con estructura narrativa profesional.',
    },
    {
      id: 4,
      title: 'Arte y Animación',
      level: 'Intermedio',
      duration: '5 semanas',
      students: 720,
      rating: 4.7,
      description: 'Crea assets visuales y animaciones para tus novelas visuales.',
    },
    {
      id: 5,
      title: 'Sonido y Música',
      level: 'Principiante',
      duration: '3 semanas',
      students: 420,
      rating: 4.6,
      description: 'Integra audio profesional en tus proyectos de Ren\'Py.',
    },
    {
      id: 6,
      title: 'Publicación y Marketing',
      level: 'Avanzado',
      duration: '4 semanas',
      students: 380,
      rating: 4.8,
      description: 'Aprende a publicar y promocionar tu novela visual al mundo.',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 border-b border-purple-900/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 hover:text-pink-400 transition-colors">
          <ArrowLeft size={20} />
          <span className="text-lg sm:text-2xl font-bold tracking-tight">The Encoders Club</span>
        </Link>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 sm:mb-12">Nuestros Cursos</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-purple-950/30 rounded-2xl overflow-hidden border border-purple-800/50 hover:border-pink-500/50 transition-all hover:shadow-lg hover:shadow-pink-500/20 flex flex-col"
            >
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-pink-400 font-semibold text-sm">{course.level}</span>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm">{course.rating}</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-2">{course.title}</h3>
                <p className="text-sm sm:text-base text-gray-400 mb-4">{course.description}</p>
                
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>{course.students} estudiantes</span>
                  </div>
                </div>
              </div>
              
              <div className="px-6 pb-6">
                <button className="w-full bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-full text-sm font-bold transition-all">
                  Inscribirse
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
