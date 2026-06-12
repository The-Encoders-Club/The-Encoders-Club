'use client';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Download, Users, Eye, Gamepad2, ChevronRight, Crosshair, Zap, Heart, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundParticles from "@/components/BackgroundParticles";

const BG_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663516100892/kzug5rLPLvVJzu5QVE66vY/hero_bg-nZF9vsy8Qjc3eRVqRoEgy7.webp";

const teamMembers = [
  { id: 1, name: "Slytharbez", cargo: "LEADER / DEV", color: "#FF2D78", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/sYvfOcdjjpxwpsYH.jpg", desc: "Fundador del club. Desarrollo principal, traducción y moderación." },
  { id: 2, name: "The_Player_Madness", cargo: "CO-LEADER / CODE", color: "#00F2FE", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/fqvycZADioutZyXg.jpg", desc: "Co-líder. Desarrollo de herramientas y traducción de scripts." },
  { id: 3, name: "Francisco", cargo: "BETA_TESTER", color: "#9d4edd", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/NdddEeYbkRaZUwAf.jpg", desc: "Testing de compilaciones y control de calidad de traducciones." },
  { id: 4, name: "Ashi", cargo: "CREATIVE_IDEAS", color: "#22c55e", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/owXrIjTwHSFTkmKB.jpg", desc: "Dirección creativa, ideas para proyectos y diseño conceptual." },
  { id: 5, name: "mondongo8360", cargo: "TRANSLATOR", color: "#f97316", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/cCtjHYrvAzaOHjEd.jpg", desc: "Traducción de diálogos y localización de interfaces." },
  { id: 6, name: "FlagBro23", cargo: "TRANSLATOR", color: "#38bdf8", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/iecokdxZIrlMEbyP.jpg", desc: "Traducción de scripts y revisión de consistencia narrativa." },
  { id: 7, name: "Manu", cargo: "TRANSLATOR", color: "#facc15", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510027341/bIiIQjvPOSUKgAUl.jpg", desc: "Traducción y adaptación cultural de contenido." },
];

const compileLogs = [
  { title: "Nuevo Tutorial Extendido de Ren'Py", desc: "Lógica secuencial, manipulación de saltos y parseo de scripts dinámicos.", date: "01 ABR 2026", color: "#FF2D78" },
  { title: "Concurso Anual de Escritura Dinámica", desc: "Apertura de repositorios para ramas de historias interactivas.", date: "28 MAR 2026", color: "#00F2FE" },
  { title: "Webinar Avanzado: Diseño de Personajes", desc: "Optimización de hojas de sprites integrados mediante atlas de texturas.", date: "25 MAR 2026", color: "#9d4edd" },
  { title: "Actualización Crítica de DevTools Internas", desc: "Inyectores automatizados aplicados con éxito al nodo de compilación principal.", date: "20 MAR 2026", color: "#22c55e" },
];

function StatCounter({ value, label, icon: Icon, color, suffix = "" }: { value: number; label: string; icon: React.ElementType; color: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered) { setTriggered(true); }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;
    let current = 0;
    const step = value / 40;
    const interval = setInterval(() => {
      current += step;
      if (current >= value) { setCount(value); clearInterval(interval); }
      else setCount(Math.floor(current));
    }, 30);
    return () => clearInterval(interval);
  }, [triggered, value]);

  return (
    <div ref={ref} className="clip-card bg-[#0c0c22] border border-white/5 p-5 flex flex-col items-center text-center group transition-all duration-300 relative overflow-hidden" style={{ borderColor: `${color}20` }}>
      <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <span className="text-3xl sm:text-4xl font-bold mb-1" style={{ fontFamily: "'Oxanium', sans-serif", color }}>{count.toLocaleString('en-US')}{suffix}</span>
      <span className="text-[10px] text-white/40 uppercase tracking-widest font-medium">{label}</span>
    </div>
  );
}

const FALLBACK_STATS = { downloads: 15000, visits: 50000 };
const compact = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K` : n.toString();

export default function Home() {
  const [liveStats, setLiveStats] = useState<{ downloads: number; visits: number } | null>(null);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(data => {
      if (data.visits !== undefined && data.downloads !== undefined) {
        setLiveStats({ downloads: data.downloads, visits: data.visits });
      }
    }).catch(() => {});
  }, []);

  const stats = liveStats || FALLBACK_STATS;

  return (
    <div className="min-h-screen bg-[#030308] text-white overflow-x-hidden">
      <Navbar />
      <BackgroundParticles />

      {/* ═══ 1. HERO - Anime/Persona 5 + IDE ═══ */}
      <section className="relative min-h-screen flex items-center pt-16 pb-24 overflow-hidden clip-diagonal bg-[#080812] border-b-4 border-[#FF2D78]">
        <div className="absolute inset-0 z-0">
          <img src={BG_URL} alt="" className="w-full h-full object-cover opacity-15 filter grayscale contrast-200 scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080812] via-transparent to-[#080812]/70" />
        </div>

        <div className="absolute top-20 left-10 text-[#00F2FE]/25 font-bold text-[10px] tracking-widest hidden md:block select-none" style={{ fontFamily: "'Oxanium', sans-serif" }}>
          SYS.LOC_ // RE_ENGINE_ONLINE<br />STATUS: ACTIVE_CLUB
        </div>
        <div className="absolute bottom-24 right-10 text-[#FF2D78]/25 font-bold text-right text-[10px] tracking-widest hidden md:block select-none" style={{ fontFamily: "'Oxanium', sans-serif" }}>
          [VISUAL NOVEL TRANSLATION DIVISION]<br />CODE_TYPE: RENPY // PYTHON 3.9
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 border-b border-[#FF2D78]/15 pb-3 mb-6" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}>
              <span className="text-[#FF2D78] border-b border-[#FF2D78] pb-3 mb-[-13px] z-10 font-bold flex items-center gap-1.5">▶ main_quest.rpy</span>
            </div>

            <div className="inline-block bg-[#FF2D78] text-black font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 transform -rotate-1 mb-5" style={{ fontFamily: "'Oxanium', sans-serif" }}>
              // COMIENZA LA AVENTURA
            </div>

            <h1 className="text-5xl sm:text-7xl xl:text-8xl font-black tracking-tighter uppercase leading-none mb-6" style={{ fontFamily: "'Oxanium', sans-serif" }}>
              THE ENCODERS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F2FE] to-[#9d4edd]">CLUB_</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-medium max-w-xl border-l-4 border-[#00F2FE] pl-4 my-8 leading-relaxed">
              Traducción de novelas visuales, herramientas para Ren'Py y desarrollo de software libre. No solo jugamos historias: las programamos en tu idioma.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a href="https://discord.gg/2DB5k7sb8" target="_blank" rel="noopener noreferrer"
                className="clip-btn bg-[#FF2D78] hover:bg-white text-black font-black uppercase tracking-wide px-8 py-4 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-3 text-sm"
                style={{ fontFamily: "'Oxanium', sans-serif" }}
              >
                <Crosshair size={18} /> UNIRSE AL DISCORD
              </a>
              <Link href="/proyectos"
                className="clip-btn bg-transparent hover:bg-[#00F2FE]/10 text-[#00F2FE] border-2 border-[#00F2FE] font-bold uppercase tracking-wide px-8 py-4 transition-all duration-200 flex items-center gap-2 text-sm"
                style={{ fontFamily: "'Oxanium', sans-serif" }}
              >
                EXPLORAR.DAT
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-10 pt-6 border-t border-white/10" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <div className="text-center">
                <p className="text-xl font-bold text-[#FF2D78]" style={{ fontFamily: "'Oxanium', sans-serif" }}>3+</p>
                <p className="text-[10px] text-white/35 uppercase tracking-wider">Novelas</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <p className="text-xl font-bold text-[#00F2FE]" style={{ fontFamily: "'Oxanium', sans-serif" }}>{compact(stats.downloads)}+</p>
                <p className="text-[10px] text-white/35 uppercase tracking-wider">Descargas</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <p className="text-xl font-bold text-[#9d4edd]" style={{ fontFamily: "'Oxanium', sans-serif" }}>7+</p>
                <p className="text-[10px] text-white/35 uppercase tracking-wider">Miembros</p>
              </div>
            </div>
          </div>

          {/* HUD Panel */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="clip-card neon-border-magenta bg-black/60 p-6 backdrop-blur-md">
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                <span className="font-bold text-sm text-[#FF2D78]" style={{ fontFamily: "'Oxanium', sans-serif" }}>MISSION_STATUS</span>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-400">TRADUCCIÓN DE NOVELAS</span>
                    <span className="text-[#00F2FE]">85%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 overflow-hidden">
                    <div className="bg-[#00F2FE] h-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-400">HERRAMIENTAS REN'PY</span>
                    <span className="text-[#FF2D78]">99%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 overflow-hidden">
                    <div className="bg-[#FF2D78] h-full" style={{ width: '99%' }}></div>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-3 space-y-2" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}>
                  <div className="flex justify-between"><span className="text-slate-500">novelas_mod:</span> <span className="text-white">3</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">downloads:</span> <span className="text-[#00F2FE] font-bold">{compact(stats.downloads)}+</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">core_devs:</span> <span className="text-white">7</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">total_hits:</span> <span className="text-[#9d4edd] font-bold">{compact(stats.visits)}+</span></div>
                </div>
                <div className="bg-[#FF2D78]/5 border border-[#FF2D78]/15 p-2.5 text-[10px] text-slate-300">
                  <span className="text-[#FF2D78] font-bold">[ALERTA]:</span> Servidor creciendo. Se necesitan más operadores.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25" style={{ animation: 'scrollBounce 2s ease-in-out infinite' }}>
          <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/25 to-transparent" />
        </div>
      </section>

      {/* ═══ 2. ASSET PREVIEW ═══ */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-[#9d4edd] font-bold text-sm tracking-widest" style={{ fontFamily: "'Oxanium', sans-serif" }}>// RENDER_NODE</span>
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-[10px] text-neutral-600 uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>ACTIVE_BUILD</span>
        </div>
        <div className="clip-card neon-border-cyan bg-[#080812] overflow-hidden group">
          <div className="aspect-[21/9] relative overflow-hidden">
            <img src={BG_URL} alt="Monika After History" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080812] via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <div className="text-[10px] text-[#00F2FE]/50 uppercase tracking-widest mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Current Translation Project</div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase" style={{ fontFamily: "'Oxanium', sans-serif" }}>Monika After History</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-lg">Build en español activa. Traducción de diálogos, adaptación de GUI y parches de fuentes integrados.</p>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="bg-[#00F2FE] text-black font-extrabold text-[10px] px-2.5 py-1" style={{ fontFamily: "'Oxanium', sans-serif" }}>ES_BUILD</span>
                <span className="bg-[#FF2D78] text-black font-extrabold text-[10px] px-2.5 py-1" style={{ fontFamily: "'Oxanium', sans-serif" }}>v2.1.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* ═══ 3. EQUIPO Horizontal ═══ */}
      <section className="py-20 bg-[#050510]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[#FF2D78] font-bold text-sm tracking-widest block mb-2" style={{ fontFamily: "'Oxanium', sans-serif" }}>// PARTY_MEMBERS</span>
              <h2 className="section-title text-white">EL EQUIPO</h2>
            </div>
            <div className="bg-white/5 text-slate-400 px-4 py-2 text-xs tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              TOTAL_MEMBERS: <span className="text-[#00F2FE] font-bold">7_ONLINE</span>
            </div>
          </div>

          <div className="flex flex-col divide-y divide-white/5">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-[#0b0b16] hover:bg-white/[0.03] transition-all group flex items-center gap-5 py-5 px-4 border-l-4"
                style={{ borderColor: member.color }}
              >
                <div className="w-20 h-20 bg-slate-900 overflow-hidden relative shrink-0 grayscale group-hover:grayscale-0 transition-all duration-300">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold tracking-widest block mb-0.5" style={{ fontFamily: "'Oxanium', sans-serif", color: member.color }}>{member.cargo}</span>
                  <h3 className="text-xl font-bold" style={{ fontFamily: "'Oxanium', sans-serif" }}>{member.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">{member.desc}</p>
                </div>
                <ChevronRight size={16} className="text-slate-700 group-hover:text-[#FF2D78] transition-colors shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* ═══ 4. COMPILE LOGS ═══ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[#FF2D78] font-bold text-sm tracking-widest block mb-2" style={{ fontFamily: "'Oxanium', sans-serif" }}>// COMPILE_LOGS</span>
              <h2 className="section-title text-white">ACTIVIDAD RECIENTE</h2>
            </div>
            <div className="text-[10px] text-neutral-600 uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              LAST_UPDATE: <span className="text-[#00F2FE]">01_ABR_2026</span>
            </div>
          </div>

          <div className="space-y-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {compileLogs.map((log, i) => (
              <div
                key={i}
                className="clip-card p-4 bg-[#0b0b16] border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-colors hover:border-white/10"
              >
                <div className="flex items-start gap-3">
                  <span className="text-sm mt-0.5" style={{ color: i === 0 ? log.color : '#555' }}>{i === 0 ? '◆' : '◇'}</span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase" style={{ fontFamily: "'Oxanium', sans-serif" }}>{log.title}</h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{log.desc}</p>
                  </div>
                </div>
                <span className="text-[10px] shrink-0" style={{ color: i === 0 ? log.color : '#555' }}>{log.date}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* ═══ 5. ESTADÍSTICAS ═══ */}
      <section className="py-16 bg-[#050510]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCounter value={3} label="Novelas Visuales" icon={Gamepad2} color="#FF2D78" suffix="+" />
            <StatCounter value={stats.downloads} label="Descargas" icon={Download} color="#00F2FE" suffix="+" />
            <StatCounter value={7} label="Colaboradores" icon={Users} color="#9d4edd" suffix="+" />
            <StatCounter value={stats.visits} label="Visitas" icon={Eye} color="#22c55e" suffix="+" />
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* ═══ 6. EXTRAS ═══ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-[#22c55e] font-bold text-sm tracking-widest block mb-2" style={{ fontFamily: "'Oxanium', sans-serif" }}>// EXTRAS</span>
            <h2 className="section-title text-white">Más que proyectos <span className="cyan-purple-gradient-text">una comunidad</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, color: "#FF2D78", title: "Traducciones", desc: "Localizamos novelas visuales al español con la máxima calidad, manteniendo la esencia y el tono original de cada obra." },
              { icon: Heart, color: "#00F2FE", title: "Código Abierto", desc: "Todos nuestros proyectos son de código abierto. Puedes contribuir, aprender y formar parte del desarrollo activamente." },
              { icon: Globe, color: "#9d4edd", title: "Comunidad Global", desc: "Colaboramos con personas de todo el mundo. Sin importar tu nivel de experiencia, hay un lugar para ti aquí." },
            ].map((item, i) => (
              <div key={i} className="clip-card bg-[#0e0e1f] border border-white/5 p-6 group transition-all duration-300 overflow-hidden hover:border-white/10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${item.color}12`, border: `1px solid ${item.color}25` }}>
                  <item.icon size={24} style={{ color: item.color }} />
                </div>
                <h3 className="font-bold text-white mb-2 text-lg" style={{ fontFamily: "'Oxanium', sans-serif" }}>{item.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
