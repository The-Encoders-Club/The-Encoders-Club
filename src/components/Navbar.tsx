'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Youtube, MessageCircle, Heart, Send, User, LogOut, Bell, Shield, Settings, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthModal } from "./AuthModal";
import { RecoveryModal } from "./RecoveryModal";
import { NotificationDropdown } from "./NotificationDropdown";
import { useI18n } from "@/hooks/useLocale";

interface UserSession {
  id: string;
  nickname: string;
  avatar: string | null;
  role: string;
  isPremium: boolean;
}

export default function Navbar() {
  const pathname = usePathname();
  const { locale, t, toggleLocale } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [showAuth, setShowAuth] = useState<'login' | 'register' | null>(null);
  const [showRecovery, setShowRecovery] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    fetch('/api/auth/session').then(r => r.json()).then(data => {
      if (data.user) setUser(data.user);
      setMenuOpen(false);
    }).catch(() => {
      setMenuOpen(false);
    });
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setShowUserMenu(false);
  };

  const navLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.projects'), href: '/proyectos' },
    { label: t('nav.courses'), href: '/cursos' },
    { label: t('nav.news'), href: '/noticias' },
    { label: t('nav.donate'), href: '/donar' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-11 bg-[#080812]/95 backdrop-blur-md border-b border-[#FF2D78]/20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">

          {/* ── Logo + nombre ── */}
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt="The Encoders Club"
              className="h-6 w-6 object-contain"
            />
            <span className="font-cyber text-xs font-extrabold tracking-tight uppercase text-white group-hover:text-[#00F2FE] transition-colors duration-300">
              THE ENCODERS <span className="text-[#FF2D78]">CLUB</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`font-code text-[11px] tracking-wide transition-all duration-300 ${
                  pathname === link.href
                    ? 'text-[#00F2FE] drop-shadow-[0_0_6px_rgba(0,242,254,0.4)]'
                    : 'text-neutral-500 hover:text-[#00F2FE]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLocale}
              className="p-1.5 font-code text-[10px] text-neutral-500 hover:text-[#00F2FE] transition-all flex items-center gap-1 uppercase"
              title={locale === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            >
              <Globe size={12} />
              <span>{locale.toUpperCase()}</span>
            </button>

            <div className="flex items-center gap-1 mr-1">
              <a href="https://discord.gg/2DB5k7sb8" target="_blank" rel="noopener noreferrer" className="p-1.5 text-neutral-500 hover:text-[#5865F2] transition-all"><MessageCircle size={14} /></a>
              <a href="https://youtube.com/@theencodersclub" target="_blank" rel="noopener noreferrer" className="p-1.5 text-neutral-500 hover:text-red-500 transition-all"><Youtube size={14} /></a>
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-1.5 text-neutral-500 hover:text-white transition-all">
                  <Bell size={14} />
                </button>
                <div className="relative">
                  <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 hover:border-[#00F2FE]/40 transition-all">
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#FF2D78] to-[#9d4edd] flex items-center justify-center">
                        <User size={10} className="text-white" />
                      </div>
                    )}
                    <span className="font-code text-[10px] text-neutral-400 max-w-[60px] truncate">{user.nickname}</span>
                    {user.isPremium && <span className="text-yellow-400 text-[8px]">★</span>}
                    {user.role !== 'user' && user.role !== 'owner' && (
                      <span className={`font-code text-[8px] px-1 py-0.5 ${
                        user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                        user.role === 'moderator' ? 'bg-[#00F2FE]/20 text-[#00F2FE]' :
                        'bg-green-500/20 text-green-400'
                      }`}>{user.role}</span>
                    )}
                  </button>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-[#080812] border border-[#FF2D78]/20 overflow-hidden shadow-2xl z-50">
                        <Link href="/perfil" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-3 py-2.5 font-code text-[11px] text-neutral-400 hover:text-white hover:bg-white/5 transition-all">
                          <User size={12} /> {t('profile.title')}
                        </Link>
                        {['moderator', 'admin', 'owner'].includes(user.role) && (
                          <Link href="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-3 py-2.5 font-code text-[11px] text-neutral-400 hover:text-white hover:bg-white/5 transition-all">
                            <Shield size={12} /> {t('admin.title')}
                          </Link>
                        )}
                        <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2.5 font-code text-[11px] text-red-400 hover:bg-red-500/10 transition-all w-full text-left">
                          <LogOut size={12} /> {t('auth.logout')}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAuth('login')} className="clip-btn px-4 py-1 bg-[#FF2D78] text-black font-cyber font-black text-[11px] uppercase tracking-wide hover:shadow-[0_0_15px_rgba(255,45,120,0.5)] transition-all duration-300 flex items-center gap-1.5">
                {t('auth.login')} <Send size={10} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleLocale}
              className="p-1.5 font-code text-[10px] text-neutral-500 hover:text-[#00F2FE] transition-all flex items-center gap-1 uppercase"
            >
              <Globe size={14} />
              <span>{locale.toUpperCase()}</span>
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 text-neutral-400 hover:text-white transition-all" aria-label="Menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
            <div className="absolute top-0 right-0 h-full w-72 bg-[#080812] border-l border-[#FF2D78]/15 shadow-2xl flex flex-col p-6 pt-20">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}
                    className={`px-4 py-3 font-code text-xs transition-all ${
                      pathname === link.href ? 'text-[#00F2FE] bg-[#00F2FE]/5 border-l-2 border-[#00F2FE]' : 'text-neutral-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto space-y-3">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <Link href="/perfil" className="w-full py-2.5 font-code text-xs text-neutral-400 text-center border border-white/10 hover:border-[#00F2FE]/40 transition-all flex items-center justify-center gap-2">
                      <User size={12} /> {t('profile.title')}
                    </Link>
                    {['moderator', 'admin', 'owner'].includes(user.role) && (
                      <Link href="/admin" onClick={() => setMenuOpen(false)} className="w-full py-2.5 font-code text-xs text-neutral-400 text-center border border-[#FF2D78]/30 hover:border-[#FF2D78]/60 transition-all flex items-center justify-center gap-2">
                        <Shield size={12} /> {t('admin.title')}
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full py-2.5 font-code text-xs text-red-400 text-center border border-red-500/30 flex items-center justify-center gap-2">
                      <LogOut size={12} /> {t('auth.logout')}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => { setShowAuth('login'); setShowRecovery(false); setMenuOpen(false); }} className="w-full py-3 clip-btn bg-[#FF2D78] text-black font-cyber font-black text-sm text-center">
                    {t('auth.login')}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      {showAuth && <AuthModal mode={showAuth} onClose={() => setShowAuth(null)} onSwitch={(mode) => setShowAuth(mode)} onForgotPassword={() => { setShowAuth(null); setShowRecovery(true); }} onSuccess={() => { fetch('/api/auth/session').then(r => r.json()).then(data => { if (data.user) setUser(data.user); }); setShowAuth(null); }} />}

      {/* Recovery Modal */}
      {showRecovery && <RecoveryModal onClose={() => setShowRecovery(false)} onBackToLogin={() => { setShowRecovery(false); setShowAuth('login'); }} />}

      {/* Notifications */}
      {showNotifs && user && <NotificationDropdown onClose={() => setShowNotifs(false)} />}

      {/* Click outside to close menus */}
      {(showUserMenu || showNotifs) && <div className="fixed inset-0 z-30" onClick={() => { setShowUserMenu(false); setShowNotifs(false); }} />}
    </>
  );
}
