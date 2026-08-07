# Letterhead — AI Cover Letter Generator

## Stack

 React 18 + Vite
 No CSS framework — hand-rolled design system in `src/index.css` (see design notes below)
 pdfjs-dist for client-side resume text extraction (Phase 3, no backend needed)
 Google Gemini API by default, OpenAI as a drop-in alternative

# live link
https://cover-letter-generator-hp2s.vercel.app/

# Running locally

bash
npm install
cp .env.example .env      # then paste your own key into .env
npm run dev

Open the printed `localhost` URL. The **Quick draft** mode works immediately with no key at
all (Phase 1, pure template). Switch to **AI draft** to use the real LLM (Phase 2), which
needs `VITE_GEMINI_API_KEY` (or `VITE_OPENAI_API_KEY` with `VITE_LLM_PROVIDER=openai`) set in
`.env`.

Get a free Gemini key: https://aistudio.google.com/app/apikey

# Environment variables

See `.env.example`. `.env` itself is git-ignored — **never commit real API keys**. All keys
are read at build time through Vite's `import.meta.env`, never hardcoded in source.


# Project structure

src/
  App.jsx                       
  components/
    LetterForm.jsx               
    ResumeUpload.jsx            
    LetterPreview.jsx            
    generateCoverLetter.js      
    parseResume.js              
Prompts.md                     

# Deploying (Vercel)

1. Push this repo to GitHub (public, per submission requirements).
2. Import it on vercel.com → "New Project".
3. Add `VITE_GEMINI_API_KEY` (and `VITE_LLM_PROVIDER` if using OpenAI) under
   Project Settings → Environment Variables.
4. Deploy. Build command `npm run build`, output directory `dist` (Vercel auto-detects this
   for Vite).

