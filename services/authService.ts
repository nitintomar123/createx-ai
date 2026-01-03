import { User, OnboardingData } from '../types';

// NOTE: In a production app, these functions would make HTTP requests 
// to a Node.js/MySQL backend. We are simulating latency and persistence here.

const STORAGE_KEY = 'createx_user_session';

export const getSession = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const login = async (email: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network

  // Mock: If user exists in local storage, return them, else create a temp session
  // In real MySQL, you would verify password hash here.
  const stored = getSession();
  if (stored && stored.email === email) {
    return stored;
  }

  // If not found, simulated login fails or we just treat it as a new session for demo
  // For this demo, we will allow login to "succeed" but treated as a returning user if we had DB
  const mockUser: User = {
    id: Date.now().toString(),
    email,
    isOnboarded: true // Assume login implies they finished setup previously
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
  return mockUser;
};

export const signup = async (email: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const newUser: User = {
    id: Date.now().toString(),
    email,
    isOnboarded: false // New signup needs onboarding
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  return newUser;
};

export const saveOnboardingData = async (user: User, data: OnboardingData): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const updatedUser: User = {
    ...user,
    ...data,
    isOnboarded: true
  };

  // Update "Database"
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  return updatedUser;
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem(STORAGE_KEY);
};