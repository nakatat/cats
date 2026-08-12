package dev.baseballscore.cats.api.pitchingline;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import dev.baseballscore.cats.api.common.exception.ApiExceptionHandler;
import dev.baseballscore.cats.api.pitchingline.dto.PitchingLineResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = PitchingLineController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("webmvc-test")
@Import(ApiExceptionHandler.class)
class PitchingLineControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockitoBean private PitchingLineService pitchingLineService;

  @Test
  @DisplayName("GET /api/teams/cats/games/1/pitching-lines returns pitching lines")
  void getPitchingLines_returnsPitchingLines() throws Exception {
    given(this.pitchingLineService.getPitchingLinesByTeamSlugAndGameId("cats", 1L))
        .willReturn(
            java.util.List.of(
                new PitchingLineResponse(
                    1L, 3L, 1L, 3L, "山田 一郎", "18", 1, false, 15, 22, 78, 4, 0, 2, 1, 2, 0, 5, 1, 0,
                    0, 0),
                new PitchingLineResponse(
                    2L, 10L, 1L, null, "助っ人A", null, 2, true, 6, 8, 28, 1, 0, 0, 0, 1, 0, 2, 0, 0,
                    0, 1)));

    this.mockMvc
        .perform(get("/api/teams/cats/games/1/pitching-lines").servletPath("/api"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].pitchingLineId").value(1L))
        .andExpect(jsonPath("$[0].displayName").value("山田 一郎"))
        .andExpect(jsonPath("$[0].outsPitched").value(15))
        .andExpect(jsonPath("$[0].wins").value(1))
        .andExpect(
            result ->
                assertNull(
                    JsonPath.read(result.getResponse().getContentAsString(), "$[1].playerId")))
        .andExpect(jsonPath("$[1].guest").value(true))
        .andExpect(jsonPath("$[1].displayName").value("助っ人A"));

    verify(this.pitchingLineService).getPitchingLinesByTeamSlugAndGameId("cats", 1L);
  }

  @Test
  @DisplayName("GET /api/teams/nope/games/1/pitching-lines returns team not found")
  void getPitchingLines_returns404WhenTeamMissing() throws Exception {
    given(this.pitchingLineService.getPitchingLinesByTeamSlugAndGameId("nope", 1L))
        .willThrow(new dev.baseballscore.cats.api.team.TeamNotFoundException("nope"));

    this.mockMvc
        .perform(get("/api/teams/nope/games/1/pitching-lines").servletPath("/api"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error.code").value("TEAM_NOT_FOUND"))
        .andExpect(jsonPath("$.error.message").value("チームが見つかりません。"));

    verify(this.pitchingLineService).getPitchingLinesByTeamSlugAndGameId("nope", 1L);
  }

  @Test
  @DisplayName("GET /api/teams/cats/games/9999/pitching-lines returns game not found")
  void getPitchingLines_returns404WhenGameMissing() throws Exception {
    given(this.pitchingLineService.getPitchingLinesByTeamSlugAndGameId("cats", 9999L))
        .willThrow(new dev.baseballscore.cats.api.game.GameNotFoundException("cats", 9999L));

    this.mockMvc
        .perform(get("/api/teams/cats/games/9999/pitching-lines").servletPath("/api"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error.code").value("GAME_NOT_FOUND"))
        .andExpect(jsonPath("$.error.message").value("試合が見つかりません。"));

    verify(this.pitchingLineService).getPitchingLinesByTeamSlugAndGameId("cats", 9999L);
  }
}
