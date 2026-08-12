package dev.baseballscore.cats.api.stats.batting;

import dev.baseballscore.cats.api.common.exception.BadRequestException;
import java.util.Arrays;

/** 打撃成績一覧で使用できる並び順。 */
public enum BattingStatsSort {
  BATTING_AVERAGE("battingAverage"),
  HITS("hits"),
  HOME_RUNS("homeRuns"),
  RUNS_BATTED_IN("runsBattedIn"),
  OPS("ops"),
  GAMES("games");

  private final String value;

  BattingStatsSort(String value) {
    this.value = value;
  }

  public String value() {
    return this.value;
  }

  /**
   * API queryのsort値を変換する。
   *
   * <p>null・空白はbattingAverage、未知の値は不正なqueryとして扱う。
   *
   * @param value API queryのsort値
   * @return 変換された並び順
   * @throws BadRequestException 未知のsortが指定された場合
   */
  public static BattingStatsSort fromValue(String value) {
    if (value == null || value.isBlank()) {
      return BATTING_AVERAGE;
    }

    var normalizedValue = value.trim();
    return Arrays.stream(values())
        .filter(battingStatsSort -> battingStatsSort.value.equalsIgnoreCase(normalizedValue))
        .findFirst()
        .orElseThrow(
            () -> new BadRequestException("Invalid batting stats sort: " + normalizedValue));
  }
}
