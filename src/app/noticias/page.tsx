'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, Tag, X, Share2, Clock, Eye, ChevronRight, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundParticles from '@/components/BackgroundParticles';
import { CommentSection } from '@/components/CommentSection';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  content: string;
  image: string;
  date: string;
  tag: string;
  tagColor: string;
  readTime: string;
  views: string;
  featured?: boolean;
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    title: 'Nuevo Tutorial de Ren\'Py',
    description: 'Aprende los conceptos básicos de programación en Ren\'Py con nuestro nuevo tutorial interactivo.',
    content: 'Estamos emocionados de anunciar el lanzamiento de nuestro nuevo tutorial interactivo de Ren\'Py. Este tutorial cubre todo lo que necesitas saber para empezar a crear tus propias novelas visuales, desde la instalación del motor hasta la creación de tus primeras escenas.\n\nEl tutorial incluye:\n\n- **Configuración del entorno**: Guía paso a paso para instalar Ren\'Py y configurar tu workspace.\n- **Sintaxis básica**: Aprende las etiquetas, variables y condicionales fundamentales.\n- **Personajes y diálogos**: Crea personajes únicos con expresiones y personalidades.\n- **Escenas y fondos**: Importa y maneja fondos y recursos visuales.\n- **Música y sonido**: Integra audio para crear una experiencia inmersiva.\n\nEste tutorial está diseñado para principiantes absolutos, así que no necesitas experiencia previa en programación. ¡Empieza hoy y da vida a tus historias!',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    date: '1 Abr 2026',
    tag: 'Tutorial',
    tagColor: '#4D9FFF',
    readTime: '8 min',
    views: '2.4K',
    featured: true,
  },
  {
    id: 2,
    title: 'Concurso de Novelas Visuales',
    description: 'Participa en nuestro concurso anual y gana premios increíbles. ¡Las inscripciones ya están abiertas!',
    content: '¡El concurso anual de novelas visuales de The Encoders Club ya está aquí! Este año tenemos categorías para todos los niveles, desde principiantes hasta creadores experimentados.\n\n**Categorías:**\n- **Novela Corta**: Historias de menos de 30 minutos de gameplay\n- **Novela Completa**: Proyectos completos con múltiples rutas\n- **Mejor Arte**: Enfocado en la calidad visual\n- **Mejor Historia**: Enfocado en la narrativa\n\n**Premios:**\n- 🥇 Primer lugar: $100 USD + mención especial\n- 🥈 Segundo lugar: $50 USD\n- 🥉 Tercer lugar: Paquete de assets premium\n\nLas inscripciones están abiertas hasta el 30 de junio de 2026. ¡No te quedes fuera! Visita nuestro Discord para más detalles y inscripciones.',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop',
    date: '28 Mar 2026',
    tag: 'Evento',
    tagColor: '#FF2D78',
    readTime: '5 min',
    views: '3.1K',
  },
  {
    id: 3,
    title: 'Webinar: Diseño de Personajes',
    description: 'Únete a nuestro webinar gratuito sobre técnicas avanzadas de diseño de personajes.',
    content: 'Nos complace anunciar un nuevo webinar gratuito sobre diseño de personajes para novelas visuales. Este evento será conducido por artistas experimentados de la comunidad que compartirán sus técnicas y consejos.\n\n**Temas a cubrir:**\n- Fundamentos del diseño de personajes\n- Creación de sprites con expresiones\n- Paletas de colores y teoría del color\n- Herramientas recomendadas (GIMP, Krita, Photoshop)\n- Flujo de trabajo profesional\n\n**Fecha:** 15 de abril de 2026\n**Hora:** 19:00 CST (Hora de México)\n**Plataforma:** Discord (canal de voz)\n\nEl webinar será completamente gratuito y estará disponible para todos los miembros de nuestra comunidad. ¡No olvides unirte a nuestro Discord para participar!',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=400&fit=crop',
    date: '25 Mar 2026',
    tag: 'Webinar',
    tagColor: '#a855f7',
    readTime: '4 min',
    views: '1.8K',
  },
  {
    id: 4,
    title: 'Actualización de Herramientas',
    description: 'Descubre las nuevas herramientas y mejoras que hemos añadido a nuestra plataforma.',
    content: 'Hemos estado trabajando duro para mejorar nuestra plataforma y hoy estamos orgullosos de anunciar las últimas actualizaciones:\n\n**Nuevas características:**\n- Sistema de comentarios mejorado con soporte para respuestas\n- Perfiles de usuario personalizables con avatares\n- Sistema de notificaciones en tiempo real\n- Panel de administración para moderadores\n- Sistema de reacciones en comentarios\n\n**Mejoras técnicas:**\n- Tiempo de carga reducido en un 40%\n- Interfaz optimizada para móviles\n- Nuevo diseño con tema neon synthwave\n- Mejor integración con Discord\n\nEstas mejoras son posibles gracias al apoyo de nuestra comunidad. ¡Sigue creando y compartiendo tus proyectos con nosotros!',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
    date: '20 Mar 2026',
    tag: 'Actualización',
    tagColor: '#22c55e',
    readTime: '6 min',
    views: '1.5K',
  },
  {
    id: 5,
    title: 'Monika After History - Nueva Actualización',
    description: 'La nueva actualización de Monika After History trae nuevas escenas y mejoras significativas.',
    content: 'Acabamos de lanzar una nueva actualización para Monika After History, nuestro proyecto más ambicioso hasta la fecha.\n\n**Novedades de esta versión:**\n- Nuevas escenas de diálogo con Monika\n- Sistema de elecciones expandido con 3 nuevas rutas\n- Mejoras en la calidad de los sprites\n- Nueva banda sonora original\n- Corrección de bugs y optimización general\n\n**Cómo actualizar:**\nSi ya tienes una versión anterior, simplemente descarga la última versión desde nuestra página de proyectos. Tu progreso se mantendrá automáticamente.\n\n¡Gracias a todos los beta testers que ayudaron a hacer posible esta actualización!',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=400&fit=crop',
    date: '15 Mar 2026',
    tag: 'Proyecto',
    tagColor: '#FF2D78',
    readTime: '4 min',
    views: '4.2K',
  },
  {
    id: 6,
    title: 'Guía: Cómo Publicar tu Novela Visual',
    description: 'Aprende los pasos necesarios para publicar y distribuir tu novela visual al público.',
    content: 'Has terminado tu novela visual y quieres compartirla con el mundo. Aquí tienes una guía completa sobre cómo hacerlo:\n\n**Pasos para publicar:**\n\n1. **Pruebas finales**: Juega tu juego completo varias veces para encontrar bugs\n2. **Empaquetado**: Usa las herramientas de Ren\'Py para crear builds para Windows, Mac y Android\n3. **Plataformas de distribución**:\n   - itch.io (recomendado para indie)\n   - Steam Greenlight (para juegos más completos)\n   - Google Play Store (versión Android)\n4. **Marketing**: Crea trailer, capturas de pantalla y descripción atractiva\n5. **Comunidad**: Comparte en foros, redes sociales y Discord\n\nRecuerda que la calidad y la pasión por tu proyecto son las mejores herramientas de marketing. ¡Mucho éxito con tu lanzamiento!',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop',
    date: '10 Mar 2026',
    tag: 'Guía',
    tagColor: '#4D9FFF',
    readTime: '10 min',
    views: '2.8K',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

function NewsDetail({ item, onClose }: { item: NewsItem; onClose: () => void }) {
  return (
    <div className="relative z-10 min-h-screen">
      <nav className="sticky top-0 z-50 bg-[#0a0a1a]/90 backdrop-blur-md border-b border-white/20 px-4 sm:px-6 py-4 flex justify-between items-center">
        <button onClick={onClose} className="flex items-center gap-2 text-[#FF2D78] hover:text-white transition-colors group">
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          <span className="font-bold tracking-wider uppercase text-sm">Volver a Noticias</span>
        </button>
        <button className="p-2 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all">
          <Share2 className="w-5 h-5" />
        </button>
      </nav>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: `${item.tagColor}25`, border: `1px solid ${item.tagColor}50`, color: item.tagColor }}
            >
              {item.tag}
            </span>
            <div className="flex items-center gap-4 text-white/40 text-xs">
              <span className="flex items-center gap-1"><Calendar size={12} />{item.date}</span>
              <span className="flex items-center gap-1"><Clock size={12} />{item.readTime}</span>
              <span className="flex items-center gap-1"><Eye size={12} />{item.views}</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {item.title}
          </h1>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl overflow-hidden mb-8 border border-white/10"
        >
          <img src={item.image} alt={item.title} className="w-full h-56 sm:h-72 lg:h-96 object-cover" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="prose prose-invert max-w-none mb-12"
        >
          {item.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              return (
                <h3 key={idx} className="text-lg font-bold text-white mt-6 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {paragraph.replace(/\*\*/g, '')}
                </h3>
              );
            }
            return (
              <p key={idx} className="text-white/70 leading-relaxed text-base mb-4">
                {paragraph.split(/(\*\*.*?\*\*)/).map((part, i) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="text-white font-semibold">{part.replace(/\*\*/g, '')}</strong>;
                  }
                  return <span key={i}>{part}</span>;
                })}
              </p>
            );
          })}
        </motion.div>

        {/* Comments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="pt-8 border-t border-white/10"
        >
          <CommentSection targetId={item.id.toString()} targetType="news" />
        </motion.div>
      </article>
    </div>
  );
}

export default function Noticias() {
  const [activeItem, setActiveItem] = useState<NewsItem | null>(null);
  const featuredItem = newsItems.find(n => n.featured);
  const regularItems = newsItems.filter(n => !n.featured);

  return (
    <div className="min-h-screen bg-[#080818] text-white overflow-x-hidden">
      <Navbar />
      <BackgroundParticles />

      {/* Page Header */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-[#4D9FFF] text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3 block">Blog</span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Noticias y{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D78] to-[#4D9FFF]">
                Novedades
              </span>
            </h1>
            <p className="text-white/60 text-base sm:text-lg max-w-2xl">
              Mantente al día con las últimas noticias, tutoriales y eventos de nuestra comunidad de novelas visuales.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredItem && (
        <section className="pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              onClick={() => setActiveItem(featuredItem)}
              className="glass-card overflow-hidden cursor-pointer group hover:border-[#FF2D78]/30 transition-all"
            >
              <div className="absolute top-0 left-0 w-full h-1 brand-gradient" />
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-56 sm:h-72 lg:h-auto min-h-[240px] overflow-hidden">
                  <img src={featuredItem.image} alt={featuredItem.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#FF2D78] text-white flex items-center gap-1">
                      <Sparkles size={11} /> DESTACADO
                    </span>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: `${featuredItem.tagColor}25`, border: `1px solid ${featuredItem.tagColor}50`, color: featuredItem.tagColor }}
                    >
                      {featuredItem.tag}
                    </span>
                  </div>
                </div>
                <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-white/40 text-xs mb-3">
                    <span className="flex items-center gap-1"><Calendar size={12} />{featuredItem.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{featuredItem.readTime}</span>
                    <span className="flex items-center gap-1"><Eye size={12} />{featuredItem.views}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {featuredItem.title}
                  </h2>
                  <p className="text-white/60 text-base leading-relaxed mb-6">{featuredItem.description}</p>
                  <div className="flex items-center gap-2 text-[#FF2D78] font-bold text-sm group-hover:translate-x-2 transition-transform">
                    Leer artículo completo <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularItems.map((item, i) => (
              <motion.article
                key={item.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                onClick={() => setActiveItem(item)}
                className="glass-card overflow-hidden group cursor-pointer hover:border-white/20 transition-all"
              >
                <div className="relative overflow-hidden h-44">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span
                    className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: `${item.tagColor}25`, border: `1px solid ${item.tagColor}50`, color: item.tagColor }}
                  >
                    {item.tag}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-white/40 text-xs mb-3">
                    <span className="flex items-center gap-1"><Calendar size={11} />{item.date}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{item.readTime}</span>
                  </div>
                  <h3 className="font-bold text-white text-base mb-2 leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed line-clamp-3 mb-4">{item.description}</p>
                  <span className="text-xs text-[#FF2D78] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Leer más <ChevronRight size={13} />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* News Detail Modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0a0a1a] text-white overflow-y-auto"
          >
            <NewsDetail item={activeItem} onClose={() => setActiveItem(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
