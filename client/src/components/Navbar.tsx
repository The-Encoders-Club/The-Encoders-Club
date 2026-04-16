/* ============================================================
   NAVBAR — The Encoders Club - OPTIMIZED
   ============================================================ */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Youtube, MessageCircle, Heart, Send } from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663516100892/kzug5rLPLvVJzu5QVE66vY/logo_435f8d5a.png";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Cursos", href: "/cursos" },
  { label: "Noticias", href: "/noticias" },
  { label: "Donar", href: "/donar" },
];

const socialLinks = {
  youtube: "https://youtube.com/@theencodersclub",
  discord: "https://discord.gg/2DB5k7sb8",
  kofi: "https://ko-fi.com/theencodersclub",
};

export default function Navbar() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 py-3 bg-[#080818]/95 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between">
            {/* Logo & Brand */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src={LOGO_URL}
                  alt="The Encoders Club"
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain relative z-10"
                />
              </div>
              <span
                className="font-bold text-sm sm:text-base md:text-xl tracking-tighter block"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                THE ENCODERS <span className="text-[#FF2D78]">CLUB</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-3 lg:gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-5 py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-colors duration-200 ${
                    location === link.href
                      ? "bg-gradient-to-r from-[#FF2D78] to-[#FF2D78]/60 text-white"
                      : "text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA + Social */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-1 mr-2">
                <a
                  href={socialLinks.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full text-white/60 hover:text-[#5865F2] hover:bg-white/8 transition-colors"
                  title="Discord"
                >
                  <MessageCircle size={18} />
                </a>
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full text-white/60 hover:text-red-500 hover:bg-white/8 transition-colors"
                  title="YouTube"
                >
                  <Youtube size={18} />
                </a>
              </div>
              <Link
                href="/comunidad"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF2D78] via-[#a855f7] to-[#4D9FFF] text-white text-sm font-bold transition-transform duration-200 hover:-translate-y-0.5 flex items-center gap-2"
              >
                Únete
                <Send size={14} />
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Abrir menú"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - CSS-only animations */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setMenuOpen(false)}
          />
          {/* Drawer */}
          <div 
            className="absolute top-0 right-0 h-full w-72 bg-[#080818] border-l border-white/10 shadow-2xl flex flex-col p-6 pt-24"
            style={{
              animation: 'slideIn 0.2s ease-out'
            }}
          >
            <style>{`
              @keyframes slideIn {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
            `}</style>
            
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-5 py-3.5 rounded-xl text-base font-semibold transition-colors ${
                    location === link.href
                      ? "bg-gradient-to-r from-[#FF2D78] to-[#FF2D78]/60 text-white"
                      : "text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto space-y-6">
              <div className="flex items-center justify-around p-4 bg-white/5 rounded-2xl border border-white/5">
                <a href={socialLinks.discord} target="_blank" rel="noopener noreferrer" className="p-3 text-white/60 hover:text-[#5865F2] transition-colors"><MessageCircle size={24} /></a>
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="p-3 text-white/60 hover:text-red-500 transition-colors"><Youtube size={24} /></a>
                <a href={socialLinks.kofi} target="_blank" rel="noopener noreferrer" className="p-3 text-white/60 hover:text-[#FF2D78] transition-colors"><Heart size={24} /></a>
              </div>
              <Link
                href="/comunidad"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF2D78] via-[#a855f7] to-[#4D9FFF] text-white font-bold text-center flex items-center justify-center gap-2"
              >
                Únete al equipo
                <Send size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
