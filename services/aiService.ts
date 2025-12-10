import { AgentPreferences, Deal } from '../types';
import { GoogleGenAI } from "@google/genai";

/**
 * Generates a high-quality follow-up email draft based on deal context and user preferences.
 */
export const generateFollowUp = async (deal: Deal, prefs: AgentPreferences): Promise<string> => {
  // Use Gemini API if key is available
  if (process.env.API_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        You are a sales assistant helping to write a follow-up email.
        
        DEAL CONTEXT:
        - Prospect Name: ${deal.contactName}
        - Company: ${deal.companyName}
        - Deal Name: ${deal.name}
        - Amount: ${deal.amount} ${deal.currency}
        - Stage: ${deal.stage}
        - Days Inactive: ${deal.daysInactive}
        - Last Activity: ${deal.lastActivityDate}
        - Next Step: ${deal.nextStep || 'Not defined'}
        - Notes: ${deal.notes}

        YOUR ROLE & PREFERENCES:
        - Role: ${prefs.role}
        - Tone: ${prefs.tone}
        - Style: ${prefs.style}
        - Product Description: ${prefs.productDescription}
        - Calendar Link: ${prefs.calendarLink}

        TASK:
        Write a follow-up email to the prospect.
        The subject line should be included at the top as "Subject: ...".
        Do not use placeholders like [Your Name], sign off as the role specified or just "Best,".
        Use the notes to personalize the message if possible.
        If the deal has been inactive for a long time (>14 days), acknowledge it politely.
        Keep it natural and human.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.7,
        }
      });
      
      if (response.text) {
        return response.text;
      }
    } catch (error) {
      console.error("Gemini API failed, falling back to mock.", error);
    }
  }

  // Fallback Mock Implementation (Network Delay)
  await new Promise((resolve) => setTimeout(resolve, 800));

  const firstName = deal.contactName.split(' ')[0];
  const company = deal.companyName;
  const days = deal.daysInactive;
  const notes = (deal.notes || '').toLowerCase();
  
  // 1. GENERATE SUBJECT LINE
  const subjects = [
    `Checking in on ${deal.name}`,
    `Updates on ${deal.name}?`,
    `Next steps for ${company}`,
    `Touching base`
  ];
  let subject = subjects[Math.floor(Math.random() * subjects.length)];
  if (prefs.tone === 'casual') subject = `Quick Q for ${firstName}`;
  if (prefs.tone === 'direct') subject = `${company} / Drift Timeline`;

  // 2. GENERATE BODY
  let body = `Hi ${firstName},\n\n`;
  
  if (days > 14) {
    body += `I know it's been a while, but I wanted to circle back on our conversation about ${deal.name}. I imagine you've been busy.\n\n`;
  } else {
    body += `Hope you're having a great week.\n\n`;
  }

  if (notes.includes('budget') || notes.includes('price')) {
    body += `I've been thinking about the budget constraints we discussed, and I have some ideas that might help us move forward.\n\n`;
  } else if (notes.includes('feature') || notes.includes('tech')) {
    body += `I dug into the technical requirements you mentioned and confirmed we can support your use case.\n\n`;
  } else if (deal.nextStep) {
    body += `I wanted to see if you're still tracking towards ${deal.nextStep.toLowerCase()}?\n\n`;
  } else {
    body += `I wanted to see if there are any updates on your end?\n\n`;
  }

  body += `Let me know if you have any questions or if it makes sense to hop on a quick call.\n\n`;
  
  if (prefs.calendarLink) {
    body += `Feel free to grab time here if easier: ${prefs.calendarLink}\n\n`;
  }

  // 3. SIGN OFF
  const signOffs = {
      'AE': 'Best,\nAccount Executive',
      'BDR': 'Cheers,\nBusiness Development',
      'Founder': 'Best regards,\nFounder',
      'CSM': 'Thanks,\nCustomer Success',
      'VP Sales': 'Best,\nVP Sales',
      'Other': 'Best,'
  };
  const signOff = signOffs[prefs.role as keyof typeof signOffs] || 'Best,';
  
  return `Subject: ${subject}\n\n${body}${signOff}`;
};
