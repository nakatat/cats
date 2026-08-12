package dev.baseballscore.cats.api.scoreboard;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import dev.baseballscore.cats.api.common.exception.BadRequestException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class InningStatusTest {

  @Test
  @DisplayName("fromValue accepts the API values case-insensitively and trims whitespace")
  void fromValue_acceptsApiValues() {
    assertEquals(InningStatus.PLAYED, InningStatus.fromValue(" played "));
    assertEquals(InningStatus.NOT_BATTED, InningStatus.fromValue("NOT_BATTED"));
  }

  @Test
  @DisplayName("fromValue defaults null and blank values to played")
  void fromValue_defaultsMissingValues() {
    assertEquals(InningStatus.PLAYED, InningStatus.fromValue(null));
    assertEquals(InningStatus.PLAYED, InningStatus.fromValue(" "));
  }

  @Test
  @DisplayName("fromValue rejects unknown values")
  void fromValue_rejectsUnknownValues() {
    assertThrows(BadRequestException.class, () -> InningStatus.fromValue("unplayed"));
  }
}
