"use client";

import { useState } from "react";
import {
  Upload, BookOpen, Target, Settings2,
  Sparkles, FileText, Loader2, CheckCircle2,
  XCircle, ListChecks, AlignLeft, ClipboardList
} from "lucide-react";

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

  // Quiz state
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      alert("Please enter some text before analyzing.");
      return;
    }
    setLoading(true);
    setResult(null);
    setError(null);
    setSelected({});
    setSubmitted(false);
    setScore(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, level, goal }),
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
        ? "border-indigo-500 bg-indigo-50 text-indigo-800"
        : "border-slate-200 bg-white hover:bg-slate-50";
    }
    if (opt === answer) return "border-green-500 bg-green-50 text-green-800 font-semibold";
    if (selected[qi] === opt && opt !== answer) return "border-red-400 bg-red-50 text-red-700";
    return "border-slate-200 bg-white text-slate-400";
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),transparent)]" />
      </div>

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">

        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-600 rounded-2xl ring-1 ring-indigo-200 shadow-sm mb-1">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">AI Study Companion</h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Paste your notes or upload a PDF to get explanations, key points, a summary, and a quiz.
          </p>
        </div>

        {/* Form Card */}
        <div className="w-full bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-xl rounded-3xl p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Left: Input */}
            <div className="space-y-6">
              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-500" /> Upload Document (PDF)
                </label>
                <div className="group relative flex flex-col items-center justify-center py-7 px-4 border-2 border-dashed border-slate-300 rounded-2xl hover:border-indigo-400 hover:bg-slate-50 transition-colors cursor-pointer bg-slate-50/50">
                  <div className="p-3 bg-white shadow-sm rounded-full mb-3 group-hover:scale-110 transition-all">
                    <FileText className="w-6 h-6 text-indigo-500" />
                  </div>
                  <p className="text-sm text-slate-600 mb-1">
                    <span className="text-indigo-600 font-semibold">Click to upload</span> or drag & drop
                  </p>
                  <p className="text-xs text-slate-400">PDF up to 10MB</p>
                  <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

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
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your text, concepts, or questions here..."
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Right: Preferences */}
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

              {/* Analyze Button */}
              <button
                id="analyze-btn"
                type="button"
                onClick={handleAnalyze}
                disabled={loading}
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

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700 font-medium shadow-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-10 space-y-6">

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

            {/* Quiz */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-indigo-500" /> Quiz
                {submitted && score !== null && (
                  <span className={`ml-auto text-sm font-bold px-3 py-1 rounded-full ${score >= 4 ? "bg-green-100 text-green-700" : score >= 2 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                    Score: {score}/{result.quiz.length}
                  </span>
                )}
              </h2>

              <div className="space-y-8">
                {result.quiz.map((q, qi) => (
                  <div key={qi}>
                    <p className="text-sm font-semibold text-slate-800 mb-3">
                      Q{qi + 1}. {q.question}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => {
                        const isCorrect = submitted && opt === q.answer;
                        const isWrong = submitted && selected[qi] === opt && opt !== q.answer;
                        return (
                          <button
                            key={oi}
                            type="button"
                            disabled={submitted}
                            onClick={() => !submitted && setSelected((prev) => ({ ...prev, [qi]: opt }))}
                            className={`w-full text-left text-sm px-4 py-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${getOptionStyle(qi, opt, q.answer)}`}
                          >
                            <span>{opt}</span>
                            {isCorrect && <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />}
                            {isWrong && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                    {submitted && selected[qi] !== q.answer && (
                      <p className="mt-2 text-xs text-green-700 font-medium">
                        ✓ Correct answer: {q.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {!submitted && (
                <button
                  id="submit-quiz-btn"
                  type="button"
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(selected).length < result.quiz.length}
                  className="mt-8 w-full flex justify-center items-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-bold text-white hover:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-500/30 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit Quiz
                </button>
              )}

              {submitted && (
                <p className="mt-6 text-center text-sm text-slate-500">
                  {score === result.quiz.length
                    ? "🎉 Perfect score! Excellent work."
                    : score! >= Math.ceil(result.quiz.length / 2)
                    ? "👍 Good job! Review the ones you missed."
                    : "📚 Keep studying — you'll get there!"}
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
