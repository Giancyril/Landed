"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface ResumeUploadZoneProps {
  onUploadSuccess: () => void;
}

export default function ResumeUploadZone({ onUploadSuccess }: ResumeUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function validateFile(selectedFile: File): boolean {
    setError(null);
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    const isValidExt =
      selectedFile.name.endsWith(".pdf") ||
      selectedFile.name.endsWith(".docx") ||
      selectedFile.name.endsWith(".doc");

    if (!validTypes.includes(selectedFile.type) && !isValidExt) {
      setError("Please select a PDF (.pdf) or Word (.docx) document.");
      return false;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File exceeds 5MB limit. Please upload a smaller file.");
      return false;
    }

    return true;
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      if (validateFile(selected)) {
        setFile(selected);
      }
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (validateFile(selected)) {
        setFile(selected);
      }
    }
  }

  async function handleUpload() {
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setSuccess(true);
      setFile(null);
      onUploadSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="card p-6 border-dashed border-2 transition-all duration-200" style={{
      borderColor: dragActive ? "var(--accent-primary)" : "var(--surface-border)",
      background: dragActive ? "var(--accent-subtle)" : "var(--surface-card)"
    }}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className="flex flex-col items-center justify-center text-center p-6 cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.doc"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: "var(--surface-input)" }}>
          <UploadCloud size={24} style={{ color: "var(--accent-primary)" }} />
        </div>

        <h3 className="text-sm font-bold text-[var(--content-primary)] mb-1">
          Upload your Base Resume
        </h3>
        <p className="text-xs text-[var(--content-secondary)] max-w-sm mb-3">
          Drag & drop your PDF or DOCX file here, or click to browse files (Max 5MB)
        </p>

        {file && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface-input)] text-xs font-mono text-[var(--content-primary)] mb-3 border border-[var(--surface-border)]">
            <FileText size={14} className="text-[var(--accent-primary)]" />
            <span>{file.name}</span>
            <span className="text-[var(--content-muted)]">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
          </div>
        )}
      </div>

      {error && (
        <div className="px-4 py-2.5 rounded-lg text-xs flex items-center gap-2 bg-rose-500/10 text-[var(--status-rejected)] border border-rose-500/20 mb-3">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {success && (
        <div className="px-4 py-2.5 rounded-lg text-xs flex items-center gap-2 bg-emerald-500/10 text-[var(--accent-primary)] border border-emerald-500/20 mb-3">
          <CheckCircle2 size={14} />
          Resume uploaded & extracted successfully!
        </div>
      )}

      {file && (
        <div className="flex justify-end pt-2 border-t border-[var(--surface-border)]">
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="btn-primary text-xs py-2 px-5 flex items-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Parsing text & uploading…
              </>
            ) : (
              "Confirm & Upload"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
