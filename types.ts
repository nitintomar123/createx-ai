export enum AppMode {
  CHAT = 'CHAT',
  CREATOR = 'CREATOR'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  image?: string; // base64 data uri
  timestamp: number;
}

export enum VideoType {
  SHORT = 'Short/Reel',
  LONG = 'Long Form',
  SONG = 'Music Video'
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '9:16',
  LANDSCAPE = '16:9'
}

export interface CreatorState {
  step: number;
  referenceScripts: string;
  suggestedTopics: string[];
  selectedTopic: string;
  videoType: VideoType;
  aspectRatio: AspectRatio;
  language: string;
  generatedScript: string;
  generatedDescription: string;
  generatedThumbnail: string | null;
  isLoading: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  country?: string;
  role?: string;
  referralSource?: string;
  isOnboarded: boolean;
}

export interface OnboardingData {
  name: string;
  country: string;
  role: string;
  referralSource: string;
}