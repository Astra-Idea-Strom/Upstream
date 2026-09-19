---
name: document-processing
description: >-
  Document parsing and extraction: PDF text extraction, table parsing, structured invoice processing, and markdown conversion. Use when parsing PDF documents, extracting tabular data from reports, ingesting invoices, or normalizing file formats. Not for audio or image-only processing (that is audio-speech-processing or computer-vision-multimodal).
---

# Document Processing: PDF Ingestion, Layout Extraction & ATS Analysis

## 1. Core Document Processing Invariants

1. **Format-Agnostic Normalization**: Ingested documents (PDF, DOCX, TXT) must be normalized into a standard intermediate document schema (pages, sections, headings, tables, metadata) before downstream processing.
2. **Handle Multi-Column & Table Layouts**: Simple line-by-line text extraction scrambles two-column documents. Always use bounding-box-aware or layout-preserving extraction tools (e.g. `pdfjs-dist`, `pypdf`, `pdfplumber`).
3. **Robust Sanitization on Ingestion**: Strip active JavaScript, embedded macros, and form submission actions from untrusted PDFs before rendering or parsing.
4. **Structured Information Extraction**: When parsing unstructured documents (resumes, contracts, medical records), enforce strict schema validation on extracted fields using Zod or Pydantic.

---

## 2. Key Implementation Patterns

### A. PDF Text & Metadata Extraction (Node.js)
```typescript
import pdf from "pdf-parse";
import fs from "fs/promises";

export interface ParsedDocument {
  pageCount: number;
  text: string;
  info: Record<string, any>;
}

export async function parsePdfBuffer(buffer: Buffer): Promise<ParsedDocument> {
  const data = await pdf(buffer, {
    // Custom page rendering to preserve paragraph separation
    pagerender: (pageData) => {
      return pageData.getTextContent().then((textContent) => {
        let lastY: number | null = null;
        let text = "";
        for (const item of textContent.items as any[]) {
          if (lastY === null || Math.abs(item.transform[5] - lastY) < 5) {
            text += item.str + " ";
          } else {
            text += "\n" + item.str + " ";
          }
          lastY = item.transform[5];
        }
        return text;
      });
    }
  });

  return {
    pageCount: data.numpages,
    text: data.text.trim(),
    info: data.info || {}
  };
}
```

### B. ATS Resume Keyword Scoring Engine
```typescript
export interface ATSScoreResult {
  matchPercentage: number;
  matchingKeywords: string[];
  missingKeywords: string[];
}

export function calculateAtsMatch(
  resumeText: string,
  targetSkills: string[]
): ATSScoreResult {
  const normalizedText = resumeText.toLowerCase();
  const matching: string[] = [];
  const missing: string[] = [];

  for (const skill of targetSkills) {
    // Word boundary regex avoids false positives (e.g. "java" in "javascript")
    const regex = new RegExp(`\\b${skill.toLowerCase()}\\b`, "i");
    if (regex.test(normalizedText)) {
      matching.push(skill);
    } else {
      missing.push(skill);
    }
  }

  const matchPercentage = Math.round((matching.length / targetSkills.length) * 100);

  return {
    matchPercentage,
    matchingKeywords: matching,
    missingKeywords: missing
  };
}
```

---

## 3. Anti-Patterns to Avoid

- **Naive Regex Extraction on Raw PDF Streams**: Attempting to extract text from raw PDF byte streams without handling FlateDecode compression or font encoding mappings.
- **Losing Document Spatial Hierarchy**: Flattening documents into a single unstructured string, losing table structures, headers, and bulleted lists.
- **Ignoring Scanned Image PDFs**: Assuming all PDFs contain text streams; scanned documents require OCR (Tesseract / Vision LLM) fallback.

---

## 4. Verification Checklist

- [ ] Multi-page PDFs extract cleanly without memory leaks.
- [ ] Multi-column layouts preserve reading order.
- [ ] ATS keywords match using word boundaries rather than substring inclusion.
- [ ] Scanned document fallback activates when text length is near zero.
