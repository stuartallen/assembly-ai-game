import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { audioUrl } = await request.json();

  try {
    // Initialize AssemblyAI client
    const response = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      headers: {
        Authorization: process.env.ASSEMBLYAI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audio_url: `${process.env.NEXT_PUBLIC_BASE_URL}${audioUrl}`,
      }),
    });

    const initialData = await response.json();

    // Poll for results
    const transcriptUrl = `https://api.assemblyai.com/v2/transcript/${initialData.id}`;
    let transcription = null;

    while (!transcription) {
      const pollResponse = await fetch(transcriptUrl, {
        headers: {
          Authorization: process.env.ASSEMBLYAI_API_KEY,
        },
      });
      const pollData = await pollResponse.json();

      if (pollData.status === "completed") {
        transcription = pollData.text;
      } else if (pollData.status === "error") {
        throw new Error("Transcription failed");
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return NextResponse.json({ transcription });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to transcribe audio ${error}` },
      { status: 500 }
    );
  }
}
