import { useState } from "react";
import LetterForm from "./components/LetterForm.jsx";
import LetterPreview from "./components/LetterPreview.jsx";
import { buildTemplateLetter, generateWithLLM } from "./lib/generateCoverLetter.js";

const initialFields = {
  name: "",
  role: "",
  company: "",
  skills: "",
  jobDescription: "",
};

export default function App() {
  const [fields, setFields] = useState(initialFields);
  const [mode, setMode] = useState("template"); 
  const [resumeText, setResumeText] = useState("");
  const [letter, setLetter] = useState("");
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setError("");

    if (mode === "template") {
      // Phase 1: instant, local, no network.
      const result = buildTemplateLetter(fields);
      setLetter(result);
      setSource("template");
      return;
    }

    setLoading(true);
    setLetter("");
    try {
      const result = await generateWithLLM({ ...fields, resumeText });
      setLetter(result);
      setSource("ai");
    } catch (err) {
      setError(err.message || "Something went wrong while generating the letter.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="shell">
      <header className="masthead">
        <div className="masthead-mark">
          <span className="glyph">&amp;</span>
          <div>
            <h1>Letterhead</h1>
            <div className="tagline">AI Cover Letter Generator</div>
          </div>
        </div>
        <div className="masthead-meta">
         AI Cover Letter Generator
          <br />
         
        </div>
      </header>

      <div className="grid">
        <LetterForm
          fields={fields}
          onChange={setFields}
          mode={mode}
          onModeChange={setMode}
          onSubmit={handleSubmit}
          loading={loading}
          onResumeText={setResumeText}
        />

        <div>
          <LetterPreview
            letter={letter}
            loading={loading}
            error={error}
            source={source}
            candidateName={fields.name}
            role={fields.role}
          />
          {error && mode === "ai" && (
            <p className="error-note">
              {error} Meanwhile, switch to <strong>Quick draft</strong> for an instant, key-free result.
            </p>
          )}
        </div>
      </div>

      <footer className="site-foot">
       @all right reserved
      </footer>
    </div>
  );
}
