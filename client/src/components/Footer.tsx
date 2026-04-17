import { Link } from "wouter";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "rgba(5, 5, 18, 0.95)",
        borderTop: "1px solid rgba(255, 45, 120, 0.12)",
        padding: "3rem 0 1.5rem",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "2rem",
          marginBottom: "2.5rem",
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663518113549/KEigSkzYpCzkACRU.png"
                alt="Logo"
                width={30}
                height={30}
                style={{ borderRadius: "6px", flexShrink: 0 }}
                onError={e => { e.currentTarget.style.display = "none"; }}
              />
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: "0.95rem",
                background: "linear-gradient(90deg, #FF2D78, #a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                The Encoders Club
              </span>
            </div>
            <p style={{ color: "rgba(240,240,255,0.45)", fontSize: "0.83rem", lineHeight: 1.6, maxWidth: "240px" }}>
              Comunidad hispana dedicada a la traducción y creación de novelas visuales con Ren'Py.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "#FF2D78", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Navegación
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              {[
                { href: "/", label: "Inicio" },
                { href: "/proyectos", label: "Proyectos" },
                { href: "/cursos", label: "Cursos" },
                { href: "/noticias", label: "Noticias" },
                { href: "/donar", label: "Apoyar" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  style={{ color: "rgba(240,240,255,0.5)", fontSize: "0.85rem", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#FF2D78")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,240,255,0.5)")}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Proyectos */}
          <div>
            <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "#4D9FFF", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Proyectos
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              {["Monika After History", "Just Natsuki", "Just Yuri"].map(name => (
                <Link
                  key={name}
                  href="/proyectos"
                  style={{ color: "rgba(240,240,255,0.5)", fontSize: "0.85rem", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#4D9FFF")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,240,255,0.5)")}
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>

          {/* Redes */}
          <div>
            <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "#a855f7", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Redes Sociales
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              {[
                { href: "https://discord.gg/2DB5k7sb8", label: "Discord" },
                { href: "https://www.youtube.com/@theencodersclub", label: "YouTube" },
                { href: "https://ko-fi.com/theencodersclub", label: "Ko-fi" },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "rgba(240,240,255,0.5)", fontSize: "0.85rem", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#a855f7")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,240,255,0.5)")}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: "1.25rem",
          display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "space-between",
          gap: "0.75rem",
        }}>
          <p style={{ color: "rgba(240,240,255,0.28)", fontSize: "0.78rem" }}>
            © {year} The Encoders Club. Hecho con ❤️ para la comunidad hispana.
          </p>
          <p style={{ color: "rgba(240,240,255,0.2)", fontSize: "0.72rem" }}>
            Fan site — no afiliado con Team Salvato
          </p>
        </div>
      </div>
    </footer>
  );
}
