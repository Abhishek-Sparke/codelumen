import React, { useState } from 'react';
import { 
  Flame, Bell, Search, User, Bookmark, 
  Settings, LogOut, ChevronDown, Sparkles, Shield
} from 'lucide-react';
import { UserProfile, NotificationItem } from '../../types';
import { CodeSparkLogo } from '../brand/CodeSparkLogo';
import { Link } from '../../router/Link';

interface NavbarProps {
  currentView: string;
  currentPath?: string;
  onNavigate: (view: string, param?: string) => void;
  currentUser: UserProfile | null;
  notifications: NotificationItem[];
  onOpenSearch: () => void;
  onOpenAuth: (mode?: 'login' | 'signup', returnTo?: string) => void;
  onMarkNotificationsRead: () => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  currentPath = '',
  onNavigate,
  currentUser,
  notifications,
  onOpenSearch,
  onOpenAuth,
  onMarkNotificationsRead,
  isLoggedIn = false,
  onLogout
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const pathname = currentPath || (typeof window !== 'undefined' ? window.location.pathname : '');

  // Logged out vs Logged in Navigation
  const loggedOutNavLinks = [
    { id: 'problems', label: 'Problems', href: '/problems' },
    { id: 'roadmaps', label: 'Roadmap', href: '/roadmap' },
    { id: 'discuss', label: 'Discuss', href: '/discussions' },
    { id: 'landing', label: 'Features', href: '/' },
  ];

  const loggedInNavLinks = [
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
    { id: 'problems', label: 'Problems', href: '/problems' },
    { id: 'roadmaps', label: 'Roadmap', href: '/roadmap' },
    { id: 'contests', label: 'Contests', href: '/contests' },
    { id: 'discuss', label: 'Discuss', href: '/discussions' },
  ];

  const navLinks = isLoggedIn ? loggedInNavLinks : loggedOutNavLinks;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#09090c]/90 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Navigation Links */}
        <div className="flex items-center gap-8">
          <Link 
            href={isLoggedIn ? '/dashboard' : '/'}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
            aria-label="CodeSpark Home"
          >
            <div className="relative flex items-center">
              <CodeSparkLogo size="sm" animate={true} />
            </div>
            <span className="hidden sm:inline-block text-[9px] font-semibold uppercase tracking-[0.22em] text-white/40 border-l border-white/10 pl-2">
              DSA Mastery
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = 
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href)) ||
                (link.id === 'problems' && (pathname.startsWith('/problems') || pathname.startsWith('/saved')));

              return (
                <Link
                  key={link.id}
                  href={link.href}
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
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Utilities */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Section 13: Logged Out Navbar buttons: Log In, Start Coding */}
          {!isLoggedIn ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => onOpenAuth('login')}
                className="rounded-full px-4 py-1.5 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                Log In
              </button>

              <button
                onClick={() => onOpenAuth('signup')}
                className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-4 sm:px-5 py-2 text-xs font-bold uppercase tracking-wider text-black shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Start Coding</span>
                <Sparkles className="h-3.5 w-3.5 fill-black" />
              </button>
            </div>
          ) : (
            /* Section 13: Logged In Navbar right: Search, Streak, Notifications, Profile */
            <>
              {/* Search Button */}
              <button
                onClick={onOpenSearch}
                className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white/60 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                aria-label="Global Search"
              >
                <Search className="h-3.5 w-3.5 text-white/50" />
                <span className="hidden sm:inline">Search...</span>
                <kbd className="hidden items-center rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-white/40 sm:inline-flex">
                  /
                </kbd>
              </button>

              {/* Coding Streak Pill */}
              {currentUser && (
                <button
                  onClick={() => onNavigate('dashboard')}
                  title={`${currentUser.streak} Day Active Streak`}
                  className="group flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300 transition-all hover:border-amber-500/40 hover:bg-amber-500/20"
                >
                  <Flame className="h-3.5 w-3.5 fill-amber-400 text-amber-400 transition-transform group-hover:scale-110" />
                  <span>{currentUser.streak}</span>
                </button>
              )}

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
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="mt-2 max-h-72 space-y-1.5 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <div className="py-8 px-4 text-center">
                          <Bell className="mx-auto h-7 w-7 text-white/20 mb-2" />
                          <p className="text-xs font-semibold text-white/70">No notifications yet</p>
                          <p className="text-[11px] text-white/40 mt-1">
                            Problem solves, streak updates, and milestone alerts will appear here.
                          </p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
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
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Dropdown */}
              {currentUser && (
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
                      {/* Profile Header */}
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
                        <Link
                          href={`/profile/${currentUser.username || currentUser.id}`}
                          onClick={() => setShowProfileMenu(false)}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-white/70 hover:bg-white/[0.06] hover:text-white"
                        >
                          <User className="h-3.5 w-3.5 text-white/50" />
                          Profile
                        </Link>
                        <Link
                          href="/dashboard"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-white/70 hover:bg-white/[0.06] hover:text-white"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-white/50" />
                          Dashboard
                        </Link>
                        <Link
                          href="/problems/saved"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-white/70 hover:bg-white/[0.06] hover:text-white"
                        >
                          <Bookmark className="h-3.5 w-3.5 text-white/50" />
                          Saved Problems ({currentUser.savedProblemIds?.length || 0})
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-white/70 hover:bg-white/[0.06] hover:text-white"
                        >
                          <Settings className="h-3.5 w-3.5 text-white/50" />
                          Settings
                        </Link>

                        {(currentUser.role === 'admin' || currentUser.role === 'moderator') && (
                          <Link
                            href="/admin"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-amber-400 hover:bg-amber-400/10 transition-colors"
                          >
                            <Shield className="h-3.5 w-3.5 text-amber-400" />
                            {currentUser.role === 'admin' ? 'Control Center (Admin)' : 'Staff Moderation'}
                          </Link>
                        )}
                        
                        <div className="my-1 border-t border-white/[0.08]" />

                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            if (onLogout) onLogout();
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </header>
  );
};
