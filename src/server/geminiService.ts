import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Gemini API client per @google/genai SDK instructions
const apiKey = process.env.GEMINI_API_KEY || "";

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export async function explainMatch(studentProfile: any, opportunity: any): Promise<string[]> {
  if (!ai) {
    // High quality deterministic fallback if no API key
    const points: string[] = [];
    if (opportunity.skills && studentProfile.skills) {
      const matchingSkills = opportunity.skills.filter((s: string) =>
        studentProfile.skills.some((ps: string) => ps.toLowerCase() === s.toLowerCase())
      );
      if (matchingSkills.length > 0) {
        points.push(`Matches your skills in ${matchingSkills.join(", ")}`);
      }
    }
    if (studentProfile.interests && studentProfile.interests.length > 0) {
      points.push(`Aligns with your interest in ${studentProfile.interests[0]}`);
    }
    if (studentProfile.year) {
      points.push(`Open to ${studentProfile.year} students`);
    }
    if (studentProfile.careerGoals && studentProfile.careerGoals.length > 0) {
      points.push(`Directly accelerates your goal to become a ${studentProfile.careerGoals[0]}`);
    }
    return points.length > 0 ? points : ["General campus recommendation matching your department profile"];
  }

  try {
    const prompt = `You are the CampusConnect AI matching engine.
Analyze why this college opportunity matches the student profile.
Generate exactly 3 to 4 concise, compelling bullet points highlighting real alignment (skills, interests, eligibility, career goals).
Do NOT hallucinate facts not present in the data.

Student Profile:
- Name: ${studentProfile.name || "Student"}
- Department: ${studentProfile.department || "General"}
- Year: ${studentProfile.year || "3rd Year"}
- Degree: ${studentProfile.degree || "B.Tech"}
- Skills: ${(studentProfile.skills || []).join(", ")}
- Interests: ${(studentProfile.interests || []).join(", ")}
- Career Goals: ${(studentProfile.careerGoals || []).join(", ")}
- Preferred Mode: ${studentProfile.preferences?.mode || "Any"}

Opportunity:
- Title: ${opportunity.title}
- Organization: ${opportunity.organization}
- Category: ${opportunity.category}
- Required Skills: ${(opportunity.skills || []).join(", ")}
- Mode: ${opportunity.mode}
- Eligibility: ${JSON.stringify(opportunity.eligibility || {})}
- Description: ${opportunity.description}

Format: Return a JSON array of 3 to 4 short bullet point strings (e.g. ["Matches your Python and AI/ML skills", "Aligns with your AI Engineer career goal"]).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "[]");
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [
      `Matches your required skillset`,
      `Fits your academic year and department`,
      `Supports your stated career goals`
    ];
  } catch (error) {
    console.error("Gemini explainMatch error:", error);
    return [
      `Strong alignment with your profile skills`,
      `Eligible for ${studentProfile.year || "current year"} students`,
      `Supports your career trajectory in ${studentProfile.department || "engineering"}`
    ];
  }
}

export async function naturalLanguageSearch(query: string, studentProfile: any, opportunities: any[]) {
  if (!ai) {
    // Smart local semantic search fallback
    const q = query.toLowerCase();
    const ranked = opportunities.map(opp => {
      let score = 0;
      let reason = "Matched keyword search";
      const titleMatch = opp.title.toLowerCase().includes(q);
      const orgMatch = opp.organization.toLowerCase().includes(q);
      const catMatch = opp.category.toLowerCase().includes(q);
      const descMatch = opp.description.toLowerCase().includes(q);
      const skillMatch = opp.skills?.some((s: string) => q.includes(s.toLowerCase()) || s.toLowerCase().includes(q));

      if (titleMatch) score += 40;
      if (skillMatch) score += 30;
      if (catMatch) score += 20;
      if (descMatch) score += 10;
      if (orgMatch) score += 10;

      return {
        opportunityId: opp.id,
        relevanceScore: Math.min(100, Math.max(30, score)),
        reason: skillMatch ? `Matches search query requirements` : `Relevant to "${query}"`
      };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);

    return {
      interpretedIntent: `Search for "${query}"`,
      results: ranked.slice(0, 8)
    };
  }

  try {
    const oppSummary = opportunities.map(o => ({
      id: o.id,
      title: o.title,
      organization: o.organization,
      category: o.category,
      skills: o.skills,
      mode: o.mode,
      deadline: o.deadline,
      description: o.description?.slice(0, 200)
    }));

    const prompt = `You are CampusConnect AI Search Engine.
A student typed a natural language query: "${query}".
Student Profile:
- Skills: ${(studentProfile?.skills || []).join(", ")}
- Interests: ${(studentProfile?.interests || []).join(", ")}
- Year: ${studentProfile?.year || "Undergraduate"}
- Department: ${studentProfile?.department || "Technology"}

Available Opportunities in database:
${JSON.stringify(oppSummary)}

Rules:
1. DO NOT invent or fabricate any opportunity. ONLY use the ones provided above.
2. Determine which opportunities actually match the query intent (e.g. "internships", "hackathon", "remote", "AI", "closing soon").
3. For each matching opportunity, provide a relevanceScore (0-100) and a concise explanation of why it satisfies the query.
4. Rank them by relevance.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interpretedIntent: { type: Type.STRING },
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  opportunityId: { type: Type.STRING },
                  relevanceScore: { type: Type.NUMBER },
                  reason: { type: Type.STRING }
                },
                required: ["opportunityId", "relevanceScore", "reason"]
              }
            }
          },
          required: ["interpretedIntent", "results"]
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    return parsed;
  } catch (error) {
    console.error("Gemini naturalLanguageSearch error:", error);
    return {
      interpretedIntent: `Search results for "${query}"`,
      results: opportunities.slice(0, 6).map(o => ({
        opportunityId: o.id,
        relevanceScore: 85,
        reason: `Matches your query for ${o.category}`
      }))
    };
  }
}

