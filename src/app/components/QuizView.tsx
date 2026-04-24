"use client";
import { useState } from "react";
import { CheckCircle2, XCircle, ArrowLeft, BookOpen, Zap } from "lucide-react";
import { QuizItem } from "../types";
import { ActionBar, CopyButton, DownloadButton } from "./ActionButtons";

interface Props {
  quiz: QuizItem[];
  selected: Record<number, string>;
  setSelected: (v: Record<number, string>) => void;
  submitted: boolean;
  score: number | null;
  weakTopics: string[];
  handleSubmitQuiz: () => void;
  onRevise: () => void;
  onBack: () => void;
}

export default function QuizView({ quiz, selected, setSelected, submitted, score, weakTopics, handleSubmitQuiz, onRevise, onBack }: Props) {
  const [importantOnly, setImportantOnly] = useState(false);

  const hasImportant = quiz.some((q) => q.important);
  const visibleQuiz = importantOnly ? quiz.filter((q) => q.important) : quiz;

  const getOptionStyle = (qi: number, opt: string, answer: string) => {
    if (!submitted) {
      return selected[qi] === opt
        ? "border-indigo-400 bg-indigo-50 text-indigo-800 ring-2 ring-indigo-200/60 shadow-sm"
        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 hover:shadow-sm";
    }
    if (opt === answer) return "border-green-400 bg-green-50 text-green-800 font-semibold ring-2 ring-green-200/60";
    if (selected[qi] === opt && opt !== answer) return "border-red-400 bg-red-50 text-red-700 ring-2 ring-red-200/60";
    return "border-slate-100 bg-slate-50 text-slate-400 opacity-50";
  };

  // ── Helpers for copy/download ─────────────────────────────────────────────
  const getQuizText = () =>
    quiz
      .map(
        (q, i) =>
          `Q${i + 1}. ${q.question}\n` +
          q.options.map((o, oi) => `  ${String.fromCharCode(65 + oi)}. ${o}`).join("\n") +
          `\nAnswer: ${q.answer}`
      )
      .join("\n\n");

  const totalAnswered = Object.keys(selected).length;
  const allAnswered = visibleQuiz.every((q) => selected[quiz.indexOf(q)] !== undefined);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 animate-fade-up">

      {/* Header row */}
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Notes
        </button>
        <span className="text-slate-200">|</span>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-50">
            <Zap className="w-4 h-4 text-violet-500" />
          </div>
          <h2 className="text-base font-bold text-slate-800">Quiz
            <span className="ml-2 text-xs font-semibold text-slate-400">
              {quiz.length} question{quiz.length !== 1 ? "s" : ""}
            </span>
          </h2>
        </div>

        {/* Important Only toggle */}
        {hasImportant && !submitted && (
          <button
            type="button"
            onClick={() => setImportantOnly((p) => !p)}
            className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
              importantOnly
                ? "bg-yellow-400 border-yellow-400 text-white shadow-sm"
                : "bg-white border-yellow-300 text-yellow-700 hover:bg-yellow-50"
            }`}
          >
            ⭐ {importantOnly ? "Showing Important Only" : "Show Important Only"}
          </button>
        )}

        {/* Copy / Download — visible after submission */}
        {submitted && (
          <div className={hasImportant ? "" : "ml-auto"}>
            <ActionBar>
              <CopyButton label="Copy Quiz" getText={getQuizText} />
              <DownloadButton label="Download Quiz" filename="quiz.txt" getContent={getQuizText} />
            </ActionBar>
          </div>
        )}
      </div>

      {/* Progress bar (pre-submit) */}
      {!submitted && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(totalAnswered / visibleQuiz.length) * 100}%`,
                background: "linear-gradient(90deg, #818cf8, #a78bfa)",
              }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-400 shrink-0">
            {totalAnswered}/{visibleQuiz.length} answered
          </span>
        </div>
      )}

      {/* Questions */}
      <div className="rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-md p-6 shadow-sm space-y-7">
        {visibleQuiz.map((q, qi) => {
          const globalIdx = quiz.indexOf(q);
          const userAnswer = selected[globalIdx];
          const isCorrect = submitted && userAnswer === q.answer;
          const isWrong = submitted && userAnswer !== undefined && userAnswer !== q.answer;
          const isUnanswered = submitted && userAnswer === undefined;

          return (
            <div key={globalIdx}
              className={`rounded-xl p-4 border transition-all ${
                !submitted
                  ? "border-transparent"
                  : isCorrect
                  ? "border-green-200 bg-green-50/40"
                  : "border-red-200 bg-red-50/30"
              }`}>
              <div className="flex items-start gap-2.5 mb-3">
                {submitted && (
                  <span className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${isCorrect ? "bg-green-500" : "bg-red-400"}`}>
                    {isCorrect
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      : <XCircle className="w-3.5 h-3.5 text-white" />}
                  </span>
                )}
                <p className="text-sm font-semibold text-slate-800 flex-1 leading-relaxed">
                  <span className="text-slate-400 mr-1">Q{quiz.indexOf(q) + 1}.</span> {q.question}
                </p>
                {q.important && (
                  <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-200">
                    ⭐ Key
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const optCorrect = submitted && opt === q.answer;
                  const optWrong = submitted && selected[globalIdx] === opt && opt !== q.answer;
                  return (
                    <button key={oi} type="button" disabled={submitted}
                      onClick={() => !submitted && setSelected({ ...selected, [globalIdx]: opt })}
                      className={`w-full text-left text-sm px-4 py-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${getOptionStyle(globalIdx, opt, q.answer)}`}>
                      <span className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 w-4 shrink-0">
                          {String.fromCharCode(65 + oi)}.
                        </span>
                        {opt}
                      </span>
                      {optCorrect && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />}
                      {optWrong && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {submitted && (isWrong || isUnanswered) && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <p className="text-xs font-semibold text-green-800">Correct answer: {q.answer}</p>
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
          disabled={!allAnswered}
          className="w-full flex justify-center items-center gap-2 rounded-xl px-4 py-4 text-sm font-bold text-white transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: allAnswered
              ? "linear-gradient(135deg, #1e293b 0%, #334155 100%)"
              : undefined,
            backgroundColor: !allAnswered ? "#cbd5e1" : undefined,
          }}
        >
          Submit Quiz
        </button>
      )}

      {/* Score banner */}
      {submitted && score !== null && (
        <div className={`rounded-2xl border overflow-hidden shadow-sm animate-scale-in ${
          score === quiz.length
            ? "border-green-200"
            : score >= Math.ceil(quiz.length / 2)
            ? "border-yellow-200"
            : "border-red-200"
        }`}>
          <div className={`px-6 py-6 text-center ${
            score === quiz.length
              ? "bg-gradient-to-br from-green-50 to-emerald-50"
              : score >= Math.ceil(quiz.length / 2)
              ? "bg-gradient-to-br from-yellow-50 to-amber-50"
              : "bg-gradient-to-br from-red-50 to-rose-50"
          }`}>
            <p className={`text-4xl font-black tracking-tight ${
              score === quiz.length ? "text-green-700" : score >= Math.ceil(quiz.length / 2) ? "text-yellow-700" : "text-red-600"
            }`}>
              {score} <span className="text-2xl font-semibold opacity-50">/ {quiz.length}</span>
            </p>
            <p className="mt-2 text-sm font-medium text-slate-600">
              {score === quiz.length
                ? "🎉 Perfect score! Excellent work."
                : score >= Math.ceil(quiz.length / 2)
                ? "👍 Good job! Review the ones you missed."
                : "📚 Keep studying — you'll get there!"}
            </p>
          </div>

          {weakTopics.length > 0 && (
            <div className="px-6 py-5 bg-white border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Focus on:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {weakTopics.map((topic, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" /> {topic}
                  </span>
                ))}
              </div>
              <button id="revise-btn" type="button" onClick={onRevise}
                className="w-full flex items-center justify-center gap-2 rounded-xl text-white px-4 py-3 text-sm font-bold transition-all active:scale-[0.97]"
                style={{ background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", boxShadow: "0 4px 14px rgba(249,115,22,0.3)" }}>
                <BookOpen className="w-4 h-4" /> Revise Weak Areas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
