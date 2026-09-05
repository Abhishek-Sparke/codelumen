import React, { useState } from 'react';
import { 
  Code2, Flame, Bell, Search, User, CheckCircle2, Bookmark, 
  Settings, LogOut, Shield, ChevronDown, Sparkles
} from 'lucide-react';
import { UserProfile, NotificationItem } from '../../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  currentUser: UserProfile;
  notifications: NotificationItem[];
  onOpenSearch: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onMarkNotificationsRead: () => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  notifications,
  onOpenSearch,
  onOpenAuth,
  onMarkNotificationsRead,
  isLoggedIn = true,
  onLogout
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { id: 'problems', label: 'Problems' },
    { id: 'roadmaps', label: 'Roadmaps' },
    { id: 'patterns', label: 'Patterns' },
    { id: 'contests', label: 'Contests' },
    { id: 'discuss', label: 'Discuss' },
    { id: 'leaderboard', label: 'Leaderboard' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#09090c]/85 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Main Nav */}
        <div className="flex items-center gap-8">
          <button 
            onClick={() => onNavigate('landing')}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
            aria-label="CodeLumen Home"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 via-white/5 to-cyan-500/20 p-[1px] shadow-sm transition-transform duration-300 group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#0f0f14]">
                <Code2 className="h-4.5 w-4.5 text-amber-400 transition-colors group-hover:text-amber-300" />
              </div>
            </div>
            <div>
              <span className="block font-display text-lg font-bold tracking-[0.16em] text-white">
                CODELUMEN
              </span>
              <span className="block text-[9px] font-semibold uppercase tracking-[0.22em] text-white/40">
                DSA Mastery
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`relative rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide transition-all ${
                    isActive 
                      ? 'bg-white/10 text-white shadow-sm' 
                      : 'text-white/65 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-[17px] left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-amber-200" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Utilities */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Global Search Button with '/' shortcut badge */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white/60 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            aria-label="Global Search"
          >
            <Search className="h-3.5 w-3.5 text-white/50" />
            <span className="hidden sm:inline">Search problems, patterns...</span>
            <span className="inline sm:hidden">Search</span>
            <kbd className="hidden items-center rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-white/40 sm:inline-flex">
              /
            </kbd>
          </button>

          {!isLoggedIn ? (
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <button
                onClick={() => onOpenAuth('login')}
                className="rounded-full px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white text-gray-900 px-3 sm:px-3.5 py-1.5 text-xs font-bold shadow-sm hover:bg-slate-100 transition-all hover:scale-105 active:scale-95"
              >
                <svg className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.32 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>Sign up</span>
              </button>
            </div>
          ) : (
            <>
              {/* Coding Streak Pill */}
              <button
                onClick={() => onNavigate('dashboard')}
                title={`${currentUser.streak} Day Active Practice Streak`}
                className="group flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300 transition-all hover:border-amber-500/40 hover:bg-amber-500/20"
              >
                <Flame className="h-3.5 w-3.5 fill-amber-400 text-amber-400 transition-transform group-hover:scale-110" />
                <span>{currentUser.streak}</span>
              </button>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white/70 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div 
                    className="glass-panel absolute right-0 mt-2.5 w-80 rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setShowNotifications(false)}
                  >
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 px-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <button 
                          onClick={onMarkNotificationsRead}
                          className="text-[11px] font-medium text-amber-400 hover:text-amber-300"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="mt-2 max-h-72 space-y-1.5 overflow-y-auto pr-1">
                      {notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          onClick={() => {
                            if (notif.linkUrl) onNavigate(notif.linkUrl.replace('/',''));
                            setShowNotifications(false);
                          }}
                          className={`cursor-pointer rounded-xl p-2.5 text-xs transition-colors ${
                            notif.read ? 'bg-white/[0.02] text-white/60 hover:bg-white/[0.05]' : 'bg-amber-500/10 text-white hover:bg-amber-500/15'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-semibold text-white/90">{notif.title}</span>
                            <span className="text-[10px] text-white/40">{notif.timestamp}</span>
                          </div>
                          <p className="mt-1 text-[11px] leading-relaxed text-white/70">{notif.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] p-1 pr-2.5 text-xs transition-all hover:border-white/20 hover:bg-white/[0.08]"
                  aria-label="User profile menu"
                >
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="h-6.5 w-6.5 rounded-full object-cover ring-1 ring-white/20"
                  />
                  <span className="hidden text-xs font-medium text-white/85 sm:inline">
                    {currentUser.username}
                  </span>
                  <ChevronDown className="h-3 w-3 text-white/50" />
                </button>

                {showProfileMenu && (
                  <div 
                    className="glass-panel absolute right-0 mt-2.5 w-60 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setShowProfileMenu(false)}
                  >
                    {/* Header Profile Info */}
                    <div className="border-b border-white/[0.08] px-3 py-2.5">
                      <p className="text-xs font-semibold text-white">{currentUser.name}</p>
                      <p className="text-[11px] text-white/50">@{currentUser.username}</p>
                      <div className="mt-2 flex items-center justify-between rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-[11px]">
                        <span className="text-amber-400 font-semibold">{currentUser.levelTitle}</span>
                        <span className="text-white/60 font-mono">Lvl {currentUser.level} · {currentUser.xp} XP</span>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="mt-1 space-y-0.5">
                      <button
                        onClick={() => { onNavigate('profile', currentUser.id); setShowProfileMenu(false); }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-white/70 hover:bg-white/[0.06] hover:text-white"
                      >
                        <User className="h-3.5 w-3.5 text-white/50" />
                        Profile
                      </button>
                      <button
                        onClick={() => { onNavigate('dashboard'); setShowProfileMenu(false); }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-white/70 hover:bg-white/[0.06] hover:text-white"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-white/50" />
                        My Progress
                      </button>
                      <button
                        onClick={() => { onNavigate('problems', 'saved'); setShowProfileMenu(false); }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-white/70 hover:bg-white/[0.06] hover:text-white"
                      >
                        <Bookmark className="h-3.5 w-3.5 text-white/50" />
                        Saved Problems ({currentUser.savedProblemIds.length})
                      </button>
                      <button
                        onClick={() => { onNavigate('submissions'); setShowProfileMenu(false); }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-white/70 hover:bg-white/[0.06] hover:text-white"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-white/50" />
                        Submissions
                      </button>
                      <button
                        onClick={() => { onNavigate('settings'); setShowProfileMenu(false); }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-white/70 hover:bg-white/[0.06] hover:text-white"
                      >
                        <Settings className="h-3.5 w-3.5 text-white/50" />
                        Settings
                      </button>
                      <button
                        onClick={() => { onNavigate('admin'); setShowProfileMenu(false); }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-amber-400/90 hover:bg-amber-400/10 hover:text-amber-300"
                      >
                        <Shield className="h-3.5 w-3.5 text-amber-400" />
                        Admin Dashboard
                      </button>

                      <div className="my-1 border-t border-white/[0.06]" />

                      <button
                        onClick={() => {
                          if (onLogout) onLogout();
                          setShowProfileMenu(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-rose-400/80 hover:bg-rose-500/10 hover:text-rose-300"
                      >
                        <LogOut className="h-3.5 w-3.5 text-rose-400" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

        </div>

      </div>
    </header>
  );
};
