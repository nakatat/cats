package dev.baseballscore.cats.api.common.logging;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.lang.NonNull;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

@ExtendWith(MockitoExtension.class)
class RequestLoggingFilterTest {

  @Mock private FilterChain filterChain;

  private final TestableRequestLoggingFilter requestLoggingFilter =
      new TestableRequestLoggingFilter();

  @Test
  @DisplayName("doFilter calls filter chain for normal API request")
  void doFilter_callsFilterChainForNormalApiRequest() throws Exception {
    var request = new MockHttpServletRequest("GET", "/api/teams/cats");
    request.setRemoteAddr("127.0.0.1");
    var response = new MockHttpServletResponse();

    assertDoesNotThrow(
        () -> this.requestLoggingFilter.doFilter(request, response, this.filterChain));

    verify(this.filterChain).doFilter(request, response);
  }

  @Test
  @DisplayName("doFilter propagates exception from filter chain")
  void doFilter_propagatesExceptionFromFilterChain() throws Exception {
    var request = new MockHttpServletRequest("GET", "/api/teams/cats");
    var response = new MockHttpServletResponse();
    doThrow(new ServletException("boom")).when(this.filterChain).doFilter(request, response);

    assertThrows(
        ServletException.class,
        () -> this.requestLoggingFilter.doFilter(request, response, this.filterChain));

    verify(this.filterChain).doFilter(request, response);
  }

  @Test
  @DisplayName("shouldNotFilter returns true for actuator path")
  void shouldNotFilter_returnsTrueForActuatorPath() throws Exception {
    var request = new MockHttpServletRequest("GET", "/actuator/health");
    var response = new MockHttpServletResponse();

    var shouldNotFilter = this.requestLoggingFilter.shouldSkip(request);

    assertTrue(shouldNotFilter);
    assertDoesNotThrow(
        () -> this.requestLoggingFilter.doFilter(request, response, this.filterChain));
    verify(this.filterChain).doFilter(request, response);
  }

  private static class TestableRequestLoggingFilter extends RequestLoggingFilter {

    boolean shouldSkip(@NonNull HttpServletRequest request) {
      return this.shouldNotFilter(request);
    }
  }
}
