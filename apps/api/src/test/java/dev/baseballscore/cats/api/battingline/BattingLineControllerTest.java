package dev.baseballscore.cats.api.battingline;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import dev.baseballscore.cats.api.battingline.dto.BattingLineResponse;
import dev.baseballscore.cats.api.common.exception.ApiExceptionHandler;
import dev.baseballscore.cats.api.game.GameNotFoundException;
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

@WebMvcTest(controllers = BattingLineController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("webmvc-test")
@Import(ApiExceptionHandler.class)
class BattingLineControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockitoBean private BattingLineService battingLineService;

  @Test
  @DisplayName("GET /api/teams/cats/games/1/batting-lines returns batting lines")
  void getBattingLines_returnsBattingLines() throws Exception {
    given(this.battingLineService.getBattingLinesByTeamSlugAndGameId("cats", 1L))
        .willReturn(
            List.of(
                new BattingLineResponse(
                    1L, 1L, 1L, 1L, "山田 太郎", "7", 1, "遊撃手", false, 4, 4, 2, 1, 0, 0, 1, 1, 0, 0, 1,
                    1, 0, 0, 0, 0),
                new BattingLineResponse(
                    2L, 2L, 1L, null, "助っ人A", null, 9, "右翼手", true, 3, 2, 1, 0, 0, 0, 0, 1, 1, 0, 0,
                    0, 0, 0, 1, 0)));

    this.mockMvc
        .perform(get("/api/teams/cats/games/1/batting-lines").servletPath("/api"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].battingLineId").value(1L))
        .andExpect(jsonPath("$[0].gameParticipantId").value(1L))
        .andExpect(jsonPath("$[0].displayName").value("山田 太郎"))
        .andExpect(jsonPath("$[0].guest").value(false))
        .andExpect(jsonPath("$[0].plateAppearances").value(4))
        .andExpect(jsonPath("$[0].hits").value(2))
        .andExpect(jsonPath("$[0].runsBattedIn").value(1))
        .andExpect(jsonPath("$[0].sacrificeHits").value(0))
        .andExpect(jsonPath("$[0].sacrificeFlies").value(0))
        .andExpect(jsonPath("$[0].stolenBases").value(1))
        .andExpect(jsonPath("$[0].caughtStealing").value(0))
        .andExpect(jsonPath("$[0].reachedOnErrors").value(0))
        .andExpect(jsonPath("$[1].battingLineId").value(2L))
        .andExpect(jsonPath("$[1].displayName").value("助っ人A"))
        .andExpect(jsonPath("$[1].guest").value(true))
        .andExpect(
            result ->
                assertNull(
                    JsonPath.read(result.getResponse().getContentAsString(), "$[1].playerId")));
  }

  @Test
  @DisplayName("GET /api/teams/nope/games/1/batting-lines returns team not found")
  void getBattingLines_returns404WhenTeamMissing() throws Exception {
    given(this.battingLineService.getBattingLinesByTeamSlugAndGameId("nope", 1L))
        .willThrow(new TeamNotFoundException("nope"));

    this.mockMvc
        .perform(get("/api/teams/nope/games/1/batting-lines").servletPath("/api"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error.code").value("TEAM_NOT_FOUND"))
        .andExpect(jsonPath("$.error.message").value("チームが見つかりません。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }

  @Test
  @DisplayName("GET /api/teams/cats/games/9999/batting-lines returns game not found")
  void getBattingLines_returns404WhenGameMissing() throws Exception {
    given(this.battingLineService.getBattingLinesByTeamSlugAndGameId("cats", 9999L))
        .willThrow(new GameNotFoundException("cats", 9999L));

    this.mockMvc
        .perform(get("/api/teams/cats/games/9999/batting-lines").servletPath("/api"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error.code").value("GAME_NOT_FOUND"))
        .andExpect(jsonPath("$.error.message").value("試合が見つかりません。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }
}
