"use client";
import { AlignLeft, ListChecks, ArrowLeft } from "lucide-react";

interface Props {
  explanation: string;
  key_points: string[];
  weakTopics: string[];
  onBack: () => void;
}

export default function ReviseView({ explanation, key_points, weakTopics, onBack }: Props) {
  const revisedSentences = explanation
    .split(/(?<=[.!?])\s+/)
    .filter((s) => weakTopics.some((kw) => s.toLowerCase().includes(kw)));

  const revisedPoints = key_points.filter((pt) =>
    weakTopics.some((kw) => pt.toLowerCase().includes(kw))
  );

  const hasContent = revisedSentences.length > 0 || revisedPoints.length > 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Notes
        </button>
      </div>

      {/* Banner */}
      <div className="flex items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4">
        <span className="text-xl">📖</span>
        <div>
          <p className="text-sm font-bold text-orange-800">Revise Mode — Weak Areas Only</p>
          <p className="text-xs text-orange-600 mt-0.5">
            Showing content relevant to:{" "}
            <span className="font-semibold">{weakTopics.join(", ")}</span>
          </p>
        </div>
      </div>

      {/* Weak topic badges */}
      <div className="flex flex-wrap gap-2">
        {weakTopics.map((topic, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
            {topic}
          </span>
        ))}
      </div>

      {!hasContent && (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center">
          <p className="text-sm text-slate-500">No specific content matched your weak topics.</p>
          <p className="text-xs text-slate-400 mt-1">Go back to Notes to review the full explanation.</p>
        </div>
      )}

      {/* Matched explanation sentences */}
      {revisedSentences.length > 0 && (
        <div className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
            <AlignLeft className="w-5 h-5 text-orange-500" />
            Relevant Explanation
            <span className="ml-auto text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-lg">
              Weak areas
            </span>
          </h2>
          <div className="space-y-3">
            {revisedSentences.map((s, i) => (
              <p key={i} className="text-sm text-slate-700 leading-relaxed border-l-2 border-orange-300 pl-4 py-0.5">
                {s}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Matched key points */}
      {revisedPoints.length > 0 && (
        <div className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
            <ListChecks className="w-5 h-5 text-orange-500" />
            Key Points to Review
            <span className="ml-auto text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-lg">
              {revisedPoints.length} matched
            </span>
          </h2>
          <ul className="space-y-2">
            {revisedPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                {pt}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
