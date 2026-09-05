import React, { useState, useEffect } from 'react';
import { UserProfile, Problem } from './types';
import { StorageService } from './services/storage';
import { ALL_PROBLEMS } from './data/problems';

// Components
import { Navbar } from './components/common/Navbar';
import { MobileNav } from './components/common/MobileNav';
import { Footer } from './components/common/Footer';
import { CommandPalette } from './components/search/CommandPalette';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingWizard } from './components/auth/OnboardingWizard';
import { LandingHero } from './components/landing/LandingHero';
import { LandingSections } from './components/landing/LandingSections';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { ProblemLibrary } from './components/problems/ProblemLibrary';
import { ProblemWorkspace } from './components/workspace/ProblemWorkspace';
import { RoadmapView } from './components/roadmaps/RoadmapView';
import { PatternsView } from './components/patterns/PatternsView';
import { SubmissionsView } from './components/submissions/SubmissionsView';
import { UserProfileView } from './components/profile/UserProfileView';
import { DiscussionsView } from './components/discussions/DiscussionsView';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';
import { ContestsView } from './components/contests/ContestsView';
import { SettingsView } from './components/settings/SettingsView';
import { AdminView } from './components/admin/AdminView';

export function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [activeProblemId, setActiveProblemId] = useState<string>('p-1');
  const [activeProfileUserId, setActiveProfileUserId] = useState<string>('user-current');
  const [activePatternId, setActivePatternId] = useState<string>('two-pointers');
  const [problemFilterCategory, setProblemFilterCategory] = useState<string>('all');

  const [currentUser, setCurrentUser] = useState<UserProfile>(StorageService.getCurrentUser());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(StorageService.isAuthenticated());
  const [notifications, setNotifications] = useState(StorageService.getNotifications());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('login');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, activeProblemId]);

  // Global navigation handler
  const handleNavigate = (view: string, param?: string) => {
    if (view === 'workspace') {
      if (param) setActiveProblemId(param);
      setCurrentView('workspace');
    } else if (view === 'profile') {
      if (param) setActiveProfileUserId(param);
      else setActiveProfileUserId(currentUser.id);
      setCurrentView('profile');
    } else if (view === 'patterns') {
      if (param) setActivePatternId(param);
      setCurrentView('patterns');
    } else if (view === 'problems') {
      if (param) setProblemFilterCategory(param);
      else setProblemFilterCategory('all');
      setCurrentView('problems');
    } else {
      setCurrentView(view);
    }
  };

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthInitialMode(mode);
    setIsAuthOpen(true);
  };

  const handleLogout = () => {
    StorageService.logout();
    setIsLoggedIn(false);
    setNotifications([
      {
        id: 'logout-' + Date.now(),
        title: 'Logged Out',
        message: 'You have safely signed out. Your solved problems and progress remain saved.',
        type: 'badge',
        read: false,
        timestamp: 'Just now'
      },
      ...notifications
    ]);
  };

  const handleSolveProblem = (problemId: string, xpReward: number) => {
    const updated = StorageService.recordProblemSolve(problemId, xpReward);
    setCurrentUser({ ...updated });
  };

  const handleToggleSaveProblem = (problemId: string) => {
    StorageService.toggleSaveProblem(problemId);
    setCurrentUser(StorageService.getCurrentUser());
  };

  const handleMarkNotificationsRead = () => {
    const notifs = StorageService.markAllNotificationsRead();
    setNotifications(notifs);
  };

  const handleAuthSuccess = (partialUser: Partial<UserProfile>) => {
    const updated = {
      ...currentUser,
      ...partialUser
    };
    StorageService.saveCurrentUser(updated);
    StorageService.setAuthenticated(true);
    setCurrentUser(updated);
    setIsLoggedIn(true);
    setIsAuthOpen(false);
    if (currentView === 'signin' || currentView === 'signup') {
      setCurrentView('dashboard');
    }
  };

  const handleOnboardingComplete = (updated: Partial<UserProfile>) => {
    const complete = {
      ...currentUser,
      ...updated
    };
    StorageService.saveCurrentUser(complete);
    setCurrentUser(complete);
    setIsOnboardingOpen(false);
    setCurrentView('dashboard');
  };

  const activeProblem = ALL_PROBLEMS.find(p => p.id === activeProblemId) || ALL_PROBLEMS[0];

  return (
    <div className="min-h-screen bg-[#09090c] text-[#ededf0] flex flex-col selection:bg-amber-500/20 selection:text-amber-200">
      
      {/* Global Navigation Bar */}
      {currentView !== 'signin' && currentView !== 'signup' && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          currentUser={currentUser}
          notifications={notifications}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAuth={handleOpenAuth}
          onMarkNotificationsRead={handleMarkNotificationsRead}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {currentView === 'landing' && (
          <>
            <LandingHero
              onStartCoding={() => handleNavigate('problems')}
              onExploreRoadmap={() => handleNavigate('roadmaps')}
            />
            <LandingSections
              onStartCoding={() => handleNavigate('problems')}
              onExploreRoadmap={() => handleNavigate('roadmaps')}
              onSelectPattern={(patternId) => handleNavigate('patterns', patternId)}
            />
          </>
        )}

        {currentView === 'dashboard' && (
          <UserDashboard
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'problems' && (
          <ProblemLibrary
            currentUser={currentUser}
            initialFilter={problemFilterCategory}
            onNavigate={handleNavigate}
            onToggleSave={handleToggleSaveProblem}
          />
        )}

        {currentView === 'workspace' && (
          <ProblemWorkspace
            problem={activeProblem}
            currentUser={currentUser}
            onSolveProblem={handleSolveProblem}
            onToggleSave={handleToggleSaveProblem}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'roadmaps' && (
          <RoadmapView
            currentUser={currentUser}
            onNavigateProblem={(id) => handleNavigate('workspace', id)}
          />
        )}

        {currentView === 'patterns' && (
          <PatternsView
            currentUser={currentUser}
            initialPatternId={activePatternId}
            onNavigateProblem={(id) => handleNavigate('workspace', id)}
          />
        )}

        {currentView === 'submissions' && (
          <SubmissionsView />
        )}

        {currentView === 'profile' && (
          <UserProfileView
            userId={activeProfileUserId}
            currentUser={currentUser}
            onUpdateCurrentUser={(u) => setCurrentUser(u)}
            onNavigateProblem={(id) => handleNavigate('workspace', id)}
          />
        )}

        {currentView === 'discuss' && (
          <DiscussionsView
            currentUser={currentUser}
            onNavigateProfile={(uid) => handleNavigate('profile', uid)}
          />
        )}

        {currentView === 'leaderboard' && (
          <LeaderboardView
            currentUser={currentUser}
            onNavigateProfile={(uid) => handleNavigate('profile', uid)}
          />
        )}

        {currentView === 'contests' && (
          <ContestsView
            onNavigateProblem={(id) => handleNavigate('workspace', id)}
          />
        )}

        {currentView === 'settings' && (
          <SettingsView
            currentUser={currentUser}
            onUpdateCurrentUser={(u) => setCurrentUser(u)}
          />
        )}

        {currentView === 'admin' && (
          <AdminView
            onNavigateProblem={(id) => handleNavigate('workspace', id)}
          />
        )}

        {(currentView === 'signin' || currentView === 'signup') && (
          <AuthModal
            isOpen={true}
            isFullScreen={true}
            initialMode={currentView === 'signup' ? 'signup' : 'login'}
            onClose={() => handleNavigate('landing')}
            onNavigateHome={() => handleNavigate('landing')}
            onSuccess={handleAuthSuccess}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
          />
        )}
      </main>

      {/* Global Footer (hidden only inside workspace to maximize editor viewport) */}
      {currentView !== 'workspace' && currentView !== 'signin' && currentView !== 'signup' && (
        <Footer onNavigate={handleNavigate} />
      )}

      {/* Mobile Bottom Navigation Bar */}
      {currentView !== 'signin' && currentView !== 'signup' && (
        <MobileNav
          currentView={currentView}
          onNavigate={handleNavigate}
        />
      )}

      {/* Global Command Palette Search Modal */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        initialMode={authInitialMode}
      />

      {/* Onboarding Wizard Modal */}
      <OnboardingWizard
        isOpen={isOnboardingOpen}
        currentUser={currentUser}
        onComplete={handleOnboardingComplete}
      />

    </div>
  );
}

export default App;
