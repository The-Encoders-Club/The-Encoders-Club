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
    <footer className="relative bg-[#080812] border-t border-[#FF2D78]/15">
      <div className="h-px w-full brand-gradient opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">

          {/* ── Columna Logo ── */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="The Encoders Club" className="h-8 w-8 object-contain" />
              <span className="font-cyber font-bold text-sm uppercase leading-tight text-white">
                THE ENCODERS<br /><span className="text-[#FF2D78]">CLUB</span>
              </span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <a href="https://youtube.com/@theencodersclub" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 text-neutral-500 hover:text-red-500 hover:border-red-500/40 transition-all">
                <Youtube size={13} />
              </a>
              <a href="https://discord.gg/2DB5k7sb8" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 text-neutral-500 hover:text-[#5865F2] hover:border-[#5865F2]/40 transition-all">
                <MessageCircle size={13} />
              </a>
              <a href="https://ko-fi.com/theencodersclub" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 text-neutral-500 hover:text-[#FF2D78] hover:border-[#FF2D78]/40 transition-all">
                <Heart size={13} />
              </a>
            </div>
          </div>

          {/* ── Navegación ── */}
          <div>
            <h4 className="font-cyber font-bold text-[11px] text-white mb-1 uppercase tracking-widest pb-1.5 border-b-2 border-[#FF2D78] inline-block">
              {t('footer.navigation')}
            </h4>
            <ul className="space-y-2 mt-3">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="font-code text-[11px] text-neutral-500 hover:text-[#00F2FE] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Comunidad ── */}
          <div>
            <h4 className="font-cyber font-bold text-[11px] text-white mb-1 uppercase tracking-widest pb-1.5 border-b-2 border-[#9d4edd] inline-block">
              {t('footer.community')}
            </h4>
            <ul className="space-y-2 mt-3">
              {communityLinks.map(link => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer"
                    className="font-code text-[11px] text-neutral-500 hover:text-[#00F2FE] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Herramientas ── */}
          <div>
            <h4 className="font-cyber font-bold text-[11px] text-white mb-1 uppercase tracking-widest pb-1.5 border-b-2 border-[#00F2FE] inline-block">
              {t('footer.tools')}
            </h4>
            <ul className="space-y-2 mt-3">
              {toolLinks.map(link => (
                <li key={link.label}>
                  <a href={link.href} target={link.href.startsWith('/') ? undefined : '_blank'} rel="noopener noreferrer"
                    className="font-code text-[11px] text-neutral-500 hover:text-[#00F2FE] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ── Copyright bar ── */}
      <div className="bg-[#05050d] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="font-code text-[10px] text-neutral-600 flex items-center gap-1.5">
            <Code2 size={10} /> {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
