'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetch('/api/notifications').then(r => r.json()).then(data => {
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    });
  }, []);

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ markAllRead: true }) });
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="absolute right-4 top-full mt-2 w-80 bg-[#0d0d24] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-[#FF2D78]" />
          <span className="text-sm font-bold text-white">Notificaciones</span>
          {unreadCount > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-[#FF2D78] text-white">{unreadCount}</span>}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-xs text-[#4D9FFF] hover:underline flex items-center gap-1">
            <Check size={12} /> Leer todo
          </button>
        )}
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-white/30 text-sm">No hay notificaciones</div>
        ) : (
          notifications.slice(0, 10).map(n => (
            <div key={n.id} className={`p-3 border-b border-white/5 hover:bg-white/5 transition-colors ${!n.isRead ? 'bg-white/3' : ''}`}>
              <div className="flex items-start gap-2">
                {!n.isRead && <div className="w-2 h-2 rounded-full bg-[#FF2D78] mt-1.5 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white">{n.title}</p>
                  <p className="text-xs text-white/50 mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-[10px] text-white/20 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
