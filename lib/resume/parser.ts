import mammoth from "mammoth";
// @ts-ignore
import pdfParse from "pdf-parse/lib/pdf-parse.js";

export interface ExtractedResumeText {
  text: string;
  charCount: number;
  wordCount: number;
}

/**
 * Extracts raw text from PDF or DOCX file buffer server-side
 */
export async function parseResumeBuffer(
  buffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<ExtractedResumeText> {
  let extractedText = "";

  const isPdf =
    mimeType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf");
  const isDocx =
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword" ||
    fileName.toLowerCase().endsWith(".docx") ||
    fileName.toLowerCase().endsWith(".doc");

  if (isPdf) {
    try {
      const pdfParser = typeof pdfParse === "function" ? pdfParse : pdfParse.default || pdfParse;
      const parsed = await pdfParser(buffer);
      extractedText = parsed.text;
    } catch (err: any) {
      console.error("[pdf-parse] Error:", err);
      extractedText = buffer.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " ");
    }
  } else if (isDocx) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } catch (err: any) {
      console.error("[mammoth] Error:", err);
      throw new Error("Failed to extract text from DOCX file.");
    }
  } else {
    throw new Error(
      "Unsupported file format. Please upload a PDF (.pdf) or Word document (.docx)."
    );
  }

  // Clean extra whitespace
  const cleanedText = extractedText
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!cleanedText || cleanedText.length < 50) {
    throw new Error(
      "Extracted text is empty or too short. Please verify the resume document is not an image scan."
    );
  }

  const words = cleanedText.split(/\s+/).filter(Boolean);

  return {
    text: cleanedText,
    charCount: cleanedText.length,
    wordCount: words.length,
  };
}
