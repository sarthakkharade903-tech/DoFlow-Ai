import React from 'react';
import { Upload, BookOpen, Target, Settings2, Sparkles, FileText } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Background gradients */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20 flex flex-col items-center">
        {/* Header section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-600 rounded-2xl mb-2 ring-1 ring-indigo-200 shadow-sm">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            AI Study Companion
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium">
            Upload your study materials or paste your notes to generate personalized study plans, flashcards, and concept breakdowns.
          </p>
        </div>

        {/* Main form card */}
        <div className="w-full bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-3xl p-6 md:p-10 transition-all hover:shadow-2xl hover:shadow-slate-200/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left column: Inputs */}
            <div className="space-y-6">
              
              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-500" />
                  Upload Document (PDF)
                </label>
                <div className="group relative w-full flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed border-slate-300 rounded-2xl hover:bg-slate-50 hover:border-indigo-400 transition-colors cursor-pointer bg-slate-50/50">
                  <div className="p-3 bg-white shadow-sm rounded-full mb-3 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                    <FileText className="w-6 h-6 text-indigo-500" />
                  </div>
                  <p className="text-sm text-slate-600 font-medium mb-1">
                    <span className="text-indigo-600 font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-400">PDF up to 10MB</p>
                  <input type="file" accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
              </div>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-semibold uppercase tracking-wider">or</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Text Area Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  Paste Study Notes
                </label>
                <textarea 
                  rows={4} 
                  placeholder="Paste your text, concepts, or questions here..."
                  className="w-full resize-none rounded-2xl border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm outline-none border"
                ></textarea>
              </div>

            </div>

            {/* Right column: Settings */}
            <div className="space-y-6 bg-slate-50/50 p-6 md:p-8 rounded-2xl border border-slate-100 flex flex-col justify-between">
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-1">
                    <Settings2 className="w-5 h-5 text-indigo-500" />
                    Study Preferences
                  </h3>
                  <p className="text-sm text-slate-500">Customize how the AI should help you study.</p>
                </div>

                {/* Difficulty Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Difficulty Level
                  </label>
                  <div className="relative">
                    <select className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer font-medium">
                      <option value="beginner">Beginner (Foundational)</option>
                      <option value="intermediate">Intermediate (Core Concepts)</option>
                      <option value="advanced">Advanced (Deep Dive)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Goal Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Study Goal
                  </label>
                  <div className="relative">
                    <select className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer font-medium">
                      <option value="exam">Exam Preparation</option>
                      <option value="concept">Concept Clarity</option>
                      <option value="revision">Quick Revision</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button type="button" className="group relative w-full flex justify-center items-center gap-2 rounded-xl bg-indigo-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all active:scale-[0.98]">
                  <Target className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Generate Study Plan
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
