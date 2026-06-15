'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Eye, EyeOff, Shield, KeyRound, ArrowLeft, CheckCircle2, Copy, Download, Loader2, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '@/hooks/useLocale';

interface RecoveryModalProps {
  onClose: () => void;
  onBackToLogin: () => void;
}

type Step = 'nickname' | 'verify' | 'newpassword' | 'success';

export function RecoveryModal({ onClose, onBackToLogin }: RecoveryModalProps) {
  const { t, locale } = useI18n();
  const isEs = locale === 'es';

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

  const stepLabels: Record<Step, string> = {
    nickname: isEs ? 'buscar cuenta' : 'find account',
    verify: isEs ? 'verificar identidad' : 'verify identity',
    newpassword: isEs ? 'nueva contrasena' : 'new password',
    success: isEs ? 'completado' : 'completed',
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={handleClose} />
        {/* Decorative blurs — Anime character colors */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#FF2D78]/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#9d4edd]/8 blur-3xl pointer-events-none" />

        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full max-w-md bg-[#0d0d24] border border-white/8 clip-card p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-hide">
          {/* Top brand gradient bar */}
          <div className="absolute top-0 left-0 w-full h-1 brand-gradient" />

          {/* IDE section label */}
          <span className="font-code text-[10px] font-bold text-[#9d4edd]/50 uppercase tracking-widest block mb-4">
            {'// '}{stepLabels[step]}
          </span>

          {/* Close button — Cyberpunk clip-btn */}
          <button onClick={handleClose}
            className="absolute top-4 right-4 clip-btn w-9 h-9 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all">
            <X size={16} />
          </button>

          {/* Header icon — step-aware */}
          <div className="flex justify-center mb-6">
            <div className={`w-16 h-16 clip-card flex items-center justify-center ${
              step === 'success'
                ? 'bg-green-500/10 border border-green-500/25 animate-pulse-glow'
                : 'bg-gradient-to-r from-[#9d4edd] to-[#00F2FE] animate-pulse-glow'
            }`}>
              {step === 'success'
                ? <CheckCircle2 size={28} className="text-green-400" />
                : <KeyRound size={28} className="text-white" />
              }
            </div>
          </div>

          <h2 className="font-cyber text-xl sm:text-2xl font-bold text-center text-white mb-1 uppercase tracking-tight">
            {isEs ? 'Restablecer Contrasena' : 'Reset Password'}
          </h2>

          {/* Step indicator — IDE terminal style */}
          <div className="flex justify-center gap-2 mb-2">
            {(['nickname', 'verify', 'newpassword', 'success'] as Step[]).map((s, i) => (
              <div key={s} className={`w-6 h-1 clip-btn transition-all duration-300 ${
                step === s
                  ? 'bg-[#FF2D78] shadow-[0_0_8px_rgba(255,45,120,0.4)]'
                  : (['nickname', 'verify', 'newpassword', 'success'].indexOf(step) > i
                    ? 'bg-[#9d4edd]/40'
                    : 'bg-white/8'
                  )
              }`} />
            ))}
          </div>

          {/* Anime DDLC-style poetic subtitle */}
          <p className="font-code text-[10px] text-center text-white/30 mb-6 italic">
            {step === 'nickname' && (isEs ? 'Todo tiene un inicio...' : 'Everything has a beginning...')}
            {step === 'verify' && (isEs ? 'Demuestra quien eres realmente...' : 'Prove who you really are...')}
            {step === 'newpassword' && (isEs ? 'Un nuevo capitulo comienza...' : 'A new chapter begins...')}
            {step === 'success' && (isEs ? 'Renaciste como el fenix...' : 'You were reborn like the phoenix...')}
          </p>

          {/* Step: Nickname */}
          {step === 'nickname' && (
            <form onSubmit={handleLookup} className="space-y-4">
              <div>
                <label className="font-code text-[10px] font-bold text-white/35 uppercase tracking-widest block mb-1.5">
                  <span className="text-[#FF2D78]">{'>'}</span> Nickname
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF2D78]/40" />
                  <input type="text"
                    placeholder={isEs ? 'Tu nickname' : 'Your nickname'}
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    required
                    minLength={3}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#080812] border border-[#FF2D78]/15 text-white font-code text-sm placeholder:text-white/20 focus:outline-none focus:border-[#FF2D78]/40 focus:shadow-[0_0_10px_rgba(255,45,120,0.1)] transition-all"
                  />
                </div>
              </div>
              <button type="submit" disabled={loadingNickname}
                className="w-full btn-primary text-sm py-3 uppercase tracking-wider disabled:opacity-50">
                {loadingNickname ? <><Loader2 size={14} className="animate-spin" /> {t('common.loading')}</> : (isEs ? 'Continuar' : 'Continue')}
              </button>
              <button type="button" onClick={onBackToLogin}
                className="w-full py-2 font-code text-[11px] text-white/30 hover:text-white/50 flex items-center justify-center gap-2 transition-colors">
                <ArrowLeft size={12} /> {isEs ? 'Volver al login' : 'Back to login'}
              </button>
            </form>
          )}

          {/* Step: Verify */}
          {step === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-4">
              {/* Method selector — Cyberpunk clip-btn tabs */}
              <div className="flex gap-2">
                <button type="button"
                  onClick={() => { setMethod('code'); setVerifyInput(''); }}
                  className={`flex-1 clip-btn py-2.5 text-xs font-cyber font-bold flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider ${
                    method === 'code'
                      ? 'bg-[#FF2D78]/10 border border-[#FF2D78]/30 text-[#FF2D78] shadow-[0_0_10px_rgba(255,45,120,0.15)]'
                      : 'bg-white/3 border border-white/8 text-white/35 hover:text-white/50 hover:bg-white/5'
                  }`}>
                  <KeyRound size={12} /> {isEs ? 'Codigo' : 'Code'}
                </button>
                <button type="button"
                  onClick={() => { setMethod('question'); setVerifyInput(''); }}
                  className={`flex-1 clip-btn py-2.5 text-xs font-cyber font-bold flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider ${
                    method === 'question'
                      ? 'bg-[#00F2FE]/10 border border-[#00F2FE]/30 text-[#00F2FE] shadow-[0_0_10px_rgba(0,242,254,0.15)]'
                      : 'bg-white/3 border border-white/8 text-white/35 hover:text-white/50 hover:bg-white/5'
                  }`}>
                  <Shield size={12} /> {isEs ? 'Pregunta' : 'Question'}
                </button>
              </div>

              {/* Method info boxes */}
              {method === 'question' && (
                <div className="p-3 clip-card bg-[#00F2FE]/5 border border-[#00F2FE]/10">
                  <p className="font-code text-[9px] text-white/40 mb-1 uppercase">{isEs ? 'Tu pregunta de seguridad:' : 'Your security question:'}</p>
                  <p className="font-code text-xs text-[#00F2FE] font-medium">{securityQuestionLabel}</p>
                </div>
              )}

              {method === 'code' && (
                <div className="p-3 clip-card bg-[#FF2D78]/5 border border-[#FF2D78]/10">
                  <p className="font-code text-[10px] text-white/40 leading-relaxed">
                    {isEs
                      ? 'Ingresa el codigo de recuperacion que recibiste al registrarte (formato XXXX-XXXX-XXXX-XXXX).'
                      : 'Enter the recovery code you received when you registered (XXXX-XXXX-XXXX-XXXX format).'}
                  </p>
                </div>
              )}

              {/* Verify input — IDE terminal style */}
              <div>
                <label className="font-code text-[10px] font-bold text-white/35 uppercase tracking-widest block mb-1.5">
                  <span className={method === 'code' ? 'text-[#FF2D78]' : 'text-[#00F2FE]'}>{'>'}</span>{' '}
                  {method === 'code' ? (isEs ? 'Codigo' : 'Code') : (isEs ? 'Respuesta' : 'Answer')}
                </label>
                <div className="relative">
                  {method === 'code' ? (
                    <KeyRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF2D78]/40" />
                  ) : (
                    <Shield size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00F2FE]/40" />
                  )}
                  <input type="text"
                    placeholder={method === 'code'
                      ? 'XXXX-XXXX-XXXX-XXXX'
                      : (isEs ? 'Tu respuesta' : 'Your answer')
                    }
                    value={verifyInput}
                    onChange={e => setVerifyInput(e.target.value)}
                    required
                    className={`w-full pl-9 pr-4 py-2.5 bg-[#080812] text-white font-code text-sm placeholder:text-white/20 focus:outline-none transition-all ${
                      method === 'code'
                        ? 'border border-[#FF2D78]/15 focus:border-[#FF2D78]/40 focus:shadow-[0_0_10px_rgba(255,45,120,0.1)]'
                        : 'border border-[#00F2FE]/15 focus:border-[#00F2FE]/40 focus:shadow-[0_0_10px_rgba(0,242,254,0.1)]'
                    }`}
                  />
                </div>
              </div>

              <button type="submit" disabled={loadingVerify}
                className="w-full btn-primary text-sm py-3 uppercase tracking-wider disabled:opacity-50">
                {loadingVerify ? <><Loader2 size={14} className="animate-spin" /> {t('common.loading')}</> : (isEs ? 'Verificar' : 'Verify')}
              </button>

              <button type="button" onClick={() => { setStep('nickname'); setVerifyInput(''); }}
                className="w-full py-2 font-code text-[11px] text-white/30 hover:text-white/50 flex items-center justify-center gap-2 transition-colors">
                <ArrowLeft size={12} /> {isEs ? 'Volver' : 'Back'}
              </button>
            </form>
          )}

          {/* Step: New Password */}
          {step === 'newpassword' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="font-code text-[10px] font-bold text-white/35 uppercase tracking-widest block mb-1.5">
                  <span className="text-[#9d4edd]">{'>'}</span> {isEs ? 'Nueva contrasena' : 'New password'}
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9d4edd]/40" />
                  <input type={showNewPassword ? 'text' : 'password'}
                    placeholder={isEs ? 'Minimo 6 caracteres' : 'Minimum 6 characters'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-9 pr-10 py-2.5 bg-[#080812] border border-[#9d4edd]/15 text-white font-code text-sm placeholder:text-white/20 focus:outline-none focus:border-[#9d4edd]/40 focus:shadow-[0_0_10px_rgba(157,78,221,0.1)] transition-all"
                  />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                    {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-code text-[10px] font-bold text-white/35 uppercase tracking-widest block mb-1.5">
                  <span className="text-[#9d4edd]">{'>'}</span> {isEs ? 'Confirmar contrasena' : 'Confirm password'}
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9d4edd]/40" />
                  <input type="password"
                    placeholder={isEs ? 'Repite la nueva contrasena' : 'Repeat the new password'}
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#080812] border border-[#9d4edd]/15 text-white font-code text-sm placeholder:text-white/20 focus:outline-none focus:border-[#9d4edd]/40 focus:shadow-[0_0_10px_rgba(157,78,221,0.1)] transition-all"
                  />
                </div>
              </div>

              <button type="submit" disabled={loadingReset}
                className="w-full btn-primary text-sm py-3 uppercase tracking-wider disabled:opacity-50">
                {loadingReset ? <><Loader2 size={14} className="animate-spin" /> {t('common.loading')}</> : (isEs ? 'Cambiar Contrasena' : 'Change Password')}
              </button>

              <button type="button" onClick={() => { setStep('verify'); setNewPassword(''); setConfirmNewPassword(''); }}
                className="w-full py-2 font-code text-[11px] text-white/30 hover:text-white/50 flex items-center justify-center gap-2 transition-colors">
                <ArrowLeft size={12} /> {isEs ? 'Volver' : 'Back'}
              </button>
            </form>
          )}

          {/* Step: Success — Anime celebration style */}
          {step === 'success' && (
            <div className="space-y-4">
              <div className="p-4 clip-card bg-green-500/5 border border-green-500/15 text-center">
                <p className="font-code text-xs text-green-400 font-medium">
                  {isEs ? 'Tu contrasena ha sido actualizada exitosamente.' : 'Your password has been updated successfully.'}
                </p>
                {/* Anime DDLC-style poetic line */}
                <p className="font-code text-[9px] text-[#9d4edd]/40 mt-2 italic">
                  {isEs ? 'El renacer siempre trae una nueva esperanza' : 'Rebirth always brings new hope'}
                </p>
              </div>
              <button onClick={onBackToLogin}
                className="w-full btn-primary text-sm py-3 uppercase tracking-wider">
                {isEs ? 'Ir a Iniciar Sesion' : 'Go to Login'}
              </button>
            </div>
          )}

          {/* DDLC decorative line */}
          <div className="mt-5 w-full h-px bg-gradient-to-r from-transparent via-[#9d4edd]/15 to-transparent" />
          <p className="text-center font-code text-[8px] text-white/15 mt-2 tracking-wider">
            THE ENCODERS CLUB &middot; {isEs ? 'RECUPERACION SEGURA' : 'SECURE RECOVERY'}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
