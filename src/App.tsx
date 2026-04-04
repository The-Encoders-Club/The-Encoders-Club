/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Users, BookOpen, Newspaper, Heart, Download, Eye } from 'lucide-react';
const logo = '/logo.png';

// Datos de los integrantes del equipo
const teamMembers = [
  {
    id: 1,
    name: 'Alex Rivera',
    cargo: 'Desarrollador Principal',
    image: 'https://picsum.photos/seed/team1/300/400',
  },
  {
    id: 2,
    name: 'María García',
    cargo: 'Diseñadora UX/UI',
    image: 'https://picsum.photos/seed/team2/300/400',
  },
  {
    id: 3,
    name: 'Carlos López',
    cargo: 'Escritor de Historias',
    image: 'https://picsum.photos/seed/team3/300/400',
  },
  {
    id: 4,
    name: 'Sofia Martínez',
    cargo: 'Community Manager',
    image: 'https://picsum.photos/seed/team4/300/400',
  },
];

// Datos de noticias
const noticias = [
  {
    id: 1,
    title: 'Nuevo Tutorial de Ren\'Py',
    description: 'Aprende los conceptos básicos con nuestro nuevo tutorial interactivo.',
    image: 'https://picsum.photos/seed/news1/400/200',
  },
  {
    id: 2,
    title: 'Concurso de Novelas Visuales',
    description: 'Participa y gana premios increíbles. ¡Las inscripciones están abiertas!',
    image: 'https://picsum.photos/seed/news2/400/200',
  },
  {
    id: 3,
    title: 'Webinar: Diseño Avanzado',
    description: 'Únete a nuestro webinar gratuito sobre técnicas avanzadas de diseño.',
    image: 'https://picsum.photos/seed/news3/400/200',
  },
  {
    id: 4,
    title: 'Actualización de Herramientas',
    description: 'Descubre las nuevas herramientas y mejoras que hemos añadido.',
    image: 'https://picsum.photos/seed/news4/400/200',
  },
];

// Datos de proyectos
const proyectos = [
  {
    id: 1,
    title: 'Proyecto 1: Historia Épica',
    description: 'Una novela visual épica con múltiples finales y caminos narrativos.',
    image: 'https://picsum.photos/seed/project1/400/300',
    descargas: 1250,
  },
  {
    id: 2,
    title: 'Proyecto 2: Misterio Oscuro',
    description: 'Un thriller psicológico lleno de giros inesperados.',
    image: 'https://picsum.photos/seed/project2/400/300',
    descargas: 890,
  },
  {
    id: 3,
    title: 'Proyecto 3: Romance Moderno',
    description: 'Una historia de amor contemporánea con personajes memorables.',
    image: 'https://picsum.photos/seed/project3/400/300',
    descargas: 2100,
  },
  {
    id: 4,
    title: 'Proyecto 4: Fantasía Épica',
    description: 'Un mundo de fantasía con magia, dragones y aventuras.',
    image: 'https://picsum.photos/seed/project4/400/300',
    descargas: 1560,
  },
];

// Datos de cursos
const cursos = [
  {
    id: 1,
    title: 'Introducción a Ren\'Py',
    level: 'Principiante',
    rating: 4.8,
    duration: '4 semanas',
    students: 1250,
  },
  {
    id: 2,
    title: 'Programación Avanzada',
    level: 'Intermedio',
    rating: 4.9,
    duration: '6 semanas',
    students: 890,
  },
  {
    id: 3,
    title: 'Diseño de Narrativa',
    level: 'Avanzado',
    rating: 5,
    duration: '8 semanas',
    students: 560,
  },
  {
    id: 4,
    title: 'Arte y Animación',
    level: 'Intermedio',
    rating: 4.7,
    duration: '5 semanas',
    students: 720,
  },
  {
    id: 5,
    title: 'Sonido y Música',
    level: 'Principiante',
    rating: 4.6,
    duration: '3 semanas',
    students: 420,
  },
  {
    id: 6,
    title: 'Publicación y Marketing',
    level: 'Avanzado',
    rating: 4.8,
    duration: '4 semanas',
    students: 380,
  },
];

