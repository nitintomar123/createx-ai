import React, { useState } from 'react';
import { Wand2, Film, CheckCircle2, ChevronRight, FileText, Loader2, Play, Mic2, Monitor, Download } from 'lucide-react';
import { CreatorState, VideoType, AspectRatio } from '../types';
import { analyzeScriptsAndSuggestTopics, generateFullScriptAndDescription, generateThumbnail } from '../services/geminiService';

export const ContentCreator: React.FC = () => {
  const [state, setState] = useState<CreatorState>({
    step: 1,
    referenceScripts: '',
    suggestedTopics: [],
    selectedTopic: '',
    videoType: VideoType.SHORT,
    aspectRatio: AspectRatio.PORTRAIT,
    language: 'English',
    generatedScript: '',
    generatedDescription: '',
    generatedThumbnail: null,
    isLoading: false
  });

  // STEP 1: Analyze Scripts
  const handleAnalyze = async () => {
    if (!state.referenceScripts.trim()) return;
    
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const topics = await analyzeScriptsAndSuggestTopics(state.referenceScripts);
      setState(prev => ({ ...prev, suggestedTopics: topics, step: 2, isLoading: false }));
    } catch (e) {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // STEP 2: Select Topic & Config
  const handleGenerateScript = async () => {
    if (!state.selectedTopic) return;
    
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const result = await generateFullScriptAndDescription(state.selectedTopic, state.videoType, state.language);
      setState(prev => ({
        ...prev,
        generatedScript: result.script,
        generatedDescription: result.description,
        step: 3,
        isLoading: false
      }));

      // Automatically trigger thumbnail gen after script
      handleGenerateThumbnail(result.thumbnailPrompt);

    } catch (e) {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // STEP 3: Thumbnail Gen (Internal Helper)
  const handleGenerateThumbnail = async (prompt: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const image = await generateThumbnail(prompt, state.aspectRatio);
      setState(prev => ({ ...prev, generatedThumbnail: image, step: 4, isLoading: false }));
    } catch (e) {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 overflow-hidden relative">
      {/* Step Indicator */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-gray-800 bg-gray-950/50">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center gap-2">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all
              ${state.step >= step 
                ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]' 
                : 'bg-gray-800 text-gray-500 border border-gray-700'}
            `}>
              {step < state.step ? <CheckCircle2 size={16} /> : step}
            </div>
            <span className={`text-xs font-medium uppercase hidden md:block ${state.step >= step ? 'text-cyan-400' : 'text-gray-600'}`}>
              {step === 1 && "Training"}
              {step === 2 && "Configuration"}
              {step === 3 && "Generation"}
              {step === 4 && "Finalize"}
            </span>
            {step < 4 && <div className="w-8 h-px bg-gray-800 mx-2 hidden md:block" />}
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        
        {/* STEP 1: INPUT */}
        {state.step === 1 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-bold text-white font-orbitron">Train Your Model</h2>
              <p className="text-gray-400">Paste 2-3 of your best performing video scripts or ideas. CreateX will analyze your style to suggest viral hits.</p>
            </div>
            
            <textarea
              className="w-full h-64 bg-gray-950 border border-gray-700 rounded-xl p-4 text-gray-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none placeholder-gray-600"
              placeholder="Example: &#10;Video 1: How AI is changing art...&#10;Video 2: The future of space travel..."
              value={state.referenceScripts}
              onChange={(e) => setState({...state, referenceScripts: e.target.value})}
            />
            
            <button
              onClick={handleAnalyze}
              disabled={state.isLoading || !state.referenceScripts}
              className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {state.isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />}
              Analyze & Suggest Topics
            </button>
          </div>
        )}

        {/* STEP 2: CONFIG */}
        {state.step === 2 && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left: Topic Selection */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <SparkleIcon /> Suggested Topics
              </h3>
              <div className="space-y-3">
                {state.suggestedTopics.map((topic, i) => (
                  <div 
                    key={i}
                    onClick={() => setState({...state, selectedTopic: topic})}
                    className={`
                      p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02]
                      ${state.selectedTopic === topic 
                        ? 'bg-cyan-900/20 border-cyan-500 text-cyan-100 shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
                        : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600'}
                    `}
                  >
                    {topic}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Settings */}
            <div className="space-y-6 bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">Configuration</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Video Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(VideoType).map((type) => (
                    <button
                      key={type}
                      onClick={() => setState({...state, videoType: type})}
                      className={`
                        py-2 px-3 rounded-lg text-sm font-medium transition-colors border
                        ${state.videoType === type
                          ? 'bg-purple-600 border-purple-400 text-white'
                          : 'bg-gray-950 border-gray-700 text-gray-400 hover:bg-gray-800'}
                      `}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Aspect Ratio</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: AspectRatio.PORTRAIT, icon: <div className="w-3 h-5 border border-current rounded-sm" />, label: '9:16' },
                    { val: AspectRatio.LANDSCAPE, icon: <div className="w-5 h-3 border border-current rounded-sm" />, label: '16:9' },
                    { val: AspectRatio.SQUARE, icon: <div className="w-4 h-4 border border-current rounded-sm" />, label: '1:1' },
                  ].map((ratio) => (
                    <button
                      key={ratio.label}
                      onClick={() => setState({...state, aspectRatio: ratio.val})}
                      className={`
                        flex flex-col items-center justify-center py-3 rounded-lg text-sm font-medium transition-colors border gap-1
                        ${state.aspectRatio === ratio.val
                          ? 'bg-purple-600 border-purple-400 text-white'
                          : 'bg-gray-950 border-gray-700 text-gray-400 hover:bg-gray-800'}
                      `}
                    >
                      {ratio.icon}
                      <span className="text-xs">{ratio.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Language</label>
                <input 
                  type="text" 
                  value={state.language}
                  onChange={(e) => setState({...state, language: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 outline-none"
                />
              </div>

              <button
                onClick={handleGenerateScript}
                disabled={state.isLoading || !state.selectedTopic}
                className="w-full py-3 mt-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {state.isLoading ? <Loader2 className="animate-spin" /> : <Film />}
                Generate Production Assets
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 & 4: RESULTS */}
        {(state.step === 3 || state.step === 4) && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            
            {/* Script Column */}
            <div className="flex flex-col h-full space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="text-cyan-400" /> Script & Description
                </h3>
              </div>
              <div className="flex-1 bg-gray-950 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-800 bg-gray-900">
                  <h4 className="font-bold text-gray-300">Video Script</h4>
                </div>
                <div className="p-4 overflow-y-auto max-h-[400px] text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {state.generatedScript}
                </div>
                <div className="p-4 border-t border-b border-gray-800 bg-gray-900">
                  <h4 className="font-bold text-gray-300">Description</h4>
                </div>
                <div className="p-4 overflow-y-auto max-h-[200px] text-gray-400 whitespace-pre-wrap text-sm">
                  {state.generatedDescription}
                </div>
              </div>
            </div>

            {/* Visuals Column */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Monitor className="text-purple-400" /> AI Thumbnail
              </h3>
              
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
                {state.isLoading && state.generatedThumbnail === null ? (
                   <div className="flex flex-col items-center gap-3">
                     <Loader2 className="animate-spin text-purple-500 w-10 h-10" />
                     <span className="text-purple-400 animate-pulse">Rendering 4K Assets...</span>
                   </div>
                ) : state.generatedThumbnail ? (
                  <>
                    <img 
                      src={state.generatedThumbnail} 
                      alt="Generated Thumbnail" 
                      className="w-full h-auto rounded-lg shadow-2xl transition-transform duration-500 group-hover:scale-105"
                    />
                    <a 
                      href={state.generatedThumbnail} 
                      download="createx_thumbnail.png"
                      className="absolute bottom-6 right-6 p-3 bg-black/70 hover:bg-black text-white rounded-full backdrop-blur-md transition-all border border-white/20 opacity-0 group-hover:opacity-100"
                    >
                      <Download size={20} />
                    </a>
                  </>
                ) : (
                  <div className="text-gray-600">Waiting for generation...</div>
                )}
              </div>

              {state.step === 4 && (
                 <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-6 text-center">
                    <h4 className="text-green-400 font-bold text-lg mb-2">Production Ready!</h4>
                    <p className="text-gray-400 text-sm mb-4">All assets have been generated successfully.</p>
                    <button 
                      onClick={() => setState({
                        step: 1, referenceScripts: '', suggestedTopics: [], selectedTopic: '', 
                        videoType: VideoType.SHORT, aspectRatio: AspectRatio.PORTRAIT, 
                        language: 'English', generatedScript: '', generatedDescription: '', 
                        generatedThumbnail: null, isLoading: false
                      })}
                      className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      Start New Project
                    </button>
                 </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const SparkleIcon = () => (
  <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor"/>
  </svg>
);