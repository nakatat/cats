import {
  DetailNavigation,
  type DetailNavigationItem,
} from '@/components/layout/DetailNavigation';
import { formatGameDateLong } from '@/lib/formatters';
import { withListQuery } from '@/lib/list-query';

import type { GameNavigationItem } from './game-detail.types';

/**
 * 試合詳細間の移動に必要な前後試合と一覧状態。
 *
 * 前後の試合が存在しない場合は、その方向のリンクを表示しない。
 */
type GameNavigationProps = {
  /** 一覧上で現在の試合の直前にある試合。 */
  previousGame?: GameNavigationItem;
  /** 一覧上で現在の試合の直後にある試合。 */
  nextGame?: GameNavigationItem;
  /** 試合一覧へ戻る際にリンクへ引き継ぐURL query文字列。 */
  listQuery?: string;
};

export function GameNavigation({
  previousGame,
  nextGame,
  listQuery,
}: Readonly<GameNavigationProps>) {
  const previous = previousGame
    ? toNavigationItem(previousGame, '前の試合', listQuery)
    : undefined;
  const next = nextGame
    ? toNavigationItem(nextGame, '次の試合', listQuery)
    : undefined;

  return (
    <DetailNavigation
      previous={previous}
      next={next}
      mobileLayout="row"
      hideTitleOnMobile
    />
  );
}

function toNavigationItem(
  game: GameNavigationItem,
  label: string,
  listQuery?: string
): DetailNavigationItem {
  const gameId = game.gameId ?? 0;

  return {
    href: withListQuery(`/games/${gameId}`, listQuery),
    label,
    title: `${formatGameDateLong(game.gameDate)} ${game.opponentName ?? '対戦相手未定'}戦`,
  };
}
