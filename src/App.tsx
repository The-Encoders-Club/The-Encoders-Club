/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Users, BookOpen, Newspaper, Heart, Download, Eye } from 'lucide-react';
const logo = '/logo.png';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white font-sans selection:bg-pink-500 selection:text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-purple-900/50 bg-[#0a0a1a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src={logo} alt="The Encoders Club Logo" className="w-12 h-12 object-contain" referrerPolicy="no-referrer" />
          <span className="text-2xl font-bold tracking-tight">The Encoders Club</span>
        </div>
        <div className="flex items-center gap-8 text-lg font-medium">
          <a href="#" className="hover:text-pink-400 transition-colors">Projectos</a>
          <a href="#" className="hover:text-pink-400 transition-colors">Cursus</a>
          <a href="#" className="hover:text-pink-400 transition-colors">Noticias</a>
          <a href="#" className="hover:text-pink-400 transition-colors">Donar</a>
          <button className="bg-pink-600 hover:bg-pink-700 px-6 py-2 rounded-full font-bold transition-all">¡Únete al equipo!</button>
        </div>
      </nav>

      {/* Hero */}
      <header className="py-24 px-8 text-center bg-gradient-to-b from-purple-900/20 to-transparent">
        <h1 className="text-7xl font-extrabold mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">The Encoders Club</h1>
        <p className="text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">Tu portal a las mejores experiencias de Ren'Py en español</p>
        <button className="bg-pink-600 hover:bg-pink-700 px-10 py-4 rounded-full text-xl font-bold transition-all">Ver más</button>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-8 py-16">
        <section className="flex items-center gap-16 mb-24">
          <div className="w-1/3">
            <img src="https://picsum.photos/seed/anime/400/400" alt="Mascota" className="rounded-2xl shadow-2xl shadow-purple-900/50" referrerPolicy="no-referrer" />
          </div>
          <div className="w-2/3">
            <h2 className="text-5xl font-bold mb-6">Nuestro Enfoque</h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              En The Encoders Club, nos dedicamos a fomentar la creación y el aprendizaje de novelas visuales utilizando el motor Ren'Py. Nuestro objetivo es crear una comunidad vibrante donde los desarrolladores, escritores y artistas puedan colaborar, aprender y compartir sus proyectos.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-4xl font-bold mb-10">Noticias Recientes</h2>
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-purple-950/30 rounded-2xl overflow-hidden border border-purple-800/50 hover:border-pink-500/50 transition-all">
                <img src={`https://picsum.photos/seed/news${i}/400/200`} alt="News" className="w-full h-40 object-cover" referrerPolicy="no-referrer" />
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2">Noticia {i}</h3>
                  <p className="text-sm text-gray-400">Breve descripción de la noticia reciente sobre Ren'Py.</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer Stats */}
      <footer className="border-t border-purple-900/50 py-10 mt-16 bg-[#0a0a1a]">
        <div className="max-w-7xl mx-auto px-8 flex justify-between text-gray-400">
          <div className="flex items-center gap-2"><BookOpen size={20}/> 15 Projectes</div>
          <div className="flex items-center gap-2"><Download size={20}/> 99800 Déscnasgas</div>
          <div className="flex items-center gap-2"><Users size={20}/> 7 Cursus</div>
          <div className="flex items-center gap-2"><Eye size={20}/> 9480715 Visitas</div>
        </div>
      </footer>
    </div>
  );
}
