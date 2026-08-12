import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { PlayerResponse } from '@/lib/api/players';

import { getPlayerImageFallback } from './player-image';

export function PlayerAvatar({ player }: Readonly<{ player: PlayerResponse }>) {
  const name = player.name?.replace(/\s/g, '') || '';
  const fallback = getPlayerImageFallback(player);

  return (
    <Avatar size="lg" className="bg-primary/10 text-primary after:hidden">
      {player.profileImageUrl && (
        <AvatarImage
          src={player.profileImageUrl}
          alt={`${name}のプロフィール画像`}
        />
      )}
      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
}
