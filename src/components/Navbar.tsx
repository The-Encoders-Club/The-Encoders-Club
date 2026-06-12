'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Youtube, MessageCircle, Heart, Send, User, LogOut, Bell, Shield, Globe, Crosshair } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LOGO_URL = "/logo.png";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    fetch('/api/auth/session').then(r => r.json()).then(data => {
      if (data.user) setUser(data.user);
      setMenuOpen(false);
    }).catch(() => { setMenuOpen(false); });
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setShowUserMenu(false);
  };

  const navLinks = [
    { label: 'Inicio', href: '/' },
    { label: 'Proyectos', href: '/proyectos' },
    { label: 'Cursos', href: '/cursos' },
    { label: 'Noticias', href: '/noticias' },
    { label: 'Donar', href: '/donar' },
  ];

  return (
    <>
      {/* ═══ Cyberpunk/IDE Top Bar ═══ */}
      <header className="fixed top-0 left-0 right-0 z-50 h-12 border-b border-[#FF2D78]/20 bg-[#080812]/95 backdrop-blur-md flex items-center justify-between px-4 select-none">
        {/* Línea gradiente inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF2D78]/30 to-transparent" />
        
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2D78] opacity-40"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF2D78]"></span>
            </span>
            <span className="font-bold text-xs tracking-tight uppercase text-white" style={{ fontFamily: "'Oxanium', sans-serif" }}>
              THE_ENCODERS_CLUB
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-4 text-[11px] font-mono text-neutral-500">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`transition-colors ${
                  pathname === link.href ? 'text-[#00F2FE]' : 'hover:text-[#00F2FE]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <div className="hidden md:flex items-center gap-1 mr-1">
            <a href="https://discord.gg/2DB5k7sb8" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded text-white/40 hover:text-[#5865F2] transition-colors"><MessageCircle size={16} /></a>
            <a href="https://youtube.com/@theencodersclub" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded text-white/40 hover:text-red-500 transition-colors"><Youtube size={16} /></a>
          </div>
          <span className="text-neutral-500 hidden sm:inline">STATUS:</span>
          <span className="text-[#00F2FE] bg-[#00F2FE]/10 px-2 py-0.5 border border-[#00F2FE]/20 animate-flicker">ONLINE // 2026</span>
          
          {user ? (
            <div className="flex items-center gap-2 ml-2">
              <button onClick={() => setShowNotifs(!showNotifs)} className="p-1.5 rounded text-white/40 hover:text-white transition-colors relative">
                <Bell size={16} />
              </button>
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#FF2D78] to-[#9d4edd] flex items-center justify-center">
                      <User size={12} className="text-white" />
                    </div>
                  )}
                  <span className="text-[11px] font-semibold text-white max-w-[60px] truncate">{user.nickname}</span>
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-[#080812] border border-[#FF2D78]/15 rounded-lg overflow-hidden shadow-2xl z-50">
                      <Link href="/perfil" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-3 py-2.5 text-xs text-white/70 hover:bg-white/5 hover:text-white transition-all">
                        <User size={14} /> Perfil
                      </Link>
                      {['moderator', 'admin', 'owner'].includes(user.role) && (
                        <Link href="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-3 py-2.5 text-xs text-white/70 hover:bg-white/5 hover:text-white transition-all">
                          <Shield size={14} /> Admin
                        </Link>
                      )}
                      <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-all w-full text-left">
                        <LogOut size={14} /> Cerrar sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <a href="https://discord.gg/2DB5k7sb8" target="_blank" rel="noopener noreferrer"
              className="clip-btn bg-[#FF2D78] hover:bg-white text-black font-bold text-[10px] uppercase px-4 py-1.5 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-1.5 ml-2"
              style={{ fontFamily: "'Oxanium', sans-serif" }}
            >
              <Crosshair size={12} /> DISCORD
            </a>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 rounded text-white/80 hover:text-white transition-all">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
            <div className="absolute top-0 right-0 h-full w-72 bg-[#030308] border-l border-[#FF2D78]/15 shadow-2xl flex flex-col p-6 pt-20">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}
                    className={`px-4 py-3 text-sm font-semibold transition-all ${
                      pathname === link.href ? 'text-[#00F2FE] bg-[#00F2FE]/10 border-l-2 border-[#00F2FE]' : 'text-white/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                    }`}
                    style={{ fontFamily: "'Oxanium', sans-serif" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto">
                <a href="https://discord.gg/2DB5k7sb8" target="_blank" rel="noopener noreferrer"
                  className="clip-btn bg-[#FF2D78] hover:bg-white text-black font-bold text-sm uppercase px-6 py-3 transition-all w-full text-center block"
                  style={{ fontFamily: "'Oxanium', sans-serif" }}
                >
                  UNIRSE AL DISCORD
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close menus */}
      {(showUserMenu || showNotifs) && <div className="fixed inset-0 z-30" onClick={() => { setShowUserMenu(false); setShowNotifs(false); }} />}
    </>
  );
}
