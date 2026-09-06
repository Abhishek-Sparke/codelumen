import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, NotificationItem } from './types';
import { StorageService } from './services/storage';
import { ProblemDatabase } from './services/problemDatabase';
import { ForumService } from './services/forumService';
import { useCurrentRoute, navigate, getCanonicalPath, parseRoute } from './router/router';

// Components
import { Navbar } from './components/common/Navbar';
import { MobileNav } from './components/common/MobileNav';
import { Footer } from './components/common/Footer';
import { NotFoundView } from './components/common/NotFoundView';
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
  const currentRoute = useCurrentRoute();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => StorageService.getCurrentUser());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => StorageService.isAuthenticated());
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);

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

  // Active Problem resolution
  const activeProblem = useMemo(() => {
    if (currentRoute.section === 'workspace' && currentRoute.slug) {
      return ProblemDatabase.getProblemBySlug(currentRoute.slug) || null;
    }
    return null;
  }, [currentRoute.section, currentRoute.slug]);

  // Active Profile User resolution
  const activeProfileUser = useMemo(() => {
    if (currentRoute.section === 'profile') {
      if (currentRoute.slug) {
        return StorageService.getUserByUsernameOrId(currentRoute.slug);
      }
      return currentUser;
    }
    return null;
  }, [currentRoute.section, currentRoute.slug, currentUser]);

  // Derive current effective view
  const currentView = useMemo(() => {
    if (currentRoute.isNotFound) return 'not-found';
    if (currentRoute.section === 'landing') {
      return isLoggedIn && currentUser ? 'dashboard' : 'landing';
    }
    if (currentRoute.section === 'workspace') {
      return activeProblem ? 'workspace' : 'problem-not-found';
    }
    if (currentRoute.section === 'profile') {
      if (currentRoute.slug && !activeProfileUser) return 'profile-not-found';
      return 'profile';
    }
    return currentRoute.section;
  }, [currentRoute, isLoggedIn, currentUser, activeProblem, activeProfileUser]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentRoute.pathname]);

  // Notifications sync
  useEffect(() => {
    if (currentUser) {
      setNotifications(StorageService.getNotifications(currentUser.id));
    } else {
      setNotifications([]);
    }
  }, [currentUser?.id]);

  // Dynamic SEO & page title
  useEffect(() => {
    if (currentRoute.section === 'workspace' && activeProblem) {
      document.title = `${activeProblem.title} | CodeSpark`;
    } else if (currentRoute.section === 'discuss') {
      if (currentRoute.subType === 'rules') {
        document.title = `Discussion Rules | CodeSpark`;
      } else if (currentRoute.subType === 'category' && currentRoute.categorySlug) {
        const cat = ForumService.getCategoryByIdOrSlug(currentRoute.categorySlug);
        document.title = `${cat ? cat.name : 'Category'} Discussions | CodeSpark`;
      } else if (currentRoute.slug) {
        const thread = ForumService.getThreadByIdOrSlug(currentRoute.slug);
        document.title = `${thread ? thread.title : 'Discussion'} | CodeSpark`;
      } else {
        document.title = `Discussions | CodeSpark`;
      }
    } else if (currentRoute.section === 'problems') {
      document.title = `Problem Library | CodeSpark`;
    } else if (currentRoute.section === 'saved-problems') {
      document.title = `Saved Problems | CodeSpark`;
    } else if (currentRoute.section === 'roadmaps') {
      document.title = `Roadmaps & Curriculum | CodeSpark`;
    } else if (currentRoute.section === 'patterns') {
      document.title = `DSA Patterns Catalog | CodeSpark`;
    } else if (currentRoute.section === 'contests') {
      document.title = `Contests & Timed Arena | CodeSpark`;
    } else if (currentRoute.section === 'profile') {
      const targetUser = activeProfileUser || currentUser;
      document.title = targetUser ? `${targetUser.name} (@${targetUser.username}) | CodeSpark` : `User Profile | CodeSpark`;
    } else if (currentRoute.section === 'dashboard') {
      document.title = `Dashboard | CodeSpark`;
    } else if (currentRoute.section === 'leaderboard') {
      document.title = `Global Leaderboard | CodeSpark`;
    } else if (currentRoute.section === 'submissions') {
      document.title = `Submissions History | CodeSpark`;
    } else if (currentRoute.section === 'settings') {
      document.title = `Settings | CodeSpark`;
    } else if (currentRoute.section === 'admin') {
      const sectionName = currentRoute.adminSection
        ? currentRoute.adminSection.charAt(0).toUpperCase() + currentRoute.adminSection.slice(1).replace('-', ' ')
        : 'Control Center';
      document.title = `${sectionName} | CodeSpark Admin`;
    } else if (currentRoute.isNotFound || currentView === 'problem-not-found' || currentView === 'profile-not-found') {
      document.title = `Not Found | CodeSpark`;
    } else {
      document.title = `CodeSpark — Master Coding. One Spark at a Time.`;
    }
  }, [currentRoute, activeProblem, activeProfileUser, currentUser, currentView]);

  // Protected Views
  const protectedViews = [
    'dashboard', 'workspace', 'roadmaps', 
    'patterns', 'settings', 'submissions', 
    'contests', 'leaderboard', 'admin',
    'saved', 'saved-problems'
  ];

  // Route protection watcher with return-to memory
  useEffect(() => {
    if (!isLoggedIn && protectedViews.includes(currentRoute.section)) {
      setRedirectAfterLogin(currentRoute.pathname);
      handleOpenAuth('login', currentRoute.pathname);
    }
  }, [isLoggedIn, currentRoute.section, currentRoute.pathname]);

  // Global navigation handler
  const handleNavigate = (viewOrPath: string, param?: string) => {
    const targetPath = getCanonicalPath(viewOrPath, param);
    const targetRoute = parseRoute(targetPath);

    if (protectedViews.includes(targetRoute.section) && !isLoggedIn) {
      setRedirectAfterLogin(targetPath);
      handleOpenAuth('login', targetPath);
      return;
    }

    if (viewOrPath === 'problems' && param && param !== 'saved') {
      setProblemFilterCategory(param);
    }

    navigate(targetPath);
  };

  const handleOpenAuth = (mode: 'login' | 'signup' | 'forgot' = 'login', returnTo?: string) => {
    if (returnTo) setRedirectAfterLogin(returnTo);
    setAuthInitialMode(mode);
    setIsAuthOpen(true);
  };

  // Clean logout flow
  const handleLogout = () => {
    StorageService.logout();
    setCurrentUser(null);
    setIsLoggedIn(false);
    setIsOnboardingOpen(false);
    navigate('/');
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

  const handleAuthSuccess = (user: UserProfile, isNewUser: boolean) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setIsAuthOpen(false);
    setNotifications(StorageService.getNotifications(user.id));

    if (redirectAfterLogin) {
      const dest = redirectAfterLogin;
      setRedirectAfterLogin(null);
      navigate(dest);
    } else if (isNewUser || !user.onboarding_completed) {
      setIsOnboardingOpen(true);
      navigate('/dashboard');
    } else {
      navigate('/dashboard');
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
    navigate('/dashboard');
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
        {currentView === 'not-found' && (
          <NotFoundView type="page" identifier={currentRoute.pathname} />
        )}

        {currentView === 'problem-not-found' && (
          <NotFoundView type="problem" identifier={currentRoute.slug} />
        )}

        {currentView === 'profile-not-found' && (
          <NotFoundView type="profile" identifier={currentRoute.slug} />
        )}

        {currentView === 'landing' && (
          <>
            <LandingHero
              onStartCoding={() => {
                if (isLoggedIn) handleNavigate('problems');
                else handleOpenAuth('signup', '/problems');
              }}
              onExploreRoadmap={() => {
                if (isLoggedIn) handleNavigate('roadmaps');
                else handleOpenAuth('signup', '/roadmap');
              }}
            />
            <LandingSections
              currentUser={currentUser}
              onStartCoding={() => {
                if (isLoggedIn) handleNavigate('problems');
                else handleOpenAuth('signup', '/problems');
              }}
              onExploreRoadmap={() => {
                if (isLoggedIn) handleNavigate('roadmaps');
                else handleOpenAuth('signup', '/roadmap');
              }}
              onSelectPattern={(patternId) => {
                if (isLoggedIn) handleNavigate('patterns', patternId);
                else handleOpenAuth('signup', `/patterns/${patternId}`);
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

        {currentView === 'problems' && (
          <ProblemLibrary
            currentUser={currentUser || { ...StorageService.getAllUsers()[0], id: 'guest', solvedProblemIds: [], savedProblemIds: [] }}
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

        {currentView === 'workspace' && activeProblem && (
          <ProblemWorkspace
            problem={activeProblem}
            currentUser={currentUser || { ...StorageService.getAllUsers()[0], id: 'guest', solvedProblemIds: [], savedProblemIds: [] }}
            onSolveProblem={handleSolveProblem}
            onToggleSave={handleToggleSaveProblem}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'roadmaps' && (
          <RoadmapView
            currentUser={currentUser || { ...StorageService.getAllUsers()[0], id: 'guest', solvedProblemIds: [], savedProblemIds: [] }}
            onNavigateProblem={(id) => handleNavigate('workspace', id)}
            onNavigatePattern={(id) => handleNavigate('patterns', id)}
          />
        )}

        {currentView === 'patterns' && (
          <PatternsView
            currentUser={currentUser || { ...StorageService.getAllUsers()[0], id: 'guest', solvedProblemIds: [], savedProblemIds: [] }}
            initialPatternId={currentRoute.slug}
            onNavigateProblem={(id) => handleNavigate('workspace', id)}
          />
        )}

        {currentView === 'submissions' && currentUser && (
          <SubmissionsView />
        )}

        {currentView === 'profile' && activeProfileUser && (
          <UserProfileView
            userId={activeProfileUser.id}
            currentUser={currentUser || activeProfileUser}
            onUpdateCurrentUser={(u) => setCurrentUser(u)}
            onNavigateProblem={(id) => handleNavigate('workspace', id)}
          />
        )}

        {currentView === 'discuss' && (
          <DiscussionsView
            currentUser={currentUser}
            initialDiscussionId={currentRoute.subType === 'rules' ? 'rules' : (currentRoute.subType === 'thread' ? currentRoute.slug : undefined)}
            initialCategorySlug={currentRoute.subType === 'category' ? currentRoute.categorySlug : undefined}
            onNavigateProfile={(uid) => handleNavigate('profile', uid)}
            onNavigateProblem={(id) => handleNavigate('workspace', id)}
            onRequireAuth={() => handleOpenAuth('login')}
            onNavigateDiscussion={(slug) => handleNavigate('discuss', slug)}
          />
        )}

        {currentView === 'leaderboard' && (
          <LeaderboardView
            currentUser={currentUser || { ...StorageService.getAllUsers()[0], id: 'guest', solvedProblemIds: [], savedProblemIds: [] }}
            onNavigateProfile={(uid) => handleNavigate('profile', uid)}
          />
        )}

        {currentView === 'contests' && (
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

        {currentView === 'admin' && (
          <AdminView
            currentUser={currentUser}
            activeSection={currentRoute.adminSection || 'dashboard'}
            onNavigateProblem={(id) => handleNavigate('workspace', id)}
            onNavigateSection={(sec) => {
              navigate(sec === 'dashboard' ? '/admin' : (sec === 'rules' ? '/admin/discussions/rules' : `/admin/${sec}`));
            }}
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
