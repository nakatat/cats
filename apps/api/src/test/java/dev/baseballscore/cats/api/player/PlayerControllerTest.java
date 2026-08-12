package dev.baseballscore.cats.api.player;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.baseballscore.cats.api.common.exception.ApiExceptionHandler;
import dev.baseballscore.cats.api.player.dto.PlayerResponse;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = PlayerController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("webmvc-test")
@Import(ApiExceptionHandler.class)
class PlayerControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockitoBean private PlayerService playerService;

  @Test
  @DisplayName("GET /api/teams/cats/players returns players")
  void getPlayers_returnsPlayers() throws Exception {
    given(this.playerService.getPlayersByTeamSlug("cats", null))
        .willReturn(
            List.of(
                new PlayerResponse(
                    1L,
                    "山田 太郎",
                    "やまだ たろう",
                    "7",
                    "内野手",
                    "右",
                    "右",
                    LocalDate.of(2020, 4, 1),
                    null,
                    null,
                    null),
                new PlayerResponse(
                    2L,
                    "佐藤 花子",
                    "さとう はなこ",
                    "11",
                    "投手",
                    "右",
                    "左",
                    LocalDate.of(2021, 4, 1),
                    null,
                    null,
                    null)));

    this.mockMvc
        .perform(get("/api/teams/cats/players").servletPath("/api"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].playerId").value(1L))
        .andExpect(jsonPath("$[0].name").value("山田 太郎"))
        .andExpect(jsonPath("$[0].uniformNumber").value("7"))
        .andExpect(jsonPath("$[0].primaryPosition").value("内野手"));

    verify(this.playerService).getPlayersByTeamSlug("cats", null);
  }

  @Test
  @DisplayName("GET /api/teams/cats/players?active=true returns active players")
  void getActivePlayers_returnsActivePlayers() throws Exception {
    given(this.playerService.getPlayersByTeamSlug("cats", true))
        .willReturn(
            List.of(
                new PlayerResponse(
                    1L,
                    "山田 太郎",
                    "やまだ たろう",
                    "7",
                    "内野手",
                    "右",
                    "右",
                    LocalDate.of(2020, 4, 1),
                    null,
                    null,
                    null)));

    this.mockMvc
        .perform(get("/api/teams/cats/players").servletPath("/api").param("active", "true"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].playerId").value(1L))
        .andExpect(jsonPath("$[0].name").value("山田 太郎"));

    verify(this.playerService).getPlayersByTeamSlug("cats", true);
  }

  @Test
  @DisplayName("GET /api/teams/cats/players?active=false returns inactive players")
  void getInactivePlayers_returnsInactivePlayers() throws Exception {
    given(this.playerService.getPlayersByTeamSlug("cats", false))
        .willReturn(
            List.of(
                new PlayerResponse(
                    3L,
                    "鈴木 次郎",
                    "すずき じろう",
                    "18",
                    "外野手",
                    "左",
                    "左",
                    LocalDate.of(2019, 4, 1),
                    LocalDate.of(2024, 3, 31),
                    null,
                    null)));

    this.mockMvc
        .perform(get("/api/teams/cats/players").servletPath("/api").param("active", "false"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].playerId").value(3L))
        .andExpect(jsonPath("$[0].name").value("鈴木 次郎"));

    verify(this.playerService).getPlayersByTeamSlug("cats", false);
  }

  @Test
  @DisplayName("GET /api/teams/cats/players/{playerId} returns player detail")
  void getPlayer_returnsPlayerDetail() throws Exception {
    given(this.playerService.getPlayerByTeamSlugAndPlayerId("cats", 1L))
        .willReturn(
            new PlayerResponse(
                1L,
                "山田 太郎",
                "やまだ たろう",
                "7",
                "内野手",
                "右",
                "右",
                LocalDate.of(2020, 4, 1),
                null,
                null,
                null));

    this.mockMvc
        .perform(get("/api/teams/cats/players/1").servletPath("/api"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.playerId").value(1L))
        .andExpect(jsonPath("$.name").value("山田 太郎"))
        .andExpect(jsonPath("$.uniformNumber").value("7"))
        .andExpect(jsonPath("$.primaryPosition").value("内野手"));

    verify(this.playerService).getPlayerByTeamSlugAndPlayerId("cats", 1L);
  }

  @Test
  @DisplayName("GET /api/teams/cats/players/9999 returns player not found")
  void getPlayer_returns404WhenPlayerMissing() throws Exception {
    given(this.playerService.getPlayerByTeamSlugAndPlayerId("cats", 9999L))
        .willThrow(new PlayerNotFoundException(9999L));

    this.mockMvc
        .perform(
            get("/api/teams/cats/players/9999")
                .servletPath("/api")
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error.code").value("PLAYER_NOT_FOUND"))
        .andExpect(jsonPath("$.error.message").value("選手が見つかりません。"))
        .andExpect(jsonPath("$.error.details").isEmpty());

    verify(this.playerService).getPlayerByTeamSlugAndPlayerId("cats", 9999L);
  }
}
