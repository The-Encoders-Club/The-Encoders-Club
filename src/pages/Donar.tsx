import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'wouter';
import { ArrowLeft, Heart } from 'lucide-react';

export default function Donar() {
  const donationOptions = [
    {
      id: 1,
      amount: 5,
      name: 'Apoyo Inicial',
      description: 'Ayuda a mantener nuestros servidores en funcionamiento',
      benefits: ['Acceso a contenido exclusivo', 'Tu nombre en nuestra página de donantes'],
    },
    {
      id: 2,
      amount: 15,
      name: 'Apoyo Moderado',
      description: 'Contribuye significativamente al desarrollo de nuevos cursos',
      benefits: ['Acceso prioritario a nuevos cursos', 'Badge especial en la comunidad', 'Tu nombre destacado en donantes'],
      featured: true,
    },
    {
      id: 3,
      amount: 50,
      name: 'Apoyo Premium',
      description: 'Sé parte de nuestro círculo de patrocinadores principales',
      benefits: ['Acceso VIP a todos los contenidos', 'Consulta mensual con expertos', 'Créditos en proyectos', 'Tu logo en nuestra página'],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 border-b border-purple-900/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 hover:text-pink-400 transition-colors">
          <ArrowLeft size={20} />
          <span className="text-lg sm:text-2xl font-bold tracking-tight">The Encoders Club</span>
        </Link>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 flex items-center justify-center gap-2">
            <Heart className="text-pink-500 fill-pink-500" size={40} />
            Apoya Nuestro Proyecto
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Tu contribución nos ayuda a mantener y mejorar la plataforma, crear nuevos cursos y mantener una comunidad vibrante.
          </p>
        </div>

        {/* Donation Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {donationOptions.map((option) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`rounded-2xl overflow-hidden border transition-all ${
                option.featured
                  ? 'border-pink-500 bg-pink-950/30 shadow-lg shadow-pink-500/20 scale-105 md:scale-110'
                  : 'border-purple-800/50 bg-purple-950/30 hover:border-pink-500/50'
              }`}
            >
              <div className="p-6 sm:p-8">
                {option.featured && (
                  <div className="bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                    MÁS POPULAR
                  </div>
                )}
                <h3 className="text-2xl sm:text-3xl font-bold mb-2">${option.amount}</h3>
                <h4 className="text-lg sm:text-xl font-semibold mb-2 text-pink-400">{option.name}</h4>
                <p className="text-sm sm:text-base text-gray-400 mb-6">{option.description}</p>
                
                <div className="space-y-3 mb-8">
                  {option.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-pink-400 mt-1">✓</span>
                      <span className="text-sm sm:text-base text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-3 rounded-full font-bold transition-all ${
                  option.featured
                    ? 'bg-pink-600 hover:bg-pink-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}>
                  Donar ${option.amount}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="bg-purple-950/30 rounded-2xl border border-purple-800/50 p-8 sm:p-12 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">¿Quieres donar otra cantidad?</h3>
          <p className="text-gray-400 mb-6">Puedes elegir cualquier monto que desees para apoyar nuestro proyecto.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <input 
              type="number" 
              placeholder="Ingresa el monto" 
              className="px-4 py-3 rounded-full bg-purple-900/50 border border-purple-800 text-white placeholder-gray-500 w-full sm:w-auto"
            />
            <button className="bg-pink-600 hover:bg-pink-700 px-8 py-3 rounded-full font-bold transition-all whitespace-nowrap">
              Donar Ahora
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12 sm:mt-16">
          <h3 className="text-3xl font-bold mb-8">Preguntas Frecuentes</h3>
          <div className="space-y-4">
            <div className="bg-purple-950/30 rounded-2xl border border-purple-800/50 p-6">
              <h4 className="font-bold text-lg mb-2">¿Mis donaciones son seguras?</h4>
              <p className="text-gray-400">Sí, procesamos todas las donaciones a través de plataformas seguras y certificadas.</p>
            </div>
            <div className="bg-purple-950/30 rounded-2xl border border-purple-800/50 p-6">
              <h4 className="font-bold text-lg mb-2">¿Puedo cancelar mi donación?</h4>
              <p className="text-gray-400">Puedes contactarnos para solicitar un reembolso dentro de 30 días.</p>
            </div>
            <div className="bg-purple-950/30 rounded-2xl border border-purple-800/50 p-6">
              <h4 className="font-bold text-lg mb-2">¿Recibiré un recibo?</h4>
              <p className="text-gray-400">Sí, enviaremos un recibo a tu correo electrónico después de procesar tu donación.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
