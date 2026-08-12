package dev.baseballscore.cats.api.stats.pitching.dto;

import dev.baseballscore.cats.api.common.statistics.StatisticsRate;
import dev.baseballscore.cats.api.stats.pitching.mapper.model.PitchingStatsRow;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "PitchingStatsResponse", description = "選手別投手成績")
public record PitchingStatsResponse(
    @Schema(description = "選手ID", example = "3") Long playerId,
    @Schema(description = "表示名", example = "佐藤 一郎") String displayName,
    @Schema(description = "プロフィール画像URL") String profileImageUrl,
    @Schema(description = "背番号", example = "18") String uniformNumber,
    @Schema(description = "助っ人かどうか", example = "false") boolean guest,
    @Schema(description = "試合数", example = "4") Integer games,
    @Schema(description = "取ったアウト数", example = "48") Integer outsPitched,
    @Schema(description = "対戦打者数", example = "72") Integer battersFaced,
    @Schema(description = "投球数", example = "260") Integer pitches,
    @Schema(description = "被安打", example = "14") Integer hitsAllowed,
    @Schema(description = "被本塁打", example = "1") Integer homeRunsAllowed,
    @Schema(description = "失点", example = "8") Integer runsAllowed,
    @Schema(description = "自責点", example = "5") Integer earnedRuns,
    @Schema(description = "四球", example = "6") Integer walks,
    @Schema(description = "死球", example = "1") Integer hitBatters,
    @Schema(description = "奪三振", example = "20") Integer strikeouts,
    @Schema(description = "勝利数", example = "2") Integer wins,
    @Schema(description = "敗戦数", example = "1") Integer losses,
    @Schema(description = "セーブ数", example = "0") Integer saves,
    @Schema(description = "ホールド数", example = "1") Integer holds,
    @Schema(description = "投球回表示", example = "16回") String inningsPitchedText,
    @Schema(description = "防御率", example = "2.188") String earnedRunAverage,
    @Schema(description = "与四球被安打率", example = "1.250") String walksAndHitsPerInningPitched,
    @Schema(description = "7回あたり奪三振", example = "8.750") String strikeoutsPerSevenInnings) {

  /**
   * 集計済み投手行をAPI responseへ変換し、投球回表示と投手率を算出する。
   *
   * <p>投球回は3アウトを1回として表し、余りは整数の回数に続けて{@code 1/3}または{@code 2/3}とする。
   * 防御率は自責点、WHIPは被安打と四球、奪三振率は奪三振を元に算出し、 nullableな値は計算上0として扱うため投球アウト数がない場合の率は{@code 0.000}になる。
   *
   * @param pitchingStatsRow 集計元の投手行
   * @return API response
   */
  public static PitchingStatsResponse from(PitchingStatsRow pitchingStatsRow) {
    var outsPitched = pitchingStatsRow.getOutsPitched();
    var earnedRunAverage =
        StatisticsRate.format(
            safeValue(pitchingStatsRow.getEarnedRuns()) * 21L, safeValue(outsPitched));
    var walksAndHitsPerInningPitched =
        StatisticsRate.format(
            (safeValue(pitchingStatsRow.getWalks()) + safeValue(pitchingStatsRow.getHitsAllowed()))
                * 3L,
            safeValue(outsPitched));
    var strikeoutsPerSevenInnings =
        StatisticsRate.format(
            safeValue(pitchingStatsRow.getStrikeouts()) * 21L, safeValue(outsPitched));

    return new PitchingStatsResponse(
        pitchingStatsRow.getPlayerId(),
        pitchingStatsRow.getDisplayName(),
        pitchingStatsRow.getProfileImageUrl(),
        pitchingStatsRow.getUniformNumber(),
        pitchingStatsRow.isGuest(),
        pitchingStatsRow.getGames(),
        pitchingStatsRow.getOutsPitched(),
        pitchingStatsRow.getBattersFaced(),
        pitchingStatsRow.getPitches(),
        pitchingStatsRow.getHitsAllowed(),
        pitchingStatsRow.getHomeRunsAllowed(),
        pitchingStatsRow.getRunsAllowed(),
        pitchingStatsRow.getEarnedRuns(),
        pitchingStatsRow.getWalks(),
        pitchingStatsRow.getHitByPitch(),
        pitchingStatsRow.getStrikeouts(),
        pitchingStatsRow.getWins(),
        pitchingStatsRow.getLosses(),
        pitchingStatsRow.getSaves(),
        pitchingStatsRow.getHolds(),
        toInningsPitchedText(outsPitched),
        earnedRunAverage,
        walksAndHitsPerInningPitched,
        strikeoutsPerSevenInnings);
  }

  private static String toInningsPitchedText(Integer outsPitched) {
    if (outsPitched == null || outsPitched == 0) {
      return "0回";
    }

    var wholeInnings = outsPitched / 3;
    var remainder = outsPitched % 3;
    if (remainder == 0) {
      return wholeInnings + "回";
    }
    return wholeInnings + "回" + remainder + "/3";
  }

  private static long safeValue(Integer value) {
    return value == null ? 0L : value.longValue();
  }
}
