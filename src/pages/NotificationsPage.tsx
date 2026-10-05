import React, { useState } from 'react';
import {
  Bell,
  Sparkles,
  Clock,
  Layers,
  CheckCircle2,
  CheckCheck,
  AlertTriangle,
} from 'lucide-react';
import type { NotificationItem } from '../types/index.ts';

interface NotificationsPageProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigate: (tab: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onNavigate,
}) => {
  const [filterType, setFilterType] = useState<string>('All');

  const filtered = notifications.filter(n => {
    if (filterType === 'All') return true;
    if (filterType === 'Unread') return !n.read;
    return n.type === filterType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'match':
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case 'deadline':
        return <Clock className="w-4 h-4 text-rose-400" />;
      case 'announcement':
        return <Bell className="w-4 h-4 text-amber-400" />;
      case 'application':
        return <Layers className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-blue-400" />
            <span>Notification Center</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Personalized alerts for upcoming deadlines, high match opportunities, and campus circulars.
          </p>
        </div>

        <button
          type="button"
          onClick={onMarkAllRead}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <CheckCheck className="w-4 h-4 text-blue-400" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['All', 'Unread', 'match', 'deadline', 'announcement', 'application'].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize ${
              filterType === t
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Notifications Feed */}
      <div className="space-y-3">
        {filtered.map(notif => (
          <div
            key={notif.id}
            onClick={() => {
              onMarkRead(notif.id);
              if (notif.type === 'match' || notif.type === 'deadline') onNavigate('dashboard');
              else if (notif.type === 'announcement') onNavigate('campus-updates');
              else if (notif.type === 'application') onNavigate('applications');
            }}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
              notif.read
                ? 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                : 'bg-slate-900/90 border-blue-500/30 text-slate-200 shadow-md shadow-blue-500/5'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
              {getIcon(notif.type)}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{notif.title}</span>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  )}
                </h4>
                <span className="text-[11px] text-slate-500 shrink-0">
                  {new Date(notif.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{notif.message}</p>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 rounded-3xl bg-slate-900 border border-slate-800 p-8">
            <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white">No notifications here</h4>
            <p className="text-xs text-slate-400 mt-1">You're completely up to date!</p>
          </div>
        )}
      </div>
    </div>
  );
};
