import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { BottomNav } from './components/layout/BottomNav.tsx';
import { OpportunityModal } from './components/common/OpportunityModal.tsx';
import { AIAssistantModal } from './components/common/AIAssistantModal.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { StudentDashboard } from './pages/StudentDashboard.tsx';
import { DiscoverPage } from './pages/DiscoverPage.tsx';
import { AISearchPage } from './pages/AISearchPage.tsx';
import { CampusUpdatesPage } from './pages/CampusUpdatesPage.tsx';
import { SavedOpportunitiesPage } from './pages/SavedOpportunitiesPage.tsx';
import { ApplicationTrackingPage } from './pages/ApplicationTrackingPage.tsx';
import { NotificationsPage } from './pages/NotificationsPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { AuthModal } from './pages/AuthModal.tsx';
import { OnboardingModal } from './pages/OnboardingModal.tsx';
import type { Opportunity, Announcement, ApplicationRecord, NotificationItem } from './types/index.ts';
import {
  getOpportunities,
  getAnnouncements,
  getSavedOpportunities,
  toggleSaveOpportunity,
  getApplications,
  updateApplicationRecord,
  getNotifications,
  markNotificationAsRead,
  saveOpportunityAdmin,
  deleteOpportunityAdmin,
  saveAnnouncementAdmin,
  deleteAnnouncementAdmin,
} from './services/firebaseService.ts';

