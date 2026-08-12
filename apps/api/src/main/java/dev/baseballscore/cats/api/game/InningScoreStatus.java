package dev.baseballscore.cats.api.game;

import com.fasterxml.jackson.annotation.JsonValue;
import dev.baseballscore.cats.api.common.exception.BadRequestException;
import java.util.Arrays;

/** 試合全体のイニングスコア登録状態。未指定は未登録として扱う。 */
public enum InningScoreStatus {
  UNREGISTERED("unregistered"),
  DRAFT("draft"),
  COMPLETE("complete");

  private final String value;

  InningScoreStatus(String value) {
    this.value = value;
  }

  @JsonValue
  public String value() {
    return this.value;
  }

  /**
   * 保存値またはAPI値をInningScoreStatusへ変換する。
   *
   * <p>null・空白はunregistered、既知の値は大文字小文字を区別せず変換し、 未知の値は不正値として扱う。
   *
   * @param value status値
   * @return 変換された登録状態
   * @throws BadRequestException 未知のstatusが指定された場合
   */
  public static InningScoreStatus fromValue(String value) {
    if (value == null || value.isBlank()) {
      return UNREGISTERED;
    }

    var normalizedValue = value.trim();
    return Arrays.stream(values())
        .filter(status -> status.value.equalsIgnoreCase(normalizedValue))
        .findFirst()
        .orElseThrow(
            () -> new BadRequestException("Invalid inning score status: " + normalizedValue));
  }
}
