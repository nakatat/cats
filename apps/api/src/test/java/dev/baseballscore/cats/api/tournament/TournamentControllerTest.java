package dev.baseballscore.cats.api.tournament;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.baseballscore.cats.api.common.exception.ApiExceptionHandler;
import dev.baseballscore.cats.api.tournament.dto.TournamentResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = TournamentController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("webmvc-test")
@Import(ApiExceptionHandler.class)
class TournamentControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockitoBean private TournamentService tournamentService;

  @Test
  @DisplayName("GET /api/teams/cats/tournaments returns tournaments")
  void getTournaments_returnsTournaments() throws Exception {
    given(this.tournamentService.getTournamentsByTeamSlug("cats"))
        .willReturn(
            java.util.List.of(
                new TournamentResponse(1L, "札幌ベースボールリーグ", "SBL", 2024, "札幌市内の草野球リーグです。", 1)));

    this.mockMvc
        .perform(get("/api/teams/cats/tournaments").servletPath("/api"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].tournamentId").value(1L))
        .andExpect(jsonPath("$[0].name").value("札幌ベースボールリーグ"))
        .andExpect(jsonPath("$[0].shortName").value("SBL"))
        .andExpect(jsonPath("$[0].seasonYear").value(2024))
        .andExpect(jsonPath("$[0].displayOrder").value(1));
  }

  @Test
  @DisplayName("GET /api/teams/cats/tournaments/1 returns tournament detail")
  void getTournament_returnsTournamentDetail() throws Exception {
    given(this.tournamentService.getTournamentByTeamSlugAndTournamentId("cats", 1L))
        .willReturn(new TournamentResponse(1L, "札幌ベースボールリーグ", "SBL", 2024, "札幌市内の草野球リーグです。", 1));

    this.mockMvc
        .perform(get("/api/teams/cats/tournaments/1").servletPath("/api"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.tournamentId").value(1L))
        .andExpect(jsonPath("$.name").value("札幌ベースボールリーグ"))
        .andExpect(jsonPath("$.shortName").value("SBL"))
        .andExpect(jsonPath("$.seasonYear").value(2024))
        .andExpect(jsonPath("$.displayOrder").value(1));
  }

  @Test
  @DisplayName("GET /api/teams/cats/tournaments/9999 returns tournament not found")
  void getTournament_returns404WhenTournamentMissing() throws Exception {
    given(this.tournamentService.getTournamentByTeamSlugAndTournamentId("cats", 9999L))
        .willThrow(new TournamentNotFoundException(9999L));

    this.mockMvc
        .perform(get("/api/teams/cats/tournaments/9999").servletPath("/api"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error.code").value("TOURNAMENT_NOT_FOUND"))
        .andExpect(jsonPath("$.error.message").value("大会が見つかりません。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }
}
