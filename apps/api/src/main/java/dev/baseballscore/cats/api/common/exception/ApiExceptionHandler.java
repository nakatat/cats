package dev.baseballscore.cats.api.common.exception;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
public class ApiExceptionHandler {

  private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<ErrorResponse> handleNotFoundException(
      NotFoundException exception, HttpServletRequest request) {
    log.warn(
        "code={} path={} message={}",
        exception.getCode(),
        request.getRequestURI(),
        exception.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(
            new ErrorResponse(
                new ErrorResponse.ErrorBody(
                    exception.getCode(), exception.getResponseMessage(), List.of())));
  }

  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<ErrorResponse> handleBadRequestException(
      BadRequestException exception, HttpServletRequest request) {
    log.warn(
        "code={} path={} message={}",
        exception.getCode(),
        request.getRequestURI(),
        exception.getMessage());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(
            new ErrorResponse(
                new ErrorResponse.ErrorBody(
                    exception.getCode(), exception.getResponseMessage(), List.of())));
  }

  @ExceptionHandler(NoResourceFoundException.class)
  public ResponseEntity<ErrorResponse> handleNoResourceFoundException(
      NoResourceFoundException exception, HttpServletRequest request) {
    log.warn(
        "code=RESOURCE_NOT_FOUND path={} message={}",
        request.getRequestURI(),
        exception.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(
            new ErrorResponse(
                new ErrorResponse.ErrorBody("RESOURCE_NOT_FOUND", "リソースが見つかりません。", List.of())));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleUnexpectedException(
      Exception exception, HttpServletRequest request) {
    log.error(
        "code=INTERNAL_SERVER_ERROR path={} message={}",
        request.getRequestURI(),
        exception.getMessage(),
        exception);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(
            new ErrorResponse(
                new ErrorResponse.ErrorBody(
                    "INTERNAL_SERVER_ERROR", "予期しないエラーが発生しました。", List.of())));
  }
}
