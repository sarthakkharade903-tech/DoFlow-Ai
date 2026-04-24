"use client";
import { useState } from "react";
import { CheckCircle2, XCircle, ArrowLeft, BookOpen } from "lucide-react";
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
        ? "border-indigo-500 bg-indigo-50 text-indigo-800 ring-2 ring-indigo-200"
        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50";
    }
    if (opt === answer) return "border-green-500 bg-green-50 text-green-800 font-semibold ring-2 ring-green-200";
    if (selected[qi] === opt && opt !== answer) return "border-red-400 bg-red-50 text-red-700 ring-2 ring-red-200";
    return "border-slate-100 bg-slate-50 text-slate-400 opacity-60";
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

  // ── Header ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Notes
        </button>
        <span className="text-slate-300">|</span>
        <h2 className="text-lg font-bold text-slate-800">Quiz — {quiz.length} Questions</h2>

        {/* Important Only toggle */}
        {hasImportant && !submitted && (
          <button
            type="button"
            onClick={() => setImportantOnly((p) => !p)}
            className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
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
          <ActionBar>
            <CopyButton label="Copy Quiz" getText={getQuizText} />
            <DownloadButton label="Download Quiz" filename="quiz.txt" getContent={getQuizText} />
          </ActionBar>
        )}
      </div>

      {/* Questions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-8">
        {visibleQuiz.map((q, qi) => {
          const globalIdx = quiz.indexOf(q);
          const userAnswer = selected[globalIdx];
          const isCorrect = submitted && userAnswer === q.answer;
          const isWrong = submitted && userAnswer !== undefined && userAnswer !== q.answer;
          const isUnanswered = submitted && userAnswer === undefined;

          return (
            <div key={globalIdx} className={`rounded-xl p-4 border transition-all ${!submitted ? "border-transparent" : isCorrect ? "border-green-200 bg-green-50/40" : "border-red-200 bg-red-50/30"}`}>
              <div className="flex items-start gap-2 mb-3">
                {submitted && (
                  <span className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${isCorrect ? "bg-green-500" : "bg-red-400"}`}>
                    {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <XCircle className="w-3.5 h-3.5 text-white" />}
                  </span>
                )}
                <p className="text-sm font-semibold text-slate-800 flex-1">Q{quiz.indexOf(q) + 1}. {q.question}</p>
                {q.important && (
                  <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                    ⭐ Important
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
                      <span>{opt}</span>
                      {optCorrect && <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />}
                      {optWrong && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
              {submitted && (isWrong || isUnanswered) && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-100 border border-green-200 px-3 py-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <p className="text-xs font-semibold text-green-800">Correct answer: {q.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit */}
      {!submitted && (
        <button id="submit-quiz-btn" type="button" onClick={handleSubmitQuiz}
          disabled={visibleQuiz.some((q) => selected[quiz.indexOf(q)] === undefined)}
          className="w-full flex justify-center items-center gap-2 rounded-xl bg-slate-800 px-4 py-4 text-sm font-bold text-white hover:bg-slate-900 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
          Submit Quiz
        </button>
      )}

      {/* Score Banner */}
      {submitted && score !== null && (
        <div className={`rounded-2xl border overflow-hidden ${score === quiz.length ? "border-green-200" : score >= Math.ceil(quiz.length / 2) ? "border-yellow-200" : "border-red-200"}`}>
          <div className={`px-6 py-5 text-center ${score === quiz.length ? "bg-green-50" : score >= Math.ceil(quiz.length / 2) ? "bg-yellow-50" : "bg-red-50"}`}>
            <p className={`text-3xl font-extrabold tracking-tight ${score === quiz.length ? "text-green-700" : score >= Math.ceil(quiz.length / 2) ? "text-yellow-700" : "text-red-600"}`}>
              You got {score} / {quiz.length}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-600">
              {score === quiz.length ? "🎉 Perfect score! Excellent work." : score >= Math.ceil(quiz.length / 2) ? "👍 Good job! Review the ones you missed." : "📚 Keep studying — you'll get there!"}
            </p>
          </div>

          {weakTopics.length > 0 && (
            <div className="px-6 py-4 bg-white border-t border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Focus on:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {weakTopics.map((topic, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" /> {topic}
                  </span>
                ))}
              </div>
              <button id="revise-btn" type="button" onClick={onRevise}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 text-sm font-bold shadow-md shadow-orange-200 transition-all active:scale-[0.98]">
                <BookOpen className="w-4 h-4" /> Revise Weak Areas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
