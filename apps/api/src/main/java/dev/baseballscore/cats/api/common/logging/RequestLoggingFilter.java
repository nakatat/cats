package dev.baseballscore.cats.api.common.logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestLoggingFilter extends OncePerRequestFilter {

  private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);
  private static final List<String> EXCLUDED_PATH_PREFIXES = List.of("/actuator");

  @Override
  protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
    String requestUri = request.getRequestURI();
    return EXCLUDED_PATH_PREFIXES.stream().anyMatch(requestUri::startsWith);
  }

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain)
      throws ServletException, IOException {
    long startNanos = System.nanoTime();
    try {
      filterChain.doFilter(request, response);
    } finally {
      long durationMs = (System.nanoTime() - startNanos) / 1_000_000;
      log.info(
          "method={} uri={} status={} durationMs={} clientIp={}",
          request.getMethod(),
          request.getRequestURI(),
          response.getStatus(),
          durationMs,
          resolveClientIp(request));
    }
  }

  private String resolveClientIp(@NonNull HttpServletRequest request) {
    String forwardedFor = request.getHeader("X-Forwarded-For");
    if (forwardedFor != null && !forwardedFor.isBlank()) {
      return forwardedFor.split(",")[0].trim();
    }

    String realIp = request.getHeader("X-Real-IP");
    if (realIp != null && !realIp.isBlank()) {
      return realIp.trim();
    }

    return request.getRemoteAddr();
  }
}
