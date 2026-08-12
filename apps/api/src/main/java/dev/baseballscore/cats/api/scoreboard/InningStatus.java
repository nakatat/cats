package dev.baseballscore.cats.api.scoreboard;

import com.fasterxml.jackson.annotation.JsonValue;
import dev.baseballscore.cats.api.common.exception.BadRequestException;
import java.util.Arrays;

/**
 * 1イニングの打撃状態。
 *
 * <p>not_battedは攻撃機会がなく得点が登録されていない状態で、scoreboardの得点はnullになりうる。
 */
public enum InningStatus {
  PLAYED("played"),
  NOT_BATTED("not_batted");

  private final String value;

  InningStatus(String value) {
    this.value = value;
  }

  @JsonValue
  public String value() {
    return this.value;
  }

  /**
   * 保存値またはAPI値をInningStatusへ変換する。
   *
   * <p>null・空白はplayed、既知の値は大文字小文字を区別せず変換し、未知の値は不正値として扱う。
   *
   * @param value status値
   * @return 変換されたイニング状態
   * @throws BadRequestException 未知のstatusが指定された場合
   */
  public static InningStatus fromValue(String value) {
    if (value == null || value.isBlank()) {
      return PLAYED;
    }

    var normalizedValue = value.trim();
    return Arrays.stream(values())
        .filter(status -> status.value.equalsIgnoreCase(normalizedValue))
        .findFirst()
        .orElseThrow(() -> new BadRequestException("Invalid inning status: " + normalizedValue));
  }
}
