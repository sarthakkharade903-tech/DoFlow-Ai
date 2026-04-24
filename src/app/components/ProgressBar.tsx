"use client";
import { useEffect, useState } from "react";
import { TrendingUp, Activity, Award } from "lucide-react";

interface Props {
  score: number | null;
  total: number;
}

export default function ProgressBar({ score, total }: Props) {
  const [savedScore, setSavedScore] = useState<number | null>(null);
  const [savedTotal, setSavedTotal] = useState<number>(1);

  useEffect(() => {
    // If we have a new score, save it
    if (score !== null) {
      localStorage.setItem("doflow_last_score", score.toString());
      localStorage.setItem("doflow_last_total", total.toString());
      setSavedScore(score);
      setSavedTotal(total);
    } else {
      // Try to load from local storage
      const lsScore = localStorage.getItem("doflow_last_score");
      const lsTotal = localStorage.getItem("doflow_last_total");
      if (lsScore && lsTotal) {
        setSavedScore(parseInt(lsScore, 10));
        setSavedTotal(parseInt(lsTotal, 10));
      }
    }
  }, [score, total]);

  const displayScore = score !== null ? score : savedScore;
  const displayTotal = score !== null ? total : savedTotal;

  if (displayScore === null) return null;

  const progress = displayTotal > 0 ? (displayScore / displayTotal) * 100 : 0;
  
  let label = "Strong";
  let Icon = Award;
  let colorClass = "text-green-600";
  let bgGradient = "linear-gradient(90deg, #10b981, #34d399)"; // Green

  if (progress < 40) {
    label = "Needs Work";
    Icon = Activity;
    colorClass = "text-red-500";
    bgGradient = "linear-gradient(90deg, #ef4444, #f87171)"; // Red
  } else if (progress <= 70) {
    label = "Improving";
    Icon = TrendingUp;
    colorClass = "text-orange-500";
    bgGradient = "linear-gradient(90deg, #f97316, #fb923c)"; // Orange
  } else {
    // Strong uses the requested purple/blue gradient
    bgGradient = "linear-gradient(90deg, #8b5cf6, #3b82f6)"; 
    colorClass = "text-indigo-600";
  }

  return (
    <div className="w-full rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-md shadow-sm p-5 mb-6 animate-fade-up">
      <div className="flex justify-between items-end mb-3">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Understanding</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-black text-slate-800">{Math.round(progress)}%</p>
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md bg-slate-50 border border-slate-100 ${colorClass}`}>
              <Icon className="w-3.5 h-3.5" /> {label}
            </span>
          </div>
        </div>
        <p className="text-sm font-semibold text-slate-400">
          {displayScore} / {displayTotal} correct
        </p>
      </div>
      
      {/* Progress Bar Container */}
      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div 
          className="h-full rounded-full transition-all duration-1000 ease-out relative"
          style={{ width: `${progress}%`, background: bgGradient }}
        >
          {/* Shimmer effect inside the bar */}
          <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
        </div>
      </div>
    </div>
  );
}
