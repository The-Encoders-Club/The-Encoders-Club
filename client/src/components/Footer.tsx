/* ============================================================
   FOOTER — The Encoders Club
   Style: Neon Synthwave Gaming — dark, brand gradient divider
   ============================================================ */
import { Link } from "wouter";
import { Youtube, MessageCircle, Heart, Code2 } from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663516100892/kzug5rLPLvVJzu5QVE66vY/logo_435f8d5a.png";

const socialLinks = {
  youtube: "https://youtube.com/@theencodersclub",
  discord: "https://discord.gg/2DB5k7sb8",
  kofi: "https://ko-fi.com/theencodersclub",
};

export default function Footer() {
  return (
    <footer className="relative mt-24 bg-[#06060f] border-t border-white/8">
      {/* Brand gradient top line */}
      <div className="h-px w-full brand-gradient opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={LOGO_URL} alt="Logo" className="w-10 h-10 object-contain rounded-full" />
              <span className="font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                The Encoders Club
              </span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-5">
              Comunidad dedicada a crear y compartir novelas visuales con Ren'Py en español. Aprende, crea y colabora.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/6 border border-white/10 text-white/60 hover:text-red-500 hover:border-red-500/40 hover:bg-red-500/10 transition-all"
                title="YouTube"
              >
                <Youtube size={16} />
              </a>
              <a
                href={socialLinks.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/6 border border-white/10 text-white/60 hover:text-[#5865F2] hover:border-[#5865F2]/40 hover:bg-[#5865F2]/10 transition-all"
                title="Discord"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href={socialLinks.kofi}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/6 border border-white/10 text-white/60 hover:text-[#FF2D78] hover:border-[#FF2D78]/40 hover:bg-[#FF2D78]/10 transition-all"
                title="Ko-fi"
              >
                <Heart size={16} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Navegación
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Inicio", href: "/" },
                { label: "Proyectos", href: "/proyectos" },
                { label: "Cursos", href: "/cursos" },
                { label: "Noticias", href: "/noticias" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-[#FF2D78] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Comunidad
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Discord", href: socialLinks.discord, external: true },
                { label: "YouTube", href: socialLinks.youtube, external: true },
                { label: "Ko-fi / Donaciones", href: socialLinks.kofi, external: true },
                { label: "Donar", href: "/donar", external: false },
              ].map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/50 hover:text-[#FF2D78] transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-sm text-white/50 hover:text-[#FF2D78] transition-colors">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Ren'Py */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Herramientas
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Ren'Py Engine", href: "https://www.renpy.org/", external: true },
                { label: "Documentación", href: "https://www.renpy.org/doc/html/", external: true },
                { label: "Tutoriales", href: "/cursos", external: false },
              ].map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/50 hover:text-[#4D9FFF] transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-sm text-white/50 hover:text-[#4D9FFF] transition-colors">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/35 flex items-center gap-1.5">
            <Code2 size={12} />
            © 2026 The Encoders Club. Todos los derechos reservados.
          </p>
          <p className="text-xs text-white/25">
            Hecho con ❤️ para la comunidad hispanohablante de Ren'Py
          </p>
        </div>
      </div>
    </footer>
  );
}
