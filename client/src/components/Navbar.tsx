/* ============================================================
   NAVBAR — The Encoders Club
   Style: Neon Synthwave Gaming — glassmorphism, sticky, mobile hamburger
   Improvements: Gradient background, larger nav buttons, better styling
   ============================================================ */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Youtube, MessageCircle, Heart } from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663516100892/kzug5rLPLvVJzu5QVE66vY/logo_435f8d5a.png";
const RENPY_LOGO = "https://www.renpy.org/dl/8.1.3/renpy-8.1.3-sdk/doc/_static/logo.png";

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
            {/* Logo + Ren'Py Logo */}
            <Link href="/" className="flex items-center gap-2 md:gap-3 group">
              <img
                src={RENPY_LOGO}
                alt="Ren'Py"
                className="w-8 h-8 md:w-10 md:h-10 object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <img
                src={LOGO_URL}
                alt="The Encoders Club"
                className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-full transition-transform duration-300 group-hover:scale-110 ring-2 ring-[#FF2D78]/50"
              />
              <span
                className="font-bold text-base md:text-lg text-white hidden sm:block"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                The Encoders Club
              </span>
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
                className="btn-primary text-sm py-2 px-5"
              >
                <Heart size={15} />
                Únete
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Abrir menú"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-gradient-to-b from-[#0d0d24] to-[#080818] border-l border-white/10 shadow-2xl transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full p-6 pt-20">
            {/* Nav Links */}
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    location === link.href
                      ? "bg-gradient-to-r from-[#FF2D78] to-[#FF2D78]/80 text-white border border-[#FF2D78]/50 shadow-lg shadow-[#FF2D78]/30"
                      : "text-white/70 hover:text-white hover:bg-white/8"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Divider */}
            <div className="my-6 border-t border-white/10" />

            {/* Social Links */}
            <div className="flex items-center gap-3 mb-6">
              <a
                href={socialLinks.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#5865F2]/15 border border-[#5865F2]/30 text-[#5865F2] text-sm font-medium hover:bg-[#5865F2]/25 transition-all"
              >
                <MessageCircle size={16} />
                Discord
              </a>
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/25 transition-all"
              >
                <Youtube size={16} />
                YouTube
              </a>
            </div>

            <a
              href={socialLinks.kofi}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary justify-center text-sm"
            >
              <Heart size={16} />
              ¡Únete al equipo!
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
