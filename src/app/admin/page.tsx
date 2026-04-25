'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Users, MessageSquare, DollarSign, Activity, Shield, Search,
  Ban, CheckCircle, UserCog, Trash2, Save, AlertTriangle, RefreshCw,
  Settings, Clock, Bot, Crown, ChevronDown, ChevronUp,
  Eye, EyeOff, TrendingUp, Zap, Globe
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

// ---------- Types ----------

interface AdminUser {
  id: string;
  nickname: string;
  email?: string;
  avatar?: string;
  role: string;
  isPremium: boolean;
  isBanned: boolean;
  banReason?: string;
  discordLinked: boolean;
  createdAt: string;
  _count: { comments: number };
}

interface RecentComment {
  id: string;
  content: string;
  createdAt: string;
  isDeleted: boolean;
  reports: number;
  author: { nickname: string };
}

interface ActivityLog {
  id: string;
  action: string;
  details?: string;
  createdAt: string;
  user?: { nickname: string };
}

interface Donation {
  id: string;
  amount: number;
  currency: string;
  message?: string;
  createdAt: string;
}

interface StatsData {
  stats: { totalUsers: number; totalComments: number; totalDonations: number };
  recentUsers: { id: string; nickname: string; avatar?: string; role: string; createdAt: string }[];
  recentComments: RecentComment[];
  recentLogs: ActivityLog[];
  donations: Donation[];
  usersByRole: { role: string; _count: number }[];
}

interface DiscordConfig {
  id: string;
  serverId?: string;
  channelId?: string;
  webhookUrl?: string;
  modRoleId?: string;
  adminRoleId?: string;
  collabRoleId?: string;
  hasBotToken: boolean;
}

// ---------- Helpers ----------

const roleColors: Record<string, string> = {
  owner: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  admin: 'bg-red-500/20 text-red-400 border-red-500/30',
  moderator: 'bg-[#4D9FFF]/20 text-[#4D9FFF] border-[#4D9FFF]/30',
  collaborator: 'bg-green-500/20 text-green-400 border-green-500/30',
  user: 'bg-white/10 text-white/50 border-white/20',
};

const roleLabels: Record<string, string> = {
  owner: 'Owner',
  admin: 'Admin',
  moderator: 'Mod',
  collaborator: 'Colab',
  user: 'User',
};

const actionLabels: Record<string, string> = {
  admin_user_update: 'Usuario modificado',
  discord_config_update: 'Config Discord actualizada',
  user_login: 'Inicio de sesión',
  user_register: 'Registro',
  user_logout: 'Cierre de sesión',
  comment_create: 'Comentario creado',
  comment_delete: 'Comentario eliminado',
  donation_received: 'Donación recibida',
  password_change: 'Contraseña cambiada',
};

const actionIcons: Record<string, string> = {
  admin_user_update: 'UserCog',
  discord_config_update: 'Settings',
  user_login: 'Zap',
  user_register: 'Users',
  comment_create: 'MessageSquare',
  comment_delete: 'Trash2',
  donation_received: 'DollarSign',
  password_change: 'Shield',
};

