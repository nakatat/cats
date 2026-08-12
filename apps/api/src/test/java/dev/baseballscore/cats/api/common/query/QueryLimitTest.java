package dev.baseballscore.cats.api.common.query;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import dev.baseballscore.cats.api.common.exception.BadRequestException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class QueryLimitTest {

  @Test
  @DisplayName("limitがnullの場合はデフォルト値5を返す")
  void normalize_returnsDefaultWhenLimitIsNull() {
    assertEquals(5, QueryLimit.normalize(null, "ranking"));
  }

  @Test
  @DisplayName("limitは1以上20以下の境界値を受け付ける")
  void normalize_acceptsMinimumAndMaximum() {
    assertEquals(1, QueryLimit.normalize(1, "ranking"));
    assertEquals(20, QueryLimit.normalize(20, "ranking"));
  }

  @Test
  @DisplayName("limitが0以下の場合はINVALID_QUERY_PARAMETERを返す")
  void normalize_rejectsLowerThanMinimum() {
    var exception =
        assertThrows(BadRequestException.class, () -> QueryLimit.normalize(0, "ranking"));

    assertEquals("INVALID_QUERY_PARAMETER", exception.getCode());
    assertEquals("リクエストパラメータが不正です。", exception.getResponseMessage());
  }

  @Test
  @DisplayName("limitが20を超える場合はINVALID_QUERY_PARAMETERを返す")
  void normalize_rejectsHigherThanMaximum() {
    var exception =
        assertThrows(BadRequestException.class, () -> QueryLimit.normalize(21, "ranking"));

    assertEquals("INVALID_QUERY_PARAMETER", exception.getCode());
    assertEquals("リクエストパラメータが不正です。", exception.getResponseMessage());
  }
}
