import { DetailNavigation } from '@/components/layout/DetailNavigation';
import type { PlayerResponse } from '@/lib/api/players';
import { withListQuery } from '@/lib/list-query';

/**
 * 選手詳細の前後移動に使用するProps。
 *
 * previousPlayer・nextPlayerは一覧の現在位置に応じて片方または両方が省略される。
 */
type PlayerNavigationProps = {
  previousPlayer?: PlayerResponse;
  nextPlayer?: PlayerResponse;
  /** 選手一覧へ戻るリンクで維持するfilter/page query。 */
  listQuery?: string;
};

export function PlayerNavigation({
  previousPlayer,
  nextPlayer,
  listQuery,
}: Readonly<PlayerNavigationProps>) {
  const previous = previousPlayer
    ? toNavigationItem(previousPlayer, '前の選手', listQuery)
    : undefined;
  const next = nextPlayer
    ? toNavigationItem(nextPlayer, '次の選手', listQuery)
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
  player: PlayerResponse,
  label: string,
  listQuery?: string
) {
  return {
    href: withListQuery(`/players/${player.playerId ?? 0}`, listQuery),
    label,
    title: `#${player.uniformNumber || '—'} ${player.name || '名前未設定'}`,
  };
}