export default function AdminPanel() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Data states
  const [stats, setStats] = useState<StatsData | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [allComments, setAllComments] = useState<RecentComment[]>([]);
  const [discordConfig, setDiscordConfig] = useState<DiscordConfig | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  // UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [discordLoading, setDiscordLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [showBotToken, setShowBotToken] = useState(false);

  // Discord form
  const [dcForm, setDcForm] = useState({
    botToken: '',
    serverId: '',
    channelId: '',
    webhookUrl: '',
    modRoleId: '',
    adminRoleId: '',
    collabRoleId: '',
  });

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) return;
      const data = await res.json() as StatsData;
      setStats(data);
      setAllComments(data.recentComments || []);
      setLogs(data.recentLogs || []);
    } catch {
      // Silently fail
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) return;
      const data = await res.json() as { users: AdminUser[] };
      setUsers(data.users || []);
    } catch {
      // Silently fail
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const fetchDiscordConfig = useCallback(async () => {
    setDiscordLoading(true);
    try {
      const res = await fetch('/api/admin/discord');
      if (!res.ok) return;
      const data = await res.json() as { config: typeof discordConfig | null };
      const cfg = data.config;
      if (cfg) {
        setDiscordConfig(cfg);
        setDcForm({
          botToken: '',
          serverId: cfg.serverId || '',
          channelId: cfg.channelId || '',
          webhookUrl: cfg.webhookUrl || '',
          modRoleId: cfg.modRoleId || '',
          adminRoleId: cfg.adminRoleId || '',
          collabRoleId: cfg.collabRoleId || '',
        });
      }
    } catch {
      // Silently fail
    } finally {
      setDiscordLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(r => r.json())
      .then(d => {
        if (!d.user || !['admin', 'owner'].includes(d.user.role)) {
          router.push('/');
          return;
        }
        setUser({ id: d.user.id, role: d.user.role });
      });
  }, [router]);

  useEffect(() => {
    if (user) {
      Promise.all([fetchStats(), fetchUsers(), fetchDiscordConfig()]).finally(() => {
        setLoading(false);
      });
    }
  }, [user, fetchStats, fetchUsers, fetchDiscordConfig]);

  // ---------- User Actions ----------

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error || 'Error al cambiar rol');
        return;
      }
      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
      toast.success('Rol actualizado');
    } catch {
      toast.error('Error de conexión');
    }
  };

  const handleBanToggle = async (targetUser: AdminUser, shouldBan: boolean) => {
    if (shouldBan) {
      setSelectedUser(targetUser);
      setBanReason('');
      setShowBanDialog(true);
      return;
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUser.id, isBanned: false }),
      });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error || 'Error al desbanear');
        return;
      }
      setUsers(prev =>
        prev.map(u => (u.id === targetUser.id ? { ...u, isBanned: false, banReason: undefined } : u))
      );
      toast.success(`${targetUser.nickname} ha sido desbaneado`);
    } catch {
      toast.error('Error de conexión');
    }
  };

  const confirmBan = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser.id, isBanned: true, banReason: banReason || 'Sin razón especificada' }),
      });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error || 'Error al banear');
        return;
      }
      setUsers(prev =>
        prev.map(u =>
          u.id === selectedUser.id ? { ...u, isBanned: true, banReason } : u
        )
      );
      toast.success(`${selectedUser.nickname} ha sido baneado`);
      setShowBanDialog(false);
    } catch {
      toast.error('Error de conexión');
    }
  };

  // ---------- Discord Config ----------

  const handleDiscordSave = async () => {
    setDiscordLoading(true);
    try {
      const payload: Record<string, string> = {};
      if (dcForm.botToken) payload.botToken = dcForm.botToken;
      if (dcForm.serverId) payload.serverId = dcForm.serverId;
      if (dcForm.channelId) payload.channelId = dcForm.channelId;
      if (dcForm.webhookUrl) payload.webhookUrl = dcForm.webhookUrl;
      if (dcForm.modRoleId) payload.modRoleId = dcForm.modRoleId;
      if (dcForm.adminRoleId) payload.adminRoleId = dcForm.adminRoleId;
      if (dcForm.collabRoleId) payload.collabRoleId = dcForm.collabRoleId;

      const res = await fetch('/api/admin/discord', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error || 'Error al guardar');
        return;
      }
      toast.success('Configuración Discord guardada');
      fetchDiscordConfig();
    } catch {
      toast.error('Error de conexión');
    } finally {
      setDiscordLoading(false);
    }
  };

  // ---------- Comment Delete ----------

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await fetch('/api/comments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId }),
      });
      if (!res.ok) {
        toast.error('Error al eliminar comentario');
        return;
      }
      setAllComments(prev => prev.filter(c => c.id !== commentId));
      toast.success('Comentario eliminado');
    } catch {
      toast.error('Error de conexión');
    }
  };

  // ---------- Filtered Data ----------

  const filteredUsers = users.filter(u =>
    u.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // ---------- Loading State ----------

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-[#080818] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#FF2D78] border-t-transparent rounded-full" />
      </div>
    );
  }

  // ---------- Render Helpers ----------

  const renderStatCard = (icon: React.ReactNode, label: string, value: string | number, color: string) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}15` }}
      >
        <div style={{ color }}>{icon}</div>
      </div>
      <div>
        <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {value}
        </p>
        <p className="text-sm text-white/40">{label}</p>
      </div>
    </motion.div>
  );

  const renderUserAvatar = (userItem: AdminUser | { nickname: string; avatar?: string }, size = 'sm') => {
    const s = size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-10 h-10' : 'w-12 h-12';
    const iconSize = size === 'sm' ? 14 : size === 'md' ? 16 : 20;
    return (
      <div className={`${s} rounded-lg overflow-hidden shrink-0`}>
        {userItem.avatar ? (
          <img src={userItem.avatar} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#FF2D78] to-[#a855f7] flex items-center justify-center">
            <Users size={iconSize} className="text-white" />
          </div>
        )}
      </div>
    );
  };

  const formatTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 30) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  // ---------- Main Render ----------

  return (
    <div className="min-h-screen bg-[#080818] text-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF2D78] to-[#a855f7] flex items-center justify-center">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Panel de <span className="brand-gradient-text">Administración</span>
                </h1>
                <p className="text-sm text-white/40 mt-0.5">
                  Gestiona usuarios, comentarios, Discord y más
                </p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-white/5 border border-white/10 p-1 mb-6 flex flex-wrap h-auto gap-1">
                <TabsTrigger
                  value="dashboard"
                  className="data-[state=active]:bg-[#FF2D78]/20 data-[state=active]:text-[#FF2D78] text-white/50 px-4 py-2 rounded-lg text-sm"
                >
                  <Activity size={16} className="mr-1.5" /> Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="users"
                  className="data-[state=active]:bg-[#4D9FFF]/20 data-[state=active]:text-[#4D9FFF] text-white/50 px-4 py-2 rounded-lg text-sm"
                >
                  <Users size={16} className="mr-1.5" /> Usuarios
                </TabsTrigger>
                <TabsTrigger
                  value="comments"
                  className="data-[state=active]:bg-[#a855f7]/20 data-[state=active]:text-[#a855f7] text-white/50 px-4 py-2 rounded-lg text-sm"
                >
                  <MessageSquare size={16} className="mr-1.5" /> Comentarios
                </TabsTrigger>
                <TabsTrigger
                  value="discord"
                  className="data-[state=active]:bg-[#5865F2]/20 data-[state=active]:text-[#5865F2] text-white/50 px-4 py-2 rounded-lg text-sm"
                >
                  <Bot size={16} className="mr-1.5" /> Discord
                </TabsTrigger>
                <TabsTrigger
                  value="logs"
                  className="data-[state=active]:bg-[#22c55e]/20 data-[state=active]:text-[#22c55e] text-white/50 px-4 py-2 rounded-lg text-sm"
                >
                  <Clock size={16} className="mr-1.5" /> Logs
                </TabsTrigger>
              </TabsList>

              {/* ========== DASHBOARD TAB ========== */}
              <TabsContent value="dashboard" className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {renderStatCard(<Users size={22} />, 'Usuarios Registrados', stats?.stats.totalUsers || 0, '#FF2D78')}
                  {renderStatCard(<MessageSquare size={22} />, 'Comentarios Totales', stats?.stats.totalComments || 0, '#4D9FFF')}
                  {renderStatCard(<DollarSign size={22} />, 'Donaciones', stats?.stats.totalDonations || 0, '#22c55e')}
                </div>

                {/* Users by Role + Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Users by Role */}
                  <div className="glass-card p-6">
                    <h3 className="font-bold text-white mb-4 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Usuarios por Rol
                    </h3>
                    <div className="space-y-3">
                      {(stats?.usersByRole || []).map(r => {
                        const total = stats?.stats.totalUsers || 1;
                        const pct = Math.round((r._count / total) * 100);
                        return (
                          <div key={r.role}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-white/60">
                                {roleLabels[r.role] || r.role}
                              </span>
                              <span className="text-sm font-semibold text-white">
                                {r._count} <span className="text-white/30">({pct}%)</span>
                              </span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-white/5">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className={`h-full rounded-full ${
                                  r.role === 'owner' ? 'bg-yellow-400' :
                                  r.role === 'admin' ? 'bg-red-400' :
                                  r.role === 'moderator' ? 'bg-[#4D9FFF]' :
                                  r.role === 'collaborator' ? 'bg-green-400' :
                                  'bg-white/30'
                                }`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="glass-card p-6">
                    <h3 className="font-bold text-white mb-4 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Actividad Reciente
                    </h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {(logs.length > 0 ? logs : []).map(log => (
                        <div key={log.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-all">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                            <Zap size={14} className="text-white/30" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white/70">
                              <span className="font-medium text-white/90">{log.user?.nickname || 'Sistema'}</span>
                              {' — '}
                              {actionLabels[log.action] || log.action}
                            </p>
                            <p className="text-xs text-white/30 mt-0.5">{formatTimeAgo(log.createdAt)}</p>
                          </div>
                        </div>
                      ))}
                      {logs.length === 0 && (
                        <p className="text-sm text-white/30 text-center py-4">Sin actividad reciente</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent Users */}
                <div className="glass-card p-6">
                  <h3 className="font-bold text-white mb-4 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    <TrendingUp size={18} className="inline mr-2 text-[#FF2D78]" />
                    Usuarios Recientes
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                    {(stats?.recentUsers || []).map(u => (
                      <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                        {renderUserAvatar(u)}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{u.nickname}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-xs px-1.5 py-0.5 rounded-full border ${roleColors[u.role] || roleColors.user}`}>
                              {roleLabels[u.role] || u.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!stats?.recentUsers || stats.recentUsers.length === 0) && (
                      <p className="text-sm text-white/30 col-span-full text-center py-4">Sin usuarios</p>
                    )}
                  </div>
                </div>

                {/* Donations */}
                <div className="glass-card p-6">
                  <h3 className="font-bold text-white mb-4 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    <DollarSign size={18} className="inline mr-2 text-[#22c55e]" />
                    Donaciones Recientes
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {(stats?.donations || []).map(d => (
                      <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#22c55e]/10 flex items-center justify-center">
                            <DollarSign size={14} className="text-[#22c55e]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {d.currency === 'USD' ? '$' : '€'}{d.amount.toFixed(2)}
                            </p>
                            {d.message && (
                              <p className="text-xs text-white/40 truncate max-w-xs">{d.message}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-white/30">{formatTimeAgo(d.createdAt)}</span>
                      </div>
                    ))}
                    {(!stats?.donations || stats.donations.length === 0) && (
                      <p className="text-sm text-white/30 text-center py-4">Sin donaciones registradas</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* ========== USERS TAB ========== */}
              <TabsContent value="users" className="space-y-6">
                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="text"
                      placeholder="Buscar por nickname o email..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2D78]/50 placeholder:text-white/25"
                    />
                  </div>
                  <button
                    onClick={fetchUsers}
                    className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    <RefreshCw size={14} className={usersLoading ? 'animate-spin' : ''} /> Refrescar
                  </button>
                </div>

                {/* Users Count */}
                <div className="flex items-center gap-2 text-sm text-white/40">
                  <Users size={14} />
                  <span>{filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''}</span>
                  <span className="text-white/20">·</span>
                  <span className="text-[#FF2D78]">{filteredUsers.filter(u => u.isBanned).length} baneados</span>
                </div>

                {/* Users Table */}
                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10 hover:bg-transparent">
                          <TableHead className="text-white/40 text-xs">Usuario</TableHead>
                          <TableHead className="text-white/40 text-xs">Rol</TableHead>
                          <TableHead className="text-white/40 text-xs hidden md:table-cell">Estado</TableHead>
                          <TableHead className="text-white/40 text-xs hidden lg:table-cell">Comentarios</TableHead>
                          <TableHead className="text-white/40 text-xs hidden lg:table-cell">Registro</TableHead>
                          <TableHead className="text-white/40 text-xs text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map(u => (
                          <TableRow key={u.id} className="border-white/5 hover:bg-white/5">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {renderUserAvatar(u)}
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-white truncate max-w-[140px]">
                                    {u.nickname}
                                    {u.isPremium && <Crown size={12} className="inline text-yellow-400 ml-1" />}
                                  </p>
                                  {u.email && (
                                    <p className="text-xs text-white/30 truncate max-w-[140px]">{u.email}</p>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={u.role}
                                onValueChange={val => handleRoleChange(u.id, val)}
                                disabled={u.role === 'owner' || (user.role === 'admin' && u.role === 'admin')}
                              >
                                <SelectTrigger className="w-[100px] h-8 text-xs bg-white/5 border-white/10 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0d0d24] border-white/10">
                                  <SelectItem value="user" className="text-white/70">Usuario</SelectItem>
                                  <SelectItem value="collaborator" className="text-white/70">Colaborador</SelectItem>
                                  <SelectItem value="moderator" className="text-white/70">Moderador</SelectItem>
                                  <SelectItem value="admin" className="text-white/70">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge
                                variant="outline"
                                className={
                                  u.isBanned
                                    ? 'border-red-500/30 bg-red-500/10 text-red-400'
                                    : 'border-green-500/30 bg-green-500/10 text-green-400'
                                }
                              >
                                {u.isBanned ? (
                                  <><Ban size={10} className="mr-1" /> Baneado</>
                                ) : (
                                  <><CheckCircle size={10} className="mr-1" /> Activo</>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <span className="text-sm text-white/50">{u._count.comments}</span>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <span className="text-xs text-white/30">
                                {new Date(u.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: '2-digit' })}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                {u.isBanned ? (
                                  <button
                                    onClick={() => handleBanToggle(u, false)}
                                    className="p-2 rounded-lg text-green-400 hover:bg-green-500/10 transition-all"
                                    title="Desbanear"
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleBanToggle(u, true)}
                                    className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                                    title="Banear"
                                  >
                                    <Ban size={16} />
                                  </button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredUsers.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-white/30">
                              No se encontraron usuarios
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              {/* ========== COMMENTS TAB ========== */}
              <TabsContent value="comments" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-white/40">
                    <MessageSquare size={14} />
                    <span>{allComments.length} comentarios recientes</span>
                  </div>
                  <button
                    onClick={fetchStats}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    <RefreshCw size={14} /> Refrescar
                  </button>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {allComments.map(c => (
                    <div key={c.id} className="glass-card p-4 flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a855f7] to-[#4D9FFF] flex items-center justify-center shrink-0">
                        <MessageSquare size={16} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-white">{c.author?.nickname || 'Anónimo'}</span>
                          <span className="text-xs text-white/30">{formatTimeAgo(c.createdAt)}</span>
                          {c.reports > 0 && (
                            <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-400 text-xs">
                              <AlertTriangle size={10} className="mr-1" /> {c.reports} reporte{c.reports !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-white/60 line-clamp-2">{c.content}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                        title="Eliminar comentario"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {allComments.length === 0 && (
                    <div className="glass-card p-8 text-center">
                      <MessageSquare size={32} className="mx-auto text-white/10 mb-3" />
                      <p className="text-sm text-white/30">No hay comentarios aún</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* ========== DISCORD TAB ========== */}
              <TabsContent value="discord" className="space-y-6">
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#5865F2]/10 flex items-center justify-center">
                      <Bot size={20} className="text-[#5865F2]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Configuración del Bot Discord
                      </h3>
                      <p className="text-xs text-white/40">Conecta el bot de Discord para sincronización de roles</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Bot Token */}
                    <div>
                      <label className="text-xs text-white/40 block mb-1.5 flex items-center gap-1.5">
                        <Shield size={12} /> Token del Bot
                      </label>
                      <div className="relative">
                        <input
                          type={showBotToken ? 'text' : 'password'}
                          value={dcForm.botToken}
                          onChange={e => setDcForm(prev => ({ ...prev, botToken: e.target.value }))}
                          placeholder={discordConfig?.hasBotToken ? 'Token configurado — dejar vacío para mantener' : 'Ingresa el token del bot'}
                          className="w-full px-4 py-2.5 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#5865F2]/50 placeholder:text-white/25"
                        />
                        <button
                          onClick={() => setShowBotToken(!showBotToken)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                        >
                          {showBotToken ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Server ID */}
                    <div>
                      <label className="text-xs text-white/40 block mb-1.5 flex items-center gap-1.5">
                        <Globe size={12} /> ID del Servidor
                      </label>
                      <input
                        type="text"
                        value={dcForm.serverId}
                        onChange={e => setDcForm(prev => ({ ...prev, serverId: e.target.value }))}
                        placeholder="123456789012345678"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#5865F2]/50 placeholder:text-white/25"
                      />
                    </div>

                    {/* Channel ID */}
                    <div>
                      <label className="text-xs text-white/40 block mb-1.5 flex items-center gap-1.5">
                        <MessageSquare size={12} /> ID del Canal
                      </label>
                      <input
                        type="text"
                        value={dcForm.channelId}
                        onChange={e => setDcForm(prev => ({ ...prev, channelId: e.target.value }))}
                        placeholder="123456789012345678"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#5865F2]/50 placeholder:text-white/25"
                      />
                    </div>

                    {/* Webhook URL */}
                    <div>
                      <label className="text-xs text-white/40 block mb-1.5 flex items-center gap-1.5">
                        <Zap size={12} /> Webhook URL
                      </label>
                      <input
                        type="text"
                        value={dcForm.webhookUrl}
                        onChange={e => setDcForm(prev => ({ ...prev, webhookUrl: e.target.value }))}
                        placeholder={discordConfig?.webhookUrl ? 'Webhook configurado — dejar vacío para mantener' : 'https://discord.com/api/webhooks/...'}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#5865F2]/50 placeholder:text-white/25"
                      />
                    </div>

                    <div className="h-px bg-white/10 my-2" />

                    {/* Role IDs */}
                    <h4 className="text-sm font-semibold text-white/70 flex items-center gap-2">
                      <Crown size={14} className="text-yellow-400" /> IDs de Roles de Discord
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-white/40 block mb-1.5">Rol Moderador</label>
                        <input
                          type="text"
                          value={dcForm.modRoleId}
                          onChange={e => setDcForm(prev => ({ ...prev, modRoleId: e.target.value }))}
                          placeholder="ID del rol mod"
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#5865F2]/50 placeholder:text-white/25"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/40 block mb-1.5">Rol Admin</label>
                        <input
                          type="text"
                          value={dcForm.adminRoleId}
                          onChange={e => setDcForm(prev => ({ ...prev, adminRoleId: e.target.value }))}
                          placeholder="ID del rol admin"
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#5865F2]/50 placeholder:text-white/25"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/40 block mb-1.5">Rol Colaborador</label>
                        <input
                          type="text"
                          value={dcForm.collabRoleId}
                          onChange={e => setDcForm(prev => ({ ...prev, collabRoleId: e.target.value }))}
                          placeholder="ID del rol colab"
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#5865F2]/50 placeholder:text-white/25"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleDiscordSave}
                        disabled={discordLoading}
                        className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50 flex items-center gap-2"
                        style={{ background: '#5865F2' }}
                      >
                        <Save size={16} /> {discordLoading ? 'Guardando...' : 'Guardar Configuración'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Connection Status */}
                <div className="glass-card p-6">
                  <h3 className="font-bold text-white mb-4 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Estado de Conexión
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <span className="text-sm text-white/60">Token del Bot</span>
                      <span className={`text-sm font-medium ${discordConfig?.hasBotToken ? 'text-green-400' : 'text-red-400'}`}>
                        {discordConfig?.hasBotToken ? 'Configurado ✓' : 'No configurado'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <span className="text-sm text-white/60">Servidor</span>
                      <span className={`text-sm font-medium ${discordConfig?.serverId ? 'text-green-400' : 'text-red-400'}`}>
                        {discordConfig?.serverId ? 'Vinculado ✓' : 'No vinculado'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <span className="text-sm text-white/60">Canal</span>
                      <span className={`text-sm font-medium ${discordConfig?.channelId ? 'text-green-400' : 'text-red-400'}`}>
                        {discordConfig?.channelId ? 'Configurado ✓' : 'No configurado'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <span className="text-sm text-white/60">Webhook</span>
                      <span className={`text-sm font-medium ${discordConfig?.webhookUrl ? 'text-green-400' : 'text-red-400'}`}>
                        {discordConfig?.webhookUrl ? 'Configurado ✓' : 'No configurado'}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ========== LOGS TAB ========== */}
              <TabsContent value="logs" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-white/40">
                    <Clock size={14} />
                    <span>{logs.length} entradas de registro</span>
                  </div>
                  <button
                    onClick={fetchStats}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    <RefreshCw size={14} /> Refrescar
                  </button>
                </div>

                <div className="glass-card overflow-hidden">
                  <div className="divide-y divide-white/5">
                    {logs.map((log, i) => (
                      <div key={log.id} className="p-4 hover:bg-white/5 transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                            <Activity size={16} className="text-white/30" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-white/90">
                                {log.user?.nickname || 'Sistema'}
                              </span>
                              <Badge variant="outline" className="border-white/10 bg-white/5 text-white/50 text-xs">
                                {actionLabels[log.action] || log.action}
                              </Badge>
                              <span className="text-xs text-white/25">
                                {formatTimeAgo(log.createdAt)}
                              </span>
                            </div>
                            {log.details && (
                              <details className="mt-1">
                                <summary className="text-xs text-white/30 cursor-pointer hover:text-white/50 transition-colors">
                                  Ver detalles
                                </summary>
                                <pre className="mt-2 p-3 rounded-lg bg-black/30 text-xs text-white/40 overflow-x-auto max-w-full">
                                  {log.details}
                                </pre>
                              </details>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {logs.length === 0 && (
                      <div className="p-8 text-center">
                        <Clock size={32} className="mx-auto text-white/10 mb-3" />
                        <p className="text-sm text-white/30">Sin registros de actividad</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      {/* Ban Dialog */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent className="bg-[#0d0d24] border border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <Ban size={18} /> Banear Usuario
            </DialogTitle>
            <DialogDescription className="text-white/40">
              ¿Estás seguro de banear a <span className="text-white font-medium">{selectedUser?.nickname}</span>?
              Esta acción impedirá que el usuario acceda a su cuenta.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div>
              <label className="text-xs text-white/40 block mb-1.5">Razón del ban</label>
              <textarea
                value={banReason}
                onChange={e => setBanReason(e.target.value)}
                placeholder="Describe la razón del baneo..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500/50 placeholder:text-white/25 resize-none h-24"
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <button
                onClick={() => setShowBanDialog(false)}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={confirmBan}
                className="px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/30 transition-all flex items-center gap-2"
              >
                <Ban size={14} /> Confirmar Ban
              </button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
