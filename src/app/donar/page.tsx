'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Coffee, Star, Crown, ChevronDown, ExternalLink, Shield, Zap, Gift, Users, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundParticles from '@/components/BackgroundParticles';

const tiers = [
  {
    name: 'Café',
    price: 3,
    icon: Coffee,
    color: '#FF2D78',
    description: 'Apoya nuestro trabajo con un café.',
    perks: [
      'Acceso a actualizaciones tempranas',
      'Mención en créditos',
      'Insignia de apoyo en Discord',
    ],
    gradient: 'from-[#FF2D78]/20 to-[#FF2D78]/5',
    borderColor: '#FF2D7840',
    buttonText: 'Donar $3',
  },
  {
    name: 'Fan',
    price: 5,
    icon: Star,
    color: '#4D9FFF',
    description: 'Muestra tu dedicación como fan.',
    perks: [
      'Todos los beneficios de Café',
      'Acceso a contenido exclusivo',
      'Participa en votaciones de proyectos',
      'Badge especial de Fan en Discord',
    ],
    gradient: 'from-[#4D9FFF]/20 to-[#4D9FFF]/5',
    borderColor: '#4D9FFF40',
    buttonText: 'Donar $5',
    popular: true,
  },
  {
    name: 'Patrocinador',
    price: 10,
    icon: Crown,
    color: '#a855f7',
    description: 'Conviértete en patrocinador oficial.',
    perks: [
      'Todos los beneficios de Fan',
      'Acceso anticipado a versiones beta',
      'Nombre en la sección de agradecimientos',
      'Rol de Patrocinador en Discord',
      'Acceso al canal VIP',
    ],
    gradient: 'from-[#a855f7]/20 to-[#a855f7]/5',
    borderColor: '#a855f740',
    buttonText: 'Donar $10',
  },
];

const faqItems = [
  {
    question: '¿Cómo se usan las donaciones?',
    answer: 'Las donaciones se utilizan para mantener los servidores del sitio web, pagar licencias de software, comprar assets para los proyectos, y financiar premios para concursos. También nos ayudan a invertir tiempo en crear más contenido educativo.',
  },
  {
    question: '¿Las donaciones son recurrentes?',
    answer: 'No, las donaciones son únicas. Puedes donar cuando quieras y la cantidad que desees. Sin embargo, también ofrecemos la opción de suscripción mensual a través de Ko-fi si prefieres un apoyo constante.',
  },
  {
    question: '¿Puedo obtener un reembolso?',
    answer: 'Las donaciones son voluntarias y no tienen reembolso. Si tienes algún problema con tu donación, por favor contáctanos a través de Discord y lo revisaremos.',
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos tarjetas de crédito, PayPal y otras formas de pago a través de Ko-fi, nuestra plataforma de donaciones principal.',
  },
  {
    question: '¿Cómo recibo mis beneficios?',
    answer: 'Después de realizar tu donación, envíanos un mensaje en Discord con tu comprobante. Verificaremos tu donación y te otorgaremos los beneficios correspondientes en un plazo de 24 horas.',
  },
  {
    question: '¿Las donaciones son deducibles de impuestos?',
    answer: 'No, The Encoders Club no es una organización sin fines de lucro registrada, por lo que las donaciones no son deducibles de impuestos.',
  },
];

const impactStats = [
  { icon: Zap, label: 'Servidores mantenidos', value: '12+', color: '#FF2D78' },
  { icon: Gift, label: 'Premios financiados', value: '6', color: '#4D9FFF' },
  { icon: Users, label: 'Donantes activos', value: '50+', color: '#a855f7' },
  { icon: Shield, label: 'Proyectos impulsados', value: '3', color: '#22c55e' },
];

const KOFI_URL = 'https://ko-fi.com/theencodersclub';

