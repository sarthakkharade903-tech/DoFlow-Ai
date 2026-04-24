import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, level, goal } = body;

    const systemPrompt = `You are a personalized study assistant. You MUST respond with valid JSON only. No markdown, no explanation outside the JSON, no code fences. Return exactly this structure:
{
  "explanation": "string - key concepts explained for the student level",
  "key_points": ["string", "string", "string"],
  "summary": "string - a short summary of the material",
  "quiz": [
    {
      "question": "string",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "answer": "string - the correct option letter and text"
    }
  ]
}`;

    const userPrompt = `Student Profile:
- Level: ${level}
- Goal: ${goal}

Study Material:
${text}

Tasks:
1. Explain key concepts suitable for the student level (explanation field)
2. List the most important topics as bullet points (key_points array, at least 4 items)
3. Write a short summary (summary field)
4. Generate exactly 5 MCQ questions with 4 options each and the correct answer (quiz array)

Respond with valid JSON only.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.5,
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error in /api/analyze:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
