"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Sparkles, Loader2, LayoutList, GitFork, BookOpen, ArrowLeft } from "lucide-react";
import { AnalysisResult, View } from "./types";
import HomeView from "./components/HomeView";
import QuizView from "./components/QuizView";
import ReviseView from "./components/ReviseView";

const MindmapView = dynamic(() => import("./components/MindmapView"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 rounded-2xl border border-slate-200 bg-white shadow-sm">
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),transparent)]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl ring-1 ring-indigo-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-500 bg-clip-text text-transparent">
              DoFlow
            </span>
          </div>

          {/* Nav tabs — only after result */}
          {result && (
            <nav className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  disabled={tab.disabled}
                  onClick={() => !tab.disabled && setView(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    view === tab.id
                      ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"
                      : tab.disabled
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </nav>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Global error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700 font-medium shadow-sm">
            <span className="text-red-500 mt-0.5">✕</span>
            <div>
              <p className="font-semibold">Something went wrong</p>
              <p className="mt-0.5 font-normal text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* ── HOME VIEW ─────────────────────────────────────────────────────── */}
        {view === "home" && (
          <HomeView
            text={text} setText={(v) => { setText(v); setInputWarning(null); }}
            level={level} setLevel={setLevel}
            goal={goal} setGoal={setGoal}
            loading={loading} inputWarning={inputWarning}
            pdfFile={pdfFile} pdfText={pdfText}
            pdfParsing={pdfParsing} pdfError={pdfError}
            handleFileChange={handleFileChange} removePdf={removePdf}
            handleAnalyze={handleAnalyze} result={result}
            onStartQuiz={startQuiz}
            onViewMindmap={() => setView("mindmap")}
            fileInputRef={fileInputRef}
          />
        )}

        {/* ── QUIZ VIEW ─────────────────────────────────────────────────────── */}
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

        {/* ── REVISE VIEW ───────────────────────────────────────────────────── */}
        {view === "revise" && result && weakTopics.length > 0 && (
          <ReviseView
            explanation={result.explanation}
            key_points={result.key_points}
            weakTopics={weakTopics}
            onBack={() => setView("home")}
          />
        )}

        {/* ── MINDMAP VIEW ──────────────────────────────────────────────────── */}
        {view === "mindmap" && result && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setView("home")}
                className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Notes
              </button>
            </div>
            <MindmapView summary={result.summary} keyPoints={result.key_points} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/60 backdrop-blur-sm py-5 mt-8">
        <p className="text-center text-xs text-slate-400 font-medium tracking-wide">
          Built for Hackathon &nbsp;·&nbsp; DoFlow AI Study Companion
        </p>
      </footer>
    </div>
  );
}
