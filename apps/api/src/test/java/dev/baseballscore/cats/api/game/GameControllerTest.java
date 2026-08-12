package dev.baseballscore.cats.api.game;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.baseballscore.cats.api.common.exception.ApiExceptionHandler;
import dev.baseballscore.cats.api.game.dto.GameResponse;
import dev.baseballscore.cats.api.team.TeamNotFoundException;
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

@WebMvcTest(controllers = GameController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("webmvc-test")
@Import(ApiExceptionHandler.class)
class GameControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockitoBean private GameService gameService;

  @Test
  @DisplayName("GET /api/teams/cats/games returns games")
  void getGames_returnsGames() throws Exception {
    given(this.gameService.getGamesByTeamSlug("cats", null, null))
        .willReturn(
            List.of(
                new GameResponse(
                    1L,
                    1L,
                    2024,
                    1L,
                    "札幌ベースボールリーグ",
                    1L,
                    "新琴似グリーン公園",
                    LocalDate.of(2024, 5, 12),
                    LocalTime.of(9, 0),
                    "札幌ベアーズ",
                    "home",
                    "official",
                    "completed",
                    5,
                    3,
                    "win",
                    null,
                    "開幕戦")));

    this.mockMvc
        .perform(get("/api/teams/cats/games").servletPath("/api"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].gameId").value(1L))
        .andExpect(jsonPath("$[0].seasonYear").value(2024))
        .andExpect(jsonPath("$[0].opponentName").value("札幌ベアーズ"))
        .andExpect(jsonPath("$[0].gameDate").value("2024-05-12"))
        .andExpect(jsonPath("$[0].status").value("completed"))
        .andExpect(jsonPath("$[0].result").value("win"))
        .andExpect(jsonPath("$[0].startTime").value("09:00"));

    verify(this.gameService).getGamesByTeamSlug("cats", null, null);
  }

  @Test
  @DisplayName("GET /api/teams/cats/games with query params returns games")
  void getGames_withQueryParams_returnsGames() throws Exception {
    given(this.gameService.getGamesByTeamSlug("cats", 2024, "completed")).willReturn(List.of());

    this.mockMvc
        .perform(
            get("/api/teams/cats/games")
                .servletPath("/api")
                .param("seasonYear", "2024")
                .param("status", "completed"))
        .andExpect(status().isOk());

    verify(this.gameService).getGamesByTeamSlug("cats", 2024, "completed");
  }

  @Test
  @DisplayName("GET /api/teams/cats/games/1 returns game detail")
  void getGame_returnsGameDetail() throws Exception {
    given(this.gameService.getGameByTeamSlugAndGameId("cats", 1L))
        .willReturn(
            new GameResponse(
                1L,
                1L,
                2024,
                1L,
                "札幌ベースボールリーグ",
                1L,
                "新琴似グリーン公園",
                LocalDate.of(2024, 5, 12),
                LocalTime.of(9, 0),
                "札幌ベアーズ",
                "home",
                "official",
                "completed",
                5,
                3,
                "win",
                null,
                "開幕戦"));

    this.mockMvc
        .perform(get("/api/teams/cats/games/1").servletPath("/api"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.gameId").value(1L))
        .andExpect(jsonPath("$.opponentName").value("札幌ベアーズ"))
        .andExpect(jsonPath("$.gameDate").value("2024-05-12"))
        .andExpect(jsonPath("$.runsFor").value(5))
        .andExpect(jsonPath("$.runsAgainst").value(3))
        .andExpect(jsonPath("$.result").value("win"));
  }

  @Test
  @DisplayName("GET /api/teams/cats/games/9999 returns game not found")
  void getGame_returns404WhenGameMissing() throws Exception {
    given(this.gameService.getGameByTeamSlugAndGameId("cats", 9999L))
        .willThrow(new GameNotFoundException(9999L));

    this.mockMvc
        .perform(get("/api/teams/cats/games/9999").servletPath("/api"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error.code").value("GAME_NOT_FOUND"))
        .andExpect(jsonPath("$.error.message").value("試合が見つかりません。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }

  @Test
  @DisplayName("GET /api/teams/nope/games returns team not found")
  void getGames_returns404WhenTeamMissing() throws Exception {
    given(this.gameService.getGamesByTeamSlug("nope", null, null))
        .willThrow(new TeamNotFoundException("nope"));

    this.mockMvc
        .perform(get("/api/teams/nope/games").servletPath("/api"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error.code").value("TEAM_NOT_FOUND"))
        .andExpect(jsonPath("$.error.message").value("チームが見つかりません。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }

  @Test
  @DisplayName("GET /api/teams/cats/games with invalid status returns 400")
  void getGames_withInvalidStatus_returns400() throws Exception {
    this.mockMvc
        .perform(get("/api/teams/cats/games").servletPath("/api").param("status", "unknown"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.error.code").value("INVALID_QUERY_PARAMETER"))
        .andExpect(jsonPath("$.error.message").value("リクエストパラメータが不正です。"))
        .andExpect(jsonPath("$.error.details").isEmpty());

    verifyNoInteractions(this.gameService);
  }
}