function MainApp() {
  const { userProfile, isLoading, showOnboarding, setShowOnboarding, loginAsDemoStudent } = useAuth();

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Modals state
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Load initial dataset
  const loadData = async () => {
    setIsDataLoading(true);
    try {
      const [opps, anns] = await Promise.all([getOpportunities(), getAnnouncements()]);
      setOpportunities(opps);
      setAnnouncements(anns);

      const userId = userProfile?.id || 'demo-student-alex';
      const [saved, apps, notifs] = await Promise.all([
        getSavedOpportunities(userId),
        getApplications(userId),
        getNotifications(userId),
      ]);
      setSavedIds(saved);
      setApplications(apps);
      setNotifications(notifs);
    } catch (e) {
      console.warn('Initial data load warning:', e);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userProfile?.id]);

  const handleToggleSave = async (oppId: string) => {
    const userId = userProfile?.id || 'demo-student-alex';
    const isNowSaved = await toggleSaveOpportunity(userId, oppId);
    if (isNowSaved) {
      setSavedIds(prev => [...prev, oppId]);
    } else {
      setSavedIds(prev => prev.filter(id => id !== oppId));
    }
  };

  const handleApplyOpportunity = async (opp: Opportunity, status: any = 'Applied') => {
    const userId = userProfile?.id || 'demo-student-alex';
    const newRecord: ApplicationRecord = {
      id: `app-${Date.now()}`,
      userId,
      opportunityId: opp.id,
      status: status || 'Applied',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: `Applied through portal to ${opp.organization}`,
    };
    await updateApplicationRecord(userId, newRecord);
    setApplications(prev => {
      const filtered = prev.filter(a => a.opportunityId !== opp.id);
      return [newRecord, ...filtered];
    });
  };

  const handleUpdateApplication = async (record: ApplicationRecord) => {
    const userId = userProfile?.id || 'demo-student-alex';
    await updateApplicationRecord(userId, record);
    setApplications(prev => {
      const idx = prev.findIndex(a => a.id === record.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = record;
        return copy;
      }
      return [record, ...prev];
    });
  };

  const handleMarkNotificationRead = async (id: string) => {
    const userId = userProfile?.id || 'demo-student-alex';
    await markNotificationAsRead(userId, id);
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllNotificationsRead = async () => {
    const userId = userProfile?.id || 'demo-student-alex';
    for (const notif of notifications) {
      if (!notif.read) {
        await markNotificationAsRead(userId, notif.id);
      }
    }
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Admin Actions
  const handleSaveOpportunityAdmin = async (opp: Opportunity) => {
    await saveOpportunityAdmin(opp);
    await loadData();
  };

  const handleDeleteOpportunityAdmin = async (id: string) => {
    await deleteOpportunityAdmin(id);
    await loadData();
  };

  const handleSaveAnnouncementAdmin = async (ann: Announcement) => {
    await saveAnnouncementAdmin(ann);
    await loadData();
  };

  const handleDeleteAnnouncementAdmin = async (id: string) => {
    await deleteAnnouncementAdmin(id);
    await loadData();
  };

  const appliedIds = applications.map(a => a.opportunityId);
  const unreadCount = notifications.filter(n => !n.read).length;

  if (isLoading && isDataLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold tracking-wider text-slate-300">
          Loading CampusConnect AI Engine...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16 md:pb-0">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onGetStarted={() => {
              loginAsDemoStudent();
              setCurrentTab('dashboard');
            }}
            onExploreDemo={() => {
              loginAsDemoStudent();
              setCurrentTab('dashboard');
            }}
          />
        )}

        {currentTab === 'dashboard' && (
          <StudentDashboard
            student={userProfile}
            opportunities={opportunities}
            announcements={announcements}
            savedIds={savedIds}
            applications={applications}
            onToggleSave={handleToggleSave}
            onViewDetails={setSelectedOpportunity}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'discover' && (
          <DiscoverPage
            student={userProfile}
            opportunities={opportunities}
            savedIds={savedIds}
            appliedIds={appliedIds}
            onToggleSave={handleToggleSave}
            onViewDetails={setSelectedOpportunity}
          />
        )}

        {currentTab === 'ai-search' && (
          <AISearchPage
            student={userProfile}
            opportunities={opportunities}
            savedIds={savedIds}
            appliedIds={appliedIds}
            onToggleSave={handleToggleSave}
            onViewDetails={setSelectedOpportunity}
          />
        )}

        {currentTab === 'campus-updates' && (
          <CampusUpdatesPage announcements={announcements} />
        )}

        {currentTab === 'saved' && (
          <SavedOpportunitiesPage
            student={userProfile}
            opportunities={opportunities}
            savedIds={savedIds}
            appliedIds={appliedIds}
            onToggleSave={handleToggleSave}
            onViewDetails={setSelectedOpportunity}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'applications' && (
          <ApplicationTrackingPage
            opportunities={opportunities}
            applications={applications}
            onUpdateApplication={handleUpdateApplication}
            onViewOpportunity={setSelectedOpportunity}
          />
        )}

        {currentTab === 'notifications' && (
          <NotificationsPage
            notifications={notifications}
            onMarkRead={handleMarkNotificationRead}
            onMarkAllRead={handleMarkAllNotificationsRead}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'profile' && (
          <ProfilePage onOpenOnboarding={() => setShowOnboarding(true)} />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            opportunities={opportunities}
            announcements={announcements}
            applications={applications}
            onSaveOpportunity={handleSaveOpportunityAdmin}
            onDeleteOpportunity={handleDeleteOpportunityAdmin}
            onSaveAnnouncement={handleSaveAnnouncementAdmin}
            onDeleteAnnouncement={handleDeleteAnnouncementAdmin}
          />
        )}
      </main>

      {/* Floating CampusConnect AI Assistant */}
      <AIAssistantModal
        student={userProfile}
        opportunities={opportunities}
        announcements={announcements}
        onOpenOpportunity={setSelectedOpportunity}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        unreadCount={unreadCount}
      />

      {/* Opportunity Details Modal */}
      <OpportunityModal
        opportunity={selectedOpportunity}
        student={userProfile}
        isOpen={Boolean(selectedOpportunity)}
        onClose={() => setSelectedOpportunity(null)}
        isSaved={selectedOpportunity ? savedIds.includes(selectedOpportunity.id) : false}
        onToggleSave={handleToggleSave}
        onApply={handleApplyOpportunity}
        applicationRecord={
          selectedOpportunity
            ? applications.find(a => a.opportunityId === selectedOpportunity.id)
            : undefined
        }
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* 6-Step Student Onboarding Wizard */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
