import React from 'react';
import { motion } from 'motion/react';
import { Users, BookOpen, Newspaper, Heart, Download, Eye } from 'lucide-react';
import { Link } from 'wouter';
import { teamMembers, newsItems, stats } from '@/data/content';

const logo = '/logo.png';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-pink-500 selection:text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 border-b border-purple-900/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src={logo} alt="The Encoders Club Logo" className="w-10 sm:w-12 h-10 sm:h-12 object-contain" referrerPolicy="no-referrer" />
          <span className="text-lg sm:text-2xl font-bold tracking-tight">The Encoders Club</span>
        </div>
        <div className="hidden md:flex items-center gap-4 lg:gap-8 text-base lg:text-lg font-medium">
          <Link href="/proyectos" className="hover:text-pink-400 transition-colors">Projectos</Link>
          <Link href="/cursos" className="hover:text-pink-400 transition-colors">Cursus</Link>
          <Link href="/noticias" className="hover:text-pink-400 transition-colors">Noticias</Link>
          <Link href="/donar" className="hover:text-pink-400 transition-colors">Donar</Link>
          <button className="bg-pink-600 hover:bg-pink-700 px-4 lg:px-6 py-2 rounded-full font-bold transition-all text-sm lg:text-base">
            ¡Únete al equipo!
          </button>
        </div>
        {/* Mobile menu button placeholder */}
        <button className="md:hidden text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Hero */}
      <header className="py-12 sm:py-24 px-4 sm:px-8 text-center bg-gradient-to-b from-purple-900/20 to-transparent">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
          The Encoders Club
        </h1>
        <p className="text-base sm:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-10 max-w-2xl mx-auto px-2">
          Tu portal a las mejores experiencias de Ren'Py en español
        </p>
        <button className="bg-pink-600 hover:bg-pink-700 px-6 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-xl font-bold transition-all">
          Ver más
        </button>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-16">
        {/* Sección: Nuestro Enfoque */}
        <section className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-12 sm:mb-24">
          <div className="w-full lg:w-1/3">
            <img 
              src="/Personaje.png" 
              alt="Mascota" 
              className="rounded-2xl shadow-2xl shadow-purple-900/50 w-full h-auto" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <div className="w-full lg:w-2/3">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6">Nuestro Enfoque</h2>
            <p className="text-base sm:text-xl text-gray-300 leading-relaxed">
              En The Encoders Club, nos dedicamos a fomentar la creación y el aprendizaje de novelas visuales utilizando el motor Ren'Py. Nuestro objetivo es crear una comunidad vibrante donde los desarrolladores, escritores y artistas puedan colaborar, aprender y compartir sus proyectos.
            </p>
          </div>
        </section>

        {/* Sección: Estadísticas */}
        <section className="mb-12 sm:mb-24 py-8 sm:py-12 border-y border-purple-900/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-5xl font-extrabold text-pink-400 mb-2">{stats.projects}</div>
              <div className="text-sm sm:text-base text-gray-300">Proyectos</div>
            </div>
            <div>
              <div className="text-3xl sm:text-5xl font-extrabold text-pink-400 mb-2">{stats.downloads.toLocaleString()}</div>
              <div className="text-sm sm:text-base text-gray-300">Descargas</div>
            </div>
            <div>
              <div className="text-3xl sm:text-5xl font-extrabold text-pink-400 mb-2">{stats.courses}</div>
              <div className="text-sm sm:text-base text-gray-300">Cursos</div>
            </div>
            <div>
              <div className="text-3xl sm:text-5xl font-extrabold text-pink-400 mb-2">{stats.visits.toLocaleString()}</div>
              <div className="text-sm sm:text-base text-gray-300">Visitas</div>
            </div>
          </div>
        </section>

        {/* Sección: Noticias Recientes */}
        <section className="mb-12 sm:mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-10">Noticias Recientes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {newsItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: item.id * 0.1 }}
                className="bg-purple-950/30 rounded-2xl overflow-hidden border border-purple-800/50 hover:border-pink-500/50 transition-all hover:shadow-lg hover:shadow-pink-500/20 cursor-pointer"
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-40 object-cover" 
                  referrerPolicy="no-referrer" 
                />
                <div className="p-4 sm:p-5">
                  <h3 className="font-bold text-base sm:text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Sección: Integrantes del Equipo */}
        <section className="mb-12 sm:mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-10">Integrantes del Equipo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: member.id * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                {/* Foto del integrante */}
                <div className="w-full mb-4 rounded-2xl overflow-hidden shadow-xl shadow-purple-900/50 bg-purple-950/30 border border-purple-800/50 h-48 sm:h-64">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://picsum.photos/seed/team' + member.id + '/300/400';
                    }}
                  />
                </div>
                {/* Nombre y Cargo */}
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-pink-400">{member.name}</h3>
                <p className="text-gray-300 text-xs sm:text-sm">{member.cargo}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer Stats */}
      <footer className="border-t border-purple-900/50 py-6 sm:py-10 mt-12 sm:mt-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-0 md:flex md:justify-between text-gray-400 text-xs sm:text-base">
          <div className="flex items-center gap-2"><BookOpen size={16} className="sm:w-5 sm:h-5" /> <span>15 Projectes</span></div>
          <div className="flex items-center gap-2"><Download size={16} className="sm:w-5 sm:h-5" /> <span>99800 Déscnasgas</span></div>
          <div className="flex items-center gap-2"><Users size={16} className="sm:w-5 sm:h-5" /> <span>7 Cursus</span></div>
          <div className="flex items-center gap-2"><Eye size={16} className="sm:w-5 sm:h-5" /> <span>9480715 Visitas</span></div>
        </div>
      </footer>
    </div>
  );
}
