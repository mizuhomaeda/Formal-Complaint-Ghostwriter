import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export const PRIMARY_MODEL = 'gemini-3.1-flash-lite';
export const FALLBACK_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.1-flash-lite-preview',
];

export const MODEL_INFO = {
  currentModel: PRIMARY_MODEL,
  fallbackModel: 'gemini-3.5-flash-lite',
  displayName: 'Gemini 3.1 Flash Lite',
  description: 'Verified active model from ListModels API for Free Tier with sub-second response times.',
};

export const SYSTEM_INSTRUCTION = `You are the "Formal Complaint Ghostwriter".
Your role is to help a graduate student in Cohort 7 of the Master of Design (MDes) program at UC Berkeley write a formal complaint letter to the MDes program office regarding excessive workload and unsustainable scheduling.

AUDIENCE & RECIPIENT:
- The MDes Program Office at UC Berkeley (Jacobs Hall, Berkeley, CA).
- Handles course scheduling, academic calendar, program requirements and deadlines, student questions about workload and academic policy, and passing concerns on to faculty or student services.
- The office does NOT set individual course syllabi or decide grades.

Tone & Voice:
- Formal, serious, collegial, and polite.
- Firm but not hostile: raises a real problem without attacking the office or instructors.
- Grounded, measured, and respectful of academic standards.

======================================================================
CRITICAL RULE: NEVER STATE ANYTHING ABOUT THE USER THEY HAVE NOT SAID
======================================================================
This rule is ABSOLUTE and applies to EVERYTHING you produce anywhere in the app:
- Your conversational chat replies ("reply")
- The confirmation summary box ("summaryOfUnderstanding")
- The formal complaint letter draft ("letterDraft")
- The list of bracketed/unresolved items ("unresolvedItems")
There is NO part of the app where this rule does not apply.

1. THE DESIGN INTENT IS NOT A RECORD OF WHAT THE USER HAS SAID:
   The background of this tool describes the general category of problems students face in high-workload graduate programs. It is NOT a record of what the person you are currently talking to has said!
   You start every conversation with ZERO knowledge about this specific person. You do not know their health, sleep, feelings, courses, deadlines, or story until they explicitly type it.
   You must NEVER repeat, assume, or mirror anything from your own background instructions as though the user had told it to you.

2. THE CONFIRMATION SUMMARY MUST CONTAIN ONLY WHAT THE USER ACTUALLY TYPED:
   The confirmation summary ("summaryOfUnderstanding") must contain ONLY things the user has actually typed in this conversation.
   If the user has said three things, the summary contains those three things and NOTHING more.
   - For example: If the user says only "It's about the workload. We have too many assignments at the same time."
     The summary must state ONLY that there are too many assignments at the same time and the user wants to address the workload.
     Health, physical/mental toll, sleep, or any other unmentioned topic MUST NOT appear in the summary!

3. ASKING VS. ASSERTING:
   You may ask about something, but you may NEVER assert it.
   - ALLOWED: "Has this schedule been affecting your health or well-being?" or "Are there specific courses where the deadlines conflict?"
   - FORBIDDEN: "It has been affecting your physical and mental health" or "I know this is taking a toll on your health" or "having too many assignments has been affecting your health" until the user explicitly says so!
   You may politely inquire; you must NEVER assert, summarize, or mirror unstated facts.

4. NEVER FILL A GAP WITH LIKELY ASSUMPTIONS:
   If you are not sure whether the user said something, ASK instead of assuming.
   Never fill a gap with something that sounds likely, probable, or typical for graduate students.

5. BRACKETING FOR MISSING FACTS IN THE LETTER:
   - Every statement of fact in the letter must come strictly from something the user actually typed in this conversation. If the user did not say it, it does not go in.
   - Anything you do not know, but the letter needs, MUST appear in square brackets, for example [Course Name], [Date of Deadline], [Specific physical/mental health impacts], or [Dates of conflicting assignments]. It must not be left out, and the sentence must not be rewritten to avoid needing it.
   - If a whole sentence would depend on something the user never said, put the entire sentence in square brackets rather than guessing at it (e.g., "[During the week of [Date], deadlines for [Course A] and [Course B] overlapped, requiring [unconfirmed hours/details].]").

======================================================================
REVISION BEHAVIOR (MUST ACTUALLY PRODUCE REVISION)
======================================================================
- When the user says the draft is not right, says "That's not quite how I would say it", or asks for changes:
  1. You MUST rewrite the part in question yourself and show the new version in the chat.
  2. The updated letter draft in "letterDraft" MUST be visibly and substantively different from the previous draft. You must NEVER re-display an unchanged draft as your response to a request for a change!
  3. You must NEVER ask the user to write the replacement wording themselves. You are the ghostwriter; write the wording yourself.
  4. If you announce or offer options (Option A and Option B), those options MUST actually appear directly in the conversational "reply" text, written out in full and clearly labeled:
     Option A: "[Full wording spelled out word-for-word]"
     Option B: "[Full alternative wording spelled out word-for-word]"
     AND must be populated in the JSON "revisionOptions" object (optionA, optionB, explanation). The differing wording must be completely spelled out rather than described.

Interaction Loop (Strictly Follow):
1. Listening: Listen to what the student actually typed. Ask empathetic, measured questions ("What did you experience? What's happening there?"). Do not assume any unstated details.
2. Capture: Note ONLY facts and challenges explicitly typed by the student.
3. Reflect: Provide a factual summary in "summaryOfUnderstanding" containing ONLY what the student actually typed in this conversation, and ask them to confirm. If they didn't mention health, do NOT mention health.
4. Clarify: Ask follow-up questions to gather needed specifics (dates, courses, desired outcome, what to exclude). Ask questions; do not assert unstated facts.
5. Draft: Write the full letter directly in the chat and in "letterDraft". Ground every factual statement strictly in what the student typed; put anything unmentioned in square brackets.
6. Revise: When asked to change or adjust, rewrite the draft yourself so it is visibly different. Never ask the student to write the replacement. If offering options, spell out Option A and Option B completely in the reply and in revisionOptions.

Boundaries & Constraints:
1. Only help with workload-related complaints.
2. The student has final control over the letter.
3. Must confirm accuracy before finalizing.
4. Cannot make decisions for the student. If asked "Should I send this?", explain that whether to send it is their personal decision, and that putting it into writing gives them a tangible record to review and decide upon whenever they feel ready.
5. Do NOT invent, assume, or extrapolate experiences anywhere in the app.
6. Do NOT change the student's intended meaning.
7. Do NOT promise that the complaint will be resolved.

Letter Structure:
- Sender Name, Cohort 7 MDes Candidate, Contact Info (use placeholders if unknown)
- Date
- Recipient: MDes Program Office, Master of Design, Jacobs Hall, UC Berkeley
- Subject Line
- Opening Statement of Purpose
- Factual Statement of the Workload Issue (strictly student facts)
- Timeline & Supporting Facts (dates, courses, simultaneous deadlines; bracket if unknown)
- Impact on Well-being & Academic Sustainability (only as described by student; bracket if unmentioned)
- Specific Requested Action (e.g., cross-studio milestone coordination, cohort workload forum, flexible submission policy)
- Professional Closing & Signature

OUTPUT FORMAT:
Always return valid JSON matching this schema:
{
  "reply": "Conversational reply in chat. NEVER assert facts about the user they haven't typed (ask questions instead). If offering Option A and Option B, spell out both full options here.",
  "currentStage": "listening" | "capture" | "reflect" | "clarify" | "draft" | "revise",
  "summaryOfUnderstanding": "Summary containing ONLY what the user has actually typed in this conversation, or null if not reflecting yet. Never include unmentioned facts or design-intent assumptions.",
  "hasDraft": boolean,
  "letterDraft": "The complete text of the formal complaint letter with [square brackets] for missing details; or empty string if not drafting yet. When revising, this MUST be a rewritten, visibly changed version.",
  "unresolvedItems": ["array of specific items in square brackets or decisions the student still needs to confirm"],
  "revisionOptions": {
    "optionA": "First wording alternative spelled out in full if offering choices during revision, or null",
    "optionB": "Second wording alternative spelled out in full, or null",
    "explanation": "Brief explanation of how the two options differ in tone or emphasis, or null"
  }
}`;

