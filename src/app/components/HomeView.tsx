"use client";
import { useRef } from "react";
import {
  Upload, BookOpen, Target, Settings2, Sparkles,
  FileText, Loader2, CheckCircle2, XCircle,
  AlignLeft, ListChecks, ClipboardList, X, Play, GitFork,
} from "lucide-react";
import { AnalysisResult } from "../types";
import { ActionBar, CopyButton, DownloadButton, WhatsAppShareButton } from "./ActionButtons";

interface Props {
  text: string; setText: (v: string) => void;
  level: string; setLevel: (v: string) => void;
  goal: string; setGoal: (v: string) => void;
  loading: boolean;
  inputWarning: string | null;
  pdfFile: File | null; pdfText: string | null;
  pdfParsing: boolean; pdfError: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removePdf: () => void;
  handleAnalyze: () => void;
  result: AnalysisResult | null;
  onStartQuiz: () => void;
  onViewMindmap: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export default function HomeView({
  text, setText, level, setLevel, goal, setGoal,
  loading, inputWarning, pdfFile, pdfText, pdfParsing, pdfError,
  handleFileChange, removePdf, handleAnalyze, result,
  onStartQuiz, onViewMindmap, fileInputRef,
}: Props) {
  return (
    <div className="space-y-8">
      {/* Input Card */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-xl rounded-3xl p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Inputs */}
          <div className="space-y-5">
            {/* PDF Upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-500" /> Upload PDF
              </label>
              {pdfFile && pdfText && (
                <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-green-300 bg-green-50 text-sm">
                  <div className="flex items-center gap-2 text-green-700 font-medium min-w-0">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" />
                    <span className="truncate">{pdfFile.name}</span>
                  </div>
                  <button onClick={removePdf} className="text-slate-400 hover:text-red-500 transition-colors shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {pdfParsing && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-600">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-500" /> Extracting text...
                </div>
              )}
              {pdfError && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-red-200 bg-red-50 text-sm text-red-700">
                  <XCircle className="w-4 h-4 shrink-0" /> {pdfError}
                </div>
              )}
              {!pdfFile && !pdfParsing && (
                <div className="group relative flex flex-col items-center justify-center py-6 px-4 border-2 border-dashed border-slate-300 rounded-2xl hover:border-indigo-400 transition-colors cursor-pointer bg-slate-50/50">
                  <div className="p-3 bg-white shadow-sm rounded-full mb-2 group-hover:scale-110 transition-all">
                    <FileText className="w-5 h-5 text-indigo-500" />
                  </div>
                  <p className="text-sm text-slate-600 mb-1">
                    <span className="text-indigo-600 font-semibold">Click to upload</span> or drag & drop
                  </p>
                  <p className="text-xs text-slate-400">PDF up to 10MB</p>
                  <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              )}
            </div>
            {pdfText && (
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2">
                <FileText className="w-3.5 h-3.5" /> Using uploaded PDF content
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="flex-grow border-t border-slate-200" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">or</span>
              <div className="flex-grow border-t border-slate-200" />
            </div>
            {/* Textarea */}
            <div className="space-y-2">
              <label htmlFor="study-notes" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" /> Paste Study Notes
              </label>
              <textarea
                id="study-notes" rows={6} value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={!!pdfText}
                placeholder={pdfText ? "PDF content is being used…" : "Paste your text, concepts, or questions here..."}
                className={`w-full resize-none rounded-2xl border px-4 py-3 text-sm placeholder:text-slate-400 focus:ring-4 outline-none transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed ${inputWarning ? "border-amber-400 bg-amber-50/50" : "border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-indigo-500/10"}`}
              />
              {inputWarning && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 font-medium">
                  ⚠️ {inputWarning}
                </div>
              )}
            </div>
          </div>

          {/* Right: Preferences */}
          <div className="flex flex-col justify-between bg-slate-50/50 border border-slate-100 rounded-2xl p-6 space-y-6">
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-1">
                  <Settings2 className="w-5 h-5 text-indigo-500" /> Study Preferences
                </h3>
                <p className="text-sm text-slate-500">Customize how the AI helps you study.</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="difficulty" className="text-sm font-semibold text-slate-700">Difficulty Level</label>
                <div className="relative">
                  <select id="difficulty" value={level} onChange={(e) => setLevel(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none cursor-pointer">
                    <option value="Beginner">Beginner (Foundational)</option>
                    <option value="Intermediate">Intermediate (Core Concepts)</option>
                    <option value="Advanced">Advanced (Deep Dive)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="goal" className="text-sm font-semibold text-slate-700">Study Goal</label>
                <div className="relative">
                  <select id="goal" value={goal} onChange={(e) => setGoal(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none cursor-pointer">
                    <option value="Exam">Exam Preparation</option>
                    <option value="Concept Clarity">Concept Clarity</option>
                    <option value="Revision">Quick Revision</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                  </div>
                </div>
              </div>
            </div>
            <button id="analyze-btn" type="button" onClick={handleAnalyze} disabled={loading || pdfParsing}
              className="w-full flex justify-center items-center gap-2 rounded-xl bg-indigo-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 focus:outline-none active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : <><Target className="w-5 h-5" /> Analyze</>}
            </button>
          </div>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {["Generating explanation...", "Identifying key points...", "Writing summary...", "Creating quiz questions..."].map((label, i) => (
            <div key={i} className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl px-6 py-5 shadow-sm">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-400 shrink-0" />
              <div className="flex-1 space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-200 rounded-full animate-pulse" style={{ width: `${60 + i * 10}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-5">
          {/* Explanation */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-3">
              <AlignLeft className="w-5 h-5 text-indigo-500" /> Explanation
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">{result.explanation}</p>
          </div>

          {/* Key Points */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-3">
              <ListChecks className="w-5 h-5 text-indigo-500" /> Key Points
            </h2>
            <ul className="space-y-2">
              {result.key_points.map((pt, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1 w-2 h-2 rounded-full bg-indigo-500 shrink-0" /> {pt}
                </li>
              ))}
            </ul>
          </div>

          {/* Summary */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h2 className="text-base font-bold text-indigo-800 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-indigo-500" /> Summary
              </h2>
              <ActionBar>
                <CopyButton label="Copy Summary" getText={() => result.summary} />
                <WhatsAppShareButton getText={() => result.summary} />
              </ActionBar>
            </div>
            <p className="text-sm text-indigo-900 leading-relaxed">{result.summary}</p>
          </div>

          {/* Download Notes */}
          <ActionBar>
            <DownloadButton
              label="Download Notes"
              filename="notes.txt"
              getContent={() => [
                "=== SUMMARY ===",
                result.summary,
                "",
                "=== KEY POINTS ===",
                result.key_points.map((pt, i) => `${i + 1}. ${pt}`).join("\n"),
                "",
                "=== EXPLANATION ===",
                result.explanation,
              ].join("\n")}
            />
          </ActionBar>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button id="start-quiz-btn" type="button" onClick={onStartQuiz}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 active:scale-[0.98] transition-all">
              <Play className="w-5 h-5" /> Start Quiz
            </button>
            <button id="view-mindmap-btn" type="button" onClick={onViewMindmap}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all shadow-sm">
              <GitFork className="w-5 h-5 text-indigo-500" /> View Mindmap
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
