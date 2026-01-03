import React, { useState } from 'react';
import { User, OnboardingData } from '../types';
import { saveOnboardingData } from '../services/authService';
import { Loader2, Globe, Briefcase, Info, Check } from 'lucide-react';

interface OnboardingProps {
  user: User;
  onComplete: (updatedUser: User) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ user, onComplete }) => {
  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    country: '',
    role: '',
    referralSource: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await saveOnboardingData(user, formData);
      onComplete(updatedUser);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-950 border border-gray-800 rounded-2xl p-8 relative shadow-2xl overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.2)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white font-orbitron mb-2">Setup Profile</h2>
            <p className="text-gray-400">Complete your CreateX identity to calibrate the AI model.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Globe size={12} /> Country
                </label>
                <select
                  required
                  value={formData.country}
                  onChange={e => setFormData({...formData, country: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:border-purple-500 outline-none appearance-none"
                >
                  <option value="">Select...</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="IN">India</option>
                  <option value="DE">Germany</option>
                  <option value="JP">Japan</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Briefcase size={12} /> Role
                </label>
                <select
                  required
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:border-purple-500 outline-none appearance-none"
                >
                  <option value="">Select...</option>
                  <option value="Creator">Content Creator</option>
                  <option value="Marketer">Digital Marketer</option>
                  <option value="Agency">Agency Owner</option>
                  <option value="Student">Student</option>
                  <option value="Developer">Developer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Info size={12} /> Where did you hear about us?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Social Media', 'Friend/Colleague', 'Search Engine', 'Advertisement'].map((source) => (
                  <button
                    key={source}
                    type="button"
                    onClick={() => setFormData({...formData, referralSource: source})}
                    className={`
                      p-3 rounded-lg text-sm border text-left transition-all flex items-center justify-between group
                      ${formData.referralSource === source 
                        ? 'bg-purple-900/30 border-purple-500 text-white' 
                        : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600'}
                    `}
                  >
                    {source}
                    {formData.referralSource === source && <Check size={14} className="text-purple-400" />}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.name || !formData.country || !formData.role || !formData.referralSource}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Complete Setup"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};