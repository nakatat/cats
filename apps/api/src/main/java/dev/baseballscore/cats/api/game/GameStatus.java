package dev.baseballscore.cats.api.game;

import dev.baseballscore.cats.api.common.exception.BadRequestException;
import java.util.Arrays;

/** 試合の進行状態。API queryでは空値をcompletedとして扱う。 */
public enum GameStatus {
  SCHEDULED("scheduled"),
  COMPLETED("completed"),
  CANCELLED("cancelled"),
  POSTPONED("postponed");

  private final String value;

  GameStatus(String value) {
    this.value = value;
  }

  public String value() {
    return this.value;
  }

  /**
   * API queryの文字列をGameStatusへ変換する。
   *
   * <p>null・空白はcompleted、既知の値は大文字小文字を区別せず変換し、 未知の値は不正なqueryとして扱う。
   *
   * @param value API queryのstatus値
   * @return 変換されたstatus
   * @throws BadRequestException 未知のstatusが指定された場合
   */
  public static GameStatus fromValue(String value) {
    if (value == null || value.isBlank()) {
      return COMPLETED;
    }

    var normalizedValue = value.trim();
    return Arrays.stream(values())
        .filter(gameStatus -> gameStatus.value.equalsIgnoreCase(normalizedValue))
        .findFirst()
        .orElseThrow(() -> new BadRequestException("Invalid game status: " + normalizedValue));
  }
}
