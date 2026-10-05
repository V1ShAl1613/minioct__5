import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  Search,
  Bookmark,
  Bell,
  Layers,
  GraduationCap,
  Users,
  Target,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { MatchScoreBadge } from '../components/common/MatchScoreBadge.tsx';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreDemo,
}) => {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center">
        {/* Brand Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs sm:text-sm font-semibold mb-6 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Your Campus. Your Opportunities. Personalized by AI.</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto">
          Stop missing opportunities that{' '}
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            matter.
          </span>
        </h1>

        {/* Supporting text */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          CampusConnect uses AI to personalize college updates, internships, hackathons,
          scholarships, events and opportunities based on your skills, interests and career goals.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            type="button"
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm sm:text-base bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onExploreDemo}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm sm:text-base bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>Explore Demo Experience</span>
          </button>
        </div>

        {/* Realistic Interactive Dashboard Mockup Preview */}
        <div className="relative mx-auto max-w-5xl rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl shadow-blue-500/10 p-4 sm:p-6 text-left backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs text-slate-400 ml-2 font-mono">campusconnect.app/dashboard</span>
            </div>
            <span className="text-xs text-blue-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AI Matching Engine Active
            </span>
          </div>

          {/* Student Header Sample */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Good morning, Alex Rivera 👋
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Here are opportunities selected for you by AI.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Computer Science • 3rd Year
              </span>
            </div>
          </div>

          {/* Sample Opportunity Card Preview */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-950/80 border border-blue-500/40 p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  Hackathon
                </span>
                <MatchScoreBadge score={94} size="sm" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">
                AI Innovation Hackathon 2026
              </h4>
              <p className="text-xs text-slate-400 mb-3">Online • Apex AI Foundation • Deadline: Oct 18</p>

              <div className="flex gap-1.5 mb-3 flex-wrap">
                <span className="text-[11px] px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-500/30 font-mono font-medium">
                  Python
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-500/30 font-mono font-medium">
                  AI/ML
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-500/30 font-mono font-medium">
                  Generative AI
                </span>
              </div>

              {/* Why this matches you */}
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 text-xs space-y-1 text-slate-300">
                <div className="text-blue-400 font-bold text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Why this matches you
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Python matches your required skills</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>AI/ML matches your interests</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>You are eligible as a 3rd-year student</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Matches your software engineering career goal</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-950/80 border border-slate-800/80 p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  Internship
                </span>
                <MatchScoreBadge score={91} size="sm" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">
                Google AI & ML Summer Internship
              </h4>
              <p className="text-xs text-slate-400 mb-3">Hybrid • Google • Deadline: Oct 25</p>

              <div className="flex gap-1.5 mb-3 flex-wrap">
                <span className="text-[11px] px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-500/30 font-mono font-medium">
                  Python
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-500/30 font-mono font-medium">
                  Algorithms
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  $7,500/mo
                </span>
              </div>

              <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 text-xs space-y-1 text-slate-300">
                <div className="text-blue-400 font-bold text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Why this matches you
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Eligible for 3rd year pre-final students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Accelerates your AI Engineer career objective</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>High conversion to full-time Pre-Placement Offer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-slate-800/80">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Engineered for Modern College Life
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Everything students and campus administration need to stay connected and accelerate careers.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 hover:border-blue-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Personalized Recommendations</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Every opportunity is benchmarked against your skills (40%), interests (25%), eligibility (20%), and career aspirations (10%).
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 hover:border-blue-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">AI Natural Search</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Type plain English questions like "Find remote AI internships closing this month". Gemini interprets your intent with zero hallucination.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 hover:border-blue-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Campus Updates & Summaries</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Long circulars and placement memos automatically summarized into actionable 2-sentence TL;DRs with deadline alerts.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 hover:border-blue-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Application Tracking Pipeline</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Keep tabs from Saved to Applied, Interview, and Selected. Never lose track of an upcoming interview round or link.
            </p>
          </div>

          {/* Card 5 */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 hover:border-blue-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              <Bookmark className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Smart Deadline Indicators</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Color-coded urgency flags: 🟢 &gt;7 days, 🟡 within 7 days, 🔴 closing soon. Prioritize submissions without stress.
            </p>
          </div>

          {/* Card 6 */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 hover:border-blue-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">CampusConnect AI Assistant</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Always on call to answer questions, guide team formations, highlight high-match events, and prep you for deadlines.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <p>© 2026 CampusConnect. Built with React, TypeScript, Tailwind CSS, Firestore, and Google Gemini AI.</p>
      </footer>
    </div>
  );
};
