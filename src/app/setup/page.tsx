'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Lock, Eye, EyeOff, Sparkles, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SetupPage() {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ownerExists, setOwnerExists] = useState<boolean | null>(null);
  const [ownerNickname, setOwnerNickname] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/check-owner')
      .then(r => r.json())
      .then(data => {
        setOwnerExists(data.ownerExists);
        setOwnerNickname(data.ownerNickname);
      })
      .catch(() => {
        setOwnerExists(false);
      });
  }, []);

  const handleCreateOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    if (nickname.length < 3) {
      toast.error('El nickname debe tener al menos 3 caracteres');
      return;
    }
    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/seed-owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Error al crear el Owner');
        return;
      }

      toast.success('¡Cuenta Owner creada exitosamente!', {
        description: `Nickname: ${nickname}`,
      });
      setOwnerExists(true);
      setOwnerNickname(nickname);
    } catch {
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080818] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-[#FF2D78]/8 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#4D9FFF]/8 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#a855f7]/5 blur-3xl pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-[#0d0d24]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Top gradient bar */}
          <div className="absolute top-0 left-0 w-full h-1 brand-gradient" />

          {/* Icon */}
          <div className="flex justify-center mb-6 mt-2">
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF2D78] via-[#a855f7] to-[#4D9FFF] flex items-center justify-center shadow-[0_0_40px_rgba(255,45,120,0.4)]"
              style={{ perspective: '800px' }}
            >
              <Shield className="text-white" size={36} />
            </motion.div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Configuración Inicial
          </h1>
          <p className="text-white/50 text-center text-sm mb-8">
            Crea la cuenta Owner / Super Administrador
          </p>

          {ownerExists === null ? (
            /* Loading state */
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#FF2D78] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : ownerExists ? (
            /* Owner already exists */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4 py-4"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center mx-auto">
                <CheckCircle2 className="text-green-400" size={32} />
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
                <p className="text-green-300 font-bold text-lg mb-1">Owner ya configurado</p>
                <p className="text-white/60 text-sm">
                  El Owner <span className="text-white font-semibold">{ownerNickname}</span> ya existe en el sistema.
                </p>
              </div>
              <p className="text-white/30 text-xs">
                Solo puede existir un Owner. Esta cuenta tiene permisos absolutos y no puede ser degradada o baneada.
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF2D78] via-[#a855f7] to-[#4D9FFF] text-white font-bold text-sm hover:shadow-[0_0_25px_rgba(255,45,120,0.5)] transition-all mt-4"
              >
                Ir al Inicio <ArrowRight size={16} />
              </a>
            </motion.div>
          ) : (
            /* Create owner form */
            <>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 flex gap-3">
                <AlertTriangle className="text-amber-400 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-amber-200/80 text-xs leading-relaxed">
                  Esta acción solo se puede realizar <strong>una vez</strong>. El Owner tiene permisos absolutos sobre toda la plataforma y no puede ser baneado ni degradado. Elige un nickname y contraseña seguros.
                </p>
              </div>

              <form onSubmit={handleCreateOwner} className="space-y-4">
                {/* Nickname */}
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider font-semibold block mb-2">Nickname</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="text"
                      placeholder="Tu nickname de Owner"
                      value={nickname}
                      onChange={e => setNickname(e.target.value)}
                      required
                      minLength={3}
                      maxLength={20}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#FF2D78]/50 focus:bg-white/8 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider font-semibold block mb-2">Contraseña</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#FF2D78]/50 transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider font-semibold block mb-2">Confirmar Contraseña</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repite tu contraseña"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#FF2D78]/50 transition-all"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Password strength indicator */}
                {password.length > 0 && (
                  <div className="space-y-1">
                    <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (password.length / 12) * 100)}%` }}
                        className={`h-full rounded-full transition-colors ${
                          password.length < 6 ? 'bg-red-500' :
                          password.length < 8 ? 'bg-amber-500' :
                          'bg-green-500'
                        }`}
                      />
                    </div>
                    <p className="text-xs text-white/30">
                      {password.length < 6 ? 'Muy corta' :
                       password.length < 8 ? 'Aceptable' :
                       password.length < 12 ? 'Buena' : 'Excelente'}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || password !== confirmPassword || password.length < 6 || nickname.length < 3}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF2D78] via-[#a855f7] to-[#4D9FFF] text-white font-bold text-sm hover:shadow-[0_0_30px_rgba(255,45,120,0.5)] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Crear Cuenta Owner
                    </>
                  )}
                </button>
              </form>

              {/* Features list */}
              <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
                <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-3">Permisos del Owner:</p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    'Acceso total al panel de administración',
                    'Gestión de usuarios, banes y roles',
                    'CRUD de proyectos, noticias y cursos',
                    'Configuración de Discord (bot, webhook)',
                    'No puede ser baneado ni degradado',
                    'Visualización de estadísticas y logs',
                  ].map((perm, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-white/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] flex-shrink-0" />
                      {perm}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer info */}
        <p className="text-center text-white/20 text-xs mt-6">
          The Encoders Club &bull; Configuración segura
        </p>
      </motion.div>
    </div>
  );
}
