"use client";

import { useState, useRef } from "react";
import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
  apiKey: process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY!,
});

export default function GamePage() {
  const [gameState, setGameState] = useState<"initial" | "question" | "result">(
    "initial"
  );
  const [question, setQuestion] = useState<string>("");
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [gameResult, setGameResult] = useState<"win" | "lose" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startGame = async () => {
    setIsLoading(true);
    try {
      // Convert Google Drive view URL to direct download URL
      const fileId = "1C3tX3G6Qk0Gh8gCiXh_IbWr-oHfaNDgn";
      const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

      // Step 2: Transcribe using the direct download URL
      const transcript = await client.transcripts.transcribe({
        audio: directDownloadUrl,
      });

      console.log("Transcript:", transcript);

      // Step 3: Generate a question using LeMUR
      const { response: question } = await client.lemur.task({
        transcript_ids: [transcript.id],
        prompt:
          "Generate a question about the main topic discussed in this audio.",
        final_model: "anthropic/claude-3-5-sonnet",
      });

      // Step 4: Generate the answer to store
      const { response: answer } = await client.lemur.task({
        transcript_ids: [transcript.id],
        prompt: "What is the correct answer to this question: " + question,
        final_model: "anthropic/claude-3-5-sonnet",
      });

      setQuestion(question);
      sessionStorage.setItem("currentAnswer", answer);
      setGameState("question");
    } catch (error) {
      console.error("Error starting game:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAnswer = async () => {
    setIsLoading(true);
    try {
      const correctAnswer = sessionStorage.getItem("currentAnswer");

      // Use LeMUR to compare answers
      const { response: comparison } = await client.lemur.task({
        prompt: `Compare these two answers and respond only with "true" if they mean the same thing, or "false" if they don't:
                Answer 1: ${userAnswer}
                Answer 2: ${correctAnswer}`,
        final_model: "anthropic/claude-3-5-sonnet",
      });

      const isCorrect = comparison.toLowerCase().trim() === "true";
      setGameResult(isCorrect ? "win" : "lose");
      setGameState("result");
    } catch (error) {
      console.error("Error checking answer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetGame = () => {
    setGameState("initial");
    setQuestion("");
    setUserAnswer("");
    setGameResult(null);
    sessionStorage.removeItem("currentAnswer");
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">Audio Quiz Game</h1>

        {gameState === "initial" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-gray-600">
                Audio file loaded from Google Drive
              </p>
            </div>
            <button
              onClick={startGame}
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isLoading ? "Loading..." : "Start Game"}
            </button>
          </div>
        )}

        {gameState === "question" && (
          <div className="space-y-4">
            <p className="text-xl">{question}</p>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Type your answer here..."
            />
            <button
              onClick={checkAnswer}
              disabled={isLoading || !userAnswer.trim()}
              className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              {isLoading ? "Checking..." : "Submit Answer"}
            </button>
          </div>
        )}

        {gameState === "result" && (
          <div className="space-y-4 text-center">
            <h2
              className={`text-2xl font-bold ${
                gameResult === "win" ? "text-green-500" : "text-red-500"
              }`}
            >
              {gameResult === "win"
                ? "Congratulations! You got it right!"
                : "Sorry, try again!"}
            </h2>
            <button
              onClick={resetGame}
              className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
