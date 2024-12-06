import { Fragment } from "react";
import JeopardyTile from "./JeopardyTile";

interface Category {
  name: string;
  questions: {
    points: number;
    isPlayed: boolean;
  }[];
}

interface JeopardyBoardProps {
  categories: Category[];
  onTileSelect: (category: string, points: number) => void;
}

export default function JeopardyBoard({
  categories,
  onTileSelect,
}: JeopardyBoardProps) {
  const pointValues = [100, 200, 300, 400, 500];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        Audio Quiz Challenge
      </h1>
      <div className="grid grid-cols-6 gap-4">
        {/* Category Headers */}
        {categories.map((category) => (
          <div
            key={category.name}
            className="text-center font-bold text-xl mb-4 text-white"
          >
            {category.name}
          </div>
        ))}

        {/* Question Grid */}
        {pointValues.map((points) => (
          <Fragment key={points}>
            {categories.map((category) => {
              const question = category.questions.find(
                (q) => q.points === points
              );
              return (
                <JeopardyTile
                  key={`${category.name}-${points}`}
                  category={category.name}
                  points={points}
                  isPlayed={question?.isPlayed || false}
                  onSelect={() => onTileSelect(category.name, points)}
                />
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
