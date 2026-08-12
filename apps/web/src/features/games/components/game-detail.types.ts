import type { GameResponse, ScoreboardResponse } from '@/lib/api/games';

/**
 * Scoreboardの登録状態。
 *
 * `not_batted`などのイニング状態とは異なり、試合全体の登録進捗を表す。
 */
export type InningScoreStatus = NonNullable<ScoreboardResponse['status']>;

/**
 * イニングスコア表で利用する表示用のチーム行。
 *
 * APIのscoreboard rowから変換され、`innings`の配列位置は1イニング目を0とする。
 */
export type InningScoreRow = {
  scoreLineId?: number;
  teamName: string;
  logoUrl?: string | null;
  /** 未登録イニングはnull、攻撃しなかったイニングは`×`などの表示値を保持する。 */
  innings: Array<number | string | null>;
  /** 合計得点。scoreboard未登録時の表示値を含められるよう文字列も許容する。 */
  runs: number | string;
  /** 合計安打。scoreboard未登録時の表示値を含められるよう文字列も許容する。 */
  hits: number | string;
  /** 合計失策。scoreboard未登録時の表示値を含められるよう文字列も許容する。 */
  errors: number | string;
};

/** 試合詳細の前後移動に必要な最小限の試合表示情報。 */
export type GameNavigationItem = Pick<
  GameResponse,
  'gameId' | 'gameDate' | 'opponentName'
>;
