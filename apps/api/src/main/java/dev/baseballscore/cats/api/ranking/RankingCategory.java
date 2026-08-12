package dev.baseballscore.cats.api.ranking;

import dev.baseballscore.cats.api.common.exception.BadRequestException;
import java.util.Arrays;
import java.util.List;

/**
 * ランキングの指標と、その指標が打撃・投手のどちらに属するかを表す。
 *
 * <p>categoryが未指定の場合に使用する既定カテゴリ群もこのenumで定義する。
 */
public enum RankingCategory {
  BATTING_AVERAGE("battingAverage", "打率", true),
  HITS("hits", "安打", true),
  HOME_RUNS("homeRuns", "本塁打", true),
  RUNS_BATTED_IN("runsBattedIn", "打点", true),
  STOLEN_BASES("stolenBases", "盗塁", true),
  OPS("ops", "OPS", true),
  EARNED_RUN_AVERAGE("earnedRunAverage", "防御率", false),
  WINS("wins", "勝利数", false),
  STRIKEOUTS("strikeouts", "奪三振", false),
  SAVES("saves", "セーブ数", false),
  HOLDS("holds", "ホールド数", false);

  private final String value;
  private final String label;
  private final boolean batting;

  RankingCategory(String value, String label, boolean batting) {
    this.value = value;
    this.label = label;
    this.batting = batting;
  }

  public String value() {
    return this.value;
  }

  public String label() {
    return this.label;
  }

  public boolean isBatting() {
    return this.batting;
  }

  public boolean isPitching() {
    return !this.batting;
  }

  /**
   * API queryのcategory値を変換する。
   *
   * <p>null・空白は未指定としてnullを返し、既知の値は大文字小文字を区別せず変換する。 未知の値は不正なqueryとして扱う。
   *
   * @param value API queryのcategory値
   * @return 変換されたカテゴリ。未指定の場合はnull
   * @throws BadRequestException 未知のcategoryが指定された場合
   */
  public static RankingCategory fromValue(String value) {
    if (value == null || value.isBlank()) {
      return null;
    }

    var normalizedValue = value.trim();
    return Arrays.stream(values())
        .filter(rankingCategory -> rankingCategory.value.equalsIgnoreCase(normalizedValue))
        .findFirst()
        .orElseThrow(() -> new BadRequestException("Invalid ranking category: " + normalizedValue));
  }

  /** category未指定時に使用する打撃ランキングの既定カテゴリを返す。 */
  public static List<RankingCategory> defaultBattingCategories() {
    return List.of(BATTING_AVERAGE, HITS, HOME_RUNS, RUNS_BATTED_IN, STOLEN_BASES, OPS);
  }

  /** category未指定時に使用する投手ランキングの既定カテゴリを返す。 */
  public static List<RankingCategory> defaultPitchingCategories() {
    return List.of(EARNED_RUN_AVERAGE, WINS, STRIKEOUTS, SAVES);
  }

  /** 打撃・投手を合わせた既定カテゴリを返す。 */
  public static List<RankingCategory> defaultCategories() {
    return List.of(
        BATTING_AVERAGE,
        HITS,
        HOME_RUNS,
        RUNS_BATTED_IN,
        STOLEN_BASES,
        OPS,
        EARNED_RUN_AVERAGE,
        WINS,
        STRIKEOUTS,
        SAVES);
  }
}
