import React, { useState, useMemo } from 'react';
import {
  Bell,
  Search,
  Filter,
  Sparkles,
  Building,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import type { Announcement } from '../types/index.ts';
import { AnnouncementCard } from '../components/common/AnnouncementCard.tsx';
import { summarizeAnnouncementAI } from '../services/aiService.ts';

interface CampusUpdatesPageProps {
  announcements: Announcement[];
}

export const CampusUpdatesPage: React.FC<CampusUpdatesPageProps> = ({ announcements }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [search, setSearch] = useState('');

  const categories = [
    'All',
    'Academic',
    'Placement',
    'Department',
    'Clubs',
    'Events',
    'Exams',
    'Workshops',
    'General',
  ];

  const priorities = ['All', 'Urgent', 'High', 'Medium', 'Low'];

  const filteredAnnouncements = useMemo(() => {
    return announcements
      .filter(a => a.published)
      .filter(a => {
        if (selectedCategory !== 'All' && a.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
        if (selectedPriority !== 'All' && a.priority.toLowerCase() !== selectedPriority.toLowerCase()) {
          return false;
        }
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = a.title.toLowerCase().includes(q);
          const matchDesc = a.description.toLowerCase().includes(q);
          const matchDept = a.department?.toLowerCase().includes(q);
          const matchAuthor = a.author?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchDept && !matchAuthor) return false;
        }
        return true;
      });
  }, [announcements, selectedCategory, selectedPriority, search]);

  const handleSummarize = async (announcement: Announcement): Promise<string> => {
    return await summarizeAnnouncementAI(announcement.title, announcement.description);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-blue-400" />
            <span>Campus Updates & Circulars</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Stay on top of official college circulars, placement drives, exam schedules, and club notices.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search circulars..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Priority Filter Row */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <div className="flex items-center gap-2">
            <span>Priority:</span>
            <div className="flex gap-1">
              {priorities.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPriority(p)}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    selectedPriority === p
                      ? 'bg-blue-600/20 text-blue-300 font-bold border border-blue-500/40'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <span className="text-slate-500">{filteredAnnouncements.length} updates found</span>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map(ann => (
          <AnnouncementCard
            key={ann.id}
            announcement={ann}
            onSummarizeWithAI={handleSummarize}
          />
        ))}
      </div>

      {filteredAnnouncements.length === 0 && (
        <div className="text-center py-16 rounded-3xl bg-slate-900 border border-slate-800 p-8">
          <Bell className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-white">No campus updates found</h4>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search terms or category selection.
          </p>
        </div>
      )}
    </div>
  );
};
