import ResumeUpload from "./ResumeUpload.jsx";

export default function LetterForm({
  fields,
  onChange,
  mode,
  onModeChange,
  onSubmit,
  loading,
  onResumeText,
}) {
  function update(key) {
    return (e) => onChange({ ...fields, [key]: e.target.value });
  }

  const skillChips = fields.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="panel">
      <p className="panel-title">Candidate details</p>

      <div className="mode-toggle">
        <button
          type="button"
          className={mode === "template" ? "active" : ""}
          onClick={() => onModeChange("template")}
        >
          Quick draft
        </button>
        <button
          type="button"
          className={mode === "ai" ? "active" : ""}
          onClick={() => onModeChange("ai")}
        >
          AI draft
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="field">
          <label htmlFor="name">Candidate name</label>
          <input id="name" type="text" value={fields.name} onChange={update("name")} placeholder="Aditi Sharma" />
        </div>

        <div className="field">
          <label htmlFor="role">Job role</label>
          <input id="role" type="text" value={fields.role} onChange={update("role")} placeholder="Frontend Engineer" />
        </div>

        <div className="field">
          <label htmlFor="company">Target company</label>
          <input id="company" type="text" value={fields.company} onChange={update("company")} placeholder="Prodesk" />
        </div>

        <div className="field">
          <label htmlFor="skills">Key skills</label>
          <input
            id="skills"
            type="text"
            value={fields.skills}
            onChange={update("skills")}
            placeholder="React, TypeScript, REST APIs"
          />
          {skillChips.length > 0 && (
            <div className="chip-row">
              {skillChips.map((s, i) => (
                <span className="chip" key={i}>{s}</span>
              ))}
            </div>
          )}
          <span className="hint">Comma-separated</span>
        </div>

        {mode === "ai" && (
          <>
            <div className="field">
              <label htmlFor="jd">Job description (optional)</label>
              <textarea
                id="jd"
                value={fields.jobDescription}
                onChange={update("jobDescription")}
                placeholder="Paste the job posting for a more tailored letter"
              />
            </div>
            <ResumeUpload onExtracted={onResumeText} />
          </>
        )}

        <button className="btn-seal" type="submit" disabled={loading}>
          {loading ? "Drafting…" : mode === "ai" ? "Generate with AI" : "Draft letter"}
        </button>
      </form>
    </div>
  );
}
