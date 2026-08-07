import { useRef, useState } from "react";
import { extractTextFromPdf } from "../lib/parseResume.js";

export default function ResumeUpload({ onExtracted }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("idle"); // idle | reading | done | error
  const [dragging, setDragging] = useState(false);

  async function handleFile(file) {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setStatus("error");
      setFileName("Please upload a PDF file.");
      return;
    }
    setFileName(file.name);
    setStatus("reading");
    try {
      const text = await extractTextFromPdf(file);
      onExtracted(text);
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
      onExtracted("");
    }
  }

  return (
    <div className="field">
      <label htmlFor="resume">Resume (optional)</label>
      <div
        className={`dropzone${dragging ? " drag" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
      >
        <input
          id="resume"
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <div className="dz-label">
          {status === "reading"
            ? "Reading resume…"
            : "Drop a PDF resume here, or click to browse"}
        </div>
        {fileName && status !== "reading" && (
          <div className="dz-file">
            {status === "done" ? "✓ " : status === "error" ? "✕ " : ""}
            {fileName}
          </div>
        )}
      </div>
      <span className="hint">Parsed locally in your browser — text is only sent to the LLM you configure.</span>
    </div>
  );
}
