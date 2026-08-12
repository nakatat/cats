package dev.baseballscore.cats.api.common.statistics;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class StatisticsRateTest {

  @Test
  @DisplayName("denominatorが0の場合は0.000を返す")
  void format_returnsZeroWhenDenominatorIsZero() {
    assertEquals("0.000", StatisticsRate.format(10, 0));
  }

  @Test
  @DisplayName("率を小数第3位までHALF_UPで丸める")
  void format_roundsToThreeDecimalPlacesWithHalfUp() {
    assertEquals("0.333", StatisticsRate.format(1, 3));
    assertEquals("0.167", StatisticsRate.format(1, 6));
    assertEquals("0.667", StatisticsRate.format(2, 3));
  }

  @Test
  @DisplayName("整数部を含む率も小数第3位のplain textで返す")
  void format_preservesScaleForIntegerPart() {
    assertEquals("1.250", StatisticsRate.format(5, 4));
  }
}
