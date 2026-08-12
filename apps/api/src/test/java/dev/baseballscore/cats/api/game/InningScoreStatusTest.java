package dev.baseballscore.cats.api.game;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import dev.baseballscore.cats.api.common.exception.BadRequestException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class InningScoreStatusTest {

  @Test
  @DisplayName("fromValue accepts the API values case-insensitively and trims whitespace")
  void fromValue_acceptsApiValues() {
    assertEquals(InningScoreStatus.UNREGISTERED, InningScoreStatus.fromValue(" unregistered "));
    assertEquals(InningScoreStatus.DRAFT, InningScoreStatus.fromValue("DRAFT"));
    assertEquals(InningScoreStatus.COMPLETE, InningScoreStatus.fromValue("Complete"));
  }

  @Test
  @DisplayName("fromValue defaults null and blank values to unregistered")
  void fromValue_defaultsMissingValues() {
    assertEquals(InningScoreStatus.UNREGISTERED, InningScoreStatus.fromValue(null));
    assertEquals(InningScoreStatus.UNREGISTERED, InningScoreStatus.fromValue(" "));
  }

  @Test
  @DisplayName("fromValue rejects unknown values")
  void fromValue_rejectsUnknownValues() {
    assertThrows(BadRequestException.class, () -> InningScoreStatus.fromValue("invalid"));
  }
}
