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
    <footer className="relative mt-24 bg-[#06060f] border-t border-white/8">
      <div className="h-px w-full brand-gradient opacity-60" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain rounded-full" />
              <span className="font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>The Encoders Club</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-5">{t('footer.description')}</p>
            <div className="flex items-center gap-3">
              <a href="https://youtube.com/@theencodersclub" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/6 border border-white/10 text-white/60 hover:text-red-500 hover:border-red-500/40 transition-all"><Youtube size={16} /></a>
              <a href="https://discord.gg/2DB5k7sb8" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/6 border border-white/10 text-white/60 hover:text-[#5865F2] hover:border-[#5865F2]/40 transition-all"><MessageCircle size={16} /></a>
              <a href="https://ko-fi.com/theencodersclub" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/6 border border-white/10 text-white/60 hover:text-[#FF2D78] hover:border-[#FF2D78]/40 transition-all"><Heart size={16} /></a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{t('footer.navigation')}</h4>
            <ul className="space-y-2.5">
              {navLinks.map(link => (
                <li key={link.href}><Link href={link.href} className="text-sm text-white/50 hover:text-[#FF2D78] transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{t('footer.community')}</h4>
            <ul className="space-y-2.5">
              {communityLinks.map(link => (
                <li key={link.label}><a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-[#FF2D78] transition-colors">{link.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{t('footer.tools')}</h4>
            <ul className="space-y-2.5">
              {toolLinks.map(link => (
                <li key={link.label}><a href={link.href} target={link.href.startsWith('/') ? undefined : '_blank'} rel="noopener noreferrer" className="text-sm text-white/50 hover:text-[#4D9FFF] transition-colors">{link.label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/8 flex flex-col items-center sm:flex-row sm:justify-between gap-4">
          <p className="text-xs text-white/35 flex items-center gap-1.5"><Code2 size={12} /> {t('footer.copyright')}</p>
          <p className="text-xs text-white/25">{t('footer.madeWith')}</p>
        </div>
      </div>
    </footer>
  );
}