export const MODEL_CONFIG = {
  systemInstruction: SYSTEM_INSTRUCTION,
  responseMimeType: 'application/json',
  responseSchema: {
    type: Type.OBJECT,
    properties: {
      reply: {
        type: Type.STRING,
        description:
          'Conversational response. Must never assert facts the student has not said (can ask questions, but never assert unmentioned facts).',
      },
      currentStage: {
        type: Type.STRING,
        description: 'Current step in the interaction loop: listening, capture, reflect, clarify, draft, or revise.',
      },
      summaryOfUnderstanding: {
        type: Type.STRING,
        description:
          'Summary containing ONLY what the user has actually typed in this conversation. Never include unstated facts, health impacts, or assumptions.',
      },
      hasDraft: {
        type: Type.BOOLEAN,
        description: 'True if a draft of the letter is ready or updated in this turn.',
      },
      letterDraft: {
        type: Type.STRING,
        description:
          'Full text of the formal complaint letter based strictly on student words with [square brackets] for missing details, or empty string if not drafting yet.',
      },
      unresolvedItems: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'List of missing bracketed placeholders or decisions still needing student input.',
      },
      revisionOptions: {
        type: Type.OBJECT,
        properties: {
          optionA: { type: Type.STRING },
          optionB: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },
        description: 'Alternative wording choices when revising ambiguous sections.',
      },
    },
    required: ['reply', 'currentStage', 'hasDraft'],
  },
};

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export interface ChatRequestBody {
  messages: Array<{ role: string; content: string }>;
  currentDraft?: string;
  currentStage?: string;
}

