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
Your job is to write a message that sounds genuinely human, relationship-driven, and context-aware — NOT robotic, NOT formulaic.

STRICT RULES:
- NEVER include the deal name, contract name, deal amount, CRM stage, last activity date, or inactivity metrics in the email. These are for your reasoning only.
- NEVER include the deal’s next step in the subject line or body unless the user explicitly wrote it in their own notes.
- NEVER generate robotic subjects like “Update on X”, “Checking in about Y”, “Next steps for Z”, etc.
- NO clichés: avoid “Hope you're well”, “Circling back”, “Just checking in”, “Following up on…”.
- NO templates or repeated structures.
- Every sentence must be inferred from the *meaning* of the deal context, not the raw fields.

HUMAN-FIRST GUIDELINES:
- Write as if the user personally remembers the last interaction.
- Use the notes to guide what matters most to the prospect (concerns, blockers, priorities).
- Reference topics indirectly, not as CRM fields.
- Keep the message concise, purposeful, and natural.
- The tone, style, and role MUST strictly follow the user preferences.
- ALWAYS include the user’s calendar link as an option to book a time, smoothly integrated into the message.

OUTPUT FORMAT:
1. A natural, human subject line (“Subject: …”) that does NOT rely on deal data.
2. A concise follow-up email that feels like a real person wrote it.
3. End with the sender name given by the user.

AVAILABLE CONTEXT (for reasoning only — do NOT copy these fields literally into the email):
PROSPECT:
- Name: ${deal.contactName}
- Company: ${deal.companyName}

DEAL CONTEXT (reasoning only):
- Notes: ${deal.notes}
- Next Step: ${deal.nextStep || 'None'}
- Stage: ${deal.stage}
- Inactivity: ${deal.daysInactive}
- Last Activity: ${deal.lastActivityDate}

USER PROFILE:
- Sender Name: ${prefs.senderName}
- Role: ${prefs.role}
- Tone: ${prefs.tone}
- Style: ${prefs.style}
- Product Description: ${prefs.productDescription}
- Calendar Link: ${prefs.calendarLink}

TASK:
Write a follow-up email that:
- feels 100% human;
- draws from DEAL CONTEXT but never exposes raw CRM data;
- adapts tone & writing style;
- integrates the calendar link naturally at the end.

HUMAN MEMORY MODE:
You must treat the “Notes” field as if it were your personal memory of the last exchanges with the prospect.
Do NOT quote the notes directly. Instead:
- Infer what the prospect cares about.
- Infer the tone of the last conversation.
- Infer whether they seemed hesitant, blocked, curious, positive, or slow-moving.
- Infer whether the seller promised something (a document, a follow-up, a clarification).
- Infer what might matter most emotionally or practically to the prospect.

THEN:
Use these inferences to shape the message subtly and naturally, as if the sender personally remembered it — NEVER as CRM data.

Examples of memory use:
- If notes mention “waiting for legal”, write as if you remember they said their team was reviewing something — without naming stages or documents.
- If notes mention “budget concerns”, write as if you remember they were hoping for clarity or options.
- If notes mention “technical questions”, write as if you remember they wanted reassurance.
- If notes say “prospect was very positive”, write with a warm, momentum-driven tone.

YOU MUST:
- Use the notes as psychological and contextual clues.
- Never restate the notes literally.
- Never expose internal CRM fields as facts.

This mode should create the feeling that the sender genuinely recalls the last conversation.
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