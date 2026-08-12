package dev.baseballscore.cats.api.common.exception;

public class BadRequestException extends RuntimeException {

  private final String code;
  private final String responseMessage;

  public BadRequestException(String detailMessage) {
    super(detailMessage);
    this.code = "INVALID_QUERY_PARAMETER";
    this.responseMessage = "リクエストパラメータが不正です。";
  }

  public String getCode() {
    return this.code;
  }

  public String getResponseMessage() {
    return this.responseMessage;
  }
}