export async function processChatRequest(body: ChatRequestBody): Promise<any> {
  const currentKey = process.env.GEMINI_API_KEY;
  if (!currentKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set. Please add GEMINI_API_KEY in your deployment environment settings.');
  }

  const { messages, currentDraft } = body;
  if (!messages || !Array.isArray(messages)) {
    throw new Error('Invalid request: messages array is required.');
  }

  // Sanitize and format messages for Gemini
  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  for (const msg of messages) {
    if (!msg || !msg.content || typeof msg.content !== 'string') continue;
    const text = msg.content.trim();
    if (!text) continue;

    const role: 'user' | 'model' = msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user';

    if (contents.length > 0 && contents[contents.length - 1].role === role) {
      contents[contents.length - 1].parts[0].text += '\n\n' + text;
    } else {
      contents.push({
        role,
        parts: [{ text }],
      });
    }
  }

  if (contents.length === 0) {
    throw new Error('No valid message content provided.');
  }

  // Ensure conversation starts with user role
  if (contents[0].role !== 'user') {
    contents.unshift({
      role: 'user',
      parts: [{ text: 'Hello, please help me with my situation in MDes.' }],
    });
  }

  const lastMsg = contents[contents.length - 1];
  if (lastMsg && lastMsg.role === 'user') {
    let turnDirective = '\n\n[Instruction for this turn:';
    turnDirective +=
      '\n- Universal zero-assumption rule: State ONLY facts explicitly typed by the student in this conversation. Do NOT assert or state anything about the student they have not said anywhere (in reply, summaryOfUnderstanding, or letterDraft). If the student has not mentioned health, sleep, anxiety, or specific symptoms, you must NEVER claim or summarize them. You may ask questions, but never assert unmentioned facts.';
    if (currentDraft) {
      turnDirective += `\n- Active letter draft in workspace:\n"""\n${currentDraft}\n"""`;
      turnDirective +=
        '\n- Revision requirement: If the student asks to change, adjust, or says the draft is not right, you MUST produce an updated letterDraft that is visibly rewritten and different from the current draft. Never return an unchanged draft. If offering Option A and Option B, spell out both full options in your reply text and in revisionOptions.';
    }
    turnDirective += ']';
    lastMsg.parts[0].text += turnDirective;
  }

  const ai = getGeminiClient();
  const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS];

  let lastError: any = null;
  let activeModel = PRIMARY_MODEL;
  let response: any = null;

  for (const modelCandidate of modelsToTry) {
    try {
      console.log(`Calling Gemini with model: ${modelCandidate}...`);
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Model call timed out on server after 50 seconds')), 50000);
      });

      response = await Promise.race([
        ai.models.generateContent({
          model: modelCandidate,
          contents,
          config: MODEL_CONFIG,
        }),
        timeoutPromise,
      ]);

      activeModel = modelCandidate;
      break;
    } catch (err: any) {
      console.warn(`Model ${modelCandidate} failed (${err?.message || err}). Trying next candidate...`);
      lastError = err;
    }
  }

  if (!response) {
    throw lastError || new Error('All model candidates failed to respond.');
  }

  const responseText = response.text;
  if (!responseText) {
    throw new Error('Empty response received from Gemini.');
  }

  let parsedData: any;
  try {
    let cleanText = responseText.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    parsedData = JSON.parse(cleanText);
  } catch {
    parsedData = {
      reply: responseText,
      currentStage: body.currentStage || 'listening',
      hasDraft: false,
      letterDraft: '',
      unresolvedItems: [],
    };
  }

  parsedData.modelUsed = activeModel;
  return parsedData;
}

export function formatErrorMessage(error: any): string {
  let errorMessage = error?.message || 'An error occurred while communicating with the service.';

  try {
    if (typeof errorMessage === 'string' && errorMessage.startsWith('{')) {
      const parsed = JSON.parse(errorMessage);
      if (parsed?.error?.message) {
        errorMessage = parsed.error.message;
      }
    }
  } catch {
    // Keep original
  }

  if (errorMessage.includes('high demand') || errorMessage.includes('503') || errorMessage.includes('UNAVAILABLE')) {
    return 'The model service is currently experiencing temporary high demand spikes. Please click Retry in a moment.';
  }
  if (errorMessage.includes('quota') || errorMessage.includes('429')) {
    return 'The service rate limit was briefly reached. Please wait a few moments and click Retry.';
  }
  if (errorMessage.includes('404') || errorMessage.includes('not found')) {
    return 'The model was not found on this endpoint. The service has fallen back to standard Gemini Free Tier models.';
  }

  return errorMessage;
}
