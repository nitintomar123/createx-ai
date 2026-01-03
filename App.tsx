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

  // If user is not logged in
  if (!user) {
    return <AuthPage onAuthSuccess={setUser} />;
  }

  // If onboarding not complete
  if (!user.isOnboarded) {
    return (
      <Onboarding
        user={user}
        onComplete={(updatedUser) => setUser(updatedUser)}
      />
    );
  }

  // Main app
  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <header className="p-4 border-b border-gray-800 flex justify-between">
        <h1 className="font-bold">CreateX.ai</h1>
        <button onClick={handleLogout} className="text-red-400">
          Logout
        </button>
      </header>

      <main className="flex-1 p-4">
        {currentMode === AppMode.CHAT ? (
          <ChatInterface />
        ) : (
          <ContentCreator />
        )}
      </main>

      <footer className="p-2 border-t border-gray-800 flex gap-2 justify-center">
        <button onClick={() => setCurrentMode(AppMode.CHAT)}>Chat</button>
        <button onClick={() => setCurrentMode(AppMode.CONTENT)}>Content</button>
      </footer>
    </div>
  );
}

export default App;
