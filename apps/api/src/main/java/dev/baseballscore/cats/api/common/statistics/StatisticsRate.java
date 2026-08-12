package dev.baseballscore.cats.api.common.statistics;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * 野球成績で使用する割合・率を共通の文字列表現へ変換する。
 *
 * <p>計算結果は小数第3位まで{@link RoundingMode#HALF_UP}で丸め、末尾の0を保持する。 分母が0の場合は計算不能として{@code 0.000}を返す。
 */
public final class StatisticsRate {

  private static final int SCALE = 3;

  private StatisticsRate() {}

  /**
   * 分子を分母で割った率を算出する。
   *
   * @param numerator 分子
   * @param denominator 分母
   * @return 小数第3位まで整えた率。分母が0の場合は{@code 0.000}
   */
  public static String format(long numerator, long denominator) {
    if (denominator == 0) {
      return "0.000";
    }

    return BigDecimal.valueOf(numerator)
        .divide(BigDecimal.valueOf(denominator), SCALE, RoundingMode.HALF_UP)
        .toPlainString();
  }
}
