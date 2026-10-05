import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  X,
  GraduationCap,
  Briefcase,
  Layers,
  Heart,
  Target,
  Sliders,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import type { UserProfile, OpportunityMode } from '../types/index.ts';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, updateProfile } = useAuth();
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState(userProfile?.name || 'Alex Rivera');
  const [email, setEmail] = useState(userProfile?.email || 'alex.rivera@campus.edu');
  const [photoURL, setPhotoURL] = useState(
    userProfile?.photoURL ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  );

  const [college, setCollege] = useState(userProfile?.college || 'National Institute of Technology');
  const [department, setDepartment] = useState(
    userProfile?.department || 'Computer Science and Engineering'
  );
  const [degree, setDegree] = useState(userProfile?.degree || 'Bachelor of Technology (B.Tech)');
  const [year, setYear] = useState(userProfile?.year || '3rd Year');
  const [semester, setSemester] = useState(userProfile?.semester || '6th Semester');

  const [skills, setSkills] = useState<string[]>(
    userProfile?.skills?.length ? userProfile.skills : ['Python', 'AI/ML', 'React', 'Cloud', 'SQL']
  );
  const [customSkill, setCustomSkill] = useState('');

  const [interests, setInterests] = useState<string[]>(
    userProfile?.interests?.length
      ? userProfile.interests
      : ['Artificial Intelligence', 'Hackathons', 'Internships']
  );

  const [careerGoals, setCareerGoals] = useState<string[]>(
    userProfile?.careerGoals?.length ? userProfile.careerGoals : ['AI Engineer', 'Software Engineer']
  );

  const [workModes, setWorkModes] = useState<OpportunityMode[]>(
    userProfile?.preferences?.workModes || ['Remote', 'Hybrid']
  );
  const [opportunityTypes, setOpportunityTypes] = useState<string[]>(
    userProfile?.preferences?.opportunityTypes || ['Internship', 'Hackathon', 'Workshop']
  );
  const [isPaidOnly, setIsPaidOnly] = useState(userProfile?.preferences?.isPaidOnly || false);

  if (!isOpen) return null;

  const availableSkills = [
    'Python',
    'Java',
    'JavaScript',
    'React',
    'Flutter',
    'AI/ML',
    'Generative AI',
    'Data Science',
    'Cloud',
    'Cybersecurity',
    'UI/UX',
    'SQL',
    'Django',
    'Docker',
    'FastAPI',
    'Git',
    'C++',
  ];

  const availableInterests = [
    'Artificial Intelligence',
    'Machine Learning',
    'Web Development',
    'Mobile Development',
    'Cybersecurity',
    'Data Science',
    'Research',
    'Entrepreneurship',
    'Hackathons',
    'Internships',
    'Competitive Programming',
    'Cloud Computing',
  ];

  const availableCareerGoals = [
    'Software Engineer',
    'AI Engineer',
    'Data Scientist',
    'Cybersecurity Engineer',
    'Product Designer',
    'Researcher',
    'Entrepreneur',
    'DevOps Specialist',
    'Full Stack Developer',
  ];

  const allModes: OpportunityMode[] = ['Remote', 'Hybrid', 'On-site'];
  const allTypes = [
    'Internship',
    'Hackathon',
    'Scholarship',
    'Workshop',
    'Competition',
    'Placement',
    'Research',
  ];

  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      setSkills([...skills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const toggleItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleComplete = async () => {
    const updated: Partial<UserProfile> = {
      name,
      email,
      photoURL,
      college,
      department,
      degree,
      year,
      semester,
      skills,
      interests,
      careerGoals,
      preferences: {
        workModes,
        opportunityTypes,
        isPaidOnly,
      },
    };
    await updateProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Progress Bar & Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-blue-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Student Profile Setup
            </span>
            <span>Step {step} of 6</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Let's start with the basics</h3>
              <p className="text-xs text-slate-400">
                Tell us your name and customize your avatar for personalized recommendations.
              </p>
            </div>

            <div className="flex items-center gap-4 py-2">
              <img
                src={photoURL}
                alt="Profile Preview"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/50 shadow-md"
              />
              <div className="space-y-1">
                <span className="text-xs text-slate-400 block font-medium">Avatar URL</span>
                <input
                  type="text"
                  value={photoURL}
                  onChange={e => setPhotoURL(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 w-full sm:w-80 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">College Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. alex.rivera@campus.edu"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Academic Info */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Academic Information</h3>
              <p className="text-xs text-slate-400">
                Helps CampusConnect verify eligibility for college placements, hackathons, and research grants.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">College / University</label>
                <input
                  type="text"
                  value={college}
                  onChange={e => setCollege(e.target.value)}
                  placeholder="e.g. National Institute of Technology"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Department</label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option>Computer Science and Engineering</option>
                    <option>Information Technology</option>
                    <option>Data Science and AI</option>
                    <option>Electronics and Communication</option>
                    <option>Electrical Engineering</option>
                    <option>Mechanical Engineering</option>
                    <option>Civil Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Degree Program</label>
                  <input
                    type="text"
                    value={degree}
                    onChange={e => setDegree(e.target.value)}
                    placeholder="e.g. B.Tech / B.E."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Current Academic Year</label>
                  <select
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year (Final Year)</option>
                    <option>Postgraduate / Masters</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Current Semester</label>
                  <select
                    value={semester}
                    onChange={e => setSemester(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:border-blue-500 focus:outline-none"
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
          </div>
        )}

        {/* STEP 3: Skills */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Technical & Soft Skills</h3>
              <p className="text-xs text-slate-400">
                The AI engine uses skills to compute 40% of your opportunity match score.
              </p>
            </div>

            {/* Custom skill adder */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customSkill}
                onChange={e => setCustomSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddCustomSkill()}
                placeholder="Add other skill (e.g. Next.js, Rust, Kubernetes)"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-500 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            {/* Selected skills */}
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">
                Selected Skills ({skills.length})
              </span>
              <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                {skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/40"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => toggleItem(skills, setSkills, s)}
                      className="hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {skills.length === 0 && (
                  <span className="text-xs text-slate-500 italic p-1">No skills chosen yet</span>
                )}
              </div>
            </div>

            {/* Suggested skill chips */}
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">Quick Pick Suggestions:</span>
              <div className="flex flex-wrap gap-1.5">
                {availableSkills.map((s, idx) => {
                  const selected = skills.includes(s);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleItem(skills, setSkills, s)}
                      className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${
                        selected
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 inline mr-1" />}
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Interests */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Areas of Interest</h3>
              <p className="text-xs text-slate-400">
                Select subjects and extracurricular domains you love exploring.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {availableInterests.map((interest, idx) => {
                const isSelected = interests.includes(interest);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleItem(interests, setInterests, interest)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 border border-blue-400/50'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isSelected ? 'fill-current' : 'text-slate-500'}`} />
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Career Goals */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Career Goals & Aspirations</h3>
              <p className="text-xs text-slate-400">
                What roles are you aiming for upon graduating?
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-2 pt-2">
              {availableCareerGoals.map((goal, idx) => {
                const isSelected = careerGoals.includes(goal);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleItem(careerGoals, setCareerGoals, goal)}
                    className={`flex items-center justify-between p-3 rounded-2xl text-xs font-semibold text-left transition-all ${
                      isSelected
                        ? 'bg-blue-600/20 border border-blue-500/50 text-blue-200'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Target className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                      <span>{goal}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: Opportunity Preferences */}
        {step === 6 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Opportunity Preferences</h3>
              <p className="text-xs text-slate-400">
                Fine-tune what formats and opportunity types CampusConnect prioritizes for you.
              </p>
            </div>

            {/* Work Modes */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Preferred Work Mode</label>
              <div className="flex gap-2">
                {allModes.map(mode => {
                  const isSelected = workModes.includes(mode);
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => toggleItem(workModes, setWorkModes as any, mode)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {mode}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Opportunity Types */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Interested Opportunity Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {allTypes.map(t => {
                  const isSelected = opportunityTypes.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleItem(opportunityTypes, setOpportunityTypes, t)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Paid toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-xs font-bold text-white block">Prioritize Paid Opportunities Only</span>
                <span className="text-[11px] text-slate-400">
                  Highlight listings that provide stipends, cash prizes, or tuition scholarships.
                </span>
              </div>
              <input
                type="checkbox"
                checked={isPaidOnly}
                onChange={e => setIsPaidOnly(e.target.checked)}
                className="w-5 h-5 rounded accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 flex items-center gap-1.5 transition-all"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-teal-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Complete & View Recommendations
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
