'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Coffee, Star, Crown, ChevronDown, ExternalLink, Shield, Zap, Gift, Users, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundParticles from '@/components/BackgroundParticles';
import { useI18n } from '@/hooks/useLocale';

const KOFI_URL = 'https://ko-fi.com/theencodersclub';

const tierData = [
  {
    icon: Coffee,
    color: '#FF2D78',
    price: 3,
    popular: false,
    nameKey: 'donate.tier1.name' as const,
    descKey: 'donate.tier1.desc' as const,
    perksKeys: ['donate.perks.tier1.p1', 'donate.perks.tier1.p2', 'donate.perks.tier1.p3'] as const,
  },
  {
    icon: Star,
    color: '#00F2FE',
    price: 5,
    popular: true,
    nameKey: 'donate.tier2.name' as const,
    descKey: 'donate.tier2.desc' as const,
    perksKeys: ['donate.perks.tier2.p1', 'donate.perks.tier2.p2', 'donate.perks.tier2.p3', 'donate.perks.tier2.p4'] as const,
  },
  {
    icon: Crown,
    color: '#9d4edd',
    price: 10,
    popular: false,
    nameKey: 'donate.tier3.name' as const,
    descKey: 'donate.tier3.desc' as const,
    perksKeys: ['donate.perks.tier3.p1', 'donate.perks.tier3.p2', 'donate.perks.tier3.p3', 'donate.perks.tier3.p4', 'donate.perks.tier3.p5'] as const,
  },
];

const statData = [
  { icon: Zap, value: '12+', color: '#FF2D78', labelKey: 'donate.stats.servers' as const },
  { icon: Gift, value: '6', color: '#00F2FE', labelKey: 'donate.stats.prizes' as const },
  { icon: Users, value: '50+', color: '#9d4edd', labelKey: 'donate.stats.donors' as const },
  { icon: Shield, value: '3', color: '#22c55e', labelKey: 'donate.stats.projects' as const },
];

const faqKeys = [
  { qKey: 'donate.faq1.q' as const, aKey: 'donate.faq1.a' as const },
  { qKey: 'donate.faq2.q' as const, aKey: 'donate.faq2.a' as const },
  { qKey: 'donate.faq3.q' as const, aKey: 'donate.faq3.a' as const },
  { qKey: 'donate.faq4.q' as const, aKey: 'donate.faq4.a' as const },
  { qKey: 'donate.faq5.q' as const, aKey: 'donate.faq5.a' as const },
  { qKey: 'donate.faq6.q' as const, aKey: 'donate.faq6.a' as const },
];

