package dev.baseballscore.cats.api.stats.pitching;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import dev.baseballscore.cats.api.common.exception.ApiExceptionHandler;
import dev.baseballscore.cats.api.game.GameStatus;
import dev.baseballscore.cats.api.stats.pitching.dto.PitchingStatsResponse;
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

@WebMvcTest(controllers = PitchingStatsController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("webmvc-test")
@Import(ApiExceptionHandler.class)
class PitchingStatsControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockitoBean private PitchingStatsService pitchingStatsService;

  @Test
  @DisplayName("GET /api/teams/cats/stats/pitching returns pitching stats")
  void getPitchingStats_returnsPitchingStats() throws Exception {
    given(
            this.pitchingStatsService.getPitchingStatsByTeamSlug(
                "cats",
                null,
                null,
                GameStatus.COMPLETED,
                null,
                PitchingStatsSort.EARNED_RUN_AVERAGE))
        .willReturn(
            List.of(
                new PitchingStatsResponse(
                    3L, "佐藤 一郎", null, "18", false, 4, 48, 72, 260, 14, 1, 8, 5, 6, 1, 20, 2, 1, 0,
                    1, "16回", "2.188", "1.250", "8.750")));

    this.mockMvc
        .perform(get("/api/teams/cats/stats/pitching").servletPath("/api"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].playerId").value(3L))
        .andExpect(jsonPath("$[0].displayName").value("佐藤 一郎"))
        .andExpect(jsonPath("$[0].uniformNumber").value("18"))
        .andExpect(jsonPath("$[0].guest").value(false))
        .andExpect(jsonPath("$[0].games").value(4))
        .andExpect(jsonPath("$[0].outsPitched").value(48))
        .andExpect(jsonPath("$[0].battersFaced").value(72))
        .andExpect(jsonPath("$[0].pitches").value(260))
        .andExpect(jsonPath("$[0].hitsAllowed").value(14))
        .andExpect(jsonPath("$[0].homeRunsAllowed").value(1))
        .andExpect(jsonPath("$[0].runsAllowed").value(8))
        .andExpect(jsonPath("$[0].earnedRuns").value(5))
        .andExpect(jsonPath("$[0].walks").value(6))
        .andExpect(jsonPath("$[0].hitBatters").value(1))
        .andExpect(jsonPath("$[0].strikeouts").value(20))
        .andExpect(jsonPath("$[0].wins").value(2))
        .andExpect(jsonPath("$[0].losses").value(1))
        .andExpect(jsonPath("$[0].saves").value(0))
        .andExpect(jsonPath("$[0].holds").value(1))
        .andExpect(jsonPath("$[0].inningsPitchedText").value("16回"))
        .andExpect(jsonPath("$[0].earnedRunAverage").value("2.188"))
        .andExpect(jsonPath("$[0].walksAndHitsPerInningPitched").value("1.250"))
        .andExpect(jsonPath("$[0].strikeoutsPerSevenInnings").value("8.750"));

    verify(this.pitchingStatsService)
        .getPitchingStatsByTeamSlug(
            "cats", null, null, GameStatus.COMPLETED, null, PitchingStatsSort.EARNED_RUN_AVERAGE);
  }

  @Test
  @DisplayName("GET /api/teams/cats/stats/pitching with filters returns pitching stats")
  void getPitchingStats_withFilters_returnsPitchingStats() throws Exception {
    given(
            this.pitchingStatsService.getPitchingStatsByTeamSlug(
                "cats", 2024, 1L, GameStatus.COMPLETED, true, PitchingStatsSort.STRIKEOUTS))
        .willReturn(
            List.of(
                new PitchingStatsResponse(
                    null, "助っ人A", null, null, true, 2, 12, 20, 60, 3, 0, 2, 2, 1, 0, 4, 1, 0, 2, 0,
                    "4回", "3.500", "1.000", "7.000")));

    this.mockMvc
        .perform(
            get("/api/teams/cats/stats/pitching")
                .servletPath("/api")
                .param("seasonYear", "2024")
                .param("tournamentId", "1")
                .param("status", "completed")
                .param("includeGuests", "true")
                .param("sort", "strikeouts"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].guest").value(true))
        .andExpect(jsonPath("$[0].displayName").value("助っ人A"))
        .andExpect(jsonPath("$[0].earnedRunAverage").value("3.500"))
        .andExpect(jsonPath("$[0].walksAndHitsPerInningPitched").value("1.000"))
        .andExpect(jsonPath("$[0].strikeoutsPerSevenInnings").value("7.000"))
        .andExpect(
            result ->
                assertNull(
                    JsonPath.read(result.getResponse().getContentAsString(), "$[0].playerId")));

    verify(this.pitchingStatsService)
        .getPitchingStatsByTeamSlug(
            "cats", 2024, 1L, GameStatus.COMPLETED, true, PitchingStatsSort.STRIKEOUTS);
  }

  @Test
  @DisplayName("GET /api/teams/nope/stats/pitching returns team not found")
  void getPitchingStats_returns404WhenTeamMissing() throws Exception {
    given(
            this.pitchingStatsService.getPitchingStatsByTeamSlug(
                "nope",
                null,
                null,
                GameStatus.COMPLETED,
                null,
                PitchingStatsSort.EARNED_RUN_AVERAGE))
        .willThrow(new TeamNotFoundException("nope"));

    this.mockMvc
        .perform(get("/api/teams/nope/stats/pitching").servletPath("/api"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error.code").value("TEAM_NOT_FOUND"))
        .andExpect(jsonPath("$.error.message").value("チームが見つかりません。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }

  @Test
  @DisplayName("GET /api/teams/cats/stats/pitching with invalid status returns 400")
  void getPitchingStats_withInvalidStatus_returns400() throws Exception {
    this.mockMvc
        .perform(get("/api/teams/cats/stats/pitching").servletPath("/api").param("status", "done"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.error.code").value("INVALID_QUERY_PARAMETER"))
        .andExpect(jsonPath("$.error.message").value("リクエストパラメータが不正です。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }

  @Test
  @DisplayName("GET /api/teams/cats/stats/pitching with invalid sort returns 400")
  void getPitchingStats_withInvalidSort_returns400() throws Exception {
    this.mockMvc
        .perform(get("/api/teams/cats/stats/pitching").servletPath("/api").param("sort", "unknown"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.error.code").value("INVALID_QUERY_PARAMETER"))
        .andExpect(jsonPath("$.error.message").value("リクエストパラメータが不正です。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }
}
