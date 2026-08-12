import type {
  BattingLineResponse,
  PitchingLineResponse,
} from '@/lib/api/games';
import { formatRate } from '@/lib/formatters';

/**
 * 投球アウト数を画面で使う投球回表記へ変換する。
 *
 * <p>3アウトを1回として扱い、余りの1アウト・2アウトは整数の回数に続けて
 * `1/3`・`2/3`で表現する。これは10進数の小数ではない。
 * アウト数がない場合はplaceholderを返す。
 */
export function formatRecentGameOuts(outsPitched?: number) {
  if (outsPitched == null) return '—';
  const innings = Math.floor(outsPitched / 3);
  const remainder = outsPitched % 3;
  return remainder === 0 ? `${innings}回` : `${innings}回${remainder}/3`;
}

/**
 * 打数を分母とする打率を、画面用の3桁固定表記で算出する。
 *
 * 打数がない場合は`.000`を返す。
 */
export function calculateBattingAverage(line: BattingLineResponse) {
  return formatRecentRate(line.hits, line.atBats);
}

/**
 * 安打・四球・死球を出塁側に、打数・四球・死球・犠飛を分母側に加えて出塁率を算出する。
 *
 * nullableな成績値は0として扱い、分母が0の場合は`.000`を返す。
 */
export function calculateOnBasePercentage(line: BattingLineResponse) {
  return formatRecentRate(
    (line.hits ?? 0) + (line.walks ?? 0) + (line.hitByPitch ?? 0),
    (line.atBats ?? 0) +
      (line.walks ?? 0) +
      (line.hitByPitch ?? 0) +
      (line.sacrificeFlies ?? 0)
  );
}

/**
 * 単打・二塁打・三塁打・本塁打の塁打数を合算して長打率を算出する。
 *
 * 分母は打数とし、打数がない場合は`.000`を返す。
 */
export function calculateSluggingPercentage(line: BattingLineResponse) {
  const totalBases =
    (line.hits ?? 0) -
    (line.doubles ?? 0) -
    (line.triples ?? 0) -
    (line.homeRuns ?? 0) +
    (line.doubles ?? 0) * 2 +
    (line.triples ?? 0) * 3 +
    (line.homeRuns ?? 0) * 4;
  return formatRecentRate(totalBases, line.atBats);
}

/**
 * 表示用に算出した出塁率と長打率を加算してOPSを作成する。
 *
 * <p>加算前の各率は3桁へ整形され、結果も3桁表記になる。
 */
export function calculateOps(line: BattingLineResponse) {
  return formatRate(
    (
      Number(calculateOnBasePercentage(line)) +
      Number(calculateSluggingPercentage(line))
    ).toFixed(3)
  );
}

/**
 * 自責点を21アウト基準へ換算して防御率を算出する。
 *
 * <p>この換算は現在の画面表示・APIの成績規則に合わせたもので、
 * 投球アウト数が0または未設定の場合は`.000`を返す。
 */
export function calculatePitchingEarnedRunAverage(line: PitchingLineResponse) {
  return formatRecentRate((line.earnedRuns ?? 0) * 21, line.outsPitched);
}

/**
 * 被安打と四球の合計を投球回あたりへ換算してWHIPを算出する。
 *
 * 投球アウト数が0または未設定の場合は`.000`を返す。
 */
export function calculatePitchingWhip(line: PitchingLineResponse) {
  return formatRecentRate(
    ((line.walks ?? 0) + (line.hitsAllowed ?? 0)) * 3,
    line.outsPitched
  );
}

/**
 * 奪三振を7回相当の率へ換算する。
 *
 * 21アウトを7回として計算し、投球アウト数が0または未設定の場合は`.000`を返す。
 */
export function calculatePitchingStrikeoutsPerSeven(
  line: PitchingLineResponse
) {
  return formatRecentRate((line.strikeouts ?? 0) * 21, line.outsPitched);
}

function formatRecentRate(numerator?: number, denominator?: number) {
  if (denominator == null || denominator === 0) {
    return '.000';
  }

  return formatRate(((numerator ?? 0) / denominator).toFixed(3));
}
