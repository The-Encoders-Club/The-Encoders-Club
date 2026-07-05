'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Eye, EyeOff, Sparkles, Shield, Copy, Download, CheckCircle2, KeyRound, Loader2, AlertTriangle, Ban, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '@/hooks/useLocale';
import { SECURITY_QUESTIONS } from '@/lib/auth';

interface AuthModalProps {
  mode: 'login' | 'register';
  onClose: () => void;
  onSwitch: (mode: 'login' | 'register') => void;
  onForgotPassword: () => void;
  onSuccess: () => void;
}

export function AuthModal({ mode, onClose, onSwitch, onForgotPassword, onSuccess }: AuthModalProps) {
  const { t, locale } = useI18n();
  const isEs = locale === 'es';
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [remember, setRemember] = useState(false);
  // Honeypot
  const [honeypot, setHoneypot] = useState('');

  // Security question (register only)
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');

  // Recovery code display (register only)
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Banned account info (login only)
  const [bannedInfo, setBannedInfo] = useState<{ reason: string } | null>(null);

  const isLogin = mode === 'login';

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCodeCopied(true);
      toast.success(isEs ? 'Codigo copiado' : 'Code copied');
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      toast.error(isEs ? 'No se pudo copiar' : 'Could not copy');
    }
  };

  const downloadAsTxt = (code: string) => {
    const content = isEs
      ? `=== The Encoders Club - Codigo de Recuperacion ===\n\nNickname: ${nickname}\nCodigo: ${code}\n\nIMPORTANTE: Guarda este codigo en un lugar seguro.\nSolo se muestra UNA vez y no podras verlo de nuevo.\n\n=== The Encoders Club - Recovery Code ===\n\nNickname: ${nickname}\nCode: ${code}\n\nIMPORTANT: Keep this code in a safe place.\nIt is shown ONLY ONCE and you will not be able to see it again.`
      : `=== The Encoders Club - Recovery Code ===\n\nNickname: ${nickname}\nCode: ${code}\n\nIMPORTANT: Keep this code in a safe place.\nIt is shown ONLY ONCE and you will not be able to see it again.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recovery-code-${nickname}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(isEs ? 'Archivo descargado' : 'File downloaded');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // bot detected

    // Register validation
    if (!isLogin) {
      if (password !== confirmPassword) {
        toast.error(isEs ? 'Las contrasenas no coinciden' : 'Passwords do not match');
        return;
      }
      if (!securityQuestion) {
        toast.error(isEs ? 'Selecciona una pregunta de seguridad' : 'Select a security question');
        return;
      }
      if (!securityAnswer.trim() || securityAnswer.trim().length < 2) {
        toast.error(isEs ? 'La respuesta de seguridad es muy corta (min. 2 caracteres)' : 'Security answer is too short (min. 2 characters)');
        return;
      }
    }

    setLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin
        ? { nickname, password, remember }
        : { nickname, password, confirmPassword, securityQuestion, securityAnswer, remember };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        // Detect banned account and show reason prominently
        if (res.status === 403 && data.banned) {
          setBannedInfo({ reason: data.banReason || (isEs ? 'Sin razón especificada.' : 'No reason specified.') });
          toast.error(isEs ? 'Cuenta baneada' : 'Account banned', {
            description: data.banReason || '',
          });
          return;
        }
        toast.error(data.error || 'Error');
        return;
      }

      // Registration: show recovery code
      if (!isLogin && data.recoveryCode) {
        setRecoveryCode(data.recoveryCode);
        setShowCode(true);
        toast.success(isEs ? 'Registro exitoso' : 'Registration successful', {
          description: data.user.nickname,
        });
        return; // Don't close modal yet, show code first
      }

      toast.success(isLogin ? t('auth.loginSuccess') : t('auth.registerSuccess'), {
        description: isLogin ? `${data.user.nickname}` : '',
      });
      onSuccess();
    } catch {
      toast.error('Error de conexion');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAfterCode = () => {
    onSuccess();
  };

  // Recovery Code Display — Cyberpunk/IDE/Anime themed
  if (showCode && recoveryCode) {
    return (
      <AnimatePresence>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={handleCloseAfterCode} />
          {/* Anime-style decorative orbs — Monika green + Yuri purple */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#22C55E]/8 blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#9d4edd]/8 blur-3xl pointer-events-none" />

          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-md bg-[#0d0d24] border border-green-500/20 clip-card p-8 shadow-2xl overflow-hidden">
            {/* Top gradient bar — brand gradient */}
            <div className="absolute top-0 left-0 w-full h-1 brand-gradient" />

            {/* IDE label */}
            <span className="font-code text-[10px] font-bold text-green-400/60 uppercase tracking-widest block mb-4">
              {'// '}{isEs ? 'codigo de recuperacion' : 'recovery code'}
            </span>

            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 clip-card bg-green-500/10 border border-green-500/25 flex items-center justify-center animate-pulse-glow">
                <KeyRound size={28} className="text-green-400" />
              </div>
            </div>

            <h2 className="font-cyber text-xl sm:text-2xl font-bold text-center text-white mb-2 uppercase">
              {isEs ? 'Codigo de Recuperacion' : 'Recovery Code'}
            </h2>

            {/* Anime DDLC-style poetic warning */}
            <p className="text-center font-code text-[10px] text-[#9d4edd]/50 mb-4 italic">
              &ldquo;{isEs ? 'Cada codigo es unico, como un poema que solo se lee una vez' : 'Every code is unique, like a poem read only once'}&rdquo;
            </p>

            <div className="p-3 clip-card bg-amber-500/5 border border-amber-500/15 mb-6">
              <div className="flex items-start gap-2">
                <AlertTriangle size={14} className="text-amber-400 mt-0.5 shrink-0" />
                <p className="font-code text-[10px] text-white/50 leading-relaxed">
                  {isEs
                    ? 'Este codigo se muestra UNA SOLA VEZ. Guardalo en un lugar seguro. Lo necesitaras si olvidas tu contrasena.'
                    : 'This code is shown ONLY ONCE. Keep it in a safe place. You will need it if you forget your password.'}
                </p>
              </div>
            </div>

            {/* Code display — IDE terminal style */}
            <div className="p-4 bg-[#080812] border border-green-500/15 mb-4 relative">
              <span className="absolute top-2 right-3 font-code text-[8px] text-green-400/30 uppercase">read-only</span>
              <p className="text-center font-code text-xl sm:text-2xl tracking-[0.2em] text-[#22C55E] font-bold">
                {recoveryCode}
              </p>
            </div>

            {/* Action buttons — Cyberpunk clip-btn */}
            <div className="flex gap-3 mb-6">
              <button onClick={() => copyToClipboard(recoveryCode)}
                className={`flex-1 clip-btn py-2.5 text-sm font-cyber font-bold flex items-center justify-center gap-2 border transition-all uppercase tracking-wider text-xs ${
                  codeCopied
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-green-500/30'
                }`}>
                {codeCopied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                {codeCopied ? (isEs ? 'Copiado' : 'Copied') : (isEs ? 'Copiar' : 'Copy')}
              </button>
              <button onClick={() => downloadAsTxt(recoveryCode)}
                className="flex-1 clip-btn py-2.5 bg-white/5 border border-white/10 text-white/70 text-xs font-cyber font-bold flex items-center justify-center gap-2 hover:bg-white/10 hover:border-green-500/30 transition-all uppercase tracking-wider">
                <Download size={14} /> {isEs ? 'Descargar .txt' : 'Download .txt'}
              </button>
            </div>

            <button onClick={handleCloseAfterCode}
              className="w-full btn-primary text-sm py-3 uppercase tracking-wider">
              {isEs ? 'Entendido, continuar' : 'Got it, continue'}
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
        {/* Decorative blurs — Anime character colors: Monika pink + Yuri purple + Natsuki cyan */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#FF2D78]/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#9d4edd]/8 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 w-40 h-40 rounded-full bg-[#00F2FE]/5 blur-3xl pointer-events-none" />

        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full max-w-md bg-[#0d0d24] border border-white/8 clip-card p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-hide">
          {/* Top brand gradient bar */}
          <div className="absolute top-0 left-0 w-full h-1 brand-gradient" />

          {/* IDE section label */}
          <span className="font-code text-[10px] font-bold text-[#FF2D78]/50 uppercase tracking-widest block mb-4">
            {'// '}{isLogin ? (isEs ? 'iniciar sesion' : 'login') : (isEs ? 'registro' : 'register')}
          </span>

          {/* Close button — Cyberpunk clip-btn */}
          <button onClick={onClose}
            className="absolute top-4 right-4 clip-btn w-9 h-9 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all">
            <X size={16} />
          </button>

          {/* Icon — Cyberpunk clip-card + Anime glow */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 clip-card bg-gradient-to-r from-[#FF2D78] to-[#9d4edd] flex items-center justify-center animate-pulse-glow">
              {isLogin ? <Lock size={28} className="text-white" /> : <Sparkles size={28} className="text-white" />}
            </div>
          </div>

          <h2 className="font-cyber text-xl sm:text-2xl font-bold text-center text-white mb-1 uppercase tracking-tight">
            {isLogin ? t('auth.login') : t('auth.register')}
          </h2>

          {/* Anime DDLC-style poetic subtitle */}
          <p className="font-code text-[10px] text-center text-white/30 mb-6 italic">
            {isLogin
              ? (isEs ? 'Bienvenido de vuelta al club...' : 'Welcome back to the club...')
              : (isEs ? 'Cada nuevo miembro escribe una nueva pagina...' : 'Every new member writes a new page...')
            }
          </p>

          {/* Banned account banner — shows the reason set by the admin */}
          {isLogin && bannedInfo && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3.5 clip-card bg-red-500/8 border border-red-500/30"
            >
              <div className="flex items-start gap-2.5">
                <Ban size={16} className="text-red-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-cyber text-xs font-bold text-red-300 uppercase tracking-wider mb-1">
                    {isEs ? 'Cuenta baneada' : 'Account banned'}
                  </p>
                  <p className="font-code text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
                    {isEs ? 'Razón:' : 'Reason:'}
                  </p>
                  <p className="font-code text-xs text-red-200/90 leading-relaxed break-words">
                    {bannedInfo.reason}
                  </p>
                  <p className="font-code text-[10px] text-white/30 mt-2 leading-relaxed">
                    {isEs
                      ? 'Si crees que esto es un error, contacta a un administrador.'
                      : 'If you believe this is a mistake, contact an administrator.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot - hidden from users */}
            <input type="text" name="website" value={honeypot} onChange={e => setHoneypot(e.target.value)}
              tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px', opacity: 0 }} />

            {/* Nickname — IDE terminal style */}
            <div>
              <label className="font-code text-[10px] font-bold text-white/35 uppercase tracking-widest block mb-1.5">
                <span className="text-[#FF2D78]">{'>'}</span> Nickname
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF2D78]/40" />
                <input type="text" placeholder={isEs ? 'Tu nickname' : 'Your nickname'} value={nickname}
                  onChange={e => { setNickname(e.target.value); if (bannedInfo) setBannedInfo(null); }} required minLength={3}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#080812] border border-[#FF2D78]/15 text-white font-code text-sm placeholder:text-white/20 focus:outline-none focus:border-[#FF2D78]/40 focus:shadow-[0_0_10px_rgba(255,45,120,0.1)] transition-all" />
              </div>
            </div>

            {/* Password — IDE terminal style */}
            <div>
              <label className="font-code text-[10px] font-bold text-white/35 uppercase tracking-widest block mb-1.5">
                <span className="text-[#9d4edd]">{'>'}</span> {isEs ? 'Contrasena' : 'Password'}
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9d4edd]/40" />
                <input type={showPassword ? 'text' : 'password'} placeholder={isEs ? 'Minimo 6 caracteres' : 'Minimum 6 characters'}
                  value={password} onChange={e => { setPassword(e.target.value); if (bannedInfo) setBannedInfo(null); }} required minLength={6}
                  className="w-full pl-9 pr-10 py-2.5 bg-[#080812] border border-[#9d4edd]/15 text-white font-code text-sm placeholder:text-white/20 focus:outline-none focus:border-[#9d4edd]/40 focus:shadow-[0_0_10px_rgba(157,78,221,0.1)] transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Confirm Password — only register, Yuri purple themed */}
            {!isLogin && (
              <div>
                <label className="font-code text-[10px] font-bold text-white/35 uppercase tracking-widest block mb-1.5">
                  <span className="text-[#9d4edd]">{'>'}</span> {isEs ? 'Confirmar contrasena' : 'Confirm password'}
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9d4edd]/40" />
                  <input type={showConfirm ? 'text' : 'password'}
                    placeholder={isEs ? 'Repite la contrasena' : 'Repeat the password'} value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)} required minLength={6}
                    className="w-full pl-9 pr-10 py-2.5 bg-[#080812] border border-[#9d4edd]/15 text-white font-code text-sm placeholder:text-white/20 focus:outline-none focus:border-[#9d4edd]/40 focus:shadow-[0_0_10px_rgba(157,78,221,0.1)] transition-all" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            )}

            {/* Security Question — only register, Natsuki cyan themed */}
            {!isLogin && (
              <>
                <div>
                  <label className="font-code text-[10px] font-bold text-white/35 uppercase tracking-widest block mb-1.5">
                    <span className="text-[#00F2FE]">{'>'}</span> {isEs ? 'Pregunta de seguridad' : 'Security question'}
                  </label>
                  <div className="relative">
                    <Shield size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00F2FE]/40" />
                    <select value={securityQuestion}
                      onChange={e => setSecurityQuestion(e.target.value)}
                      required
                      className="w-full pl-9 pr-4 py-2.5 bg-[#080812] border border-[#00F2FE]/15 text-white font-code text-sm focus:outline-none focus:border-[#00F2FE]/40 focus:shadow-[0_0_10px_rgba(0,242,254,0.1)] transition-all appearance-none cursor-pointer">
                      <option value="" disabled className="bg-[#080812] text-white/40">
                        {isEs ? 'Selecciona una pregunta *' : 'Select a question *'}
                      </option>
                      {SECURITY_QUESTIONS.map(q => (
                        <option key={q.value} value={q.value} className="bg-[#080812] text-white">
                          {isEs ? q.label_es : q.label_en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-code text-[10px] font-bold text-white/35 uppercase tracking-widest block mb-1.5">
                    <span className="text-[#00F2FE]">{'>'}</span> {isEs ? 'Tu respuesta' : 'Your answer'}
                  </label>
                  <div className="relative">
                    <Shield size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00F2FE]/40" />
                    <input type="text"
                      placeholder={isEs ? 'Respuesta de seguridad *' : 'Security answer *'}
                      value={securityAnswer}
                      onChange={e => setSecurityAnswer(e.target.value)}
                      required
                      minLength={2}
                      className="w-full pl-9 pr-4 py-2.5 bg-[#080812] border border-[#00F2FE]/15 text-white font-code text-sm placeholder:text-white/20 focus:outline-none focus:border-[#00F2FE]/40 focus:shadow-[0_0_10px_rgba(0,242,254,0.1)] transition-all" />
                  </div>
                </div>
              </>
            )}

            {/* Remember me + Forgot password — only login */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 font-code text-[11px] text-white/40 cursor-pointer">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                    className="accent-[#FF2D78]" />
                  {t('auth.rememberMe')}
                </label>
                <button type="button" onClick={onForgotPassword}
                  className="font-code text-[11px] text-[#FF2D78]/70 hover:text-[#FF2D78] transition-colors">
                  {t('auth.forgotPassword')}
                </button>
              </div>
            )}

            {/* Submit button — Cyberpunk clip-btn + brand gradient */}
            <button type="submit" disabled={loading}
              className="w-full btn-primary text-sm py-3 uppercase tracking-wider disabled:opacity-50">
              {loading ? <><Loader2 size={14} className="animate-spin" /> {t('common.loading')}</> : isLogin ? t('auth.login') : t('auth.register')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-code text-[11px] text-white/30">
              {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
              <button onClick={() => onSwitch(isLogin ? 'register' : 'login')}
                className="text-[#FF2D78] font-cyber font-bold hover:underline ml-1 text-xs uppercase tracking-wider">
                {isLogin ? t('auth.register') : t('auth.login')}
              </button>
            </p>
          </div>

          {/* Security indicators — Anime DDLC character themed */}
          {!isLogin && (
            <div className="mt-4 flex items-center justify-center gap-4 text-[9px]">
              <div className="flex items-center gap-1.5 font-code text-white/25">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
                <span>{isEs ? 'Cifrado' : 'Encryption'}</span>
              </div>
              <div className="flex items-center gap-1.5 font-code text-white/25">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF2D78] shadow-[0_0_6px_rgba(255,45,120,0.5)]" />
                <span>{isEs ? 'Anti-spam' : 'Anti-spam'}</span>
              </div>
              <div className="flex items-center gap-1.5 font-code text-white/25">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9d4edd] shadow-[0_0_6px_rgba(157,78,221,0.5)]" />
                <span>{isEs ? 'Proteccion' : 'Protection'}</span>
              </div>
            </div>
          )}

          {/* DDLC decorative line — Monika style */}
          <div className="mt-5 w-full h-px bg-gradient-to-r from-transparent via-[#FF2D78]/15 to-transparent" />
          <p className="text-center font-code text-[8px] text-white/15 mt-2 tracking-wider">
            THE ENCODERS CLUB &middot; {isEs ? 'SISTEMA SEGURO' : 'SECURE SYSTEM'}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
