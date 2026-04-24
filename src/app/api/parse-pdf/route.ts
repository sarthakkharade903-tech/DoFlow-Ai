import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("pdf") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No PDF file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use lib import to avoid pdf-parse test-file loading issue in Next.js
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse/lib/pdf-parse");
    const data = await pdfParse(buffer);

    if (!data.text || data.text.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract text from this PDF. It may be scanned or image-based." },
        { status: 422 }
      );
    }

    return NextResponse.json({ text: data.text.trim() });
  } catch (error) {
    console.error("PDF parse error:", error);
    return NextResponse.json(
      { error: "Failed to parse PDF. Please try a different file." },
      { status: 500 }
    );
  }
}
