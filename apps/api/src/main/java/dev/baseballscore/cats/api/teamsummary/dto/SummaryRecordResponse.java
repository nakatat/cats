package dev.baseballscore.cats.api.teamsummary.dto;

import dev.baseballscore.cats.api.common.statistics.StatisticsRate;
import dev.baseballscore.cats.api.teamsummary.mapper.model.SummaryRecordRow;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "SummaryRecordResponse", description = "成績サマリー")
public record SummaryRecordResponse(
    @Schema(description = "試合数", example = "10") Integer games,
    @Schema(description = "勝利数", example = "6") Integer wins,
    @Schema(description = "敗戦数", example = "3") Integer losses,
    @Schema(description = "引き分け数", example = "1") Integer draws,
    @Schema(description = "勝率", example = "0.667") String winningPercentage,
    @Schema(description = "総得点", example = "48") Integer runsFor,
    @Schema(description = "総失点", example = "35") Integer runsAgainst) {

  /**
   * チーム成績の集計行をAPI responseへ変換する。
   *
   * <p>勝率は勝利数を勝利数と敗戦数の合計で割って算出し、引き分けは分母に含めない。 nullableな勝敗数は0として扱い、勝敗がない場合は{@code 0.000}を返す。
   *
   * @param summaryRecordRow 集計元のチーム成績行
   * @return API response
   */
  public static SummaryRecordResponse from(SummaryRecordRow summaryRecordRow) {
    return new SummaryRecordResponse(
        summaryRecordRow.getGames(),
        summaryRecordRow.getWins(),
        summaryRecordRow.getLosses(),
        summaryRecordRow.getDraws(),
        toWinningPercentage(summaryRecordRow.getWins(), summaryRecordRow.getLosses()),
        summaryRecordRow.getRunsFor(),
        summaryRecordRow.getRunsAgainst());
  }

  private static String toWinningPercentage(Integer wins, Integer losses) {
    var safeWins = wins == null ? 0 : wins;
    var safeLosses = losses == null ? 0 : losses;
    var denominator = safeWins + safeLosses;
    if (denominator == 0) {
      return "0.000";
    }
    return StatisticsRate.format(safeWins, denominator);
  }
}
