import { AgentPreferences, Deal } from '../types';
import { GoogleGenAI } from "@google/genai";

/**
 * Generates a follow-up email draft based on deal context and user preferences.
 * Gemini is always used when the API key is present.
 */
export const generateFollowUp = async (deal: Deal, prefs: AgentPreferences): Promise<string> => {
  const apiKey = import.meta.env.VITE_API_KEY;

  // --- 1) GEMINI PATH -------------------------------------------------
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
You are a senior sales executive ghostwriter. Your output must feel exactly like a real salesperson writing a highly contextual, thoughtful follow-up — not an AI.

NON-NEGOTIABLE RULES:
- No clichés. Never use phrases like "Hope you're well", "Circling back", "Just checking in", "I know you're busy", "Following up", "Touching base", etc.
- No templates. Do not rely on fixed structures or generic email formulas.
- No AI-sounding transitions such as "I wanted to reach out", "I hope this message finds you", etc.
- No repetition of raw CRM metadata (amount, stage, dates, days inactive) unless it is *naturally* relevant to what the seller would mention.
- Use ONLY the real context from the deal, notes, and user preferences.
- If notes exist, treat them as human memory recall: reference them subtly, not literally.
- Always include the calendar link at the end as a soft optional CTA.
- Adapt tone, role, and style preferences — but subtly, so it still sounds like a real person.



GOAL:
Write the most natural, context-aware follow-up email possible.
It should read as if the salesperson remembered the conversation and is thoughtfully re-engaging.

FORMAT:
1. A human, natural subject line (no deal stage, no amount, no CRM terms).
2. A concise email body (roughly 6–10 lines). Human, specific, contextual.

CONTEXT — DEAL (for your reasoning only, do not dump these fields literally):
- Prospect Name: ${deal.contactName}
- Company: ${deal.companyName}
- Deal Name: ${deal.name}
- Notes / Memory: ${deal.notes || "None"}
- Last known context / next step: ${deal.nextStep || "None provided"}
- Days inactive: ${deal.daysInactive} (do not mention the exact number unless it fits naturally)
- Product description: ${prefs.productDescription || "None"}

CONTEXT — USER (SENDER):
- Name: ${prefs.senderName}
- Role: ${prefs.role}
- Tone: ${prefs.tone}
- Style: ${prefs.style}
- Calendar link: ${prefs.calendarLink}

WRITING GUIDANCE:
- Start from something meaningful or specific from the notes, as if you remembered the last discussion.
- If a next step exists, reference it conversationally (not as a CRM field).
- If there has been a delay, acknowledge it gently without using clichés about time.
- Be helpful, not pushy. Focus on making it easy for the prospect to respond.
- Provide the calendar link as a soft option near the end.
- Sign only with the sender's name (no invented titles).

Now generate a single email with:
1) "Subject: ..." on the first line.
2) Then the body of the email.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { temperature: 0.7 }
      });

      if (response.text) {
        return response.text;
      }
    } catch (error) {
      console.error("Gemini API failed → fallback enabled", error);
    }
  }

  // --- 2) MINIMAL NON-TEMPLATE FALLBACK ---------------------------------
  // This fallback avoids CRM-like metadata and keeps things neutral & human.

  const firstName = (deal.contactName || '').split(' ')[0] || 'there';
  const senderName = prefs.senderName || '';

  return `
Subject: Quick follow-up

Hi ${firstName},

I was thinking about our last conversation and wanted to briefly check in, in case there’s anything you’re waiting on from my side or any questions that have come up since.

If it’s easier to talk things through live, you can grab a time that works best for you here: ${prefs.calendarLink || ''}

${senderName}
`.trim();
};