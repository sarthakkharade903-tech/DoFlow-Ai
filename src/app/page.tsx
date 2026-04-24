"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Upload, BookOpen, Target, Settings2,
  Sparkles, FileText, Loader2, CheckCircle2,
  XCircle, ListChecks, AlignLeft, ClipboardList,
  X, GitFork, LayoutList
} from "lucide-react";

const MindmapView = dynamic(() => import("./components/MindmapView"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
    </div>
  ),
});

interface QuizItem {
  question: string;
  options: string[];
  answer: string;
}

interface AnalysisResult {
  explanation: string;
  key_points: string[];
  summary: string;
  quiz: QuizItem[];
}

export default function Home() {
  const [text, setText] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [goal, setGoal] = useState("Exam");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputWarning, setInputWarning] = useState<string | null>(null);

  // PDF state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [pdfParsing, setPdfParsing] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quiz state
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // View toggle
  const [viewMode, setViewMode] = useState<"notes" | "mindmap">("notes");

  // 80/20 Focus Mode
  const [focusMode, setFocusMode] = useState(false);

  // ── PDF Upload ────────────────────────────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfFile(file);
    setPdfText(null);
    setPdfError(null);
    setPdfParsing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse-pdf", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok || data.error) {
        setPdfError(data.error || "Failed to parse PDF.");
        setPdfFile(null);
      } else {
        setPdfText(data.text);
      }
    } catch {
      setPdfError("Failed to upload PDF. Please try again.");
      setPdfFile(null);
    } finally {
      setPdfParsing(false);
    }
  };

  const removePdf = () => {
    setPdfFile(null);
    setPdfText(null);
    setPdfError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Analyze ───────────────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    const contentToSend = pdfText || text.trim();
    if (!contentToSend) {
      setInputWarning("Please paste some notes or upload a PDF before analyzing.");
      return;
    }
    setInputWarning(null);

    setLoading(true);
    setResult(null);
    setError(null);
    setSelected({});
    setSubmitted(false);
    setScore(null);
    setViewMode("notes");
    setFocusMode(false);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: contentToSend, level, goal }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.details || data.error);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Quiz Submit ───────────────────────────────────────────────────────────
  const handleSubmitQuiz = () => {
    if (!result) return;
    let correct = 0;
    result.quiz.forEach((q, i) => {
      if (selected[i] && selected[i] === q.answer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  const getOptionStyle = (qi: number, opt: string, answer: string) => {
    if (!submitted) {
      return selected[qi] === opt
        ? "border-indigo-500 bg-indigo-50 text-indigo-800 ring-2 ring-indigo-200"
        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50";
    }
    // Correct answer — always highlight green
    if (opt === answer) return "border-green-500 bg-green-50 text-green-800 font-semibold ring-2 ring-green-200";
    // User picked this but it's wrong
    if (selected[qi] === opt && opt !== answer) return "border-red-400 bg-red-50 text-red-700 ring-2 ring-red-200";
    // Unchosen, incorrect options — dim them
    return "border-slate-100 bg-slate-50 text-slate-400 opacity-60";
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100">
      <div className="fixed inset-0 -z-10 bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),transparent)]" />
      </div>

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">

        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-600 rounded-2xl ring-1 ring-indigo-200 shadow-sm mb-1">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-500 bg-clip-text text-transparent">
              DoFlow
            </span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Turn notes into understanding and quizzes
          </p>
        </div>

        {/* Form Card */}
        <div className="w-full bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-xl rounded-3xl p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Left: Inputs */}
            <div className="space-y-6">

              {/* File Upload Zone */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-500" /> Upload Document (PDF)
                </label>

                {/* Parsed successfully */}
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

                {/* Parsing */}
                {pdfParsing && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-600">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                    Extracting text from PDF...
                  </div>
                )}

                {/* PDF Error */}
                {pdfError && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-red-200 bg-red-50 text-sm text-red-700">
                    <XCircle className="w-4 h-4 shrink-0" />
                    {pdfError}
                  </div>
                )}

                {/* Drop zone (hide when file loaded) */}
                {!pdfFile && !pdfParsing && (
                  <div className="group relative flex flex-col items-center justify-center py-7 px-4 border-2 border-dashed border-slate-300 rounded-2xl hover:border-indigo-400 hover:bg-slate-50 transition-colors cursor-pointer bg-slate-50/50">
                    <div className="p-3 bg-white shadow-sm rounded-full mb-3 group-hover:scale-110 transition-all">
                      <FileText className="w-6 h-6 text-indigo-500" />
                    </div>
                    <p className="text-sm text-slate-600 mb-1">
                      <span className="text-indigo-600 font-semibold">Click to upload</span> or drag & drop
                    </p>
                    <p className="text-xs text-slate-400">PDF up to 10MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* "Using PDF" notice */}
              {pdfText && (
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2">
                  <FileText className="w-3.5 h-3.5" />
                  Using uploaded PDF content
                </div>
              )}

              {/* Divider */}
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
                  id="study-notes"
                  rows={6}
                  value={text}
                  onChange={(e) => { setText(e.target.value); setInputWarning(null); }}
                  disabled={!!pdfText}
                  placeholder={pdfText ? "PDF content is being used…" : "Paste your text, concepts, or questions here..."}
                  className={`w-full resize-none rounded-2xl border px-4 py-3 text-sm placeholder:text-slate-400 focus:ring-4 outline-none transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed ${
                    inputWarning
                      ? "border-amber-400 bg-amber-50/50 focus:border-amber-400 focus:ring-amber-400/10"
                      : "border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-indigo-500/10"
                  }`}
                />
              </div>

              {/* Inline input warning */}
              {inputWarning && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 font-medium">
                  <svg className="w-4 h-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  {inputWarning}
                </div>
              )}
            </div>

            {/* Right: Preferences + Button */}
            <div className="flex flex-col justify-between bg-slate-50/50 border border-slate-100 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-1">
                    <Settings2 className="w-5 h-5 text-indigo-500" /> Study Preferences
                  </h3>
                  <p className="text-sm text-slate-500">Customize how the AI helps you study.</p>
                </div>

                {/* Difficulty */}
                <div className="space-y-2">
                  <label htmlFor="difficulty" className="text-sm font-semibold text-slate-700">Difficulty Level</label>
                  <div className="relative">
                    <select
                      id="difficulty"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                    >
                      <option value="Beginner">Beginner (Foundational)</option>
                      <option value="Intermediate">Intermediate (Core Concepts)</option>
                      <option value="Advanced">Advanced (Deep Dive)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Goal */}
                <div className="space-y-2">
                  <label htmlFor="goal" className="text-sm font-semibold text-slate-700">Study Goal</label>
                  <div className="relative">
                    <select
                      id="goal"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                    >
                      <option value="Exam">Exam Preparation</option>
                      <option value="Concept Clarity">Concept Clarity</option>
                      <option value="Revision">Quick Revision</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <button
                id="analyze-btn"
                type="button"
                onClick={handleAnalyze}
                disabled={loading || pdfParsing}
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-indigo-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/40 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
                ) : (
                  <><Target className="w-5 h-5" /> Analyze</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Global Error */}
        {error && (
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700 font-medium shadow-sm">
            <XCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
            <div>
              <p className="font-semibold">Something went wrong</p>
              <p className="mt-0.5 font-normal text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="mt-10 space-y-4">
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
        {result && (
          <div className="mt-10 space-y-6">

            {/* Toolbar: View Toggle + Focus Mode */}
            <div className="flex flex-wrap items-center justify-between gap-3">

              {/* View toggle pill */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  id="notes-view-btn"
                  type="button"
                  onClick={() => setViewMode("notes")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    viewMode === "notes"
                      ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <LayoutList className="w-4 h-4" />
                  Notes View
                </button>
                <button
                  id="mindmap-view-btn"
                  type="button"
                  onClick={() => setViewMode("mindmap")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    viewMode === "mindmap"
                      ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <GitFork className="w-4 h-4" />
                  Mindmap View
                </button>
              </div>

              {/* 80/20 Focus Mode button */}
              <button
                id="focus-mode-btn"
                type="button"
                onClick={() => setFocusMode((prev) => !prev)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                  focusMode
                    ? "bg-amber-400 border-amber-400 text-white shadow-md shadow-amber-200"
                    : "bg-white border-amber-300 text-amber-700 hover:bg-amber-50"
                }`}
              >
                <span>⚡</span>
                {focusMode ? "80/20 Mode ON" : "80/20 Focus Mode"}
              </button>
            </div>

            {/* Focus Mode banner */}
            {focusMode && (
              <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3">
                <span className="text-lg">⚡</span>
                <div>
                  <p className="text-sm font-bold text-amber-800">Focus Mode Active</p>
                  <p className="text-xs text-amber-600">Focus on the most important 20% for maximum results</p>
                </div>
                <span className="ml-auto text-xs font-semibold text-amber-500 bg-amber-100 px-2 py-1 rounded-lg">Top 3 only</span>
              </div>
            )}

            {/* ── Mindmap View ─────────────────────────────────────────── */}
            {viewMode === "mindmap" && (
              <MindmapView
                summary={result.summary}
                keyPoints={result.key_points}
              />
            )}

            {/* ── Notes View ───────────────────────────────────────────── */}
            {viewMode === "notes" && (<>

            {/* Explanation — hidden in focus mode */}
            {!focusMode && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-3">
                <AlignLeft className="w-5 h-5 text-indigo-500" /> Explanation
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">{result.explanation}</p>
            </div>
            )}

            {/* Key Points — sliced to 3 in focus mode */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-3">
                <ListChecks className="w-5 h-5 text-indigo-500" /> Key Points
                {focusMode && (
                  <span className="ml-auto text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">Top 3</span>
                )}
              </h2>
              <ul className="space-y-2">
                {(focusMode ? result.key_points.slice(0, 3) : result.key_points).map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-1 w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>

            {/* Summary */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-indigo-800 flex items-center gap-2 mb-3">
                <ClipboardList className="w-5 h-5 text-indigo-500" /> Summary
              </h2>
              <p className="text-sm text-indigo-900 leading-relaxed">{result.summary}</p>
            </div>

            {/* Quiz — sliced to 3 in focus mode */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-indigo-500" /> Quiz
                {focusMode && (
                  <span className="ml-auto text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">Top 3 questions</span>
                )}
              </h2>

              <div className="space-y-8">
                {(focusMode ? result.quiz.slice(0, 3) : result.quiz).map((q, qi) => {
                  const userAnswer = selected[qi];
                  const isCorrect = submitted && userAnswer === q.answer;
                  const isWrong = submitted && userAnswer !== undefined && userAnswer !== q.answer;
                  const isUnanswered = submitted && userAnswer === undefined;

                  return (
                    <div key={qi} className={`rounded-xl p-4 border transition-all ${
                      !submitted
                        ? "border-transparent"
                        : isCorrect
                        ? "border-green-200 bg-green-50/40"
                        : "border-red-200 bg-red-50/30"
                    }`}>
                      {/* Question header */}
                      <div className="flex items-start gap-2 mb-3">
                        {submitted && (
                          <span className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                            isCorrect ? "bg-green-500" : "bg-red-400"
                          }`}>
                            {isCorrect
                              ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                              : <XCircle className="w-3.5 h-3.5 text-white" />}
                          </span>
                        )}
                        <p className="text-sm font-semibold text-slate-800">
                          Q{qi + 1}. {q.question}
                        </p>
                      </div>

                      {/* Options */}
                      <div className="space-y-2">
                        {q.options.map((opt, oi) => {
                          const optCorrect = submitted && opt === q.answer;
                          const optWrong = submitted && selected[qi] === opt && opt !== q.answer;
                          return (
                            <button
                              key={oi}
                              type="button"
                              disabled={submitted}
                              onClick={() => !submitted && setSelected((prev) => ({ ...prev, [qi]: opt }))}
                              className={`w-full text-left text-sm px-4 py-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                                getOptionStyle(qi, opt, q.answer)
                              }`}
                            >
                              <span>{opt}</span>
                              {optCorrect && <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />}
                              {optWrong && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Correct answer hint — shown on wrong or unanswered */}
                      {submitted && (isWrong || isUnanswered) && (
                        <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-100 border border-green-200 px-3 py-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                          <p className="text-xs font-semibold text-green-800">
                            Correct answer: {q.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit button */}
              {!submitted && (
                <button
                  id="submit-quiz-btn"
                  type="button"
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(selected).length < (focusMode ? Math.min(3, result.quiz.length) : result.quiz.length)}
                  className="mt-8 w-full flex justify-center items-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-bold text-white hover:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-500/30 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit Quiz
                </button>
              )}

              {/* Score banner */}
              {submitted && score !== null && (
                <div className={`mt-8 rounded-2xl px-6 py-5 text-center border ${
                  score === result.quiz.length
                    ? "bg-green-50 border-green-200"
                    : score >= Math.ceil(result.quiz.length / 2)
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-red-50 border-red-200"
                }`}>
                  <p className={`text-3xl font-extrabold tracking-tight ${
                    score === result.quiz.length
                      ? "text-green-700"
                      : score >= Math.ceil(result.quiz.length / 2)
                      ? "text-yellow-700"
                      : "text-red-600"
                  }`}>
                    {score} / {result.quiz.length}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-600">
                    {score === result.quiz.length
                      ? "🎉 Perfect score! Excellent work."
                      : score >= Math.ceil(result.quiz.length / 2)
                      ? "👍 Good job! Review the ones you missed."
                      : "📚 Keep studying — you'll get there!"}
                  </p>
                </div>
              )}
            </div>
            </>) /* end notes view */}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/60 backdrop-blur-sm py-5 mt-8">
        <p className="text-center text-xs text-slate-400 font-medium tracking-wide">
          Built for Hackathon &nbsp;·&nbsp; AI Study Companion
        </p>
      </footer>
    </div>
  );
}
