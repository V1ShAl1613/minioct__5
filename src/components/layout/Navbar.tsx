import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Bell,
  Search,
  Bookmark,
  Briefcase,
  User,
  Shield,
  LogOut,
  ChevronDown,
  Menu,
  X,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import type { NotificationItem } from '../../types/index.ts';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  notifications: NotificationItem[];
  onMarkNotificationRead?: (id: string) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  notifications,
  onMarkNotificationRead,
  onOpenAuth,
}) => {
  const { userProfile, isDemoMode, logout, switchRole, profileCompleteness } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  CampusConnect
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Opportunities & Updates</p>
            </div>
          </button>
        </div>

        {/* Desktop Central Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('discover')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentTab === 'discover'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => onNavigate('ai-search')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentTab === 'ai-search'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                : 'text-blue-400 hover:text-blue-300 hover:bg-blue-950/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Search
          </button>
          <button
            onClick={() => onNavigate('campus-updates')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentTab === 'campus-updates'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Campus Updates
          </button>
          <button
            onClick={() => onNavigate('saved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentTab === 'saved'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Saved
          </button>
          <button
            onClick={() => onNavigate('applications')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentTab === 'applications'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Applications
          </button>

          {userProfile?.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentTab === 'admin'
                  ? 'bg-amber-600 text-white'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-amber-950/40'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </button>
          )}
        </nav>

        {/* Right Section: Notification, Profile, Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 text-xs text-slate-300 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-blue-400" />
                    <span>Campus Alerts ({unreadCount} new)</span>
                  </div>
                  <button
                    onClick={() => {
                      onNavigate('notifications');
                      setShowNotifications(false);
                    }}
                    className="text-blue-400 hover:underline text-[11px]"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {notifications.slice(0, 4).map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onMarkNotificationRead?.(n.id);
                        if (n.type === 'match' || n.type === 'deadline') onNavigate('dashboard');
                        else if (n.type === 'announcement') onNavigate('campus-updates');
                        else if (n.type === 'application') onNavigate('applications');
                        setShowNotifications(false);
                      }}
                      className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                        n.read
                          ? 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                          : 'bg-blue-950/30 border-blue-500/30 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-semibold text-white truncate">{n.title}</span>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />}
                      </div>
                      <p className="line-clamp-2 text-[11px] leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <p className="text-center py-4 text-slate-500">No new notifications</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Auth Button */}
          {userProfile ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <img
                  src={
                    userProfile.photoURL ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={userProfile.name}
                  className="w-7 h-7 rounded-xl object-cover"
                />
                <span className="text-xs font-semibold text-slate-200 hidden sm:inline max-w-[100px] truncate">
                  {userProfile.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 text-xs text-slate-300 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3 border-b border-slate-800 mb-1">
                    <p className="font-bold text-white truncate">{userProfile.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{userProfile.email}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Profile completion</span>
                      <span className="font-bold text-blue-400">{profileCompleteness}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all"
                        style={{ width: `${profileCompleteness}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-slate-200"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      switchRole(userProfile.role === 'admin' ? 'student' : 'admin');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-amber-300"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Switch to {userProfile.role === 'admin' ? 'Student' : 'Admin'} Mode</span>
                  </button>

                  <div className="my-1 border-t border-slate-800" />

                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-500/10 text-rose-400 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-1.5 animate-in slide-in-from-top-3">
          <button
            onClick={() => {
              onNavigate('dashboard');
              setShowMobileMenu(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-900"
          >
            Student Dashboard
          </button>
          <button
            onClick={() => {
              onNavigate('discover');
              setShowMobileMenu(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-900"
          >
            Discover Opportunities
          </button>
          <button
            onClick={() => {
              onNavigate('ai-search');
              setShowMobileMenu(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-blue-400 hover:bg-slate-900 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Natural Search
          </button>
          <button
            onClick={() => {
              onNavigate('campus-updates');
              setShowMobileMenu(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-900"
          >
            Campus Announcements
          </button>
          <button
            onClick={() => {
              onNavigate('saved');
              setShowMobileMenu(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-900"
          >
            Saved Opportunities
          </button>
          <button
            onClick={() => {
              onNavigate('applications');
              setShowMobileMenu(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-900"
          >
            Application Tracking
          </button>
          <button
            onClick={() => {
              onNavigate('profile');
              setShowMobileMenu(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-900"
          >
            Profile & Skills
          </button>
          {userProfile?.role === 'admin' && (
            <button
              onClick={() => {
                onNavigate('admin');
                setShowMobileMenu(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-amber-400 hover:bg-amber-950/20"
            >
              Admin Dashboard
            </button>
          )}
        </div>
      )}
    </header>
  );
};
