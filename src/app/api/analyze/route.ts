import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, level, goal } = body;

    // Validate: text must not be empty
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Study material text is required." },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a personalized study assistant.

Return your response in JSON format with EXACTLY this structure. No markdown, no code fences, no extra text — pure JSON only:
{
  "explanation": "",
  "key_points": [],
  "summary": "",
  "quiz": [
    {
      "question": "",
      "options": ["", "", "", ""],
      "answer": "",
      "important": false
    }
  ]
}

IMPORTANT: In the quiz array, mark the top 2 most exam-relevant questions with "important": true. All others must have "important": false.`;

    const userPrompt = `Student Profile:
- Level: ${level}
- Goal: ${goal}

Study Material:
${text.trim()}

Tasks:
1. Explain key concepts suitable for the student level
2. Highlight most important topics
3. Provide a short summary
4. Generate 5 MCQ questions with 4 options and correct answer
   - Mark the 2 most exam-relevant questions with "important": true
   - Mark the remaining 3 with "important": false

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
