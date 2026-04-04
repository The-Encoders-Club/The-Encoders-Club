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
    <div className="min-h-screen bg-[#0a0a1a] text-white font-sans selection:bg-pink-500 selection:text-white">
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

      {/* Hero */}
      <header className="py-12 md:py-24 px-4 md:px-8 text-center bg-gradient-to-b from-purple-900/20 to-transparent">
        <h1 className="text-4xl md:text-7xl font-extrabold mb-4 md:mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">The Encoders Club</h1>
        <p className="text-lg md:text-2xl text-gray-300 mb-6 md:mb-10 max-w-2xl mx-auto">Tu portal a las mejores experiencias de Ren'Py en español</p>
        <button className="bg-pink-600 hover:bg-pink-700 px-6 md:px-10 py-2 md:py-4 rounded-full text-base md:text-xl font-bold transition-all">Ver más</button>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
        {/* Sección: Nuestro Enfoque */}
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

        {/* Sección: Noticias Recientes - 4 COLUMNAS FIJAS */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-10">Noticias Recientes</h2>
          <div className="news-grid">
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

        {/* Sección: Integrantes del Equipo con Carrusel y Difuminado */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-10">Integrantes del Equipo</h2>
          
          {/* Contenedor del Carrusel con Difuminado */}
          <div className="relative group carousel-container">
            {/* Máscara de difuminado en los extremos */}
            <div className="carousel-fade-mask"></div>

            {/* Botones de navegación - Izquierda */}
            <button
              onClick={() => scrollCarousel('left')}
              className="carousel-button carousel-button-left hidden md:flex"
              aria-label="Anterior"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Botones de navegación - Derecha */}
            <button
              onClick={() => scrollCarousel('right')}
              className="carousel-button carousel-button-right hidden md:flex"
              aria-label="Siguiente"
            >
              <ChevronRight size={24} />
            </button>

            {/* Carrusel */}
            <div
              ref={carouselRef}
              className="carousel-scroll"
            >
              {teamMembers.map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: member.id * 0.1 }}
                  className="carousel-item"
                >
                  {/* Foto del integrante - TAMAÑO FIJO */}
                  <div className="carousel-image-container">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="carousel-image"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = 'https://picsum.photos/seed/team' + member.id + '/300/400';
                      }}
                    />
                  </div>
                  {/* Nombre y Cargo */}
                  <h3 className="text-base md:text-xl font-bold mb-2 text-pink-400">{member.name}</h3>
                  <p className="text-xs md:text-sm text-gray-300">{member.cargo}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer con Redes Sociales */}
      <footer className="border-t border-purple-900/50 py-12 md:py-16 bg-[#0a0a1a]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Contenido del Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
            {/* Sección de Información */}
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-4">The Encoders Club</h3>
              <p className="text-sm md:text-base text-gray-400">Tu portal a las mejores experiencias de Ren'Py en español. Únete a nuestra comunidad de desarrolladores, escritores y artistas.</p>
            </div>

            {/* Sección de Enlaces Rápidos */}
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-sm md:text-base text-gray-400">
                <li><a href="#" className="hover:text-pink-400 transition-colors">Projectos</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Cursus</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Noticias</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Donar</a></li>
              </ul>
            </div>

            {/* Sección de Redes Sociales */}
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

          {/* Línea divisoria */}
          <div className="border-t border-purple-900/30 pt-8 md:pt-12">
            {/* Stats Footer */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-8 md:mb-12">
              <div className="flex items-center gap-2 text-gray-400 text-xs md:text-base">
                <BookOpen size={20} /> 15 Projectes
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs md:text-base">
                <Download size={20} /> 99800 Déscnasgas
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs md:text-base">
                <Users size={20} /> 7 Cursus
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs md:text-base">
                <Eye size={20} /> 9480715 Visitas
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs md:text-base">
                <Heart size={20} /> Comunidad
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center text-xs md:text-sm text-gray-500">
              <p>&copy; 2026 The Encoders Club. Todos los derechos reservados.</p>
              <p className="mt-2">Hecho con ❤️ por la comunidad de Ren'Py en español</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
