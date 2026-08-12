import type { PlayerResponse } from '@/lib/api/players';

/**
 * 選手の投球・打撃の左右を「投 / 打」形式へ変換する。
 *
 * <p>両方の情報がない場合は表示項目自体を省略できるようundefinedを返し、
 * 片方だけない場合はその側を`—`で補完する。
 */
export function formatPitchInfo(player: PlayerResponse) {
  if (!player.throwingHand && !player.battingHand) {
    return undefined;
  }

  return `${player.throwingHand || '—'}投 / ${player.battingHand || '—'}打`;
}

/**
 * joinedAtの日付文字列から加入年だけを取り出す。
 *
 * <p>加入日がない場合は表示項目を省略できるようundefinedを返す。
 */
export function formatJoinedYear(joinedAt?: string) {
  return joinedAt ? `${joinedAt.slice(0, 4)}年` : undefined;
}
