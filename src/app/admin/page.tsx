'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, MessageSquare, DollarSign, Activity, Shield, Search,
  Ban, CheckCircle, UserCog, Trash2, Save, AlertTriangle, RefreshCw,
  Bot, Crown, Eye, EyeOff, TrendingUp, Zap, Globe,
  ArrowUpDown, Wifi, WifiOff, Loader2, Info,
  LayoutDashboard, FileText, ChevronLeft, Menu, X, Heart,
  UserPlus, LogIn, LogOut, ShieldCheck, MessageCircle, Bell, Download,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// ─── Interfaces ───
interface AdminUser {
  id: string; nickname: string; email?: string; avatar?: string;
  role: string; isPremium: boolean; isBanned: boolean; banReason?: string;
  discordLinked: boolean; discordId?: string; createdAt: string; commentCount?: number;
}
interface RecentComment {
  id: string; content: string; createdAt: string; isDeleted: boolean;
  reports: number; author: { nickname: string };
}
interface ActivityLog {
  id: string; action: string; details?: string; createdAt: string; user?: { nickname: string };
}
interface Donation {
  id: string; amount: number; currency: string; message?: string; createdAt: string;
}
interface StatsData {
  stats: {
    totalUsers: number;
    totalComments: number;
    totalDonations: number;
    totalVisits: number;
    totalDownloads: number;
    realVisits: number;
    realDownloads: number;
    visitsBase: number;
    downloadsBase: number;
  };
  recentUsers: { id: string; nickname: string; avatar?: string; role: string; createdAt: string }[];
  recentComments: RecentComment[]; recentLogs: ActivityLog[]; donations: Donation[];
  usersByRole: { role: string; _count: number }[];
}
interface DiscordConfig {
  id: string; serverId?: string; channelId?: string; webhookUrl?: string;
  modRoleId?: string; adminRoleId?: string; collabRoleId?: string;
  hasBotToken: boolean; discordClientId?: string; hasClientId: boolean;
  hasClientSecret: boolean; siteUrl?: string;
}
interface DiscordBotStatus {
  connected: boolean; configured: boolean; botUsername: string | null;
  botAvatar: string | null; botId?: string; isBot?: boolean;
  linkedUsers: number; server: { name: string | null; memberCount: number | null };
  roleConfig: { hasAdminRole: boolean; hasModRole: boolean; hasCollabRole: boolean };
  hasClientId: boolean; hasClientSecret: boolean; message: string;
}

// ─── Constants ───
const roleColors: Record<string, string> = {
  owner: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  admin: 'bg-red-500/20 text-red-400 border-red-500/30',
  moderator: 'bg-[#4D9FFF]/20 text-[#4D9FFF] border-[#4D9FFF]/30',
  collaborator: 'bg-green-500/20 text-green-400 border-green-500/30',
  user: 'bg-white/10 text-white/50 border-white/20',
};
const roleLabels: Record<string, string> = { owner: 'Owner', admin: 'Admin', moderator: 'Mod', collaborator: 'Colab', user: 'User' };
const actionLabels: Record<string, string> = {
  admin_user_updated: 'Usuario modificado',
  admin_user_update: 'Usuario modificado',
  discord_config_updated: 'Config Discord actualizada',
  discord_config_update: 'Config Discord actualizada',
  discord_role_sync: 'Rol sincronizado (Discord)',
  discord_linked: 'Discord vinculado',
  discord_unlinked: 'Discord desvinculado',
  discord_role_push: 'Roles empujados a Discord',
  user_login: 'Inicio de sesión',
  user_register: 'Registro',
  user_logout: 'Cierre de sesión',
  comment_create: 'Comentario creado',
  comment_deleted: 'Comentario eliminado',
  comment_delete: 'Comentario eliminado',
  comment_self_deleted: 'Comentario auto-eliminado',
  donation_received: 'Donación recibida',
  password_change: 'Contraseña cambiada',
  stats_config_updated: 'Config. de estadísticas actualizada',
};

const getActionColor = (action: string) => {
  if (action.includes('create') || action.includes('register') || action.includes('linked') || action.includes('received')) return 'text-green-400';
  if (action.includes('update') || action.includes('sync') || action.includes('push') || action.includes('login') || action.includes('logout')) return 'text-[#4D9FFF]';
  if (action.includes('delete') || action.includes('unlinked')) return 'text-red-400';
  if (action.includes('report')) return 'text-yellow-400';
  return 'text-white/50';
};

const getActionIcon = (action: string) => {
  if (action.includes('register') || action.includes('create')) return <UserPlus size={14} />;
  if (action.includes('login') || action.includes('logout')) return <LogIn size={14} />;
  if (action.includes('delete') || action.includes('unlinked')) return <Trash2 size={14} />;
  if (action.includes('update') || action.includes('sync') || action.includes('push')) return <RefreshCw size={14} />;
  if (action.includes('donation')) return <Heart size={14} />;
  if (action.includes('discord')) return <MessageCircle size={14} />;
  if (action.includes('password')) return <ShieldCheck size={14} />;
  return <Zap size={14} />;
};

const getActionDotColor = (action: string) => {
  if (action.includes('create') || action.includes('register') || action.includes('linked') || action.includes('received')) return 'bg-green-400';
  if (action.includes('update') || action.includes('sync') || action.includes('push') || action.includes('login') || action.includes('logout')) return 'bg-[#4D9FFF]';
  if (action.includes('delete') || action.includes('unlinked')) return 'bg-red-400';
  if (action.includes('report')) return 'bg-yellow-400';
  return 'bg-white/30';
};

const getActionBgColor = (action: string) => {
  if (action.includes('create') || action.includes('register') || action.includes('linked') || action.includes('received')) return 'bg-green-400/10';
  if (action.includes('update') || action.includes('sync') || action.includes('push') || action.includes('login') || action.includes('logout')) return 'bg-[#4D9FFF]/10';
  if (action.includes('delete') || action.includes('unlinked')) return 'bg-red-400/10';
  if (action.includes('report')) return 'bg-yellow-400/10';
  return 'bg-white/5';
};

// ─── Skeleton Component ───
const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-white/[0.04] ${className}`} />
);

// ─── Nav Items ───
const navItems = [
  { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
  { id: 'users', label: 'Usuarios', icon: Users },
  { id: 'comments', label: 'Comentarios', icon: MessageSquare },
  { id: 'discord', label: 'Discord', icon: MessageCircle },
  { id: 'logs', label: 'Actividad', icon: FileText },
];

// ─── Input Component ───
const AdminInput = ({ value, onChange, placeholder, type = 'text', className = '' }: {
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; type?: string; className?: string;
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF2D78]/50 focus:ring-1 focus:ring-[#FF2D78]/20 placeholder:text-white/25 transition-all ${className}`}
  />
);

