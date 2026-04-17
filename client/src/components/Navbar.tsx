import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/cursos", label: "Cursos" },
  { href: "/noticias", label: "Noticias" },
  { href: "/donar", label: "Donar" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 50,
          transition: "background 0.3s ease, box-shadow 0.3s ease",
          background: scrolled ? "rgba(8, 8, 24, 0.95)" : "transparent",
          boxShadow: scrolled
            ? "0 2px 20px rgba(0,0,0,0.5), 0 1px 0 rgba(255,45,120,0.1)"
            : "none",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
            {/* Logo */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663518113549/KEigSkzYpCzkACRU.png"
                alt="Logo"
                width={34}
                height={34}
                style={{ borderRadius: "8px", flexShrink: 0 }}
                onError={e => { e.currentTarget.style.display = "none"; }}
              />
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: "1.05rem",
                background: "linear-gradient(90deg, #FF2D78, #a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                The Encoders Club
              </span>
            </Link>

            {/* Desktop */}
            <div style={{ display: "none", alignItems: "center", gap: "2rem" }} className="md:flex">
              {LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  style={{
                    color: location === href ? "#FF2D78" : "rgba(240,240,255,0.75)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: location === href ? 600 : 500,
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    transition: "color 0.2s ease",
                    position: "relative",
                  }}
                  onMouseEnter={e => { if (location !== href) e.currentTarget.style.color = "#FF2D78"; }}
                  onMouseLeave={e => { if (location !== href) e.currentTarget.style.color = "rgba(240,240,255,0.75)"; }}
                >
                  {label}
                </Link>
              ))}
              <a
                href="https://discord.gg/2DB5k7sb8"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "linear-gradient(135deg, #FF2D78, #a855f7)",
                  color: "white",
                  padding: "0.45rem 1.2rem",
                  borderRadius: "9999px",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600, fontSize: "0.85rem",
                  textDecoration: "none",
                  transition: "box-shadow 0.2s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 20px rgba(255,45,120,0.5)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
              >
                Discord
              </a>
            </div>

            {/* Mobile button */}
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              style={{
                background: "none", border: "none",
                color: "rgba(240,240,255,0.85)", padding: "8px", cursor: "pointer",
              }}
              className="md:hidden flex"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: "64px", left: 0, right: 0,
            zIndex: 49,
            background: "rgba(8, 8, 24, 0.98)",
            borderBottom: "1px solid rgba(255,45,120,0.2)",
            padding: "1rem 0 1.5rem",
          }}
        >
          <div className="max-w-7xl mx-auto px-4" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  padding: "0.75rem 0",
                  color: location === href ? "#FF2D78" : "rgba(240,240,255,0.8)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: location === href ? 600 : 500,
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  fontSize: "1rem",
                }}
              >
                {label}
              </Link>
            ))}
            <a
              href="https://discord.gg/2DB5k7sb8"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: "0.5rem",
                background: "linear-gradient(135deg, #FF2D78, #a855f7)",
                color: "white", padding: "0.75rem 1.25rem",
                borderRadius: "9999px",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600, textDecoration: "none", textAlign: "center",
              }}
            >
              Unirse al Discord
            </a>
          </div>
        </div>
      )}
    </>
  );
}
