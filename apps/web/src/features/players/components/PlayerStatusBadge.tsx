import { Badge } from '@/components/ui/badge';
import type { PlayerResponse } from '@/lib/api/players';

export function PlayerStatusBadge({
  player,
}: Readonly<{ player: PlayerResponse }>) {
  const isActive = player.leftAt == null;

  return (
    <Badge
      variant={isActive ? 'default' : 'secondary'}
      className={
        isActive
          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100'
          : 'bg-muted text-muted-foreground hover:bg-muted'
      }
    >
      {isActive ? '在籍中' : '退団'}
    </Badge>
  );
}
