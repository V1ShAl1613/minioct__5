import type { IncomingMessage, ServerResponse } from 'http';
import {
  explainMatch,
  naturalLanguageSearch,
  chatWithAssistant,
  summarizeAnnouncement,
  extractOpportunityMetadata,
} from './geminiService.ts';

export async function handleApiRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const url = req.url || '';
  if (!url.startsWith('/api/gemini/')) {
    return false;
  }

  // Helper to read JSON body
  const readBody = async (): Promise<any> => {
    return new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      });
      req.on('end', () => {
        try {
          resolve(data ? JSON.parse(data) : {});
        } catch (e) {
          reject(e);
        }
      });
      req.on('error', reject);
    });
  };

  const sendJson = (status: number, payload: any) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
  };

  try {
    if (url.startsWith('/api/gemini/match-explanation') && req.method === 'POST') {
      const body = await readBody();
      const reasons = await explainMatch(body.studentProfile, body.opportunity);
      sendJson(200, { reasons });
      return true;
    }

    if (url.startsWith('/api/gemini/search') && req.method === 'POST') {
      const body = await readBody();
      const result = await naturalLanguageSearch(body.query, body.studentProfile, body.opportunities || []);
      sendJson(200, result);
      return true;
    }

    if (url.startsWith('/api/gemini/assistant') && req.method === 'POST') {
      const body = await readBody();
      const answer = await chatWithAssistant(
        body.messages || [],
        body.studentProfile,
        body.opportunities || [],
        body.announcements || []
      );
      sendJson(200, { reply: answer });
      return true;
    }

    if (url.startsWith('/api/gemini/summarize-announcement') && req.method === 'POST') {
      const body = await readBody();
      const summary = await summarizeAnnouncement(body.title, body.description);
      sendJson(200, { summary });
      return true;
    }

    if (url.startsWith('/api/gemini/extract-metadata') && req.method === 'POST') {
      const body = await readBody();
      const metadata = await extractOpportunityMetadata(body.title, body.description);
      sendJson(200, metadata);
      return true;
    }

    sendJson(404, { error: 'API route not found' });
    return true;
  } catch (error: any) {
    console.error('API Handler Error:', error);
    sendJson(500, { error: error?.message || 'Internal Server Error' });
    return true;
  }
}