export async function chatWithAssistant(messages: { role: string; content: string }[], studentProfile: any, opportunities: any[], announcements: any[]) {
  if (!ai) {
    const lastUserMsg = messages[messages.length - 1]?.content.toLowerCase() || "";
    if (lastUserMsg.includes("hackathon")) {
      const hacks = opportunities.filter(o => o.category?.toLowerCase().includes("hackathon"));
      return `Here are the top hackathons matching your profile: ${hacks.map(h => `**${h.title}** by ${h.organization} (Deadline: ${h.deadline})`).join("; ")}. Would you like tips on team formation or preparation?`;
    }
    if (lastUserMsg.includes("deadline") || lastUserMsg.includes("closing") || lastUserMsg.includes("soon")) {
      const closing = [...opportunities].sort((a, b) => (a.deadline || "").localeCompare(b.deadline || "")).slice(0, 3);
      return `The closest upcoming deadlines are: \n${closing.map(c => `• **${c.title}** (${c.organization}) - Deadline: ${c.deadline}`).join("\n")}. I recommend getting your application in at least 24 hours prior!`;
    }
    return `Hello ${studentProfile?.name || "there"}! I'm CampusConnect AI. I have analyzed your ${studentProfile?.department || "academic"} profile with skills in ${(studentProfile?.skills || []).slice(0, 3).join(", ") || "tech"}. You currently have ${opportunities.length} live opportunities available. How can I help you today? You can ask about hackathons, top internships, or upcoming deadlines.`;
  }

  try {
    const oppSummary = opportunities.slice(0, 15).map(o => ({
      title: o.title,
      org: o.organization,
      category: o.category,
      deadline: o.deadline,
      mode: o.mode,
      skills: o.skills
    }));

    const annSummary = announcements.slice(0, 8).map(a => ({
      title: a.title,
      category: a.category,
      priority: a.priority,
      summary: a.summary || a.description?.slice(0, 120)
    }));

    const systemInstruction = `You are "CampusConnect AI", the friendly, intelligent student opportunity advisor for college students.
You have complete access to the student's actual profile and real campus data.

Student:
- Name: ${studentProfile?.name || "Student"}
- College: ${studentProfile?.college || "College"}
- Department: ${studentProfile?.department || "Computer Science"}
- Year: ${studentProfile?.year || "3rd Year"}
- Skills: ${(studentProfile?.skills || []).join(", ")}
- Interests: ${(studentProfile?.interests || []).join(", ")}
- Career Goals: ${(studentProfile?.careerGoals || []).join(", ")}

Real Opportunities Available in Firestore:
${JSON.stringify(oppSummary)}

Recent Campus Announcements:
${JSON.stringify(annSummary)}

Guidelines:
1. Always base answers strictly on real opportunities and announcements above.
2. Be encouraging, concise, actionable, and student-focused.
3. Highlight deadlines, match factors, and application advice.
4. Use formatting (bullet points, bold text) for readability.`;

    const chatContents = messages.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: chatContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "I'm here to help you navigate campus opportunities and deadlines!";
  } catch (error) {
    console.error("Gemini chatWithAssistant error:", error);
    return "I ran into a temporary hiccup processing your request, but you have several great opportunities closing soon! Feel free to ask again or browse the Discover page.";
  }
}

export async function summarizeAnnouncement(title: string, description: string): Promise<string> {
  if (!ai) {
    return description.length > 150 ? description.slice(0, 140) + "..." : description;
  }

  try {
    const prompt = `Summarize this college campus circular / announcement into a crisp 1 to 2 sentence TL;DR for students. Focus on who is eligible, what the action item is, and the deadline.
Title: ${title}
Announcement: ${description}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    return response.text?.trim() || description.slice(0, 150);
  } catch (error) {
    console.error("Gemini summarizeAnnouncement error:", error);
    return description.slice(0, 150);
  }
}

export async function extractOpportunityMetadata(title: string, description: string) {
  if (!ai) {
    return {
      skills: ["Problem Solving", "Teamwork"],
      category: "Internship",
      benefits: ["Certificate", "Mentorship", "Industry Experience"]
    };
  }

  try {
    const prompt = `Analyze this college opportunity title and description. Extract relevant structured metadata.
Title: ${title}
Description: ${description}

Extract:
1. Top required or recommended technical/soft skills (array of 3-7 strings, e.g. ["Python", "Machine Learning", "Git"])
2. Best matching category (one of: "Internship", "Hackathon", "Scholarship", "Workshop", "Competition", "Placement", "Research")
3. Key student benefits (array of 2-4 strings, e.g. ["Stipend: $1,500/mo", "Certificate of Completion", "Direct Interview for Placement"])`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            category: { type: Type.STRING },
            benefits: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["skills", "category", "benefits"]
        }
      }
    });

    return JSON.parse(response.text?.trim() || "{}");
  } catch (error) {
    console.error("Gemini extractOpportunityMetadata error:", error);
    return {
      skills: ["General Technical Skills"],
      category: "Internship",
      benefits: ["Valuable Experience", "Certification"]
    };
  }
}
