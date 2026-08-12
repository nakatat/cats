import type {
  BattingLineResponse,
  GameResponse,
  PitchingLineResponse,
} from '@/lib/api/games';
import type {
  BattingStatsResponse,
  PitchingStatsResponse,
} from '@/lib/api/players';

/**
 * 選手詳細の直近試合1件分。
 *
 * 打撃・投手のどちらか一方だけ出場した試合も含められるよう、成績行は個別にoptionalとする。
 */
export type PlayerRecentGame = {
  game: GameResponse;
  /** 該当試合で打撃成績がある場合だけ設定する。 */
  battingLine?: BattingLineResponse;
  /** 該当試合で投球成績がある場合だけ設定する。 */
  pitchingLine?: PitchingLineResponse;
};

/**
 * 選手のシーズン別成績を表示するためのUI用型。
 *
 * seasonに該当する成績がないカテゴリはundefinedとなり、その年度の行から除外される。
 * 呼び出し側で年度の新しい順に整列して渡す。
 */
export type PlayerSeasonStats = {
  /** APIのseason year。 */
  year: number;
  /** その年度に打撃成績がある場合だけ設定する。 */
  batting?: BattingStatsResponse;
  /** その年度に投手成績がある場合だけ設定する。 */
  pitching?: PitchingStatsResponse;
};
