'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Youtube, MessageCircle, Heart, Send, User, LogOut, Bell, Shield, Settings, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthModal } from "./AuthModal";
import { NotificationDropdown } from "./NotificationDropdown";
import { useI18n } from "@/hooks/useLocale";

interface UserSession {
  id: string;
  nickname: string;
  avatar: string | null;
  role: string;
  isPremium: boolean;
}

const LOGO_URL = "/logo.png";

export default function Navbar() {
  const pathname = usePathname();
  const { locale, t, toggleLocale } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [showAuth, setShowAuth] = useState<'login' | 'register' | null>(null);
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
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-3 bg-gradient-to-b from-[#080818]/95 via-[#080818]/80 to-transparent backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-[#FF2D78]/20 blur-xl rounded-full group-hover:bg-[#FF2D78]/40 transition-all duration-500" />
                <img src={LOGO_URL} alt="The Encoders Club" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain relative z-10 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <span className="font-bold text-sm sm:text-base md:text-xl tracking-tighter group-hover:text-[#FF2D78] transition-colors duration-300 block" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                THE ENCODERS <span className="text-[#FF2D78] drop-shadow-[0_0_8px_rgba(255,45,120,0.5)]">CLUB</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-3 lg:gap-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className={`relative px-5 py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 ${
                    pathname === link.href
                      ? 'bg-gradient-to-r from-[#FF2D78] to-[#FF2D78]/60 text-white shadow-[0_0_20px_rgba(255,45,120,0.5)]'
                      : 'text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {/* Language Toggle */}
              <button
                onClick={toggleLocale}
                className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/8 transition-all hover:scale-110 flex items-center gap-1 text-xs font-bold uppercase"
                title={locale === 'es' ? 'Switch to English' : 'Cambiar a Español'}
              >
                <Globe size={16} />
                <span className="hidden lg:inline">{locale === 'es' ? 'EN' : 'ES'}</span>
              </button>

              <div className="flex items-center gap-1 mr-1">
                <a href="https://discord.gg/2DB5k7sb8" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full text-white/60 hover:text-[#5865F2] hover:bg-white/8 transition-all hover:scale-110"><MessageCircle size={18} /></a>
                <a href="https://youtube.com/@theencodersclub" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full text-white/60 hover:text-red-500 hover:bg-white/8 transition-all hover:scale-110"><Youtube size={18} /></a>
              </div>

              {user ? (
                <div className="flex items-center gap-2">
                  {/* Notifications */}
                  <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all">
                    <Bell size={18} />
                  </button>
                  
                  {/* User Menu */}
                  <div className="relative">
                    <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#FF2D78] to-[#a855f7] flex items-center justify-center">
                          <User size={14} className="text-white" />
                        </div>
                      )}
                      <span className="text-sm font-semibold text-white max-w-[80px] truncate">{user.nickname}</span>
                      {user.isPremium && <span className="text-yellow-400 text-xs">★</span>}
                      {user.role !== 'user' && user.role !== 'owner' && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                          user.role === 'moderator' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>{user.role}</span>
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                          className="absolute right-0 top-full mt-2 w-56 bg-[#0d0d24] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
                          <Link href="/perfil" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-all">
                            <User size={16} /> {t('profile.title')}
                          </Link>
                          {['moderator', 'admin', 'owner'].includes(user.role) && (
                            <Link href="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-all">
                              <Shield size={16} /> {t('admin.title')}
                            </Link>
                          )}
                          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-all w-full text-left">
                            <LogOut size={16} /> {t('auth.logout')}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowAuth('login')} className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF2D78] via-[#a855f7] to-[#4D9FFF] text-white text-sm font-bold shadow-[0_0_20px_rgba(255,45,120,0.4)] hover:shadow-[0_0_30px_rgba(255,45,120,0.6)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2">
                  {t('auth.login')} <Send size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={toggleLocale}
                className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/8 transition-all"
              >
                <Globe size={18} />
              </button>
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all" aria-label="Menu">
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
            <div className="absolute top-0 right-0 h-full w-72 bg-[#080818] border-l border-white/10 shadow-2xl flex flex-col p-6 pt-24">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}
                    className={`px-5 py-3.5 rounded-xl text-base font-semibold transition-all ${
                      pathname === link.href ? 'bg-gradient-to-r from-[#FF2D78] to-[#FF2D78]/60 text-white' : 'text-white/70 bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto space-y-4">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <Link href="/perfil" className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center font-semibold flex items-center justify-center gap-2">
                      <User size={16} /> {t('profile.title')}
                    </Link>
                    {['moderator', 'admin', 'owner'].includes(user.role) && (
                      <Link href="/admin" onClick={() => setMenuOpen(false)} className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500/20 to-purple-500/20 border border-red-500/30 text-white text-center font-semibold flex items-center justify-center gap-2">
                        <Shield size={16} /> {t('admin.title')}
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-center font-semibold flex items-center justify-center gap-2">
                      <LogOut size={16} /> {t('auth.logout')}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => { setShowAuth('login'); setMenuOpen(false); }} className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF2D78] via-[#a855f7] to-[#4D9FFF] text-white font-bold text-center">
                    {t('auth.login')}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      {showAuth && <AuthModal mode={showAuth} onClose={() => setShowAuth(null)} onSwitch={(mode) => setShowAuth(mode)} onSuccess={() => { fetch('/api/auth/session').then(r => r.json()).then(data => { if (data.user) setUser(data.user); }); setShowAuth(null); }} />}

      {/* Notifications */}
      {showNotifs && user && <NotificationDropdown onClose={() => setShowNotifs(false)} />}

      {/* Click outside to close menus */}
      {(showUserMenu || showNotifs) && <div className="fixed inset-0 z-30" onClick={() => { setShowUserMenu(false); setShowNotifs(false); }} />}
    </>
  );
}
