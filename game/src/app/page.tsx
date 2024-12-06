"use client";

import { useState } from "react";
import AudioQuizGame from "@/components/AudioQuizGame";
import JeopardyBoard from "@/components/JeopardyBoard";

const initialCategories = [
  {
    name: "History",
    questions: [100, 200, 300, 400, 500].map((points) => ({
      points,
      isPlayed: false,
    })),
  },
  {
    name: "Science",
    questions: [100, 200, 300, 400, 500].map((points) => ({
      points,
      isPlayed: false,
    })),
  },
  {
    name: "Sports",
    questions: [100, 200, 300, 400, 500].map((points) => ({
      points,
      isPlayed: false,
    })),
  },
  {
    name: "Geography",
    questions: [100, 200, 300, 400, 500].map((points) => ({
      points,
      isPlayed: false,
    })),
  },
  {
    name: "Entertainment",
    questions: [100, 200, 300, 400, 500].map((points) => ({
      points,
      isPlayed: false,
    })),
  },
  {
    name: "Literature",
    questions: [100, 200, 300, 400, 500].map((points) => ({
      points,
      isPlayed: false,
    })),
  },
];

export default function GamePage() {
  const [categories, setCategories] = useState(initialCategories);
  const [selectedTile, setSelectedTile] = useState<{
    category: string;
    points: number;
  } | null>(null);
  const audioUrl =
    "https://utfs.io/f/RjVHnBtym1HvfJYkg24yLP65HltyCYGUE8sw0c4RJgDjrbfN";

  const handleTileSelect = (category: string, points: number) => {
    setSelectedTile({ category, points });
  };

  const handleQuizComplete = () => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.name === selectedTile?.category) {
          return {
            ...cat,
            questions: cat.questions.map((q) =>
              q.points === selectedTile.points ? { ...q, isPlayed: true } : q
            ),
          };
        }
        return cat;
      })
    );
    setSelectedTile(null);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-900 text-white">
      {selectedTile ? (
        <AudioQuizGame
          audioUrl={audioUrl}
          onComplete={handleQuizComplete}
          category={selectedTile.category}
          points={selectedTile.points}
        />
      ) : (
        <JeopardyBoard
          categories={categories}
          onTileSelect={handleTileSelect}
        />
      )}
    </main>
  );
}
