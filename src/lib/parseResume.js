/**
 * parseResume.js
 * ----------------------------------------------------------------
 * Phase 3 — File Parsing (Priority 2):
 * Extracts raw text from an uploaded PDF resume entirely in the
 * browser using pdfjs-dist, so no backend/upload endpoint is
 * needed. The extracted text is later appended to the LLM payload
 * in generateCoverLetter.js for dynamic personalization.
 * ----------------------------------------------------------------
 */
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export async function extractTextFromPdf(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  let fullText = "";
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    fullText += pageText + "\n";
  }

  return fullText.trim();
}
