import type { PlayerResponse } from '@/lib/api/players';

export function getPlayerImageFallback(
  player: Pick<PlayerResponse, 'name' | 'uniformNumber'>
) {
  const name = player.name?.replace(/\s/g, '') || '';

  return name.slice(0, 1) || player.uniformNumber || '—';
}
