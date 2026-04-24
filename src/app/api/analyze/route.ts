import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, level, goal } = body;

    return NextResponse.json({
      message: "API working",
      received: { text, level, goal },
    });
  } catch (error) {
    console.error("Error in /api/analyze:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
