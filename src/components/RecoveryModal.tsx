'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Eye, EyeOff, Shield, KeyRound, ArrowLeft, CheckCircle2, Copy, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '@/hooks/useLocale';

interface RecoveryModalProps {
  onClose: () => void;
  onBackToLogin: () => void;
}

type Step = 'nickname' | 'verify' | 'newpassword' | 'success';

export function RecoveryModal({ onClose, onBackToLogin }: RecoveryModalProps) {
  const { t, locale } = useI18n();

  // Step state
  const [step, setStep] = useState<Step>('nickname');

  // Nickname step
  const [nickname, setNickname] = useState('');
  const [loadingNickname, setLoadingNickname] = useState(false);

  // Verify step
  const [method, setMethod] = useState<'code' | 'question'>('code');
  const [securityQuestionLabel, setSecurityQuestionLabel] = useState('');
  const [verifyInput, setVerifyInput] = useState('');
  const [loadingVerify, setLoadingVerify] = useState(false);

  // New password step
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    setLoadingNickname(true);
    try {
      const res = await fetch('/api/auth/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nickname.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Error');
        return;
      }

      setSecurityQuestionLabel(data.securityQuestion.label);
      setStep('verify');
    } catch {
      toast.error('Error de conexion');
    } finally {
      setLoadingNickname(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyInput.trim()) {
      toast.error(method === 'code' ? 'Ingresa el codigo de recuperacion' : 'Ingresa tu respuesta');
      return;
    }

    setLoadingVerify(true);
    try {
      // Use the dedicated verify endpoint (does NOT change password)
      const res = await fetch('/api/auth/recover/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: nickname.trim(),
          method,
          code: method === 'code' ? verifyInput.trim() : undefined,
          answer: method === 'question' ? verifyInput.trim() : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Verificacion fallida');
        return;
      }

      // Identity verified, move to new password step
      setStep('newpassword');
    } catch {
      toast.error('Error de conexion');
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Minimo 6 caracteres');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('Las contrasenas no coinciden');
      return;
    }

    setLoadingReset(true);
    try {
      const res = await fetch('/api/auth/recover', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: nickname.trim(),
          method,
          code: method === 'code' ? verifyInput.trim() : undefined,
          answer: method === 'question' ? verifyInput.trim() : undefined,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Error');
        return;
      }

      setStep('success');
    } catch {
      toast.error('Error de conexion');
    } finally {
      setLoadingReset(false);
    }
  };

  const handleClose = () => {
    if (step === 'success') {
      onBackToLogin();
      return;
    }
    onClose();
  };

  const title = locale === 'es' ? 'Restablecer Contraseña' : 'Reset Password';
  const subtitles: Record<Step, string> = {
    nickname: locale === 'es' ? 'Ingresa tu nickname para comenzar' : 'Enter your nickname to start',
    verify: locale === 'es' ? 'Verifica tu identidad' : 'Verify your identity',
    newpassword: locale === 'es' ? 'Establece tu nueva contraseña' : 'Set your new password',
    success: locale === 'es' ? 'Contraseña actualizada' : 'Password updated',
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={handleClose} />
        {/* Decorative blurs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#FF2D78]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#4D9FFF]/10 blur-3xl pointer-events-none" />

        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full max-w-md bg-[#0d0d24] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF2D78] to-[#4D9FFF]" />

          {/* Close button */}
          <button onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <X size={20} />
          </button>

          {/* Header */}
          <div className="flex justify-center mb-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              step === 'success'
                ? 'bg-green-500/20'
                : 'bg-gradient-to-r from-[#FF2D78] to-[#4D9FFF]'
            }`}>
              {step === 'success'
                ? <CheckCircle2 size={28} className="text-green-400" />
                : <KeyRound size={28} className="text-white" />
              }
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-white mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {title}
          </h2>
          <p className="text-white/50 text-center text-sm mb-6">
            {subtitles[step]}
          </p>

          {/* Step: Nickname */}
          {step === 'nickname' && (
            <form onSubmit={handleLookup} className="space-y-4">
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="text"
                  placeholder={locale === 'es' ? 'Tu nickname' : 'Your nickname'}
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  required
                  minLength={3}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#FF2D78]/50 focus:bg-white/8 transition-all"
                />
              </div>
              <button type="submit" disabled={loadingNickname}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF2D78] via-[#a855f7] to-[#4D9FFF] text-white font-bold text-sm hover:shadow-[0_0_25px_rgba(255,45,120,0.5)] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {loadingNickname ? <><Loader2 size={16} className="animate-spin" /> {t('common.loading')}</> : (locale === 'es' ? 'Continuar' : 'Continue')}
              </button>
              <button type="button" onClick={onBackToLogin}
                className="w-full py-2 rounded-xl text-sm text-white/40 hover:text-white/60 flex items-center justify-center gap-2 transition-colors">
                <ArrowLeft size={14} /> {locale === 'es' ? 'Volver al login' : 'Back to login'}
              </button>
            </form>
          )}

          {/* Step: Verify */}
          {step === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-4">
              {/* Method selector */}
              <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
                <button type="button"
                  onClick={() => { setMethod('code'); setVerifyInput(''); }}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    method === 'code'
                      ? 'bg-[#FF2D78]/20 text-[#FF2D78] border border-[#FF2D78]/30'
                      : 'text-white/40 hover:text-white/60'
                  }`}>
                  <KeyRound size={14} /> {locale === 'es' ? 'Codigo' : 'Code'}
                </button>
                <button type="button"
                  onClick={() => { setMethod('question'); setVerifyInput(''); }}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    method === 'question'
                      ? 'bg-[#4D9FFF]/20 text-[#4D9FFF] border border-[#4D9FFF]/30'
                      : 'text-white/40 hover:text-white/60'
                  }`}>
                  <Shield size={14} /> {locale === 'es' ? 'Pregunta' : 'Question'}
                </button>
              </div>

              {method === 'question' && (
                <div className="p-3 rounded-xl bg-[#4D9FFF]/5 border border-[#4D9FFF]/10">
                  <p className="text-xs text-white/50 mb-1">{locale === 'es' ? 'Tu pregunta de seguridad:' : 'Your security question:'}</p>
                  <p className="text-sm text-[#4D9FFF] font-medium">{securityQuestionLabel}</p>
                </div>
              )}

              {method === 'code' && (
                <div className="p-3 rounded-xl bg-[#FF2D78]/5 border border-[#FF2D78]/10">
                  <p className="text-xs text-white/50">
                    {locale === 'es'
                      ? 'Ingresa el codigo de recuperacion que recibiste al registrarte (formato XXXX-XXXX-XXXX-XXXX).'
                      : 'Enter the recovery code you received when you registered (XXXX-XXXX-XXXX-XXXX format).'}
                  </p>
                </div>
              )}

              <div className="relative">
                {method === 'code' ? (
                  <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                ) : (
                  <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                )}
                <input type={method === 'question' ? 'text' : 'text'}
                  placeholder={method === 'code'
                    ? (locale === 'es' ? 'XXXX-XXXX-XXXX-XXXX' : 'XXXX-XXXX-XXXX-XXXX')
                    : (locale === 'es' ? 'Tu respuesta' : 'Your answer')
                  }
                  value={verifyInput}
                  onChange={e => setVerifyInput(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#FF2D78]/50 transition-all"
                />
              </div>

              <button type="submit" disabled={loadingVerify}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF2D78] via-[#a855f7] to-[#4D9FFF] text-white font-bold text-sm hover:shadow-[0_0_25px_rgba(255,45,120,0.5)] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {loadingVerify ? <><Loader2 size={16} className="animate-spin" /> {t('common.loading')}</> : (locale === 'es' ? 'Verificar' : 'Verify')}
              </button>

              <button type="button" onClick={() => { setStep('nickname'); setVerifyInput(''); }}
                className="w-full py-2 rounded-xl text-sm text-white/40 hover:text-white/60 flex items-center justify-center gap-2 transition-colors">
                <ArrowLeft size={14} /> {locale === 'es' ? 'Volver' : 'Back'}
              </button>
            </form>
          )}

          {/* Step: New Password */}
          {step === 'newpassword' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input type={showNewPassword ? 'text' : 'password'}
                  placeholder={locale === 'es' ? 'Nueva contraseña' : 'New password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#FF2D78]/50 transition-all"
                />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="password"
                  placeholder={locale === 'es' ? 'Confirmar nueva contraseña' : 'Confirm new password'}
                  value={confirmNewPassword}
                  onChange={e => setConfirmNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#FF2D78]/50 transition-all"
                />
              </div>

              <button type="submit" disabled={loadingReset}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#4D9FFF] text-white font-bold text-sm hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {loadingReset ? <><Loader2 size={16} className="animate-spin" /> {t('common.loading')}</> : (locale === 'es' ? 'Cambiar Contraseña' : 'Change Password')}
              </button>

              <button type="button" onClick={() => { setStep('verify'); setNewPassword(''); setConfirmNewPassword(''); }}
                className="w-full py-2 rounded-xl text-sm text-white/40 hover:text-white/60 flex items-center justify-center gap-2 transition-colors">
                <ArrowLeft size={14} /> {locale === 'es' ? 'Volver' : 'Back'}
              </button>
            </form>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10 text-center">
                <p className="text-sm text-green-400 font-medium">
                  {locale === 'es' ? 'Tu contraseña ha sido actualizada exitosamente.' : 'Your password has been updated successfully.'}
                </p>
              </div>
              <button onClick={onBackToLogin}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#4D9FFF] text-white font-bold text-sm hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] transition-all flex items-center justify-center gap-2">
                {locale === 'es' ? 'Ir a Iniciar Sesion' : 'Go to Login'}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

