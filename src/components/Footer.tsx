'use client';

import Link from "next/link";
import { Youtube, MessageCircle, Heart, Code2 } from "lucide-react";
import { useI18n } from "@/hooks/useLocale";

export default function Footer() {
  const { t } = useI18n();

  const navLinks = [
    { label: t('nav.home'), href: "/" },
    { label: t('nav.projects'), href: "/proyectos" },
    { label: t('nav.courses'), href: "/cursos" },
    { label: t('nav.news'), href: "/noticias" },
  ];

  const communityLinks = [
    { label: "Discord", href: "https://discord.gg/2DB5k7sb8" },
    { label: "YouTube", href: "https://youtube.com/@theencodersclub" },
    { label: "Ko-fi", href: "https://ko-fi.com/theencodersclub" },
  ];

  const toolLinks = [
    { label: t('footer.renpyEngine'), href: "https://www.renpy.org/" },
    { label: t('footer.documentation'), href: "https://www.renpy.org/doc/html/" },
    { label: t('footer.tutorials'), href: "/cursos" },
  ];

  return (
    <footer className="relative mt-24 bg-[#080812] border-t border-[#FF2D78]/15">
      <div className="h-px w-full brand-gradient opacity-60" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 lg:col-span-1">
            {/* ── Logo reemplaza el punto rosa ── */}
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="The Encoders Club" className="h-5 w-5 object-contain" />
              <span className="font-cyber font-bold text-xs uppercase tracking-tight text-white">The Encoders Club</span>
            </div>
            <p className="font-code text-[11px] text-neutral-600 leading-relaxed mb-5">{t('footer.description')}</p>
            <div className="flex items-center gap-2">
              <a href="https://youtube.com/@theencodersclub" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/8 text-neutral-600 hover:text-red-500 hover:border-red-500/40 transition-all"><Youtube size={14} /></a>
              <a href="https://discord.gg/2DB5k7sb8" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/8 text-neutral-600 hover:text-[#5865F2] hover:border-[#5865F2]/40 transition-all"><MessageCircle size={14} /></a>
              <a href="https://ko-fi.com/theencodersclub" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/8 text-neutral-600 hover:text-[#FF2D78] hover:border-[#FF2D78]/40 transition-all"><Heart size={14} /></a>
            </div>
          </div>
          <div>
            <h4 className="font-cyber font-bold text-[10px] text-neutral-500 mb-4 uppercase tracking-widest">{t('footer.navigation')}</h4>
            <ul className="space-y-2">
              {navLinks.map(link => (
                <li key={link.href}><Link href={link.href} className="font-code text-[11px] text-neutral-600 hover:text-[#00F2FE] transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-cyber font-bold text-[10px] text-neutral-500 mb-4 uppercase tracking-widest">{t('footer.community')}</h4>
            <ul className="space-y-2">
              {communityLinks.map(link => (
                <li key={link.label}><a href={link.href} target="_blank" rel="noopener noreferrer" className="font-code text-[11px] text-neutral-600 hover:text-[#00F2FE] transition-colors">{link.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-cyber font-bold text-[10px] text-neutral-500 mb-4 uppercase tracking-widest">{t('footer.tools')}</h4>
            <ul className="space-y-2">
              {toolLinks.map(link => (
                <li key={link.label}><a href={link.href} target={link.href.startsWith('/') ? undefined : '_blank'} rel="noopener noreferrer" className="font-code text-[11px] text-neutral-600 hover:text-[#00F2FE] transition-colors">{link.label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-[#FF2D78]/8 flex flex-col items-center sm:flex-row sm:justify-between gap-4">
          <p className="font-code text-[10px] text-neutral-700 flex items-center gap-1.5"><Code2 size={10} /> {t('footer.copyright')}</p>
          <div className="hidden sm:flex items-center gap-4">
            <span className="font-code text-[10px] text-neutral-700">UTF-8 // Ren'Py 8.3 // Python 3.9+</span>
            <span className="font-code text-[10px] text-[#00F2FE]/50">BUILD: STABLE</span>
          </div>
          <p className="font-code text-[10px] text-neutral-800 sm:hidden">{t('footer.madeWith')}</p>
        </div>
      </div>
    </footer>
  );
}
