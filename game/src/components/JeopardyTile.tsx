interface JeopardyTileProps {
  category: string;
  points: number;
  isPlayed: boolean;
  onSelect: () => void;
}

export default function JeopardyTile({
  category,
  points,
  isPlayed,
  onSelect,
}: JeopardyTileProps) {
  return (
    <button
      onClick={onSelect}
      disabled={isPlayed}
      className={`w-full h-24 ${
        isPlayed
          ? "bg-gray-800 text-gray-600 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
      } transition-colors duration-200 font-bold text-2xl rounded`}
    >
      {isPlayed ? "✓" : `$${points}`}
    </button>
  );
}
