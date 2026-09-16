import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { SearchModal } from './components/common/SearchModal';
import { AuthModal } from './features/auth/AuthModal';

import { HomePage } from './features/home/HomePage';
import { ContentExplorerPage } from './features/content/ContentExplorerPage';
import { ArticleDetailView } from './features/content/ArticleDetailView';
import { AskGenerousleePage } from './features/ask/AskGenerousleePage';
import { UserDashboard } from './features/dashboard/UserDashboard';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { AboutPage } from './features/pages/AboutPage';
import { CommunityPage } from './features/pages/CommunityPage';
import { AcademyPage } from './features/pages/AcademyPage';
import { MentorshipPage } from './features/pages/MentorshipPage';
import { ResourcesPage } from './features/pages/ResourcesPage';
import { EventsPage } from './features/pages/EventsPage';

const MainAppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParams, setViewParams] = useState<Record<string, any>>({});
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const navigate = (view: string, params: Record<string, any> = {}) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onNavigate={navigate} onOpenAsk={() => navigate('ask')} />;
      case 'explore':
        return <ContentExplorerPage onNavigate={navigate} />;
      case 'category':
        return <ContentExplorerPage initialCategory={viewParams.slug} onNavigate={navigate} />;
      case 'article':
        return <ArticleDetailView slug={viewParams.slug || 'silent-grief-of-matrescence'} onNavigate={navigate} />;
      case 'ask':
        return (
          <AskGenerousleePage
            initialQuestionId={viewParams.questionId}
            initialTab={viewParams.tab || 'public'}
            onNavigate={navigate}
          />
        );
      case 'dashboard':
        return <UserDashboard onNavigate={navigate} />;
      case 'admin':
        return <AdminDashboard onNavigate={navigate} />;
      case 'about':
        return <AboutPage onNavigate={navigate} />;
      case 'community':
        return <CommunityPage onNavigate={navigate} />;
      case 'academy':
        return <AcademyPage onNavigate={navigate} />;
      case 'mentorship':
        return <MentorshipPage onNavigate={navigate} />;
      case 'resources':
        return <ResourcesPage onNavigate={navigate} />;
      case 'events':
        return <EventsPage onNavigate={navigate} />;
      default:
        return <HomePage onNavigate={navigate} onOpenAsk={() => navigate('ask')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#211C15] font-sans selection:bg-[#B95B3D]/20 selection:text-[#B95B3D]">
      {/* Announcement Banner */}
      <AnnouncementBar onAction={() => navigate('ask')} />

      {/* Global Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 pb-16 xl:pb-0">
        {renderView()}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={navigate} />

      {/* Global Search Dialog */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={navigate}
      />

      {/* Auth & Onboarding Modal */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
