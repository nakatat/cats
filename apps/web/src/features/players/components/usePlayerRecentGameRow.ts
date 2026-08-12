'use client';

import { useRouter } from 'next/navigation';
import type { KeyboardEvent } from 'react';

import type { PlayerRecentGame } from './player-detail.types';

export function usePlayerRecentGameRow(item: PlayerRecentGame) {
  const router = useRouter();
  const gameId = item.game.gameId;
  const gamePath = gameId == null ? undefined : `/games/${gameId}`;

  function navigateToGame() {
    if (gamePath) {
      router.push(gamePath);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTableRowElement>) {
    if (!gamePath || (event.key !== 'Enter' && event.key !== ' ')) {
      return;
    }

    event.preventDefault();
    navigateToGame();
  }

  return {
    'aria-label': gamePath
      ? `${item.game.opponentName || '試合'}の詳細を見る`
      : undefined,
    className: gamePath
      ? 'cursor-pointer focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none'
      : undefined,
    onClick: gamePath ? navigateToGame : undefined,
    onKeyDown: gamePath ? handleKeyDown : undefined,
    role: gamePath ? ('link' as const) : undefined,
    tabIndex: gamePath ? 0 : undefined,
  };
}
