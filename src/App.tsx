/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Users, BookOpen, Newspaper, Heart, Download, Eye, Youtube, MessageCircle, Facebook, Twitter, ChevronLeft, ChevronRight } from 'lucide-react';

const logo = '/logo.png';

// Datos de los integrantes del equipo
const teamMembers = [
  {
    id: 1,
    name: '[Nombre del integrante 1]',
    cargo: '[Cargo/Rol]',
    image: '/team-member-1.png',
  },
  {
    id: 2,
    name: '[Nombre del integrante 2]',
    cargo: '[Cargo/Rol]',
    image: '/team-member-2.png',
  },
  {
    id: 3,
    name: '[Nombre del integrante 3]',
    cargo: '[Cargo/Rol]',
    image: '/team-member-3.png',
  },
  {
    id: 4,
    name: '[Nombre del integrante 4]',
    cargo: '[Cargo/Rol]',
    image: '/team-member-4.png',
  },
];

// Datos de redes sociales
const socialLinks = [
  {
    id: 1,
    name: 'YouTube',
    icon: Youtube,
    url: 'https://youtube.com/@theencodersclub?si=pPM99abegOmdDq3u',
    color: 'hover:text-red-500',
  },
  {
    id: 2,
    name: 'Discord',
    icon: MessageCircle,
    url: 'https://discord.gg/dmNBbMunC',
    color: 'hover:text-blue-500',
  },
  {
    id: 3,
    name: 'Facebook',
    icon: Facebook,
    url: '#',
    color: 'hover:text-blue-600',
    disabled: true,
  },
  {
    id: 4,
    name: 'X',
    icon: Twitter,
    url: '#',
    color: 'hover:text-gray-400',
    disabled: true,
  },
];

