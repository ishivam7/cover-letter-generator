# Letterhead — AI Cover Letter Generator

Sprint 04 deliverable: a small SaaS-style tool that turns a candidate's name, target role,
company, and skills — plus an optional job description and resume PDF — into a tailored
cover letter, either instantly from a template (Phase 1) or via a live LLM call (Phase 2/3).

## Stack

- React 18 + Vite
- No CSS framework — hand-rolled design system in `src/index.css` (see design notes below)
- `pdfjs-dist` for client-side resume text extraction (Phase 3, no backend needed)
- Google Gemini API by default, OpenAI as a drop-in alternative

## Running locally

```bash
npm install
cp .env.example .env      # then paste your own key into .env
npm run dev
```

Open the printed `localhost` URL. The **Quick draft** mode works immediately with no key at
all (Phase 1, pure template). Switch to **AI draft** to use the real LLM (Phase 2), which
needs `VITE_GEMINI_API_KEY` (or `VITE_OPENAI_API_KEY` with `VITE_LLM_PROVIDER=openai`) set in
`.env`.

Get a free Gemini key: https://aistudio.google.com/app/apikey

## Environment variables

See `.env.example`. `.env` itself is git-ignored — **never commit real API keys**. All keys
are read at build time through Vite's `import.meta.env`, never hardcoded in source.

⚠️ Note on client-side keys: because this is a static frontend app, any `VITE_*` key is
bundled into the JS shipped to the browser and is technically visible to anyone who inspects
network requests. That's an accepted tradeoff for this assignment's scope (per the brief's
own instructions to use `.env` + `.gitignore` in a frontend project). For a production
product you'd proxy the LLM call through a backend so the key never reaches the client.

## Project structure

```
src/
  App.jsx                       orchestrates form state + submit flow
  components/
    LetterForm.jsx              Phase 1 UI: name/role/company/skills form
    ResumeUpload.jsx            Phase 3 UI: PDF dropzone
    LetterPreview.jsx           renders result, loading + empty states, copy button
  lib/
    generateCoverLetter.js      Phase 1 template + Phase 2 Gemini/OpenAI calls
    parseResume.js              Phase 3 PDF → text extraction
Prompts.md                      documents the system + user prompts used
```

## Deploying (Vercel)

1. Push this repo to GitHub (public, per submission requirements).
2. Import it on vercel.com → "New Project".
3. Add `VITE_GEMINI_API_KEY` (and `VITE_LLM_PROVIDER` if using OpenAI) under
   Project Settings → Environment Variables.
4. Deploy. Build command `npm run build`, output directory `dist` (Vercel auto-detects this
   for Vite).

## Design notes

The visual identity ("Letterhead") leans into the literal subject — stationery, letterhead,
a wax seal — rather than a generic SaaS dashboard look: cream paper background, ink-navy
text, a sealing-wax red accent, and a gold trim line borrowed from letterhead borders. The
signature interaction is the generated letter appearing on a "sheet of paper" with an
animated wax-seal stamp, and a quill-nib loading state while the LLM call is in flight.
