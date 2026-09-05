import React, { useState, useEffect } from 'react';
import { UserProfile, NotificationItem } from './types';
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
import { SavedProblemsView } from './components/problems/SavedProblemsView';
import { FirstLessonModal } from './components/lesson/FirstLessonModal';
import { SkillAssessmentModal } from './components/assessment/SkillAssessmentModal';

export function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => StorageService.getCurrentUser());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => StorageService.isAuthenticated());
  const [currentView, setCurrentView] = useState<string>(() => {
    const user = StorageService.getCurrentUser();
    if (user && user.onboarding_completed) return 'dashboard';
    if (user && !user.onboarding_completed) return 'dashboard'; // will trigger onboarding modal
    return 'landing';
  });

  const [activeProblemId, setActiveProblemId] = useState<string>('p-1');
  const [activeProfileUserId, setActiveProfileUserId] = useState<string>('');
  const [activePatternId, setActivePatternId] = useState<string>('two-pointers');
  const [activeDiscussionId, setActiveDiscussionId] = useState<string | undefined>();
  const [problemFilterCategory, setProblemFilterCategory] = useState<string>('all');

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const user = StorageService.getCurrentUser();
    return user ? StorageService.getNotifications(user.id) : [];
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    const user = StorageService.getCurrentUser();
    return !!(user && !user.onboarding_completed);
  });
  const [isFirstLessonOpen, setIsFirstLessonOpen] = useState(false);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, activeProblemId]);

  useEffect(() => {
    if (currentUser) {
      setNotifications(StorageService.getNotifications(currentUser.id));
    } else {
      setNotifications([]);
    }
  }, [currentUser?.id]);

  // Section 12: Protected Routes list (Discussions allows public reading)
  const protectedViews = [
    'dashboard', 'problems', 'workspace', 'roadmaps', 
    'patterns', 'profile', 'settings', 'submissions', 
    'contests', 'leaderboard', 'admin',
    'saved', 'saved-problems'
  ];

  // Route protection watcher
  useEffect(() => {
    if (!isLoggedIn && protectedViews.includes(currentView)) {
      setCurrentView('landing');
      handleOpenAuth('login');
    }
  }, [isLoggedIn, currentView]);

  // Sync URL popstate for discussions
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/discussions')) {
        const parts = pathname.split('/').filter(Boolean);
        if (parts.length > 1) {
          setActiveDiscussionId(parts[1]);
        } else {
          setActiveDiscussionId(undefined);
        }
        setCurrentView('discuss');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global navigation handler
  const handleNavigate = (view: string, param?: string) => {
    // Section 12: Redirect unauthenticated users to login
    if (protectedViews.includes(view) && !isLoggedIn) {
      handleOpenAuth('login');
      return;
    }

    if (view === 'workspace') {
      if (param) setActiveProblemId(param);
      setCurrentView('workspace');
    } else if (view === 'profile') {
      if (param) setActiveProfileUserId(param);
      else if (currentUser) setActiveProfileUserId(currentUser.id);
      setCurrentView('profile');
    } else if (view === 'patterns') {
      if (param) setActivePatternId(param);
      setCurrentView('patterns');
    } else if (view === 'problems') {
      if (param === 'saved') {
        setCurrentView('saved-problems');
      } else {
        if (param) setProblemFilterCategory(param);
        else setProblemFilterCategory('all');
        setCurrentView('problems');
      }
    } else if (view === 'saved' || view === 'saved-problems') {
      setCurrentView('saved-problems');
    } else if (view === 'discuss') {
      if (param) {
        setActiveDiscussionId(param);
        try { window.history.pushState(null, '', `/discussions/${param}`); } catch {}
      } else {
        setActiveDiscussionId(undefined);
        try { window.history.pushState(null, '', '/discussions'); } catch {}
      }
      setCurrentView('discuss');
    } else {
      setCurrentView(view);
    }
  };

  const handleOpenAuth = (mode: 'login' | 'signup' | 'forgot' = 'login') => {
    setAuthInitialMode(mode);
    setIsAuthOpen(true);
  };

  // Section 11: Clean logout flow
  const handleLogout = () => {
    StorageService.logout();
    setCurrentUser(null);
    setIsLoggedIn(false);
    setIsOnboardingOpen(false);
    setCurrentView('landing');
    setNotifications([]);
  };

  const handleSolveProblem = (problemId: string, xpReward: number) => {
    const updated = StorageService.recordProblemSolve(problemId, xpReward);
    if (updated) {
      setCurrentUser({ ...updated });
      setNotifications(StorageService.getNotifications(updated.id));
    }
  };

  const handleToggleSaveProblem = (problemId: string) => {
    StorageService.toggleSaveProblem(problemId);
    const user = StorageService.getCurrentUser();
    if (user) setCurrentUser(user);
  };

  const handleMarkNotificationsRead = () => {
    const notifs = StorageService.markAllNotificationsRead(currentUser?.id);
    setNotifications(notifs);
  };

  // Sections 8 & 9: Auth success handling with onboarding routing
  const handleAuthSuccess = (user: UserProfile, isNewUser: boolean) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setIsAuthOpen(false);
    setNotifications(StorageService.getNotifications(user.id));

    // If new user or onboarding not completed, route to onboarding wizard
    if (isNewUser || !user.onboarding_completed) {
      setIsOnboardingOpen(true);
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleOnboardingComplete = (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const complete: UserProfile = {
      ...currentUser,
      ...updated,
      onboarding_completed: true
    };
    StorageService.saveCurrentUser(complete);
    setCurrentUser(complete);
    setIsOnboardingOpen(false);
    setCurrentView('dashboard');
  };

  const handleStartFirstLesson = () => {
    setIsFirstLessonOpen(true);
  };

  const handleCompleteFirstLesson = (problemId: string) => {
    setIsFirstLessonOpen(false);
    const updated = StorageService.completeFirstLesson();
    if (updated) {
      setCurrentUser(updated);
      handleNavigate('workspace', problemId);
    }
  };

  const handleApplyAssessmentRecommendation = (recommendedTopic: string, scores: Record<string, number>) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      recommendedStartingTopic: recommendedTopic,
      skillAssessmentScores: scores
    };
    StorageService.saveCurrentUser(updated);
    setCurrentUser(updated);
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
              onStartCoding={() => {
                if (isLoggedIn) handleNavigate('problems');
                else handleOpenAuth('signup');
              }}
              onExploreRoadmap={() => {
                if (isLoggedIn) handleNavigate('roadmaps');
                else handleOpenAuth('signup');
              }}
            />
            <LandingSections
              currentUser={currentUser}
              onStartCoding={() => {
                if (isLoggedIn) handleNavigate('problems');
                else handleOpenAuth('signup');
              }}
              onExploreRoadmap={() => {
                if (isLoggedIn) handleNavigate('roadmaps');
                else handleOpenAuth('signup');
              }}
              onSelectPattern={(patternId) => {
                if (isLoggedIn) handleNavigate('patterns', patternId);
                else handleOpenAuth('signup');
              }}
            />
          </>
        )}

        {currentView === 'dashboard' && currentUser && (
          <UserDashboard
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onStartFirstLesson={handleStartFirstLesson}
            onOpenAssessment={() => setIsAssessmentOpen(true)}
          />
        )}

        {currentView === 'problems' && currentUser && (
          <ProblemLibrary
            currentUser={currentUser}
            initialFilter={problemFilterCategory}
            onNavigate={handleNavigate}
            onToggleSave={handleToggleSaveProblem}
          />
        )}

        {currentView === 'saved-problems' && currentUser && (
          <SavedProblemsView
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onToggleSave={handleToggleSaveProblem}
          />
        )}

        {currentView === 'workspace' && currentUser && (
          <ProblemWorkspace
            problem={activeProblem}
            currentUser={currentUser}
            onSolveProblem={handleSolveProblem}
            onToggleSave={handleToggleSaveProblem}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'roadmaps' && currentUser && (
          <RoadmapView
            currentUser={currentUser}
            onNavigateProblem={(id) => handleNavigate('workspace', id)}
            onNavigatePattern={(id) => handleNavigate('patterns', id)}
          />
        )}

        {currentView === 'patterns' && currentUser && (
          <PatternsView
            currentUser={currentUser}
            initialPatternId={activePatternId}
            onNavigateProblem={(id) => handleNavigate('workspace', id)}
          />
        )}

        {currentView === 'submissions' && currentUser && (
          <SubmissionsView />
        )}

        {currentView === 'profile' && currentUser && (
          <UserProfileView
            userId={activeProfileUserId || currentUser.id}
            currentUser={currentUser}
            onUpdateCurrentUser={(u) => setCurrentUser(u)}
            onNavigateProblem={(id) => handleNavigate('workspace', id)}
          />
        )}

        {currentView === 'discuss' && (
          <DiscussionsView
            currentUser={currentUser}
            initialDiscussionId={activeDiscussionId}
            onNavigateProfile={(uid) => handleNavigate('profile', uid)}
            onNavigateProblem={(id) => handleNavigate('workspace', id)}
            onRequireAuth={() => handleOpenAuth('login')}
          />
        )}

        {currentView === 'leaderboard' && currentUser && (
          <LeaderboardView
            currentUser={currentUser}
            onNavigateProfile={(uid) => handleNavigate('profile', uid)}
          />
        )}

        {currentView === 'contests' && currentUser && (
          <ContestsView
            onNavigateProblem={(id) => handleNavigate('workspace', id)}
          />
        )}

        {currentView === 'settings' && currentUser && (
          <SettingsView
            currentUser={currentUser}
            onUpdateCurrentUser={(u) => setCurrentUser(u)}
          />
        )}

        {currentView === 'admin' && currentUser && (
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
          />
        )}
      </main>

      {/* Global Footer (hidden on auth pages and active coding workspace) */}
      {currentView !== 'workspace' && currentView !== 'signin' && currentView !== 'signup' && (
        <Footer onNavigate={handleNavigate} />
      )}

      {/* Mobile Bottom Navigation Bar */}
      {currentView !== 'signin' && currentView !== 'signup' && isLoggedIn && (
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

      {/* Auth Modal (Overlay dialog) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authInitialMode}
      />

      {/* Onboarding Wizard Modal */}
      {currentUser && (
        <OnboardingWizard
          isOpen={isOnboardingOpen}
          currentUser={currentUser}
          onComplete={handleOnboardingComplete}
          onOpenAssessment={() => setIsAssessmentOpen(true)}
        />
      )}

      {/* Interactive First Lesson Modal (Section 10) */}
      {currentUser && (
        <FirstLessonModal
          isOpen={isFirstLessonOpen}
          currentUser={currentUser}
          onClose={() => setIsFirstLessonOpen(false)}
          onStartProblem={handleCompleteFirstLesson}
        />
      )}

      {/* Diagnostic Skill Assessment Modal (Section 24) */}
      {currentUser && (
        <SkillAssessmentModal
          isOpen={isAssessmentOpen}
          currentUser={currentUser}
          onClose={() => setIsAssessmentOpen(false)}
          onApplyRecommendation={handleApplyAssessmentRecommendation}
        />
      )}

    </div>
  );
}

export default App;
