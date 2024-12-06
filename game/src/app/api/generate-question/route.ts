import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { transcription } = await request.json();

  try {
    // Here you would integrate with your LLM (Lemur) to generate a question and answer
    // For now, we'll return a mock response
    const question = "What was the main topic discussed in the audio?";
    const answer = "Mock answer - replace with actual LLM integration";

    return NextResponse.json({ question, answer });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to generate question ${error}` },
      { status: 500 }
    );
  }
}
