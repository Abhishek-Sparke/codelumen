import React, { useState } from 'react';
import {
  Shield,
  LayoutDashboard,
  Users,
  Code,
  Compass,
  FileText,
  ShieldAlert,
  Trophy,
  Sparkles,
  Settings,
  Clock,
  TrendingUp,
  ArrowLeft,
  Menu,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { UserProfile, AdminRole } from '../../types';
import { AdminService } from '../../services/adminService';
import { Link } from '../../router/Link';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AdminUsersView } from './views/AdminUsersView';
import { AdminModerationView } from './views/AdminModerationView';
import { AdminDiscussionRulesView } from './views/AdminDiscussionRulesView';
import { AdminProblemsView } from './views/AdminProblemsView';
import { AdminLearningView } from './views/AdminLearningView';
import { AdminContestsView } from './views/AdminContestsView';
import { AdminSparkView } from './views/AdminSparkView';
import { AdminSettingsView } from './views/AdminSettingsView';
import { AdminAuditLogsView } from './views/AdminAuditLogsView';
import { AdminAnalyticsView } from './views/AdminAnalyticsView';
import { navigate } from '../../router/router';

interface AdminLayoutProps {
  currentUser: UserProfile;
  activeSection?: string;
  onNavigateSection: (section: string) => void;
  onNavigateProblem: (problemId: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  roleRequirement: 'admin' | 'moderator';
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentUser,
  activeSection = 'dashboard',
  onNavigateSection,
  onNavigateProblem
}) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Platform Overview', icon: LayoutDashboard, roleRequirement: 'moderator' },
    { id: 'users', label: 'Users & Roles', icon: Users, roleRequirement: 'admin' },
    { id: 'problems', label: 'Problem CMS', icon: Code, roleRequirement: 'admin' },
    { id: 'roadmaps', label: 'Curriculum & Plans', icon: Compass, roleRequirement: 'admin' },
    { id: 'rules', label: 'Discussion Rules CMS', icon: FileText, roleRequirement: 'moderator' },
    { id: 'moderation', label: 'Moderation Queue', icon: ShieldAlert, roleRequirement: 'moderator' },
    { id: 'contests', label: 'Contest Arena', icon: Trophy, roleRequirement: 'admin' },
    { id: 'spark', label: 'Spark AI Controls', icon: Sparkles, roleRequirement: 'admin' },
    { id: 'settings', label: 'Platform Settings', icon: Settings, roleRequirement: 'admin' },
    { id: 'audit-logs', label: 'Immutable Audit Logs', icon: Clock, roleRequirement: 'admin' },
    { id: 'analytics', label: 'Platform Analytics', icon: TrendingUp, roleRequirement: 'admin' }
  ];

  // Filter nav items based on currentUser role
  const visibleNavItems = navItems.filter((item) => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'moderator') return item.roleRequirement === 'moderator';
    return false;
  });

  const handleSelectSection = (sectionId: string) => {
    onNavigateSection(sectionId);
    navigate(sectionId === 'dashboard' ? '/admin' : (sectionId === 'rules' ? '/admin/discussions/rules' : `/admin/${sectionId}`));
    setIsMobileNavOpen(false);
  };

  const renderActiveView = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboardView currentUser={currentUser} onNavigate={handleSelectSection} />;
      case 'users':
        if (!AdminService.hasPermission(currentUser.role, 'users.view')) return <PermissionDeniedMessage />;
        return <AdminUsersView currentUser={currentUser} />;
      case 'problems':
        if (!AdminService.hasPermission(currentUser.role, 'problems.view_all')) return <PermissionDeniedMessage />;
        return <AdminProblemsView currentUser={currentUser} onNavigateProblem={onNavigateProblem} />;
      case 'roadmaps':
      case 'study-plans':
        if (!AdminService.hasPermission(currentUser.role, 'learning.manage')) return <PermissionDeniedMessage />;
        return <AdminLearningView currentUser={currentUser} />;
      case 'rules':
      case 'discussions':
        return <AdminDiscussionRulesView currentUser={currentUser} />;
      case 'moderation':
      case 'reports':
        return <AdminModerationView currentUser={currentUser} />;
      case 'contests':
        if (!AdminService.hasPermission(currentUser.role, 'contests.manage')) return <PermissionDeniedMessage />;
        return <AdminContestsView currentUser={currentUser} />;
      case 'spark':
        if (!AdminService.hasPermission(currentUser.role, 'spark.manage')) return <PermissionDeniedMessage />;
        return <AdminSparkView currentUser={currentUser} />;
      case 'settings':
        if (!AdminService.hasPermission(currentUser.role, 'settings.manage')) return <PermissionDeniedMessage />;
        return <AdminSettingsView currentUser={currentUser} />;
      case 'audit-logs':
      case 'audit':
        if (!AdminService.hasPermission(currentUser.role, 'audit.view')) return <PermissionDeniedMessage />;
        return <AdminAuditLogsView currentUser={currentUser} />;
      case 'analytics':
        if (!AdminService.hasPermission(currentUser.role, 'analytics.view')) return <PermissionDeniedMessage />;
        return <AdminAnalyticsView currentUser={currentUser} />;
      default:
        return <AdminDashboardView currentUser={currentUser} onNavigate={handleSelectSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#07070b] text-white flex flex-col">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0c0c14]/90 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5"
            >
              {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/admin" className="flex items-center gap-2.5 no-underline">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-black shadow-lg shadow-amber-500/20">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-white text-base tracking-tight block leading-tight">
                  CodeSpark
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block">
                  Control Center
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-medium transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Exit to CodeSpark
            </Link>

            <div className="flex items-center gap-2.5 pl-3 sm:border-l border-white/10">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="h-8 w-8 rounded-full object-cover border border-white/10"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-white">@{currentUser.username}</div>
                <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  {currentUser.role}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Shell Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar */}
        <aside
          className={`lg:w-64 shrink-0 ${
            isMobileNavOpen
              ? 'block fixed inset-0 z-50 bg-[#07070b]/95 p-6 backdrop-blur-xl'
              : 'hidden lg:block'
          }`}
        >
          {isMobileNavOpen && (
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <div className="text-sm font-bold text-white uppercase tracking-wider">Admin Navigation</div>
              <button
                onClick={() => setIsMobileNavOpen(false)}
                className="p-2 rounded-xl text-white/60 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14] p-3 shadow-xl space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
              Management Sections
            </div>

            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id || (item.id === 'rules' && activeSection === 'discussions');
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectSection(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-400/10 text-amber-400 font-semibold border border-amber-400/20'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-white/40'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-amber-400" />}
                </button>
              );
            })}
          </div>

          <div className="mt-4 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.01] text-[11px] text-white/40 leading-relaxed">
            <strong className="text-white/70 block mb-0.5">Role Authorization</strong>
            Authenticated as <span className="uppercase text-amber-400 font-semibold">{currentUser.role}</span>. All operations are logged.
          </div>
        </aside>

        {/* Dynamic Main Workspace Area */}
        <main className="flex-1 min-w-0">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

const PermissionDeniedMessage: React.FC = () => (
  <div className="rounded-2xl border border-red-500/20 bg-[#0c0c14] p-8 text-center">
    <ShieldAlert className="mx-auto h-12 w-12 text-red-400 mb-3" />
    <h2 className="text-lg font-bold text-white mb-1">Restricted Privilege</h2>
    <p className="text-xs text-white/60 max-w-sm mx-auto">
      This operational module requires full Administrator permissions. Staff moderators only have access to moderation queues and community rules.
    </p>
  </div>
);
