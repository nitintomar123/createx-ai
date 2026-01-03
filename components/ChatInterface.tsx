import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Message } from '../types';
import { generateChatResponse } from '../services/geminiService';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "Welcome to CreateX. I'm your AI assistant powered by Nitro Studio. How can I help you create today?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Prepare history for Gemini
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const responseText = await generateChatResponse(history, userMsg.content);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 overflow-hidden relative">
      {/* Decorative BG Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/80 flex items-center gap-3">
        <Sparkles className="text-cyan-400" size={20} />
        <h2 className="text-lg font-bold text-white brand-font">CreateX Chat</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
              ${msg.role === 'user' ? 'bg-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.4)]' : 'bg-cyan-600 shadow-[0_0_10px_rgba(6,182,212,0.4)]'}
            `}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            
            <div className={`
              max-w-[80%] p-4 rounded-2xl whitespace-pre-wrap
              ${msg.role === 'user' 
                ? 'bg-purple-900/20 border border-purple-500/20 text-gray-100 rounded-tr-none' 
                : 'bg-gray-800/50 border border-gray-700 text-gray-200 rounded-tl-none'
              }
            `}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-cyan-400 text-sm animate-pulse ml-14">
            <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
            <span className="w-2 h-2 bg-cyan-400 rounded-full delay-75"></span>
            <span className="w-2 h-2 bg-cyan-400 rounded-full delay-150"></span>
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-900/80 border-t border-gray-800">
        <div className="relative flex items-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none h-12 max-h-32"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};