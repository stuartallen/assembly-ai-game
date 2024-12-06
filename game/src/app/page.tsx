"use client";

import { useState } from "react";
import AudioQuizGame from "@/components/AudioQuizGame";
import JeopardyBoard from "@/components/JeopardyBoard";
import { Category } from "@/components/JeopardyBoard";

const SEA_TURTLES_AUDIO =
  "https://utfs.io/f/RjVHnBtym1HvlViTv07CEL5sxi9XUe23mICzbgB1aMTDtJVF";
const SEA_TURTLES_THUMBNAIL =
  "https://utfs.io/f/RjVHnBtym1HvrYESkQ4fqjgaVUG8BJdi5uv6XS3csoZCLWz9";

const PASTOR_AUDIO =
  "https://utfs.io/f/RjVHnBtym1HvsY85sfRGpm4FQ1L7URvVezDNWcjiSnJ2Y0gX";
const PASTOR_THUMBNAIL =
  "https://utfs.io/f/RjVHnBtym1Hv7h4L9YsrHo4Bl96Wjw7NxZc3IkphCuiUsq1O";

const POKEMON_AUDIO =
  "https://utfs.io/f/RjVHnBtym1HvfJYkg24yLP65HltyCYGUE8sw0c4RJgDjrbfN";
const POKEMON_THUMBNAIL =
  "https://utfs.io/f/RjVHnBtym1HvnWevDCw2OmrFTEzxdJ6Rf5PQM84objtHY0NI";

const SCOTLAND_AUDIO =
  "https://utfs.io/f/RjVHnBtym1Hv4ag9MXSnuyDO2Bi95Ao0eaV4plkxwmCzErhL";
const SCOTLAND_THUMBNAIL =
  "https://utfs.io/f/RjVHnBtym1HvuIrMcMDuEOkfx9Dtdb6WrPKiqyjTm7aQXhJ5";

const CHEESE_AUDIO =
  "https://utfs.io/f/RjVHnBtym1HvDQKNavn40FkVf6YjJIsZ1rvBNAnMQGET8td9";
const CHEESE_THUMBNAIL =
  "https://utfs.io/f/RjVHnBtym1HvVTfkmk0j4qKwIPYpXCmzeGZy63lFS7NgOAHD";

const initialCategories = [
  {
    audio: SEA_TURTLES_AUDIO,
    thumbnail: SEA_TURTLES_THUMBNAIL,
    questions: [100, 200, 300, 400, 500].map((points) => ({
      points,
      isPlayed: false,
    })),
  },
  {
    audio: PASTOR_AUDIO,
    thumbnail: PASTOR_THUMBNAIL,
    questions: [100, 200, 300, 400, 500].map((points) => ({
      points,
      isPlayed: false,
    })),
  },
  {
    audio: POKEMON_AUDIO,
    thumbnail: POKEMON_THUMBNAIL,
    questions: [100, 200, 300, 400, 500].map((points) => ({
      points,
      isPlayed: false,
    })),
  },
  {
    audio: SCOTLAND_AUDIO,
    thumbnail: SCOTLAND_THUMBNAIL,
    questions: [100, 200, 300, 400, 500].map((points) => ({
      points,
      isPlayed: false,
    })),
  },
  {
    audio: CHEESE_AUDIO,
    thumbnail: CHEESE_THUMBNAIL,
    questions: [100, 200, 300, 400, 500].map((points) => ({
      points,
      isPlayed: false,
    })),
  },
];

export default function GamePage() {
  const [categories, setCategories] = useState(initialCategories);
  const [selectedTile, setSelectedTile] = useState<{
    category: {
      audio: string;
      thumbnail: string;
    };
    points: number;
    difficulty: "easy" | "medium" | "hard";
  } | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const getDifficulty = (points: number): "easy" | "medium" | "hard" => {
    if (points <= 200) return "easy";
    if (points <= 400) return "medium";
    return "hard";
  };

  const handleTileSelect = (category: Category, points: number) => {
    setSelectedTile({
      category,
      points,
      difficulty: getDifficulty(points),
    });
  };

  const handleQuizComplete = () => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.audio === selectedTile?.category.audio) {
          return {
            ...cat,
            questions: cat.questions.map((q) =>
              q.points === selectedTile?.points ? { ...q, isPlayed: true } : q
            ),
          };
        }
        return cat;
      })
    );
    setSelectedTile(null);
  };

  console.log({ audioUrl, selectedTile });

  return (
    <main className="min-h-screen p-8 bg-gray-900 text-white">
      {selectedTile && audioUrl ? (
        <AudioQuizGame
          audioUrl={audioUrl}
          onComplete={handleQuizComplete}
          category={selectedTile.category}
          points={selectedTile.points}
          difficulty={selectedTile.difficulty}
        />
      ) : (
        <JeopardyBoard
          categories={categories}
          onTileSelect={handleTileSelect}
          setAudioUrl={setAudioUrl}
        />
      )}
    </main>
  );
}