export default function Donar() {
  const [customAmount, setCustomAmount] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleDonate = (amount: number) => {
    window.open(`${KOFI_URL}?amount=${amount}`, '_blank');
  };

  const handleCustomDonate = () => {
    const amount = parseFloat(customAmount);
    if (amount && amount >= 1) {
      handleDonate(amount);
    }
  };

  return (
    <div className="min-h-screen bg-[#080818] text-white overflow-x-hidden">
      <Navbar />
      <BackgroundParticles />

      {/* Hero */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-16">
        <div className="absolute top-0 left-1/3 w-64 h-64 rounded-full bg-[#FF2D78]/8 blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-48 h-48 rounded-full bg-[#a855f7]/8 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FF2D78]/15 border border-[#FF2D78]/30 mb-6"
            >
              <Heart size={28} className="text-[#FF2D78]" />
            </motion.div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Apoya a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D78] to-[#a855f7]">
                The Encoders Club
              </span>
            </h1>
            <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Tu ayuda nos permite seguir creando novelas visuales, tutoriales y contenido para la comunidad hispanohablante. Cada contribución cuenta.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {impactStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-card p-5 text-center"
                >
                  <Icon size={22} style={{ color: stat.color }} className="mx-auto mb-2" />
                  <p className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: stat.color }}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-white/50 mt-1">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Donation Tiers */}
      <section className="py-16 lg:py-24 bg-[#06060f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#FF2D78] text-sm font-semibold uppercase tracking-widest mb-3 block">Elige tu nivel</span>
            <h2 className="section-title text-white">Niveles de <span className="brand-gradient-text">Apoyo</span></h2>
            <p className="text-white/50 mt-4 max-w-lg mx-auto text-sm">
              Cada nivel incluye beneficios exclusivos. Elige el que mejor se adapte a tu capacidad.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tiers.map((tier, i) => {
              const Icon = tier.icon;
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className={`relative glass-card overflow-hidden group ${tier.popular ? 'ring-1 ring-[#4D9FFF]/40' : ''}`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4D9FFF] to-[#a855f7]" />
                  )}
                  {tier.popular && (
                    <span className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#4D9FFF]/20 border border-[#4D9FFF]/40 text-[#4D9FFF] uppercase tracking-wider">
                      Popular
                    </span>
                  )}
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: `${tier.color}15`, border: `1px solid ${tier.color}30` }}
                      >
                        <Icon size={22} style={{ color: tier.color }} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          {tier.name}
                        </h3>
                        <p className="text-xs text-white/40">{tier.description}</p>
                      </div>
                    </div>
                    <div className="mb-6">
                      <span className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: tier.color }}>
                        ${tier.price}
                      </span>
                      <span className="text-white/40 text-sm"> / donación</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {tier.perks.map((perk, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-white/65">
                          <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: tier.color }} />
                          {perk}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleDonate(tier.price)}
                      className={`w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                        tier.popular
                          ? 'bg-gradient-to-r from-[#4D9FFF] to-[#a855f7] text-white shadow-lg shadow-[#4D9FFF]/20'
                          : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      <ExternalLink size={14} />
                      {tier.buttonText}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Custom Amount */}
      <section className="py-16 lg:py-24">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 brand-gradient" />
            <Heart size={28} className="text-[#FF2D78] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Cantidad Personalizada
            </h3>
            <p className="text-white/50 text-sm mb-6">
              ¿Quieres donar una cantidad diferente? Ingresa el monto que desees.
            </p>
            <div className="flex gap-3 max-w-sm mx-auto">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-bold">$</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="10"
                  min="1"
                  step="1"
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#FF2D78]/50 focus:ring-1 focus:ring-[#FF2D78]/30 transition-all text-sm"
                />
              </div>
              <button
                onClick={handleCustomDonate}
                disabled={!customAmount || parseFloat(customAmount) < 1}
                className="btn-primary px-6 py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ExternalLink size={14} /> Donar
              </button>
            </div>
            <p className="text-xs text-white/30 mt-4">Monto mínimo: $1 USD</p>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-[#06060f]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#a855f7] text-sm font-semibold uppercase tracking-widest mb-3 block">Preguntas frecuentes</span>
            <h2 className="section-title text-white">¿Tienes <span className="brand-gradient-text">Dudas?</span></h2>
          </div>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/3 transition-colors"
                >
                  <span className="text-sm font-semibold text-white pr-4">{item.question}</span>
                  <ChevronDown
                    size={18}
                    className={`text-white/40 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-[#a855f7]' : ''}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === i ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-5 pb-5 text-sm text-white/55 leading-relaxed">{item.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ko-fi Direct Link */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card-enhanced p-8 sm:p-12 text-center"
          >
            <div className="absolute top-0 left-0 w-full h-1 brand-gradient" />
            <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ¡Gracias por tu apoyo! 💜
            </h3>
            <p className="text-white/55 mb-6 leading-relaxed">
              Cada donación, por pequeña que sea, tiene un gran impacto en nuestra comunidad. Nos motiva a seguir creando y compartiendo contenido de calidad.
            </p>
            <a
              href={KOFI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#FF5E5B] text-white font-bold text-sm uppercase tracking-wider hover:bg-[#ff7a77] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#FF5E5B]/20"
            >
              <ExternalLink size={16} /> Visitar Ko-fi
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
