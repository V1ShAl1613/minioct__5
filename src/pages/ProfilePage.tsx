import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Sparkles,
  Target,
  Heart,
  Plus,
  X,
  Check,
  Save,
  Sliders,
  Settings,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import type { OpportunityMode } from '../types/index.ts';

interface ProfilePageProps {
  onOpenOnboarding: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onOpenOnboarding }) => {
  const { userProfile, updateProfile, profileCompleteness, switchRole } = useAuth();

  const [name, setName] = useState(userProfile?.name || '');
  const [college, setCollege] = useState(userProfile?.college || '');
  const [department, setDepartment] = useState(userProfile?.department || '');
  const [degree, setDegree] = useState(userProfile?.degree || '');
  const [year, setYear] = useState(userProfile?.year || '');
  const [semester, setSemester] = useState(userProfile?.semester || '');

  const [skills, setSkills] = useState<string[]>(userProfile?.skills || []);
  const [newSkill, setNewSkill] = useState('');

  const [interests, setInterests] = useState<string[]>(userProfile?.interests || []);
  const [newInterest, setNewInterest] = useState('');

  const [careerGoals, setCareerGoals] = useState<string[]>(userProfile?.careerGoals || []);
  const [newGoal, setNewGoal] = useState('');

  const [workModes, setWorkModes] = useState<OpportunityMode[]>(
    userProfile?.preferences?.workModes || ['Remote', 'Hybrid']
  );
  const [isPaidOnly, setIsPaidOnly] = useState(userProfile?.preferences?.isPaidOnly || false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const handleAddGoal = () => {
    if (newGoal.trim() && !careerGoals.includes(newGoal.trim())) {
      setCareerGoals([...careerGoals, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const handleRemoveGoal = (goal: string) => {
    setCareerGoals(careerGoals.filter(g => g !== goal));
  };

  const toggleMode = (mode: OpportunityMode) => {
    if (workModes.includes(mode)) {
      setWorkModes(workModes.filter(m => m !== mode));
    } else {
      setWorkModes([...workModes, mode]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      college,
      department,
      degree,
      year,
      semester,
      skills,
      interests,
      careerGoals,
      preferences: {
        ...userProfile?.preferences,
        workModes,
        isPaidOnly,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-150">
      {/* Profile Header & Completeness Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={
              userProfile?.photoURL ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
            }
            alt={userProfile?.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500/50 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white">{userProfile?.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 capitalize">
                {userProfile?.role}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{userProfile?.email}</p>
            <p className="text-xs text-slate-500 mt-1">
              {userProfile?.department} • {userProfile?.college}
            </p>
          </div>
        </div>

        {/* Completeness Gauge */}
        <div className="w-full sm:w-64 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Profile Completeness
            </span>
            <span className="text-blue-400 text-sm font-bold">{profileCompleteness}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${profileCompleteness}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            {profileCompleteness >= 80
              ? 'Great profile! Matches are highly personalized.'
              : 'Add more skills and career goals to improve AI precision.'}
          </p>
          <button
            type="button"
            onClick={onOpenOnboarding}
            className="w-full py-1.5 rounded-lg text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
          >
            Launch Setup Wizard
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Academic Details */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-400" />
            <span>Academic Information</span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">College</label>
              <input
                type="text"
                value={college}
                onChange={e => setCollege(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Degree</label>
              <input
                type="text"
                value={degree}
                onChange={e => setDegree(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Year</label>
              <select
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year (Final Year)</option>
                <option>Postgraduate</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Semester</label>
              <select
                value={semester}
                onChange={e => setSemester(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option>1st Semester</option>
                <option>2nd Semester</option>
                <option>3rd Semester</option>
                <option>4th Semester</option>
                <option>5th Semester</option>
                <option>6th Semester</option>
                <option>7th Semester</option>
                <option>8th Semester</option>
              </select>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>Skills (40% Match Weight)</span>
          </h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="Add skill (e.g. PyTorch, React, SQL, DevOps)"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Skill
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map((s, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/40"
              >
                {s}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(s)}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Interests & Career Goals */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Interests */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Interests (25% Weight)</span>
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newInterest}
                onChange={e => setNewInterest(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInterest();
                  }
                }}
                placeholder="Add interest"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddInterest}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {interests.map((i, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/30"
                >
                  {i}
                  <button type="button" onClick={() => handleRemoveInterest(i)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Career Goals */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Career Goals (10% Weight)</span>
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newGoal}
                onChange={e => setNewGoal(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddGoal();
                  }
                }}
                placeholder="Add goal (e.g. AI Engineer)"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddGoal}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {careerGoals.map((g, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                >
                  {g}
                  <button type="button" onClick={() => handleRemoveGoal(g)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <span>Opportunity Preferences</span>
          </h2>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                Work Mode Preference
              </span>
              <div className="flex gap-2">
                {(['Remote', 'Hybrid', 'On-site'] as OpportunityMode[]).map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleMode(m)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      workModes.includes(m)
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={isPaidOnly}
                onChange={e => setIsPaidOnly(e.target.checked)}
                className="rounded accent-blue-600 cursor-pointer"
              />
              <span>Only alert me for paid opportunities & scholarships</span>
            </label>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-4 h-4" />
              Profile updated and re-indexed with Gemini AI!
            </span>
          )}
          {!savedSuccess && <div />}

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-500/25 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
