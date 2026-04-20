import Link from "next/link";
import { Youtube, MessageCircle, Heart, Code2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-24 bg-[#06060f] border-t border-white/8">
      <div className="h-px w-full brand-gradient opacity-60" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain rounded-full" />
              <span className="font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>The Encoders Club</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-5">Comunidad dedicada a crear y compartir novelas visuales con Ren&apos;Py en español.</p>
            <div className="flex items-center gap-3">
              <a href="https://youtube.com/@theencodersclub" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/6 border border-white/10 text-white/60 hover:text-red-500 hover:border-red-500/40 transition-all"><Youtube size={16} /></a>
              <a href="https://discord.gg/2DB5k7sb8" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/6 border border-white/10 text-white/60 hover:text-[#5865F2] hover:border-[#5865F2]/40 transition-all"><MessageCircle size={16} /></a>
              <a href="https://ko-fi.com/theencodersclub" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/6 border border-white/10 text-white/60 hover:text-[#FF2D78] hover:border-[#FF2D78]/40 transition-all"><Heart size={16} /></a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Navegación</h4>
            <ul className="space-y-2.5">
              {[{ l: "Inicio", h: "/" }, { l: "Proyectos", h: "/proyectos" }, { l: "Cursos", h: "/cursos" }, { l: "Noticias", h: "/noticias" }].map(link => (
                <li key={link.h}><Link href={link.h} className="text-sm text-white/50 hover:text-[#FF2D78] transition-colors">{link.l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Comunidad</h4>
            <ul className="space-y-2.5">
              {[{ l: "Discord", h: "https://discord.gg/2DB5k7sb8" }, { l: "YouTube", h: "https://youtube.com/@theencodersclub" }, { l: "Ko-fi", h: "https://ko-fi.com/theencodersclub" }].map(link => (
                <li key={link.l}><a href={link.h} target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-[#FF2D78] transition-colors">{link.l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Herramientas</h4>
            <ul className="space-y-2.5">
              {[{ l: "Ren'Py Engine", h: "https://www.renpy.org/" }, { l: "Documentación", h: "https://www.renpy.org/doc/html/" }, { l: "Tutoriales", h: "/cursos" }].map(link => (
                <li key={link.l}><a href={link.h} target={link.h.startsWith('/') ? undefined : '_blank'} rel="noopener noreferrer" className="text-sm text-white/50 hover:text-[#4D9FFF] transition-colors">{link.l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/8 flex flex-col items-center sm:flex-row sm:justify-between gap-4">
          <p className="text-xs text-white/35 flex items-center gap-1.5"><Code2 size={12} /> © 2026 The Encoders Club. Todos los derechos reservados.</p>
          <p className="text-xs text-white/25">Hecho con ❤️ para la comunidad hispanohablante de Ren&apos;Py</p>
        </div>
      </div>
    </footer>
  );
}