export default function Donar() {
  const { t } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleDonate = (amount: number) => {
    window.open(`${KOFI_URL}?amount=${amount}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#030308] text-white overflow-x-hidden">
      <Navbar />
      <BackgroundParticles />

      {/* Hero */}
      <section className="relative pt-16 sm:pt-20 pb-10 sm:pb-12">
        <div className="absolute top-0 left-1/3 w-64 h-64 rounded-full bg-[#FF2D78]/8 blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-48 h-48 rounded-full bg-[#9d4edd]/8 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center justify-center w-16 h-16 bg-[#FF2D78]/15 border border-[#FF2D78]/30 mb-6"
            >
              <Sparkles size={28} className="text-[#FF2D78]" />
            </motion.div>
            <h1 className="font-cyber text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 uppercase">
              {t('donate.hero.title')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D78] to-[#9d4edd]">
                {t('donate.hero.accent')}
              </span>
            </h1>
            <p className="font-code text-sm text-white/60 max-w-xl mx-auto leading-relaxed">
              {t('donate.hero.text')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="pb-8 sm:pb-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statData.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.labelKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="clip-card bg-[#0e0e1f] border border-white/10 p-5 text-center"
                >
                  <Icon size={22} style={{ color: stat.color }} className="mx-auto mb-2" />
                  <p className="font-cyber text-xl sm:text-2xl font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                  <p className="font-code text-[10px] text-white/50 mt-1">{t(stat.labelKey)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Donation Tiers */}
      <section className="py-10 lg:py-14 bg-[#05050d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="font-cyber font-bold text-sm tracking-widest text-[#FF2D78] mb-3 block">{'// '}{t('donate.tiersTag')}</span>
            <h2 className="section-title text-white">{t('donate.tiersTitle')} <span className="brand-gradient-text">{t('donate.tiersAccent')}</span></h2>
            <p className="font-code text-sm text-white/50 mt-4 max-w-lg mx-auto">
              {t('donate.tiersDesc')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tierData.map((tier, i) => {
              const Icon = tier.icon;
              return (
                <motion.div
                  key={tier.nameKey}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className={`relative clip-card bg-[#0e0e1f] border border-white/10 overflow-hidden group transition-all duration-300 ${tier.popular ? 'neon-border-cyan' : ''}`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00F2FE] to-[#9d4edd]" />
                  )}
                  {tier.popular && (
                    <span className="absolute top-4 right-4 font-cyber font-bold text-[10px] px-2.5 py-1 bg-[#00F2FE]/20 border border-[#00F2FE]/40 text-[#00F2FE] uppercase tracking-wider">
                      {t('donate.popular')}
                    </span>
                  )}
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-12 h-12 flex items-center justify-center"
                        style={{ background: `${tier.color}15`, border: `1px solid ${tier.color}30` }}
                      >
                        <Icon size={22} style={{ color: tier.color }} />
                      </div>
                      <div>
                        <h3 className="font-cyber font-bold text-white text-lg">
                          {t(tier.nameKey)}
                        </h3>
                        <p className="font-code text-[10px] text-white/40">{t(tier.descKey)}</p>
                      </div>
                    </div>
                    <div className="mb-6">
                      <span className="font-cyber text-3xl font-bold" style={{ color: tier.color }}>
                        ${tier.price}
                      </span>
                      <span className="font-code text-[11px] text-white/40"> {t('donate.perDonation')}</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {tier.perksKeys.map((perkKey, idx) => (
                        <li key={idx} className="flex items-start gap-2 font-code text-[11px] text-white/65">
                          <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: tier.color }} />
                          {t(perkKey)}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleDonate(tier.price)}
                      className={`w-full py-3 font-cyber font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] clip-btn ${
                        tier.popular
                          ? 'bg-gradient-to-r from-[#00F2FE] to-[#9d4edd] text-black shadow-lg shadow-[#00F2FE]/20'
                          : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      <ExternalLink size={14} />
                      {t('donate.donate')} ${tier.price}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 lg:py-14 bg-[#05050d]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="font-cyber font-bold text-sm tracking-widest text-[#9d4edd] mb-3 block">{'// '}{t('donate.faqTag')}</span>
            <h2 className="section-title text-white">{t('donate.faqTitle')} <span className="brand-gradient-text">{t('donate.faqAccent')}</span></h2>
          </div>
          <div className="space-y-3">
            {faqKeys.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="clip-card bg-[#0b0b16] border border-white/8 overflow-hidden"
                style={{ borderLeftWidth: '3px', borderLeftColor: '#9d4edd' }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/3 transition-colors"
                >
                  <span className="font-code text-sm font-semibold text-white pr-4">{t(item.qKey)}</span>
                  <ChevronDown
                    size={18}
                    className={`text-white/40 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-[#9d4edd]' : ''}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === i ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-5 pb-5 font-code text-[11px] text-white/55 leading-relaxed">{t(item.aKey)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ko-fi Direct Link */}
      <section className="py-10 lg:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="clip-card neon-border-magenta p-8 sm:p-12 text-center bg-[#0e0e1f]"
          >
            <div className="absolute top-0 left-0 w-full h-1 brand-gradient" />
            <h3 className="font-cyber text-2xl font-bold text-white mb-3 uppercase">
              {t('donate.thanksTitle')}
            </h3>
            <p className="font-code text-sm text-white/55 mb-6 leading-relaxed">
              {t('donate.thanksText')}
            </p>
            <a
              href={KOFI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="clip-btn inline-flex items-center gap-2 px-8 py-3.5 bg-[#FF5E5B] text-white font-cyber font-bold text-sm uppercase tracking-wider hover:bg-[#ff7a77] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#FF5E5B]/20"
            >
              <ExternalLink size={16} /> {t('donate.visitKofi')}
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
