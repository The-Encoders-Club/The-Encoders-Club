import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';

export default function Proyectos() {
  const projects = [
    {
      id: 1,
      title: 'Proyecto 1: Historia Épica',
      description: 'Una novela visual épica con múltiples finales y caminos narrativos.',
      image: 'https://picsum.photos/seed/project1/400/300',
      downloads: 1250,
    },
    {
      id: 2,
      title: 'Proyecto 2: Misterio Oscuro',
      description: 'Un thriller psicológico lleno de giros inesperados.',
      image: 'https://picsum.photos/seed/project2/400/300',
      downloads: 890,
    },
    {
      id: 3,
      title: 'Proyecto 3: Romance Moderno',
      description: 'Una historia de amor contemporánea con personajes memorables.',
      image: 'https://picsum.photos/seed/project3/400/300',
      downloads: 2100,
    },
    {
      id: 4,
      title: 'Proyecto 4: Fantasía Épica',
      description: 'Un mundo de fantasía con magia, dragones y aventuras.',
      image: 'https://picsum.photos/seed/project4/400/300',
      downloads: 1560,
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
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 sm:mb-12">Nuestros Proyectos</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-purple-950/30 rounded-2xl overflow-hidden border border-purple-800/50 hover:border-pink-500/50 transition-all hover:shadow-lg hover:shadow-pink-500/20"
            >
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-48 object-cover" 
                referrerPolicy="no-referrer" 
              />
              <div className="p-6">
                <h3 className="font-bold text-lg sm:text-xl mb-2">{project.title}</h3>
                <p className="text-sm sm:text-base text-gray-400 mb-4">{project.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-pink-400 font-semibold">{project.downloads} descargas</span>
                  <button className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-full text-sm font-bold transition-all">
                    Descargar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
