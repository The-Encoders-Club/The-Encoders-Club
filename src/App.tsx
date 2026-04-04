/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Users, BookOpen, Newspaper, Download, Eye, Zap, Menu, MoreVertical } from 'lucide-react';
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

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white font-sans selection:bg-pink-500 selection:text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-4 border-b border-purple-900/30 bg-[#0a0a1a]/60 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="The Encoders Club Logo" className="w-14 h-14 object-contain drop-shadow-lg" referrerPolicy="no-referrer" />
            <div>
              <h1 className="text-lg font-bold tracking-tight">The Encoders Club</h1>
              <p className="text-xs text-purple-400">Club</p>
            </div>
          </div>
          <div className="flex items-center gap-8 text-base font-semibold">
            <a href="#" className="hover:text-blue-400 transition-colors">Projectos</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Cursus</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Noticias</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Donar</a>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Menu size={24} />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <MoreVertical size={24} />
            </button>
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-blue-500/50">¡Únete al equipo!</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 pb-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="z-10"
            >
              <h1 className="text-6xl font-extrabold mb-4 tracking-tighter">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-300">The Encoders Club</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">Tu portal a las mégirse experiences de Ren'Py en español</p>
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-8 py-3 rounded-lg font-bold text-lg transition-all shadow-lg shadow-blue-500/50">Ver mas</button>
            </motion.div>

            {/* Right Content - Personaje */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl blur-2xl opacity-30"></div>
                <img
                  src="/Personaje.png"
                  alt="Mascota"
                  className="relative w-96 h-96 object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Nuestro Enfoque</h2>
          <div className="grid grid-cols-5 gap-4">
            {[
              { icon: Zap, label: 'Projectos', value: '15', color: 'from-pink-500 to-red-500' },
              { icon: Download, label: 'Descascas', value: '99800', color: 'from-blue-500 to-cyan-500' },
              { icon: BookOpen, label: 'Cursus', value: '7', color: 'from-purple-500 to-pink-500' },
              { icon: Eye, label: 'Visitas', value: '9480715', color: 'from-green-500 to-teal-500' },
              { icon: Users, label: 'Visitas', value: '∞', color: 'from-orange-500 to-pink-500' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={`bg-gradient-to-br ${stat.color} p-0.5 rounded-2xl`}
                >
                  <div className="bg-[#0a0a1a] rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                    <Icon className="w-8 h-8 mb-3" />
                    <p className="text-3xl font-bold mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* News Section */}
      <div className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Noticias Recientes</h2>
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative rounded-2xl overflow-hidden mb-4 h-40 border border-purple-500/30 hover:border-pink-500/60 transition-all">
                  <img
                    src={`https://picsum.photos/seed/news${i}/400/200`}
                    alt="News"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-pink-400 transition-colors">Revelado: [Nuevu projecto interactivo de cience fiction!]</h3>
                <p className="text-sm text-gray-400">Lorem ipsum dolor sit amet, eccon auruscriptue elt, quosusciscion et.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Integrantes del Equipo</h2>
          <div className="grid grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: member.id * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Foto del integrante */}
                <div className="w-full mb-4 rounded-2xl overflow-hidden shadow-xl shadow-purple-900/50 bg-purple-950/30 border border-purple-500/30 h-64 relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://picsum.photos/seed/team' + member.id + '/300/400';
                    }}
                  />
                </div>
                {/* Nombre y Cargo */}
                <h3 className="text-lg font-bold mb-2 text-pink-400 group-hover:text-pink-300 transition-colors">{member.name}</h3>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">{member.cargo}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-900/30 py-8 mt-16 bg-[#0a0a1a]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 text-center text-gray-500 text-sm">
          <p>© 2026 The Encoders Club. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
