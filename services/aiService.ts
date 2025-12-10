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
You are an advanced sales follow-up assistant. 
You MUST generate a message that is entirely grounded in the deal context below — no templates, no generic phrasing, no boilerplate structures.

STRICT RULES:
- NO sales clichés (“Hope you're well”, “Circling back”, “Just checking in”, etc.)
- NO template-like structures.
- Every line must be derived from the specific deal data.
- Never invent facts. If missing, stay neutral.
- Use the user’s tone, role and style.
- Be concise, direct, and context-aware.

OUTPUT:
1. A custom subject line starting with “Subject: …”
2. A unique follow-up email body.

DEAL CONTEXT:
- Prospect Name: ${deal.contactName}
- Company: ${deal.companyName}
- Deal Name: ${deal.name}
- Amount: ${deal.amount} ${deal.currency}
- Stage: ${deal.stage}
- Days Inactive: ${deal.daysInactive}
- Last Activity: ${deal.lastActivityDate}
- Next Step: ${deal.nextStep || 'None'}
- Notes: ${deal.notes}

USER PROFILE:
- Sender Name: ${prefs.senderName}
- Role: ${prefs.role}
- Tone: ${prefs.tone}
- Style: ${prefs.style}
- Product Description: ${prefs.productDescription}
- Calendar Link: ${prefs.calendarLink}

TASK:
Write a follow-up email that ONLY uses the information above and your reasoning — never pre-written patterns.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { temperature: 0.7 }
      });

      if (response.text) return response.text;
    } catch (error) {
      console.error("Gemini API failed → fallback enabled", error);
    }
  }

  // --- 2) MINIMAL NON-TEMPLATE FALLBACK ---------------------------------
  // This fallback contains ZERO templates or clichés.
  // It just formats the core information into a readable follow-up structure.

  const firstName = deal.contactName.split(" ")[0];
  const senderName = prefs.senderName || "";

  return `
Subject: Update regarding ${deal.name}

Hi ${firstName},

I'm following up on our last exchange about "${deal.name}". Based on the current context — stage: ${deal.stage}, inactivity: ${deal.daysInactive} days, next step: ${deal.nextStep || "none"} — I wanted to check whether anything has evolved on your side.

If helpful, you can pick a time here: ${prefs.calendarLink || "N/A"}.

${senderName}
`;
};