export default function App() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 400;
      if (direction === 'left') {
        carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white font-sans selection:bg-pink-500 selection:text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-4 md:py-6 border-b border-purple-900/50 bg-[#0a0a1a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <img src={logo} alt="The Encoders Club Logo" className="w-12 h-12 object-contain" referrerPolicy="no-referrer" />
          <span className="text-xl md:text-2xl font-bold tracking-tight">The Encoders Club</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-base md:text-lg font-medium">
          <a href="#" className="hover:text-pink-400 transition-colors">Projectos</a>
          <a href="#" className="hover:text-pink-400 transition-colors">Cursus</a>
          <a href="#" className="hover:text-pink-400 transition-colors">Noticias</a>
          <a href="#" className="hover:text-pink-400 transition-colors">Donar</a>
          <button className="bg-pink-600 hover:bg-pink-700 px-4 md:px-6 py-2 rounded-full font-bold transition-all text-sm md:text-base">¡Únete al equipo!</button>
        </div>
      </nav>

      {/* SECCIÓN DE INICIO (HERO) - REACOMODADA SEGÚN BOCETO IMG_20260403_205352_266.jpg */}
      <header className="relative py-12 md:py-24 px-4 md:px-8 bg-gradient-to-b from-purple-900/20 to-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          {/* Texto de Inicio - Según Boceto */}
          <div className="w-full md:w-1/2 text-center md:text-left z-10">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-7xl font-extrabold mb-4 md:mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
            >
              The Encoders Club
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-2xl text-gray-300 mb-6 md:mb-10 max-w-xl"
            >
              Tu portal a las mejores experiencias de Ren'Py en español. Únete a nuestra comunidad de desarrolladores, escritores y artistas.
            </motion.p>
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-pink-600 hover:bg-pink-700 px-6 md:px-10 py-2 md:py-4 rounded-full text-base md:text-xl font-bold transition-all shadow-lg shadow-pink-600/20"
            >
              Ver más
            </motion.button>
          </div>

          {/* Personaje de Inicio - Según Boceto */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-md"
            >
              <div className="absolute inset-0 bg-purple-600/20 blur-[80px] rounded-full"></div>
              <img 
                src="/Personaje.png" 
                alt="Personaje Principal" 
                className="relative z-10 w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(168,85,247,0.4)]"
                referrerPolicy="no-referrer" 
              />
            </motion.div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
        {/* Sección: Nuestro Enfoque - Mantenida intacta */}
        <section className="flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-16 md:mb-24">
          <div className="w-full md:w-1/3">
            <img src="/Personaje.png" alt="Mascota" className="rounded-2xl shadow-2xl shadow-purple-900/50 w-full" referrerPolicy="no-referrer" />
          </div>
          <div className="w-full md:w-2/3">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Nuestro Enfoque</h2>
            <p className="text-base md:text-xl text-gray-300 leading-relaxed">
              En The Encoders Club, nos dedicamos a fomentar la creación y el aprendizaje de novelas visuales utilizando el motor Ren'Py. Nuestro objetivo es crear una comunidad vibrante donde los desarrolladores, escritores y artistas puedan colaborar, aprender y compartir sus proyectos.
            </p>
          </div>
        </section>

        {/* Sección: Noticias Recientes - Mantenida intacta (4 columnas en PC) */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-10">Noticias Recientes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-purple-950/30 rounded-2xl overflow-hidden border border-purple-800/50 hover:border-pink-500/50 transition-all flex flex-col h-full"
              >
                <img src={`https://picsum.photos/seed/news${i}/400/200`} alt="News" className="w-full h-32 md:h-40 object-cover" referrerPolicy="no-referrer" />
                <div className="p-4 md:p-5 flex-grow flex flex-col">
                  <h3 className="font-bold text-base md:text-lg mb-2">Noticia {i}</h3>
                  <p className="text-xs md:text-sm text-gray-400 flex-grow">Breve descripción de la noticia reciente sobre Ren'Py.</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Sección: Integrantes del Equipo - Mantenida intacta (Carrusel con Difuminado) */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-10">Integrantes del Equipo</h2>
          
          <div className="relative group">
            {/* Máscara de difuminado lateral */}
            <div className="absolute inset-0 pointer-events-none z-20" style={{
              background: 'linear-gradient(to right, rgba(10, 10, 26, 1) 0%, rgba(10, 10, 26, 0) 8%, rgba(10, 10, 26, 0) 92%, rgba(10, 10, 26, 1) 100%)',
              height: '100%',
              borderRadius: '1rem',
            }}></div>

            {/* Botones de navegación */}
            <button
              onClick={() => scrollCarousel('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-pink-600 hover:bg-pink-700 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg hidden md:flex items-center justify-center"
              aria-label="Anterior"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={() => scrollCarousel('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-pink-600 hover:bg-pink-700 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg hidden md:flex items-center justify-center"
              aria-label="Siguiente"
            >
              <ChevronRight size={24} />
            </button>

            {/* Carrusel */}
            <div
              ref={carouselRef}
              className="flex gap-6 md:gap-8 overflow-x-auto scroll-smooth pb-4 md:pb-6"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {teamMembers.map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: member.id * 0.1 }}
                  className="flex-shrink-0 w-72 flex flex-col items-center text-center"
                >
                  <div className="w-full aspect-[3/4] mb-4 rounded-2xl overflow-hidden shadow-xl shadow-purple-900/50 bg-purple-950/30 border border-purple-800/50">
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
                  <h3 className="text-xl font-bold mb-2 text-pink-400">{member.name}</h3>
                  <p className="text-sm text-gray-300">{member.cargo}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Mantenido intacto */}
      <footer className="border-t border-purple-900/50 py-12 md:py-16 bg-[#0a0a1a]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-4">The Encoders Club</h3>
              <p className="text-sm md:text-base text-gray-400">Tu portal a las mejores experiencias de Ren'Py en español. Únete a nuestra comunidad de desarrolladores, escritores y artistas.</p>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-sm md:text-base text-gray-400">
                <li><a href="#" className="hover:text-pink-400 transition-colors">Projectos</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Cursus</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Noticias</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Donar</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-4">Síguenos</h3>
              <div className="flex gap-4 flex-wrap">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.id}
                      href={social.url}
                      target={!social.disabled ? '_blank' : undefined}
                      rel={!social.disabled ? 'noopener noreferrer' : undefined}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-full border border-purple-800/50 hover:border-pink-500/50 transition-all ${social.color} ${social.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      title={social.disabled ? 'Próximamente' : social.name}
                    >
                      <Icon size={24} />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="border-t border-purple-900/30 pt-8 md:pt-12">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-8 md:mb-12 text-gray-400 text-xs md:text-base">
              <div className="flex items-center gap-2"><BookOpen size={20} /> 15 Projectes</div>
              <div className="flex items-center gap-2"><Download size={20} /> 99800 Déscnasgas</div>
              <div className="flex items-center gap-2"><Users size={20} /> 7 Cursus</div>
              <div className="flex items-center gap-2"><Eye size={20} /> 9480715 Visitas</div>
              <div className="flex items-center gap-2"><Heart size={20} /> Comunidad</div>
            </div>
            <div className="text-center text-xs md:text-sm text-gray-500">
              <p>&copy; 2026 The Encoders Club. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
