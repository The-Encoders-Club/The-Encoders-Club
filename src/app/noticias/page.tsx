'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, X, Share2, Clock, Eye, ChevronRight, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundParticles from '@/components/BackgroundParticles';
import { useI18n } from '@/hooks/useLocale';

interface NewsItem {
  id: number;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  contentEs: string;
  contentEn: string;
  image: string;
  dateEs: string;
  dateEn: string;
  tagEs: string;
  tagEn: string;
  tagColor: string;
  readTime: string;
  views: string;
  featured?: boolean;
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    titleEs: "Nuevo Tutorial de Ren'Py",
    titleEn: "New Ren'Py Tutorial",
    descriptionEs: "Aprende los conceptos básicos de programación en Ren'Py con nuestro nuevo tutorial interactivo.",
    descriptionEn: "Learn the basics of Ren'Py programming with our new interactive tutorial.",
    contentEs: "Estamos emocionados de anunciar el lanzamiento de nuestro nuevo tutorial interactivo de Ren'Py. Este tutorial cubre todo lo que necesitas saber para empezar a crear tus propias novelas visuales, desde la instalación del motor hasta la creación de tus primeras escenas.\n\nEl tutorial incluye:\n\n- **Configuración del entorno**: Guía paso a paso para instalar Ren'Py y configurar tu workspace.\n- **Sintaxis básica**: Aprende las etiquetas, variables y condicionales fundamentales.\n- **Personajes y diálogos**: Crea personajes únicos con expresiones y personalidades.\n- **Escenas y fondos**: Importa y maneja fondos y recursos visuales.\n- **Música y sonido**: Integra audio para crear una experiencia inmersiva.\n\nEste tutorial está diseñado para principiantes absolutos, así que no necesitas experiencia previa en programación. ¡Empieza hoy y da vida a tus historias!",
    contentEn: "We're excited to announce the launch of our new interactive Ren'Py tutorial. This tutorial covers everything you need to know to start creating your own visual novels, from installing the engine to building your first scenes.\n\nThe tutorial includes:\n\n- **Environment setup**: Step-by-step guide to install Ren'Py and configure your workspace.\n- **Basic syntax**: Learn the fundamental labels, variables, and conditionals.\n- **Characters and dialogue**: Create unique characters with expressions and personalities.\n- **Scenes and backgrounds**: Import and manage backgrounds and visual assets.\n- **Music and sound**: Integrate audio to create an immersive experience.\n\nThis tutorial is designed for absolute beginners, so no prior programming experience is required. Start today and bring your stories to life!",
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    dateEs: '1 Abr 2026',
    dateEn: 'Apr 1, 2026',
    tagEs: 'Tutorial',
    tagEn: 'Tutorial',
    tagColor: '#00F2FE',
    readTime: '8',
    views: '2.4K',
    featured: true,
  },
  {
    id: 2,
    titleEs: 'Concurso de Novelas Visuales',
    titleEn: 'Visual Novel Contest',
    descriptionEs: 'Participa en nuestro concurso anual y gana premios increíbles. ¡Las inscripciones ya están abiertas!',
    descriptionEn: 'Join our annual contest and win amazing prizes. Registration is now open!',
    contentEs: "¡El concurso anual de novelas visuales de The Encoders Club ya está aquí! Este año tenemos categorías para todos los niveles, desde principiantes hasta creadores experimentados.\n\n**Categorías:**\n- **Novela Corta**: Historias de menos de 30 minutos de gameplay\n- **Novela Completa**: Proyectos completos con múltiples rutas\n- **Mejor Arte**: Enfocado en la calidad visual\n- **Mejor Historia**: Enfocado en la narrativa\n\n**Premios:**\n- 🥇 Primer lugar: $100 USD + mención especial\n- 🥈 Segundo lugar: $50 USD\n- 🥉 Tercer lugar: Paquete de assets premium\n\nLas inscripciones están abiertas hasta el 30 de junio de 2026. ¡No te quedes fuera! Visita nuestro Discord para más detalles y inscripciones.",
    contentEn: "The annual The Encoders Club visual novel contest is here! This year we have categories for all levels, from beginners to experienced creators.\n\n**Categories:**\n- **Short Novel**: Stories under 30 minutes of gameplay\n- **Full Novel**: Complete projects with multiple routes\n- **Best Art**: Focused on visual quality\n- **Best Story**: Focused on narrative\n\n**Prizes:**\n- 🥇 First place: $100 USD + special mention\n- 🥈 Second place: $50 USD\n- 🥉 Third place: Premium assets pack\n\nRegistration is open until June 30, 2026. Don't miss out! Visit our Discord for details and registration.",
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop',
    dateEs: '28 Mar 2026',
    dateEn: 'Mar 28, 2026',
    tagEs: 'Evento',
    tagEn: 'Event',
    tagColor: '#FF2D78',
    readTime: '5',
    views: '3.1K',
  },
  {
    id: 3,
    titleEs: 'Webinar: Diseño de Personajes',
    titleEn: 'Webinar: Character Design',
    descriptionEs: 'Únete a nuestro webinar gratuito sobre técnicas avanzadas de diseño de personajes.',
    descriptionEn: 'Join our free webinar on advanced character design techniques.',
    contentEs: "Nos complace anunciar un nuevo webinar gratuito sobre diseño de personajes para novelas visuales. Este evento será conducido por artistas experimentados de la comunidad que compartirán sus técnicas y consejos.\n\n**Temas a cubrir:**\n- Fundamentos del diseño de personajes\n- Creación de sprites con expresiones\n- Paletas de colores y teoría del color\n- Herramientas recomendadas (GIMP, Krita, Photoshop)\n- Flujo de trabajo profesional\n\n**Fecha:** 15 de abril de 2026\n**Hora:** 19:00 CST (Hora de México)\n**Plataforma:** Discord (canal de voz)\n\nEl webinar será completamente gratuito y estará disponible para todos los miembros de nuestra comunidad. ¡No olvides unirte a nuestro Discord para participar!",
    contentEn: "We're pleased to announce a new free webinar on character design for visual novels. This event will be led by experienced artists from the community who will share their techniques and tips.\n\n**Topics covered:**\n- Fundamentals of character design\n- Creating sprites with expressions\n- Color palettes and color theory\n- Recommended tools (GIMP, Krita, Photoshop)\n- Professional workflow\n\n**Date:** April 15, 2026\n**Time:** 19:00 CST (Mexico City)\n**Platform:** Discord (voice channel)\n\nThe webinar will be completely free and available to all members of our community. Don't forget to join our Discord to participate!",
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=400&fit=crop',
    dateEs: '25 Mar 2026',
    dateEn: 'Mar 25, 2026',
    tagEs: 'Webinar',
    tagEn: 'Webinar',
    tagColor: '#9d4edd',
    readTime: '4',
    views: '1.8K',
  },
  {
    id: 4,
    titleEs: 'Actualización de Herramientas',
    titleEn: 'Tools Update',
    descriptionEs: 'Descubre las nuevas herramientas y mejoras que hemos añadido a nuestra plataforma.',
    descriptionEn: "Discover the new tools and improvements we've added to our platform.",
    contentEs: "Hemos estado trabajando duro para mejorar nuestra plataforma y hoy estamos orgullosos de anunciar las últimas actualizaciones:\n\n**Nuevas características:**\n- Sistema de comentarios mejorado con soporte para respuestas\n- Perfiles de usuario personalizables con avatares\n- Sistema de notificaciones en tiempo real\n- Panel de administración para moderadores\n- Sistema de reacciones en comentarios\n\n**Mejoras técnicas:**\n- Tiempo de carga reducido en un 40%\n- Interfaz optimizada para móviles\n- Nuevo diseño con tema neon synthwave\n- Mejor integración con Discord\n\nEstas mejoras son posibles gracias al apoyo de nuestra comunidad. ¡Sigue creando y compartiendo tus proyectos con nosotros!",
    contentEn: "We've been working hard to improve our platform and today we're proud to announce the latest updates:\n\n**New features:**\n- Enhanced comment system with reply support\n- Customizable user profiles with avatars\n- Real-time notification system\n- Admin panel for moderators\n- Reaction system on comments\n\n**Technical improvements:**\n- Load time reduced by 40%\n- Mobile-optimized interface\n- New design with neon synthwave theme\n- Better Discord integration\n\nThese improvements are possible thanks to our community's support. Keep creating and sharing your projects with us!",
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
    dateEs: '20 Mar 2026',
    dateEn: 'Mar 20, 2026',
    tagEs: 'Actualización',
    tagEn: 'Update',
    tagColor: '#22c55e',
    readTime: '6',
    views: '1.5K',
  },
  {
    id: 5,
    titleEs: 'Monika After History - Nueva Actualización',
    titleEn: 'Monika After History - New Update',
    descriptionEs: 'La nueva actualización de Monika After History trae nuevas escenas y mejoras significativas.',
    descriptionEn: 'The new Monika After History update brings new scenes and significant improvements.',
    contentEs: "Acabamos de lanzar una nueva actualización para Monika After History, nuestro proyecto más ambicioso hasta la fecha.\n\n**Novedades de esta versión:**\n- Nuevas escenas de diálogo con Monika\n- Sistema de elecciones expandido con 3 nuevas rutas\n- Mejoras en la calidad de los sprites\n- Nueva banda sonora original\n- Corrección de bugs y optimización general\n\n**Cómo actualizar:**\nSi ya tienes una versión anterior, simplemente descarga la última versión desde nuestra página de proyectos. Tu progreso se mantendrá automáticamente.\n\n¡Gracias a todos los beta testers que ayudaron a hacer posible esta actualización!",
    contentEn: "We've just released a new update for Monika After History, our most ambitious project to date.\n\n**What's new in this version:**\n- New dialogue scenes with Monika\n- Expanded choice system with 3 new routes\n- Improved sprite quality\n- New original soundtrack\n- Bug fixes and general optimization\n\n**How to update:**\nIf you already have an older version, simply download the latest version from our projects page. Your progress will be kept automatically.\n\nThanks to all the beta testers who helped make this update possible!",
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=400&fit=crop',
    dateEs: '15 Mar 2026',
    dateEn: 'Mar 15, 2026',
    tagEs: 'Proyecto',
    tagEn: 'Project',
    tagColor: '#FF2D78',
    readTime: '4',
    views: '4.2K',
  },
  {
    id: 6,
    titleEs: 'Guía: Cómo Publicar tu Novela Visual',
    titleEn: 'Guide: How to Publish Your Visual Novel',
    descriptionEs: 'Aprende los pasos necesarios para publicar y distribuir tu novela visual al público.',
    descriptionEn: 'Learn the steps needed to publish and distribute your visual novel to the public.',
    contentEs: "Has terminado tu novela visual y quieres compartirla con el mundo. Aquí tienes una guía completa sobre cómo hacerlo:\n\n**Pasos para publicar:**\n\n1. **Pruebas finales**: Juega tu juego completo varias veces para encontrar bugs\n2. **Empaquetado**: Usa las herramientas de Ren'Py para crear builds para Windows, Mac y Android\n3. **Plataformas de distribución**:\n   - itch.io (recomendado para indie)\n   - Steam Greenlight (para juegos más completos)\n   - Google Play Store (versión Android)\n4. **Marketing**: Crea trailer, capturas de pantalla y descripción atractiva\n5. **Comunidad**: Comparte en foros, redes sociales y Discord\n\nRecuerda que la calidad y la pasión por tu proyecto son las mejores herramientas de marketing. ¡Mucho éxito con tu lanzamiento!",
    contentEn: "You've finished your visual novel and want to share it with the world. Here's a complete guide on how to do it:\n\n**Steps to publish:**\n\n1. **Final testing**: Play your complete game several times to find bugs\n2. **Packaging**: Use Ren'Py's tools to create builds for Windows, Mac and Android\n3. **Distribution platforms**:\n   - itch.io (recommended for indie)\n   - Steam Greenlight (for more complete games)\n   - Google Play Store (Android version)\n4. **Marketing**: Create trailer, screenshots and attractive description\n5. **Community**: Share on forums, social media and Discord\n\nRemember that quality and passion for your project are the best marketing tools. Best of luck with your launch!",
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop',
    dateEs: '10 Mar 2026',
    dateEn: 'Mar 10, 2026',
    tagEs: 'Guía',
    tagEn: 'Guide',
    tagColor: '#00F2FE',
    readTime: '10',
    views: '2.8K',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

function NewsDetail({ item, onClose, t, isEs }: { item: NewsItem; onClose: () => void; t: ReturnType<typeof useI18n>['t']; isEs: boolean }) {
  const content = isEs ? item.contentEs : item.contentEn;
  return (
    <div className="relative z-10 min-h-screen">
      <nav className="sticky top-0 z-50 bg-[#080812]/90 backdrop-blur-md border-b border-[#FF2D78]/20 px-4 sm:px-6 py-4 flex justify-between items-center">
        <button onClick={onClose} className="flex items-center gap-2 text-[#FF2D78] hover:text-white transition-colors group">
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          <span className="font-cyber font-bold tracking-wider uppercase text-sm">{t('news.backToNews')}</span>
        </button>
        <button className="p-2 bg-white/5 border border-white/10 text-white/50 hover:text-[#00F2FE] transition-all">
          <Share2 className="w-5 h-5" />
        </button>
      </nav>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className="font-code text-[10px] font-bold px-3 py-1.5 bg-[#080812] border border-white/10"
              style={{ borderLeftColor: item.tagColor, borderLeftWidth: '2px', color: item.tagColor }}
            >
              {isEs ? item.tagEs : item.tagEn}
            </span>
            <div className="flex items-center gap-4 text-white/40 font-code text-[10px]">
              <span className="flex items-center gap-1"><Calendar size={12} />{isEs ? item.dateEs : item.dateEn}</span>
              <span className="flex items-center gap-1"><Clock size={12} />{item.readTime} {t('news.minRead')}</span>
              <span className="flex items-center gap-1"><Eye size={12} />{item.views}</span>
            </div>
          </div>
          <h1 className="font-cyber text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight uppercase">
            {isEs ? item.titleEs : item.titleEn}
          </h1>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="clip-card overflow-hidden mb-8 border border-white/10"
        >
          <img src={item.image} alt={isEs ? item.titleEs : item.titleEn} className="w-full h-56 sm:h-72 lg:h-96 object-cover" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="prose prose-invert max-w-none mb-12"
        >
          {content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              return (
                <h3 key={idx} className="font-cyber text-lg font-bold text-white mt-6 mb-3">
                  {paragraph.replace(/\*\*/g, '')}
                </h3>
              );
            }
            return (
              <p key={idx} className="text-white/70 leading-relaxed text-base mb-4 font-code text-sm">
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


      </article>
    </div>
  );
}

export default function Noticias() {
  const { t, locale } = useI18n();
  const isEs = locale === 'es';
  const [activeItem, setActiveItem] = useState<NewsItem | null>(null);
  const featuredItem = newsItems.find(n => n.featured);
  const regularItems = newsItems.filter(n => !n.featured);

  return (
    <div className="min-h-screen bg-[#030308] text-white overflow-x-hidden">
      <Navbar />
      <BackgroundParticles />

      {/* Page Header */}
      <section className="pt-16 sm:pt-20 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="font-cyber font-bold text-sm tracking-widest text-[#00F2FE] mb-3 block">{'// '}{t('news.tag')}</span>
            <h1 className="font-cyber text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 uppercase">
              {t('news.title')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D78] to-[#00F2FE]">
                {t('news.accent')}
              </span>
            </h1>
            <p className="font-code text-sm text-white/60 max-w-2xl">
              {t('news.subtitle')}
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
              className="clip-card neon-border-magenta overflow-hidden cursor-pointer group transition-all bg-[#0e0e1f]"
            >
              <div className="absolute top-0 left-0 w-full h-1 brand-gradient" />
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-56 sm:h-72 lg:h-auto min-h-[240px] overflow-hidden">
                  <img src={featuredItem.image} alt={isEs ? featuredItem.titleEs : featuredItem.titleEn} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="font-cyber font-bold text-xs px-3 py-1.5 bg-[#FF2D78] text-black flex items-center gap-1">
                      <Sparkles size={11} /> {t('news.featured')}
                    </span>
                    <span
                      className="font-code text-[10px] font-bold px-2.5 py-1 bg-[#080812] border border-white/10"
                      style={{ color: featuredItem.tagColor }}
                    >
                      {isEs ? featuredItem.tagEs : featuredItem.tagEn}
                    </span>
                  </div>
                </div>
                <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-white/40 font-code text-[10px] mb-3">
                    <span className="flex items-center gap-1"><Calendar size={12} />{isEs ? featuredItem.dateEs : featuredItem.dateEn}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{featuredItem.readTime} {t('news.minRead')}</span>
                    <span className="flex items-center gap-1"><Eye size={12} />{featuredItem.views}</span>
                  </div>
                  <h2 className="font-cyber text-2xl sm:text-3xl font-bold text-white mb-3 leading-snug">
                    {isEs ? featuredItem.titleEs : featuredItem.titleEn}
                  </h2>
                  <p className="font-code text-sm text-white/60 leading-relaxed mb-6">{isEs ? featuredItem.descriptionEs : featuredItem.descriptionEn}</p>
                  <div className="flex items-center gap-2 text-[#FF2D78] font-cyber font-bold text-sm group-hover:translate-x-2 transition-transform">
                    {t('news.readFull')} <ChevronRight size={16} />
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
                className="clip-card bg-[#0e0e1f] border border-white/10 overflow-hidden group cursor-pointer hover:border-[#00F2FE]/30 transition-all"
              >
                <div className="relative overflow-hidden h-44">
                  <img src={item.image} alt={isEs ? item.titleEs : item.titleEn} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span
                    className="absolute top-3 left-3 font-code text-[10px] font-bold px-2.5 py-1 bg-[#080812] border border-white/10"
                    style={{ color: item.tagColor }}
                  >
                    {isEs ? item.tagEs : item.tagEn}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-white/40 font-code text-[10px] mb-3">
                    <span className="flex items-center gap-1"><Calendar size={11} />{isEs ? item.dateEs : item.dateEn}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{item.readTime} {t('news.minRead')}</span>
                  </div>
                  <h3 className="font-cyber font-bold text-white text-base mb-2 leading-snug">
                    {isEs ? item.titleEs : item.titleEn}
                  </h3>
                  <p className="font-code text-[11px] text-white/50 leading-relaxed line-clamp-3 mb-4">{isEs ? item.descriptionEs : item.descriptionEn}</p>
                  <span className="font-code text-[10px] text-[#FF2D78] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    {t('news.readMore')} <ChevronRight size={13} />
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
            className="fixed inset-0 z-[100] bg-[#030308] text-white overflow-y-auto"
          >
            <NewsDetail item={activeItem} onClose={() => setActiveItem(null)} t={t} isEs={isEs} />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
