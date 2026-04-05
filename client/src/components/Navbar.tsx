/* ============================================================
   NAVBAR — The Encoders Club
   Style: Neon Synthwave Gaming — glassmorphism, sticky, mobile hamburger
   Improvements: Ren'Py logo first, web logo, 3D gradient title, gradient background
   ============================================================ */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Youtube, MessageCircle } from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663516100892/kzug5rLPLvVJzu5QVE66vY/logo_435f8d5a.png";
const RENPY_LOGO = "https://www.renpy.org/dl/8.1.3/renpy-8.1.3-sdk/doc/_static/logo.png";
const WEB_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663516100892/kzug5rLPLvVJzu5QVE66vY/logo_435f8d5a.png";

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-gradient-to-b from-[#080818]/95 via-[#0d0d24]/90 to-[#080818]/85 backdrop-blur-xl border-b border-white/8 shadow-lg shadow-black/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo Section: Ren'Py first, then Web Logo, then Title with 3D effect */}
            <Link href="/" className="flex items-center gap-2 md:gap-3 group">
              {/* Ren'Py Logo */}
              <img
                src={RENPY_LOGO}
                alt="Ren'Py"
                className="w-8 h-8 md:w-10 md:h-10 object-contain transition-transform duration-300 group-hover:scale-110"
              />
              
              {/* Web Logo */}
              <img
                src={WEB_LOGO}
                alt="The Encoders Club"
                className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-full transition-transform duration-300 group-hover:scale-110 ring-2 ring-[#FF2D78]/50"
              />
              
              {/* Title with 3D Gradient Effect */}
              <div className="hidden sm:flex flex-col">
                <span
                  className="font-bold text-base md:text-lg text-white leading-tight"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    background: 'linear-gradient(135deg, #FF2D78 0%, #4D9FFF 50%, #a855f7 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 4px 8px rgba(255, 45, 120, 0.3), 0 2px 4px rgba(77, 159, 255, 0.2)',
                    filter: 'drop-shadow(0 2px 4px rgba(255, 45, 120, 0.2))',
                  }}
                >
                  The Encoders
                </span>
                <span
                  className="font-bold text-base md:text-lg leading-tight"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    background: 'linear-gradient(135deg, #4D9FFF 0%, #a855f7 50%, #FF2D78 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 4px 8px rgba(77, 159, 255, 0.3), 0 2px 4px rgba(168, 85, 247, 0.2)',
                    filter: 'drop-shadow(0 2px 4px rgba(77, 159, 255, 0.2))',
                  }}
                >
                  Club
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2 lg:gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    location === link.href
                      ? "bg-gradient-to-r from-[#FF2D78] to-[#FF2D78]/80 text-white shadow-lg shadow-[#FF2D78]/50"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA + Social */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href={socialLinks.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-white/60 hover:text-[#5865F2] hover:bg-white/8 transition-all"
                title="Discord"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-white/60 hover:text-red-500 hover:bg-white/8 transition-all"
                title="YouTube"
              >
                <Youtube size={18} />
              </a>
              <a
                href={socialLinks.kofi}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#FF2D78] to-[#e0195e] text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-[#FF2D78]/50"
              >
                Únete
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-all"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden pb-4 space-y-2 border-t border-white/10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    location === link.href
                      ? "bg-gradient-to-r from-[#FF2D78] to-[#FF2D78]/80 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 px-4 py-2">
                <a
                  href={socialLinks.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full text-white/60 hover:text-[#5865F2] hover:bg-white/8 transition-all"
                >
                  <MessageCircle size={18} />
                </a>
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full text-white/60 hover:text-red-500 hover:bg-white/8 transition-all"
                >
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
