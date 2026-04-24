"use client";
import {
  BookOpen, Target, Settings2, Sparkles,
  FileText, Loader2, AlignLeft, ListChecks,
  ClipboardList, Play, GitFork,
} from "lucide-react";
import { AnalysisResult } from "../types";
import { ActionBar, CopyButton, DownloadButton, WhatsAppShareButton } from "./ActionButtons";

interface Props {
  text: string; setText: (v: string) => void;
  level: string; setLevel: (v: string) => void;
  goal: string; setGoal: (v: string) => void;
  loading: boolean;
  inputWarning: string | null;
  pdfText: string | null;
  handleAnalyze: () => void;
  result: AnalysisResult | null;
  onStartQuiz: () => void;
  onViewMindmap: () => void;
}

// ── Reusable section card ───────────────────────────────────────────────────
function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-md p-6 shadow-sm transition-all ${className}`}>
      {children}
    </div>
  );
}

export default function HomeView({
  text, setText, level, setLevel, goal, setGoal,
  loading, inputWarning, pdfText,
  handleAnalyze, result, onStartQuiz, onViewMindmap,
}: Props) {
  return (
    <div className="space-y-6">

      {/* ── Input Card ─────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/80 shadow-lg overflow-hidden animate-fade-up"
        style={{ background: "rgba(255,255,255,0.82)", backdropFilter: "blur(20px)" }}>

        {/* Card header strip */}
        <div className="px-8 py-5 border-b border-slate-100/80"
          style={{ background: "linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)" }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-100">
              <BookOpen className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800">Study Notes</h1>
              <p className="text-xs text-slate-400 mt-0.5">Paste your notes below, or upload a PDF using the button above</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

            {/* Textarea — takes 3/5 */}
            <div className="md:col-span-3 space-y-3">
              {pdfText && (
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5">
                  <FileText className="w-3.5 h-3.5" />
                  PDF content loaded — textarea disabled
                </div>
              )}
              <textarea
                id="study-notes"
                rows={8}
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={!!pdfText}
                placeholder={pdfText
                  ? "PDF content is being used — clear it from the header to type here…"
                  : "Paste your lecture notes, textbook excerpts, or any study material here…"}
                className={`w-full resize-none rounded-xl border px-4 py-3.5 text-sm leading-relaxed
                  placeholder:text-slate-400 focus:ring-4 outline-none transition-all shadow-sm
                  disabled:opacity-40 disabled:cursor-not-allowed
                  ${inputWarning
                    ? "border-amber-400 bg-amber-50/40 focus:border-amber-500 focus:ring-amber-500/10"
                    : "border-slate-200 bg-white focus:border-indigo-400 focus:ring-indigo-500/10"
                  }`}
              />
              {inputWarning && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 font-medium">
                  ⚠️ {inputWarning}
                </div>
              )}
            </div>

            {/* Preferences — takes 2/5 */}
            <div className="md:col-span-2 flex flex-col gap-5">
              <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50/60 p-5 space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Settings2 className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-sm font-bold text-slate-800">Preferences</h3>
                  </div>
                  <p className="text-xs text-slate-400">Customize how AI helps you study</p>
                </div>

                {/* Difficulty */}
                <div className="space-y-1.5">
                  <label htmlFor="difficulty" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Difficulty Level
                  </label>
                  <div className="relative">
                    <select id="difficulty" value={level} onChange={(e) => setLevel(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-9 text-sm font-medium text-slate-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer transition-all">
                      <option value="Beginner">Beginner — Foundational</option>
                      <option value="Intermediate">Intermediate — Core Concepts</option>
                      <option value="Advanced">Advanced — Deep Dive</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Goal */}
                <div className="space-y-1.5">
                  <label htmlFor="goal" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Study Goal
                  </label>
                  <div className="relative">
                    <select id="goal" value={goal} onChange={(e) => setGoal(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-9 text-sm font-medium text-slate-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer transition-all">
                      <option value="Exam">Exam Preparation</option>
                      <option value="Concept Clarity">Concept Clarity</option>
                      <option value="Revision">Quick Revision</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analyze button */}
              <button
                id="analyze-btn"
                type="button"
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 rounded-xl px-4 py-4 text-sm font-bold text-white transition-all active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)",
                  boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
                }}
                onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(99,102,241,0.5)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(99,102,241,0.35)"; }}
              >
                {loading
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing…</>
                  : <><Target className="w-5 h-5" /> Analyze Notes</>
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Loading skeletons ───────────────────────────────────────────────── */}
      {loading && (
        <div className="space-y-3 animate-fade-in">
          {[
            { label: "Generating explanation…",   pct: "65%" },
            { label: "Identifying key points…",   pct: "75%" },
            { label: "Writing summary…",           pct: "55%" },
            { label: "Creating quiz questions…",  pct: "80%" },
          ].map(({ label, pct }, i) => (
            <div key={i} className="flex items-center gap-4 bg-white/80 border border-slate-200/70 rounded-2xl px-6 py-4 shadow-sm">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-400 shrink-0" />
              <div className="flex-1 space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full animate-pulse"
                    style={{ width: pct, background: "linear-gradient(90deg, #a5b4fc, #818cf8)" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Results ────────────────────────────────────────────────────────── */}
      {result && !loading && (
        <div className="space-y-4 animate-fade-up">

          {/* Explanation */}
          <SectionCard className="stagger-1 animate-fade-up">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <AlignLeft className="w-4 h-4 text-blue-500" />
              </div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Explanation</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{result.explanation}</p>
          </SectionCard>

          {/* Key Points */}
          <SectionCard className="stagger-2 animate-fade-up">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-violet-50 rounded-lg">
                <ListChecks className="w-4 h-4 text-violet-500" />
              </div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Key Points</h2>
            </div>
            <ul className="space-y-2.5">
              {result.key_points.map((pt, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                    style={{ background: "linear-gradient(135deg, #818cf8, #a78bfa)" }} />
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* Summary */}
          <div className="rounded-2xl border border-indigo-100 p-6 shadow-sm stagger-3 animate-fade-up"
            style={{ background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)" }}>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-100 rounded-lg">
                  <ClipboardList className="w-4 h-4 text-indigo-600" />
                </div>
                <h2 className="text-sm font-bold text-indigo-800 uppercase tracking-wider">Summary</h2>
              </div>
              <ActionBar>
                <CopyButton label="Copy Summary" getText={() => result.summary} />
                <WhatsAppShareButton getText={() => result.summary} />
              </ActionBar>
            </div>
            <p className="text-sm text-indigo-900 leading-relaxed">{result.summary}</p>
          </div>

          {/* Download Notes */}
          <div className="flex items-center gap-2 px-1">
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
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1 stagger-4 animate-fade-up">
            <button
              id="start-quiz-btn"
              type="button"
              onClick={onStartQuiz}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-bold text-white transition-all active:scale-[0.97] shadow-lg"
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)",
                boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
              }}
            >
              <Play className="w-5 h-5" /> Start Quiz
            </button>
            <button
              id="view-mindmap-btn"
              type="button"
              onClick={onViewMindmap}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-indigo-200 active:scale-[0.97] transition-all shadow-sm"
            >
              <GitFork className="w-5 h-5 text-indigo-500" /> View Mindmap
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
