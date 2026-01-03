import React, { useState, useEffect } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { ContentCreator } from './components/ContentCreator';
import { AuthPage } from './components/AuthPage';
import { Onboarding } from './components/Onboarding';
import { AppMode, User } from './types';
import { getSession, logout } from './services/authService';

function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.CHAT);
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

  if (isLoadingSession) return null;

  // If not logged in
  if (!user) {
    return <AuthPage onAuthSuccess={setUser} />;
  }

  // If not onboarded
  if (!user.isOnboarded) {
    return (
      <Onboarding
        user={user}
        onComplete={(updatedUser) => setUser(updatedUser)}
      />
    );
  }

  // Main App
  return (
    <div className="h-screen bg-black text-gray-200 flex flex-col">
      
      {/* Top Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950">
        <span className="font-bold text-white">CreateX.ai</span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMode(AppMode.CHAT)}
            className="px-3 py-1 bg-gray-800 rounded"
          >
            Chat
          </button>
          <button
            onClick={() => setCurrentMode(AppMode.CONTENT)}
            className="px-3 py-1 bg-gray-800 rounded"
          >
            Create
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-600 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-hidden">
        {currentMode === AppMode.CHAT ? (
          <ChatInterface />
        ) : (
          <ContentCreator />
        )}
      </main>
    </div>
  );
}

export default App;
