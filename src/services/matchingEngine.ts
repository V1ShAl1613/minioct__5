import type { Opportunity, UserProfile, MatchScoreBreakdown } from '../types/index.ts';

// In-memory cache for AI explanations to optimize performance and prevent repeated calls
const explanationCache = new Map<string, string[]>();

export function calculateMatchScore(student: UserProfile | null, opportunity: Opportunity): MatchScoreBreakdown {
  if (!student) {
    return {
      totalScore: 70,
      skillScore: 28,
      interestScore: 18,
      eligibilityScore: 14,
      careerScore: 7,
      preferenceScore: 3,
      reasons: ['Sign in or customize your profile to see personalized AI matching factors.'],
      matchedSkills: [],
    };
  }

  const studentSkills = (student.skills || []).map(s => s.toLowerCase().trim());
  const studentInterests = (student.interests || []).map(i => i.toLowerCase().trim());
  const studentGoals = (student.careerGoals || []).map(g => g.toLowerCase().trim());
  const studentDept = (student.department || '').toLowerCase().trim();
  const studentYear = (student.year || '').toLowerCase().trim();
  const oppSkills = (opportunity.skills || []).map(s => s.toLowerCase().trim());

  // 1. Skill Match: 40 points maximum
  let matchedSkillsList: string[] = [];
  let skillScore = 0;
  if (oppSkills.length > 0) {
    matchedSkillsList = (opportunity.skills || []).filter(s =>
      studentSkills.includes(s.toLowerCase().trim())
    );
    const ratio = matchedSkillsList.length / oppSkills.length;
    // Scale up slightly so matching 2 of 3 is high
    skillScore = Math.min(40, Math.round(ratio * 40 * 1.25));
    if (matchedSkillsList.length > 0 && skillScore < 15) skillScore = 18;
  } else {
    skillScore = 32; // Default if opportunity requires no specific skills
  }

  // 2. Interest Match: 25 points maximum
  let interestScore = 0;
  const oppCategory = (opportunity.category || '').toLowerCase();
  const oppTitle = (opportunity.title || '').toLowerCase();
  const oppDesc = (opportunity.description || '').toLowerCase();

  let interestHitCount = 0;
  for (const interest of studentInterests) {
    if (
      oppCategory.includes(interest) ||
      oppTitle.includes(interest) ||
      oppDesc.includes(interest) ||
      oppSkills.some(s => s.includes(interest) || interest.includes(s))
    ) {
      interestHitCount++;
    }
  }
  if (interestHitCount >= 2) interestScore = 25;
  else if (interestHitCount === 1) interestScore = 19;
  else interestScore = 10;

  // 3. Eligibility Match: 20 points maximum
  let eligibilityScore = 20;
  const allowedYears = opportunity.eligibility?.allowedYears || [];
  const allowedDepts = opportunity.eligibility?.allowedDepartments || [];

  if (allowedYears.length > 0) {
    const yearMatch = allowedYears.some(y =>
      y.toLowerCase().includes(studentYear) || studentYear.includes(y.toLowerCase())
    );
    if (!yearMatch) eligibilityScore -= 8;
  }

  if (allowedDepts.length > 0 && !allowedDepts.some(d => d.toLowerCase().includes('all'))) {
    const deptMatch = allowedDepts.some(d =>
      studentDept.includes(d.toLowerCase()) || d.toLowerCase().includes(studentDept)
    );
    if (!deptMatch) eligibilityScore -= 7;
  }
  eligibilityScore = Math.max(5, eligibilityScore);

  // 4. Career Goal Match: 10 points maximum
  let careerScore = 4;
  for (const goal of studentGoals) {
    if (
      oppTitle.includes(goal) ||
      oppDesc.includes(goal) ||
      oppCategory.toLowerCase().includes(goal) ||
      (goal.includes('ai') && (oppTitle.includes('ai') || oppSkills.includes('ai/ml'))) ||
      (goal.includes('software') && (oppCategory === 'internship' || oppCategory === 'hackathon'))
    ) {
      careerScore = 10;
      break;
    }
  }

  // 5. Preference Match: 5 points maximum (Remote/Hybrid/Onsite)
  let preferenceScore = 3;
  const preferredModes = student.preferences?.workModes || [];
  if (preferredModes.length === 0 || preferredModes.includes(opportunity.mode)) {
    preferenceScore = 5;
  } else {
    preferenceScore = 2;
  }

  const totalScore = Math.min(99, Math.max(45, skillScore + interestScore + eligibilityScore + careerScore + preferenceScore));

  // Deterministic high-clarity reasons
  const reasons: string[] = [];
  if (matchedSkillsList.length > 0) {
    reasons.push(`${matchedSkillsList.slice(0, 3).join(', ')} match your profile skills`);
  }
  if (interestHitCount > 0 && student.interests.length > 0) {
    reasons.push(`Aligns with your interest in ${student.interests[0]}`);
  }
  if (opportunity.eligibility?.allowedYears?.length) {
    reasons.push(`You are eligible as a ${student.year || 'current'} student`);
  } else {
    reasons.push(`Open to all academic years in your department`);
  }
  if (student.careerGoals.length > 0) {
    reasons.push(`Supports your career path toward ${student.careerGoals[0]}`);
  }

  return {
    totalScore,
    skillScore,
    interestScore,
    eligibilityScore,
    careerScore,
    preferenceScore,
    reasons,
    matchedSkills: matchedSkillsList,
  };
}

// Request AI explanation from the backend with caching
export async function getAIMatchExplanation(
  student: UserProfile,
  opportunity: Opportunity
): Promise<string[]> {
  const cacheKey = `${student.id}_${opportunity.id}`;
  if (explanationCache.has(cacheKey)) {
    return explanationCache.get(cacheKey)!;
  }

  try {
    const res = await fetch('/api/gemini/match-explanation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentProfile: student,
        opportunity,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.reasons) && data.reasons.length > 0) {
        explanationCache.set(cacheKey, data.reasons);
        return data.reasons;
      }
    }
  } catch (err) {
    console.warn('Could not fetch AI match explanation, using rule breakdown:', err);
  }

  const fallback = calculateMatchScore(student, opportunity).reasons;
  explanationCache.set(cacheKey, fallback);
  return fallback;
}
