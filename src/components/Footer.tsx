'use client';

import Link from "next/link";
import { Youtube, MessageCircle, Heart, Code2 } from "lucide-react";
import { useI18n } from "@/hooks/useLocale";

export default function Footer() {
  const { t } = useI18n();

  const allLinks = [
    { label: t('nav.home'), href: "/", external: false },
    { label: t('nav.projects'), href: "/proyectos", external: false },
    { label: t('nav.courses'), href: "/cursos", external: false },
    { label: t('nav.news'), href: "/noticias", external: false },
    { label: "Discord", href: "https://discord.gg/2DB5k7sb8", external: true },
    { label: "YouTube", href: "https://youtube.com/@theencodersclub", external: true },
    { label: "Ko-fi", href: "https://ko-fi.com/theencodersclub", external: true },
  ];

  return (
    <footer className="relative mt-8 bg-[#080812] border-t border-[#FF2D78]/15">
      <div className="h-px w-full brand-gradient opacity-60" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">

        {/* Fila principal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <img src="/logo.png" alt="The Encoders Club" className="h-5 w-5 object-contain" />
            <span className="font-cyber font-bold text-xs uppercase tracking-tight text-white">
              THE ENCODERS <span className="text-[#FF2D78]">CLUB</span>
            </span>
          </Link>

          {/* Links inline */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {allLinks.map(link => (
              link.external ? (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                  className="font-code text-[10px] text-neutral-600 hover:text-[#00F2FE] transition-colors">
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} href={link.href}
                  className="font-code text-[10px] text-neutral-600 hover:text-[#00F2FE] transition-colors">
                  {link.label}
                </Link>
              )
            ))}
          </div>

          {/* Redes */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <a href="https://youtube.com/@theencodersclub" target="_blank" rel="noopener noreferrer"
              className="w-7 h-7 flex items-center justify-center bg-white/5 border border-white/8 text-neutral-600 hover:text-red-500 hover:border-red-500/40 transition-all">
              <Youtube size={12} />
            </a>
            <a href="https://discord.gg/2DB5k7sb8" target="_blank" rel="noopener noreferrer"
              className="w-7 h-7 flex items-center justify-center bg-white/5 border border-white/8 text-neutral-600 hover:text-[#5865F2] hover:border-[#5865F2]/40 transition-all">
              <MessageCircle size={12} />
            </a>
            <a href="https://ko-fi.com/theencodersclub" target="_blank" rel="noopener noreferrer"
              className="w-7 h-7 flex items-center justify-center bg-white/5 border border-white/8 text-neutral-600 hover:text-[#FF2D78] hover:border-[#FF2D78]/40 transition-all">
              <Heart size={12} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 pt-3 border-t border-[#FF2D78]/8 flex flex-col sm:flex-row items-center justify-between gap-1">
          <p className="font-code text-[10px] text-neutral-700 flex items-center gap-1.5">
            <Code2 size={10} /> {t('footer.copyright')}
          </p>
          <span className="font-code text-[10px] text-[#00F2FE]/40">BUILD: STABLE</span>
        </div>

      </div>
    </footer>
  );
}
