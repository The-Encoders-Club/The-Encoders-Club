/* ============================================================
   HOME PAGE — The Encoders Club
   Style: Neon Synthwave Gaming (Optimized for Mobile)
   ============================================================ */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight, BookOpen, Download, Users, Eye,
  Gamepad2, Sparkles, ChevronRight, Star
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCountUp } from "@/hooks/useCountUp";

const BG_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663516100892/kzug5rLPLvVJzu5QVE66vY/hero_bg-nZF9vsy8Qjc3eRVqRoEgy7.webp";

const newsItems = [
  { id: 1, title: "Nuevo Tutorial de Ren'Py", description: "Aprende los conceptos básicos de programación en Ren'Py con nuestro nuevo tutorial interactivo paso a paso.", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=220&fit=crop", date: "1 Abr 2026", tag: "Tutorial", tagColor: "#4D9FFF" },
  { id: 2, title: "Concurso de Novelas Visuales", description: "Participa en nuestro concurso anual y gana premios increíbles. ¡Las inscripciones ya están abiertas!", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=220&fit=crop", date: "28 Mar 2026", tag: "Evento", tagColor: "#FF2D78" },
  { id: 3, title: "Webinar: Diseño de Personajes", description: "Únete a nuestro webinar gratuito sobre técnicas avanzadas de diseño de personajes para novelas visuales.", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=220&fit=crop", date: "25 Mar 2026", tag: "Webinar", tagColor: "#a855f7" },
  { id: 4, title: "Actualización de Herramientas", description: "Descubre las nuevas herramientas y mejoras que hemos añadido a nuestra plataforma de desarrollo.", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=220&fit=crop", date: "20 Mar 2026", tag: "Actualización", tagColor: "#22c55e" },
];

const teamMembers = [
  { id: 1, name: "Slytharbez", cargo: ["Desarrollador", "Moderador", "Traductor", "Ideas"], color: "#FF2D78", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/sYvfOcdjjpxwpsYH.jpg" },
  { id: 2, name: "The_Player_Madness", cargo: ["Desarrollador", "Traductor"], color: "#4D9FFF", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/fqvycZADioutZyXg.jpg" },
  { id: 3, name: "«[×𝐹ɾαɳƈιʂƈσ×]»", cargo: ["Beta Tester", "Traductor"], color: "#a855f7", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/NdddEeYbkRaZUwAf.jpg" },
  { id: 4, name: "Ashi", cargo: ["Ideas"], color: "#22c55e", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/owXrIjTwHSFTkmKB.jpg" },
  { id: 5, name: "mondongo8360", cargo: ["Traductor"], color: "#FF2D78", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/cCtjHYrvAzaOHjEd.jpg" },
  { id: 6, name: "FlagBro23", cargo: ["Traductor"], color: "#4D9FFF", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/iecokdxZIrlMEbyP.jpg" },
  { id: 7, name: "Manu", cargo: ["Traductor"], color: "#a855f7", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/bIiIQjvPOSUKgAUl.jpg" },
];

function StatCounter({ value, label, icon: Icon, color, suffix = "" }: { value: number; label: string; icon: React.ElementType; color: string; suffix?: string; }) {
  const ref = useRef<HTMLDivElement>(null);
  const { count, start } = useCountUp(value, 1500);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting && !triggered) { setTriggered(true); start(); } }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [triggered, start]);

  const formatted = count >= 1000 ? count >= 1000000 ? `${(count / 1000000).toFixed(1)}M` : `${(count / 1000).toFixed(0)}K` : count.toString();

  return (
    <div ref={ref} className="flex flex-col items-center text-center p-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <span className="text-2xl md:text-3xl font-bold mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif", color }}>{formatted}{suffix}</span>
      <span className="text-[10px] uppercase tracking-wider text-white/40">{label}</span>
    </div>
  );
}

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

// Animaciones OPTIMIZADAS (No eliminadas)
const fadeUp = {
  hidden: { opacity: 0, y: isMobile ? 10 : 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: isMobile ? 0.3 : 0.5, 
      delay: isMobile ? 0.02 : i * 0.05, 
      ease: "easeOut" 
    },
  }),
};

function TeamCarousel() {
  return (
    <section className="py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-[#a855f7] text-xs font-semibold uppercase tracking-widest mb-2 block">Quiénes somos</span>
          <h2 className="text-3xl font-bold text-white">Integrantes del <span className="brand-gradient-text">Equipo</span></h2>
        </div>
        <div className="overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-4 w-max">
            {teamMembers.map((member, i) => (
              <motion.div 
                key={member.id} 
                custom={i} 
                variants={fadeUp} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, margin: "-20px" }} 
                className="glass-card p-6 flex flex-col items-center text-center flex-shrink-0 w-52 sm:w-60"
                style={{ transform: "translateZ(0)" }} // Aceleración por hardware
              >
                <div className="w-28 h-28 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${member.color}15, ${member.color}05)`, border: `1px solid ${member.color}30` }}>
                  <img src={member.image} alt={member.name} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: member.color }}>{member.name}</h3>
                <div className="flex flex-col gap-0.5">
                  {Array.isArray(member.cargo) ? member.cargo.map((role, idx) => (<p key={idx} className="text-[10px] text-white/40">{role}</p>)) : (<p className="text-[10px] text-white/40">{member.cargo}</p>)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080818] text-white overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-[80vh] flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={BG_URL} alt="" loading="eager" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080818]/80 via-transparent to-[#080818]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }} 
              className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-4" 
              style={{ fontFamily: "'Space Grotesk', sans-serif", transform: "translateZ(0)" }}
            >
              Crea tu propia <br />
              <span className="brand-gradient-text">Novela Visual</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.1 }} 
              className="text-base sm:text-lg text-white/60 mb-8 max-w-xl leading-relaxed"
              style={{ transform: "translateZ(0)" }}
            >
              Únete a la comunidad más grande de creadores de novelas visuales en español. Aprende Ren'Py, comparte tus proyectos y colabora con otros artistas.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.2 }} 
              className="flex flex-wrap gap-4"
              style={{ transform: "translateZ(0)" }}
            >
              <Link href="/proyectos" className="btn-primary text-base px-8 py-3">Ver Proyectos <ArrowRight size={18} /></Link>
              <Link href="/cursos" className="btn-outline text-base px-8 py-3">Aprender Ren'Py</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-8 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCounter value={1500} label="Miembros" icon={Users} color="#FF2D78" suffix="+" />
            <StatCounter value={120} label="Proyectos" icon={Gamepad2} color="#4D9FFF" />
            <StatCounter value={45} label="Cursos" icon={BookOpen} color="#a855f7" />
            <StatCounter value={50000} label="Descargas" icon={Download} color="#22c55e" suffix="+" />
          </div>
        </div>
      </section>

      {/* ── ABOUT (Optimized: No Mascot, Less Space, Restored Animations) ── */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, margin: "-50px" }} 
              transition={{ duration: 0.5 }}
              style={{ transform: "translateZ(0)" }}
            >
              <span className="text-[#FF2D78] text-xs font-semibold uppercase tracking-widest mb-3 block">Sobre el Club</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Impulsando la creatividad en <span className="brand-gradient-text">Español</span></h2>
              <p className="text-white/50 text-base mb-8 leading-relaxed max-w-2xl mx-auto">
                The Encoders Club nació con la misión de centralizar y potenciar el desarrollo de novelas visuales en el mundo hispanohablante. Proporcionamos las herramientas, el conocimiento y la plataforma necesaria para que cualquier persona pueda contar su historia.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {[
                  { icon: Sparkles, text: "Comunidad activa" },
                  { icon: Star, text: "Recursos Ren'Py" },
                  { icon: Eye, text: "Visibilidad total" }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5"
                  >
                    <item.icon size={16} className="text-[#4D9FFF]" />
                    <span className="text-white/70 text-xs font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── NEWS ── */}
      <section className="py-16 lg:py-24 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[#4D9FFF] text-xs font-semibold uppercase tracking-widest mb-2 block">Novedades</span>
              <h2 className="text-3xl font-bold text-white">Últimas <span className="brand-gradient-text">Noticias</span></h2>
            </div>
            <Link href="/noticias" className="text-white/40 hover:text-[#FF2D78] transition-colors flex items-center gap-1 text-xs font-medium">Ver todas <ChevronRight size={14} /></Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {newsItems.map((item, i) => (
              <motion.div 
                key={item.id} 
                custom={i} 
                variants={fadeUp} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, margin: "-20px" }} 
                className="glass-card group overflow-hidden flex flex-col h-full"
                style={{ transform: "translateZ(0)" }}
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={item.image} alt={item.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3"><span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md text-white" style={{ backgroundColor: item.tagColor }}>{item.tag}</span></div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-[10px] text-white/30 mb-1">{item.date}</span>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#FF2D78] transition-colors line-clamp-2">{item.title}</h3>
                  <p className="text-xs text-white/40 line-clamp-2 mb-4">{item.description}</p>
                  <Link href={`/noticias/${item.id}`} className="mt-auto text-xs font-bold text-[#4D9FFF] flex items-center gap-1">Leer más <ArrowRight size={12} /></Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <TeamCarousel />

      {/* ── CTA ── */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="glass-card p-8 lg:p-12 relative overflow-hidden"
            style={{ transform: "translateZ(0)" }}
          >
            <div className="absolute top-0 left-0 w-full h-1 brand-gradient" />
            <div className="relative z-10">
              <span className="text-[#FF2D78] text-xs font-semibold uppercase tracking-widest mb-3 block">Únete a nosotros</span>
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>¿Listo para crear tu <span className="brand-gradient-text">novela visual?</span></h2>
              <p className="text-white/50 text-sm mb-6 max-w-lg mx-auto leading-relaxed">Únete a nuestra comunidad, aprende con nuestros cursos y comparte tus proyectos con cientos de creadores.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <a href="https://discord.gg/2DB5k7sb8" target="_blank" rel="noopener noreferrer" className="btn-primary text-sm px-6 py-2.5">Unirse al Discord <ArrowRight size={16} /></a>
                <Link href="/cursos" className="btn-outline text-sm px-6 py-2.5">Empezar a Aprender</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
