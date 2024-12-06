import AudioQuizGame from "@/components/AudioQuizGame";

export default function GamePage() {
  const audioUrl =
    "https://utfs.io/f/RjVHnBtym1HvfJYkg24yLP65HltyCYGUE8sw0c4RJgDjrbfN";

  return (
    <main className="min-h-screen p-8">
      <AudioQuizGame audioUrl={audioUrl} />
    </main>
  );
}
