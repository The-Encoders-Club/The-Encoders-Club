/* ============================================================
   DONAR PAGE — The Encoders Club
   Style: Neon Synthwave Gaming
   ============================================================ */
import { motion } from "framer-motion";
import { Heart, Star, Zap, Crown, Coffee, ExternalLink, CheckCircle2, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

export default function Donar() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  return (
    <div className="min-h-screen bg-[#080818] text-white overflow-x-hidden">
      <Navbar />

      {/* Page Header */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF2D78]/5 to-transparent pointer-events-none" />
        <div className="absolute top-20 right-1/3 w-72 h-72 rounded-full bg-[#FF2D78]/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-[#4D9FFF]/8 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FF2D78]/15 border border-[#FF2D78]/30 mb-6">
              <Heart size={28} className="text-[#FF2D78]" fill="currentColor" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Apoya el <span className="brand-gradient-text">Proyecto</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Tu contribución nos ayuda a mantener la plataforma, crear nuevos cursos y proyectos, y mantener una comunidad vibrante para todos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Donation Tiers */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            {donationTiers.map((tier, i) => {
              const Icon = tier.icon;
              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`glass-card p-7 flex flex-col relative overflow-hidden ${
                    tier.featured ? "ring-2 ring-[#FF2D78]/50 scale-105" : ""
                  }`}
                >
                  {tier.featured && (
                    <div className="absolute top-0 left-0 w-full h-1 brand-gradient" />
                  )}
                  {tier.featured && (
                    <span className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full bg-[#FF2D78] text-white">
                      POPULAR
                    </span>
                  )}

                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{
                      background: `${tier.color}15`,
                      border: `1px solid ${tier.color}30`,
                    }}
                  >
                    <Icon size={22} style={{ color: tier.color }} />
                  </div>

                  {/* Price */}
                  <div className="mb-2">
                    <span className="text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: tier.color }}>
                      ${tier.amount}
                    </span>
                    <span className="text-white/40 text-sm ml-1">USD</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {tier.name}
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed mb-6">
                    {tier.description}
                  </p>

                  {/* Benefits */}
                  <ul className="space-y-2.5 mb-7 flex-grow">
                    {tier.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 text-sm text-white/70">
                        <CheckCircle2 size={15} style={{ color: tier.color }} className="flex-shrink-0 mt-0.5" />
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={KOFI_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      tier.featured ? "btn-primary" : "btn-outline"
                    }`}
                    style={tier.featured ? {} : { borderColor: tier.color, color: tier.color }}
                  >
                    <Heart size={15} />
                    Donar ${tier.amount}
                    <ExternalLink size={13} />
                  </a>
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
            className="mt-8 glass-card p-8 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF2D78]/4 via-[#a855f7]/4 to-[#4D9FFF]/4 pointer-events-none" />
            <div className="relative z-10">
              <Zap size={28} className="text-[#a855f7] mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                ¿Quieres donar otra cantidad?
              </h3>
              <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
                Puedes elegir cualquier monto en Ko-fi. Cada contribución es bienvenida y apreciada.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-sm mx-auto">
                <div className="relative flex-1 w-full">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/6 border border-white/12 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#FF2D78]/50 focus:bg-white/8 transition-all"
                  />
                </div>
                <a
                  href={KOFI_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm px-6 py-3 whitespace-nowrap"
                  onClick={() => {
                    if (customAmount && parseFloat(customAmount) > 0) {
                      toast.success(`¡Gracias por tu apoyo de $${customAmount}! Serás redirigido a Ko-fi.`);
                    }
                  }}
                >
                  Donar Ahora
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[#06060f]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <HelpCircle size={28} className="text-[#4D9FFF] mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Preguntas Frecuentes
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
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {faq.q}
                  </span>
                  <span
                    className="text-[#FF2D78] transition-transform duration-300 flex-shrink-0 ml-4"
                    style={{ transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)" }}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <div className="h-px bg-white/8 mb-4" />
                    <p className="text-white/55 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