type Page = 'home' | 'proyectos' | 'cursos' | 'noticias' | 'donar';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch(currentPage) {
      case 'proyectos':
        return (
          <main className="max-w-7xl mx-auto px-8 py-16">
            <h1 className="text-5xl font-bold mb-12">Nuestros Proyectos</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {proyectos.map((proyecto) => (
                <div key={proyecto.id} className="bg-purple-950/30 rounded-2xl overflow-hidden border border-purple-800/50 hover:border-pink-500/50 transition-all">
                  <img src={proyecto.image} alt={proyecto.title} className="w-full h-40 object-cover" referrerPolicy="no-referrer" />
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2">{proyecto.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{proyecto.description}</p>
                    <div className="text-pink-400 font-bold mb-3">{proyecto.descargas} descargas</div>
                    <button className="w-full bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-full font-bold transition-all">Descargar</button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        );
      
      case 'cursos':
        return (
          <main className="max-w-7xl mx-auto px-8 py-16">
            <h1 className="text-5xl font-bold mb-12">Nuestros Cursos</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cursos.map((curso) => (
                <div key={curso.id} className="bg-purple-950/30 rounded-2xl overflow-hidden border border-purple-800/50 hover:border-pink-500/50 transition-all p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm text-gray-400">{curso.level}</span>
                    <span className="text-yellow-400">⭐ {curso.rating}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{curso.title}</h3>
                  <div className="text-sm text-gray-400 mb-4">
                    <div>⏱️ {curso.duration}</div>
                    <div>👥 {curso.students} estudiantes</div>
                  </div>
                  <button className="w-full bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-full font-bold transition-all">Inscribirse</button>
                </div>
              ))}
            </div>
          </main>
        );
      
      case 'noticias':
        return (
          <main className="max-w-7xl mx-auto px-8 py-16">
            <h1 className="text-5xl font-bold mb-12">Noticias Recientes</h1>
            <div className="space-y-6">
              {noticias.map((noticia) => (
                <div key={noticia.id} className="bg-purple-950/30 rounded-2xl overflow-hidden border border-purple-800/50 hover:border-pink-500/50 transition-all flex flex-col md:flex-row">
                  <img src={noticia.image} alt={noticia.title} className="w-full md:w-48 h-48 md:h-auto object-cover" referrerPolicy="no-referrer" />
                  <div className="p-6 flex-1">
                    <h3 className="font-bold text-lg mb-2">{noticia.title}</h3>
                    <p className="text-gray-400 mb-4">{noticia.description}</p>
                    <button className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">Leer más →</button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        );
      
      case 'donar':
        return (
          <main className="max-w-7xl mx-auto px-8 py-16">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-2">
                <Heart className="text-pink-500 fill-pink-500" size={40} />
                Apoya Nuestro Proyecto
              </h1>
              <p className="text-xl text-gray-300">Tu contribución nos ayuda a mantener y mejorar la plataforma.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { amount: 5, name: 'Apoyo Inicial', benefits: ['Acceso a contenido exclusivo', 'Tu nombre en donantes'] },
                { amount: 15, name: 'Apoyo Moderado', benefits: ['Acceso prioritario', 'Badge especial', 'Tu nombre destacado'], featured: true },
                { amount: 50, name: 'Apoyo Premium', benefits: ['Acceso VIP', 'Consulta mensual', 'Créditos en proyectos', 'Tu logo'] },
              ].map((option) => (
                <div key={option.amount} className={`rounded-2xl overflow-hidden border p-8 ${option.featured ? 'border-pink-500 bg-pink-950/30 scale-105' : 'border-purple-800/50 bg-purple-950/30'}`}>
                  <h3 className="text-3xl font-bold mb-2">${option.amount}</h3>
                  <h4 className="text-xl font-semibold mb-4 text-pink-400">{option.name}</h4>
                  <div className="space-y-2 mb-6">
                    {option.benefits.map((benefit, idx) => (
                      <div key={idx} className="text-sm text-gray-300">✓ {benefit}</div>
                    ))}
                  </div>
                  <button className={`w-full px-4 py-3 rounded-full font-bold transition-all ${option.featured ? 'bg-pink-600 hover:bg-pink-700' : 'bg-purple-600 hover:bg-purple-700'}`}>
                    Donar ${option.amount}
                  </button>
                </div>
              ))}
            </div>
          </main>
        );
      
      default:
        return (
          <main className="max-w-7xl mx-auto px-8 py-16">
            {/* Sección: Nuestro Enfoque */}
            <section className="flex flex-col md:flex-row items-center gap-16 mb-24">
              <div className="w-full md:w-1/3">
                <img src="/Personaje.png" alt="Mascota" className="rounded-2xl shadow-2xl shadow-purple-900/50" referrerPolicy="no-referrer" />
              </div>
              <div className="w-full md:w-2/3">
                <h2 className="text-5xl font-bold mb-6">Nuestro Enfoque</h2>
                <p className="text-xl text-gray-300 leading-relaxed">
                  En The Encoders Club, nos dedicamos a fomentar la creación y el aprendizaje de novelas visuales utilizando el motor Ren'Py. Nuestro objetivo es crear una comunidad vibrante donde los desarrolladores, escritores y artistas puedan colaborar, aprender y compartir sus proyectos.
                </p>
              </div>
            </section>

            {/* Sección: Estadísticas */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
              <div className="text-center">
                <div className="text-5xl font-bold text-pink-400 mb-2">15</div>
                <div className="text-gray-400">Proyectos</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-pink-400 mb-2">99,800</div>
                <div className="text-gray-400">Descargas</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-pink-400 mb-2">7</div>
                <div className="text-gray-400">Cursos</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-pink-400 mb-2">9,880,715</div>
                <div className="text-gray-400">Visitas</div>
              </div>
            </section>

            {/* Sección: Noticias Recientes */}
            <section className="mb-24">
              <h2 className="text-4xl font-bold mb-10">Noticias Recientes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {noticias.map((noticia) => (
                  <div key={noticia.id} className="bg-purple-950/30 rounded-2xl overflow-hidden border border-purple-800/50 hover:border-pink-500/50 transition-all">
                    <img src={noticia.image} alt="News" className="w-full h-40 object-cover" referrerPolicy="no-referrer" />
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2">{noticia.title}</h3>
                      <p className="text-sm text-gray-400">{noticia.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Sección: Integrantes del Equipo */}
            <section className="mb-24">
              <h2 className="text-4xl font-bold mb-10">Integrantes del Equipo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex flex-col items-center text-center">
                    <div className="w-full mb-4 rounded-2xl overflow-hidden shadow-xl shadow-purple-900/50 bg-purple-950/30 border border-purple-800/50 h-64">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-pink-400">{member.name}</h3>
                    <p className="text-gray-300 text-sm">{member.cargo}</p>
                  </div>
                ))}
              </div>
            </section>
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white font-sans selection:bg-pink-500 selection:text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-6 border-b border-purple-900/50 bg-[#0a0a1a]/80 backdrop-blur-md sticky top-0 z-50 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="The Encoders Club Logo" className="w-12 h-12 object-contain" referrerPolicy="no-referrer" />
          <span className="text-xl md:text-2xl font-bold tracking-tight">The Encoders Club</span>
        </div>
        <div className="flex items-center gap-4 md:gap-8 text-sm md:text-lg font-medium flex-wrap">
          <button onClick={() => setCurrentPage('proyectos')} className="hover:text-pink-400 transition-colors">Proyectos</button>
          <button onClick={() => setCurrentPage('cursos')} className="hover:text-pink-400 transition-colors">Cursos</button>
          <button onClick={() => setCurrentPage('noticias')} className="hover:text-pink-400 transition-colors">Noticias</button>
          <button onClick={() => setCurrentPage('donar')} className="hover:text-pink-400 transition-colors">Donar</button>
          <button className="bg-pink-600 hover:bg-pink-700 px-4 md:px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap">¡Únete al equipo!</button>
        </div>
      </nav>

      {/* Hero - Solo en página principal */}
      {currentPage === 'home' && (
        <header className="py-24 px-8 text-center bg-gradient-to-b from-purple-900/20 to-transparent">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">The Encoders Club</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">Tu portal a las mejores experiencias de Ren'Py en español</p>
          <button className="bg-pink-600 hover:bg-pink-700 px-10 py-4 rounded-full text-lg md:text-xl font-bold transition-all">Ver más</button>
        </header>
      )}

      {/* Botón de retorno en páginas secundarias */}
      {currentPage !== 'home' && (
        <div className="max-w-7xl mx-auto px-8 py-6">
          <button onClick={() => setCurrentPage('home')} className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">← Volver al inicio</button>
        </div>
      )}

      {/* Render de páginas */}
      {renderPage()}

      {/* Footer Stats */}
      <footer className="border-t border-purple-900/50 py-10 mt-16 bg-[#0a0a1a]">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between text-gray-400 gap-4">
          <div className="flex items-center gap-2"><BookOpen size={20}/> 15 Proyectos</div>
          <div className="flex items-center gap-2"><Download size={20}/> 99,800 Descargas</div>
          <div className="flex items-center gap-2"><Users size={20}/> 7 Cursos</div>
          <div className="flex items-center gap-2"><Eye size={20}/> 9,880,715 Visitas</div>
        </div>
      </footer>
    </div>
  );
}
