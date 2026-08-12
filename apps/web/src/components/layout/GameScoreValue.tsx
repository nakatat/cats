export function GameScoreValue({
  score,
  placeholder,
  isWinner,
}: Readonly<{
  score?: number | null;
  placeholder: number | string;
  isWinner: boolean;
}>) {
  return (
    <span
      className={`inline-flex w-[2.5ch] justify-center ${isWinner ? 'text-primary' : ''}`}
    >
      {score ?? placeholder}
    </span>
  );
}
