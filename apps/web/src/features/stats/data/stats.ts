import type { RankingResponse } from '@/lib/api/rankings';

/** Stats一覧の規定到達フィルター。`qualified`は規定到達者だけを表示する。 */
export type StatsFilterValue = 'all' | 'qualified';

export const CAREER_SEASON = 'career';

/**
 * Stats画面の打撃表で直接利用する表示用データ。
 *
 * APIのnullableな集計値は0へ補完し、率は画面表示用の文字列へ変換済み。
 */
export type BattingStat = {
  playerId: number;
  /** APIの順位ではなく、現在の表示順に基づく1始まりの行順位。 */
  rank: number;
  /** 背番号。APIにない場合は`—`へ補完される。 */
  uniformNumber: string;
  /** 選手名。APIにない場合は表示用placeholderへ補完される。 */
  playerName: string;
  /** 画像がない場合はAvatarのfallback表示を使用する。 */
  profileImageUrl?: string;
  position?: '投' | '捕' | '内' | '外';
  /** 打率・出塁率・長打率・OPSなどの画面表示用率文字列。 */
  battingAverage: string;
  games: number;
  /** 規定打席判定に使用する打席数。 */
  plateAppearances: number;
  atBats: number;
  hits: number;
  homeRuns: number;
  runsBattedIn: number;
  runs: number;
  stolenBases: number;
  onBasePercentage: string;
  sluggingPercentage: string;
  ops: string;
  /** 規定打席数以上の打席があるか。閾値が取得できない場合はfalse。 */
  isQualified: boolean;
};

/**
 * Stats画面の投手表で直接利用する表示用データ。
 *
 * `outsPitched`は判定用の整数アウト数、`inningsPitched`は画面表示用の野球表記を保持する。
 * nullableな集計値は0または表示用placeholderへ補完済み。
 */
export type PitchingStat = {
  playerId: number;
  /** APIの順位ではなく、現在の表示順に基づく1始まりの行順位。 */
  rank: number;
  /** 背番号。APIにない場合は`—`へ補完される。 */
  uniformNumber: string;
  /** 選手名。APIにない場合は表示用placeholderへ補完される。 */
  playerName: string;
  /** 画像がない場合はAvatarのfallback表示を使用する。 */
  profileImageUrl?: string;
  /** 防御率の画面表示用率文字列。 */
  era: string;
  games: number;
  wins: number;
  losses: number;
  saves: number;
  /** 規定投球回判定に使用する整数の投球アウト数。 */
  outsPitched?: number;
  /** 投球アウト数を`N回`・`N回1/3`・`N回2/3`へ変換した表示値。 */
  inningsPitched: string;
  strikeouts: number;
  walks: number;
  whip: string;
  hitsAllowed: number;
  runsAllowed: number;
  earnedRuns: number;
  /** 規定投球回数以上の投球アウトがあるか。閾値が取得できない場合はfalse。 */
  isQualified: boolean;
};

/** チーム成績サマリーカード1枚分の表示用データ。 */
export type TeamStatsMetric = {
  label: string;
  /** すでに表示用へ整形された値。率も数値ではなく文字列で保持する。 */
  value: string;
  /** 値の後ろに表示する単位。率など単位が不要な指標では省略する。 */
  unit?: string;
  comparison: string;
  icon:
    | 'average'
    | 'home-run'
    | 'runs'
    | 'on-base'
    | 'slugging'
    | 'ops'
    | 'era'
    | 'wins'
    | 'strikeouts'
    | 'whip';
};

/** 同率leaderの個人表示に使用する選手情報。 */
export type StatLeaderPlayer = {
  playerId: number;
  playerName: string;
  /** 同率leaderの補助表示。未登録の場合は省略する。 */
  uniformNumber?: string;
  profileImageUrl?: string;
};

/**
 * Stats画面のleaderカード1枚分の表示用データ。
 *
 * 同率leaderがある場合は`players`に該当者をまとめ、単独leaderでは省略する。
 */
export type StatLeader = {
  metric: string;
  playerId: number;
  playerName: string;
  /** leaderの画面表示用背番号。未登録時はplaceholderを含む。 */
  uniformNumber: string;
  /** APIの率や数値を画面に表示するための文字列。 */
  value: string;
  /** valueの後ろに表示する単位。率など単位が不要な指標では省略する。 */
  unit?: string;
  profileImageUrl?: string;
  /** 同率1位の候補をまとめた選手一覧。単独データでは省略されることがある。 */
  players?: StatLeaderPlayer[];
};

/**
 * Stats画面で直接利用する表示用データ。
 *
 * season解決、率の整形、規定到達判定、leader選出を終えた状態を保持し、
 * API responseをそのまま再公開する型ではない。
 */
export type StatsViewData = {
  /** 選択中の年度、または全期間を表す`career`。 */
  season: string;
  /** 年度選択肢。年度の新しい順で、`career`は別途扱う。 */
  seasons: string[];
  /** 規定打席数。取得できない場合はnull。 */
  battingQualificationThreshold: number | null;
  /** 規定投球回を判定するための整数アウト数。取得できない場合はnull。 */
  pitchingQualificationThresholdOuts: number | null;
  /** 規定投球回の画面表示文字列。取得できない場合はnull。 */
  pitchingQualificationThresholdText: string | null;
  battingSummary: TeamStatsMetric[];
  pitchingSummary: TeamStatsMetric[];
  battingLeaders: StatLeader[];
  pitchingLeaders: StatLeader[];
  /** 通常・規定別のranking。個別取得失敗時は各entryが未設定となりうる。 */
  rankings?: {
    all?: RankingResponse;
    qualified?: RankingResponse;
  };
  /** nullableなAPI値を表示用へ補完済みの打撃成績。 */
  batting: BattingStat[];
  /** nullableなAPI値を表示用へ補完済みの投手成績。 */
  pitching: PitchingStat[];
};
