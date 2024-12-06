import { Fragment } from "react";
import JeopardyTile from "./JeopardyTile";

export interface Category {
  audio: string;
  thumbnail: string;
  questions: {
    points: number;
    isPlayed: boolean;
  }[];
}

interface JeopardyBoardProps {
  categories: Category[];
  onTileSelect: (category: Category, points: number) => void;
  setAudioUrl: (url: string) => void;
}

export default function JeopardyBoard({
  categories,
  onTileSelect,
  setAudioUrl,
}: JeopardyBoardProps) {
  const pointValues = [100, 200, 300, 400, 500];

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <img
        src="https://utfs.io/f/RjVHnBtym1HvRhzWEEtym1HvMIZbVYUfO9wuWAD2ad8Xnk3Q"
        alt="SAY WHAT?!"
        className="absolute w-screen h-screen object-cover opacity-20"
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-5 gap-4">
          {/* Category Headers */}
          {categories.map((category) => (
            <div
              key={category.audio}
              className="text-center font-bold text-xl mb-4 text-white"
            >
              <img
                src={category.thumbnail}
                alt="Category thumbnail"
                className="w-full h-32 object-cover rounded mb-2"
              />
            </div>
          ))}

          {/* Question Grid */}
          {pointValues.map((points) => (
            <Fragment key={`row-${points}`}>
              {categories.map((category) => {
                const question = category.questions.find(
                  (q) => q.points === points
                );
                return (
                  <JeopardyTile
                    key={`tile-${category.audio}-${points}`}
                    category={category}
                    points={points}
                    isPlayed={question?.isPlayed || false}
                    onSelect={() => {
                      setAudioUrl(category.audio);
                      onTileSelect(category, points);
                    }}
                  />
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
