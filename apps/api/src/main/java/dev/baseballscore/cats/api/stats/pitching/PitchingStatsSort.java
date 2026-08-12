package dev.baseballscore.cats.api.stats.pitching;

import dev.baseballscore.cats.api.common.exception.BadRequestException;
import java.util.Arrays;

/** 投手成績一覧で使用できる並び順。 */
public enum PitchingStatsSort {
  EARNED_RUN_AVERAGE("earnedRunAverage"),
  WINS("wins"),
  STRIKEOUTS("strikeouts"),
  SAVES("saves"),
  HOLDS("holds"),
  OUTS_PITCHED("outsPitched"),
  GAMES("games");

  private final String value;

  PitchingStatsSort(String value) {
    this.value = value;
  }

  public String value() {
    return this.value;
  }

  /**
   * API queryのsort値を変換する。
   *
   * <p>null・空白はearnedRunAverage、未知の値は不正なqueryとして扱う。
   *
   * @param value API queryのsort値
   * @return 変換された並び順
   * @throws BadRequestException 未知のsortが指定された場合
   */
  public static PitchingStatsSort fromValue(String value) {
    if (value == null || value.isBlank()) {
      return EARNED_RUN_AVERAGE;
    }

    var normalizedValue = value.trim();
    return Arrays.stream(values())
        .filter(pitchingStatsSort -> pitchingStatsSort.value.equalsIgnoreCase(normalizedValue))
        .findFirst()
        .orElseThrow(
            () -> new BadRequestException("Invalid pitching stats sort: " + normalizedValue));
  }
}
