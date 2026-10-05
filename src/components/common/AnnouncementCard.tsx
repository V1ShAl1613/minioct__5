import React, { useState } from 'react';
import {
  Bell,
  Sparkles,
  Paperclip,
  Calendar,
  Building,
  User,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Download,
} from 'lucide-react';
import type { Announcement } from '../../types/index.ts';

interface AnnouncementCardProps {
  announcement: Announcement;
  onSummarizeWithAI?: (ann: Announcement) => Promise<string>;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  onSummarizeWithAI,
}) => {
  const [showFull, setShowFull] = useState(false);
  const [summary, setSummary] = useState<string | undefined>(announcement.summary);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const priorityStyles: Record<string, string> = {
    Urgent: 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold',
    High: 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-semibold',
    Medium: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    Low: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  };

  const formattedDate = new Date(announcement.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleFetchAISummary = async () => {
    if (onSummarizeWithAI && !summary) {
      setIsSummarizing(true);
      try {
        const result = await onSummarizeWithAI(announcement);
        setSummary(result);
      } finally {
        setIsSummarizing(false);
      }
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 sm:p-6 transition-all duration-200 hover:border-slate-700/80 hover:shadow-lg backdrop-blur-sm">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs border ${
              priorityStyles[announcement.priority] || priorityStyles.Medium
            }`}
          >
            {announcement.priority === 'Urgent' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
            {announcement.priority} Priority
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
            {announcement.category}
          </span>
          {announcement.department && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Building className="w-3 h-3 text-slate-500" />
              {announcement.department}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
        {announcement.title}
      </h3>

      {/* Author */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
        <User className="w-3.5 h-3.5 text-slate-500" />
        <span>Posted by: <strong className="text-slate-300">{announcement.author}</strong></span>
      </div>

      {/* AI Summary Highlight Box */}
      {(summary || onSummarizeWithAI) && (
        <div className="rounded-xl bg-blue-950/40 border border-blue-500/30 p-3.5 mb-4 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Summary (TL;DR)</span>
            </div>
            {!summary && (
              <button
                type="button"
                onClick={handleFetchAISummary}
                disabled={isSummarizing}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 cursor-pointer"
              >
                {isSummarizing ? 'Summarizing...' : 'Generate with Gemini'}
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm text-blue-200/90 leading-relaxed font-normal">
            {summary || 'Click above to generate a rapid 2-sentence summary with Gemini AI.'}
          </p>
        </div>
      )}

      {/* Description Content */}
      <div className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
        {showFull ? (
          <p className="whitespace-pre-line">{announcement.description}</p>
        ) : (
          <p className="line-clamp-2">{announcement.description}</p>
        )}
      </div>

      {/* Attachments & Toggle */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        {announcement.attachments && announcement.attachments.length > 0 ? (
          <div className="flex items-center gap-2 flex-wrap">
            <Paperclip className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400">Attachments:</span>
            {announcement.attachments.map((file, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-slate-800 text-blue-400 hover:text-blue-300 border border-slate-700 cursor-pointer"
                onClick={() => alert(`Simulated download of: ${file}`)}
              >
                <Download className="w-3 h-3" />
                {file}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-slate-500">No attachments</span>
        )}

        <button
          type="button"
          onClick={() => setShowFull(!showFull)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <span>{showFull ? 'Show Less' : 'Read Full Circular'}</span>
          {showFull ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
