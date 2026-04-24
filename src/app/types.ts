export interface QuizItem {
  question: string;
  options: string[];
  answer: string;
}

export interface AnalysisResult {
  explanation: string;
  key_points: string[];
  summary: string;
  quiz: QuizItem[];
}

export type View = "home" | "quiz" | "revise" | "mindmap";
