"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Sparkles, Loader2, LayoutList, GitFork, BookOpen, ArrowLeft, FileUp, FileCheck2, X } from "lucide-react";
import { AnalysisResult, View } from "./types";
import HomeView from "./components/HomeView";
import QuizView from "./components/QuizView";
import ReviseView from "./components/ReviseView";

const MindmapView = dynamic(() => import("./components/MindmapView"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 rounded-2xl border border-slate-200 bg-white/70 shadow-sm">
      <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
    </div>
  ),
});

export default function Home() {
  // Input
  const [text, setText] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [goal, setGoal] = useState("Exam");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputWarning, setInputWarning] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // PDF
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [pdfParsing, setPdfParsing] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Navigation
  const [view, setView] = useState<View>("home");

  // Quiz
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);

  // ── PDF Upload ─────────────────────────────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfFile(file); setPdfText(null); setPdfError(null); setPdfParsing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/parse-pdf", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || data.error) { setPdfError(data.error || "Failed to parse PDF."); setPdfFile(null); }
      else setPdfText(data.text);
    } catch { setPdfError("Failed to upload PDF."); setPdfFile(null); }
    finally { setPdfParsing(false); }
  };

  const removePdf = () => {
    setPdfFile(null); setPdfText(null); setPdfError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Analyze ────────────────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    const contentToSend = pdfText || text.trim();
    if (!contentToSend) { setInputWarning("Please paste some notes or upload a PDF before analyzing."); return; }
    setInputWarning(null);
    setLoading(true); setResult(null); setError(null);
    setSelected({}); setSubmitted(false); setScore(null); setWeakTopics([]);
    setView("home");
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
      setError(err.message || "Something went wrong.");
    } finally { setLoading(false); }
  };

  // ── Quiz ───────────────────────────────────────────────────────────────────
  const extractKeywords = (t: string): string[] => {
    const stop = new Set(["what","which","when","where","does","this","that","with","from","have","will","been","they","their","about","used","most","than","more","some","into","also","each"]);
    return t.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/)
      .filter((w) => w.length > 4 && !stop.has(w)).slice(0, 4);
  };

  const handleSubmitQuiz = () => {
    if (!result) return;
    let correct = 0;
    const wrongKeywords: string[] = [];
    result.quiz.forEach((q, i) => {
      if (selected[i] && selected[i] === q.answer) correct++;
      else wrongKeywords.push(...extractKeywords(q.question));
    });
    setWeakTopics(Array.from(new Set(wrongKeywords)).slice(0, 3));
    setScore(correct);
    setSubmitted(true);
  };

  const startQuiz = () => {
    setSelected({}); setSubmitted(false); setScore(null); setWeakTopics([]);
    setView("quiz");
  };

  // ── Nav tabs ───────────────────────────────────────────────────────────────
  const tabs: { id: View; label: string; icon: React.ReactNode; disabled: boolean }[] = [
    { id: "home",    label: "Notes",   icon: <LayoutList className="w-4 h-4" />, disabled: false },
    { id: "quiz",    label: "Quiz",    icon: <Sparkles className="w-4 h-4" />,   disabled: !result },
    { id: "revise",  label: "Revise",  icon: <BookOpen className="w-4 h-4" />,   disabled: !submitted || weakTopics.length === 0 },
    { id: "mindmap", label: "Mindmap", icon: <GitFork className="w-4 h-4" />,    disabled: !result },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen font-sans text-slate-800 selection:bg-indigo-100"
      style={{ background: "linear-gradient(135deg, #f5f6fa 0%, #eef0fb 50%, #f0f4ff 100%)" }}>

      {/* Ambient background orbs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #a5b4fc 0%, transparent 70%)" }} />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #c4b5fd 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-10"
          style={{ background: "radial-gradient(ellipse, #818cf8 0%, transparent 70%)" }} />
      </div>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 border-b border-white/60"
        style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Brand + tagline */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-2 rounded-xl ring-1 ring-indigo-200"
              style={{ background: "linear-gradient(135deg, #eef2ff, #e0e7ff)" }}>
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight"
                style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                DoFlow
              </span>
              <p className="text-[10px] font-medium text-slate-400 leading-none mt-0.5 hidden sm:block">
                Turn notes into understanding
              </p>
            </div>
          </div>

          {/* Right side: PDF button + Nav */}
          <div className="flex items-center gap-3">

            {/* PDF Upload button */}
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
              />
              {pdfText ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-green-200 bg-green-50 text-green-700">
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>PDF loaded</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removePdf(); }}
                    className="ml-1 text-green-500 hover:text-red-500 transition-colors z-20 relative"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : pdfParsing ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-indigo-200 bg-indigo-50 text-indigo-600">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Parsing…</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-all cursor-pointer shadow-sm">
                  <FileUp className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Upload PDF</span>
                  <span className="sm:hidden">PDF</span>
                </div>
              )}
            </div>

            {/* Nav tabs — only after result */}
            {result && (
              <nav className="flex items-center gap-0.5 p-1 rounded-xl border border-slate-200/80 bg-white/70 shadow-sm">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    disabled={tab.disabled}
                    onClick={() => !tab.disabled && setView(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      view === tab.id
                        ? "text-white shadow-sm"
                        : tab.disabled
                        ? "text-slate-300 cursor-not-allowed"
                        : "text-slate-500 hover:text-slate-700 hover:bg-white/80"
                    }`}
                    style={view === tab.id
                      ? { background: "linear-gradient(135deg, #6366f1, #7c3aed)" }
                      : {}}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </nav>
            )}
          </div>
        </div>

        {/* PDF error strip */}
        {pdfError && (
          <div className="border-t border-red-100 bg-red-50 px-4 py-2 text-center text-xs text-red-600 font-medium">
            ⚠ {pdfError} — please try another file.
          </div>
        )}
      </header>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-4 py-10">

        {/* Global error */}
        {error && (
          <div className="mb-6 animate-fade-up flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/80 px-6 py-4 text-sm text-red-700 font-medium shadow-sm">
            <span className="text-red-400 mt-0.5 text-base">✕</span>
            <div>
              <p className="font-bold">Something went wrong</p>
              <p className="mt-0.5 font-normal text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* HOME VIEW */}
        {view === "home" && (
          <HomeView
            text={text} setText={(v) => { setText(v); setInputWarning(null); }}
            level={level} setLevel={setLevel}
            goal={goal} setGoal={setGoal}
            loading={loading} inputWarning={inputWarning}
            pdfText={pdfText}
            handleAnalyze={handleAnalyze} result={result}
            onStartQuiz={startQuiz}
            onViewMindmap={() => setView("mindmap")}
          />
        )}

        {/* QUIZ VIEW */}
        {view === "quiz" && result && (
          <QuizView
            quiz={result.quiz}
            selected={selected} setSelected={setSelected}
            submitted={submitted} score={score}
            weakTopics={weakTopics}
            handleSubmitQuiz={handleSubmitQuiz}
            onRevise={() => setView("revise")}
            onBack={() => setView("home")}
          />
        )}

        {/* REVISE VIEW */}
        {view === "revise" && result && weakTopics.length > 0 && (
          <ReviseView
            explanation={result.explanation}
            key_points={result.key_points}
            weakTopics={weakTopics}
            onBack={() => setView("home")}
          />
        )}

        {/* MINDMAP VIEW */}
        {view === "mindmap" && result && (
          <div className="space-y-5 animate-fade-up">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setView("home")}
                className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Notes
              </button>
            </div>
            <MindmapView
              summary={result.summary}
              keyPoints={result.key_points}
              explanation={result.explanation}
            />
          </div>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/60 py-6 mt-4"
        style={{ background: "rgba(255,255,255,0.4)", backdropFilter: "blur(10px)" }}>
        <p className="text-center text-xs text-slate-400 font-medium tracking-wide">
          Built for Hackathon &nbsp;·&nbsp; DoFlow AI Study Companion &nbsp;·&nbsp;
          <span className="text-indigo-400">✦</span>
        </p>
      </footer>
    </div>
  );
}
