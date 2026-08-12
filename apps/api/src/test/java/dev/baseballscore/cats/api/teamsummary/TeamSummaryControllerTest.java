package dev.baseballscore.cats.api.teamsummary;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.baseballscore.cats.api.common.exception.ApiExceptionHandler;
import dev.baseballscore.cats.api.team.SeasonNotFoundException;
import dev.baseballscore.cats.api.team.TeamNotFoundException;
import dev.baseballscore.cats.api.teamsummary.dto.SummaryGameResponse;
import dev.baseballscore.cats.api.teamsummary.dto.SummaryRecordResponse;
import dev.baseballscore.cats.api.teamsummary.dto.SummarySeasonResponse;
import dev.baseballscore.cats.api.teamsummary.dto.SummaryTeamResponse;
import dev.baseballscore.cats.api.teamsummary.dto.TeamSummaryResponse;
import java.time.LocalDate;
import java.time.LocalTime;
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

@WebMvcTest(controllers = TeamSummaryController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("webmvc-test")
@Import(ApiExceptionHandler.class)
class TeamSummaryControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockitoBean private TeamSummaryService teamSummaryService;

  @Test
  @DisplayName("GET /api/teams/cats/summary returns summary")
  void getSummary_returnsSummary() throws Exception {
    given(this.teamSummaryService.getSummaryByTeamSlug("cats", null, 5, 5))
        .willReturn(createSummaryResponse());

    this.mockMvc
        .perform(get("/api/teams/cats/summary").servletPath("/api"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.team.slug").value("cats"))
        .andExpect(jsonPath("$.season.year").value(2024))
        .andExpect(jsonPath("$.record.games").value(10))
        .andExpect(jsonPath("$.record.winningPercentage").value("0.667"))
        .andExpect(jsonPath("$.recentGames[0].gameId").value(10L))
        .andExpect(jsonPath("$.recentGames[0].opponentName").value("札幌ベアーズ"))
        .andExpect(jsonPath("$.upcomingGames[0].venueName").value("未定"));
  }

  @Test
  @DisplayName("GET /api/teams/cats/summary with query params returns summary")
  void getSummary_withQueryParams_returnsSummary() throws Exception {
    given(this.teamSummaryService.getSummaryByTeamSlug("cats", 2024, 3, 2))
        .willReturn(createSummaryResponse());

    this.mockMvc
        .perform(
            get("/api/teams/cats/summary")
                .servletPath("/api")
                .param("seasonYear", "2024")
                .param("recentLimit", "3")
                .param("upcomingLimit", "2"))
        .andExpect(status().isOk());
  }

  @Test
  @DisplayName("GET /api/teams/nope/summary returns team not found")
  void getSummary_returnsTeamNotFound() throws Exception {
    given(this.teamSummaryService.getSummaryByTeamSlug("nope", null, 5, 5))
        .willThrow(new TeamNotFoundException("nope"));

    this.mockMvc
        .perform(get("/api/teams/nope/summary").servletPath("/api"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error.code").value("TEAM_NOT_FOUND"))
        .andExpect(jsonPath("$.error.message").value("チームが見つかりません。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }

  @Test
  @DisplayName("GET /api/teams/cats/summary?seasonYear=2023 returns season not found")
  void getSummary_returnsSeasonNotFound() throws Exception {
    given(this.teamSummaryService.getSummaryByTeamSlug("cats", 2023, 5, 5))
        .willThrow(new SeasonNotFoundException("cats", 2023));

    this.mockMvc
        .perform(get("/api/teams/cats/summary").servletPath("/api").param("seasonYear", "2023"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error.code").value("SEASON_NOT_FOUND"))
        .andExpect(jsonPath("$.error.message").value("年度が見つかりません。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }

  @Test
  @DisplayName("GET /api/teams/cats/summary?recentLimit=0 returns bad request")
  void getSummary_withInvalidRecentLimit_returnsBadRequest() throws Exception {
    this.mockMvc
        .perform(get("/api/teams/cats/summary").servletPath("/api").param("recentLimit", "0"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.error.code").value("INVALID_QUERY_PARAMETER"))
        .andExpect(jsonPath("$.error.message").value("リクエストパラメータが不正です。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }

  @Test
  @DisplayName("GET /api/teams/cats/summary?recentLimit=21 returns bad request")
  void getSummary_withTooLargeRecentLimit_returnsBadRequest() throws Exception {
    this.mockMvc
        .perform(get("/api/teams/cats/summary").servletPath("/api").param("recentLimit", "21"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.error.code").value("INVALID_QUERY_PARAMETER"))
        .andExpect(jsonPath("$.error.message").value("リクエストパラメータが不正です。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }

  @Test
  @DisplayName("GET /api/teams/cats/summary?upcomingLimit=0 returns bad request")
  void getSummary_withInvalidUpcomingLimit_returnsBadRequest() throws Exception {
    this.mockMvc
        .perform(get("/api/teams/cats/summary").servletPath("/api").param("upcomingLimit", "0"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.error.code").value("INVALID_QUERY_PARAMETER"))
        .andExpect(jsonPath("$.error.message").value("リクエストパラメータが不正です。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }

  @Test
  @DisplayName("GET /api/teams/cats/summary?upcomingLimit=21 returns bad request")
  void getSummary_withTooLargeUpcomingLimit_returnsBadRequest() throws Exception {
    this.mockMvc
        .perform(get("/api/teams/cats/summary").servletPath("/api").param("upcomingLimit", "21"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.error.code").value("INVALID_QUERY_PARAMETER"))
        .andExpect(jsonPath("$.error.message").value("リクエストパラメータが不正です。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }

  private static TeamSummaryResponse createSummaryResponse() {
    return new TeamSummaryResponse(
        new SummaryTeamResponse(
            1L,
            "cats",
            "新琴似CATS",
            "CATS",
            "北海道札幌市",
            2005,
            "札幌市を拠点に活動する草野球チームです。",
            "/images/logo.png",
            "/images/main.jpg"),
        new SummarySeasonResponse(
            1L, 2024, "2024年度", LocalDate.of(2024, 4, 1), LocalDate.of(2024, 11, 30), true),
        new SummaryRecordResponse(10, 6, 3, 1, "0.667", 48, 35),
        List.of(
            new SummaryGameResponse(
                10L,
                LocalDate.of(2024, 10, 20),
                LocalTime.of(9, 0),
                "札幌ベアーズ",
                "completed",
                "win",
                5,
                3,
                1L,
                "札幌ベースボールリーグ",
                1L,
                "新琴似グリーン公園",
                null)),
        List.of(
            new SummaryGameResponse(
                11L,
                LocalDate.of(2024, 11, 3),
                LocalTime.of(13, 0),
                "北区スターズ",
                "scheduled",
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                "未定")));
  }
}
