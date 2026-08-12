import { Crown, Medal } from 'lucide-react';

export function RankBadge({ rank }: Readonly<{ rank: number }>) {
  if (rank === 1) {
    return (
      <span className="inline-flex items-center justify-center">
        <span className="sr-only">1位</span>
        <Crown aria-hidden="true" className="text-secondary size-4" />
      </span>
    );
  }

  if (rank === 2 || rank === 3) {
    const medalColor = rank === 2 ? 'text-slate-400' : 'text-amber-700';

    return (
      <span className="inline-flex items-center justify-center">
        <span className="sr-only">{rank}位</span>
        <Medal aria-hidden="true" className={`size-4 ${medalColor}`} />
      </span>
    );
  }

  return rank;
}
