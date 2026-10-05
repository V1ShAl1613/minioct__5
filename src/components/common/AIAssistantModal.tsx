import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
  RefreshCw,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import type { UserProfile, Opportunity, Announcement } from '../../types/index.ts';
import { askAssistantAI } from '../../services/aiService.ts';

interface AIAssistantModalProps {
  student: UserProfile | null;
  opportunities: Opportunity[];
  announcements: Announcement[];
  onOpenOpportunity?: (opp: Opportunity) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  student,
  opportunities,
  announcements,
  onOpenOpportunity,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello ${student?.name || 'there'}! 👋 I'm **CampusConnect AI**, your personal opportunity advisor. I have analyzed your skills in ${(student?.skills || []).slice(0, 3).join(', ') || 'tech'} and the latest ${opportunities.length} campus opportunities. How can I help you today?`,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isTyping) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const reply = await askAssistantAI(newMessages, student, opportunities, announcements);
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Sorry, I hit a slight connection glitch. You can still check your highest-match opportunities on the dashboard!',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const samplePrompts = [
    'What opportunities should I apply for this week?',
    'Which hackathon has the highest match for me?',
    'What deadline is closest?',
    'Are there any paid remote internships available?',
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all duration-300 border border-blue-400/40 cursor-pointer"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-wide">CampusConnect AI</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-50 w-[calc(100vw-24px)] sm:w-[420px] h-[520px] max-h-[80vh] flex flex-col rounded-3xl bg-slate-900 border border-blue-500/40 shadow-2xl shadow-blue-500/20 text-slate-100 overflow-hidden animate-in slide-in-from-bottom-5 duration-200 backdrop-blur-xl">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-900/60 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400 shadow-inner">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  CampusConnect AI
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                </h3>
                <p className="text-[11px] text-slate-400">Grounded with live campus data</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setMessages([
                    {
                      role: 'assistant',
                      content: `Refreshed! I have ${opportunities.length} opportunities loaded. What would you like to explore?`,
                    },
                  ])
                }
                title="Reset conversation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs sm:text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {msg.content}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="rounded-2xl rounded-tl-none bg-slate-800/80 border border-slate-700/60 px-4 py-2.5 text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs ml-1 font-medium">CampusConnect AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 3 && (
            <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/60">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1.5">
                Suggested questions:
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(p)}
                    className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-slate-800/90 text-slate-300 hover:text-white hover:bg-blue-600/30 border border-slate-700/70 transition-colors cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask about opportunities, deadlines, or tips..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
