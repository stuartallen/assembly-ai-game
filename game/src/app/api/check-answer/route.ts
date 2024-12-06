import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userAnswer, correctAnswer } = await request.json();

  try {
    // Here you would integrate with your LLM (Lemur) to compare answers
    // For now, we'll do a simple comparison
    const isCorrect = userAnswer
      .toLowerCase()
      .includes(correctAnswer.toLowerCase());

    return NextResponse.json({ isCorrect });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to check answer: ${error}` },
      { status: 500 }
    );
  }
}
