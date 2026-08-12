package dev.baseballscore.cats.api.common.exception;

public class NotFoundException extends RuntimeException {

  private final String code;
  private final String responseMessage;

  public NotFoundException(String code, String responseMessage, String detailMessage) {
    super(detailMessage);
    this.code = code;
    this.responseMessage = responseMessage;
  }

  public String getCode() {
    return code;
  }

  public String getResponseMessage() {
    return responseMessage;
  }
}
