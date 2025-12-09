import { AgentPreferences, Deal } from '../types';

// TODO: Import Gemini SDK when ready
// import { GoogleGenAI } from "@google/genai";

/**
 * Generates a high-quality follow-up email draft based on deal context and user preferences.
 */
export const generateFollowUp = async (deal: Deal, prefs: AgentPreferences): Promise<string> => {
  // Simulate network delay for realism
  await new Promise((resolve) => setTimeout(resolve, 800));

  /* 
    ---------------------------------------------------------
    TODO: REAL GEMINI API IMPLEMENTATION
    ---------------------------------------------------------
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // ... (Implementation remains similar, but prompt needs to match the logic below)
  */

  // --- ENHANCED MOCK IMPLEMENTATION ---

  const firstName = deal.contactName.split(' ')[0];
  const company = deal.companyName;
  const days = deal.daysInactive;
  // const stage = deal.stage.toLowerCase(); // Unused in this version of logic but good to have
  const notes = (deal.notes || '').toLowerCase();
  const nextStepRaw = (deal.nextStep || '').toLowerCase();
  
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  // 1. GENERATE SUBJECT LINE (Shorter, lower friction)
  let subject = '';
  if (prefs.tone === 'direct') {
    subject = pick([
      `${company} / Drift`,
      `The ${deal.name} project`,
      `Timeline for ${deal.name}`,
      `Next steps: ${deal.name}`
    ]);
  } else if (prefs.tone === 'casual') {
    subject = pick([
      `Quick check-in`,
      `Thoughts?`,
      `Hi ${firstName}`,
      `Catching up`,
      `Quick Q`
    ]);
  } else {
    subject = pick([
      `Re: ${deal.name}`,
      `Checking in`,
      `Next steps?`,
      `Question regarding ${deal.name}`,
      `Touching base`
    ]);
  }

  // 2. THE HOOK (Contextual Opening based on time)
  let hook = '';
  if (days > 30) {
    hook = pick([
      `It's been a few weeks since we last spoke, so I wanted to float this to the top of your inbox.`,
      `I know things get buried easily, but I wanted to circle back on our conversation from last month.`,
      `I'm assuming this project might have been pushed down the priority list, but wanted to double-check.`
    ]);
  } else if (days > 14) {
    hook = pick([
      `I wanted to check in and see how things are moving on your end.`,
      `Hope you're having a good week. Touching base as it's been a couple of weeks since we connected.`,
      `Circling back on this as I haven't heard from you in a bit.`
    ]);
  } else {
    hook = pick([
      `Hope you're having a productive week.`,
      `Just following up on my previous note.`,
      `Quick check-in to see where we stand.`,
      `Hope all is well at ${company}.`
    ]);
  }

  // 3. INTELLIGENT CONTEXT MAPPING (The Brain)
  
  // Detect specific topics in notes
  let noteContext = 'general';
  if (notes.match(/price|budget|cost|expensive|discount|money|commercial/)) noteContext = 'commercial';
  else if (notes.match(/feature|tech|api|integration|security|requirements|demo/)) noteContext = 'technical';
  else if (notes.match(/busy|travel|vacation|ooo|time|later|bandwidth/)) noteContext = 'timing';
  else if (notes.match(/boss|manager|board|cfo|ceo|approval|stakeholder/)) noteContext = 'authority';
  else if (notes.match(/competitor|vendor|alternative|other option/)) noteContext = 'competition';

  // Detect next step intent
  let nextStepIntent = 'general';
  if (nextStepRaw.match(/legal|contract|msa|agreement/)) nextStepIntent = 'legal';
  else if (nextStepRaw.match(/demo|schedule|call|meeting|intro/)) nextStepIntent = 'meeting';
  else if (nextStepRaw.match(/budget|finance|invoice/)) nextStepIntent = 'finance';
  else if (nextStepRaw.match(/feedback|decision|review/)) nextStepIntent = 'feedback';


  // 4. CONTENT GENERATION (Weaving Notes + Next Step)
  let contentBody = '';

  const transitions = {
    commercial: [
      "I know we were navigating some constraints around the budget last time.",
      "I've been thinking about the pricing discussion we had.",
      "I wanted to see if there's any update on the budget approval we discussed."
    ],
    technical: [
      "I was reviewing the technical requirements you mentioned.",
      "Regarding the features we discussed previously,",
      "I know ensuring the tech fit is critical here."
    ],
    timing: [
      "I know it's a hectic time for you right now.",
      "I appreciate you're juggling a lot of priorities.",
      "I didn't want to overload your inbox while you were busy."
    ],
    authority: [
      "I know you were waiting on internal approvals.",
      "How did the conversation go with the wider team?",
      "I wanted to see if you've had a chance to socialize this internally."
    ],
    competition: [
      "I know you're evaluating a few options right now.",
      "I wanted to see how we're stacking up against the alternatives you're looking at.",
      "If there are specific gaps you see compared to other vendors, I'd love to address them."
    ],
    general: [
      "I wanted to bump this up in case you missed my last note.",
      "Just wanted to keep the momentum going.",
      "Do you have a moment to update me on where things stand?"
    ]
  };

  const asks = {
    legal: "Has your legal team had a chance to review the agreement yet? I'm happy to hop on a call with them directly if it speeds things up.",
    meeting: "Are you still open to that call we discussed? I think a quick sync would clarify a lot.",
    finance: "How are the budget discussions progressing? Let me know if you need any more ROI data to help make the case.",
    feedback: "Have you had a chance to collect thoughts from the team? I'd love to hear their feedback, even if it's a 'no' for now.",
    general: "Do you have clarity on the next steps, or is this on hold for now?"
  };

  // Select the sentence parts
  const selectedTransition = pick(transitions[noteContext as keyof typeof transitions] || transitions.general);
  const selectedAsk = asks[nextStepIntent as keyof typeof asks] || asks.general;

  // Combine them naturally
  if (noteContext === 'general') {
      contentBody = `${selectedAsk}`;
  } else {
      contentBody = `${selectedTransition} ${selectedAsk}`;
  }


  // 5. CLOSING (Based on Style)
  let closing = '';
  if (prefs.style === 'short') {
    closing = "Let me know.";
  } else if (prefs.style === 'urgent') {
    closing = "Please let me know if this is no longer a priority so I can update my forecast.";
  } else if (prefs.style === 'soft') {
    closing = "No rush, just wanted to keep this on your radar.";
  } else if (prefs.style === 'storytelling') {
    closing = "I saw a similar team recently unblock this by moving fast, and I'd love to help you do the same. Let me know what you think.";
  } else {
    closing = "Looking forward to hearing from you.";
  }

  // 6. CALENDAR LINK (Only if appropriate)
  if (prefs.calendarLink && !prefs.style.includes('urgent')) {
    closing += `\n\nLink to my calendar if it's easier to grab time: ${prefs.calendarLink}`;
  }

  // 7. SIGN OFF
  let signOff = 'Best,';
  if (prefs.role.toLowerCase().includes('founder')) signOff = 'Best regards,\n\nFounder @ Drift';
  else if (prefs.role === 'BDR') signOff = 'Cheers,';
  else if (prefs.role === 'VP Sales') signOff = 'Thanks,';
  
  // FINAL ASSEMBLY
  return `Subject: ${subject}\n\nHi ${firstName},\n\n${hook}\n\n${contentBody}\n\n${closing}\n\n${signOff}`;
};