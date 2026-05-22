'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Eye, EyeOff, Sparkles, Shield, Copy, Download, CheckCircle2, KeyRound, Loader2, AlertTriangle } from 'lucide-react';
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
        toast.error(isEs ? 'Las contraseñas no coinciden' : 'Passwords do not match');
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

  // Recovery Code Display
  if (showCode && recoveryCode) {
    return (
      <AnimatePresence>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={handleCloseAfterCode} />
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#22C55E]/10 blur-3xl pointer-events-none" />

          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-md bg-[#0d0d24] border border-green-500/20 rounded-3xl p-8 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#22C55E] to-[#4D9FFF]" />

            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center">
                <KeyRound size={28} className="text-green-400" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-white mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {isEs ? 'Codigo de Recuperacion' : 'Recovery Code'}
            </h2>

            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 mb-6">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-white/60">
                  {isEs
                    ? 'Este codigo se muestra UNA SOLA VEZ. Guardalo en un lugar seguro. Lo necesitaras si olvidas tu contraseña.'
                    : 'This code is shown ONLY ONCE. Keep it in a safe place. You will need it if you forget your password.'}
                </p>
              </div>
            </div>

            {/* Code display */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
              <p className="text-center font-mono text-2xl tracking-[0.2em] text-[#FF2D78] font-bold mb-1"
                style={{ fontFamily: "'Space Grotesk', monospace" }}>
                {recoveryCode}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mb-6">
              <button onClick={() => copyToClipboard(recoveryCode)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-all ${
                  codeCopied
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}>
                {codeCopied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                {codeCopied ? (isEs ? 'Copiado' : 'Copied') : (isEs ? 'Copiar' : 'Copy')}
              </button>
              <button onClick={() => downloadAsTxt(recoveryCode)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                <Download size={16} /> {isEs ? 'Descargar .txt' : 'Download .txt'}
              </button>
            </div>

            <button onClick={handleCloseAfterCode}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#4D9FFF] text-white font-bold text-sm hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] transition-all">
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
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
        {/* Decorative blurs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#FF2D78]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#4D9FFF]/10 blur-3xl pointer-events-none" />

        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full max-w-md bg-[#0d0d24] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
          <div className="absolute top-0 left-0 w-full h-1 brand-gradient" />

          {/* Close button */}
          <button onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <X size={20} />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#FF2D78] to-[#4D9FFF] flex items-center justify-center animate-pulse-glow">
              <Sparkles className="text-white" size={28} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-white mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {isLogin ? t('auth.login') : t('auth.register')}
          </h2>
          <p className="text-white/50 text-center text-sm mb-6">
            {isLogin ? (t('auth.loginSuccess').replace('!', '')) : t('auth.noAccount').replace('?', '')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot - hidden from users */}
            <input type="text" name="website" value={honeypot} onChange={e => setHoneypot(e.target.value)}
              tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px', opacity: 0 }} />

            {/* Nickname - always shown */}
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="text" placeholder={`${t('auth.nickname')} *`} value={nickname}
                onChange={e => setNickname(e.target.value)} required minLength={3}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#FF2D78]/50 focus:bg-white/8 transition-all" />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input type={showPassword ? 'text' : 'password'} placeholder={`${t('auth.password')} *`}
                value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#FF2D78]/50 transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Confirm Password - only register */}
            {!isLogin && (
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input type={showConfirm ? 'text' : 'password'}
                  placeholder={`${t('auth.confirmPassword')} *`} value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)} required minLength={6}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#FF2D78]/50 transition-all" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            )}

            {/* Security Question - only register */}
            {!isLogin && (
              <>
                <div className="relative">
                  <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <select value={securityQuestion}
                    onChange={e => setSecurityQuestion(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2D78]/50 transition-all appearance-none cursor-pointer">
                    <option value="" disabled className="bg-[#0d0d24] text-white/40">
                      {isEs ? 'Selecciona una pregunta de seguridad *' : 'Select a security question *'}
                    </option>
                    {SECURITY_QUESTIONS.map(q => (
                      <option key={q.value} value={q.value} className="bg-[#0d0d24] text-white">
                        {isEs ? q.label_es : q.label_en}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input type="text"
                    placeholder={isEs ? 'Tu respuesta de seguridad *' : 'Your security answer *'}
                    value={securityAnswer}
                    onChange={e => setSecurityAnswer(e.target.value)}
                    required
                    minLength={2}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#FF2D78]/50 transition-all" />
                </div>
              </>
            )}

            {/* Remember me + Forgot password - only login */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-white/50 cursor-pointer">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                    className="accent-[#FF2D78]" />
                  {t('auth.rememberMe')}
                </label>
                <button type="button" onClick={onForgotPassword}
                  className="text-sm text-[#FF2D78] hover:underline">
                  {t('auth.forgotPassword')}
                </button>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF2D78] via-[#a855f7] to-[#4D9FFF] text-white font-bold text-sm hover:shadow-[0_0_25px_rgba(255,45,120,0.5)] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> {t('common.loading')}</> : isLogin ? t('auth.login') : t('auth.register')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/40">
              {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
              <button onClick={() => onSwitch(isLogin ? 'register' : 'login')}
                className="text-[#FF2D78] font-semibold hover:underline ml-1">
                {isLogin ? t('auth.register') : t('auth.login')}
              </button>
            </p>
          </div>

          {/* Visual confirmation animation for register */}
          {!isLogin && (
            <div className="mt-4 flex items-center justify-center gap-4 text-white/20 text-xs">
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#22c55e]" /> {isEs ? 'Cifrado de contraseñas' : 'Password encryption'}</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#4D9FFF]" /> {isEs ? 'Proteccion anti-spam' : 'Anti-spam protection'}</div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
