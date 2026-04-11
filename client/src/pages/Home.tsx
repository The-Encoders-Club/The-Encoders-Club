import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Users, 
  Gamepad2, 
  Code2, 
  Rocket, 
  ChevronRight, 
  Github, 
  Twitter, 
  MessageSquare,
  Sparkles,
  Cpu,
  Globe,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  // Optimizamos el scroll al cargar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Configuración de animación optimizada para móviles
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  // Optimizamos las variantes para usar aceleración por hardware (GPU)
  const fadeInUp = {
    initial: { opacity: 0, y: isMobile ? 15 : 30, translateZ: 0 },
    whileInView: { opacity: 1, y: 0, translateZ: 0 },
    viewport: { once: true, margin: isMobile ? "0px" : "-100px" },
    transition: { duration: isMobile ? 0.4 : 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: isMobile ? 0.05 : 0.1 } },
    viewport: { once: true, margin: isMobile ? "0px" : "-100px" }
  };

  return (
    <div className="min-height-screen bg-brand-dark text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Decorative Background Elements - Optimizados con translateZ */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-pink/10 rounded-full blur-3xl animate-pulse" style={{ transform: 'translateZ(0)' }} />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s', transform: 'translateZ(0)' }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, translateZ: 0 }}
              animate={{ opacity: 1, scale: 1, translateZ: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-brand-pink" />
              <span className="text-sm font-medium text-brand-pink">Comunidad de Novelas Visuales</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20, translateZ: 0 }}
              animate={{ opacity: 1, y: 0, translateZ: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Impulsando la <span className="brand-gradient-text">Creatividad</span> en Español
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20, translateZ: 0 }}
              animate={{ opacity: 1, y: 0, translateZ: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Somos una comunidad dedicada al desarrollo, traducción y difusión de novelas visuales creadas con Ren'Py. Aprende, crea y comparte con nosotros.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20, translateZ: 0 }}
              animate={{ opacity: 1, y: 0, translateZ: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a href="/proyectos" className="btn-primary w-full sm:w-auto group">
                Explorar Proyectos
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="https://discord.gg/theencodersclub" target="_blank" rel="noopener noreferrer" className="btn-outline w-full sm:w-auto">
                Unirse al Discord
                <MessageSquare className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </div>

        {/* Hero Mascot / Image - Optimizada con translateZ */}
        <motion.div
          initial={{ opacity: 0, y: 50, translateZ: 0 }}
          animate={{ opacity: 1, y: 0, translateZ: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl pointer-events-none opacity-20 md:opacity-40"
        >
          <img 
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663518113549/KEigSkzYpCzkACRU.png" 
            alt="Mascot" 
            className="w-full h-auto animate-float"
            style={{ transform: 'translateZ(0)' }}
          />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/5 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: isMobile ? "0px" : "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { label: 'Proyectos', value: '15+', icon: Rocket },
              { label: 'Miembros', value: '500+', icon: Users },
              { label: 'Traducciones', value: '10+', icon: Globe },
              { label: 'Líneas de Código', value: '100k+', icon: Code2 },
            ].map((stat, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="inline-flex p-3 rounded-2xl bg-brand-pink/10 mb-4">
                  <stat.icon className="w-6 h-6 text-brand-pink" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section with Mascot */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50, translateZ: 0 }}
              whileInView={{ opacity: 1, x: 0, translateZ: 0 }}
              viewport={{ once: true, margin: isMobile ? "0px" : "-100px" }}
              className="lg:w-1/2"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-brand-pink/20 blur-2xl rounded-full" style={{ transform: 'translateZ(0)' }} />
                {/* Logo de Ren'Py eliminado por petición del usuario */}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50, translateZ: 0 }}
              whileInView={{ opacity: 1, x: 0, translateZ: 0 }}
              viewport={{ once: true, margin: isMobile ? "0px" : "-100px" }}
              className="lg:w-1/2"
            >
              <h2 className="text-brand-pink font-semibold mb-4 uppercase tracking-widest">Sobre el Club</h2>
              <h3 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                Impulsando la <span className="text-brand-blue">Narrativa Visual</span> en nuestra lengua
              </h3>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                The Encoders Club nació con la misión de unir a desarrolladores, escritores y artistas apasionados por las novelas visuales. Nos especializamos en el motor Ren'Py, ofreciendo soporte, recursos y una plataforma para que tus historias lleguen a miles de personas.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                {[
                  { title: 'Desarrollo Propio', desc: 'Creamos historias originales desde cero.' },
                  { title: 'Traducciones', desc: 'Llevamos grandes obras al español.' },
                  { title: 'Soporte Técnico', desc: 'Ayudamos con código y optimización.' },
                  { title: 'Comunidad', desc: 'Un espacio para aprender y crecer.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1">
                      <div className="w-2 h-2 rounded-full bg-brand-pink" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a href="/nosotros" className="btn-outline group">
                Conocer más
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured News Section */}
      <section className="py-24 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-brand-pink font-semibold mb-4 uppercase tracking-widest">Noticias</h2>
              <h3 className="text-4xl font-bold">Últimas Actualizaciones</h3>
            </div>
            <a href="/noticias" className="hidden md:flex items-center gap-2 text-brand-pink hover:text-brand-blue transition-colors font-semibold">
              Ver todas <ChevronRight className="w-5 h-5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Lanzamiento de 'Sombras del Destino'",
                date: "15 Mar, 2024",
                category: "Proyecto",
                image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: "Guía Definitiva de Optimización Ren'Py",
                date: "10 Mar, 2024",
                category: "Tutorial",
                image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: "Nueva Alianza con Comunidades de Traducción",
                date: "05 Mar, 2024",
                category: "Comunidad",
                image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
              }
            ].map((news, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, translateZ: 0 }}
                whileInView={{ opacity: 1, y: 0, translateZ: 0 }}
                viewport={{ once: true, margin: isMobile ? "0px" : "-100px" }}
                transition={{ delay: i * 0.1 }}
                className="glass-card overflow-hidden group cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-brand-pink text-xs font-bold uppercase">
                    {news.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">{news.date}</div>
                  <h4 className="text-xl font-bold mb-4 group-hover:text-brand-pink transition-colors">
                    {news.title}
                  </h4>
                  <div className="flex items-center gap-2 text-brand-pink font-semibold text-sm">
                    Leer más <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-brand-pink font-semibold mb-4 uppercase tracking-widest">Nuestro Equipo</h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-16">Las Mentes Detrás del Club</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'Alex', role: 'Lead Developer', color: 'pink' },
              { name: 'Elena', role: 'Lead Writer', color: 'blue' },
              { name: 'Marc', role: 'Artist', color: 'purple' },
              { name: 'Sofia', role: 'Translator', color: 'pink' },
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9, translateZ: 0 }}
                whileInView={{ opacity: 1, scale: 1, translateZ: 0 }}
                viewport={{ once: true, margin: isMobile ? "0px" : "-100px" }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className={`relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 rounded-full p-1 bg-gradient-to-tr from-brand-${member.color} to-transparent`}>
                  <div className="w-full h-full rounded-full bg-brand-dark overflow-hidden p-1">
                    <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center group-hover:bg-brand-pink/20 transition-colors">
                      <Users className="w-12 h-12 text-gray-400 group-hover:text-brand-pink transition-colors" />
                    </div>
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-1">{member.name}</h4>
                <p className="text-gray-500 text-sm uppercase tracking-wider">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="glass-card p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-pink via-brand-purple to-brand-blue" />
            
            <h2 className="text-4xl md:text-6xl font-bold mb-8">¿Listo para crear tu propia <span className="brand-gradient-text">Historia</span>?</h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Únete a nuestra comunidad hoy mismo y obtén acceso a recursos exclusivos, soporte de expertos y una plataforma para tus proyectos.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a href="https://discord.gg/theencodersclub" target="_blank" rel="noopener noreferrer" className="btn-primary px-12 py-4 text-lg">
                ¡Empezar Ahora!
              </a>
              <div className="flex items-center gap-4">
                <a href="#" className="p-3 rounded-full bg-white/5 hover:bg-brand-pink/20 transition-colors border border-white/10">
                  <Github className="w-6 h-6" />
                </a>
                <a href="#" className="p-3 rounded-full bg-white/5 hover:bg-brand-pink/20 transition-colors border border-white/10">
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
