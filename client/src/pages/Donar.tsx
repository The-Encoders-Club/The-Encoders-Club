/* ============================================================
   DONAR PAGE — The Encoders Club
   Style: Neon Synthwave Gaming - Premium Donation Experience
   ============================================================ */
import { motion } from "framer-motion";
import { Heart, Star, Zap, Crown, Coffee, ExternalLink, CheckCircle2, HelpCircle, Sparkles, Gift } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const KOFI_URL = "https://ko-fi.com/theencodersclub";

const donationTiers = [
  {
    id: 1,
    name: "Apoyo Básico",
    amount: 3,
    icon: Coffee,
    color: "#22c55e",
    description: "Un café para el equipo. Cada pequeña contribución hace una gran diferencia.",
    benefits: [
      "Nombre en créditos de agradecimiento",
      "Rol especial en Discord",
      "Acceso anticipado a noticias",
    ],
    featured: false,
  },
  {
    id: 2,
    name: "Encoder Supporter",
    amount: 10,
    icon: Star,
    color: "#FF2D78",
    description: "El apoyo ideal para mantener el proyecto activo y crear nuevo contenido.",
    benefits: [
      "Todo lo del nivel anterior",
      "Acceso anticipado a proyectos",
      "Voto en decisiones del equipo",
      "Badge exclusivo en Discord",
    ],
    featured: true,
  },
  {
    id: 3,
    name: "Club Champion",
    amount: 25,
    icon: Crown,
    color: "#4D9FFF",
    description: "Para los fans más dedicados que quieren ver el club crecer al máximo.",
    benefits: [
      "Todo lo del nivel anterior",
      "Mención especial en proyectos",
      "Acceso a canal VIP en Discord",
      "Participación en sesiones privadas",
      "Contenido exclusivo del proceso creativo",
    ],
    featured: false,
  },
];

const faqs = [
  {
    q: "¿Mis donaciones son seguras?",
    a: "Sí. Procesamos todas las donaciones a través de Ko-fi, una plataforma segura y certificada que protege tus datos de pago.",
  },
  {
    q: "¿Para qué se usan las donaciones?",
    a: "Las donaciones nos ayudan a cubrir costos de hosting, herramientas de desarrollo, arte para los proyectos y tiempo dedicado a crear contenido educativo gratuito.",
  },
  {
    q: "¿Puedo donar una cantidad personalizada?",
    a: "¡Por supuesto! En Ko-fi puedes elegir cualquier monto que desees. Cada contribución, sin importar el tamaño, es muy apreciada.",
  },
  {
    q: "¿Recibiré un recibo?",
    a: "Ko-fi envía automáticamente una confirmación a tu correo electrónico después de cada donación.",
  },
  {
    q: "¿Puedo cancelar una donación recurrente?",
    a: "Sí, puedes gestionar o cancelar donaciones recurrentes directamente desde tu cuenta de Ko-fi en cualquier momento.",
  },
];

const impactStats = [
  { label: "Proyectos Creados", value: "3+", icon: Gift },
  { label: "Cursos Disponibles", value: "7+", icon: Sparkles },
  { label: "Horas de Contenido", value: "50+", icon: Zap },
  { label: "Comunidad Activa", value: "∞", icon: Heart },
];