// ─── Card Component ───
const AdminCard = ({ children, className = '', padding = true }: { children: React.ReactNode; className?: string; padding?: boolean }) => (
  <div className={`bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.07] rounded-2xl ${padding ? 'p-6' : ''} shadow-lg shadow-black/10 backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

// ─── Empty State Component ───
const EmptyState = ({ icon: Icon, message, submessage }: { icon: React.ElementType; message: string; submessage?: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-white/20">
    <Icon size={36} strokeWidth={1} />
    <p className="text-sm mt-3">{message}</p>
    {submessage && <p className="text-xs mt-1 text-white/15">{submessage}</p>}
  </div>
);

// ─── Main Component ───
export default function AdminPanel() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<StatsData | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [allComments, setAllComments] = useState<RecentComment[]>([]);
  const [discordConfig, setDiscordConfig] = useState<DiscordConfig | null>(null);
  const [botStatus, setBotStatus] = useState<DiscordBotStatus | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [discordLoading, setDiscordLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [showSyncDialog, setShowSyncDialog] = useState(false);
  const [showClientSecret, setShowClientSecret] = useState(false);
  const [roleChangeUser, setRoleChangeUser] = useState<AdminUser | null>(null);
  const [dcForm, setDcForm] = useState({
    webhookUrl: '',
    modRoleId: '', adminRoleId: '', collabRoleId: '',
    discordClientId: '', discordClientSecret: '', siteUrl: '',
    notificationEnabled: true,
  });
  const [syncTarget, setSyncTarget] = useState<'special' | 'all'>('special');
  const rolePopoverRef = useRef<HTMLDivElement>(null);
  const [statsConfig, setStatsConfig] = useState({ visits_base: 0, downloads_base: 0, external_downloads_base: 0, github_downloads: 0, github_per_repo: {} as Record<string, number> });
  const [statsConfigSaving, setStatsConfigSaving] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Close role popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (rolePopoverRef.current && !rolePopoverRef.current.contains(e.target as Node)) {
        setRoleChangeUser(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchStats = useCallback(async () => {
    try { const res = await fetch('/api/admin/stats'); if (!res.ok) return; const data = await res.json(); setStats(data); setAllComments(data.recentComments || []); setLogs(data.recentLogs || []); } catch {}
  }, []);
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try { const res = await fetch('/api/admin/users'); if (!res.ok) return; const data = await res.json(); setUsers(data.users || []); } catch {} finally { setUsersLoading(false); }
  }, []);
  const fetchDiscordConfig = useCallback(async () => {
    setDiscordLoading(true);
    try {
      const res = await fetch('/api/admin/discord'); if (!res.ok) return;
      const data = await res.json(); setDiscordConfig(data.config);
      setDcForm({
        webhookUrl: data.config?.webhookUrl || '', modRoleId: data.config?.modRoleId || '',
        adminRoleId: data.config?.adminRoleId || '', collabRoleId: data.config?.collabRoleId || '',
        discordClientId: data.config?.discordClientId || '', discordClientSecret: '',
        siteUrl: data.config?.siteUrl || '',
        notificationEnabled: data.config?.notificationEnabled !== false,
      });
    } catch {} finally { setDiscordLoading(false); }
  }, []);
  const fetchBotStatus = useCallback(async () => {
    setStatusLoading(true);
    try {
      const res = await fetch('/api/admin/discord/status');
      if (res.ok) { const data = await res.json(); setBotStatus(data); }
    } catch {} finally { setStatusLoading(false); }
  }, []);
  const fetchStatsConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats/config');
      if (res.ok) { const data = await res.json(); setStatsConfig({ visits_base: data.visits_base || 0, downloads_base: data.downloads_base || 0, external_downloads_base: data.external_downloads_base || 0, github_downloads: data.github_downloads || 0, github_per_repo: data.github_per_repo || {} }); }
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    fetch('/api/auth/session')
      .then(r => { if (!r.ok) throw new Error('fail'); return r.json(); })
      .then(d => { if (!d.user || !['admin', 'owner'].includes(d.user.role)) { router.push('/'); return; } setUser({ id: d.user.id, role: d.user.role }); })
      .catch(() => { router.push('/'); });
  }, [router, mounted]);

  useEffect(() => {
    if (!user) return;
    Promise.all([fetchStats(), fetchUsers(), fetchDiscordConfig(), fetchBotStatus(), fetchStatsConfig()]).finally(() => { setLoading(false); });
  }, [user, fetchStats, fetchUsers, fetchDiscordConfig, fetchBotStatus, fetchStatsConfig]);

  // Auto-refresh stats every 60 seconds
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      fetchStats();
      fetchBotStatus();
      fetchStatsConfig();
    }, 60000);
    return () => clearInterval(interval);
  }, [user, fetchStats, fetchBotStatus, fetchStatsConfig]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try { const res = await fetch('/api/admin/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, role: newRole }) }); if (!res.ok) { const d = await res.json(); toast.error(d.error || 'Error'); return; } setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: newRole } : u))); toast.success('Rol actualizado'); } catch { toast.error('Error de conexión'); }
  };
  const handleBanToggle = async (targetUser: AdminUser, shouldBan: boolean) => {
    if (shouldBan) { setSelectedUser(targetUser); setBanReason(''); setShowBanDialog(true); return; }
    try { const res = await fetch('/api/admin/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: targetUser.id, isBanned: false }) }); if (!res.ok) { const d = await res.json(); toast.error(d.error || 'Error'); return; } setUsers(prev => prev.map(u => (u.id === targetUser.id ? { ...u, isBanned: false, banReason: undefined } : u))); toast.success(`${targetUser.nickname} desbaneado`); } catch { toast.error('Error'); }
  };
  const confirmBan = async () => {
    if (!selectedUser) return;
    try { const res = await fetch('/api/admin/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: selectedUser.id, isBanned: true, banReason: banReason || 'Sin razón' }) }); if (!res.ok) { const d = await res.json(); toast.error(d.error || 'Error'); return; } setUsers(prev => prev.map(u => (u.id === selectedUser.id ? { ...u, isBanned: true, banReason } : u))); toast.success(`${selectedUser.nickname} baneado`); setShowBanDialog(false); } catch { toast.error('Error'); }
  };
  const handleDiscordSave = async () => {
    setDiscordLoading(true);
    try {
      const payload: Record<string, string | boolean> = {};
      if (dcForm.webhookUrl) payload.webhookUrl = dcForm.webhookUrl;
      if (dcForm.modRoleId) payload.modRoleId = dcForm.modRoleId;
      if (dcForm.adminRoleId) payload.adminRoleId = dcForm.adminRoleId;
      if (dcForm.collabRoleId) payload.collabRoleId = dcForm.collabRoleId;
      if (dcForm.discordClientId) payload.discordClientId = dcForm.discordClientId;
      if (dcForm.discordClientSecret) payload.discordClientSecret = dcForm.discordClientSecret;
      if (dcForm.siteUrl) payload.siteUrl = dcForm.siteUrl;
      payload.notificationEnabled = dcForm.notificationEnabled;
      const res = await fetch('/api/admin/discord', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); toast.error(d.error || 'Error'); return; }
      toast.success('Configuración de Discord guardada');
      fetchDiscordConfig();
      fetchBotStatus();
    } catch { toast.error('Error'); } finally { setDiscordLoading(false); }
  };
  const handleDeleteComment = async (commentId: string) => {
    try { const res = await fetch('/api/comments', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ commentId }) }); if (!res.ok) { toast.error('Error'); return; } setAllComments(prev => prev.filter(c => c.id !== commentId)); toast.success('Comentario eliminado'); } catch { toast.error('Error'); }
  };
  const handleStatsConfigSave = async () => {
    setStatsConfigSaving(true);
    try {
      const res = await fetch('/api/admin/stats/config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ visits_base: statsConfig.visits_base, downloads_base: statsConfig.downloads_base, external_downloads_base: statsConfig.external_downloads_base }) });
      if (!res.ok) { const d = await res.json(); toast.error(d.error || 'Error'); return; }
      toast.success('Configuración de estadísticas guardada');
      fetchStats();
    } catch { toast.error('Error de conexión'); } finally { setStatsConfigSaving(false); }
  };
  const handleSyncRoles = async () => {
    setSyncLoading(true);
    try {
      const body: Record<string, unknown> = {};
      if (syncTarget === 'all') body.syncAll = true;
      const res = await fetch('/api/admin/discord/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const d = await res.json(); toast.error(d.error || 'Error'); return; }
      const data = await res.json();
      toast.success(`Sincronización completada: ${data.synced} actualizados, ${data.errors} errores`);
      setShowSyncDialog(false);
      fetchStats();
      fetchUsers();
    } catch { toast.error('Error de conexión'); } finally { setSyncLoading(false); }
  };

  const filteredUsers = users.filter(u => u.nickname.toLowerCase().includes(searchQuery.toLowerCase()) || (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())));
  const hasSearchQuery = searchQuery.trim().length > 0;
  const hasNoSearchResults = hasSearchQuery && filteredUsers.length === 0;

  if (!mounted || !user || loading) {
    return (
      <div className="min-h-screen bg-[#080818] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-10 h-10 border-2 border-[#FF2D78]/30 border-t-[#FF2D78] rounded-full" />
          <p className="text-sm text-white/30">Cargando panel...</p>
        </div>
      </div>
    );
  }

  const formatTimeAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 30) return `Hace ${diffDays}d`;
    return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const tabVariants = {
    hidden: { opacity: 0, x: 12 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
    exit: { opacity: 0, x: -12, transition: { duration: 0.15, ease: 'easeIn' } },
  };

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  const primaryStatCards = [
    { icon: Users, label: 'Miembros Totales', value: stats?.stats.totalUsers || 0, gradient: 'from-[#FF2D78] to-[#a855f7]', shadowColor: 'shadow-[#FF2D78]/15', bgGlow: 'from-[#FF2D78]/[0.06] to-transparent', trend: 'total' },
    { icon: MessageSquare, label: 'Comentarios Totales', value: stats?.stats.totalComments || 0, gradient: 'from-[#4D9FFF] to-[#00D4FF]', shadowColor: 'shadow-[#4D9FFF]/15', bgGlow: 'from-[#4D9FFF]/[0.06] to-transparent', trend: 'up' },
    { icon: DollarSign, label: 'Donaciones ($)', value: `$${(stats?.stats.totalDonations || 0).toFixed(2)}`, gradient: 'from-[#22C55E] to-[#4ADE80]', shadowColor: 'shadow-[#22C55E]/15', bgGlow: 'from-[#22C55E]/[0.06] to-transparent', trend: 'up' },
    { icon: TrendingUp, label: 'Registros Hoy', value: stats?.recentUsers?.length || 0, gradient: 'from-purple-500 to-pink-500', shadowColor: 'shadow-purple-500/15', bgGlow: 'from-purple-500/[0.06] to-transparent', trend: 'neutral' },
  ];

  const secondaryStatCards = [
    { icon: Eye, label: 'Visitas del Sitio', value: stats?.stats.totalVisits || 0, gradient: 'from-[#22c55e] to-[#4ADE80]', shadowColor: 'shadow-[#22c55e]/15', bgGlow: 'from-[#22c55e]/[0.06] to-transparent' },
    { icon: Download, label: 'Descargas de Proyectos', value: stats?.stats.totalDownloads || 0, gradient: 'from-[#FF2D78] to-[#ff6b9d]', shadowColor: 'shadow-[#FF2D78]/15', bgGlow: 'from-[#FF2D78]/[0.06] to-transparent' },
  ];

  return (
    <div className="min-h-screen bg-[#080818] text-white">
      {/* ─── Mobile Overlay ─── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ─── Sidebar ─── */}
      <aside className={`fixed top-0 left-0 h-full w-[270px] bg-gradient-to-b from-[#0c0c20] to-[#080818] border-r border-white/[0.06] z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Sidebar Header */}
        <div className="p-5 border-b border-white/[0.06] bg-gradient-to-r from-[#FF2D78]/[0.04] to-[#4D9FFF]/[0.04]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF2D78] to-[#a855f7] flex items-center justify-center shadow-lg shadow-[#FF2D78]/25">
                <Shield size={19} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight">Administración</h2>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">The Encoders Club</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group ${
                  isActive
                    ? 'bg-white/[0.06] text-white'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#FF2D78]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon size={18} className={`shrink-0 transition-colors ${isActive ? 'text-[#FF2D78]' : 'group-hover:text-white/60'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/[0.06] bg-gradient-to-t from-[#FF2D78]/[0.03] to-transparent">
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all"
          >
            <ChevronLeft size={16} />
            <span>Volver al sitio</span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="lg:pl-[270px] min-h-screen flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#080818]/80 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all"
              >
                <Menu size={20} />
              </button>
              <div className="hidden sm:flex items-center gap-2 text-sm text-white/30">
                <span>Admin</span>
                <span className="text-white/10">/</span>
                <span className="text-white/60 capitalize">{activeTab}</span>
              </div>
              <h1 className="sm:hidden text-sm font-medium text-white/60 capitalize">{navItems.find(n => n.id === activeTab)?.label}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-white/[0.03] to-white/[0.01] border border-white/[0.07]">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF2D78] to-[#a855f7] flex items-center justify-center shadow-sm">
                  <Shield size={13} className="text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-medium text-white/80">{user.role === 'owner' ? 'Creador' : 'Admin'}</p>
                </div>
                <Badge className={`text-[10px] px-2 py-0 rounded-full border font-semibold uppercase tracking-wider ${
                  user.role === 'owner'
                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {/* ═══════════════ DASHBOARD ═══════════════ */}
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                {/* Welcome Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF2D78]/[0.08] via-[#a855f7]/[0.06] to-[#4D9FFF]/[0.08] border border-white/[0.08] p-6">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FF2D78]/[0.06] to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#4D9FFF]/[0.06] to-transparent rounded-full translate-y-1/2 -translate-x-1/4" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF2D78] to-[#a855f7] flex items-center justify-center shadow-lg shadow-[#FF2D78]/20">
                        <Shield size={22} className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Panel de Administración</h2>
                        <p className="text-xs text-white/40">The Encoders Club — {user.role === 'owner' ? 'Creador del sitio' : 'Administrador'}</p>
                      </div>
                    </div>
                    <p className="text-sm text-white/50 max-w-lg">
                      Vista general de la plataforma. Monitoriza estadísticas, gestiona usuarios, moderación de comentarios, integraciones de Discord y actividad reciente del sistema.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <motion.div animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <span className="text-[11px] text-green-400/60">Estadísticas en vivo</span>
                      <button onClick={() => { fetchStats(); fetchBotStatus(); fetchUsers(); }} className="ml-auto text-[11px] text-white/25 hover:text-white/50 transition-colors flex items-center gap-1">
                        <RefreshCw size={11} /> Actualizar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Primary Stat Cards (4 cards in a row) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {primaryStatCards.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.07] p-5 shadow-lg ${stat.shadowColor} hover:border-white/[0.12] transition-all duration-300 group`}
                    >
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.bgGlow} rounded-full -translate-y-1/2 translate-x-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      <div className="flex items-start justify-between relative">
                        <div>
                          <p className="text-[11px] font-medium text-white/35 uppercase tracking-wider mb-2">{stat.label}</p>
                          <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                          {stat.trend === 'up' && (
                            <div className="flex items-center gap-1 mt-1.5">
                              <TrendingUp size={11} className="text-green-400/60" />
                              <span className="text-[10px] text-green-400/50">Activo</span>
                            </div>
                          )}
                          {stat.trend === 'total' && (
                            <div className="flex items-center gap-1 mt-1.5">
                              <Users size={11} className="text-white/20" />
                              <span className="text-[10px] text-white/20">Creciendo</span>
                            </div>
                          )}
                        </div>
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadowColor}`}>
                          <stat.icon size={18} className="text-white" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Secondary Stat Cards (Visits & Downloads - wider) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {secondaryStatCards.map((stat, i) => (
                    <motion.div
                      key={`secondary-${i}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + i * 0.08, duration: 0.4 }}
                      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.07] p-5 shadow-lg ${stat.shadowColor} hover:border-white/[0.12] transition-all duration-300 group`}
                    >
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.bgGlow} rounded-full -translate-y-1/2 translate-x-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      <div className="flex items-start justify-between relative">
                        <div>
                          <p className="text-[11px] font-medium text-white/35 uppercase tracking-wider mb-2">{stat.label}</p>
                          <p className="text-3xl font-bold text-white tracking-tight">{stat.value.toLocaleString()}</p>
                          <div className="flex items-center gap-1 mt-1.5">
                            <motion.div
                              animate={{ opacity: [0.3, 0.8, 0.3] }}
                              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                              className="w-1.5 h-1.5 rounded-full bg-green-400"
                            />
                            <span className="text-[10px] text-white/25">En tiempo real</span>
                          </div>
                        </div>
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadowColor}`}>
                          <stat.icon size={18} className="text-white" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Stats Configuration */}
                <AdminCard>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#22C55E]/10 flex items-center justify-center">
                        <TrendingUp size={16} className="text-[#22C55E]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white/90">Configuración de Estadísticas</h3>
                        <p className="text-[10px] text-white/30">Define números base que se suman a los conteos reales en tiempo real</p>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown Display */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                    {/* Visits Breakdown */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <div className="flex items-center gap-2 mb-3">
                        <Eye size={14} className="text-[#22c55e]" />
                        <span className="text-xs font-medium text-white/60">Visitas del Sitio</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/30">Base configurada</span>
                          <span className="text-white/70 font-semibold">{(statsConfig.visits_base || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/30">Visitas reales (tiempo real)</span>
                          <span className="text-green-400/80 font-semibold">{(stats?.stats.realVisits || 0).toLocaleString()}</span>
                        </div>
                        <div className="border-t border-white/[0.06] pt-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-white/50">Total mostrado</span>
                          <span className="text-lg font-bold text-[#22c55e]">{(stats?.stats.totalVisits || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Downloads Breakdown */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <div className="flex items-center gap-2 mb-3">
                        <Download size={14} className="text-[#FF2D78]" />
                        <span className="text-xs font-medium text-white/60">Descargas de Proyectos</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/30">1. Base fija (manual)</span>
                          <span className="text-white/70 font-semibold">{(statsConfig.downloads_base || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/30">2. GitHub (tiempo real)</span>
                          <span className="text-[#4D9FFF]/80 font-semibold">{(statsConfig.github_downloads || 0).toLocaleString()}</span>
                        </div>
                        {Object.entries(statsConfig.github_per_repo || {}).map(([repo, count]) => (
                          <div key={repo} className="flex items-center justify-between text-xs pl-3">
                            <span className="text-white/20 truncate">{repo.split('/').pop()}</span>
                            <span className="text-white/40 font-mono text-[10px]">{count.toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/30">3. Otra plataforma (manual)</span>
                          <span className="text-[#a855f7]/80 font-semibold">{(statsConfig.external_downloads_base || 0).toLocaleString()}</span>
                        </div>
                        <div className="border-t border-white/[0.06] pt-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-white/50">Total mostrado</span>
                          <span className="text-lg font-bold text-[#FF2D78]">{(stats?.stats.totalDownloads || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-[11px] text-white/35 block mb-1.5 uppercase tracking-wider font-medium">Base de Visitas</label>
                      <AdminInput
                        type="number"
                        min="0"
                        value={statsConfig.visits_base}
                        onChange={e => setStatsConfig(prev => ({ ...prev, visits_base: Math.max(0, parseInt(e.target.value) || 0) }))}
                        placeholder="Ej: 50000"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-white/35 block mb-1.5 uppercase tracking-wider font-medium">Base de Descargas (Fijo)</label>
                      <AdminInput
                        type="number"
                        min="0"
                        value={statsConfig.downloads_base}
                        onChange={e => setStatsConfig(prev => ({ ...prev, downloads_base: Math.max(0, parseInt(e.target.value) || 0) }))}
                        placeholder="Ej: 15000"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-white/35 block mb-1.5 uppercase tracking-wider font-medium">Descargas Otra Plataforma</label>
                      <AdminInput
                        type="number"
                        min="0"
                        value={statsConfig.external_downloads_base}
                        onChange={e => setStatsConfig(prev => ({ ...prev, external_downloads_base: Math.max(0, parseInt(e.target.value) || 0) }))}
                        placeholder="Ej: 5000"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#22C55E]/[0.04] border border-[#22C55E]/10 mb-4">
                    <Info size={14} className="text-[#22C55E]/70 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-white/35 leading-relaxed">Las descargas se calculan como: <b className='text-white/50'>Base Fija</b> + <b className='text-[#4D9FFF]/70'>GitHub (auto)</b> + <b className='text-[#a855f7]/70'>Otra Plataforma</b>. GitHub se actualiza automáticamente cada 15 min. Los campos manuales se suman a los conteos reales.</p>
                  </div>

                  <button
                    onClick={handleStatsConfigSave}
                    disabled={statsConfigSaving}
                    className="w-full py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#16a34a] text-white font-semibold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#22C55E]/10"
                  >
                    {statsConfigSaving ? <><Loader2 size={15} className="animate-spin" /> Guardando...</> : <><Save size={15} /> Guardar Configuración</>}
                  </button>
                </AdminCard>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Recent Activity - Wider */}
                  <AdminCard className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#FF2D78]/10 flex items-center justify-center">
                          <Activity size={16} className="text-[#FF2D78]" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white/90">Actividad Reciente</h3>
                          <p className="text-[10px] text-white/30">Eventos recientes de la plataforma</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-white/20 uppercase tracking-widest bg-white/[0.03] px-2.5 py-1 rounded-full">{logs?.length || 0} eventos</span>
                    </div>
                    <div className="space-y-0 max-h-[400px] overflow-y-auto pr-1">
                      {(!logs || logs.length === 0) ? (
                        <EmptyState icon={FileText} message="Sin actividad reciente" submessage="Los eventos aparecerán aquí" />
                      ) : logs.map((log, idx) => (
                        <div key={log.id} className="relative flex items-start gap-3 pb-4">
                          {/* Timeline line */}
                          {idx < logs.length - 1 && (
                            <div className="absolute left-[11px] top-7 bottom-0 w-px bg-white/[0.04]" />
                          )}
                          <div className={`w-[22px] h-[22px] rounded-full ${getActionBgColor(log.action)} flex items-center justify-center shrink-0 mt-0.5`}>
                            <div className={`w-[7px] h-[7px] rounded-full ${getActionDotColor(log.action)}`} />
                          </div>
                          <div className="flex-1 min-w-0 -mt-0.5">
                            <p className="text-sm text-white/70 leading-relaxed">
                              <span className="font-medium text-white/90">{log.user?.nickname || 'Sistema'}</span>
                              {' — '}
                              <span className={getActionColor(log.action)}>{actionLabels[log.action] || log.action}</span>
                            </p>
                            <p className="text-[11px] text-white/25 mt-1">{formatTimeAgo(log.createdAt)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AdminCard>

                  {/* Users by Role */}
                  <AdminCard className="lg:col-span-2">
                    <div className="flex items-center gap-2.5 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-[#4D9FFF]/10 flex items-center justify-center">
                        <Users size={16} className="text-[#4D9FFF]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white/90">Usuarios por Rol</h3>
                        <p className="text-[10px] text-white/30">Distribución de roles</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {(!stats?.usersByRole || stats.usersByRole.length === 0) ? (
                        <EmptyState icon={Users} message="Sin datos" />
                      ) : (stats.usersByRole || []).map(r => {
                        const total = stats?.stats.totalUsers || 1;
                        const pct = Math.round((r._count / total) * 100);
                        const barColor = r.role === 'owner' ? 'bg-yellow-400' : r.role === 'admin' ? 'bg-red-400' : r.role === 'moderator' ? 'bg-[#4D9FFF]' : r.role === 'collaborator' ? 'bg-green-400' : 'bg-white/30';
                        return (
                          <div key={r.role}>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${barColor}`} />
                                <span className="text-xs text-white/50">{roleLabels[r.role] || r.role}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-white/80">{r._count}</span>
                                <span className="text-[10px] text-white/25">{pct}%</span>
                              </div>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                                className={`h-full rounded-full ${barColor}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </AdminCard>
                </div>

                {/* Recent Users */}
                <AdminCard>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#FF2D78]/10 flex items-center justify-center">
                        <TrendingUp size={16} className="text-[#FF2D78]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white/90">Usuarios Recientes</h3>
                        <p className="text-[10px] text-white/30">Últimos registros en la plataforma</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-white/20 uppercase tracking-widest bg-white/[0.03] px-2.5 py-1 rounded-full">
                      {stats?.recentUsers?.length || 0} nuevos
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                    {(stats?.recentUsers || []).map(u => (
                      <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all">
                        <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-[#FF2D78] to-[#a855f7]">
                          {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Users size={14} className="text-white" /></div>}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white truncate">{u.nickname}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${roleColors[u.role] || roleColors.user}`}>{roleLabels[u.role] || u.role}</span>
                        </div>
                      </div>
                    ))}
                    {(!stats?.recentUsers || stats.recentUsers.length === 0) && (
                      <EmptyState icon={Users} message="Sin usuarios" />
                    )}
                  </div>
                </AdminCard>

                {/* Recent Donations */}
                <AdminCard>
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-[#22C55E]/10 flex items-center justify-center">
                      <Heart size={16} className="text-[#22C55E]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white/90">Donaciones Recientes</h3>
                      <p className="text-[10px] text-white/30">Contribuciones de la comunidad</p>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {(stats?.donations || []).map(d => (
                      <div key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#22C55E]/10 flex items-center justify-center">
                            <DollarSign size={15} className="text-[#22C55E]" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{d.currency === 'USD' ? '$' : '\u20AC'}{d.amount.toFixed(2)}</p>
                            {d.message && <p className="text-xs text-white/30 truncate max-w-xs">{d.message}</p>}
                          </div>
                        </div>
                        <span className="text-[11px] text-white/25">{formatTimeAgo(d.createdAt)}</span>
                      </div>
                    ))}
                    {(!stats?.donations || stats.donations.length === 0) && (
                      <EmptyState icon={Heart} message="Sin donaciones" />
                    )}
                  </div>
                </AdminCard>
              </motion.div>
            )}

            {/* ═══════════════ USERS ═══════════════ */}
            {activeTab === 'users' && (
              <motion.div key="users" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                {/* Search & Stats */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                    <input
                      type="text"
                      placeholder="Buscar por nickname o email..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF2D78]/50 focus:ring-1 focus:ring-[#FF2D78]/20 placeholder:text-white/25 transition-all"
                    />
                  </div>
                  <button
                    onClick={fetchUsers}
                    className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-white/50 text-sm hover:bg-white/[0.08] hover:text-white/70 transition-all flex items-center gap-2"
                  >
                    <RefreshCw size={14} className={usersLoading ? 'animate-spin' : ''} />
                    Refrescar
                  </button>
                </div>

                {/* Stats Row */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-white/30 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                    {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''}
                  </span>
                  <span className="text-xs text-green-400/80 px-3 py-1.5 rounded-lg bg-green-500/[0.06] border border-green-500/10">
                    {filteredUsers.filter(u => !u.isBanned).length} activos
                  </span>
                  <span className="text-xs text-red-400/80 px-3 py-1.5 rounded-lg bg-red-500/[0.06] border border-red-500/10">
                    {filteredUsers.filter(u => u.isBanned).length} baneados
                  </span>
                  <span className="text-xs text-[#5865F2]/80 px-3 py-1.5 rounded-lg bg-[#5865F2]/[0.06] border border-[#5865F2]/10">
                    {filteredUsers.filter(u => u.discordLinked).length} Discord
                  </span>
                </div>

                {/* Users Table */}
                <AdminCard padding={false}>
                  <div className="overflow-x-auto" style={{ overflowY: 'visible' }}>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/[0.06] hover:bg-transparent bg-white/[0.02]">
                          <TableHead className="text-white/35 text-[11px] font-medium uppercase tracking-wider">Usuario</TableHead>
                          <TableHead className="text-white/35 text-[11px] font-medium uppercase tracking-wider">Rol</TableHead>
                          <TableHead className="text-white/35 text-[11px] font-medium uppercase tracking-wider hidden md:table-cell">Discord</TableHead>
                          <TableHead className="text-white/35 text-[11px] font-medium uppercase tracking-wider hidden md:table-cell">Estado</TableHead>
                          <TableHead className="text-white/35 text-[11px] font-medium uppercase tracking-wider hidden lg:table-cell">Comentarios</TableHead>
                          <TableHead className="text-white/35 text-[11px] font-medium uppercase tracking-wider hidden lg:table-cell">Registro</TableHead>
                          <TableHead className="text-white/35 text-[11px] font-medium uppercase tracking-wider text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((u, idx) => (
                          <TableRow key={u.id} className={`border-white/[0.04] hover:bg-white/[0.03] transition-colors ${idx % 2 === 1 ? 'bg-white/[0.01]' : ''}`}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-[#FF2D78] to-[#a855f7]">
                                  {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Users size={14} className="text-white" /></div>}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-white truncate max-w-[160px]">
                                    {u.nickname}
                                    {u.isPremium && <Crown size={12} className="inline text-yellow-400 ml-1.5" />}
                                  </p>
                                  {u.email && <p className="text-[11px] text-white/25 truncate max-w-[160px]">{u.email}</p>}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="relative" ref={roleChangeUser?.id === u.id ? rolePopoverRef : undefined}>
                                <button
                                  onClick={() => setRoleChangeUser(roleChangeUser?.id === u.id ? null : u)}
                                  disabled={u.role === 'owner' || (user.role === 'admin' && u.role === 'admin')}
                                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                  style={{
                                    backgroundColor: `${u.role === 'owner' ? '#eab308' : u.role === 'admin' ? '#ef4444' : u.role === 'moderator' ? '#4D9FFF' : u.role === 'collaborator' ? '#22c55e' : '#fff'}15`,
                                    color: u.role === 'owner' ? '#facc15' : u.role === 'admin' ? '#f87171' : u.role === 'moderator' ? '#4D9FFF' : u.role === 'collaborator' ? '#4ade80' : '#999',
                                    borderColor: `${u.role === 'owner' ? '#eab308' : u.role === 'admin' ? '#ef4444' : u.role === 'moderator' ? '#4D9FFF' : u.role === 'collaborator' ? '#22c55e' : '#fff'}25`,
                                  }}
                                >
                                  {roleLabels[u.role] || u.role}
                                  {(u.role !== 'owner' && !(user.role === 'admin' && u.role === 'admin')) && (
                                    <UserCog size={10} className="inline ml-1 opacity-50" />
                                  )}
                                </button>
                                {/* Role Change Popover */}
                                <AnimatePresence>
                                  {roleChangeUser?.id === u.id && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                      className="absolute top-full mt-1 left-0 z-[9999] bg-[#12122a] border border-white/[0.08] rounded-xl p-1.5 shadow-xl shadow-black/30 min-w-[120px]"
                                    >
                                      {['user', 'collaborator', 'moderator', 'admin'].map(role => (
                                        <button
                                          key={role}
                                          onClick={() => { handleRoleChange(u.id, role); setRoleChangeUser(null); }}
                                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all hover:bg-white/5 ${
                                            u.role === role ? 'text-white/80 bg-white/5' : 'text-white/50'
                                          }`}
                                        >
                                          {role === 'user' ? 'Usuario' : role === 'collaborator' ? 'Colaborador' : role === 'moderator' ? 'Moderador' : 'Admin'}
                                        </button>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {u.discordLinked ? (
                                <span className="flex items-center gap-1.5 text-xs text-[#5865F2]/80">
                                  <MessageCircle size={12} />
                                  Vinculado
                                </span>
                              ) : (
                                <span className="text-xs text-white/15">—</span>
                              )}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex items-center gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${u.isBanned ? 'bg-red-400' : 'bg-green-400'}`} />
                                <span className={`text-xs ${u.isBanned ? 'text-red-400/70' : 'text-green-400/70'}`}>
                                  {u.isBanned ? 'Baneado' : 'Activo'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell"><span className="text-xs text-white/30">{u.commentCount || 0}</span></TableCell>
                            <TableCell className="hidden lg:table-cell"><span className="text-[11px] text-white/20">{new Date(u.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: '2-digit' })}</span></TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                {u.isBanned ? (
                                  <button onClick={() => handleBanToggle(u, false)} className="p-2 rounded-lg text-green-400/70 hover:text-green-400 hover:bg-green-500/10 transition-all" title="Desbanear"><CheckCircle size={16} /></button>
                                ) : (
                                  <button onClick={() => handleBanToggle(u, true)} className="p-2 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Banear"><Ban size={16} /></button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {hasNoSearchResults && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-12">
                              <div className="flex flex-col items-center text-white/20">
                                <Search size={32} strokeWidth={1} />
                                <p className="text-sm mt-2">Sin resultados para &quot;{searchQuery}&quot;</p>
                                <p className="text-xs text-white/15 mt-1">Intenta con otro termino de busqueda</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                        {!hasSearchQuery && filteredUsers.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-12">
                              <EmptyState icon={Users} message="No se encontraron usuarios" />
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </AdminCard>
              </motion.div>
            )}

            {/* ═══════════════ COMMENTS ═══════════════ */}
            {activeTab === 'comments' && (
              <motion.div key="comments" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                {/* Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#a855f7]/[0.06] to-[#4D9FFF]/[0.06] border border-white/[0.07] p-5">
                  <div className="flex items-center justify-between relative">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a855f7] to-[#4D9FFF] flex items-center justify-center shadow-lg shadow-[#a855f7]/15">
                        <MessageSquare size={18} className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-white">Moderación de Comentarios</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-white/40">{allComments.length} comentarios recientes</span>
                          {allComments.some(c => c.reports > 0) && (
                            <Badge className="bg-red-500/15 text-red-400 border-red-500/25 text-[10px]">
                              <AlertTriangle size={10} className="mr-1" />
                              {allComments.filter(c => c.reports > 0).length} con reportes
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <button onClick={fetchStats} className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/[0.08] text-white/50 text-xs hover:bg-white/[0.08] hover:text-white/70 transition-all flex items-center gap-1.5">
                      <RefreshCw size={13} /> Refrescar
                    </button>
                  </div>
                </div>

                <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                  {allComments.map(c => (
                    <div key={c.id} className="group relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.06] border-l-2 border-l-[#FF2D78]/50 rounded-xl p-4 hover:border-white/[0.1] transition-all duration-200 hover:shadow-lg hover:shadow-black/5">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#a855f7] to-[#4D9FFF] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          <MessageSquare size={14} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="text-sm font-semibold text-white/90">{c.author?.nickname || 'Anonimo'}</span>
                            {c.reports > 0 && (
                              <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px] py-0 px-1.5">
                                <AlertTriangle size={9} className="mr-0.5" />
                                {c.reports} reporte{c.reports > 1 ? 's' : ''}
                              </Badge>
                            )}
                            <span className="text-[11px] text-white/20 ml-auto">{formatTimeAgo(c.createdAt)}</span>
                          </div>
                          <p className="text-sm text-white/50 line-clamp-2 leading-relaxed">{c.content}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          className="p-1.5 rounded-lg text-white/15 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                          title="Eliminar"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {allComments.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-white/20">
                      <MessageSquare size={44} strokeWidth={1} />
                      <p className="text-sm mt-3 text-white/25">No hay comentarios aun</p>
                      <p className="text-xs text-white/15 mt-1">Los comentarios nuevos aparecerán aquí</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ═══════════════ DISCORD ═══════════════ */}
            {activeTab === 'discord' && (
              <motion.div key="discord" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                {/* Section Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#5865F2]/[0.06] to-[#5865F2]/[0.02] border border-white/[0.07] p-5">
                  <div className="flex items-center gap-3 relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5865F2] to-[#7289DA] flex items-center justify-center shadow-lg shadow-[#5865F2]/15">
                      <MessageCircle size={18} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Integración con Discord</h2>
                      <p className="text-[11px] text-white/40">Bot, webhook, roles y OAuth2</p>
                    </div>
                  </div>
                </div>

                {/* Bot Status Card */}
                <AdminCard>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#5865F2]/10 flex items-center justify-center">
                        {botStatus?.connected ? <Wifi size={18} className="text-green-400" /> : <WifiOff size={18} className="text-red-400/60" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white/90">Estado del Bot</h3>
                        <p className="text-[11px] text-white/30">Conectividad y estadísticas</p>
                      </div>
                    </div>
                    <button onClick={fetchBotStatus} disabled={statusLoading} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/[0.08] text-white/40 text-[11px] hover:bg-white/[0.08] transition-all flex items-center gap-1.5 disabled:opacity-50">
                      <RefreshCw size={11} className={statusLoading ? 'animate-spin' : ''} /> Verificar
                    </button>
                  </div>

                  {statusLoading && !botStatus ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 size={24} className="animate-spin text-white/20" />
                    </div>
                  ) : botStatus ? (
                    <div className="space-y-4">
                      {/* Connection Status */}
                      <div className={`flex items-center gap-3 p-3.5 rounded-xl border ${botStatus.connected ? 'bg-green-500/[0.04] border-green-500/15' : 'bg-red-500/[0.04] border-red-500/15'}`}>
                        {botStatus.connected ? (
                          <>
                            {botStatus.botAvatar && <img src={botStatus.botAvatar} alt="" className="w-10 h-10 rounded-full" />}
                            <div>
                              <p className="text-sm font-medium text-green-400">{botStatus.botUsername}</p>
                              <p className="text-[11px] text-white/30">Conectado correctamente</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center"><Bot size={18} className="text-red-400/60" /></div>
                            <div>
                              <p className="text-sm font-medium text-red-400">Desconectado</p>
                              <p className="text-[11px] text-white/30">{botStatus.message}</p>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: 'Cuentas vinculadas', value: botStatus.linkedUsers, check: null },
                          { label: 'Miembros', value: botStatus.server?.memberCount || '—', check: null },
                          { label: 'Rol Admin', value: null, check: botStatus.roleConfig?.hasAdminRole },
                          { label: 'OAuth2', value: null, check: botStatus.hasClientId },
                        ].map((s, i) => (
                          <div key={i} className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                            <p className="text-lg font-bold text-white/80">{s.check !== null ? (s.check ? '\u2713' : '\u2014') : s.value}</p>
                            <p className="text-[10px] text-white/25 mt-0.5">{s.label}</p>
                          </div>
                        ))}
                      </div>

                      {/* Role Sync Button */}
                      <button onClick={() => setShowSyncDialog(true)} className="w-full py-2.5 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/20 text-[#5865F2]/90 text-sm font-medium hover:bg-[#5865F2]/15 transition-all flex items-center justify-center gap-2">
                        <ArrowUpDown size={15} /> Sincronizar roles con Discord
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-white/25 text-center py-8">No se pudo obtener el estado</p>
                  )}
                </AdminCard>

                {/* Webhook Configuration */}
                <AdminCard>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[#5865F2]/10 flex items-center justify-center">
                      <Zap size={18} className="text-[#5865F2]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white/90">Notificaciones por Webhook</h3>
                      <p className="text-[11px] text-white/30">Canal de Discord para alertas automáticas</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] text-white/35 block mb-1.5 uppercase tracking-wider font-medium">Discord Webhook URL</label>
                      <AdminInput
                        value={dcForm.webhookUrl}
                        onChange={e => setDcForm(prev => ({ ...prev, webhookUrl: e.target.value }))}
                        placeholder="https://discord.com/api/webhooks/xxx/xxx"
                      />
                    </div>
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#5865F2]/[0.04] border border-[#5865F2]/10">
                      <Info size={14} className="text-[#5865F2]/70 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-white/35 leading-relaxed">Crea un webhook en tu servidor de Discord: Editar Canal &gt; Integraciones &gt; Webhooks &gt; Nuevo Webhook. Copia la URL y pégala aquí.</p>
                    </div>
                  </div>
                </AdminCard>

                {/* Role Mapping */}
                <AdminCard>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[#5865F2]/10 flex items-center justify-center">
                      <ShieldCheck size={18} className="text-[#5865F2]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white/90">Mapeo de Roles</h3>
                      <p className="text-[11px] text-white/30">Sincronización bidireccional</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { key: 'adminRoleId' as const, label: 'ID Rol Admin', value: dcForm.adminRoleId },
                      { key: 'modRoleId' as const, label: 'ID Rol Moderador', value: dcForm.modRoleId },
                      { key: 'collabRoleId' as const, label: 'ID Rol Colaborador', value: dcForm.collabRoleId },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="text-[11px] text-white/35 block mb-1.5 uppercase tracking-wider font-medium">{field.label}</label>
                        <AdminInput
                          value={field.value}
                          onChange={e => setDcForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                          placeholder="123456789012345678"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#5865F2]/[0.04] border border-[#5865F2]/10 mt-4">
                    <Info size={14} className="text-[#5865F2]/70 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-white/35 leading-relaxed">Los roles se sincronizan bidireccionalmente. Los admins obtienen automaticamente los roles de mod y colab.</p>
                  </div>
                </AdminCard>

                {/* OAuth2 Configuration */}
                <AdminCard>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[#5865F2]/10 flex items-center justify-center">
                      <Globe size={18} className="text-[#5865F2]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white/90">OAuth2 (Vinculación de cuentas)</h3>
                      <p className="text-[11px] text-white/30">Discord Developer Portal</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] text-white/35 block mb-1.5 uppercase tracking-wider font-medium">Client ID</label>
                      <AdminInput
                        value={dcForm.discordClientId}
                        onChange={e => setDcForm(prev => ({ ...prev, discordClientId: e.target.value }))}
                        placeholder="123456789012345678"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-white/35 block mb-1.5 uppercase tracking-wider font-medium">Client Secret</label>
                      <div className="relative">
                        <AdminInput
                          type={showClientSecret ? 'text' : 'password'}
                          value={dcForm.discordClientSecret}
                          onChange={e => setDcForm(prev => ({ ...prev, discordClientSecret: e.target.value }))}
                          placeholder={discordConfig?.hasClientSecret ? 'Secret configurado (dejar vacio para mantener)' : 'Client Secret de Discord'}
                          className="pr-10"
                        />
                        <button onClick={() => setShowClientSecret(!showClientSecret)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                          {showClientSecret ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] text-white/35 block mb-1.5 uppercase tracking-wider font-medium">URL del Sitio</label>
                      <AdminInput
                        value={dcForm.siteUrl}
                        onChange={e => setDcForm(prev => ({ ...prev, siteUrl: e.target.value }))}
                        placeholder="https://tu-sitio.pages.dev"
                      />
                    </div>
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#5865F2]/[0.04] border border-[#5865F2]/10">
                      <Info size={14} className="text-[#5865F2]/70 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-white/35 leading-relaxed">
                        Crea una aplicacion en el <a href="https://discord.com/developers/applications" target="_blank" rel="noopener noreferrer" className="text-[#5865F2] underline underline-offset-2">Portal de Desarrolladores de Discord</a>. En OAuth2, agrega el redirect URI: <code className="text-white/50 bg-white/5 px-1.5 py-0.5 rounded text-[10px]">TU_SITIO/api/auth/discord/callback</code>
                      </p>
                    </div>
                  </div>
                </AdminCard>

                {/* Notification Toggle */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                      <Bell size={16} className="text-white/30" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/70">Notificaciones de comentarios</p>
                      <p className="text-[11px] text-white/25">Enviar notificaciones a Discord cuando se publique un comentario</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDcForm(prev => ({ ...prev, notificationEnabled: !prev.notificationEnabled }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${dcForm.notificationEnabled ? 'bg-[#5865F2]' : 'bg-white/10'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${dcForm.notificationEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Save & Test Buttons */}
                <div className="flex gap-3">
                  <button onClick={handleDiscordSave} disabled={discordLoading} className="flex-1 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#5865F2]/10">
                    {discordLoading ? <><Loader2 size={15} className="animate-spin" /> Guardando...</> : <><Save size={15} /> Guardar Configuración</>}
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/admin/discord/test', { method: 'POST' });
                        const data = await res.json();
                        if (data.success) {
                          toast.success('Notificacion de prueba enviada! Revisa tu canal de Discord.');
                        } else {
                          toast.error(data.message || 'No se pudo enviar la prueba.');
                        }
                      } catch {
                        toast.error('Error de conexión al enviar la prueba.');
                      }
                    }}
                    className="py-3 px-5 rounded-xl bg-white/5 hover:bg-white/[0.08] border border-white/[0.08] text-white/50 hover:text-white/70 font-medium text-sm transition-all flex items-center gap-2"
                  >
                    <Zap size={15} /> Probar Webhook
                  </button>
                </div>
              </motion.div>
            )}

            {/* ═══════════════ LOGS ═══════════════ */}
            {activeTab === 'logs' && (
              <motion.div key="logs" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                {/* Section Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#4D9FFF]/[0.06] to-[#4D9FFF]/[0.02] border border-white/[0.07] p-5">
                  <div className="flex items-center justify-between relative">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4D9FFF] to-[#00D4FF] flex items-center justify-center shadow-lg shadow-[#4D9FFF]/15">
                        <FileText size={18} className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-white">Registro de Actividad</h2>
                        <p className="text-[11px] text-white/40">Historial de eventos de la plataforma</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-white/20 uppercase tracking-widest bg-white/[0.03] px-2.5 py-1 rounded-full">{logs?.length || 0} registros</span>
                  </div>
                </div>

                <div className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                  {(!logs || logs.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-24 text-white/20">
                      <FileText size={44} strokeWidth={1} />
                      <p className="text-sm mt-3 text-white/25">Sin registros de actividad</p>
                      <p className="text-xs text-white/15 mt-1">Los eventos aparecerán aquí</p>
                    </div>
                  ) : logs.map((log, idx) => (
                    <div
                      key={log.id}
                      className={`flex items-start gap-3 p-3.5 rounded-xl transition-all hover:bg-white/[0.03] ${
                        idx < logs.length - 1 ? 'border-b border-white/[0.03]' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${getActionBgColor(log.action)} flex items-center justify-center shrink-0 ${getActionColor(log.action)}`}>
                        {getActionIcon(log.action)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-white/85">{log.user?.nickname || 'Sistema'}</span>
                          <span className="text-white/10">&middot;</span>
                          <span className={`text-xs font-medium ${getActionColor(log.action)}`}>{actionLabels[log.action] || log.action}</span>
                        </div>
                        {log.details && <p className="text-[11px] text-white/30 mt-1">{log.details}</p>}
                      </div>
                      <span className="text-[10px] text-white/20 shrink-0 mt-0.5 bg-white/[0.02] px-2 py-0.5 rounded-full">{formatTimeAgo(log.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* ─── Ban Dialog ─── */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent className="bg-[#0d0d24] border-white/[0.08] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Ban size={16} className="text-red-400" />
              </div>
              Banear Usuario
            </DialogTitle>
            <DialogDescription className="text-white/40 ml-10">
              Estas a punto de banear a <strong className="text-white/70">{selectedUser?.nickname}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="ml-10">
            <Input placeholder="Razón del ban (opcional)" value={banReason} onChange={e => setBanReason(e.target.value)} className="bg-white/5 border-white/[0.08] text-white placeholder:text-white/20 focus:border-red-500/30" />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <button onClick={() => setShowBanDialog(false)} className="px-4 py-2 rounded-lg bg-white/5 border border-white/[0.08] text-white/60 text-sm hover:bg-white/[0.08] transition-all">Cancelar</button>
            <button onClick={confirmBan} className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all flex items-center gap-2"><Ban size={14} /> Banear</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Sync Dialog ─── */}
      <Dialog open={showSyncDialog} onOpenChange={setShowSyncDialog}>
        <DialogContent className="bg-[#0d0d24] border-white/[0.08] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#5865F2]/10 flex items-center justify-center">
                <ArrowUpDown size={16} className="text-[#5865F2]" />
              </div>
              Sincronizar Roles
            </DialogTitle>
            <DialogDescription className="text-white/40 ml-10">
              Empuja los roles locales a Discord. Admin/Mod/Colab se asignaran como roles de Discord.
            </DialogDescription>
          </DialogHeader>
          <div className="ml-10 space-y-2.5">
            <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-white/[0.03] transition-all border border-white/[0.04]">
              <input type="radio" name="syncTarget" checked={syncTarget === 'special'} onChange={() => setSyncTarget('special')} className="accent-[#5865F2]" />
              <div>
                <p className="text-sm text-white/70">Roles especiales</p>
                <p className="text-[11px] text-white/25">Solo Admin, Mod, Colab</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-white/[0.03] transition-all border border-white/[0.04]">
              <input type="radio" name="syncTarget" checked={syncTarget === 'all'} onChange={() => setSyncTarget('all')} className="accent-[#5865F2]" />
              <div>
                <p className="text-sm text-white/70">Todas las cuentas</p>
                <p className="text-[11px] text-white/25">Cuentas vinculadas a Discord</p>
              </div>
            </label>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <button onClick={() => setShowSyncDialog(false)} className="px-4 py-2 rounded-lg bg-white/5 border border-white/[0.08] text-white/60 text-sm hover:bg-white/[0.08] transition-all">Cancelar</button>
            <button onClick={handleSyncRoles} disabled={syncLoading} className="px-4 py-2 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-50">
              {syncLoading ? <><Loader2 size={14} className="animate-spin" /> Sincronizando...</> : <><ArrowUpDown size={14} /> Sincronizar</>}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
