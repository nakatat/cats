package dev.baseballscore.cats.api.common.exception;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.baseballscore.cats.api.player.PlayerNotFoundException;
import dev.baseballscore.cats.api.team.SeasonNotFoundException;
import dev.baseballscore.cats.api.team.TeamNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@WebMvcTest(controllers = ApiExceptionHandlerTest.TestController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("webmvc-test")
@Import({ApiExceptionHandlerTest.TestController.class, ApiExceptionHandler.class})
class ApiExceptionHandlerTest {

  @Autowired private MockMvc mockMvc;

  @Test
  @DisplayName("TeamNotFoundException becomes 404")
  void teamNotFoundException_returns404() throws Exception {
    this.mockMvc
        .perform(
            get("/api/test/not-found/team").servletPath("/api").accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error.code").value("TEAM_NOT_FOUND"))
        .andExpect(jsonPath("$.error.message").value("チームが見つかりません。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }

  @Test
  @DisplayName("PlayerNotFoundException becomes 404")
  void playerNotFoundException_returns404() throws Exception {
    this.mockMvc
        .perform(
            get("/api/test/not-found/player")
                .servletPath("/api")
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error.code").value("PLAYER_NOT_FOUND"))
        .andExpect(jsonPath("$.error.message").value("選手が見つかりません。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }

  @Test
  @DisplayName("SeasonNotFoundException becomes 404")
  void seasonNotFoundException_returns404() throws Exception {
    this.mockMvc
        .perform(
            get("/api/test/not-found/season")
                .servletPath("/api")
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error.code").value("SEASON_NOT_FOUND"))
        .andExpect(jsonPath("$.error.message").value("年度が見つかりません。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }

  @Test
  @DisplayName("Unexpected exception becomes 500")
  void unexpectedException_returns500() throws Exception {
    this.mockMvc
        .perform(get("/api/test/error").servletPath("/api").accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isInternalServerError())
        .andExpect(jsonPath("$.error.code").value("INTERNAL_SERVER_ERROR"))
        .andExpect(jsonPath("$.error.message").value("予期しないエラーが発生しました。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }

  @Test
  @DisplayName("BadRequestException becomes 400")
  void badRequestException_returns400() throws Exception {
    this.mockMvc
        .perform(
            get("/api/test/bad-request").servletPath("/api").accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.error.code").value("INVALID_QUERY_PARAMETER"))
        .andExpect(jsonPath("$.error.message").value("リクエストパラメータが不正です。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }

  @Test
  @DisplayName("NoResourceFoundException becomes 404")
  void noResourceFoundException_returns404() throws Exception {
    this.mockMvc
        .perform(
            get("/api/test/no-resource").servletPath("/api").accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error.code").value("RESOURCE_NOT_FOUND"))
        .andExpect(jsonPath("$.error.message").value("リソースが見つかりません。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }

  @RestController
  public static class TestController {

    @GetMapping("/test/not-found/team")
    void throwTeamNotFound() {
      throw new TeamNotFoundException("cats");
    }

    @GetMapping("/test/not-found/player")
    void throwPlayerNotFound() {
      throw new PlayerNotFoundException(9999L);
    }

    @GetMapping("/test/not-found/season")
    void throwSeasonNotFound() {
      throw new SeasonNotFoundException("cats", 2024);
    }

    @GetMapping("/test/error")
    void throwUnexpected() {
      throw new RuntimeException("unexpected");
    }

    @GetMapping("/test/bad-request")
    void throwBadRequest() {
      throw new BadRequestException("Invalid query parameter: status=done");
    }

    @GetMapping("/test/no-resource")
    void throwNoResourceFound() throws NoResourceFoundException {
      throw new NoResourceFoundException(HttpMethod.GET, "/api/test/no-resource");
    }
  }
}
