package dev.baseballscore.cats.api.ranking;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.baseballscore.cats.api.common.exception.ApiExceptionHandler;
import dev.baseballscore.cats.api.game.GameStatus;
import dev.baseballscore.cats.api.ranking.dto.RankingGroupResponse;
import dev.baseballscore.cats.api.ranking.dto.RankingLeaderResponse;
import dev.baseballscore.cats.api.ranking.dto.RankingResponse;
import java.math.BigDecimal;
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

@WebMvcTest(controllers = RankingController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("webmvc-test")
@Import(ApiExceptionHandler.class)
class RankingControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockitoBean private RankingService rankingService;

  @Test
  @DisplayName("GET /api/teams/cats/rankings returns ranking groups")
  void getRankings_returnsRankingGroups() throws Exception {
    given(
            this.rankingService.getRankingsByTeamSlug(
                "cats", null, null, GameStatus.COMPLETED, null, null, null, 5))
        .willReturn(
            new RankingResponse(
                List.of(
                    new RankingGroupResponse(
                        "battingAverage",
                        "打率",
                        List.of(
                            new RankingLeaderResponse(
                                1,
                                1L,
                                "山田 太郎",
                                null,
                                7,
                                false,
                                "0.400",
                                new BigDecimal("0.400"),
                                true)))),
                List.of(
                    new RankingGroupResponse(
                        "earnedRunAverage",
                        "防御率",
                        List.of(
                            new RankingLeaderResponse(
                                1,
                                3L,
                                "佐藤 一郎",
                                null,
                                18,
                                false,
                                "1.750",
                                new BigDecimal("1.750"),
                                null)))),
                9,
                9,
                "3回"));

    this.mockMvc
        .perform(get("/api/teams/cats/rankings").servletPath("/api"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.batting[0].category").value("battingAverage"))
        .andExpect(jsonPath("$.batting[0].leaders[0].rank").value(1))
        .andExpect(jsonPath("$.batting[0].leaders[0].displayName").value("山田 太郎"))
        .andExpect(jsonPath("$.batting[0].leaders[0].qualified").value(true))
        .andExpect(jsonPath("$.pitching[0].category").value("earnedRunAverage"))
        .andExpect(jsonPath("$.pitching[0].leaders[0].value").value("1.750"))
        .andExpect(jsonPath("$.requiredPlateAppearances").value(9))
        .andExpect(jsonPath("$.requiredInningsPitchedOuts").value(9))
        .andExpect(jsonPath("$.requiredInningsPitchedText").value("3回"));

    verify(this.rankingService)
        .getRankingsByTeamSlug("cats", null, null, GameStatus.COMPLETED, null, null, null, 5);
  }

  @Test
  @DisplayName(
      "GET /api/teams/cats/rankings?category=battingAverage&qualifiedOnly=false returns batting ranking only")
  void getRankings_withCategory_returnsSingleBattingGroup() throws Exception {
    given(
            this.rankingService.getRankingsByTeamSlug(
                "cats",
                2024,
                1L,
                GameStatus.COMPLETED,
                true,
                false,
                RankingCategory.BATTING_AVERAGE,
                3))
        .willReturn(
            new RankingResponse(
                List.of(
                    new RankingGroupResponse(
                        "battingAverage",
                        "打率",
                        List.of(
                            new RankingLeaderResponse(
                                1,
                                2L,
                                "佐藤 一郎",
                                null,
                                18,
                                false,
                                "0.400",
                                new BigDecimal("0.400"),
                                false)))),
                List.of()));

    this.mockMvc
        .perform(
            get("/api/teams/cats/rankings")
                .servletPath("/api")
                .param("seasonYear", "2024")
                .param("tournamentId", "1")
                .param("includeGuests", "true")
                .param("qualifiedOnly", "false")
                .param("limit", "3")
                .param("category", "battingAverage"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.batting[0].category").value("battingAverage"))
        .andExpect(jsonPath("$.batting[0].leaders[0].qualified").value(false))
        .andExpect(jsonPath("$.pitching").isEmpty());

    verify(this.rankingService)
        .getRankingsByTeamSlug(
            "cats",
            2024,
            1L,
            GameStatus.COMPLETED,
            true,
            false,
            RankingCategory.BATTING_AVERAGE,
            3);
  }

  @Test
  @DisplayName("GET /api/teams/cats/rankings?category=unknown returns bad request")
  void getRankings_withInvalidCategory_returnsBadRequest() throws Exception {
    this.mockMvc
        .perform(get("/api/teams/cats/rankings").servletPath("/api").param("category", "unknown"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.error.code").value("INVALID_QUERY_PARAMETER"))
        .andExpect(jsonPath("$.error.message").value("リクエストパラメータが不正です。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }

  @Test
  @DisplayName("GET /api/teams/cats/rankings?status=unknown returns bad request")
  void getRankings_withInvalidStatus_returnsBadRequest() throws Exception {
    this.mockMvc
        .perform(get("/api/teams/cats/rankings").servletPath("/api").param("status", "unknown"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.error.code").value("INVALID_QUERY_PARAMETER"))
        .andExpect(jsonPath("$.error.message").value("リクエストパラメータが不正です。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }

  @Test
  @DisplayName("GET /api/teams/cats/rankings?limit=0 returns bad request")
  void getRankings_withInvalidLimit_returnsBadRequest() throws Exception {
    this.mockMvc
        .perform(get("/api/teams/cats/rankings").servletPath("/api").param("limit", "0"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.error.code").value("INVALID_QUERY_PARAMETER"))
        .andExpect(jsonPath("$.error.message").value("リクエストパラメータが不正です。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }

  @Test
  @DisplayName("GET /api/teams/cats/rankings?limit=21 returns bad request")
  void getRankings_withLimitOverMaximum_returnsBadRequest() throws Exception {
    this.mockMvc
        .perform(get("/api/teams/cats/rankings").servletPath("/api").param("limit", "21"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.error.code").value("INVALID_QUERY_PARAMETER"))
        .andExpect(jsonPath("$.error.message").value("リクエストパラメータが不正です。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }

  @Test
  @DisplayName("GET /api/teams/nope/rankings returns team not found")
  void getRankings_returns404WhenTeamMissing() throws Exception {
    given(
            this.rankingService.getRankingsByTeamSlug(
                "nope", null, null, GameStatus.COMPLETED, null, null, null, 5))
        .willThrow(new dev.baseballscore.cats.api.team.TeamNotFoundException("nope"));

    this.mockMvc
        .perform(get("/api/teams/nope/rankings").servletPath("/api"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error.code").value("TEAM_NOT_FOUND"))
        .andExpect(jsonPath("$.error.message").value("チームが見つかりません。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }
}
