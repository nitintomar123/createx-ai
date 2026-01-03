import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { ContentCreator } from './components/ContentCreator';
import { AuthPage } from './components/AuthPage';
import { Onboarding } from './components/Onboarding';
import { AppMode, User } from './types';
import { getSession, logout } from './services/authService';

function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.CHAT);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session);
    }
    setIsLoadingSession(false);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  if (isLoadingSession) return null; // Or a splash screen

  // 1. If no user, show Auth Page
  if (!user) {
    return <AuthPage onAuthSuccess={setUser} />;
  }

  // 2. If user exists but not onboarded, show Onboarding overlay over the app (or standalone)
  // We'll overlay it to make the transition smooth, or blocking.
  if (!user.isOnboarded) {
    return (
      <Onboarding 
        user={user} 
        onComplete={(updatedUser) => setUser(updatedUser)} 
      />
    );
  }

  // 3. Main App Layout
  return (
    <div className="flex h-screen bg-black text-gray-200 overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-100">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        currentMode={currentMode} 
        setMode={setCurrentMode}
        isMobileOpen={isMobileMenuOpen}
        closeMobile={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-gray-400 hover:text-white"
            >
              <Menu size={24} />
            </button>
            <span className="font-orbitron font-bold text-white tracking-wider">CreateX.ai</span>
          </div>
        </header>

        <main className="flex-1 p-2 md:p-6 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black">
          {currentMode === AppMode.CHAT ? (
            <ChatInterface />
          ) : (
            <ContentCreator />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;