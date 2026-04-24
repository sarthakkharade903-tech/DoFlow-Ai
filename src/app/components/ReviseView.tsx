"use client";
import { AlignLeft, ListChecks, ArrowLeft, Target } from "lucide-react";
import ProgressBar from "./ProgressBar";

interface Props {
  explanation: string;
  key_points: string[];
  weakTopics: string[];
  score: number | null;
  total: number;
  onBack: () => void;
}

export default function ReviseView({ explanation, key_points, weakTopics, score, total, onBack }: Props) {
  const revisedSentences = explanation
    .split(/(?<=[.!?])\s+/)
    .filter((s) => weakTopics.some((kw) => s.toLowerCase().includes(kw)));

  const revisedPoints = key_points.filter((pt) =>
    weakTopics.some((kw) => pt.toLowerCase().includes(kw))
  );

  const hasContent = revisedSentences.length > 0 || revisedPoints.length > 0;

  return (
    <div className="space-y-5 animate-fade-up">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Notes
        </button>
      </div>

      {/* Duolingo-style Progress Bar */}
      <ProgressBar score={score} total={total} />

      {/* Banner */}
      <div className="rounded-2xl border border-orange-200/80 overflow-hidden shadow-sm"
        style={{ background: "linear-gradient(135deg, #fff7ed 0%, #fef3e8 100%)" }}>
        <div className="px-5 py-4 flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-orange-100">
            <Target className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-orange-900">Revise Mode — Weak Areas Only</p>
            <p className="text-xs text-orange-600 mt-0.5 leading-relaxed">
              Showing content relevant to:{" "}
              <span className="font-semibold">{weakTopics.join(", ")}</span>
            </p>
          </div>
        </div>

        {/* Weak topic badges */}
        <div className="px-5 pb-4 flex flex-wrap gap-2">
          {weakTopics.map((topic, i) => (
            <span key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/70 text-red-700 border border-red-200">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* No content fallback */}
      {!hasContent && (
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-md px-6 py-12 text-center shadow-sm">
          <p className="text-2xl mb-3">🔍</p>
          <p className="text-sm font-semibold text-slate-600">No specific content matched your weak topics.</p>
          <p className="text-xs text-slate-400 mt-1">Go back to Notes to review the full explanation.</p>
        </div>
      )}

      {/* Matched explanation sentences */}
      {revisedSentences.length > 0 && (
        <div className="rounded-2xl border border-orange-100/80 bg-white/80 backdrop-blur-md p-6 shadow-sm stagger-1 animate-fade-up">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 bg-orange-50 rounded-lg">
              <AlignLeft className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Relevant Explanation</h2>
            <span className="ml-auto text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-lg">
              Weak areas
            </span>
          </div>
          <div className="space-y-3">
            {revisedSentences.map((s, i) => (
              <p key={i}
                className="text-sm text-slate-600 leading-relaxed border-l-2 border-orange-300 pl-4 py-0.5">
                {s}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Matched key points */}
      {revisedPoints.length > 0 && (
        <div className="rounded-2xl border border-orange-100/80 bg-white/80 backdrop-blur-md p-6 shadow-sm stagger-2 animate-fade-up">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 bg-orange-50 rounded-lg">
              <ListChecks className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Key Points to Review</h2>
            <span className="ml-auto text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-lg">
              {revisedPoints.length} matched
            </span>
          </div>
          <ul className="space-y-3">
            {revisedPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                <span className="leading-relaxed">{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
