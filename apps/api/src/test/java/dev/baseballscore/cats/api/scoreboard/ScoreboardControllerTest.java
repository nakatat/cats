package dev.baseballscore.cats.api.scoreboard;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.baseballscore.cats.api.common.exception.ApiExceptionHandler;
import dev.baseballscore.cats.api.game.GameNotFoundException;
import dev.baseballscore.cats.api.game.InningScoreStatus;
import dev.baseballscore.cats.api.scoreboard.dto.ScoreboardInningResponse;
import dev.baseballscore.cats.api.scoreboard.dto.ScoreboardResponse;
import dev.baseballscore.cats.api.scoreboard.dto.ScoreboardRowResponse;
import dev.baseballscore.cats.api.team.TeamNotFoundException;
import java.util.Arrays;
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

@WebMvcTest(controllers = ScoreboardController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("webmvc-test")
@Import(ApiExceptionHandler.class)
class ScoreboardControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockitoBean private ScoreboardService scoreboardService;

  @Test
  @DisplayName("GET /api/teams/cats/games/1/scoreboard returns scoreboard rows")
  void getScoreboard_returnsScoreboardRows() throws Exception {
    given(this.scoreboardService.getScoreboardByTeamSlugAndGameId("cats", 1L))
        .willReturn(
            new ScoreboardResponse(
                InningScoreStatus.COMPLETE,
                List.of(
                    new ScoreboardRowResponse(
                        1L,
                        10L,
                        "新琴似CATS",
                        false,
                        Arrays.asList(
                            new ScoreboardInningResponse(1, 0, InningStatus.PLAYED),
                            new ScoreboardInningResponse(2, 1, InningStatus.PLAYED),
                            new ScoreboardInningResponse(3, 0, InningStatus.PLAYED),
                            new ScoreboardInningResponse(4, null, InningStatus.NOT_BATTED)),
                        1,
                        5,
                        1),
                    new ScoreboardRowResponse(
                        2L,
                        null,
                        "札幌ベアーズ",
                        true,
                        List.of(new ScoreboardInningResponse(1, 0, InningStatus.PLAYED)),
                        2,
                        4,
                        0))));

    this.mockMvc
        .perform(get("/api/teams/cats/games/1/scoreboard").servletPath("/api"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("complete"))
        .andExpect(jsonPath("$.rows[0].scoreLineId").value(1L))
        .andExpect(jsonPath("$.rows[0].teamId").value(10L))
        .andExpect(jsonPath("$.rows[0].teamName").value("新琴似CATS"))
        .andExpect(jsonPath("$.rows[0].opponent").value(false))
        .andExpect(jsonPath("$.rows[0].innings[1].inningNumber").value(2))
        .andExpect(jsonPath("$.rows[0].innings[1].runs").value(1))
        .andExpect(jsonPath("$.rows[0].innings[0].status").value("played"))
        .andExpect(jsonPath("$.rows[0].innings[3].runs").doesNotExist())
        .andExpect(jsonPath("$.rows[0].innings[3].status").value("not_batted"))
        .andExpect(jsonPath("$.rows[0].runs").value(1))
        .andExpect(jsonPath("$.rows[0].hits").value(5))
        .andExpect(jsonPath("$.rows[0].errors").value(1))
        .andExpect(jsonPath("$.rows[1].opponent").value(true))
        .andExpect(jsonPath("$.rows[1].teamId").doesNotExist());
  }

  @Test
  @DisplayName("GET /api/teams/nope/games/1/scoreboard returns team not found")
  void getScoreboard_returns404WhenTeamMissing() throws Exception {
    given(this.scoreboardService.getScoreboardByTeamSlugAndGameId("nope", 1L))
        .willThrow(new TeamNotFoundException("nope"));

    this.mockMvc
        .perform(get("/api/teams/nope/games/1/scoreboard").servletPath("/api"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error.code").value("TEAM_NOT_FOUND"));
  }

  @Test
  @DisplayName("GET /api/teams/cats/games/9999/scoreboard returns game not found")
  void getScoreboard_returns404WhenGameMissing() throws Exception {
    given(this.scoreboardService.getScoreboardByTeamSlugAndGameId("cats", 9999L))
        .willThrow(new GameNotFoundException("cats", 9999L));

    this.mockMvc
        .perform(get("/api/teams/cats/games/9999/scoreboard").servletPath("/api"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error.code").value("GAME_NOT_FOUND"));
  }
}
