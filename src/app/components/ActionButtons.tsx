"use client";
import { useState } from "react";
import { Copy, Download, Share2, Check } from "lucide-react";

// ── tiny shared helpers ───────────────────────────────────────────────────────

function downloadTxt(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── CopyButton ────────────────────────────────────────────────────────────────

interface CopyButtonProps {
  label: string;
  getText: () => string;
}

export function CopyButton({ label, getText }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={label}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
        border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50
        active:scale-95 shadow-sm"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-500" />
          <span className="text-green-600">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          {label}
        </>
      )}
    </button>
  );
}

// ── DownloadButton ────────────────────────────────────────────────────────────

interface DownloadButtonProps {
  label: string;
  filename: string;
  getContent: () => string;
}

export function DownloadButton({ label, filename, getContent }: DownloadButtonProps) {
  return (
    <button
      type="button"
      onClick={() => downloadTxt(filename, getContent())}
      title={label}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
        border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50
        active:scale-95 shadow-sm"
    >
      <Download className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

// ── WhatsAppShareButton ───────────────────────────────────────────────────────

interface WhatsAppShareButtonProps {
  getText: () => string;
}

export function WhatsAppShareButton({ getText }: WhatsAppShareButtonProps) {
  const handleShare = () => {
    const text = "Check out my study notes:\n\n" + getText();
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      title="Share on WhatsApp"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
        border-green-200 bg-white text-green-700 hover:border-green-400 hover:bg-green-50
        active:scale-95 shadow-sm"
    >
      <Share2 className="w-3.5 h-3.5" />
      Share on WhatsApp
    </button>
  );
}

// ── ActionBar (layout wrapper) ────────────────────────────────────────────────

export function ActionBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      {children}
    </div>
  );
}
