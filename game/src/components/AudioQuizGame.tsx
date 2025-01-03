"use client";

import { useState, useRef, useEffect } from "react";
import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
  apiKey: process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY!,
});

interface AudioQuizGameProps {
  audioUrl: string;
  onComplete: () => void;
  category: {
    audio: string;
    thumbnail: string;
  };
  points: number;
  difficulty: "easy" | "medium" | "hard";
}

export default function AudioQuizGame({
  audioUrl,
  onComplete,
  category,
  points,
  difficulty,
}: AudioQuizGameProps) {
  const [gameState, setGameState] = useState<"initial" | "question" | "result">(
    "initial"
  );
  const [question, setQuestion] = useState<string>("");
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [gameResult, setGameResult] = useState<"win" | "lose" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [transcriptId, setTranscriptId] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const prepareGame = async () => {
      try {
        // Step 1: Transcribe using the direct download URL
        const transcript = await client.transcripts.transcribe({
          audio: audioUrl,
        });

        setTranscriptId(transcript.id);

        // Step 2: Generate a question using LeMUR
        const { response: question } = await client.lemur.task({
          transcript_ids: [transcript.id],
          prompt: `Generate a ${difficulty} difficulty question about the audio that has a one word answer. Only give the question. +
            For easy questions, focus on basic facts and main ideas. Make the questions fun, obscure, or offbeat +
            For medium questions, ask about specific details and relationships. You can extend the question and relate it to general knowledge.  +
            For hard questions, ask an extrmely specific esoteric question related to the audio that can also bring in outside knowledge about assembly AI +
            It is very important that you do not answer the question yourself.`,
          final_model: "anthropic/claude-3-5-sonnet",
        });

        // Step 3: Generate the answer to store
        const { response: answer } = await client.lemur.task({
          transcript_ids: [transcript.id],
          prompt:
            "What is the correct one to two word answer or proper noun or idiom or phraseto this question? Please be very conscise and definitive " +
            question,
          final_model: "anthropic/claude-3-5-sonnet",
        });

        setQuestion(question);
        setCorrectAnswer(answer);
      } catch (error) {
        console.error("Error preparing game:", error);
      } finally {
        setIsLoading(false);
      }
    };

    prepareGame();
  }, [audioUrl]);

  const startGame = () => {
    setGameState("question");
  };

  const checkAnswer = async () => {
    setIsLoading(true);
    try {
      // Use LeMUR to compare answers
      const { response: comparison } = await client.lemur.task({
        transcript_ids: [transcriptId],
        prompt: `Compare these two answers for a ${difficulty} difficulty question and respond only with "true" if they mean the same thing, or "false" if they don't:
                For easy questions, be more lenient with exact wording as long as the main idea is correct.
                For medium questions, require more specific details to match.
                For hard questions, be strict about accuracy and completeness.
                For any level of difficulty, if the answers are exactly the same, return "true".
                For any level of difficulty, if there is a mere formatting difference or extra word like "the" or "a", return "true".
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

  const handleAudioEnded = () => {
    setHasPlayed(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <img
          src={category.thumbnail}
          alt="Category thumbnail"
          className="w-32 h-32 object-cover rounded mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold mb-8">${points}</h1>
      </div>

      {gameState === "initial" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <audio
              ref={audioRef}
              controls={!hasPlayed}
              onEnded={handleAudioEnded}
              className="w-full"
            >
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            {hasPlayed && (
              <p className="text-sm text-gray-600">
                Audio has been played. Ready to start the game!
              </p>
            )}
            {isLoading && (
              <p className="text-sm text-gray-600">
                Preparing your question...
              </p>
            )}
          </div>
          <button
            onClick={startGame}
            disabled={isLoading || !hasPlayed}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading
              ? "Preparing game..."
              : hasPlayed
              ? "Start Game"
              : "Please listen to the audio first"}
          </button>
        </div>
      )}

      {gameState === "question" && (
        <div className="space-y-4">
          <p className="text-xl">{question}</p>
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-full p-2 border rounded text-black"
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
              : "Sorry, that's incorrect!"}
          </h2>
          <div className="space-y-2 mt-4">
            <div className="p-4 bg-gray-800 rounded">
              <h3 className="text-lg font-semibold mb-2">Your Answer:</h3>
              <p className="text-gray-300">{userAnswer}</p>
            </div>
            <div className="p-4 bg-gray-800 rounded">
              <h3 className="text-lg font-semibold mb-2">Correct Answer:</h3>
              <p className="text-gray-300">{correctAnswer}</p>
            </div>
          </div>
          <button
            onClick={onComplete}
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4"
          >
            Next Question
          </button>
        </div>
      )}
    </div>
  );
}
