'use client';

import Link from "next/link";
import { Youtube, MessageCircle, Heart, Code2 } from "lucide-react";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Cursos", href: "/cursos" },
  { label: "Noticias", href: "/noticias" },
];

const communityLinks = [
  { label: "Discord", href: "https://discord.gg/2DB5k7sb8" },
  { label: "YouTube", href: "https://youtube.com/@theencodersclub" },
  { label: "Ko-fi", href: "https://ko-fi.com/theencodersclub" },
];

const toolLinks = [
  { label: "Ren'Py Engine", href: "https://www.renpy.org/" },
  { label: "Documentación", href: "https://www.renpy.org/doc/html/" },
  { label: "Tutoriales", href: "/cursos" },
];

export default function Footer() {
  return (
    <>
      {/* ═══ CTA Section - ¿Te unes a la partida? ═══ */}
      <section className="py-20 relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[#FF2D78]/5 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase mb-5 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500"
            style={{ fontFamily: "'Oxanium', sans-serif" }}>
            ¿TE UNES A LA <span className="text-[#FF2D78]" style={{ WebkitTextFillColor: '#FF2D78' }}>PARTIDA?</span>
          </h2>
          <p className="text-slate-400 font-medium text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Entra a nuestro cuartel general en Discord. No importa si eres un programador experto en Python o si solo vienes a aprender cómo se traduce tu juego favorito.
          </p>
          <a href="https://discord.gg/2DB5k7sb8" target="_blank" rel="noopener noreferrer"
            className="clip-btn bg-[#00F2FE] hover:bg-white text-black font-black uppercase tracking-wider px-10 py-5 transition-all duration-200 text-center text-lg inline-block"
            style={{ fontFamily: "'Oxanium', sans-serif" }}
          >
            [ CONECTAR_AHORA ]
          </a>
        </div>
      </section>

      {/* ═══ Terminal Footer ═══ */}
      <footer className="w-full bg-[#050510] border-t border-[#FF2D78]/10">
        {/* Línea gradiente superior */}
        <div className="h-px w-full brand-gradient opacity-40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                <span className="font-bold text-white text-sm" style={{ fontFamily: "'Oxanium', sans-serif" }}>THE ENCODERS CLUB</span>
              </div>
              <p className="text-xs text-white/40 leading-relaxed mb-5">Comunidad dedicada a la traducción y desarrollo de novelas visuales con Ren'Py en español.</p>
              <div className="flex items-center gap-2">
                <a href="https://youtube.com/@theencodersclub" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded bg-white/5 border border-white/8 text-white/40 hover:text-red-500 hover:border-red-500/30 transition-all"><Youtube size={14} /></a>
                <a href="https://discord.gg/2DB5k7sb8" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded bg-white/5 border border-white/8 text-white/40 hover:text-[#5865F2] hover:border-[#5865F2]/30 transition-all"><MessageCircle size={14} /></a>
                <a href="https://ko-fi.com/theencodersclub" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded bg-white/5 border border-white/8 text-white/40 hover:text-[#FF2D78] hover:border-[#FF2D78]/30 transition-all"><Heart size={14} /></a>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-[#00F2FE]/60 uppercase tracking-widest mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>NAVIGATION</h4>
              <ul className="space-y-2">
                {navLinks.map(link => (
                  <li key={link.href}><Link href={link.href} className="text-xs text-white/40 hover:text-[#FF2D78] transition-colors">{link.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-[#FF2D78]/60 uppercase tracking-widest mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>COMMUNITY</h4>
              <ul className="space-y-2">
                {communityLinks.map(link => (
                  <li key={link.label}><a href={link.href} target="_blank" rel="noopener noreferrer" className="text-xs text-white/40 hover:text-[#FF2D78] transition-colors">{link.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-[#9d4edd]/60 uppercase tracking-widest mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>TOOLS</h4>
              <ul className="space-y-2">
                {toolLinks.map(link => (
                  <li key={link.label}><a href={link.href} target={link.href.startsWith('/') ? undefined : '_blank'} rel="noopener noreferrer" className="text-xs text-white/40 hover:text-[#00F2FE] transition-colors">{link.label}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Bottom terminal bar */}
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00F2FE]/15 to-transparent" />
          <div className="h-10 flex items-center justify-between px-6 text-[10px] text-neutral-600" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2D78] animate-flicker"></span>
              <span>&copy; 2026 ENCODERS_REPOS. ALL ASSETS MOUNTED COMPLIANT.</span>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <span>UTF-8 // Ren'Py 8.3 // Python 3.9+</span>
              <span className="text-neutral-700">|</span>
              <span className="text-[#9d4edd]/50">BUILD: STABLE</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
