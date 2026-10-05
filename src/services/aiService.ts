import type { UserProfile, Opportunity, Announcement } from '../types/index.ts';

export interface AISearchResult {
  interpretedIntent: string;
  results: {
    opportunityId: string;
    relevanceScore: number;
    reason: string;
  }[];
}

export async function searchOpportunitiesAI(
  query: string,
  student: UserProfile | null,
  opportunities: Opportunity[]
): Promise<AISearchResult> {
  try {
    const res = await fetch('/api/gemini/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        studentProfile: student,
        opportunities,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.results)) {
        return data;
      }
    }
  } catch (e) {
    console.warn('AI search error, falling back to local search', e);
  }

  // Robust client-side fallback
  const q = query.toLowerCase();
  const matched = opportunities
    .map(opp => {
      let score = 50;
      let reason = `Relevant match for "${query}"`;
      if (opp.title.toLowerCase().includes(q)) score += 30;
      if (opp.category.toLowerCase().includes(q)) score += 25;
      if (opp.skills.some(s => s.toLowerCase().includes(q) || q.includes(s.toLowerCase()))) {
        score += 25;
        reason = `Matches skill keyword in query`;
      }
      if (q.includes('intern') && opp.category === 'Internship') score += 20;
      if (q.includes('hack') && opp.category === 'Hackathon') score += 20;
      if (q.includes('remote') && opp.mode === 'Remote') score += 15;
      if (q.includes('close') || q.includes('deadline')) score += 10;
      return {
        opportunityId: opp.id,
        relevanceScore: Math.min(98, score),
        reason,
      };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 8);

  return {
    interpretedIntent: `Opportunities matching "${query}"`,
    results: matched,
  };
}

export async function askAssistantAI(
  messages: { role: 'user' | 'assistant'; content: string }[],
  student: UserProfile | null,
  opportunities: Opportunity[],
  announcements: Announcement[]
): Promise<string> {
  try {
    const res = await fetch('/api/gemini/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        studentProfile: student,
        opportunities,
        announcements,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.reply) {
        return data.reply;
      }
    }
  } catch (e) {
    console.warn('Assistant API error:', e);
  }

  // Fallback intelligent response
  const lastMsg = messages[messages.length - 1]?.content.toLowerCase() || '';
  if (lastMsg.includes('highest match') || lastMsg.includes('best match')) {
    const top = opportunities[0];
    return `Based on your profile, your highest match is **${top?.title || 'AI Innovation Hackathon'}** (${top?.organization || 'Apex AI'})! It aligns strongly with your skills and academic year.`;
  }
  if (lastMsg.includes('deadline') || lastMsg.includes('closing') || lastMsg.includes('week')) {
    const soon = [...opportunities].sort((a, b) => a.deadline.localeCompare(b.deadline))[0];
    return `The closest approaching deadline is **${soon?.title}** closing on **${soon?.deadline}**. Be sure to check the eligibility requirements and prepare your resume today!`;
  }
  return `Hi ${student?.name || 'there'}! I'm CampusConnect AI. Based on your profile, you have ${opportunities.length} live opportunities available right now. I can help recommend hackathons, find paid remote internships, or break down application requirements. What are you looking for today?`;
}

export async function summarizeAnnouncementAI(title: string, description: string): Promise<string> {
  try {
    const res = await fetch('/api/gemini/summarize-announcement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.summary) {
        return data.summary;
      }
    }
  } catch (e) {
    console.warn('AI summarize error:', e);
  }

  return description.length > 140 ? description.slice(0, 135) + '...' : description;
}

export async function extractMetadataAI(title: string, description: string) {
  try {
    const res = await fetch('/api/gemini/extract-metadata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Metadata extraction error:', e);
  }

  return {
    skills: ['Problem Solving', 'Communication'],
    category: 'Internship',
    benefits: ['Certificate of Completion', 'Industry Mentorship'],
  };
}
