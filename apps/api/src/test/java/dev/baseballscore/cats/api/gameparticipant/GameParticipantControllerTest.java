package dev.baseballscore.cats.api.gameparticipant;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import dev.baseballscore.cats.api.common.exception.ApiExceptionHandler;
import dev.baseballscore.cats.api.game.GameNotFoundException;
import dev.baseballscore.cats.api.gameparticipant.dto.GameParticipantResponse;
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

@WebMvcTest(controllers = GameParticipantController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("webmvc-test")
@Import(ApiExceptionHandler.class)
class GameParticipantControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockitoBean private GameParticipantService gameParticipantService;

  @Test
  @DisplayName("GET /api/teams/cats/games/1/participants returns participants")
  void getParticipants_returnsParticipants() throws Exception {
    given(this.gameParticipantService.getParticipantsByTeamSlugAndGameId("cats", 1L))
        .willReturn(
            List.of(
                new GameParticipantResponse(1L, 1L, 1L, "山田 太郎", "7", 1, "投手", true, false),
                new GameParticipantResponse(2L, 1L, null, "助っ人A", null, 9, "右翼手", true, true)));

    this.mockMvc
        .perform(get("/api/teams/cats/games/1/participants").servletPath("/api"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].gameParticipantId").value(1L))
        .andExpect(jsonPath("$[0].gameId").value(1L))
        .andExpect(jsonPath("$[0].playerId").value(1L))
        .andExpect(jsonPath("$[0].displayName").value("山田 太郎"))
        .andExpect(jsonPath("$[0].uniformNumber").value("7"))
        .andExpect(jsonPath("$[0].battingOrder").value(1))
        .andExpect(jsonPath("$[0].position").value("投手"))
        .andExpect(jsonPath("$[0].starter").value(true))
        .andExpect(jsonPath("$[0].guest").value(false));
  }

  @Test
  @DisplayName("GET /api/teams/cats/games/1/participants returns guest participant")
  void getParticipants_returnsGuestParticipant() throws Exception {
    given(this.gameParticipantService.getParticipantsByTeamSlugAndGameId("cats", 1L))
        .willReturn(
            List.of(new GameParticipantResponse(2L, 1L, null, "助っ人A", null, 9, "右翼手", true, true)));

    this.mockMvc
        .perform(get("/api/teams/cats/games/1/participants").servletPath("/api"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].guest").value(true))
        .andExpect(jsonPath("$[0].displayName").value("助っ人A"))
        .andExpect(
            result ->
                assertNull(
                    JsonPath.read(result.getResponse().getContentAsString(), "$[0].playerId")));
  }

  @Test
  @DisplayName("GET /api/teams/cats/games/9999/participants returns game not found")
  void getParticipants_returns404WhenGameMissing() throws Exception {
    given(this.gameParticipantService.getParticipantsByTeamSlugAndGameId("cats", 9999L))
        .willThrow(new GameNotFoundException("cats", 9999L));

    this.mockMvc
        .perform(get("/api/teams/cats/games/9999/participants").servletPath("/api"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error.code").value("GAME_NOT_FOUND"))
        .andExpect(jsonPath("$.error.message").value("試合が見つかりません。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }

  @Test
  @DisplayName("GET /api/teams/nope/games/1/participants returns team not found")
  void getParticipants_returns404WhenTeamMissing() throws Exception {
    given(this.gameParticipantService.getParticipantsByTeamSlugAndGameId("nope", 1L))
        .willThrow(new TeamNotFoundException("nope"));

    this.mockMvc
        .perform(get("/api/teams/nope/games/1/participants").servletPath("/api"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error.code").value("TEAM_NOT_FOUND"))
        .andExpect(jsonPath("$.error.message").value("チームが見つかりません。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }
}
