/**
 * generateCoverLetter.js
 * ----------------------------------------------------------------
 * Phase 1 — Data Simulation (P0):
 *   buildTemplateLetter() interpolates form state into a hardcoded
 *   template string. No network call, works with zero setup.
 *
 * Phase 2 — LLM Integration (Priority 1):
 *   generateWithLLM() sends the same state to an LLM (Gemini by
 *   default, OpenAI as an alternative) using a key read from
 *   environment variables via Vite's import.meta.env. The exact
 *   system prompt lives in /Prompts.md as required by the brief.
 * ----------------------------------------------------------------
 */

const PROVIDER = import.meta.env.VITE_LLM_PROVIDER || "gemini";
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/** Phase 1: pure template interpolation, no API involved. */
export function buildTemplateLetter({ name, role, company, skills }) {
  const skillList = skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const skillSentence =
    skillList.length > 0
      ? `My background includes hands-on experience with ${skillList
          .slice(0, -1)
          .join(", ")}${skillList.length > 1 ? " and " + skillList[skillList.length - 1] : skillList[0]}, which I believe map directly onto what this role demands.`
      : `I bring a versatile, fast-learning approach to every project I take on.`;

  return `Dear Hiring Manager at ${company || "[Company]"},

I am ${name || "[Your Name]"}, and I am writing to express my interest in the ${role || "[Job Role]"} position at ${company || "[Company]"}. ${skillSentence}

I would welcome the opportunity to bring this experience to your team and discuss how I can contribute to ${company || "[Company]"}'s continued success.

Sincerely,
${name || "[Your Name]"}`;
}

const SYSTEM_PROMPT = `You are an expert career coach and professional cover letter writer. Given a candidate's name, target job role, target company, key skills, and optionally their resume text and the job description, write a concise, specific, and warm cover letter (3-4 short paragraphs). Avoid generic filler phrases ("I am writing to express my interest" as a whole opener is fine once, but do not repeat cliches). Ground claims in the skills/resume provided. Do not invent employers, degrees, or achievements that were not given to you. Return plain text only — no markdown headers, no bullet lists, just the letter body ready to send.`;

function buildUserPrompt({ name, role, company, skills, jobDescription, resumeText }) {
  let prompt = `Candidate name: ${name}\nTarget role: ${role}\nTarget company: ${company}\nKey skills: ${skills}`;
  if (jobDescription?.trim()) {
    prompt += `\n\nJob description:\n${jobDescription.trim()}`;
  }
  if (resumeText?.trim()) {
    prompt += `\n\nResume text (extracted from uploaded PDF):\n${resumeText.trim().slice(0, 6000)}`;
  }
  prompt += `\n\nWrite the cover letter now.`;
  return prompt;
}

/** Phase 2: real LLM call. Throws a descriptive error the UI can surface. */
export async function generateWithLLM(fields) {
  const userPrompt = buildUserPrompt(fields);

  if (PROVIDER === "openai") {
    return callOpenAI(userPrompt);
  }
  return callGemini(userPrompt);
}

async function callGemini(userPrompt) {
  if (!GEMINI_KEY) {
    throw new Error(
      "Missing VITE_GEMINI_API_KEY. Add it to your .env file (see .env.example) and restart the dev server."
    );
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 700 },
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
  if (!text) throw new Error("Gemini returned an empty response.");
  return text.trim();
}

async function callOpenAI(userPrompt) {
  if (!OPENAI_KEY) {
    throw new Error(
      "Missing VITE_OPENAI_API_KEY. Add it to your .env file (see .env.example) and restart the dev server."
    );
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 700,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content ?? "";
  if (!text) throw new Error("OpenAI returned an empty response.");
  return text.trim();
}

export { SYSTEM_PROMPT };
