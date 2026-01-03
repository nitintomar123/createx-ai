import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2, Apple, Globe } from 'lucide-react';
import { Logo } from './Logo';
import { login, signup } from '../services/authService';
import { User } from '../types';

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      // In a real app, we would send password to backend. 
      // Here we just pass email to our mock service.
      const user = isLogin ? await login(email) : await signup(email);
      onAuthSuccess(user);
    } catch (error) {
      console.error("Auth failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black flex flex-col items-center justify-center p-4">
      
      <div className="mb-8 scale-150">
        <Logo />
      </div>

      <div className="w-full max-w-md bg-gray-950 border border-gray-800 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>

        <h2 className="text-2xl font-bold text-white mb-2 font-orbitron text-center">
          {isLogin ? 'Welcome Back' : 'Join the Revolution'}
        </h2>
        <p className="text-gray-500 text-center mb-8 text-sm">
          {isLogin ? 'Enter your credentials to access the neural net.' : 'Create your CreateX ID to start generating.'}
        </p>

        {/* Social Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button className="flex items-center justify-center p-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-500 rounded-xl transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="#FFF"/>
            </svg>
          </button>
          <button className="flex items-center justify-center p-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-500 rounded-xl transition-all">
             <svg className="w-5 h-5" viewBox="0 0 23 23">
                <path fill="#f25022" d="M1 1h10v10H1z"/>
                <path fill="#00a4ef" d="M12 1h10v10H12z"/>
                <path fill="#7fba00" d="M1 12h10v10H1z"/>
                <path fill="#ffb900" d="M12 12h10v10H12z"/>
             </svg>
          </button>
          <button className="flex items-center justify-center p-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-500 rounded-xl transition-all text-white">
            <Apple size={20} fill="white" />
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-gray-950 text-gray-500">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-500" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-3 pl-10 pr-4 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder-gray-600"
                placeholder="name@example.com"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 ml-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-3 px-4 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder-gray-600"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] mt-4 flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};