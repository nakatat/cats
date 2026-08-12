package dev.baseballscore.cats.api.stats.batting;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import dev.baseballscore.cats.api.common.exception.ApiExceptionHandler;
import dev.baseballscore.cats.api.game.GameStatus;
import dev.baseballscore.cats.api.stats.batting.dto.BattingStatsResponse;
import dev.baseballscore.cats.api.team.TeamNotFoundException;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = BattingStatsController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("webmvc-test")
@Import(ApiExceptionHandler.class)
class BattingStatsControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockitoBean private BattingStatsService battingStatsService;

  @Test
  @DisplayName("GET /api/teams/cats/stats/batting returns batting stats")
  void getBattingStats_returnsBattingStats() throws Exception {
    given(
            this.battingStatsService.getBattingStatsByTeamSlug(
                "cats", null, null, GameStatus.COMPLETED, null, BattingStatsSort.BATTING_AVERAGE))
        .willReturn(
            List.of(
                new BattingStatsResponse(
                    1L, "山田 太郎", null, "7", false, 5, 18, 15, 6, 2, 0, 1, 5, 4, 2, 1, 3, 0, 0, 2, 1,
                    1, "0.400", "0.500", "0.733", "1.233")));

    this.mockMvc
        .perform(get("/api/teams/cats/stats/batting").servletPath("/api"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].playerId").value(1L))
        .andExpect(jsonPath("$[0].displayName").value("山田 太郎"))
        .andExpect(jsonPath("$[0].guest").value(false))
        .andExpect(jsonPath("$[0].games").value(5))
        .andExpect(jsonPath("$[0].plateAppearances").value(18))
        .andExpect(jsonPath("$[0].atBats").value(15))
        .andExpect(jsonPath("$[0].hits").value(6))
        .andExpect(jsonPath("$[0].doubles").value(2))
        .andExpect(jsonPath("$[0].triples").value(0))
        .andExpect(jsonPath("$[0].homeRuns").value(1))
        .andExpect(jsonPath("$[0].runsBattedIn").value(5))
        .andExpect(jsonPath("$[0].runs").value(4))
        .andExpect(jsonPath("$[0].walks").value(2))
        .andExpect(jsonPath("$[0].hitByPitch").value(1))
        .andExpect(jsonPath("$[0].strikeouts").value(3))
        .andExpect(jsonPath("$[0].sacrificeHits").value(0))
        .andExpect(jsonPath("$[0].sacrificeFlies").value(0))
        .andExpect(jsonPath("$[0].stolenBases").value(2))
        .andExpect(jsonPath("$[0].caughtStealing").value(1))
        .andExpect(jsonPath("$[0].reachedOnErrors").value(1))
        .andExpect(jsonPath("$[0].battingAverage").value("0.400"))
        .andExpect(jsonPath("$[0].onBasePercentage").value("0.500"))
        .andExpect(jsonPath("$[0].sluggingPercentage").value("0.733"))
        .andExpect(jsonPath("$[0].ops").value("1.233"));
  }

  @Test
  @DisplayName("GET /api/teams/cats/stats/batting with filters returns batting stats")
  void getBattingStats_withFilters_returnsBattingStats() throws Exception {
    given(
            this.battingStatsService.getBattingStatsByTeamSlug(
                "cats", 2024, 1L, GameStatus.COMPLETED, true, BattingStatsSort.HITS))
        .willReturn(
            List.of(
                new BattingStatsResponse(
                    null, "助っ人A", null, null, true, 1, 3, 2, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0,
                    0, "0.500", "0.500", "0.500", "1.000")));

    this.mockMvc
        .perform(
            get("/api/teams/cats/stats/batting")
                .servletPath("/api")
                .param("seasonYear", "2024")
                .param("tournamentId", "1")
                .param("status", "completed")
                .param("includeGuests", "true")
                .param("sort", "hits"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].guest").value(true))
        .andExpect(jsonPath("$[0].displayName").value("助っ人A"))
        .andExpect(jsonPath("$[0].battingAverage").value("0.500"))
        .andExpect(jsonPath("$[0].ops").value("1.000"))
        .andExpect(
            result ->
                assertNull(
                    JsonPath.read(result.getResponse().getContentAsString(), "$[0].playerId")));
  }

  @Test
  @DisplayName("GET /api/teams/nope/stats/batting returns team not found")
  void getBattingStats_returns404WhenTeamMissing() throws Exception {
    given(
            this.battingStatsService.getBattingStatsByTeamSlug(
                "nope", null, null, GameStatus.COMPLETED, null, BattingStatsSort.BATTING_AVERAGE))
        .willThrow(new TeamNotFoundException("nope"));

    this.mockMvc
        .perform(get("/api/teams/nope/stats/batting").servletPath("/api"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error.code").value("TEAM_NOT_FOUND"))
        .andExpect(jsonPath("$.error.message").value("チームが見つかりません。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }

  @Test
  @DisplayName("GET /api/teams/cats/stats/batting with invalid status returns 400")
  void getBattingStats_withInvalidStatus_returns400() throws Exception {
    this.mockMvc
        .perform(get("/api/teams/cats/stats/batting").servletPath("/api").param("status", "done"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.error.code").value("INVALID_QUERY_PARAMETER"))
        .andExpect(jsonPath("$.error.message").value("リクエストパラメータが不正です。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }

  @Test
  @DisplayName("GET /api/teams/cats/stats/batting with invalid sort returns 400")
  void getBattingStats_withInvalidSort_returns400() throws Exception {
    this.mockMvc
        .perform(get("/api/teams/cats/stats/batting").servletPath("/api").param("sort", "unknown"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.error.code").value("INVALID_QUERY_PARAMETER"))
        .andExpect(jsonPath("$.error.message").value("リクエストパラメータが不正です。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }
}
