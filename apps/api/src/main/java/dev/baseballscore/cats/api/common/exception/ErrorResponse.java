package dev.baseballscore.cats.api.common.exception;

import java.util.List;

public record ErrorResponse(ErrorBody error) {

  public record ErrorBody(String code, String message, List<String> details) {}
}
