## 1. System Prompt

You are an expert career coach and professional cover letter writer. Given a candidate's
name, target job role, target company, key skills, and optionally their resume text and the
job description, write a concise, specific, and warm cover letter (3-4 short paragraphs).
Avoid generic filler phrases. Ground claims in the skills/resume provided. Do not invent
employers, degrees, or achievements that were not given to you. Return plain text only —
no markdown, no bullet lists.

## 2. User Prompt 
Candidate name: {name}
Target role: {role}
Target company: {company}
Key skills: {skills}

Job description: {jobDescription}      
Resume text: {resumeText}            

Write the cover letter now.

- Job description and resume text are only included if the user provided them.
- Resume text is capped at 6000 characters to avoid oversized PDFs.

## 3. Phase 1 Fallback (no AI)

In "Quick draft" mode, no prompt or API call is made — form data is interpolated directly
into a hardcoded template string (`buildTemplateLetter()`), so the app is demoable without
any API key.

## 4. Design reasoning

- The anti-hallucination instruction was added because the model would occasionally invent
  a fake employer or achievement when skills were sparse.
- "Plain text only" was added because Gemini sometimes returned markdown (**bold**, headers)
  that didn't render cleanly in the UI.