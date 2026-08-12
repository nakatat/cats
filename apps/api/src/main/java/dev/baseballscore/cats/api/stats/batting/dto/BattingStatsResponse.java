package dev.baseballscore.cats.api.stats.batting.dto;

import dev.baseballscore.cats.api.common.statistics.StatisticsRate;
import dev.baseballscore.cats.api.stats.batting.mapper.model.BattingStatsRow;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Schema(name = "BattingStatsResponse", description = "選手別打撃成績")
public record BattingStatsResponse(
    @Schema(description = "選手ID", example = "1") Long playerId,
    @Schema(description = "表示名", example = "山田 太郎") String displayName,
    @Schema(description = "プロフィール画像URL") String profileImageUrl,
    @Schema(description = "背番号", example = "7") String uniformNumber,
    @Schema(description = "助っ人かどうか", example = "false") boolean guest,
    @Schema(description = "試合数", example = "5") Integer games,
    @Schema(description = "打席数", example = "18") Integer plateAppearances,
    @Schema(description = "打数", example = "15") Integer atBats,
    @Schema(description = "安打", example = "6") Integer hits,
    @Schema(description = "二塁打", example = "2") Integer doubles,
    @Schema(description = "三塁打", example = "0") Integer triples,
    @Schema(description = "本塁打", example = "1") Integer homeRuns,
    @Schema(description = "打点", example = "5") Integer runsBattedIn,
    @Schema(description = "得点", example = "4") Integer runs,
    @Schema(description = "四球", example = "2") Integer walks,
    @Schema(description = "死球", example = "1") Integer hitByPitch,
    @Schema(description = "三振", example = "3") Integer strikeouts,
    @Schema(description = "犠打", example = "0") Integer sacrificeHits,
    @Schema(description = "犠飛", example = "0") Integer sacrificeFlies,
    @Schema(description = "盗塁", example = "2") Integer stolenBases,
    @Schema(description = "盗塁死", example = "1") Integer caughtStealing,
    @Schema(description = "敵失出塁", example = "1") Integer reachedOnErrors,
    @Schema(description = "打率", example = "0.400") String battingAverage,
    @Schema(description = "出塁率", example = "0.500") String onBasePercentage,
    @Schema(description = "長打率", example = "0.733") String sluggingPercentage,
    @Schema(description = "OPS", example = "1.233") String ops) {

  /**
   * 集計済み打撃行をAPI responseへ変換し、打率・出塁率・長打率・OPSを算出する。
   *
   * <p>nullableな集計値は計算上0として扱う。長打率は単打・二塁打・三塁打・本塁打から塁打数を作り、 OPSは出塁率と長打率の合計とする。各率は小数第3位まで整える。
   *
   * @param battingStatsRow 集計元の打撃行
   * @return API response
   */
  public static BattingStatsResponse from(BattingStatsRow battingStatsRow) {
    var battingAverage =
        StatisticsRate.format(
            safeValue(battingStatsRow.getHits()), safeValue(battingStatsRow.getAtBats()));
    var onBasePercentage =
        StatisticsRate.format(
            safeValue(battingStatsRow.getHits())
                + safeValue(battingStatsRow.getWalks())
                + safeValue(battingStatsRow.getHitByPitch()),
            safeValue(battingStatsRow.getAtBats())
                + safeValue(battingStatsRow.getWalks())
                + safeValue(battingStatsRow.getHitByPitch())
                + safeValue(battingStatsRow.getSacrificeFlies()));
    var totalBases =
        battingStatsRow.getHits()
            - battingStatsRow.getDoubles()
            - battingStatsRow.getTriples()
            - battingStatsRow.getHomeRuns()
            + battingStatsRow.getDoubles() * 2
            + battingStatsRow.getTriples() * 3
            + battingStatsRow.getHomeRuns() * 4;
    var sluggingPercentage =
        StatisticsRate.format(totalBases, safeValue(battingStatsRow.getAtBats()));
    var ops = addRates(onBasePercentage, sluggingPercentage);

    return new BattingStatsResponse(
        battingStatsRow.getPlayerId(),
        battingStatsRow.getDisplayName(),
        battingStatsRow.getProfileImageUrl(),
        battingStatsRow.getUniformNumber(),
        battingStatsRow.isGuest(),
        battingStatsRow.getGames(),
        battingStatsRow.getPlateAppearances(),
        battingStatsRow.getAtBats(),
        battingStatsRow.getHits(),
        battingStatsRow.getDoubles(),
        battingStatsRow.getTriples(),
        battingStatsRow.getHomeRuns(),
        battingStatsRow.getRunsBattedIn(),
        battingStatsRow.getRuns(),
        battingStatsRow.getWalks(),
        battingStatsRow.getHitByPitch(),
        battingStatsRow.getStrikeouts(),
        battingStatsRow.getSacrificeHits(),
        battingStatsRow.getSacrificeFlies(),
        battingStatsRow.getStolenBases(),
        battingStatsRow.getCaughtStealing(),
        battingStatsRow.getReachedOnErrors(),
        battingAverage,
        onBasePercentage,
        sluggingPercentage,
        ops);
  }

  private static long safeValue(Integer value) {
    return value == null ? 0L : value.longValue();
  }

  private static String addRates(String first, String second) {
    return new BigDecimal(first)
        .add(new BigDecimal(second))
        .setScale(3, RoundingMode.HALF_UP)
        .toPlainString();
  }
}