export default function Donar() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  return (
    <div className="min-h-screen bg-[#080818] text-white overflow-x-hidden">

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF2D78]/8 via-transparent to-[#4D9FFF]/5 pointer-events-none" />
        <div className="absolute top-20 right-1/3 w-96 h-96 rounded-full bg-[#FF2D78]/10 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-[#4D9FFF]/10 blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FF2D78]/20 border border-[#FF2D78]/40 mb-6"
              >
                <Heart size={32} className="text-[#FF2D78]" fill="currentColor" />
              </motion.div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Apoya el <span className="brand-gradient-text">Proyecto</span>
              </h1>
              
              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
                Tu contribución nos ayuda a mantener la plataforma, crear nuevos cursos y proyectos, y mantener una comunidad vibrante para todos los amantes de las novelas visuales.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {impactStats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card p-4"
                    >
                      <Icon size={20} className="text-[#FF2D78] mb-2" />
                      <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {stat.value}
                      </p>
                      <p className="text-xs text-white/50">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/60 text-sm flex items-center gap-2"
              >
                <CheckCircle2 size={16} className="text-[#22c55e]" />
                100% del dinero va directamente al proyecto
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden glass-card p-8 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-center"
                >
                  <Heart size={120} className="text-[#FF2D78] mx-auto mb-4" fill="currentColor" />
                  <p className="text-white/60 text-lg">Cada donación cuenta</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-[#06060f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ¿Por qué donar?
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Tu apoyo nos permite continuar creando contenido de calidad y mantener una comunidad próspera
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: "Contenido Premium", desc: "Cursos y tutoriales de alta calidad" },
              { icon: Zap, title: "Infraestructura", desc: "Servidores y herramientas de desarrollo" },
              { icon: Gift, title: "Comunidad", desc: "Eventos exclusivos y beneficios especiales" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 text-center hover:translate3d(0, -8px, 0) transition-transform duration-500"
                >
                  <Icon size={32} className="text-[#FF2D78] mx-auto mb-4" />
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Donation Tiers */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Elige tu nivel de apoyo
            </h2>
            <p className="text-white/60">Cada nivel incluye beneficios exclusivos</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            {donationTiers.map((tier, i) => {
              const Icon = tier.icon;
              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`glass-card p-8 flex flex-col relative overflow-hidden group hover:translate3d(0, -12px, 0) transition-transform duration-500 ${
                    tier.featured ? "ring-2 ring-[#FF2D78]/60 lg:scale-105" : ""
                  }`}
                >
                  {tier.featured && (
                    <>
                      <div className="absolute top-0 left-0 w-full h-1 brand-gradient" />
                      <span className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-[#FF2D78] to-[#a855f7] text-white">
                        ⭐ POPULAR
                      </span>
                    </>
                  )}

                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500"
                    style={{
                      background: `${tier.color}20`,
                      border: `2px solid ${tier.color}40`,
                    }}
                  >
                    <Icon size={24} style={{ color: tier.color }} />
                  </div>

                  <div className="mb-3">
                    <span className="text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: tier.color }}>
                      ${tier.amount}
                    </span>
                    <span className="text-white/40 text-sm ml-2">USD</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {tier.name}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-6">
                    {tier.description}
                  </p>

                  <ul className="space-y-3 mb-8 flex-grow">
                    {tier.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3 text-sm text-white/70">
                        <CheckCircle2 size={16} style={{ color: tier.color }} className="flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <motion.a
                    href={KOFI_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      tier.featured ? "btn-primary" : "btn-outline"
                    }`}
                    style={tier.featured ? {} : { borderColor: tier.color, color: tier.color }}
                  >
                    <Heart size={16} />
                    Donar ${tier.amount}
                    <ExternalLink size={14} />
                  </motion.a>
                </motion.div>
              );
            })}
          </div>

          {/* Custom Amount */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF2D78]/8 via-[#a855f7]/8 to-[#4D9FFF]/8 pointer-events-none" />
            <div className="relative z-10">
              <Zap size={32} className="text-[#a855f7] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                ¿Quieres donar otra cantidad?
              </h3>
              <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">
                Puedes elegir cualquier monto en Ko-fi. Cada contribución es bienvenida y apreciada.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-sm mx-auto">
                <div className="relative flex-1 w-full">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm font-semibold">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/6 border border-white/12 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#FF2D78]/50 focus:bg-white/8 transition-all"
                  />
                </div>
                <motion.a
                  href={KOFI_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-sm px-6 py-3 whitespace-nowrap"
                  onClick={() => {
                    if (customAmount && parseFloat(customAmount) > 0) {
                      toast.success(`¡Gracias por tu apoyo de $${customAmount}! Serás redirigido a Ko-fi.`);
                    }
                  }}
                >
                  Donar Ahora
                  <ExternalLink size={14} />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[#06060f]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block"
            >
              <HelpCircle size={32} className="text-[#4D9FFF] mx-auto mb-4" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Preguntas <span className="brand-gradient-text">Frecuentes</span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="glass-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {faq.q}
                  </span>
                  <span
                    className="text-[#FF2D78] transition-transform duration-300 flex-shrink-0 ml-4 text-2xl font-bold"
                    style={{ transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)" }}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <div className="h-px bg-white/8 mb-4" />
                    <p className="text-white/70 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
